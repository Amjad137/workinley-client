# Workinley Web Client

> **Enterprise-grade Engineering Team Management & Weekly Reporting SaaS Platform**  
> Built with **Next.js 16 (App Router)**, **React 19**, **TypeScript 5.8**, **TanStack React Query v5**, **TanStack Table v8**, **Better Auth**, and **Tailwind CSS + shadcn/ui**.

---

## 🌟 Executive Overview

**Workinley** is an enterprise team operations and reporting platform designed for engineering leaders, project managers, and distributed development teams. It streamlines weekly status reporting, velocity tracking, project allocations, and compliance monitoring with an intuitive, high-performance web client.

The frontend is built to demonstrate **production-grade software engineering standards**: strict typing, declarative server-state management, headless UI patterns, modular Next.js route groups, and accessible, responsive user interfaces.

---

## 🚀 Key Features

### 1. Weekly Reporting Hub

- **Interactive Report Builder**: Log weekly tasks with planned vs. actual completion percentage, hours spent, deliverable links, and priority levels.
- **Categorized Hours Tracking**: Structured breakdown covering Development, Testing, Meetings, Documentation, and Other activities.
- **Blockers & Achievements**: First-class tracking for key issues/blockers and critical achievements to keep leadership aligned.
- **Seamless Edit & Prefill**: Dynamic sheet and modal workflows with pre-populated form state and validation.

### 2. Review & Approval Engine

- **Manager Review Workflow**: Dedicated review dashboard for managers and admins to inspect team submissions.
- **Change Request Cycle**: Reject or request amendments with detailed inline reviewer feedback before approving.
- **Audit Trails**: Real-time report status transitions (`DRAFT` → `SUBMITTED` → `CHANGES_REQUESTED` → `APPROVED`).

### 3. Engineering Analytics & Performance KPIs

- **Velocity Tracking**: Historical velocity metrics tracking completed tasks and capacity over customizable lookback windows.
- **Workload & Hours Distribution**: Visual breakdown of team effort across development, meetings, and operational tasks powered by **Recharts**.
- **Submission Compliance**: Real-time visibility into weekly report submission compliance across teams.
- **Member KPI Profiles**: Individualized performance dashboards showcasing logged reports, velocity, and recent activity streams.

### 4. Project & Team Management

- **Project Registry**: Manage client and internal initiatives with unique project codes, color identifiers, and lifecycle states (Active / Archived).
- **Team Directory & RBAC**: Multi-role support (**Admin**, **Manager**, **Member**) with contextual navigation and permission boundaries.
- **Invitations**: Tokenized team invitation workflow with role pre-assignment, resend capabilities, and revocation guardrails.

### 5. Secure File & Asset Storage

- Direct client-to-cloud uploads via **AWS S3 presigned URLs**, keeping media assets and attachments fast and secure without routing binary payloads through the application server.

---

## 🏗️ Architecture & Engineering Practices

The client codebase is engineered with a **clean, layered architecture** that ensures maintainability, high cohesion, and loose coupling.

```
workinley-client/
├── src/
│   ├── app/                    # Next.js App Router (Route groups: (marketing), (saas))
│   │   ├── (marketing)/        # Public landing & marketing pages
│   │   └── (saas)/             # Authenticated portal & auth flows
│   │       ├── auth/           # Login, registration, & invitation acceptance
│   │       └── portal/         # Protected routes (dashboard, reports, reviews, team)
│   ├── components/             # Reusable UI component hierarchy
│   │   ├── ui/                 # Headless shadcn / Radix UI primitives
│   │   ├── saas/               # Domain-specific feature components
│   │   └── common/             # Global headers, navigation, wrappers
│   ├── config/                 # Axios HTTP client, API endpoints, environment config
│   ├── constants/              # Route constants, navigation configs, query keys
│   ├── dto/                    # Strict TypeScript interfaces & API contracts
│   ├── hooks/                  # TanStack Query hooks & custom domain hooks
│   ├── services/               # Pure API interaction layer (Axios + Error handling)
│   ├── stores/                 # Zustand lightweight client state (sidebar, UI filters)
│   ├── styles/                 # Global styles, Tailwind utilities & theme tokens
│   └── utils/                  # Unified error handling, date utilities, formatters
```

### 💎 Key Architectural Patterns

- **Server-State Separation with TanStack Query v5**:
  - Direct HTTP mutations and queries are decoupled from UI components.
  - Systematic **Query Key Factory Pattern** (e.g. `REPORT_KEYS`, `PROJECT_KEYS`, `ANALYTICS_KEYS`) guarantees consistent cache invalidation and zero stale cache leaks.
- **Layered API Boundary**:
  - `services/` contains pure asynchronous network functions with standardized error unwrapping (`handleError`).
  - `hooks/` wraps services into reactive TanStack Query hooks (`useGetMyReports`, `useCreateProject`, etc.).
  - `dto/` defines rigorous end-to-end TypeScript interfaces matching backend response payloads.
- **Form Management & Schema Validation**:
  - Standardized on **React Hook Form** + **Yup** schemas (`@hookform/resolvers/yup`) for zero-lag controlled form inputs and immediate validation feedback.
- **Design System & Visual Excellence**:
  - Built on **Radix UI** primitives and **shadcn/ui** with custom Tailwind design tokens.
  - First-class support for dark and light modes via `next-themes`.
  - Polished micro-interactions, responsive card layouts, and accessible dialogs/sheets.
- **Client-Side State Isolation**:
  - Global UI state (sidebar collapse, filter presets) is encapsulated within lightweight **Zustand** stores, preventing unnecessary component re-renders.
- **Code Quality & Git Hygiene**:
  - Linting enforced via **ESLint 9**, **TypeScript ESLint**, and **SonarJS** rules.
  - Automated formatting via **Prettier** with **Husky** pre-commit hooks (`lint-staged`).
  - Semantic versioning workflow via `yarn release:patch`, `release:minor`, and `release:major`.

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js**: `>= 18.17.0` (LTS recommended)
- **Yarn**: `>= 1.22.0`
- **PostgreSQL**: Running locally or via Docker (for backend)

---

### Step 1: Clone and Install Dependencies

```bash
cd workinley-client
yarn install
```

---

### Step 2: Configure Client Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Default configuration (`.env.local`):

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_PACKAGE_NAME=workinley
NEXT_PUBLIC_AUTH_STORE_KEY=workinley-auth-storage-dev-v1
```

---

### Step 3: Backend API Setup & Database Seed

To explore all features with realistic pre-populated data (users, projects, weekly reports, hours breakdowns, and reviews), configure and seed the **`workinley-api`** backend:

```bash
# Navigate to the backend directory
cd ../workinley-api

# Install dependencies
yarn install

# Copy environment configuration
cp .env.example .env

# Run database migrations
yarn db:migrate

# Seed the database with demo users, projects, and weekly reports
yarn db:seed

# Start the backend API server (runs on http://localhost:8000)
yarn start:local
```

#### 🔑 Seeded Demo Credentials

| Role        | Email                      | Password       | Access Level                                                   |
| :---------- | :------------------------- | :------------- | :------------------------------------------------------------- |
| **Admin**   | `admin@workinley.dev`      | `Admin@1234`   | Full system access, team oversight, analytics, project config  |
| **Manager** | `manager@workinley.dev`    | `Manager@1234` | Review weekly reports, approve / request changes, team metrics |
| **Member**  | `alex.chen@workinley.dev`  | `Member@1234`  | Submit weekly reports, track hours, manage assigned tasks      |
| **Member**  | `david.ross@workinley.dev` | `Member@1234`  | Submit weekly reports, track hours, manage assigned tasks      |
| **Member**  | `priya.nair@workinley.dev` | `Member@1234`  | Submit weekly reports, track hours, manage assigned tasks      |

---

### Step 4: Run the Web Client

From the `workinley-client` directory:

```bash
# Start development server on http://localhost:3000
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in using any of the seed accounts above.

---

## 📋 Available Scripts

| Command              | Description                                                                |
| :------------------- | :------------------------------------------------------------------------- |
| `yarn dev`           | Starts the Next.js development server with local environment configuration |
| `yarn build`         | Compiles the production bundle with type-checking and optimization         |
| `yarn start`         | Launches the built production server                                       |
| `yarn lint`          | Runs ESLint across the codebase                                            |
| `yarn lint:fix`      | Automatically fixes linting errors where possible                          |
| `yarn format`        | Checks file formatting with Prettier                                       |
| `yarn format:fix`    | Formats all files with Prettier                                            |
| `yarn release:patch` | Bumps patch version, updates `version.ts`, commits, and creates git tag    |
| `yarn release:minor` | Bumps minor version, updates `version.ts`, commits, and creates git tag    |

---

## 🛡️ Security & Compliance

- **HTTP-only Cookie Authentication**: Session tokens are isolated from JavaScript context, mitigating XSS risks.
- **CORS & Origin Hardening**: API integration strictly bounded by `TRUSTED_ORIGINS`.
- **Validation**: All user inputs validated bidirectionally (Yup on client, `class-validator` DTOs on server).

---

## 📄 License

This project is proprietary and maintained for engineering evaluation and production use.
