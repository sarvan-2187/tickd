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
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Metrophobic&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
        <style>
          @media (max-width: 600px) {
            .container { padding: 0 16px !important; }
            .header { padding: 24px 16px !important; }
            .content { padding: 24px 16px !important; }
            .footer { padding: 12px 16px !important; }
            .code-display { padding: 16px 24px !important; font-size: 32px !important; letter-spacing: 8px !important; }
            h1 { font-size: 24px !important; }
            p { font-size: 14px !important; }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Metrophobic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div class="container" style="max-width: 480px; margin: 0 auto; background: #0f0f0f; border-radius: 16px; overflow: hidden;">
          <div class="header" style="background: linear-gradient(135deg, #d97706, #b45309); padding: 32px; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; font-family: 'Playfair Display', serif;">Tickd</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Your login verification code</p>
          </div>
          <div class="content" style="padding: 40px 32px; background: #1a1a1a;">
            <p style="color: #9ca3af; font-size: 15px; margin: 0 0 24px; line-height: 1.5;">Enter this 6-digit code to sign in. It expires in <strong style="color: #f59e0b;">5 minutes</strong>.</p>
            <div style="text-align: center; margin: 32px 0;">
              <span class="code-display" style="display: inline-block; background: #0f0f0f; border: 2px solid #d97706; border-radius: 12px; padding: 20px 40px; font-size: 40px; font-weight: 800; letter-spacing: 12px; color: #f59e0b; font-family: 'Courier New', monospace; word-spacing: 8px;">${code}</span>
            </div>
            <p style="color: #6b7280; font-size: 13px; margin: 24px 0 0; text-align: center; line-height: 1.5;">If you didn't request this, you can safely ignore this email.</p>
          </div>
          <div class="footer" style="padding: 16px 32px; background: #111; text-align: center;">
            <p style="color: #4b5563; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Tickd</p>
          </div>
        </div>
      </body>
      </html>
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
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Metrophobic&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
        <style>
          @media (max-width: 600px) {
            .container { padding: 0 16px !important; }
            .content { padding: 24px 16px !important; }
            h2 { font-size: 18px !important; }
            p { font-size: 14px !important; }
          }
        </link>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Metrophobic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div class="container" style="max-width: 480px; margin: 0 auto; padding: 32px;">
          <div class="content" style="background: #1a1a1a; padding: 32px; border-radius: 16px;">
            <h2 style="color: #f59e0b; margin: 0 0 16px; font-size: 20px; font-weight: 700; font-family: 'Playfair Display', serif;">SMTP Verified</h2>
            <p style="color: #9ca3af; margin: 0; font-size: 15px; line-height: 1.6;">Your Gmail App Password has been successfully verified. Nightly task report emails will be sent to this address.</p>
          </div>
        </div>
      </body>
      </html>
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
  const pct = tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0;

  const taskRow = (t: Task) => `
    <div style="padding: 16px; background: #161616; border-radius: 12px; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.03);">
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 18px; flex-shrink: 0;">${t.status === "completed" ? "✅" : "⏳"}</span>
        <div style="flex: 1; min-width: 0;">
          <div style="color: ${t.status === "completed" ? "#ffffff" : "#9ca3af"}; font-size: 15px; font-weight: 500; word-break: break-word;">
            ${t.title}
          </div>
          ${t.recurring_task_id ? `
            <div style="display: inline-block; margin-top: 4px; font-size: 9px; font-weight: 800; color: #f59e0b; background: rgba(245,158,11,0.1); padding: 2px 6px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em;">
              Routine
            </div>
          ` : ""}
        </div>
        <div style="flex-shrink: 0; text-align: right;">
          <span style="font-size: 11px; font-weight: 700; color: ${t.status === "completed" ? "#10b981" : "#f43f5e"}; text-transform: uppercase; letter-spacing: 0.05em;">
            ${t.status}
          </span>
        </div>
      </div>
    </div>
  `;

  const transporter = userTransporter(email, appPassword);
  await transporter.sendMail({
    from: `"Tickd" <${email}>`,
    to: email,
    subject: `Tickd | ${dateStr} Summary | (${pct}% complete)`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Metrophobic&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;800&display=swap" rel="stylesheet">
        <style>
          @media (max-width: 600px) {
            .container { border-radius: 12px !important; margin: 0 !important; }
            .header { padding: 24px 16px !important; }
            .header h1 { font-size: 24px !important; }
            .header p { font-size: 14px !important; }
            .content { padding: 24px 16px !important; }
            .footer { padding: 16px; }
            .stats-grid { gap: 8px !important; }
            .stat-card { padding: 16px !important; }
            .stat-card .number { font-size: 24px !important; }
            .stat-card .label { font-size: 10px !important; }
            .task-header { padding: 0 4px !important; font-size: 14px !important; }
            .task-header-count { font-size: 11px !important; }
            .task-row { padding: 12px !important; font-size: 14px !important; }
            .cta { padding: 14px 24px !important; font-size: 14px !important; margin-top: 24px !important; }
            .empty-state { padding: 32px 16px !important; }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Metrophobic', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <div class="container" style="max-width: 600px; margin: 0 auto; background: #0a0a0a; border-radius: 24px; overflow: hidden; border: 1px solid #1a1a1a;">
          <!-- Header -->
          <div class="header" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 48px 40px; text-align: center;">
            <div style="margin-bottom: 20px;">
              <span style="background: rgba(0,0,0,0.2); padding: 8px 16px; border-radius: 100px; color: #fff; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; display: inline-block;">Nightly Report</span>
            </div>
            <h1 style="color: #fff; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.02em; font-family: 'Playfair Display', serif;">Daily Summary</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 16px; line-height: 1.4;">${dateStr}</p>
          </div>

          <!-- Stats -->
          <div class="content" style="padding: 40px;">
            <div class="stats-grid" style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 32px;">
              <div class="stat-card" style="background: #161616; border: 1px solid rgba(16,185,129,0.1); border-radius: 16px; padding: 20px; text-align: center;">
                <div class="number" style="font-size: 28px; font-weight: 800; color: #10b981; font-family: 'Playfair Display', serif;">${completed.length}</div>
                <div class="label" style="font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px;">Completed</div>
              </div>
              <div class="stat-card" style="background: #161616; border: 1px solid rgba(244,63,94,0.1); border-radius: 16px; padding: 20px; text-align: center;">
                <div class="number" style="font-size: 28px; font-weight: 800; color: #f43f5e; font-family: 'Playfair Display', serif;">${pending.length}</div>
                <div class="label" style="font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px;">Pending</div>
              </div>
              <div class="stat-card" style="background: #161616; border: 1px solid rgba(245,158,11,0.1); border-radius: 16px; padding: 20px; text-align: center;">
                <div class="number" style="font-size: 28px; font-weight: 800; color: #f59e0b; font-family: 'Playfair Display', serif;">${pct}%</div>
                <div class="label" style="font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 4px;">Efficiency</div>
              </div>
            </div>

            <!-- Task List -->
            <div>
              <div class="task-header" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding: 0 4px;">
                <h2 style="color: #fff; margin: 0; font-size: 16px; font-weight: 700; font-family: 'Playfair Display', serif;">Your Tasks</h2>
                <span class="task-header-count" style="color: #6b7280; font-size: 12px;">${tasks.length} Total</span>
              </div>
              
              ${tasks.length > 0 ? `
                <div>
                  ${tasks.map(taskRow).join("")}
                </div>
              ` : `
                <div class="empty-state" style="text-align: center; padding: 48px; background: #161616; border-radius: 16px; border: 1px dashed #2a2a2a;">
                  <p style="color: #6b7280; margin: 0; font-size: 14px; line-height: 1.5;">No tasks tracked for today.</p>
                </div>
              `}
            </div>

            <!-- CTA -->
            <div style="text-align: center; margin-top: 48px; padding-top: 40px; border-top: 1px solid #1a1a1a;">
              <a href="https://tickd-tracker.vercel.app/tasks" class="cta" style="display: inline-block; background: #f59e0b; color: #000; padding: 16px 32px; border-radius: 12px; font-size: 15px; font-weight: 700; text-decoration: none; box-shadow: 0 4px 20px rgba(245,158,11,0.2);">Launch Dashboard</a>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer" style="padding: 32px; background: #0a0a0a; text-align: center; border-top: 1px solid #1a1a1a;">
            <div style="margin-bottom: 16px;">
              <span style="color: #f59e0b; font-weight: 800; font-size: 18px; letter-spacing: -0.02em; font-family: 'Playfair Display', serif;">Tickd</span>
            </div>
            <p style="color: #4b5563; font-size: 12px; margin: 0; line-height: 1.6;">
              &copy; ${new Date().getFullYear()} Tickd. All rights reserved.<br/>
              This is an automated nightly summary of your task activity.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}
