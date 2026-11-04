# YOUO
Static site: HTML + CSS + vanilla JS. No build step, no dependencies.

## Run
Serve the folder over HTTP so the browser can load the background video. From this folder, run `python -m http.server 8000`, then open `http://localhost:8000`. Opening `index.html` directly (`file://`) may prevent the video from playing.

## Replace your assets
- **Browser tab icon:** replace `favicon.png` and `favicon.ico` to customize the YOUO crown favicon.
- **Background video:** `assets/videos/PLACE_VIDEO_HERE.MP4` (or use Settings → file/URL in the page). If missing, a dark purple fallback shows.
- **Birthday countdown:** edit `birthDate` in `js/config.js`; the page counts down to the next February 26.
- **Music:** replace `assets/music/track-01.mp3` with the audio for the configured song.
- **Album art:** “Supernatural” by Ariana Grande uses the cover artwork from the Spotify album linked in `js/config.js`.
- **Owner-managed music:** open `?owner=1` and sign in to update the song for every visitor. First create/confirm the owner account in Supabase Auth using the owner's email and a password. In the SQL Editor, replace every `OWNER_EMAIL_HERE` placeholder in `supabase/setup.sql` with that email, then run the script. Enable password sign-in and disable public sign-ups after creating the owner account. The browser uses only the Supabase project URL and publishable key; never put a `service_role` or secret key in this site. Audio uploads are limited to 50 MB and covers to 5 MB.
- **Social links:** edit `social` in `js/config.js`.
- **Decorations/logo:** `assets/images/decorations/wordmark.png` is the YOUO crown, butterflies, and wordmark artwork, with a transparent background and a soft glow for readability.
- **Video appearance:** the background video uses a subtle 12% dark overlay by default, with no purple tint. Optional overlay controls are available in Settings and can be configured in `overlay` in `config.js`.

## Structure
`css/` style, components, animations, responsive · `js/` config, birthday, music-player, owner-music, video-background, controls, settings, main · `supabase/setup.sql` database, storage, and owner-only access policies.
