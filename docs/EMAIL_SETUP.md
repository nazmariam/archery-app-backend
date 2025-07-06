# Email Service Setup

## Overview
The email service is implemented using Nodemailer and supports SMTP for sending emails. It's configured to work with various email providers.

## Environment Variables

Add the following variables to your `.env` file:

```env
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME=Archery App
```

## Email Provider Setup

### Gmail
1. Enable 2-factor authentication on your Google account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. Use the generated password as `SMTP_PASSWORD`

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASSWORD=your-password
SMTP_FROM_EMAIL=your-email@outlook.com
SMTP_FROM_NAME=Archery App
```

### Custom SMTP Server
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASSWORD=your-password
SMTP_FROM_EMAIL=noreply@your-domain.com
SMTP_FROM_NAME=Archery App
```

## Testing the Email Service

### Test Endpoint
Send a POST request to `/email/test`:

```bash
curl -X POST http://localhost:3000/email/test \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "subject": "Test Email",
    "message": "This is a test message"
  }'
```

### Available Email Methods

1. **sendEmail(options)** - Send a custom email
2. **sendPasswordResetEmail(email, resetToken, resetUrl)** - Send password reset email
3. **sendWelcomeEmail(email, firstName)** - Send welcome email

## Usage in Other Services

Import and inject the EmailService in your modules:

```typescript
import { EmailService } from '../email/email.service';

@Injectable()
export class YourService {
  constructor(private readonly emailService: EmailService) {}

  async someMethod() {
    await this.emailService.sendWelcomeEmail('user@example.com', 'John');
  }
}
```