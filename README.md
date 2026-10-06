# IFE-mini-project
A mini IFE project for the interview


# Mini IFE Portal

A small in-flight-entertainment (IFE) style web app: a movie and TV catalog with an HLS video player, where the branding changes per airline through a config file. I built it to learn how IFE-style systems work: locally served content, adaptive video streaming, and per-customer customization.

> Titles, descriptions, and posters are fictional placeholders. Video plays from a public HLS test stream.

## Features

- **Catalog:** poster grid with category tabs (Movies, TV, Kids), responsive from phone to large seatback-style screens.
- **Player:** HLS playback with `hls.js`, native HLS fallback for Safari, and a friendly error message when a stream fails.
- **Airline customization:** each "airline" is a config file with its name, logo, colors, and allowed categories. Same codebase, different look.
- **Keyboard-friendly:** cards are real links with visible focus outlines, which matters for remote or d-pad navigation on seatback screens.

## Tech stack

React, Vite, React Router, hls.js, plain CSS with CSS variables.

## Run it

```bash
git clone <your-repo-url>
cd ife-project
npm install
npm run dev
```

Open `http://localhost:5173/`.

To try the second airline: `http://localhost:5173/?airline=sunrise`

**Open it on a phone (simulating passenger devices):**

```bash
npm run dev -- --host
```

Then open the printed Network address (for example `http://192.168.1.25:5173/`) on a phone connected to the same Wi-Fi.

## How the config system works

```
src/
  config/
    skyways.json     # airline name, logo, colors, categories
    sunrise.json
  data/
    content.json     # catalog titles and video URLs
  theme.js           # picks the airline and applies the theme
  pages/
    Catalog.jsx
    Player.jsx
  components/
    Header.jsx
```

1. `theme.js` reads the `?airline=` value from the URL, looks up the matching config, and falls back to the default airline (SkyWays).
2. `applyTheme()` runs before React renders and sets the airline colors as CSS variables (`--color-primary`, etc.).
3. All styles use those variables, so the whole UI recolors without touching component code.
4. Components read the config for the airline name, logo, and which categories to show.

**Add a new airline:** create `src/config/<name>.json`, import it in `theme.js`, add it to the `airlines` object, and visit `/?airline=<name>`.

**Content flow:**

```
content.json -> Catalog (filtered by airline categories) -> /watch/:id -> Player (hls.js)
```

## How playback works

HLS splits a video into small segments plus a manifest (`.m3u8`) that lists them. `hls.js` reads the manifest, downloads segments in sequence, and feeds them to the HTML5 `<video>` element, switching quality to match the connection. The player cleans up the `hls.js` instance when the component unmounts to avoid leaks.

## What I learned

- **HLS streaming:** inspecting the manifest and segment requests in the browser's Network tab made the protocol concrete.
- **Effect cleanup in React:** the `hls.js` instance must be destroyed on unmount. React StrictMode also runs effects twice in development, which showed why cleanup matters.
- **Avoiding setState inside effects:** I stored each error together with the video URL it belongs to, so errors clear themselves when the title changes.
- **Config-driven design:** separating customer-specific data from code makes customization cheap.
- **Tooling problems:** I debugged a filename-casing mismatch on Windows (works locally, breaks on Linux/Mac) and a "duplicate React" crash caused by a stray `package.json` in a parent folder.

## Known limitations

- The airline is chosen once at page load from the URL, so opening `/watch/1` directly falls back to the default airline unless `?airline=` is included.
- All titles use the same test stream, and the video comes from the internet rather than a local server.
- There is no authentication or content protection. Anyone who can reach the app can watch everything.

## What I'd do next

- **Real content protection:** encrypted streams with DRM (Widevine, PlayReady, FairPlay) and a license server. At a smaller scale, short-lived signed tokens per seat session to control who can fetch content.
- **Offline-first delivery:** host the video segments on the local machine so the demo works with no internet, the way an aircraft's onboard server delivers content.
- **Content management:** replace `content.json` with an admin tool or API so airlines can update their catalog without code changes.
- **Server-side airline config:** load each customer's config from the server instead of the URL.
- **Accessibility:** captions and subtitles, audio descriptions, full keyboard and remote navigation, and screen reader testing.
- **Low-end device testing:** profile performance on slow hardware similar to seatback screens, and optimize image sizes and bundle size.
- **Automated tests:** unit tests for the theme loader and catalog filtering, plus a basic end-to-end test of the player flow.