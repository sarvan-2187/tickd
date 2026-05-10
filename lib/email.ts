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

  const taskList = tasks
    .map((t) => `<li style="margin-bottom: 8px; color: #fff;">${t.title}</li>`)
    .join("");

  const transporter = userTransporter(email, appPassword);
  await transporter.sendMail({
    from: `"Tickd" <${email}>`,
    to: email,
    subject: `Tickd • ${dateStr} • ${pct}% complete`,
    html:`
    <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css2?family=Metrophobic&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
        <style>
          @media (max-width: 600px) {
            .container { margin: 10px !important; border-radius: 12px !important; }
            .header { padding: 24px 16px !important; }
            .header h1 { font-size: 22px !important; }
            .content { padding: 24px 16px !important; }
            .footer { padding: 20px 16px !important; font-size: 12px !important; }
            .stats-list { padding: 8px 8px !important; }
            .tasks-list { padding: 8px 8px !important; }
          }
        </style>
      </head>
      <body style="margin: 0; padding: 10px; background: #1a1a1a; font-family: 'Metrophobic', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        <div class="container" style="max-width: 650px; margin: 0 auto; background: #000; border-radius: 20px; overflow: hidden; border: 2px solid #f59e0b;">
          
          <!-- Header -->
          <div class="header" style="background: linear-gradient(135deg, #f59e0b 0%, #fa8c1d 100%); padding: 32px 28px; text-align: center;">
            <h1 style="color: #000; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; font-family: 'Metrophobic', serif;">Daily Summary | ${dateStr}</h1>
            <p style="color: #1a1a1a; margin: 8px 0 0; font-size: 12px; font-style: italic; font-weight: 500;">Auto Generated by Tickd</p>
          </div>

          <!-- Content -->
          <div class="content" style="padding: 16px 14px; background: #0a0a0a; border-top: 2px solid #f59e0b; border-bottom: 2px solid #f59e0b;">
            
            <!-- Stats -->
            <div class="stats-list" style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin-bottom: 24px;">
              <ul style="margin: 0; padding-left: 12px; list-style: disc;">
                <li style="color: #f59e0b; font-size: 15px; font-weight: 600; margin-bottom: 10px;">Completed Tasks: <span style="color: #fff;">${completed.length}</span></li>
                <li style="color: #f59e0b; font-size: 15px; font-weight: 600; margin-bottom: 10px;">Pending Tasks: <span style="color: #fff;">${pending.length}</span></li>
                <li style="color: #f59e0b; font-size: 15px; font-weight: 600;">Efficiency %: <span style="color: #fff;">${pct}%</span></li>
              </ul>
            </div>

            <!-- Tasks Section -->
            <div>
              <h2 style="color: #fff; margin: 0 0 16px 0; font-size: 16px; font-weight: 700; font-family: "Metrophobic', serif;">Tasks</h2>
              <div class="tasks-list" style="background: #1a1a1a; padding: 16px; border-radius: 8px;">
                ${tasks.length > 0 ? `
                  <ul style="margin: 0; padding-left: 12px; list-style: disc;">
                    ${taskList}
                  </ul>
                ` : `
                  <p style="color: #6b7280; margin: 0; font-size: 14px;">No tasks tracked for today.</p>
                `}
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div class="footer" style="background: linear-gradient(135deg, #f59e0b 0%, #fa8c1d 100%); padding: 12px 14px; text-align: center;">
            <p style="color: #000; margin: 0 0 8px 0; font-size: 12px; font-weight: 600; font-style: italic;">Master your day, Every single day !</p>
            <p style="color: #1a1a1a; margin: 0; font-size: 10px; font-weight: 500;">© Tickd ${new Date().getFullYear()} | All Rights Reserved</p>
          </div>

        </div>
      </body>
      </html>
    `,
  });
}
