import { describe, expect, it } from 'vitest';
import { sampleProfile } from '../data/sampleProfile';
import { isHttpUrl, RESUME_SECTIONS, validateResumeProfile } from './resumeProfile';

describe('Forma resume profile schemas', () => {
  it('derives completeness from valid sections and identifies missing selected work', () => {
    const result = validateResumeProfile(sampleProfile);

    expect(RESUME_SECTIONS.map(section => section.id)).toEqual([
      'profile', 'experience', 'education', 'selectedWork', 'skills',
    ]);
    expect(result.completedSections).toBe(4);
    expect(result.totalSections).toBe(5);
    expect(result.completionPercent).toBe(80);
    expect(result.issuesBySection.selectedWork[0]).toMatchObject({
      code: 'required',
      message: 'Add at least one portfolio project.',
    });
  });

  it('reports invalid contact data, experience dates, and duplicate skills by section and field', () => {
    const invalidProfile = {
      ...sampleProfile,
      email: 'not-an-email',
      experience: [{ ...sampleProfile.experience[0], current: true, endYear: 2023 }],
      skills: [...sampleProfile.skills, '  PROTOTYPING  '],
    };
    const result = validateResumeProfile(invalidProfile);

    expect(result.issuesBySection.profile).toContainEqual(expect.objectContaining({
      fieldPath: 'email',
      code: 'format',
    }));
    expect(result.issuesBySection.experience).toContainEqual(expect.objectContaining({
      fieldPath: 'experience.0.endYear',
      code: 'range',
    }));
    expect(result.issuesBySection.skills).toContainEqual(expect.objectContaining({
      fieldPath: 'skills',
      code: 'duplicate',
    }));
  });

  it('keeps certifications optional but validates entered years and verification links', () => {
    expect(isHttpUrl('https://example.com/certificate')).toBe(true);
    expect(isHttpUrl('https://user:secret@example.com/certificate')).toBe(false);
    const withoutCertifications = validateResumeProfile({ ...sampleProfile, certifications: [] });
    expect(withoutCertifications.issuesBySection.education).toHaveLength(0);

    const invalid = validateResumeProfile({
      ...sampleProfile,
      certifications: [{
        id: 'cert-invalid',
        name: 'Inclusive Design',
        issuer: 'Open Learning Institute',
        year: 1899,
        credentialUrl: 'javascript:alert(1)',
      }],
    });
    expect(invalid.issuesBySection.education).toContainEqual(expect.objectContaining({
      fieldPath: 'certifications.0.year',
      code: 'range',
    }));
    expect(invalid.issuesBySection.education).toContainEqual(expect.objectContaining({
      fieldPath: 'certifications.0.credentialUrl',
      code: 'format',
    }));
  });
});
