# Tickd — High-Fidelity Task Management

Tickd is a premium, secure daily task manager designed for high-performance individuals. It prioritizes focus, security, and automation through a high-fidelity user interface and a specialized feature set.

## 🚀 Core Features

- **Passwordless Authentication**: Secure 6-digit OTP login delivered directly via Gmail.
- **Automated Daily Routines**: Recurring tasks that automatically reset every midnight, helping users maintain consistent habits.
- **Nightly Productivity Reports**: Automated email summaries sent at 23:59, providing a beautifully formatted digest of the day's accomplishments.
- **Bank-Grade Security**: All sensitive user credentials (like App Passwords) are encrypted using AES-256-GCM at rest.
- **Secure Support Portal**: Integrated contact system with database-backed rate limiting and encrypted alert forwarding.
- **High-Fidelity UI**: Premium glassmorphic design system using Metrophobic (Sans) and Playfair Display (Serif) typography.

## 🛠️ Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (Hosted on Neon)
- **Email**: [Nodemailer](https://nodemailer.com/) (Gmail SMTP Integration)
- **Validation**: [Zod](https://zod.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📂 Project Structure

```text
├── app/                  # Next.js App Router
│   ├── (auth)/           # Authentication flows (Login, OTP)
│   ├── (dashboard)/      # Protected user area (Tasks, Settings)
│   ├── api/              # Serverless API routes
│   │   ├── auth/         # Login and session management
│   │   ├── cron/         # Automated nightly reports and routine logic
│   │   └── tasks/        # Task CRUD operations
│   ├── contact/          # Secure support portal
│   ├── docs/             # Application documentation
│   └── layout.tsx        # Global layout and font configuration
├── components/           # Reusable UI components (Shadcn UI based)
├── lib/                  # Core utilities and shared logic
│   ├── auth.ts           # Session and JWT handling
│   ├── crypto.ts         # AES-256-GCM encryption/decryption
│   ├── db.ts             # Neon/Postgres database client
│   └── email.ts          # High-fidelity email templates and SMTP logic
├── public/               # Static assets (logos, icons)
└── scratch/              # Development and maintenance scripts
```

## 🔒 Security Architecture

Tickd implements several layers of security to protect user data:
- **AES-256-GCM Encryption**: Used for encrypting Gmail App Passwords before they hit the database.
- **Database Rate Limiting**: A dedicated `rate_limits` table prevents abuse of the contact form and authentication routes.
- **JWT Authentication**: Secure, stateless sessions for the dashboard.
- **Server-Side Proxies**: External services like NTFY are accessed via secure server-side routes to keep API keys hidden.

## 📊 Database Schema

The system relies on four primary tables:
- `users`: Core profile and encrypted credentials.
- `tasks`: Individual task entries with status tracking.
- `recurring_tasks`: Templates for daily routines.
- `rate_limits`: Request tracking for abuse prevention.

---
*Created by [Sarvan Kumar](https://www.sarvankumar.in)*
