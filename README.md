# Forma Resume Studio

Forma helps experienced professionals shape a clear, credible resume and portfolio story for their next career move. It is designed for people who want control over their narrative, a guided writing process and a document that reads well on screen and on paper.

## Product experience
The foundation pairs section completeness with a live resume preview, an editorial template, writing prompts and a private personal workspace. Mantine provides accessible interface primitives and React Icons supports the navigation and actions.

This starter uses fictional profile content in local UI state. It does not store or submit personal information. The roadmap continues with additional resume templates, document import, PDF and spreadsheet exports, privacy controls, PWA support and accessible responsive review.

## Run locally
Use Node.js 20 or newer. The machine-specific .npmrc is ignored by Git and points to the configured package mirror.

    npm ci
    npm run dev

Use npm test, npm run typecheck and npm run build before releases. Keep the resume readable on phone, tablet and desktop, and verify print output after template changes.

## Privacy and accessibility
Career history can be sensitive. Do not add real personal records to fixtures, logs or source control. Current editing features keep user data local unless an account-backed service is explicitly added later. Preserve labels, keyboard order, contrast and reduced-motion preferences.

### Resume profile model and validation
`src/domain/resumeProfile.ts` defines typed profile, experience, education, certification, selected-work and skill data. Validation checks required name, headline, summary and email; email and optional HTTP(S) profile/credential URL formats without embedded credentials; experience and education year ranges; achievement text; a selected project; and at least three unique non-empty skills. Certifications are optional, but entered names and issuers are required and optional years/links are validated. The completion count and percentage come from the five primary sections. `src/data/sampleProfile.ts` is explicitly fictional and uses reserved example domains; the UI holds it in memory only and does not claim it was saved.

## Delivery and review

Forma's review must connect field-specific profile validation to the live preview, preserve résumé sections and private career data, and inspect readable print output after template changes. Follow [DELIVERY-POLICY.md](DELIVERY-POLICY.md) from Day 02 for sequential execution, scope-driven commits and this repository's separate branch/PR with GitHub panel review and merge.

## Contributions and examples

See [CONTRIBUTING.md](CONTRIBUTING.md) for reproducible reports, genuine collaboration and product examples such as an English/Persian editor and print example without personal details. Contributions follow the product backlog and reviewed PR workflow.

## Profile and contact editor

Labeled fields edit the in-memory profile and preview together. Name, headline, email and summary follow the shared profile validator; optional portfolio links allow HTTP(S) only. Each invalid field exposes its error through aria-describedby/aria-invalid; Review profile fields announces the count and focuses the first invalid field. Examples use reserved domains and synthetic English/Persian text. Text fields/preview use automatic direction while email/URL stay LTR. Education, selected work and skills are preserved. No disk save, upload or account persistence occurs. Print styles hide editor controls. Day 02 browser review checked the 390px layout, live profile updates, invalid-email focus/announcement and Persian preview; print-specific review remains pending.

## Experience editor

Role title, organization, start/end year, current-role status and achievement text update the same in-memory profile used by the resume preview and section completeness. Dates accept whole years from 1900 to 2200, and an end year must not precede the start year. Current roles show **Present** and disable the end-year field. Field errors connect to their inputs and **Review experience fields** focuses the first issue. Add/remove controls keep the role and achievement lists editable. Writing prompts ask for a change, beneficiary and supportable result; they discourage unverified metrics. Role, organization and achievement fields use automatic text direction for English and Persian. No career content is stored or submitted.

## Education, certifications and skills editor

Education entries edit credential, institution and chronological whole-year ranges. Optional certifications edit the earned credential, issuer, optional year and optional HTTP(S) verification link; unsafe schemes are rejected and never rendered as links. Skills can be added, edited and removed, with case/whitespace-insensitive duplicate and minimum-count validation. Review actions link errors to the relevant fields and focus the first issue. All edits update the in-memory profile and live preview, including printed content. The sample certification is fictional; do not replace it or other sample profile data with a real person's records.
