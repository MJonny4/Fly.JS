# Security Configuration

## 🔐 Environment Variables Setup

Before running this application, you **MUST** configure your environment variables properly.

### Required Steps:

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Configure your database credentials:**
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=flyjs
   DB_USER=your_actual_database_username
   DB_PASSWORD=your_actual_database_password
   ```

3. **Generate secure JWT secrets:**
   ```bash
   # Generate random JWT secrets (minimum 32 characters)
   node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
   node -e "console.log('JWT_REFRESH_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
   ```

   Then update your `.env` file with these values:
   ```env
   JWT_SECRET=your_generated_secret_here
   JWT_REFRESH_SECRET=your_generated_refresh_secret_here
   ```

## ⚠️ Security Warnings

- **NEVER** commit your `.env` file to version control
- **ALWAYS** use strong, randomly generated JWT secrets in production
- **CHANGE** default database credentials
- The application will **fail to start** if JWT secrets are not properly configured

## 🛡️ Production Security Checklist

- [ ] Use environment variables for all secrets
- [ ] Generate cryptographically secure JWT secrets (32+ characters)
- [ ] Use strong database passwords
- [ ] Enable HTTPS in production
- [ ] Configure proper CORS origins
- [ ] Set appropriate rate limits
- [ ] Use a reverse proxy (nginx/Apache)
- [ ] Enable database SSL/TLS
- [ ] Regular security audits of dependencies

## 🚨 Default Development Values

The codebase contains **NO hardcoded sensitive information**. All sensitive data must be provided via environment variables.

If you see any hardcoded secrets, passwords, or API keys in the code, please report them immediately as a security issue.