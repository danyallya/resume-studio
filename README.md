# Forma Resume Studio

Forma helps experienced professionals shape a clear, credible resume and portfolio story for their next career move. It is designed for people who want control over their narrative, a guided writing process and a document that reads well on screen and on paper.

## Product experience
The foundation pairs section completeness with a live resume preview, an editorial template, writing prompts and a private personal workspace. Mantine provides accessible interface primitives and React Icons supports the navigation and actions.

This starter uses fictional profile content in local UI state. It does not store or submit personal information. The roadmap covers structured editing, multiple resume templates, document import, PDF and spreadsheet exports, privacy controls, PWA support and accessible responsive review.

## Run locally
Use Node.js 20 or newer. The machine-specific .npmrc is ignored by Git and points to the configured package mirror.

    npm install
    npm run dev

Use npm test, npm run typecheck and npm run build before releases. Keep the resume readable on phone, tablet and desktop, and verify print output after template changes.

## Privacy and accessibility
Career history can be sensitive. Do not add real personal records to fixtures, logs or source control. As editing features are added, keep user data local unless they explicitly opt into an account-backed service. Preserve labels, keyboard order, contrast and reduced-motion preferences.
