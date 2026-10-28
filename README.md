# I'M HERE — Official Short Film Website

The official website for **I'M HERE**, built with Vite, React, TypeScript, and Tailwind CSS. GitHub Actions builds and publishes the site to GitHub Pages.

## Project map

- `src/content/siteContent.ts` — GitHub-managed text, film settings, trailer, and gallery references.
- `src/data/filmCredits.ts` — typed Cast and Crew credits, Instagram details, and optional image URLs.
- `public/media/` — poster, stills, and trailer files managed directly in Git.
- `src/` — website components and the Supabase-authenticated admin sign-in.
- `supabase/schema.sql` — the admin authorization allow-list policy.

Edit `src/content/siteContent.ts` for text or settings. Add media under `public/media/`, use `mediaUrl(...)` in the content file, then commit and push to `main`. The Pages workflow rebuilds and deploys automatically.

Supabase is used only for admin authentication and the protected `admins` allow-list. The browser does not publish content to GitHub. Direct in-dashboard publishing would require a trusted server-side GitHub App or function; no GitHub credential belongs in frontend code.

See [SETUP.md](SETUP.md) for local development and admin setup.
