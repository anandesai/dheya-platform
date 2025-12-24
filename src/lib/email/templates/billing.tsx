/**
 * Email Templates for Billing & Subscription
 * React Email components for transactional emails
 *
 * TODO: Install react-email package
 * npm install @react-email/components
 */

/**
 * Payment Success Email Template
 */
export interface PaymentSuccessEmailProps {
  userName: string
  packageName: string
  amount: number
  transactionId: string
  purchaseDate: Date
  expiryDate: Date | null
  invoiceUrl?: string
}

export function PaymentSuccessEmail(props: PaymentSuccessEmailProps) {
  const {
    userName,
    packageName,
    amount,
    transactionId,
    purchaseDate,
    expiryDate,
    invoiceUrl,
  } = props

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  // Placeholder HTML template
  // TODO: Replace with actual React Email components
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Successful - Dheya Career Mentors</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a472a; background-color: #f9f6f1; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #8b5cf6 0%, #1a472a 100%); padding: 40px 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Payment Successful!</h1>
      <p style="color: #f5f0e7; margin: 10px 0 0; font-size: 16px;">Welcome to your career transformation journey</p>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">
      <p style="font-size: 16px; margin: 0 0 20px;">Dear ${userName},</p>

      <p style="font-size: 16px; margin: 0 0 20px;">
        Thank you for subscribing to <strong>${packageName}</strong>. Your payment has been processed successfully.
      </p>

      <!-- Transaction Details -->
      <div style="background-color: #f5f0e7; border-radius: 8px; padding: 24px; margin: 30px 0;">
        <h2 style="font-size: 18px; margin: 0 0 16px; color: #1a472a;">Transaction Details</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6d6d6d; font-size: 14px;">Package:</td>
            <td style="padding: 8px 0; text-align: right; font-weight: 600; font-size: 14px;">${packageName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6d6d6d; font-size: 14px;">Amount Paid:</td>
            <td style="padding: 8px 0; text-align: right; font-weight: 600; font-size: 14px;">${formatCurrency(amount)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6d6d6d; font-size: 14px;">Transaction ID:</td>
            <td style="padding: 8px 0; text-align: right; font-family: monospace; font-size: 12px;">${transactionId}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6d6d6d; font-size: 14px;">Purchase Date:</td>
            <td style="padding: 8px 0; text-align: right; font-size: 14px;">${formatDate(purchaseDate)}</td>
          </tr>
          ${expiryDate ? `
          <tr>
            <td style="padding: 8px 0; color: #6d6d6d; font-size: 14px;">Valid Until:</td>
            <td style="padding: 8px 0; text-align: right; font-size: 14px;">${formatDate(expiryDate)}</td>
          </tr>
          ` : ''}
        </table>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="display: inline-block; background-color: #8b5cf6; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Access Your Dashboard
        </a>
      </div>

      ${invoiceUrl ? `
      <div style="text-align: center; margin: 20px 0;">
        <a href="${invoiceUrl}" style="color: #8b5cf6; text-decoration: none; font-size: 14px;">
          Download Invoice →
        </a>
      </div>
      ` : ''}

      <!-- What's Next -->
      <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #e8e2d4;">
        <h3 style="font-size: 16px; margin: 0 0 16px; color: #1a472a;">What's Next?</h3>
        <ul style="padding-left: 20px; margin: 0; color: #6d6d6d; font-size: 14px;">
          <li style="margin-bottom: 8px;">Complete your onboarding questionnaire</li>
          <li style="margin-bottom: 8px;">Explore the tools and assessments in Phase 1</li>
          <li style="margin-bottom: 8px;">Schedule your first mentoring session</li>
          <li style="margin-bottom: 8px;">Connect with your dedicated mentor</li>
        </ul>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f5f0e7; padding: 30px; text-align: center; border-top: 1px solid #e8e2d4;">
      <p style="margin: 0 0 10px; font-size: 14px; color: #6d6d6d;">
        Questions? Contact us at <a href="mailto:support@dheya.in" style="color: #8b5cf6; text-decoration: none;">support@dheya.in</a>
      </p>
      <p style="margin: 0; font-size: 12px; color: #888888;">
        © ${new Date().getFullYear()} Dheya Career Mentors. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `
}

/**
 * Subscription Renewal Reminder Email Template
 */
export interface RenewalReminderEmailProps {
  userName: string
  packageName: string
  expiryDate: Date
  daysRemaining: number
  renewalAmount: number
}

export function RenewalReminderEmail(props: RenewalReminderEmailProps) {
  const { userName, packageName, expiryDate, daysRemaining, renewalAmount } = props

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amt)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  // Placeholder HTML template
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Subscription Renewal Reminder - Dheya Career Mentors</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a472a; background-color: #f9f6f1; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #d4af37 0%, #1a472a 100%); padding: 40px 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Subscription Expiring Soon</h1>
      <p style="color: #f5f0e7; margin: 10px 0 0; font-size: 16px;">Don't interrupt your journey</p>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">
      <p style="font-size: 16px; margin: 0 0 20px;">Dear ${userName},</p>

      <p style="font-size: 16px; margin: 0 0 20px;">
        Your subscription to <strong>${packageName}</strong> will expire in <strong>${daysRemaining} days</strong> on ${formatDate(expiryDate)}.
      </p>

      <!-- Alert Box -->
      <div style="background-color: #fff3cd; border-left: 4px solid #d4af37; border-radius: 8px; padding: 20px; margin: 30px 0;">
        <p style="margin: 0; font-size: 14px; color: #856404;">
          <strong>Action Required:</strong> Renew your subscription to continue accessing your mentoring sessions, tools, and personalized guidance.
        </p>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/billing" style="display: inline-block; background-color: #d4af37; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Renew Subscription - ${formatCurrency(renewalAmount)}
        </a>
      </div>

      <p style="font-size: 14px; text-align: center; color: #6d6d6d; margin: 20px 0;">
        Or <a href="${process.env.NEXT_PUBLIC_APP_URL}/billing/upgrade" style="color: #8b5cf6; text-decoration: none;">upgrade to a higher tier</a> for more benefits
      </p>
    </div>

    <!-- Footer -->
    <div style="background-color: #f5f0e7; padding: 30px; text-align: center; border-top: 1px solid #e8e2d4;">
      <p style="margin: 0 0 10px; font-size: 14px; color: #6d6d6d;">
        Questions? Contact us at <a href="mailto:support@dheya.in" style="color: #8b5cf6; text-decoration: none;">support@dheya.in</a>
      </p>
      <p style="margin: 0; font-size: 12px; color: #888888;">
        © ${new Date().getFullYear()} Dheya Career Mentors. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `
}

/**
 * Subscription Expired Email Template
 */
export interface SubscriptionExpiredEmailProps {
  userName: string
  packageName: string
  expiredDate: Date
}

export function SubscriptionExpiredEmail(props: SubscriptionExpiredEmailProps) {
  const { userName, packageName, expiredDate } = props

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  // Placeholder HTML template
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Subscription Expired - Dheya Career Mentors</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1a472a; background-color: #f9f6f1; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    <!-- Header -->
    <div style="background-color: #1a472a; padding: 40px 30px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Your Subscription Has Expired</h1>
      <p style="color: #f5f0e7; margin: 10px 0 0; font-size: 16px;">We hope to see you again soon</p>
    </div>

    <!-- Content -->
    <div style="padding: 40px 30px;">
      <p style="font-size: 16px; margin: 0 0 20px;">Dear ${userName},</p>

      <p style="font-size: 16px; margin: 0 0 20px;">
        Your subscription to <strong>${packageName}</strong> expired on ${formatDate(expiredDate)}.
      </p>

      <p style="font-size: 16px; margin: 0 0 20px;">
        We hope your journey with Dheya has been transformative. Your access to mentoring sessions and premium tools has been paused.
      </p>

      <!-- What You Can Do -->
      <div style="background-color: #f5f0e7; border-radius: 8px; padding: 24px; margin: 30px 0;">
        <h3 style="font-size: 18px; margin: 0 0 16px; color: #1a472a;">Continue Your Journey</h3>
        <ul style="padding-left: 20px; margin: 0; color: #6d6d6d; font-size: 14px;">
          <li style="margin-bottom: 8px;">Renew your current subscription</li>
          <li style="margin-bottom: 8px;">Upgrade to unlock more phases and features</li>
          <li style="margin-bottom: 8px;">Schedule a call to discuss your progress</li>
        </ul>
      </div>

      <!-- CTA Buttons -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/programs" style="display: inline-block; background-color: #8b5cf6; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 0 8px 8px;">
          Renew Subscription
        </a>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/contact" style="display: inline-block; background-color: #ffffff; color: #1a472a; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; border: 2px solid #1a472a; margin: 0 8px 8px;">
          Talk to Support
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #f5f0e7; padding: 30px; text-align: center; border-top: 1px solid #e8e2d4;">
      <p style="margin: 0 0 10px; font-size: 14px; color: #6d6d6d;">
        Questions? Contact us at <a href="mailto:support@dheya.in" style="color: #8b5cf6; text-decoration: none;">support@dheya.in</a>
      </p>
      <p style="margin: 0; font-size: 12px; color: #888888;">
        © ${new Date().getFullYear()} Dheya Career Mentors. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
  `
}
