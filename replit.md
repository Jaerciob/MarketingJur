# Marketing Jur - Site Institucional

## Overview
Static institutional website for the Marketing Jur course (marketing jurídico), built in pure HTML, CSS, and JavaScript. No build system or package manager required.

## Project Structure
- `index.html` — Main page (single-page site)
- `css/style.css` — Main styles
- `css/responsive.css` — Responsive/mobile styles
- `js/main.js` — Interactive behavior (scroll animations, counters, etc.)
- `Assets/` — Image assets

## Running
The site is served via Python's built-in HTTP server:
```
python3 -m http.server 5000 --bind 0.0.0.0
```
Configured as workflow "Start application" on port 5000.

## Deployment
Configured as a static site deployment with `publicDir: "."`.
