const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const functions = require('firebase-functions');
const cors = require('cors');
const sendEmail = require('./sendEmail');
const admin = require('firebase-admin');

// Initialize Firebase Admin
const adminApp = initializeApp();
const db = getFirestore(adminApp);

// Configure CORS
const corsHandler = cors({ origin: true });

// Helper function to handle CORS requests
const handleCors = (handler) => (req, res) => {
  corsHandler(req, res, () => {
    return handler(req, res);
  });
};

// Admin email
const ADMIN_EMAIL = 'egeagritechpvtltd@gmail.com';

// Cloud Function that triggers on new inquiry
exports.sendInquiryNotification = functions.firestore
  .document('inquiries/{inquiryId}')
  .onCreate(async (snapshot, context) => {
    console.log('sendInquiryNotification triggered');
    
    try {
      const inquiryData = snapshot.data();
      const { name, email, mobile, type } = inquiryData || {};

      // Log the received data for debugging
      console.log('Inquiry data:', { name, email, mobile, type });

      // Skip if not a learn_more inquiry or missing required fields
      if (type !== 'learn_more' || !name || !email || !mobile) {
        console.log('Skipping email notification: Not a learn_more inquiry or missing required fields');
        return null;
      }

      // Email subject
      const subject = `New Inquiry from ${name}`;
      
      // Email content
      const html = `
        <h2>New Inquiry Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mobile:</strong> ${mobile}</p>
        <p><strong>User Type:</strong> ${userType || 'Not specified'}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <br/>
        <p>Please respond to this inquiry as soon as possible.</p>
      `;

      console.log('Sending email to admin...');
      // Send email to admin
      const emailSent = await sendEmail(ADMIN_EMAIL, subject, html);
      
      if (emailSent) {
        console.log('Email sent successfully, updating document...');
        // Update the inquiry document to mark email as sent
        await snapshot.ref.update({
          notificationSent: true,
          notificationDate: FieldValue.serverTimestamp(),
        });
        
        console.log('Inquiry notification sent successfully');
        return null;
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error processing inquiry notification:', error);
      // Log the full error for debugging
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        code: error.code,
        details: error.details
      });
      
      // Update the document with error information
      if (snapshot && snapshot.ref) {
        await snapshot.ref.update({
          notificationError: error.message,
          notificationSent: false,
        });
      }
      
      // Don't throw here to avoid retrying the function
      return null;
    }
  });

// Test function (can be called manually from Firebase Console)
exports.sendTestEmail = functions.https.onRequest(async (req, res) => {
  console.log('sendTestEmail function called');
  
  try {
    const testEmail = ADMIN_EMAIL;
    console.log(`Sending test email to: ${testEmail}`);
    
    const result = await sendEmail(
      testEmail,
      'Test Email from Firebase Functions',
      '<h1>Test Email</h1><p>This is a test email sent from Firebase Functions.</p>'
    );
    
    if (result) {
      console.log('Test email sent successfully');
      res.status(200).send('Test email sent successfully!');
    } else {
      console.error('Failed to send test email: sendEmail returned false');
      res.status(500).send('Failed to send test email');
    }
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).send(`Error: ${error.message}`);
  }
});

// Handle contact form submission (Callable Function)
exports.handleContactForm = functions.https.onCall(async (data, context) => {
  console.log('handleContactForm callable function triggered');
  console.log('Received data:', JSON.stringify(data, null, 2));
  
  try {
    // Validate input
    if (!data) {
      console.error('No data received');
      throw new functions.https.HttpsError(
        'invalid-argument',
        'No data received in the request'
      );
    }

    const { name, email, message, subject } = data;
    
    // Log all received data for debugging
    console.log('Extracted data:', { name, email, message, subject });
    
    // Validate required fields
    const missingFields = [];
    if (!name) missingFields.push('name');
    if (!email) missingFields.push('email');
    if (!message) missingFields.push('message');
    if (!subject) missingFields.push('subject');
    
    if (missingFields.length > 0) {
      const errorMsg = `Missing required fields: ${missingFields.join(', ')}`;
      console.error('Validation failed:', errorMsg);
      throw new functions.https.HttpsError(
        'invalid-argument',
        errorMsg
      );
    }

    console.log('Sending contact form email to admin...');
    
    try {
      // Try to send email
      console.log('Attempting to send email to:', ADMIN_EMAIL);
      const emailSent = await sendEmail(
        ADMIN_EMAIL,
        `New Contact Form Submission: ${subject}`,
        `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `
      );

      if (!emailSent) {
        throw new Error('Email sending failed - sendEmail returned false');
      }
      console.log('Contact form email sent successfully');
      
      // Save to Firestore
      console.log('Saving to Firestore...');
      try {
        await db.collection('contactSubmissions').add({
          name,
          email,
          subject,
          message,
          createdAt: FieldValue.serverTimestamp(),
        });
        console.log('Saved to Firestore successfully');
      } catch (dbError) {
        console.error('Error saving to Firestore (non-fatal):', dbError);
        // Continue even if Firestore save fails
      }
      
      return { 
        success: true, 
        message: 'Your message has been sent successfully!',
        timestamp: new Date().toISOString()
      };
      
    } catch (emailError) {
      console.error('Error in email sending process:', emailError);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to send email: ' + (emailError.message || 'Unknown error'),
        { 
          code: emailError.code,
          details: emailError.details || emailError.toString()
        }
      );
    }
    
  } catch (error) {
    console.error('Error in handleContactForm:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      details: error.details
    });
    
    // If it's already an HttpsError, re-throw it
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    // Otherwise, wrap the error with more context
    throw new functions.https.HttpsError(
      'internal',
      'Failed to process contact form: ' + (error.message || 'Unknown error'),
      { 
        code: error.code || 'unknown',
        details: error.details || error.toString(),
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    );
  }
});

// Handle newsletter subscription (Callable Function)
exports.subscribeNewsletter = functions.https.onCall(async (data, context) => {
  console.log('subscribeNewsletter callable function triggered');
  console.log('Received data:', JSON.stringify(data, null, 2));
  
  try {
    const { email } = data;
    
    // Validate input
    if (!email || !email.includes('@')) {
      console.error('Invalid email provided:', email);
      throw new functions.https.HttpsError(
        'invalid-argument',
        'A valid email address is required'
      );
    }

    console.log('Processing subscription for email:', email);
    
    // Check if email already exists in the newsletter collection
    const existingSubscriber = await db.collection('newsletter')
      .where('email', '==', email)
      .limit(1)
      .get();
    
    if (!existingSubscriber.empty) {
      console.log('Email already subscribed:', email);
      return { 
        success: true, 
        message: 'You are already subscribed to our newsletter!',
        alreadySubscribed: true
      };
    }

    console.log('Adding email to newsletter collection...');
    // Add email to newsletter collection
    await db.collection('newsletter').add({
      email,
      subscribedAt: FieldValue.serverTimestamp(),
      active: true,
      source: 'website-footer'
    });

    console.log('Sending welcome email to:', email);
    // Send welcome email
    const emailSent = await sendEmail(
      email,
      'Welcome to EGE Organic Newsletter',
      `
        <h2>Thank you for subscribing to EGE Organic!</h2>
        <p>You've been successfully subscribed with the email: <strong>${email}</strong></p>
        <p>We'll keep you updated with our latest organic products, news, and exclusive offers.</p>
        <p>Stay tuned!</p>
        <p>— The EGE Organic Team</p>
      `
    );

    if (!emailSent) {
      console.error('Failed to send welcome email to:', email);
      // Don't fail the subscription if email sending fails
      // Just log it and continue
    } else {
      console.log('Welcome email sent successfully to:', email);
    }

    return { 
      success: true, 
      message: 'Thank you for subscribing to our newsletter!',
      email: email
    };
    
  } catch (error) {
    console.error('Error in subscribeNewsletter:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      details: error.details
    });
    
    // If it's already an HttpsError, re-throw it
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    // Otherwise, wrap the error
    throw new functions.https.HttpsError(
      'internal',
      'Failed to process subscription: ' + (error.message || 'Unknown error'),
      { 
        code: error.code || 'unknown',
        details: error.details || error.toString(),
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    );
  }
});

// Handle form submissions from the LearnMoreForm component
exports.handleLearnMoreForm = functions.https.onCall(async (data, context) => {
  console.log('handleLearnMoreForm callable function triggered');
  console.log('Received data:', JSON.stringify(data, null, 2));
  
  try {
    const { name, email, mobile, userType } = data;
    
    // Validate input
    if (!name || !email || !mobile) {
      console.error('Missing required fields');
      throw new functions.https.HttpsError(
        'invalid-argument',
        'All fields are required'
      );
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      console.error('Invalid email format:', email);
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Please provide a valid email address'
      );
    }

    console.log('Saving form submission to Firestore...');
    // Save to Firestore
    const docRef = await db.collection('inquiries').add({
      name,
      email,
      mobile,
      userType,
      status: 'new',
      type: 'learn_more',
      createdAt: FieldValue.serverTimestamp(),
      source: 'website_popup'
    });

    console.log('Sending notification email to admin...');
    // Send email to admin
    const emailSent = await sendEmail(
      ADMIN_EMAIL,
      'New Learn More Form Submission',
      `
        <h2>New Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mobile:</strong> ${mobile}</p>
        <p><strong>User Type:</strong> ${userType || 'Not specified'}</p>
        <p><strong>Submission ID:</strong> ${docRef.id}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <p>Please follow up with this inquiry as soon as possible.</p>
      `
    );

    if (!emailSent) {
      console.error('Failed to send notification email');
      // Don't fail the submission if email sending fails
      // Just log it and continue
    }

    // Send confirmation email to the user
    const userEmailSent = await sendEmail(
      email,
      'Thank You for Your Interest - EGE Organic',
      `
        <h2>Thank You for Your Interest!</h2>
        <p>Dear ${name},</p>
        <p>Thank you for reaching out to EGE Organic. We have received your inquiry and our team will contact you shortly.</p>
        <p><strong>Your Contact Details:</strong></p>
        <p>Email: ${email}<br/>
           Phone: ${mobile}</p>
        <p>If you have any urgent questions, please don't hesitate to contact us at ${ADMIN_EMAIL}.</p>
        <p>Best regards,<br/>The EGE Organic Team</p>
      `
    );

    if (!userEmailSent) {
      console.error('Failed to send confirmation email to user');
      // Don't fail the submission if email sending fails
    }

    return { 
      success: true, 
      message: 'Thank you for your interest! We will contact you soon.',
      submissionId: docRef.id
    };
    
  } catch (error) {
    console.error('Error in handleLearnMoreForm:', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      details: error.details
    });
    
    // If it's already an HttpsError, re-throw it
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    
    // Otherwise, wrap the error
    throw new functions.https.HttpsError(
      'internal',
      'Failed to process form submission: ' + (error.message || 'Unknown error'),
      { 
        code: error.code || 'unknown',
        details: error.details || error.toString(),
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    );
  }
});

// All functions are exported directly using exports.functionName
