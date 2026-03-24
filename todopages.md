# New Pages — Commit `0a994f7`

All 18 pages are fully static, hardcoded data, Server Components. No CMS integration yet.

---

## Company

| Status | Page | Route |
|--------|------|-------|
| [ ] | Company Hub | `/company` |
| [ ] | Our Philosophy | `/company/our-philosophy` |
| [ ] | Awards & Recognition | `/company/awards` |
| [ ] | Koichi Kawai | `/company/koichi-kawai` |

## Institutions

| Status | Page | Route |
|--------|------|-------|
| [ ] | EPIC Program | `/institutions/epic-program` |
| [ ] | Financial Assistance | `/institutions/financial-assistance` |
| [ ] | Institutional Fleet | `/institutions/institutional-fleet` |
| [ ] | Loan Programs | `/institutions/loan-programs` |
| [ ] | Testimonial Videos | `/institutions/testimonial-videos` |

## Technology

| Status | Page | Route |
|--------|------|-------|
| [ ] | ABS Truth | `/technology/abs` |
| [ ] | ABS-Carbon | `/technology/carbon-fiber-technology` |
| [ ] | Piano Action | `/technology/piano-action` |
| [ ] | Sound Technology | `/technology/sound-technology` |
| [ ] | Soundboard Speaker System | `/technology/soundboard-speaker-system` |
| [ ] | Wooden Key Actions | `/technology/wooden-key-actions` |

## Standalone

| Status | Page | Route |
|--------|------|-------|
| [ ] | Distinguished Owners | `/distinguished-owners` |
| [ ] | The Winner's Choice | `/the-winners-choice` |
| [ ] | Glossary | `/glossary` |

---

## Notes

- All pages are currently hardcoded static data — not CMS-driven
- `testimonial-videos` is a placeholder layout with no actual video embeds
- `/glossary` acts as a sitemap/hub linking to all Technology, Company, and Institutions sub-pages
- `/company` is a hub page linking to sub-sections (timeline, philosophy, awards, Koichi Kawai, distinguished owners)
- These pages are gated behind `NEXT_PUBLIC_MIGRATION_NAV=true` in the Resources nav dropdown
