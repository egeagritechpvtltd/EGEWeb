# EGE Organics Backend

This is the backend server for the EGE Organics website, handling contact form submissions and newsletter subscriptions.

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`
   - Update the following variables in `.env`:
     ```
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASS=your-app-password  # Use an App Password from Gmail
     PORT=5000
     NODE_ENV=development
     ```

   > **Note:** For Gmail, you'll need to generate an App Password:
   > 1. Go to your Google Account settings
   > 2. Navigate to Security > 2-Step Verification
   > 3. At the bottom, select App Passwords
   > 4. Generate a new app password for your application

3. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5000`

## API Endpoints

### Contact Form
- **POST** `/api/contact`
  - Body: `{ name: string, email: string, subject: string, message: string }`
  - Success Response: `{ success: true, message: string }`
  - Error Response: `{ error: string, details?: string }`

### Newsletter Subscription
- **POST** `/api/subscribe`
  - Body: `{ email: string }`
  - Success Response: `{ success: true, message: string }`
  - Error Response: `{ error: string, details?: string }`

## Deployment

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- Gmail account (or another SMTP provider)

### Production Deployment
1. Set `NODE_ENV=production` in your `.env` file
2. Update CORS settings in `src/index.js` to include your production domain
3. Use a process manager like PM2 to keep the server running:
   ```bash
   npm install -g pm2
   pm2 start src/index.js --name "ege-backend"
   pm2 save
   pm2 startup
   ```

## Security Notes
- Never commit your `.env` file to version control
- Use environment variables for all sensitive data
- In production, use a proper SMTP service like SendGrid or Mailgun instead of Gmail
- Consider adding rate limiting to prevent abuse
