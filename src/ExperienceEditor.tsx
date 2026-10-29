import { useRef, useState } from 'react';
import { validateResumeProfile, type ResumeExperience, type ResumeProfile } from './domain/resumeProfile';

type ExperienceField = 'role' | 'organization' | 'startYear' | 'endYear' | 'achievements';

function fieldId(index: number, field: ExperienceField, achievementIndex?: number) {
  if (field === 'achievements') return `experience-${index}-achievement-${achievementIndex ?? 0}`;
  return `experience-${index}-${field}`;
}

export function ExperienceEditor({ profile, onChange }: { profile: ResumeProfile; onChange: (profile: ResumeProfile) => void }) {
  const [reviewed, setReviewed] = useState(false);
  const nextId = useRef(0);
  const issues = validateResumeProfile(profile).issuesBySection.experience;
  const updateExperience = (index: number, patch: Partial<ResumeExperience>) => {
    setReviewed(false);
    onChange({
      ...profile,
      experience: profile.experience.map((entry, entryIndex) => entryIndex === index ? { ...entry, ...patch } : entry),
    });
  };
  const updateAchievement = (index: number, achievementIndex: number, value: string) => {
    const experience = profile.experience[index];
    updateExperience(index, {
      achievements: experience.achievements.map((achievement, itemIndex) => itemIndex === achievementIndex ? value : achievement),
    });
  };
  const addExperience = () => {
    setReviewed(false);
    const year = new Date().getFullYear();
    nextId.current += 1;
    onChange({
      ...profile,
      experience: [...profile.experience, {
        id: `experience-new-${Date.now()}-${nextId.current}`,
        role: '',
        organization: '',
        startYear: year,
        endYear: year,
        current: false,
        achievements: [''],
      }],
    });
  };
  const reviewExperience = () => {
    setReviewed(true);
    const firstIssue = issues[0];
    if (!firstIssue) return;
    const match = /^experience\.(\d+)\.(role|organization|startYear|endYear|achievements)$/.exec(firstIssue.fieldPath);
    let target: HTMLElement | null;
    if (!match) target = document.getElementById('add-experience');
    else {
      const index = Number(match[1]);
      target = match[2] === 'achievements' && profile.experience[index]?.achievements.length === 0
        ? document.getElementById(`experience-${index}-add-achievement`)
        : document.getElementById(fieldId(index, match[2] as ExperienceField));
    }
    target?.focus();
  };

  return <section className="experience-editor" aria-labelledby="experience-editor-title">
    <h2 id="experience-editor-title">Experience</h2>
    <p className="experience-editor-intro">Add roles and evidence from this session profile. Changes update the resume preview; nothing is saved to disk.</p>
    <aside className="achievement-prompt" aria-label="Achievement writing prompts">
      <b>Make each achievement specific</b>
      <ul>
        <li>What changed because of your work?</li>
        <li>Who benefited or what improved?</li>
        <li>Which result can you support accurately?</li>
      </ul>
    </aside>
    {profile.experience.map((entry, index) => {
      const title = entry.role.trim() || `New role ${index + 1}`;
      const findError = (field: ExperienceField) => issues.find(issue => issue.fieldPath === `experience.${index}.${field}`);
      const roleError = findError('role');
      const organizationError = findError('organization');
      const startError = findError('startYear');
      const endError = findError('endYear');
      const achievementsError = findError('achievements');
      const roleId = fieldId(index, 'role');
      const organizationId = fieldId(index, 'organization');
      const startId = fieldId(index, 'startYear');
      const endId = fieldId(index, 'endYear');
      const achievementsHelpId = `experience-${index}-achievement-help`;

      return <fieldset className="experience-entry" key={entry.id}>
        <legend>{title}</legend>
        <div className="experience-field">
          <label htmlFor={roleId}>Role title</label>
          <input id={roleId} value={entry.role} dir="auto" aria-invalid={Boolean(roleError)} aria-describedby={`experience-${index}-role-help${roleError ? ` experience-${index}-role-error` : ''}`} onChange={event => updateExperience(index, { role: event.target.value })}/>
          <small id={`experience-${index}-role-help`}>Use the title you held, without adding an unsupported level.</small>
          {roleError && <p className="experience-error" id={`experience-${index}-role-error`}>{roleError.message}</p>}
        </div>
        <div className="experience-field">
          <label htmlFor={organizationId}>Organization</label>
          <input id={organizationId} value={entry.organization} dir="auto" aria-invalid={Boolean(organizationError)} aria-describedby={`experience-${index}-organization-help${organizationError ? ` experience-${index}-organization-error` : ''}`} onChange={event => updateExperience(index, { organization: event.target.value })}/>
          <small id={`experience-${index}-organization-help`}>Company, studio or client name.</small>
          {organizationError && <p className="experience-error" id={`experience-${index}-organization-error`}>{organizationError.message}</p>}
        </div>
        <div className="experience-years">
          <div className="experience-field">
            <label htmlFor={startId}>Start year</label>
            <input id={startId} type="number" min={1900} max={2200} step={1} value={entry.startYear || ''} aria-invalid={Boolean(startError)} aria-describedby={`experience-${index}-start-help${startError ? ` experience-${index}-start-error` : ''}`} onChange={event => updateExperience(index, { startYear: event.target.value === '' ? 0 : Number(event.target.value) })}/>
            <small id={`experience-${index}-start-help`}>Use a four-digit year.</small>
            {startError && <p className="experience-error" id={`experience-${index}-start-error`}>{startError.message}</p>}
          </div>
          <div className="experience-field">
            <label htmlFor={endId}>End year</label>
            <input id={endId} type="number" min={1900} max={2200} step={1} value={entry.current ? '' : entry.endYear ?? ''} disabled={entry.current} aria-invalid={Boolean(endError)} aria-describedby={`experience-${index}-end-help${endError ? ` experience-${index}-end-error` : ''}`} onChange={event => updateExperience(index, { endYear: event.target.value === '' ? null : Number(event.target.value) })}/>
            <small id={`experience-${index}-end-help`}>{entry.current ? 'Current role uses Present.' : 'Must be on or after the start year.'}</small>
            {endError && <p className="experience-error" id={`experience-${index}-end-error`}>{endError.message}</p>}
          </div>
        </div>
        <label className="experience-current"><input type="checkbox" checked={entry.current} aria-label={`Currently working here — ${title}`} onChange={event => updateExperience(index, { current: event.target.checked, endYear: event.target.checked ? null : entry.endYear ?? new Date().getFullYear() })}/> Currently working here</label>
        <div className="achievement-list">
          <b>Achievements</b>
          {entry.achievements.map((achievement, achievementIndex) => {
            const achievementId = fieldId(index, 'achievements', achievementIndex);
            const achievementErrorId = `experience-${index}-achievement-error`;
            return <div className="achievement-field" key={`${entry.id}-achievement-${achievementIndex}`}>
              <label htmlFor={achievementId}>Achievement {achievementIndex + 1}</label>
              <textarea id={achievementId} rows={3} value={achievement} dir="auto" aria-invalid={Boolean(achievementsError)} aria-describedby={`${achievementsHelpId}${achievementsError ? ` ${achievementErrorId}` : ''}`} onChange={event => updateAchievement(index, achievementIndex, event.target.value)}/>
              <button type="button" className="experience-text-button" aria-label={`Remove achievement ${achievementIndex + 1} from ${title}`} onClick={() => updateExperience(index, { achievements: entry.achievements.filter((_, itemIndex) => itemIndex !== achievementIndex) })}>Remove achievement</button>
            </div>;
          })}
          <small id={achievementsHelpId}>Describe the action and outcome. Include a number only when you can verify it.</small>
          {achievementsError && <p className="experience-error" id={`experience-${index}-achievement-error`}>{achievementsError.message}</p>}
          <button type="button" id={`experience-${index}-add-achievement`} className="experience-text-button" aria-label={`Add achievement to ${title}`} aria-describedby={achievementsError && entry.achievements.length === 0 ? `experience-${index}-achievement-error` : undefined} onClick={() => updateExperience(index, { achievements: [...entry.achievements, ''] })}>Add achievement</button>
        </div>
        <button type="button" className="experience-remove" aria-label={`Remove ${title}`} onClick={() => {
          setReviewed(false);
          onChange({ ...profile, experience: profile.experience.filter((_, itemIndex) => itemIndex !== index) });
        }}>Remove role</button>
      </fieldset>;
    })}
    <div className="experience-actions">
      <button type="button" id="add-experience" className="experience-add" onClick={addExperience}>Add experience</button>
      <button type="button" className="experience-review" onClick={reviewExperience}>Review experience fields</button>
    </div>
    {reviewed && <p className="experience-review-status" role="status" aria-live="polite">{issues.length ? `${issues.length} experience ${issues.length === 1 ? 'field needs' : 'fields need'} attention.` : 'Experience fields are ready to review. Changes remain in this session.'}</p>}
  </section>;
}
