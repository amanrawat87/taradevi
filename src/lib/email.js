import { Resend } from 'resend';

// Initialize Resend with API key from environment variables
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const fromEmail = process.env.EMAIL_SEND_FROM || 'onboarding@resend.dev';

// Parse comma-separated emails or return fallback array
const parseEmailList = (val, fallback = []) => {
  if (!val || typeof val !== 'string') return fallback;
  const list = val.split(',').map((e) => e.trim()).filter(Boolean);
  return list.length > 0 ? list : fallback;
};

const getRecipients = () => {
  const to = parseEmailList(process.env.EMAIL_SEND_TO, ['info@jindalmetal.com']);
  const cc = parseEmailList(process.env.EMAIL_SEND_CC, []);
  return { to, cc };
};

const getEmailWrapper = (title, content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f4f7f6;
      margin: 0;
      padding: 0;
      color: #333333;
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }
    .header {
      background-color: #0f172a;
      padding: 24px 32px;
      text-align: center;
    }
    .header img {
      max-height: 60px;
      margin-bottom: 15px;
      background: white;
      padding: 8px;
      border-radius: 6px;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      letter-spacing: -0.5px;
    }
    .content {
      padding: 32px;
    }
    .content p {
      font-size: 16px;
      line-height: 1.6;
      margin-top: 0;
      color: #555555;
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 24px;
    }
    .data-table th, .data-table td {
      padding: 12px 16px;
      border-bottom: 1px solid #eeeeee;
      text-align: left;
    }
    .data-table th {
      background-color: #f9fafb;
      font-weight: 600;
      color: #444444;
      width: 35%;
      font-size: 14px;
    }
    .data-table td {
      font-size: 15px;
      color: #1a1a1a;
    }
    .footer {
      background-color: #f9fafb;
      padding: 24px 32px;
      text-align: center;
      border-top: 1px solid #eeeeee;
    }
    .footer p {
      margin: 0;
      font-size: 13px;
      color: #888888;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <img src="https://jindalmetal.com/images/logo.png" alt="Jindal Metals & Alloys" />
      <h1>${title}</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>This is an automated message from the Jindal Metals & Alloys website.</p>
    </div>
  </div>
</body>
</html>
`;

export const sendNewEnquiryEmail = async (data) => {
  if (!resend) {
    console.warn("RESEND_API_KEY is not set. Skipping email dispatch.");
    return;
  }

  const {
    companyName, contactPerson, email, contactNo, address,
    standard, grade, thicknessMin, thicknessMax, widthMin, widthMax,
    qty, surfaceFinish, hardness, selectOne, uts, ys, elongation,
    endUse, specialRequirements
  } = data;

  const content = `
    <p style="font-size: 16px; color: #333;">You have received a new inquiry from the website contact form.</p>
    
    <h3 style="margin-top: 32px; font-size: 18px; color: #1a1a1a; border-bottom: 2px solid #0f172a; padding-bottom: 8px;">Contact Information</h3>
    <table class="data-table" style="margin-top: 16px;">
      <tbody>
        <tr><th>Company Name</th><td>${companyName || '-'}</td></tr>
        <tr><th>Contact Person</th><td>${contactPerson || '-'}</td></tr>
        <tr><th>Email Address</th><td><a href="mailto:${email}" style="color: #0066cc;">${email || '-'}</a></td></tr>
        <tr><th>Contact No.</th><td>${contactNo || '-'}</td></tr>
        <tr><th>Address</th><td>${address || '-'}</td></tr>
      </tbody>
    </table>

    <h3 style="margin-top: 32px; font-size: 18px; color: #1a1a1a; border-bottom: 2px solid #0f172a; padding-bottom: 8px;">Material Requirements</h3>
    <table class="data-table" style="margin-top: 16px;">
      <tbody>
        <tr><th>Standard</th><td>${standard || '-'}</td></tr>
        <tr><th>Grade</th><td>${grade || '-'}</td></tr>
        <tr><th>Thickness</th><td>Min: ${thicknessMin || '-'} mm &nbsp;|&nbsp; Max: ${thicknessMax || '-'} mm</td></tr>
        <tr><th>Width</th><td>Min: ${widthMin || '-'} mm &nbsp;|&nbsp; Max: ${widthMax || '-'} mm</td></tr>
        <tr><th>Quantity (Kg)</th><td>${qty || '-'}</td></tr>
        <tr><th>Surface Finish</th><td>${surfaceFinish || '-'}</td></tr>
        <tr><th>Hardness</th><td>${hardness || '-'}</td></tr>
      </tbody>
    </table>

    <h3 style="margin-top: 32px; font-size: 18px; color: #1a1a1a; border-bottom: 2px solid #0f172a; padding-bottom: 8px;">Mechanical Properties & Other Details</h3>
    <table class="data-table" style="margin-top: 16px;">
      <tbody>
        <tr><th>Select One Option</th><td>${selectOne || '-'}</td></tr>
        <tr><th>UTS (N/mm²)</th><td>${uts || '-'}</td></tr>
        <tr><th>YS (N/mm²)</th><td>${ys || '-'}</td></tr>
        <tr><th>Elongation %</th><td>${elongation || '-'}</td></tr>
        <tr><th>End Use</th><td>${endUse || '-'}</td></tr>
        <tr><th>Special Requirements</th><td>${specialRequirements || '-'}</td></tr>
      </tbody>
    </table>
  `;

  const html = getEmailWrapper("New Website Inquiry", content);

  try {
    const { to, cc } = getRecipients();
    const emailPayload = {
      from: `Jindal Metals Website <${fromEmail}>`,
      to,
      subject: `New Website Enquiry: ${companyName}`,
      html: html,
      replyTo: email,
    };

    if (cc && cc.length > 0) {
      emailPayload.cc = cc;
    }

    const response = await resend.emails.send(emailPayload);
    console.log("Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
};

export const sendUpdatedEnquiryEmail = async (data) => {
  if (!resend) {
    console.warn("RESEND_API_KEY is not set. Skipping email dispatch.");
    return;
  }

  const {
    companyName, contactPerson, email, contactNo,
    standard, grade, thicknessMin, thicknessMax, widthMin, widthMax,
    qty, surfaceFinish, hardness, selectOne, uts, ys, elongation,
    endUse, specialRequirements
  } = data;

  const content = `
    <p>A lead has provided technical specifications for their inquiry.</p>
    
    <h3 style="margin-top: 32px; font-size: 18px; color: #1a1a1a; border-bottom: 2px solid #eeeeee; padding-bottom: 8px;">Contact Info</h3>
    <table class="data-table" style="margin-top: 16px;">
      <tbody>
        <tr><th>Company Name</th><td>${companyName || '-'}</td></tr>
        <tr><th>Contact Person</th><td>${contactPerson || '-'}</td></tr>
        <tr><th>Email</th><td><a href="mailto:${email}" style="color: #0066cc;">${email || '-'}</a></td></tr>
        <tr><th>Contact No.</th><td>${contactNo || '-'}</td></tr>
      </tbody>
    </table>

    <h3 style="margin-top: 32px; font-size: 18px; color: #1a1a1a; border-bottom: 2px solid #eeeeee; padding-bottom: 8px;">Material Requirements</h3>
    <table class="data-table" style="margin-top: 16px;">
      <tbody>
        <tr><th>Standard</th><td>${standard || '-'}</td></tr>
        <tr><th>Grade</th><td>${grade || '-'}</td></tr>
        <tr><th>Thickness</th><td>Min: ${thicknessMin || '-'} mm | Max: ${thicknessMax || '-'} mm</td></tr>
        <tr><th>Width</th><td>Min: ${widthMin || '-'} mm | Max: ${widthMax || '-'} mm</td></tr>
        <tr><th>Quantity (Kg)</th><td>${qty || '-'}</td></tr>
        <tr><th>Surface Finish</th><td>${surfaceFinish || '-'}</td></tr>
        <tr><th>Hardness</th><td>${hardness || '-'}</td></tr>
      </tbody>
    </table>

    <h3 style="margin-top: 32px; font-size: 18px; color: #1a1a1a; border-bottom: 2px solid #eeeeee; padding-bottom: 8px;">Mechanical Properties & Other</h3>
    <table class="data-table" style="margin-top: 16px;">
      <tbody>
        <tr><th>Select One Option</th><td>${selectOne || '-'}</td></tr>
        <tr><th>UTS (N/mm²)</th><td>${uts || '-'}</td></tr>
        <tr><th>YS (N/mm²)</th><td>${ys || '-'}</td></tr>
        <tr><th>Elongation %</th><td>${elongation || '-'}</td></tr>
        <tr><th>End Use</th><td>${endUse || '-'}</td></tr>
        <tr><th>Special Requirements</th><td>${specialRequirements || '-'}</td></tr>
      </tbody>
    </table>
  `;

  const html = getEmailWrapper("Technical Details Provided", content);

  try {
    const { to, cc } = getRecipients();
    const emailPayload = {
      from: `Website <${fromEmail}>`,
      to,
      subject: `Technical Details Added by ${contactPerson} (${companyName})`,
      html: html,
      replyTo: email,
    };

    if (cc && cc.length > 0) {
      emailPayload.cc = cc;
    }

    const response = await resend.emails.send(emailPayload);
    console.log("Updated Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Failed to send updated email:", error);
    throw error;
  }
};

export const sendTestEmail = async (testToEmail, subject, htmlContent) => {
  if (!resend) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  // Replace common variables with dummy data for the test
  let processedHtml = htmlContent || '';
  processedHtml = processedHtml.replace(/\{\{userName\}\}/g, 'John Doe (Test)');
  processedHtml = processedHtml.replace(/\{\{companyName\}\}/g, 'Acme Corp');
  processedHtml = processedHtml.replace(/\{\{resetLink\}\}/g, 'https://example.com/reset');
  processedHtml = processedHtml.replace(/\{\{contactEmail\}\}/g, 'test@example.com');
  processedHtml = processedHtml.replace(/\{\{supportPhone\}\}/g, '+1 (555) 123-4567');

  const finalHtml = processedHtml;
  try {
    const response = await resend.emails.send({
      from: `Jindal Admin <${fromEmail}>`,
      to: [testToEmail],
      subject: `[TEST] ${subject || "Template Preview"}`,
      html: finalHtml,
    });
    console.log("Test Email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Failed to send test email:", error);
    throw error;
  }
};
