# Forma Resume Studio

Forma helps experienced professionals shape a clear, credible resume and portfolio story for their next career move. It is designed for people who want control over their narrative, a guided writing process and a document that reads well on screen and on paper.

## Product experience
The foundation pairs section completeness with a live resume preview, an editorial template, writing prompts and a private personal workspace. Mantine provides accessible interface primitives and React Icons supports the navigation and actions.

This starter uses fictional profile content in local UI state. It does not store or submit personal information. The roadmap covers structured editing, multiple resume templates, document import, PDF and spreadsheet exports, privacy controls, PWA support and accessible responsive review.

## Run locally
Use Node.js 20 or newer. The machine-specific .npmrc is ignored by Git and points to the configured package mirror.

    npm ci
    npm run dev

Use npm test, npm run typecheck and npm run build before releases. Keep the resume readable on phone, tablet and desktop, and verify print output after template changes.

## Privacy and accessibility
Career history can be sensitive. Do not add real personal records to fixtures, logs or source control. As editing features are added, keep user data local unless they explicitly opt into an account-backed service. Preserve labels, keyboard order, contrast and reduced-motion preferences.

### Resume profile model and validation
`src/domain/resumeProfile.ts` defines typed profile, experience, education, selected-work and skill sections. Validation checks required name, headline, summary and email; email and optional HTTP(S) portfolio URL formats; experience and education year ranges; achievement text; a selected project; and at least three unique non-empty skills. The completion count and percentage come from these section results. `src/data/sampleProfile.ts` is explicitly fictional and uses reserved example domains; the UI holds it in memory only and does not claim it was saved.

## Delivery and review

Forma's review must connect field-specific profile validation to the live preview, preserve résumé sections and private career data, and inspect readable print output after template changes. Follow [DELIVERY-POLICY.md](DELIVERY-POLICY.md) from Day 02 for sequential execution, scope-driven commits and this repository's separate branch/PR with GitHub panel review and merge.

## Contributions and examples

See [CONTRIBUTING.md](CONTRIBUTING.md) for reproducible reports, genuine collaboration and product examples such as an English/Persian editor and print example without personal details. Contributions follow the product backlog and reviewed PR workflow.
