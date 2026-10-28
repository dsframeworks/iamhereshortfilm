# I'M HERE — Official Short Film Website

A premium, light-themed single-page site for the short film **I'M HERE**, with a
full-screen background trailer, live release countdown, and a hidden
Supabase-powered admin dashboard at `/admin`.

* **Stack:** Vite + React + TypeScript + Tailwind CSS v4
* **Backend:** Supabase (Auth, Postgres, Storage) with Row Level Security
* **Public route:** `/`  ·  **Admin route:** `/admin` (no link to it appears on the public site)

The site runs **without** Supabase configured — it shows built-in fallback
content. To make content editable and persistent you must connect Supabase.

\---

## 1\. Configure Supabase

1. Create a project at [https://supabase.com](https://supabase.com).
2. In **Project Settings → API**, copy the **Project URL** and the **anon / publishable** key. (https://dpikajgiydipjpctttrv.supabase.co) (sb\_publishable\_9Sd5mNojMmbT0-fMFy3TgA\_3I\_6zz-z)
3. Copy `.env.example` to `.env` and fill them in:

```bash
   cp .env.example .env
   ```

```
   VITE\_SUPABASE\_URL=https://YOUR-PROJECT-ref.supabase.co
   VITE\_SUPABASE\_ANON\_KEY=your-anon-publishable-key
   ```

> Never put the `service\_role` key in `.env` or any frontend file.

## 2\. Create the database schema, RLS policies \& storage bucket

Open **Supabase → SQL Editor → New query**, paste the full contents of
[`supabase/schema.sql`](supabase/schema.sql), and run it. This creates:

* `admins` table (who is allowed to edit) — protected, not writable from the browser
* `content` table with `published` + `draft` rows (all editable content as JSONB)
* RLS policies: **public can read only the published row**; **only admins can write**
* A public-read / admin-write **`media`** Storage bucket for posters, trailer, stills, photos

## 3\. Create the first admin account (securely, no public signup)

1. **Supabase → Authentication → Users → Add user.** Set an email + password.
(There is intentionally no public registration.)
2. Copy that user's **UUID**, then in the SQL Editor run:

```sql
   insert into public.admins (user\_id) values ('PASTE-USER-UUID-HERE');
   ```

3. That account can now sign in at `/admin`. Repeat for more admins.

## 4\. Run locally

```bash
npm install
npm run dev      # http://localhost:5173  (admin at /admin)
npm run build    # production build
```

## 5\. Using the dashboard

Sign in at `/admin`, then edit across the tabs:

* **General settings** — title, tagline, synopsis, genre, language, runtime, release date/message, SEO, social image, links
* **Hero \& trailer** — upload/replace/remove the trailer video, poster \& fallback poster; YouTube URL \& button text; mute default; overlay darkness; countdown date/time/timezone/message
* **Technical specs** — runtime, resolution, aspect ratio, frame rate, camera, audio, cinematography, editing, color grading, post-production
* **Cast \& crew** — add/edit/reorder/remove entries (name, role, character, photo, bio, social link)
* **Gallery \& stills** — multi-upload images with captions \& alt text, reorder, delete
* **Media library** — browse everything in Storage, preview, delete (with confirmation)

**Save draft** writes to the `draft` row. **Preview** renders the draft without
publishing. **Publish** copies the draft into the `published` row — the live site
updates immediately and persists across refresh and redeploys. A confirmation is
required before publishing.

> Enter the film's \*\*real\*\* details. The project ships with placeholder specs and
> no cast names — nothing is invented for you.

## 6\. Deploy

Deploy the built site to any static host (e.g. Vercel). Add the two `VITE\_`
environment variables in the host's project settings, then redeploy. Published
content lives in Supabase, so it survives redeployment.

\---

## Security notes

* Admin authorization is enforced **server-side** by RLS via `public.is\_admin()`,
which checks `auth.uid()` against the `admins` table. The browser can never
grant itself admin rights, and no role/flag from the client is trusted.
* Only the **anon/publishable** key is used in the frontend, and every table has
RLS enabled. The `service\_role` key is never shipped to the browser.
* Uploads validate file type and size; text inputs are length-limited and
stripped of angle brackets before saving.
* The private `draft` row is unreadable to anonymous visitors.

