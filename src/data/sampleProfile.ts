import type { ResumeProfile } from '../domain/resumeProfile';

// Fictional portfolio preview content. Never replace this fixture with a real resume.
export const sampleProfile: ResumeProfile = {
  id: 'sample-alex-morgan',
  fullName: 'Alex Morgan',
  headline: 'Senior Product Designer',
  location: 'Brooklyn, NY',
  email: 'alex.morgan@example.com',
  website: 'https://alexmorgan.example',
  summary: 'Product designer shaping thoughtful digital experiences for teams building useful, enduring products. I bring clarity to complex workflows and create momentum across design, product and engineering.',
  experience: [
    {
      id: 'experience-northstar',
      role: 'Product Designer',
      organization: 'Northstar Digital',
      startYear: 2022,
      endYear: null,
      current: true,
      achievements: ['Led a redesign of the customer workspace, simplifying a multi-step service into one clear journey used by 18,000 people each month.'],
    },
    {
      id: 'experience-common-practice',
      role: 'Associate Designer',
      organization: 'Common Practice',
      startYear: 2019,
      endYear: 2022,
      current: false,
      achievements: ['Partnered with research and engineering to bring a new membership product from pilot to national launch.'],
    },
  ],
  education: [
    { id: 'education-parsons', credential: 'BFA, Communication Design', institution: 'Parsons School of Design', startYear: 2015, endYear: 2019 },
  ],
  certifications: [
    { id: 'cert-accessibility-foundations', name: 'Accessibility Foundations', issuer: 'Open Learning Institute', year: 2021, credentialUrl: 'https://example.com/certificates/accessibility-foundations' },
  ],
  selectedWork: [],
  skills: ['Product strategy', 'Prototyping', 'Design systems'],
};
