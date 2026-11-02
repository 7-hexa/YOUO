# YOUO
Static site: HTML + CSS + vanilla JS. No build step, no dependencies.

## Run
Serve the folder over HTTP so the browser can load the background video. From this folder, run `python -m http.server 8000`, then open `http://localhost:8000`. Opening `index.html` directly (`file://`) may prevent the video from playing.

## Replace your assets
- **Browser tab icon:** replace `favicon.png` and `favicon.ico` to customize the YOUO crown favicon.
- **Background video:** put it at `assets/videos/PLACE_VIDEO_HERE.MP4` (or use Settings → file/URL in the page). If missing, a dark purple fallback shows.
- **Music:** replace `assets/music/track-01.mp3` with the audio for the configured song.
- **Album art:** the single configured song is “Snooze” by SZA and uses the original *SOS* album artwork from Apple Music.
- **Social links:** edit `social` in `js/config.js`.
- **Decorations/logo:** `assets/images/decorations/wordmark.png` is the YOUO crown, butterflies, and wordmark artwork, with a transparent background and a soft glow for readability.
- **Video appearance:** the background video displays with no dark or purple overlay by default. Optional overlay controls are available in Settings and can be configured in `overlay` in `config.js`.

## Structure
`css/` style, components, animations, responsive · `js/` config, clock, music-player, video-background, controls, settings, main.
