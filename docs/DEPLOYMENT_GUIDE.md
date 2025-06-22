# 🚀 Production Deployment Guide

## 🎯 Vercel Deployment (Recommended)

### Step 1: Prerequisites
- Vercel account connected to GitHub
- Production database (PostgreSQL)
- API keys for all services

### Step 2: Environment Variables

#### Required Environment Variables
```bash
# Database
DATABASE_URL="postgresql://username:password@host:5432/database"

# Authentication
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="your-long-random-secret-string"

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID="your-google-client-id.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AI Services
OPENAI_API_KEY="sk-your-openai-api-key"
ELEVENLABS_API_KEY="your-elevenlabs-api-key"

# Optional: Additional Services
SENTRY_DSN="your-sentry-dsn-for-error-tracking"
```

### Step 3: Deployment Commands

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to preview (first time)
vercel

# Deploy to production
vercel --prod
```

### Step 4: Post-Deployment Configuration

#### Database Setup
```bash
# Run migrations on production database
npx prisma migrate deploy

# Generate Prisma client for production
npx prisma generate

# Optional: Seed production database
npx prisma db seed
```

#### Google OAuth Configuration
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to APIs & Services > Credentials
3. Edit your OAuth 2.0 Client
4. Add your production URL to authorized redirect URIs:
   - `https://your-domain.vercel.app/api/auth/callback/google`

### Step 5: Performance Optimization

#### Vercel Configuration (vercel.json)
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "crons": [
    {
      "path": "/api/cron/update-market-data",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

## 🌐 Alternative Deployment Options

### Railway Deployment
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Netlify Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login and deploy
netlify login
netlify init
netlify deploy --prod
```

## 🏗️ Infrastructure Setup

### Database Options

#### Option 1: Vercel Postgres (Recommended)
```bash
# Create database in Vercel dashboard
# Copy connection string to environment variables
```

#### Option 2: Supabase
```bash
# Create project at supabase.com
# Copy connection string from project settings
# Enable row-level security if needed
```

#### Option 3: PlanetScale
```bash
# Create database at planetscale.com
# Create branch for production
# Copy connection string
```

### CDN and Asset Optimization

#### Vercel (Built-in)
- Automatic image optimization
- Edge caching for static assets
- Global CDN distribution

#### Cloudflare (Optional)
```bash
# Add domain to Cloudflare
# Configure DNS settings
# Enable performance features
```

## 🔒 Security Configuration

### HTTPS and SSL
- Vercel provides automatic HTTPS
- Custom domains get SSL certificates automatically
- HTTP requests are automatically redirected to HTTPS

### Environment Security
- Never commit .env files
- Use Vercel environment variables dashboard
- Rotate secrets regularly
- Use different secrets for preview/production

### CORS Configuration
```typescript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: process.env.NEXTAUTH_URL },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ]
  },
}
```

## 📊 Monitoring and Analytics

### Vercel Analytics
```bash
# Enable in vercel.json
{
  "analytics": true
}
```

### Error Monitoring with Sentry
```bash
# Install Sentry
npm install @sentry/nextjs

# Configure sentry.client.config.js
# Configure sentry.server.config.js
# Add SENTRY_DSN to environment variables
```

### Performance Monitoring
```typescript
// lib/performance.ts
export function reportWebVitals(metric: any) {
  // Send to analytics service
  console.log(metric)
}

// pages/_app.tsx
export { reportWebVitals } from '../lib/performance'
```

## 🧪 Testing Production Deployment

### Pre-Deployment Checklist
- [ ] All environment variables set
- [ ] Database migrations run
- [ ] Google OAuth configured
- [ ] API keys tested
- [ ] Domain DNS configured (if using custom domain)

### Post-Deployment Testing
```bash
# Test key endpoints
curl https://your-domain.vercel.app/api/health
curl https://your-domain.vercel.app/api/auth/session
curl https://your-domain.vercel.app/api/test-voice

# Test authentication flow
# Test voice integration
# Test market data integration
# Test PWA installation
```

### Performance Testing
- Run Lighthouse audit
- Test Core Web Vitals
- Verify PWA score
- Check mobile performance

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build logs in Vercel dashboard
# Verify all dependencies are in package.json
# Check for TypeScript errors
# Verify environment variables
```

#### Database Connection Issues
```bash
# Verify DATABASE_URL format
# Check database server accessibility
# Verify SSL settings
# Run prisma generate locally
```

#### API Key Issues
```bash
# Verify all keys are set in Vercel dashboard
# Check key format and validity
# Test keys locally first
# Verify service account permissions
```

### Performance Issues
```bash
# Enable Vercel Analytics
# Check function execution times
# Optimize database queries
# Implement caching strategies
```

## 📱 PWA Deployment Considerations

### Service Worker
- Ensure service worker is accessible at root
- Test offline functionality
- Verify caching strategies
- Test background sync

### App Installation
- Test install prompt on different devices
- Verify app icons display correctly
- Check manifest.json accessibility
- Test app shortcuts functionality

### Push Notifications
- Set up push notification service
- Configure VAPID keys
- Test notification permissions
- Verify background sync

## 🎯 Production Readiness Checklist

### Technical
- [ ] All tests passing
- [ ] No console errors in production
- [ ] Lighthouse score 95+
- [ ] PWA installable
- [ ] All sponsor integrations working
- [ ] Error boundaries handling edge cases
- [ ] Database migrations completed
- [ ] CDN and caching configured

### Business
- [ ] Terms of service and privacy policy
- [ ] Contact information updated
- [ ] Analytics and monitoring enabled
- [ ] Backup and recovery plan
- [ ] User support documentation
- [ ] SEO optimization complete

### Security
- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] API rate limiting configured
- [ ] Input validation implemented
- [ ] Authentication working correctly
- [ ] CORS properly configured

---

**Deployment Status**: Ready for production! 🚀

Next: Run `vercel --prod` to deploy to production.
