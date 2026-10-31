import { useEffect, useRef, useState } from 'react';
import { validateResumeProfile, type ResumeProfile } from './domain/resumeProfile';

export function SkillsEditor({ profile, onChange }: { profile: ResumeProfile; onChange: (profile: ResumeProfile) => void }) {
  const [reviewed, setReviewed] = useState(false);
  const skillInputs = useRef<Array<HTMLInputElement | null>>([]);
  const addButton = useRef<HTMLButtonElement>(null);
  const focusIndex = useRef<number | null>(null);
  const issues = validateResumeProfile(profile).issuesBySection.skills;
  const error = issues[0];

  useEffect(() => {
    if (focusIndex.current === null) return;
    skillInputs.current[focusIndex.current]?.focus();
    focusIndex.current = null;
  }, [profile.skills.length]);

  const updateSkill = (index: number, value: string) => {
    setReviewed(false);
    onChange({
      ...profile,
      skills: profile.skills.map((skill, skillIndex) => skillIndex === index ? value : skill),
    });
  };

  const addSkill = () => {
    setReviewed(false);
    focusIndex.current = profile.skills.length;
    onChange({ ...profile, skills: [...profile.skills, ''] });
  };

  const removeSkill = (index: number) => {
    setReviewed(false);
    const skills = profile.skills.filter((_, skillIndex) => skillIndex !== index);
    if (skills.length === 0) {
      addButton.current?.focus();
    } else {
      focusIndex.current = Math.min(index, skills.length - 1);
    }
    onChange({ ...profile, skills });
  };

  const reviewSkills = () => {
    setReviewed(true);
    if (issues.length) skillInputs.current[0]?.focus();
    else if (profile.skills.length === 0) addButton.current?.focus();
  };

  return <section className="skills-editor" aria-labelledby="skills-editor-title">
    <h2 id="skills-editor-title">Skills</h2>
    <p className="skills-editor-intro">Keep each skill short and distinct. Changes update the preview and stay in this session.</p>
    <div className="skills-list" role="group" aria-labelledby="skills-list-title">
      <h3 id="skills-list-title">Your skills</h3>
      {profile.skills.map((skill, index) => (
        <div className="skill-row" key={`skill-${index}`}>
          <div className="education-field">
            <label htmlFor={`skill-${index}`}>Skill {index + 1}</label>
            <input
              id={`skill-${index}`}
              ref={element => { skillInputs.current[index] = element; }}
              value={skill}
              dir="auto"
              aria-invalid={Boolean(error)}
              aria-describedby={`skill-${index}-help${error ? ' skills-error' : ''}`}
              onChange={event => updateSkill(index, event.target.value)}
            />
            <small id={`skill-${index}-help`}>At least three non-empty, unique skills are needed for section completeness.</small>
          </div>
          <button className="skill-remove" type="button" aria-label={`Remove skill ${index + 1}`} onClick={() => removeSkill(index)}>Remove</button>
        </div>
      ))}
    </div>
    {error && <p className="education-error skills-error" id="skills-error">{error.message}</p>}
    <div className="skills-actions">
      <button className="education-add" ref={addButton} type="button" onClick={addSkill}>Add skill</button>
      <button className="education-review" type="button" onClick={reviewSkills}>Review skills</button>
    </div>
    {reviewed && <p className="education-review-status" role="status" aria-live="polite">{issues.length
      ? `${issues.length} skill details need attention.`
      : 'Skills are ready to review. Changes remain in this session.'}</p>}
  </section>;
}
