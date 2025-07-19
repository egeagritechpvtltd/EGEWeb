# Firebase Functions for EGE Agritech

This directory contains the Firebase Cloud Functions for the EGE Agritech application.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd functions
   npm install
   ```

2. **Set Up Environment Variables**
   - Option 1: Using Firebase Config (recommended for production)
     ```bash
     firebase functions:config:set gmail.email=your-email@gmail.com gmail.password=your-app-specific-password
     ```
   - Option 2: Using .env file (for local development)
     Create a `.env` file in the functions directory with:
     ```
     GMAIL_EMAIL=your-email@gmail.com
     GMAIL_PASSWORD=your-app-specific-password
     ```

   **Note:** For Gmail, you'll need to:
   1. Enable 2-Step Verification on your Google Account
   2. Generate an App Password for this application
   3. Use the generated app password instead of your regular password

3. **Deploy Functions**
   ```bash
   firebase deploy --only functions
   ```

## Available Functions

- `sendInquiryNotification`: Automatically sends an email to the admin when a new inquiry is created in Firestore.
- `sendTestEmail`: A test function that can be called manually to verify email sending works.

## Local Development

1. Start the Firebase emulator:
   ```bash
   firebase emulators:start --only functions
   ```

2. Test the function locally using the Firebase CLI or the emulator UI.

## Security Rules

Make sure your Firestore security rules allow the Cloud Function to read/write to the necessary collections.
