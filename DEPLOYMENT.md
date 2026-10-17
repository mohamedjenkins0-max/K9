# K9 Century Education Management System — Deployment & Architecture Guide

**Institutions Covered:**
1. **K9 Century School** (14 Wilkinson Road, Freetown, Sierra Leone)
2. **K9 Century Vocational Institute** (88 Bai Bureh Road, Kissy, Freetown, Sierra Leone)

---

## 1. System Overview & Technology Stack

- **Framework:** React 19 + TypeScript + Vite (Vercel-ready)
- **Styling:** Tailwind CSS (Sierra Leone brand colours: Emerald Green `#047857`, Crisp White `#FFFFFF`, Royal Cobalt Blue `#1D4ED8`)
- **Database Engine:** PostgreSQL via Supabase with Row Level Security (RLS)
- **Currency:** Sierra Leonean Leone (SLE)
- **Timezone:** `Africa/Freetown` (GMT)
- **Localization:** English (Active) with foundational Krio glossary tokens

---

## 2. Environment Variables Configuration

Copy `.env.example` to `.env` or set these in your Vercel Project Environment Variables:

```bash
# ==============================================================================
# SUPABASE POSTGRESQL & AUTH
# ==============================================================================
# Obtain from Supabase Project Settings -> API:
VITE_SUPABASE_URL="https://your-project.supabase.co"

# Public anon key (Safe for client browser, subject to Row Level Security):
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI..."

# Backend secret role key (DO NOT expose in client code; server edge only):
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI..."

# Institutional defaults:
VITE_DEFAULT_CURRENCY="SLE"
VITE_TIMEZONE="Africa/Freetown"
```

---

## 3. Supabase Database Deployment Instructions

1. **Create Supabase Project:**
   - Log in to [supabase.com](https://supabase.com) and create a new project named `k9-century-ems`.
   - Select your preferred cloud region (e.g., `eu-west-1` or `eu-central-1`).

2. **Execute Database Migrations:**
   - In your Supabase Dashboard, open the **SQL Editor**.
   - Copy and run the contents of `/supabase/migrations/20261017000001_initial_schema.sql` to establish all tables:
     - `institutions`, `profiles`, `admission_applications`, `admission_documents`, `students`, `staff`, `classes`, `subjects`, `attendance`, `grades`, `learning_materials`, `announcements`, `audit_logs`.
   - Next, copy and run `/supabase/migrations/20261017000002_row_level_security.sql` to enable RLS across all tables and enforce multi-tenant isolation.
   - Run `/supabase/seed.sql` to seed the database with initial institutional profiles, academic streams, and faculty contacts.

3. **Storage Bucket Configuration:**
   - Navigate to **Storage** -> **Create New Bucket**.
   - Name: `admission-documents`
   - Privacy: **Private** (Not public). Access is granted only via authenticated download tokens.

---

## 4. Vercel Deployment Instructions

1. Push your repository to GitHub or GitLab.
2. In the Vercel Dashboard, click **Add New Project** and import the repository.
3. Configuration:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add the environment variables from Section 2 (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
5. Click **Deploy**. Vercel will build the application using the included `/vercel.json` SPA rewrite rules and security headers.

---

## 5. Security & Row-Level Security (RLS) Verification

The system enforces deny-by-default access:
- **Tenant Isolation:** Queries from K9 Century School are blocked at the database level from accessing K9 Century Vocational Institute records.
- **Unpublished Marks Privacy:** Teachers enter draft Continuous Assessment (30%) and Examination (70%) marks. Students and parents can **only** query grades where `is_published = true` and `student_id = auth.uid()`.
- **Administrative Immutability:** Audit logs record all admission approvals, mark publications, and grade updates. Deleting or updating audit logs is blocked.

### Automated Test Suite
Open the **Security & RLS Console** in the dashboard to execute the live automated verification suite:
- `SEC-001`: Multi-Tenant Institution Data Isolation (0 leakage)
- `SEC-002`: Unpublished Mark Protection under Student/Parent roles
- `SEC-003`: Academic Score Hardening (CA capped at 30, Exam capped at 70)
- `SEC-004`: Enrolment Identity & Unique Student Number Generation
- `SEC-005`: Administrative Action Audit Trail Integrity

---

## 6. Feature Delivery Status Matrix

| Module | Status | Description |
|---|---|---|
| **Multi-Tenant Separation** | **COMPLETED & TESTED** | Separate tables, schemas, classes, and students for School & Vocational |
| **5 Role-Based Dashboards** | **COMPLETED & TESTED** | Super Admin, School Admin, Teacher, Student, Parent with persona switchers |
| **Public Admission Form** | **COMPLETED & TESTED** | Anti-spam honeypot, document uploads, unique `APP-2026-...` tracking |
| **Admissions Approval & Student ID** | **COMPLETED & TESTED** | Approval dossier, reject reasons, auto ID generator, printable letter |
| **Continuous Assessment & Grading** | **COMPLETED & TESTED** | CA (30%) + Exam (70%), WAEC A-F grading scale, publish moderation |
| **Daily Attendance Tracker** | **COMPLETED & TESTED** | Class roll-call, bulk mark all present, attendance compliance |
| **Learning Materials & Syllabi** | **COMPLETED & TESTED** | Category filters, upload modal, permission-controlled downloads |
| **School Announcements** | **COMPLETED & TESTED** | Priority flags (Urgent/Important), pinned notices, target audience |
| **Birthday Wishes Section** | **COMPLETED & TESTED** | Birth year masked for student privacy, printable official card designer |
| **Campus & School Information** | **COMPLETED & TESTED** | Official Freetown contacts, Leone (SLE), Krio language roadmap |
| **Automated Security Tests** | **COMPLETED & TESTED** | In-browser test runner verifying RLS and tenant boundaries |
| *Mobile Money (Orange/Afrimoney)* | *Phase 2 Planned* | Tuition fees, bursary reconciliations, and digital payment slips |
| *SMS Gateway Broadcasts* | *Phase 2 Planned* | Automated parent SMS alerts for attendance and emergency notices |
| *Android Offline Application* | *Phase 2 Planned* | Offline attendance and workshop logbook synchronizer |
