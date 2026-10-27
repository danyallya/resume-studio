# 30-day delivery plan
## Daily operating loop
Review previous code and Git diff, inspect backlog and debug defects. Add/update tests for changed form and preview behavior, implement today's ticket, run tests/typecheck/build, update user docs and backlog, and write tomorrow's scope. Record unavailable checks and continue static review. Add discoveries with priority and explanation.

## Foundation status
Day 00 resume workspace and preview foundation are ready. Dependencies and lockfile are installed; smoke test (1/1), typecheck and production build passed. This Vite template has no standalone lint script. Nexus .npmrc remains local and ignored.

## Daily tickets
### Day 00 verification
Nexus returned 404 for packages used by this project. Following the user's approval, dependencies were installed with npmjs fallback; the ignored local .npmrc keeps Nexus as default and contains only required scope overrides. Day 01 has not started.

| Day | Deliverable |
|---|---|
| 01 | **Done** — define typed profile/section schemas and validation rules; derive completion status from validated sample content. |
| 02 | Add profile and contact editor with accessible labels and examples. |
| 03 | Add experience editor with achievement prompts and date validation. |
| 04 | Add education, certification and skills editors. |
| 05 | Add preview synchronization and completion guidance per section. |
| 06 | Add section reorder and hide/show controls with keyboard support. |
| 07 | Review first-week form/preview behavior, test it and fix data loss risks. |
| 08 | Add draft autosave with explicit local data retention controls. |
| 09 | Add two additional resume templates with consistent content semantics. |
| 10 | Add typography, accent and spacing theme options. |
| 11 | Add PDF export with page breaks and print settings. |
| 12 | Add DOCX export and document compatibility notes. |
| 13 | Add portfolio project editor with media captions and links. |
| 14 | Review export and personal-data handling; add regression tests. |
| 15 | Add cover-letter workspace using reusable profile data. |
| 16 | Add role-specific resume variants with safe duplication. |
| 17 | Add job description keyword comparison with transparent matching. |
| 18 | Add file import flow and safe parsing/error handling. |
| 19 | Refine mobile editing and live preview switching. |
| 20 | Audit theme, print contrast, keyboard flow and screen-reader labels. |
| 21 | Add PWA install/offline guidance with clear local-data boundaries. |
| 22 | Add CSV/XLSX export for structured experience history. |
| 23 | Add accessible version history and restore confirmation. |
| 24 | Add privacy settings, data export and complete local reset. |
| 25 | Add guided onboarding and sample profile replacement flow. |
| 26 | Add template comparison and document quality checklist. |
| 27 | Test screen-reader, keyboard, browser zoom and print scenarios. |
| 28 | Run end-to-end regression on editing, persistence and exports. |
| 29 | Complete user guide, privacy explanation and template notes. |
| 30 | Release-candidate review, all checks, known limits and release notes. |

Mark each day Done, In progress or Blocked, update findings and prepare the next day's work.

- Day 01: Done. Profile, experience, education, selected-work, and skill validation now drives section status and completeness; next is Day 02, an accessible profile/contact editor with examples.
- Review carry-over for Day 02: validation issues are currently surfaced only as completion states; connect profile/contact fields to the editor and announce field-specific errors.

## Process change effective Day 02 — 2026-10-27

Apply [DELIVERY-POLICY.md](DELIVERY-POLICY.md) to every remaining ticket: finish Forma Resume Studio before the next repository, use meaningful scope-driven commits and deliver through its own reviewed PR. A blocked external gate needs a concrete record and next action. This adds delivery gates without moving Day 02–30 product work or changing completed history.
