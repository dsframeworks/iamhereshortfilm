# I'M HERE — Setup

## Run locally

```bash
npm ci
npm run dev
npm run build
```

## Configure Supabase admin sign-in

1. Create a Supabase project.
2. In **Project Settings → API**, copy the project URL and publishable/anon key.
3. Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4. Run [`supabase/schema.sql`](supabase/schema.sql) in Supabase SQL Editor.
5. In **Authentication → Users**, create each admin account. Copy its UUID and add it to `public.admins` from the SQL Editor:

   ```sql
   insert into public.admins (user_id) values ('PASTE-USER-UUID-HERE');
   ```

There is no public sign-up. The browser uses only Supabase Auth and reads the signed-in user's own allow-list row. Never put a service-role key in `.env`, the website, or GitHub Pages settings.

## Edit site content and media

- Text and settings live in [`src/content/siteContent.ts`](src/content/siteContent.ts).
- Cast and Crew names, roles, Instagram profiles, and image URLs live in `src/data/filmCredits.ts`.
- Existing stills live in `public/media/stills/`; the trailer lives in `public/media/trailer/`.
- Add or replace media manually in GitHub. Keep filenames unique and build asset URLs with `mediaUrl('stills/filename.png')` or `mediaUrl('trailer/filename.mp4')`; this includes the GitHub Pages repository base path.
- Commit and push changes to `main`. GitHub Actions builds the Vite site and deploys its `dist` output to GitHub Pages.

The `/admin` screen authenticates administrators and links to the GitHub content file. It has no content or media upload controls. Publishing edits directly inside the dashboard would need a trusted server-side GitHub App or function and carefully scoped credentials; that backend is not configured. Do not put a GitHub token in frontend code.

Existing Supabase content/storage data, if any, is not read or changed by this version of the site.
