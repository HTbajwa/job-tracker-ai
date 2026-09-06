# JobTracker, AI-Powered Job Application Tracker

A full-stack job application tracker built with **Laravel, Inertia.js, and React**, featuring a drag-and-drop Kanban board, AI-powered resume match scoring, AI-generated cover letters, and application insights  built as a portfolio project to demonstrate full-stack + AI integration skills.

**Live demo:** [Not Deployed yet but you can see code]
**Demo account:** `demo@jobtracker.test` / `demo1234` (or use "Register" to create your own account)

---

## Features

### Core
- Full CRUD for job applications company, role, status, applied date, job URL, notes
- Kanban board (drag-and-drop status changes) with a List/table view toggle
- Search and filter by company, role, and status
- Soft deletes with a confirmation modal
- Follow-up reminder dates, surfaced on the dashboard and in application details
- Pagination on the List view; per-column scrolling on the Kanban board (tested with 170+ seeded applications)

### AI-Powered (via Groq / OpenAI-compatible API)
- **Match Score**  paste a job description, get a percentage match against your saved resume plus a list of missing keywords
- **Cover Letter Generator**  generates a short, tailored cover letter per job description (edit-in-place, copy button)
- **Application Insights**  a dashboard summary that surfaces real patterns from your own stored applications (e.g. "your Laravel/React roles get 3x more responses than WordPress roles")  the numbers are calculated in PHP; the AI only phrases them, so figures are never invented
- Response caching keyed on a hash of the job description (+ resume), so re-submitting the same input reuses the stored result instead of calling the AI provider again (cost/rate-limit control)

### Auth
- Registration/login (Laravel Breeze + Inertia + React)
- Email verification and password reset (SMTP)
- PDF resume upload (parsed server-side to plain text) or paste-as-text, editable anytime from Profile
- Password confirmation modal before destructive actions (delete account)

### Dashboard
- Stat cards (total applications, response rate, applications this week)
- Status breakdown chart (Recharts)
- Upcoming follow-ups list

---

## Tech Stack

| Layer | Choice |
|---|---|
| Backend | Laravel 13, SQLite |
| Frontend | Inertia.js + React, Tailwind CSS |
| Drag & drop | @dnd-kit |
| Charts | Recharts |
| Icons | lucide-react |
| AI | Groq API (OpenAI-compatible `/chat/completions`) |
| PDF parsing | smalot/pdfparser |
| Auth scaffolding | Laravel Breeze (Inertia + React stack) |
| Deployment | Render (free web service) |

---

## Why these choices (a few notes for reviewers)

- **SQLite instead of MySQL**  the app's scale (a personal tracker, not a multi-tenant SaaS) doesn't need a separate database server. Using SQLite everywhere (dev and production) removes a whole layer of hosting cost/complexity and avoids MySQL/SQLite behavioral mismatches between environments.
- **Groq instead of Gemini**  the project originally targeted the Gemini API, but Gemini's free tier required billing verification that wasn't available from this region at the time. AI calls are isolated behind a single `AiService` class, so switching providers meant changing one file  the controllers, routes, and frontend were untouched.
- **Match Score / Insights don't let the AI invent numbers** anything statistical (application counts, response rates, percentages) is calculated in PHP from real database records. The AI is only ever asked to phrase or summarize numbers it's given, not calculate new ones  this avoids AI hallucination affecting anything the user could act on.
- **Authorization via Policies**  every application-scoped route checks a `ApplicationPolicy` so one user can never view, edit, or run AI actions against another user's data, even via direct URL manipulation.

---

## Known Limitations (by design, for a demo project)

- **Password reset / verification emails may land in spam.** They're sent via personal Gmail SMTP for this demo. A production deployment would use a dedicated transactional email service (e.g. Resend, Mailgun) with a verified sending domain.
- **AI responses depend on Groq's free-tier rate limits.** Prompts are truncated and requests retry with backoff, but heavy back-to-back testing can still occasionally hit a 429.
- **No admin panel.** The app is intentionally single-role  every account only ever sees its own data, with no cross-user visibility.

---

## Local Setup

### Requirements
- PHP 8.3+
- Composer
- Node.js + npm
- A [Groq API key](https://console.groq.com/keys) (free, no credit card)

### Steps

```bash
git clone https://github.com/HTbajwa/job-tracker-ai.git
cd job-tracker-ai

composer install
npm install

cp .env.example .env
php artisan key:generate
```

Create the SQLite database file:

```bash
# Mac/Linux
touch database/database.sqlite

# Windows (PowerShell)
New-Item database\database.sqlite -ItemType File
```

Add your Groq API key and mail credentials to `.env`:

```
GROQ_API_KEY=your_key_here
GROQ_MODEL=openai/gpt-oss-120b

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_gmail_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your_email@gmail.com
```

Run migrations and seed demo data:

```bash
php artisan migrate
php artisan db:seed --class=DemoDataSeeder
```

Start the dev servers:

```bash
php artisan serve
npm run dev
```

Visit `http://127.0.0.1:8000` — log in with the demo account or register a new one.

---

## Project Structure Highlights

```
app/
  Http/Controllers/
    ApplicationController.php   # CRUD, search/filter, Kanban status updates
    AiMatchController.php       # Match score + cover letter endpoints, with caching
    DashboardController.php     # Stats, chart data, cached AI insight
  Services/
    AiService.php               # All AI provider calls isolated here
    ResumeParserService.php     # PDF → plain text extraction
  Policies/
    ApplicationPolicy.php       # Per-user data isolation
database/
  migrations/                   # applications, ai_matches, resume_text/path on users
  factories/ApplicationFactory.php
resources/js/
  Pages/                        # Inertia pages (Dashboard, Applications, Auth, Profile)
  Components/                   # KanbanBoard, KanbanCard, ConfirmModal, PasswordInput, etc.
  Layouts/SidebarLayout.jsx     # Shared app shell
```

---

## Author

**Hadia Tariq** Full-Stack Web Developer
[GitHub](https://github.com/HTbajwa) · [Portfolio](https://hadia-tariq.netlify.app) · [LinkedIn](https://linkedin.com/in/hadia-tariq-738624287)