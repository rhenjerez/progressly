# Progressly

A simple personal weekly progress tracker. Create goals, add weekly tasks, check them off, and spin a wheel when you can't decide what to do next.

Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies.

## Features
- Goal cards with tasks: add, rename, delete, check off, collapse
- Weekly progress (Monday to Sunday) with a progress bar and percentage ring
- Each week has its own completion record. A new week starts fresh and old weeks stay saved
- Spin the Wheel: add your own options and choose how many seconds it spins
- Light and dark mode (follows your system on the first visit)
- Responsive: three columns on desktop, stacked on tablet and phone

## Project structure
```
index.html        Page structure
css/styles.css    All styling, light and dark themes, responsive rules
js/state.js       Constants, icons, helpers, data model, saving (loaded first)
js/week.js        Monday-Sunday week helpers
js/render.js      Draws the header, progress card and goal cards
js/dialog.js      Reusable dialog for naming and confirming
js/goals.js       Goal and task actions, sidebar navigation
js/theme.js       Light/dark toggle
js/wheel.js       Spin the Wheel
js/main.js        Starts the app (loaded last)
assets/           Favicon
_headers          Netlify security headers
netlify.toml      Netlify settings
```
The scripts are plain `<script>` tags that share one global scope, so the **order in `index.html` matters**.

## How it works
The whole app state is one object, `S` (see the top of `js/state.js`). To change anything: update `S`, call `save()`, then call `render()`.

- **Saving:** `localStorage` under the key `progressly-v1`.
- **Weeks:** tasks belong to goals, but completion is stored per week in `S.done["YYYY-MM-DD"]` (the Monday's date).
- **Wheel:** the winner is picked at random first, then the wheel is rotated to land on it. The duration only changes the animation, never the odds.

## Run locally
Double-click `index.html`, or serve the folder:
```
npx serve .
```

## Deploy to Netlify
Leave the build command empty and set the publish directory to `.` (the project root).

**Option 1: drag and drop (easiest)**
1. Go to https://app.netlify.com/drop
2. Drag this whole folder onto the page.

**Option 2: Git**
1. Push this folder to a GitHub repository.
2. In Netlify choose **Add new site > Import an existing project** and pick the repo.
3. Build command: leave empty. Publish directory: `.`
4. Every push to your main branch redeploys automatically.

**Option 3: Netlify CLI**
```
npm i -g netlify-cli
netlify deploy --prod --dir .
```

## Things to know
- Data is saved in the visitor's own browser. It does not sync between devices or browsers, and clearing site data erases it. Your Netlify site and your local copy have separate data.
- `_headers` sets a strict Content-Security-Policy. If you add external scripts, images or fonts, add their domains there.
- The Plus Jakarta Sans font loads from Google Fonts. If it's blocked, the app falls back to the system font.

## Customising
- **Colours:** edit the variables at the top of `css/styles.css` (light) and the two dark blocks right below them.
- **Starting state:** the app starts empty. Change `emptyState()` in `js/state.js` if you want a different default (for example your own name).
- **Wheel limits:** the 12-option cap is in `js/wheel.js`; the 1-60 second range is in the duration input handler in the same file.
