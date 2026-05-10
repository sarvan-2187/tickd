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
    <div style="padding: 14px 16px; background: rgba(255,255,255,0.02); border-radius: 10px; margin-bottom: 10px; border-left: 3px solid ${t.status === "completed" ? "#10b981" : "#f43f5e"}; transition: all 0.3s ease;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 16px; flex-shrink: 0;">${t.status === "completed" ? "✓" : "○"}</span>
        <div style="flex: 1; min-width: 0;">
          <div style="color: ${t.status === "completed" ? "#9ca3af" : "#fff"}; font-size: 14px; font-weight: 400; word-break: break-word; ${t.status === "completed" ? "text-decoration: line-through;" : ""} opacity: ${t.status === "completed" ? "0.7" : "1"};">
            ${t.title}
          </div>
        </div>
      </div>
    </div>
  `;

  const transporter = userTransporter(email, appPassword);
  await transporter.sendMail({
    from: `"Tickd" <${email}>`,
    to: email,
    subject: `Tickd • ${dateStr} • ${pct}% complete`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Metrophobic&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
        <style>
          @media (max-width: 600px) {
            .container { margin: 0 !important; border-radius: 16px !important; }
            .header { padding: 32px 20px !important; }
            .header h1 { font-size: 28px !important; }
            .content { padding: 20px !important; }
            .stats-grid { gap: 12px !important; }
            .stat-item { padding: 14px !important; }
            .stat-num { font-size: 26px !important; }
            .tasks-section { margin-top: 24px !important; }
            .cta-btn { padding: 12px 24px !important; font-size: 14px !important; }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 20px; background: #050505; font-family: 'Metrophobic', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        <div class="container" style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%); border-radius: 20px; overflow: hidden; border: 1px solid rgba(245,158,11,0.15); box-shadow: 0 20px 60px rgba(0,0,0,0.8);">
          
          <!-- Header -->
          <div class="header" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 40px 32px; text-align: center; position: relative;">
            <h1 style="color: #fff; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; font-family: 'Playfair Display', serif;">Daily Summary</h1>
            <p style="color: rgba(255,255,255,0.85); margin: 12px 0 0; font-size: 14px; font-weight: 400;">${dateStr}</p>
          </div>

          <!-- Progress -->
          <div class="content" style="padding: 32px;">
            <div style="margin-bottom: 28px;">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px;">
                <span style="font-size: 13px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Progress</span>
                <span style="font-size: 24px; font-weight: 700; color: #f59e0b; font-family: 'Playfair Display', serif;">${pct}%</span>
              </div>
              <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; border: 1px solid rgba(245,158,11,0.1);">
                <div style="height: 100%; background: linear-gradient(90deg, #f59e0b, #d97706); width: ${pct}%; transition: width 0.6s ease;"></div>
              </div>
            </div>

            <!-- Stats -->
            <div class="stats-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 32px;">
              <div class="stat-item" style="background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.2); border-radius: 14px; padding: 18px; text-align: center;">
                <div class="stat-num" style="font-size: 28px; font-weight: 700; color: #10b981; font-family: 'Playfair Display', serif;">${completed.length}</div>
                <div style="font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 6px;">Completed</div>
              </div>
              <div class="stat-item" style="background: rgba(244,63,94,0.08); border: 1px solid rgba(244,63,94,0.2); border-radius: 14px; padding: 18px; text-align: center;">
                <div class="stat-num" style="font-size: 28px; font-weight: 700; color: #f43f5e; font-family: 'Playfair Display', serif;">${pending.length}</div>
                <div style="font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 6px;">Pending</div>
              </div>
            </div>

            <!-- Tasks -->
            <div class="tasks-section">
              <h2 style="color: #fff; margin: 0 0 14px; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Tasks (${tasks.length})</h2>
              
              ${tasks.length > 0 ? `
                <div>
                  ${tasks.map(taskRow).join("")}
                </div>
              ` : `
                <div style="text-align: center; padding: 32px 16px; background: rgba(255,255,255,0.02); border-radius: 12px; border: 1px dashed rgba(255,255,255,0.08);">
                  <p style="color: #6b7280; margin: 0; font-size: 13px;">No tasks tracked today</p>
                </div>
              `}
            </div>

            <!-- CTA -->
            <div style="text-align: center; margin-top: 32px;">
              <a href="https://tickd-tracker.vercel.app/tasks" class="cta-btn" style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; padding: 14px 32px; border-radius: 10px; font-size: 15px; font-weight: 600; text-decoration: none; box-shadow: 0 8px 24px rgba(245,158,11,0.25); border: none; cursor: pointer;">View Dashboard →</a>
            </div>
          </div>

          <!-- Footer -->
          <div style="padding: 24px 32px; background: rgba(0,0,0,0.4); border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
            <p style="color: #6b7280; font-size: 11px; margin: 0; line-height: 1.6; font-weight: 400;">
              <span style="color: #f59e0b; font-family: 'Playfair Display', serif; font-weight: 700; font-size: 12px;">Tickd</span> • Your automated task companion<br/>
              © ${new Date().getFullYear()} All rights reserved
            </p>
          </div>

        </div>
      </body>
      </html>
    `,
  });
}
