# WorkBridge — Smart Project & Task Collaboration Platform

WorkBridge is a production-ready, full-stack project and task collaboration platform designed to help teams organize projects, assign tasks, track real-time activity, and monitor progress. Built with Next.js, React, Tailwind CSS, Prisma, and MongoDB, it implements strict business validation, role-based access control, and a notification system.

---

## 🚀 Features Overview

### 1. User Authentication & Role-Based Access Control (RBAC)
* **Secure Authentication:** User Signup, Login, Password Hashing, and JWT-based session/token management.
* **Role Permissions:**
  * **ADMIN:** Full system access, analytics viewing, user management, and team settings.
  * **PROJECT_MANAGER:** Create and update projects, manage members, and assign tasks.
  * **TEAM_MEMBER:** Update status of assigned tasks, leave comments, and upload attachments.
* **Fast Access:** Features a "Demo Login" button to immediately sign in as an active workspace user.

### 2. Project Management
* Create, update, delete, and view projects.
* Tracks project metadata: Name, description, start/end dates, and status (`ACTIVE`, `ARCHIVED`).
* Automated progress computation based on completed tasks.

### 3. Task Management
* Tasks live under specific projects with distinct titles, descriptions, assignees, priorities (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), and statuses (`BACKLOG`, `TODO`, `IN_PROGRESS`, `IN_REVIEW`, `BLOCKED`, `COMPLETED`).
* Supports task-level collaborative comments and file attachments.

### 4. Validation & Conflict Handling
* **Duplicate Prevention:** Prevents duplicate task titles within the same project.
* **Valid Deadlines:** Restricts project/task due dates to future dates only.
* **State Protection:** Reassignment is prevented on tasks already marked as completed.

### 5. Team Collaboration & Workload Summary
* Manage project membership (add/remove users).
* Interactive workload summary displays total, completed, and pending tasks per team member.

### 6. Interactive Dashboard & Analytics
* KPI summary cards highlighting total projects, tasks, completed tasks, pending tasks, and overdue items.
* Data-driven charts showing tasks by priority, status distribution, and workload stats.
* Clean list of recent system-wide activity logs and upcoming deadlines.

### 7. Notification System
* Real-time in-app notifications inbox for task assignments, reassignments, completions, and project membership additions.
* Integrated with a custom modular state context to mark items read individually or altogether.

---

## ⚙️ Environment Variables

Create a `.env` file in the root of the project and populate it with the following:

```env
# Application URLs
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1

# Authentication Settings
JWT_SECRET=your_jwt_secret_key_here

# Services
FILE_UPLOAD_API_URL="https://fu-service.vercel.app"

# Database Connection (MongoDB)
DATABASE_URL="mongodb+srv://<username>:<password>@cluster0.xd4auwc.mongodb.net/workbridge"
```

---

## 🔑 Demo Credentials

To test the platform features without manually signing up, use the built-in **Demo Login** option:

* **Email:** `jihadkhan934@gmail.com`
* **Password:** `123456`

---

## 🛠️ Project Setup Instructions

### Prerequisites
Make sure you have the following installed:
* **Node.js** (v18.x or higher)
* **npm** or **yarn**
* **MongoDB** (Local instance or MongoDB Atlas URI)

### Installation Steps

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd workbridge
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and specify the settings outlined in [Environment Variables](#%EF%B8%8F-environment-variables).

4. **Initialize Database & Prisma Client:**
   Sync the database schema and generate the local Prisma client client:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🚀 Deployment Instructions

### Deploying to Vercel (Recommended)

1. **Cloud Database Setup:**
   * Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
   * Whitelist all IP addresses (`0.0.0.0/0`) on your Atlas project network access and copy your connection string.

2. **Configure Vercel Environment Variables:**
   Add all key-value pairs specified in your `.env` file on Vercel's Project Settings dashboard:
   * `NEXT_PUBLIC_URL` (Set to your Vercel deployment URL)
   * `NEXT_PUBLIC_API_URL` (Set to your Vercel deployment URL + `/api/v1`)
   * `DATABASE_URL`
   * `JWT_SECRET`
   * `FILE_UPLOAD_API_URL`

3. **Build settings:**
   Update your `package.json` build command to generate the Prisma client before compiling Next.js:
   ```json
   "scripts": {
     "build": "prisma generate && next build"
   }
   ```
   * **Framework Preset:** Next.js
   * **Build Command:** `npm run build`
   * **Output Directory:** Default (`.next`)

4. **Trigger Deployment:**
   Push your changes to your Git provider (GitHub, GitLab, Bitbucket) linked to your Vercel project to automatically build and deploy.
