import { useRef, useState } from 'react';
import {
  validateResumeProfile,
  type ResumeCertification,
  type ResumeEducation,
  type ResumeProfile,
} from './domain/resumeProfile';

function parseYear(value: string): number | null {
  if (value.trim() === '') return null;
  const year = Number(value);
  return Number.isFinite(year) ? year : Number.NaN;
}

export function EducationEditor({ profile, onChange }: { profile: ResumeProfile; onChange: (profile: ResumeProfile) => void }) {
  const [reviewed, setReviewed] = useState(false);
  const nextId = useRef(0);
  const issues = validateResumeProfile(profile).issuesBySection.education;

  const updateEducation = (index: number, patch: Partial<ResumeEducation>) => {
    setReviewed(false);
    onChange({
      ...profile,
      education: profile.education.map((entry, entryIndex) => entryIndex === index ? { ...entry, ...patch } : entry),
    });
  };

  const updateCertification = (index: number, patch: Partial<ResumeCertification>) => {
    setReviewed(false);
    onChange({
      ...profile,
      certifications: profile.certifications.map((entry, entryIndex) => entryIndex === index ? { ...entry, ...patch } : entry),
    });
  };

  const addEducation = () => {
    setReviewed(false);
    nextId.current += 1;
    onChange({
      ...profile,
      education: [...profile.education, {
        id: `education-new-${Date.now()}-${nextId.current}`,
        credential: '',
        institution: '',
        startYear: null,
        endYear: null,
      }],
    });
  };

  const addCertification = () => {
    setReviewed(false);
    nextId.current += 1;
    onChange({
      ...profile,
      certifications: [...profile.certifications, {
        id: `certification-new-${Date.now()}-${nextId.current}`,
        name: '',
        issuer: '',
        year: null,
        credentialUrl: '',
      }],
    });
  };

  const reviewEducation = () => {
    setReviewed(true);
    const firstIssue = issues[0];
    if (!firstIssue) return;

    const educationMatch = /^education\.(\d+)\.(credential|institution|years)$/.exec(firstIssue.fieldPath);
    if (educationMatch) {
      const [, rawIndex, field] = educationMatch;
      const index = Number(rawIndex);
      const entry = profile.education[index];
      const yearTarget = entry && (entry.startYear === null || entry.startYear < 1900 || entry.startYear > 2200)
        ? `education-${index}-start-year`
        : `education-${index}-end-year`;
      document.getElementById(field === 'years' ? yearTarget : `education-${index}-${field}`)?.focus();
      return;
    }

    const certificationMatch = /^certifications\.(\d+)\.(name|issuer|year|credentialUrl)$/.exec(firstIssue.fieldPath);
    if (certificationMatch) {
      const [, rawIndex, field] = certificationMatch;
      document.getElementById(`certification-${rawIndex}-${field}`)?.focus();
      return;
    }

    document.getElementById('add-education')?.focus();
  };

  return <section className="education-editor" aria-labelledby="education-editor-title">
    <h2 id="education-editor-title">Education and certifications</h2>
    <p className="education-editor-intro">Edit education and optional credentials for this session profile. Updates appear in the resume preview and are not saved to disk.</p>

    <div className="education-group" aria-labelledby="education-list-title">
      <h3 id="education-list-title">Education</h3>
      {profile.education.map((entry, index) => {
        const title = entry.credential.trim() || `Education entry ${index + 1}`;
        const findError = (field: string) => issues.find(issue => issue.fieldPath === `education.${index}.${field}`);
        const credentialError = findError('credential');
        const institutionError = findError('institution');
        const yearsError = findError('years');
        const yearHelpId = `education-${index}-year-help`;
        const yearErrorId = `education-${index}-year-error`;

        return <fieldset className="education-entry" key={entry.id}>
          <legend>{title}</legend>
          <div className="education-field">
            <label htmlFor={`education-${index}-credential`}>Credential or field of study</label>
            <input
              id={`education-${index}-credential`}
              value={entry.credential}
              dir="auto"
              aria-invalid={Boolean(credentialError)}
              aria-describedby={`education-${index}-credential-help${credentialError ? ` education-${index}-credential-error` : ''}`}
              onChange={event => updateEducation(index, { credential: event.target.value })}
            />
            <small id={`education-${index}-credential-help`}>Degree, program or field; keep the wording accurate.</small>
            {credentialError && <p className="education-error" id={`education-${index}-credential-error`}>{credentialError.message}</p>}
          </div>
          <div className="education-field">
            <label htmlFor={`education-${index}-institution`}>Institution</label>
            <input
              id={`education-${index}-institution`}
              value={entry.institution}
              dir="auto"
              aria-invalid={Boolean(institutionError)}
              aria-describedby={`education-${index}-institution-help${institutionError ? ` education-${index}-institution-error` : ''}`}
              onChange={event => updateEducation(index, { institution: event.target.value })}
            />
            <small id={`education-${index}-institution-help`}>School, university or training provider.</small>
            {institutionError && <p className="education-error" id={`education-${index}-institution-error`}>{institutionError.message}</p>}
          </div>
          <div className="education-years">
            <div className="education-field">
              <label htmlFor={`education-${index}-start-year`}>Start year</label>
              <input
                id={`education-${index}-start-year`}
                type="number"
                min={1900}
                max={2200}
                step={1}
                value={entry.startYear ?? ''}
                aria-invalid={Boolean(yearsError)}
                aria-describedby={`${yearHelpId}${yearsError ? ` ${yearErrorId}` : ''}`}
                onChange={event => updateEducation(index, { startYear: parseYear(event.target.value) })}
              />
            </div>
            <div className="education-field">
              <label htmlFor={`education-${index}-end-year`}>End year</label>
              <input
                id={`education-${index}-end-year`}
                type="number"
                min={1900}
                max={2200}
                step={1}
                value={entry.endYear ?? ''}
                aria-invalid={Boolean(yearsError)}
                aria-describedby={`${yearHelpId}${yearsError ? ` ${yearErrorId}` : ''}`}
                onChange={event => updateEducation(index, { endYear: parseYear(event.target.value) })}
              />
            </div>
          </div>
          <small className="education-year-help" id={yearHelpId}>Use whole years from 1900 to 2200; end year must not be earlier than start year.</small>
          {yearsError && <p className="education-error" id={yearErrorId}>{yearsError.message}</p>}
          <button
            className="education-remove"
            type="button"
            aria-label={`Remove education entry ${index + 1}: ${title}`}
            onClick={() => {
              setReviewed(false);
              onChange({ ...profile, education: profile.education.filter((_, entryIndex) => entryIndex !== index) });
            }}
          >Remove education</button>
        </fieldset>;
      })}
      <button className="education-add" id="add-education" type="button" onClick={addEducation}>Add education</button>
    </div>

    <div className="education-group" aria-labelledby="certification-list-title">
      <h3 id="certification-list-title">Certifications <span>(optional)</span></h3>
      <p className="education-group-help">Only list credentials you have earned. A year and verification link are optional.</p>
      {profile.certifications.map((entry, index) => {
        const title = entry.name.trim() || `Certification ${index + 1}`;
        const findError = (field: string) => issues.find(issue => issue.fieldPath === `certifications.${index}.${field}`);
        const nameError = findError('name');
        const issuerError = findError('issuer');
        const yearError = findError('year');
        const urlError = findError('credentialUrl');

        return <fieldset className="certification-entry" key={entry.id}>
          <legend>{title}</legend>
          <div className="education-field">
            <label htmlFor={`certification-${index}-name`}>Certification name</label>
            <input
              id={`certification-${index}-name`}
              value={entry.name}
              dir="auto"
              aria-invalid={Boolean(nameError)}
              aria-describedby={`certification-${index}-name-help${nameError ? ` certification-${index}-name-error` : ''}`}
              onChange={event => updateCertification(index, { name: event.target.value })}
            />
            <small id={`certification-${index}-name-help`}>Use the title shown on the credential.</small>
            {nameError && <p className="education-error" id={`certification-${index}-name-error`}>{nameError.message}</p>}
          </div>
          <div className="education-field">
            <label htmlFor={`certification-${index}-issuer`}>Issuing organization</label>
            <input
              id={`certification-${index}-issuer`}
              value={entry.issuer}
              dir="auto"
              aria-invalid={Boolean(issuerError)}
              aria-describedby={`certification-${index}-issuer-help${issuerError ? ` certification-${index}-issuer-error` : ''}`}
              onChange={event => updateCertification(index, { issuer: event.target.value })}
            />
            <small id={`certification-${index}-issuer-help`}>The provider named on the certificate.</small>
            {issuerError && <p className="education-error" id={`certification-${index}-issuer-error`}>{issuerError.message}</p>}
          </div>
          <div className="education-field">
            <label htmlFor={`certification-${index}-year`}>Year earned (optional)</label>
            <input
              id={`certification-${index}-year`}
              type="number"
              min={1900}
              max={2200}
              step={1}
              value={entry.year ?? ''}
              aria-invalid={Boolean(yearError)}
              aria-describedby={`certification-${index}-year-help${yearError ? ` certification-${index}-year-error` : ''}`}
              onChange={event => updateCertification(index, { year: parseYear(event.target.value) })}
            />
            <small id={`certification-${index}-year-help`}>Leave blank if you do not know the year.</small>
            {yearError && <p className="education-error" id={`certification-${index}-year-error`}>{yearError.message}</p>}
          </div>
          <div className="education-field">
            <label htmlFor={`certification-${index}-credentialUrl`}>Verification link (optional)</label>
            <input
              id={`certification-${index}-credentialUrl`}
              type="url"
              dir="ltr"
              value={entry.credentialUrl}
              aria-invalid={Boolean(urlError)}
              aria-describedby={`certification-${index}-url-help${urlError ? ` certification-${index}-url-error` : ''}`}
              onChange={event => updateCertification(index, { credentialUrl: event.target.value })}
            />
            <small id={`certification-${index}-url-help`}>Use a complete http or https URL without embedded credentials; this session does not verify it.</small>
            {urlError && <p className="education-error" id={`certification-${index}-url-error`}>{urlError.message}</p>}
          </div>
          <button
            className="education-remove"
            type="button"
            aria-label={`Remove certification ${index + 1}: ${title}`}
            onClick={() => {
              setReviewed(false);
              onChange({ ...profile, certifications: profile.certifications.filter((_, entryIndex) => entryIndex !== index) });
            }}
          >Remove certification</button>
        </fieldset>;
      })}
      <button className="education-add" type="button" onClick={addCertification}>Add certification</button>
    </div>

    <div className="education-actions">
      <button className="education-review" type="button" onClick={reviewEducation}>Review education and certifications</button>
    </div>
    {reviewed && <p className="education-review-status" role="status" aria-live="polite">{issues.length
      ? `${issues.length} education or certification details need attention.`
      : 'Education and certifications are ready to review. Certification entries are optional.'}</p>}
  </section>;
}
