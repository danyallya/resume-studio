export const RESUME_SECTIONS = [
  { id: 'profile', name: 'Profile' },
  { id: 'experience', name: 'Experience' },
  { id: 'education', name: 'Education' },
  { id: 'selectedWork', name: 'Selected work' },
  { id: 'skills', name: 'Skills' },
] as const;

export type ResumeSectionId = (typeof RESUME_SECTIONS)[number]['id'];

export type ResumeExperience = {
  id: string;
  role: string;
  organization: string;
  startYear: number;
  endYear: number | null;
  current: boolean;
  achievements: string[];
};

export type ResumeEducation = {
  id: string;
  credential: string;
  institution: string;
  startYear: number;
  endYear: number;
};

export type ResumeProject = {
  id: string;
  title: string;
  description: string;
  url?: string;
};

export type ResumeProfile = {
  id: string;
  fullName: string;
  headline: string;
  location: string;
  email: string;
  website?: string;
  summary: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  selectedWork: ResumeProject[];
  skills: string[];
};

export type ResumeValidationIssue = {
  sectionId: ResumeSectionId;
  fieldPath: string;
  code: 'required' | 'format' | 'range' | 'duplicate';
  message: string;
};

export type ResumeValidation = {
  issuesBySection: Record<ResumeSectionId, ResumeValidationIssue[]>;
  completedSections: number;
  totalSections: number;
  completionPercent: number;
};

const isBlank = (value: string) => value.trim().length === 0;
const isValidYear = (year: number) => Number.isInteger(year) && year >= 1900 && year <= 2200;

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function validateResumeProfile(profile: ResumeProfile): ResumeValidation {
  const issuesBySection: ResumeValidation['issuesBySection'] = {
    profile: [],
    experience: [],
    education: [],
    selectedWork: [],
    skills: [],
  };
  const addIssue = (
    sectionId: ResumeSectionId,
    fieldPath: string,
    code: ResumeValidationIssue['code'],
    message: string,
  ) => issuesBySection[sectionId].push({ sectionId, fieldPath, code, message });

  if (isBlank(profile.fullName)) addIssue('profile', 'fullName', 'required', 'Add your name.');
  if (isBlank(profile.headline)) addIssue('profile', 'headline', 'required', 'Add a target role or professional headline.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) {
    addIssue('profile', 'email', 'format', 'Enter a valid email address.');
  }
  if (isBlank(profile.summary)) addIssue('profile', 'summary', 'required', 'Add a short professional summary.');
  if (profile.website && !isHttpUrl(profile.website)) {
    addIssue('profile', 'website', 'format', 'Use a complete http or https portfolio URL.');
  }

  if (profile.experience.length === 0) {
    addIssue('experience', 'experience', 'required', 'Add at least one role.');
  }
  profile.experience.forEach((role, index) => {
    const prefix = `experience.${index}`;
    if (isBlank(role.role)) addIssue('experience', `${prefix}.role`, 'required', 'Add a role title.');
    if (isBlank(role.organization)) addIssue('experience', `${prefix}.organization`, 'required', 'Add an organization.');
    if (!isValidYear(role.startYear)) addIssue('experience', `${prefix}.startYear`, 'range', 'Enter a start year from 1900 to 2200.');
    if (role.current && role.endYear !== null) addIssue('experience', `${prefix}.endYear`, 'range', 'Current roles must not have an end year.');
    if (!role.current && (role.endYear === null || !isValidYear(role.endYear) || role.endYear < role.startYear)) {
      addIssue('experience', `${prefix}.endYear`, 'range', 'Enter an end year no earlier than the start year.');
    }
    if (role.achievements.length === 0 || role.achievements.every(isBlank)) {
      addIssue('experience', `${prefix}.achievements`, 'required', 'Add at least one achievement.');
    }
  });

  if (profile.education.length === 0) {
    addIssue('education', 'education', 'required', 'Add at least one education entry.');
  }
  profile.education.forEach((education, index) => {
    const prefix = `education.${index}`;
    if (isBlank(education.credential)) addIssue('education', `${prefix}.credential`, 'required', 'Add a credential or field of study.');
    if (isBlank(education.institution)) addIssue('education', `${prefix}.institution`, 'required', 'Add an institution.');
    if (!isValidYear(education.startYear) || !isValidYear(education.endYear) || education.endYear < education.startYear) {
      addIssue('education', `${prefix}.years`, 'range', 'Enter valid education years in chronological order.');
    }
  });

  if (profile.selectedWork.length === 0) {
    addIssue('selectedWork', 'selectedWork', 'required', 'Add at least one portfolio project.');
  }
  profile.selectedWork.forEach((project, index) => {
    const prefix = `selectedWork.${index}`;
    if (isBlank(project.title)) addIssue('selectedWork', `${prefix}.title`, 'required', 'Add a project title.');
    if (isBlank(project.description)) addIssue('selectedWork', `${prefix}.description`, 'required', 'Add a short project description.');
    if (project.url && !isHttpUrl(project.url)) addIssue('selectedWork', `${prefix}.url`, 'format', 'Use a complete http or https project URL.');
  });

  if (profile.skills.length < 3) addIssue('skills', 'skills', 'required', 'Add at least three skills.');
  const normalizedSkills = profile.skills.map(skill => skill.trim().toLowerCase());
  if (new Set(normalizedSkills).size !== normalizedSkills.length) {
    addIssue('skills', 'skills', 'duplicate', 'Remove duplicate skills.');
  }
  if (profile.skills.some(isBlank)) addIssue('skills', 'skills', 'required', 'Remove empty skill entries.');

  const totalSections = RESUME_SECTIONS.length;
  const completedSections = Object.values(issuesBySection).filter(issues => issues.length === 0).length;
  return {
    issuesBySection,
    completedSections,
    totalSections,
    completionPercent: Math.round((completedSections / totalSections) * 100),
  };
}
