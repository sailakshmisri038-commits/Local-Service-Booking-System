# LocalConnect — Local Service Booking and Management System

**A Full-Stack Web Platform for On-Demand Local Services & Technician Scheduling**  
*Built for B.Tech Final-Year Capstone Project Evaluation*

---

## 📌 Executive Summary & Problem Statement

In metropolitan and suburban neighborhoods, customers frequently struggle to discover verified local service providers (plumbers, electricians, appliance technicians, and home cleaners). Existing methods suffer from:
1. **Unreliable Scheduling & Double-Booking:** Phone-based scheduling frequently leads to slot overlaps and missed visits.
2. **Opaque Pricing:** Hidden travel fees and lack of upfront service catalogs.
3. **No Centralized Dashboard:** Independent technicians lack tools to view booking requests, manage working hours, and verify credentials.

**LocalConnect** addresses these challenges by delivering a centralized, role-based platform connecting households with verified local professionals through real-time calendar slot reservation and atomic conflict prevention.

---

## 🛠️ Technology Stack

| Layer | Technology | Rationale / Academic Justification |
| :--- | :--- | :--- |
| **Frontend UI** | **React 19 + TypeScript** | Component-based, highly reusable architecture with strict compile-time type safety. |
| **Styling** | **Tailwind CSS v4** | Utility-first, mobile-responsive design following modern clean white with electric blue accents. |
| **Icons** | **Lucide React** | Lightweight SVG iconography for service categories and dashboard indicators. |
| **Routing** | **React Router v7** | Client-side routing with role-based protected route guards. |
| **Database & Auth** | **Supabase (PostgreSQL 15+)** | Relational data integrity, Row Level Security (RLS) policies, and JWT token authentication. |
| **Hosting & CI/CD** | **Vercel** | Edge network deployment with automated Git integration and SPA rewrite routing. |

---

## 👥 User Roles & Capability Matrix

### 1. Customer
- Browse categorized services (Plumbing, Electrical, Cleaning, Appliance, Carpentry, etc.).
- Search and filter by keyword, city location, price range, and minimum rating.
- View provider business profiles, certifications, services catalog, and verified reviews.
- Choose appointment date and 60-minute time window with **real-time conflict prevention**.
- Manage active appointments (Pending, Confirmed) and past history.
- Cancel appointments or submit 1-to-5 star reviews after job completion.

### 2. Service Provider
- Provider Management Console with real-time incoming booking notifications.
- Accept or reject appointment requests.
- Mark ongoing appointments as "Completed".
- Add and configure services with descriptions, duration, and prices (₹).
- Configure weekly working hours and daily availability.
- View settled revenue and job performance metrics.

### 3. Administrator
- Administrative Operations Portal.
- **Provider Verification Desk:** Review pending technician applications; approve or reject verification.
- **Category Management:** Supervise active service taxonomy.
- **Transaction Audit Log:** Monitor global platform appointments and detect scheduling conflicts.

---

## 🛡️ Double-Booking Prevention & Concurrency Control

To prevent concurrent appointment overlaps, LocalConnect implements a two-tier defense:

1. **Client & Context Level:**  
   Before any booking is submitted, the slot reservation engine verifies that no existing booking matches `provider_id`, `booking_date`, and `time_slot` with an active status (`pending` or `confirmed`). Conflicting slots are immediately greyed out and tagged as "Booked".
2. **Database Engine Level (PostgreSQL Constraint):**  
   In [supabase/schema.sql](file:///c:/Users/SAILAKSHMI/Documents/Local%20Service%20Booking%20System/supabase/schema.sql), a unique partial index enforces slot uniqueness at the storage layer:
   ```sql
   CREATE UNIQUE INDEX idx_no_double_booking 
   ON public.bookings (provider_id, booking_date, time_slot) 
   WHERE status IN ('pending', 'confirmed');
   ```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended; v22 supported)
- npm or yarn

### 1. Installation
Clone or navigate to the repository folder:
```bash
cd "Local Service Booking System"
npm install
```

### 2. Launch Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 3. Interactive Role Switcher
In the navigation bar, use the **"Role: Customer"** pill to instantly switch between:
- **Customer:** Ananya Sharma (flat leak repairs, bookings ledger)
- **Provider:** Rajesh Kumar (Apex Plumbing Solutions console)
- **Admin:** System Superuser (verification queue & analytics)

---

## 🗄️ Supabase Database Integration

When you are ready to link a live cloud Supabase project:

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase Dashboard.
3. Paste and run the complete migration script located in:
   [supabase/schema.sql](file:///c:/Users/SAILAKSHMI/Documents/Local%20Service%20Booking%20System/supabase/schema.sql)
4. Copy your project credentials from **Project Settings $\rightarrow$ API**.
5. Create a `.env` file in the root folder:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```
6. Restart the development server. The application will connect directly to your PostgreSQL database.

---

## 🌐 Deployment to Vercel

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. Log in to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import this repository.
4. Set the Build Command to `npm run build` and Output Directory to `dist`.
5. Under **Environment Variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click **Deploy**. Vercel will build and deploy the production SPA with `vercel.json` rewrites enabled.

---

## 🎓 Final-Year Viva & Evaluation Checklist

- [x] **Relational Schema Design:** 3NF compliant tables with foreign keys, enums, and automated triggers.
- [x] **Concurrency & Atomicity:** Database-level double-booking prevention constraint.
- [x] **Role-Based Access Control (RBAC):** Distinct dashboards and route protection for Customer, Provider, and Admin.
- [x] **Clean Architecture:** Separation of concerns between UI components, context providers, data models, and services.
- [x] **Responsive UI:** Modern, mobile-first design with Tailwind CSS and clean white/blue aesthetic.
