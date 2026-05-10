# Tickd
Tickd is a premium, secure daily task management application designed for high-performance individuals who value focus and data privacy.

## UI
<img width="1858" height="910" alt="image" src="https://github.com/user-attachments/assets/0acab235-4d23-4106-bb31-56370a474fcf" />

## Features

- **Passwordless Authentication**: Secure login via one-time codes (OTP) sent directly to your Gmail. No more passwords to remember.
- **Automated Routines**: Master your habits with tasks that automatically reset every morning. Set them once, stay consistent forever.
- **Nightly Summaries**: Close your day with clarity. Receive a beautiful, automated HTML email at 23:59 summarizing your progress.
- **Privacy First**: All sensitive data, including App Passwords, are AES-256-GCM encrypted at rest.
- **Premium UI/UX**: Built with a stunning glassmorphic design system, fluid animations (Framer Motion), and ultra-smooth scrolling (Lenis).
- **Responsive Design**: A seamless experience across desktop, tablet, and mobile devices.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database**: [Neon](https://neon.tech/) (Serverless PostgreSQL)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Smooth Scroll**: [Lenis](https://lenis.darkroom.engineering/)

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/tickd.git
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the following:
```env
DATABASE_URL=your_neon_db_url
JWT_SECRET=your_jwt_secret
SYSTEM_GMAIL=your_gmail@gmail.com
SYSTEM_GMAIL_PASS=your_gmail_app_password
```

### 4. Run the development server
```bash
npm run dev
```

## Security
Tickd takes security seriously. We use bank-grade encryption for all sensitive user credentials and implement secure, session-based authentication to ensure your data stays yours.

## License
This project is licensed under the MIT License.

