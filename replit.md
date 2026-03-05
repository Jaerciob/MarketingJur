# Marketing Jur - Site Institucional

## Overview
Institutional website for the Marketing Jur course (marketing jurídico). Node.js/Express backend serving static HTML/CSS/JS frontend with PostgreSQL database for form submissions.

## Project Structure
- `server.js` — Express server (serves static files + API)
- `index.html` — Main page (single-page site)
- `css/style.css` — Main styles
- `css/responsive.css` — Responsive/mobile styles
- `js/main.js` — Interactive behavior (scroll animations, counters, etc.)
- `Assets/` — Image assets

## Backend
- **Runtime**: Node.js 20 with Express
- **Database**: PostgreSQL (Replit built-in)
- **Port**: 5000

## API Endpoints
- `POST /api/submissions` — Save form submission (body: form_type, nome, whatsapp, email). Sends welcome email via Resend after saving.
- `GET /api/submissions` — List submissions (optional query: ?form_type=curso-online|mentoria|corporate)

## Email Service
- **Provider**: Resend (via Replit integration)
- **Module**: `emailService.js` — handles welcome/confirmation emails
- **Trigger**: Automatic on form submission (async, non-blocking)
- **Template**: Professional HTML email with course branding, personalized greeting, and next steps info

## Database Schema
- **form_submissions** table: id (serial PK), form_type (varchar), nome (varchar), whatsapp (varchar), email (varchar), created_at (timestamp)

## Forms
Three modal forms connected to the database:
1. **Curso Online** (form_type: curso-online) — Course enrollment
2. **Mentoria Individual** (form_type: mentoria) — Mentoring scheduling
3. **Corporativo** (form_type: corporate) — Corporate quote request

## Running
```
node server.js
```
Configured as workflow "Start application" on port 5000.

## Deployment
Configured as autoscale deployment with `node server.js`.
