# Implementation Instructions

You are a senior Full-Stack Software Engineer working inside an existing Next.js application.

The project already contains:

- Next.js (App Router)
- TypeScript
- Prisma ORM
- MongoDB
- Tailwind CSS
- SWR
- React Hook Form
- Zod
- Zustand
- JWT Authentication

Your responsibility is to continue development while following the existing architecture, coding conventions, folder structure, naming standards, and reusable components already present in the project.

Do NOT generate a new project structure.

Always analyze existing code before creating new files.

---

# Project Goal

Build a production-ready Smart Project & Task Collaboration Platform.

The system allows organizations to manage:

- Users
- Projects
- Teams
- Tasks
- Comments
- Attachments
- Notifications
- Activities
- Analytics

The application must be scalable, maintainable, secure, and follow real-world business workflows.

---

# Development Rules

## Before Writing Code

Always:

1. Analyze existing project structure.
2. Reuse existing components.
3. Reuse existing utilities.
4. Reuse existing hooks.
5. Reuse existing API response helpers.
6. Reuse existing validation patterns.
7. Reuse existing middleware.
8. Reuse existing Prisma client instance.

Never duplicate functionality.

---

# Architecture Requirements

Follow Feature-Based Architecture.

Example:

src/
├── app/
├── components/
├── modules/
│ ├── auth/
│ ├── users/
│ ├── projects/
│ ├── tasks/
│ ├── comments/
│ ├── notifications/
│ └── activities/
├── lib/
├── hooks/
├── store/
├── prisma/
└── types/

Each feature should contain:

- Components
- Hooks
- Services
- Schemas
- Types
- Actions

---

# Authentication

Implement JWT Authentication.

Features:

- Register
- Login
- Logout
- Protected Routes

Requirements:

- Hash passwords using bcrypt
- Validate requests using Zod
- Store JWT securely
- Middleware-based authentication
- Middleware-based authorization

---

# RBAC

Roles:

ADMIN
PROJECT_MANAGER
TEAM_MEMBER

Create reusable permission helpers.

Example:

canCreateProject()
canEditProject()
canDeleteProject()
canAssignTask()

Avoid hardcoded role checks throughout the application.

---

# Database Design

Use Prisma with MongoDB.

Generate models for:

- User
- Project
- ProjectMember
- Task
- Comment
- Attachment
- Notification
- ActivityLog

Use:

- createdAt
- updatedAt

on all entities.

Add indexes where appropriate.

---

# API Standards

Use:

/api/v1

Example:

/api/v1/auth
/api/v1/users
/api/v1/projects
/api/v1/tasks

Requirements:

- Proper HTTP status codes
- Standard response format
- Error handling middleware
- Validation middleware

Response Format:

{
success: true,
message: "Success",
data: {}
}

Error Format:

{
success: false,
message: "Validation Error",
errors: []
}

---

# Project Module

Implement:

- Create Project
- Update Project
- Delete Project
- Archive Project
- Project Members
- Project Dashboard

Validation:

- Unique project name
- Valid date range
- Archived projects cannot receive tasks

---

# Task Module

Implement:

- Create Task
- Update Task
- Delete Task
- Assign Task
- Reassign Task
- Change Status

Task Status:

BACKLOG
TODO
IN_PROGRESS
IN_REVIEW
BLOCKED
COMPLETED

Validation Rules:

- No duplicate task title inside same project
- Due date cannot be past
- Completed task cannot be reassigned
- Completed task cannot return to TODO
- Assignee must belong to project

---

# Activity Logging

Automatically log:

- Project Created
- Project Updated
- Task Created
- Task Updated
- Task Assigned
- Task Completed
- Member Added

Create centralized activity logging service.

Never duplicate activity log logic.

---

# Notifications

Create notification service.

Trigger notifications when:

- Task Assigned
- Task Reassigned
- Task Completed
- Member Added
- Deadline Approaching

Notification fields:

- title
- message
- userId
- isRead

---

# Dashboard

Implement APIs for:

- Total Projects
- Active Projects
- Total Tasks
- Completed Tasks
- Overdue Tasks
- Team Members

Analytics:

- Task Status Distribution
- Task Priority Distribution
- Project Progress
- Member Productivity

---

# Search & Filtering

Projects:

- name
- code
- status

Tasks:

- title
- status
- priority
- assignee

Requirements:

- Pagination
- Sorting
- Filtering
- Search

Server-side implementation preferred.

---

# Forms

Use:

- React Hook Form
- Zod Resolver

Requirements:

- Shared validation schemas
- Reusable form components
- Consistent error handling

---

# UI Requirements

Use existing UI system.

Requirements:

- Responsive
- Mobile Friendly
- Dark Mode Compatible
- Loading States
- Empty States
- Error States

Avoid duplicated UI patterns.

Create reusable:

- DataTable
- Modal
- Form Components
- Status Badge
- Pagination Component

---

# Code Quality

Always:

- Use TypeScript strictly
- Avoid any type
- Create reusable hooks
- Create reusable services
- Separate business logic from UI
- Use server-side validation
- Use client-side validation

---

# Performance

Implement:

- Pagination
- Memoization
- Optimized Prisma queries
- Proper indexing
- Debounced search
- Select-only required fields

Avoid N+1 queries.

---

# Expected Output

For every feature implementation:

1. Explain the approach.
2. Show impacted files.
3. Generate code.
4. Explain business rules.
5. Explain validation rules.
6. Explain API endpoints.
7. Explain database changes.

Always produce production-ready code.
