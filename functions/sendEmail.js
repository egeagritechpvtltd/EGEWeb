const functions = require('firebase-functions');
const { Resend } = require('resend');

// Get Resend API key from environment config
const resendApiKey = functions.config().resend?.api_key;
const fromEmail = 'info@egeorganic.com'; // Change this to your domain after setting up DNS

if (!resendApiKey) {
  console.error('Resend API key not configured. Set it using:');
  console.error('firebase functions:config:set resend.api_key=re_hS3XJgJr_HT9CG9KwfrwoR9EyrdBNpTBn');
  process.exit(1);
}

const resend = new Resend(resendApiKey);

/**
 * Sends an email using Resend
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - HTML content of the email
 * @returns {Promise<boolean>} True if email was sent successfully
 */
const sendEmail = async (to, subject, html) => {
  try {
    console.log('Attempting to send email with Resend:', { 
      to,
      subject,
      from: fromEmail
    });
    
    const { data, error } = await resend.emails.send({
      from: `EGE Agritech <${fromEmail}>`,
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error('Resend API error:', error);
      throw new Error(`Resend error: ${error.message}`);
    }

    console.log('Email sent successfully with Resend:', data);
    return true;
    
  } catch (error) {
    console.error('Error sending email with Resend:', {
      message: error.message,
      stack: error.stack,
      details: error.details || 'No additional details'
    });
    
    // Re-throw the error with more context
    const emailError = new Error(`Failed to send email: ${error.message}`);
    emailError.originalError = error;
    throw emailError;
  }
};

module.exports = sendEmail;
