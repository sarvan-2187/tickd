import nodemailer from "nodemailer";

type Task = {
  id: string;
  title: string;
  status: "pending" | "completed";
  recurring_task_id?: string | null;
};

/**
 * Creates a Nodemailer transporter using the system Gmail credentials.
 * Used for sending OTP verification emails.
 */
function systemTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SYSTEM_GMAIL,
      pass: process.env.SYSTEM_APP_PASSWORD,
    },
  });
}

/**
 * Creates a transporter using a user's own Gmail App Password.
 * Used for sending nightly task reports.
 */
function userTransporter(email: string, appPassword: string) {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: appPassword,
    },
  });
}

/**
 * Sends a 6-digit OTP email to the user via the system Gmail account.
 */
export async function sendOTP(to: string, code: string): Promise<void> {
  const transporter = systemTransporter();
  await transporter.sendMail({
    from: `"Tickd" <${process.env.SYSTEM_GMAIL}>`,
    to,
    subject: "Your Tickd Login Code",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0f0f0f; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #d97706, #b45309); padding: 32px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">Tickd</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Your login verification code</p>
        </div>
        <div style="padding: 40px 32px; background: #1a1a1a;">
          <p style="color: #9ca3af; font-size: 15px; margin: 0 0 24px;">Enter this 6-digit code to sign in. It expires in <strong style="color: #f59e0b;">5 minutes</strong>.</p>
          <div style="text-align: center; margin: 32px 0;">
            <span style="display: inline-block; background: #0f0f0f; border: 2px solid #d97706; border-radius: 12px; padding: 20px 40px; font-size: 40px; font-weight: 800; letter-spacing: 12px; color: #f59e0b; font-family: monospace;">${code}</span>
          </div>
          <p style="color: #6b7280; font-size: 13px; margin: 24px 0 0; text-align: center;">If you didn't request this, you can safely ignore this email.</p>
        </div>
        <div style="padding: 16px 32px; background: #111; text-align: center;">
          <p style="color: #4b5563; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Tickd</p>
        </div>
      </div>
    `,
  });
}

/**
 * Verifies connectivity of a user's App Password by sending a hidden test email.
 */
export async function sendTestEmail(email: string, appPassword: string): Promise<void> {
  const transporter = userTransporter(email, appPassword);
  await transporter.sendMail({
    from: `"Tickd" <${email}>`,
    to: email,
    subject: "Tickd — SMTP Configuration Verified",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #1a1a1a; border-radius: 16px;">
        <h2 style="color: #f59e0b; margin: 0 0 16px;">✅ SMTP Verified</h2>
        <p style="color: #9ca3af;">Your Gmail App Password has been successfully verified. Nightly task report emails will be sent to this address.</p>
      </div>
    `,
  });
}

/**
 * Builds and sends the nightly HTML task summary email.
 */
export async function sendNightlyReport(
  email: string,
  appPassword: string,
  tasks: Task[],
  dateStr: string
): Promise<void> {
  const completed = tasks.filter((t) => t.status === "completed");
  const pending = tasks.filter((t) => t.status === "pending");
  const pct = tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) :  const transporter = userTransporter(email, appPassword);
  await transporter.sendMail({
    from: `"Tickd" <${email}>`,
    to: email,
    subject: `Tickd — ${dateStr} Summary (${pct}% complete)`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <link href="https://fonts.googleapis.com/css2?family=Metrophobic&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
  <style>
    body { margin: 0; padding: 0; background: #f4f4f5; font-family: 'Metrophobic', -apple-system, Arial, sans-serif; }
    * { box-sizing: border-box; }
    .wrapper { width: 100%; padding: 40px 16px; background: #f4f4f5; }
    .container { max-width: 640px; margin: 0 auto; background: #0c0c0d; border-radius: 28px; overflow: hidden; border: 1px solid #1f1f22; box-shadow: 0 10px 40px rgba(0,0,0,0.15), 0 2px 10px rgba(0,0,0,0.08); }
    .hero { background: radial-gradient(circle at top right, rgba(255,255,255,0.08), transparent 30%), linear-gradient(135deg, #ea580c 0%, #c2410c 100%); padding: 56px 42px; }
    .badge { display: inline-block; padding: 8px 14px; border-radius: 999px; background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.92); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 22px; }
    .title { margin: 0; color: white; font-size: 42px; line-height: 1; font-family: 'Playfair Display', serif; font-weight: 700; letter-spacing: -0.03em; }
    .subtitle { margin-top: 14px; color: rgba(255,255,255,0.85); font-size: 15px; }
    .content { padding: 38px; background: #111113; }
    .stats { width: 100%; margin-bottom: 34px; border-collapse: separate; border-spacing: 12px 0; }
    .stat-card { background: #18181b; border-radius: 18px; padding: 24px 12px; text-align: center; border: 1px solid #232326; width: 31%; }
    .stat-number { font-size: 34px; font-weight: 700; margin-bottom: 6px; }
    .green { color: #10b981; }
    .red { color: #f43f5e; }
    .orange { color: #f59e0b; }
    .stat-label { color: #a1a1aa; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; }
    .section-title { color: #fafafa; font-size: 17px; margin-bottom: 20px; font-weight: 600; }
    .task { background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); border: 1px solid #232326; border-radius: 18px; padding: 18px 20px; margin-bottom: 14px; }
    .task-title { color: #f4f4f5; font-size: 15px; font-weight: 500; }
    .task-status { display: inline-block; padding: 7px 12px; border-radius: 999px; font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; }
    .status-completed { background: rgba(34,197,94,0.12); color: #22c55e; }
    .status-pending { background: rgba(244,63,94,0.12); color: #f43f5e; }
    .routine { display: inline-block; margin-top: 8px; padding: 4px 8px; border-radius: 8px; background: rgba(245,158,11,0.12); color: #f59e0b; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase; }
    .cta-wrap { text-align: center; margin-top: 40px; padding-top: 36px; border-top: 1px solid #232326; }
    .cta { display: inline-block; padding: 16px 30px; border-radius: 14px; background: linear-gradient(135deg, #f59e0b, #ea580c); color: #fff; text-decoration: none; font-weight: 700; font-size: 15px; box-shadow: 0 8px 24px rgba(245,158,11,0.25); }
    .footer { padding: 48px 28px; text-align: center; border-top: 1px solid #1f1f22; background: #0d0d0f; }
    .footer-brand { color: #fff; font-family: 'Playfair Display', serif; font-size: 28px; margin-bottom: 12px; font-weight: 700; }
    .footer-text { color: #71717a; font-size: 12px; line-height: 1.7; }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="container">
    <div class="hero">
      <div class="badge">Nightly Productivity Report</div>
      <h1 class="title">Daily Summary</h1>
      <div class="subtitle">${dateStr}</div>
    </div>
    <div class="content">
      <table class="stats" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td class="stat-card">
            <div class="stat-number green">${completed.length}</div>
            <div class="stat-label">Completed</div>
          </td>
          <td class="stat-card">
            <div class="stat-number red">${pending.length}</div>
            <div class="stat-label">Pending</div>
          </td>
          <td class="stat-card">
            <div class="stat-number orange">${pct}%</div>
            <div class="stat-label">Efficiency</div>
          </td>
        </tr>
      </table>
      <div class="section-title">Your Tasks</div>
      ${tasks.length > 0 ? tasks.map(t => `
        <div class="task">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <div class="task-title">
                  ${t.status === "completed" ? "✅" : "⏳"} ${t.title}
                </div>
                ${t.recurring_task_id ? `<div class="routine">Routine</div>` : ""}
              </td>
              <td align="right">
                <span class="task-status ${t.status === "completed" ? "status-completed" : "status-pending"}">
                  ${t.status}
                </span>
              </td>
            </tr>
          </table>
        </div>
      `).join("") : `
        <div class="task" style="text-align:center;padding:40px;">
          <div style="color:#71717a;">No tasks tracked today.</div>
        </div>
      `}
      <div class="cta-wrap">
        <a href="https://tickd.vercel.app/tasks" class="cta">Open Tickd Dashboard</a>
      </div>
    </div>
    <div class="footer">
      <div class="footer-brand">Tickd</div>
      <div class="footer-text">
        &copy; ${new Date().getFullYear()} Tickd. All rights reserved.<br/>
        This is an automated nightly summary of your task activity.
      </div>
    </div>
  </div>
</div>
</body>
</html>
    `,
  });
}   
