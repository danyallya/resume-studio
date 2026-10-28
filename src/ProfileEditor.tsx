import { useState } from 'react';
import { validateResumeProfile, type ResumeProfile } from './domain/resumeProfile';

const fields = [
  ['fullName', 'Full name', 'Example: Alex Morgan / الکس مورگان'],
  ['headline', 'Professional headline', 'Example: Product designer / طراح محصول'],
  ['location', 'Location', 'Example: London / تهران (optional)'],
  ['email', 'Email', 'Example: alex@example.com'],
  ['website', 'Portfolio URL', 'Example: https://example.com (optional)'],
  ['summary', 'Professional summary', 'Briefly explain your work and next role. English or Persian is welcome.'],
] as const;

export function ProfileEditor({ profile, onChange }: { profile: ResumeProfile; onChange: (profile: ResumeProfile) => void }) {
  const [reviewed, setReviewed] = useState(false);
  const issues = validateResumeProfile(profile).issuesBySection.profile;
  return <form className="profile-editor" noValidate aria-label="Profile and contact editor" onSubmit={event => {
    event.preventDefault(); setReviewed(true);
    if (issues.length) document.getElementById(`profile-${issues[0].fieldPath}`)?.focus();
  }}>
    <h2>Profile and contact</h2><p>Session only. Changes update the preview; nothing is sent or saved to disk.</p>
    {fields.map(([field, label, example]) => {
      const error = issues.find(issue => issue.fieldPath === field);
      const id = `profile-${field}`;
      const props = {
        id, value: profile[field] ?? '', dir: field === 'email' || field === 'website' ? 'ltr' : 'auto',
        'aria-invalid': Boolean(error), 'aria-describedby': `${id}-help${error ? ` ${id}-error` : ''}`,
        onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setReviewed(false); onChange({ ...profile, [field]: event.target.value }); },
      };
      return <div className="profile-field" key={field}><label htmlFor={id}>{label}</label>
        {field === 'summary' ? <textarea {...props} rows={4}/> : <input {...props} type={field === 'email' ? 'email' : field === 'website' ? 'url' : 'text'}/>}
        <small id={`${id}-help`}>{example}</small>{error && <p className="field-error" id={`${id}-error`}>{error.message}</p>}
      </div>;
    })}
    <button type="submit">Review profile fields</button>
    <p role="status">{reviewed ? issues.length ? `${issues.length} profile fields need attention.` : 'Profile fields are ready to review. Changes remain in this session.' : ''}</p>
  </form>;
}
