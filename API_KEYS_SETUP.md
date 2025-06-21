# SkillBridge AI - API Keys Setup Guide

## 📋 Required Credentials Checklist

- [ ] Google OAuth (Client ID & Secret)
- [ ] NextAuth Secret
- [ ] OpenAI API Key
- [ ] ElevenLabs API Key & Voice ID
- [ ] PostgreSQL Database URL
- [ ] Uclone MCP Server (Optional)
- [ ] Redis URL (Optional)

---

## 1️⃣ Google OAuth Setup

### Steps:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API:
   - Go to "APIs & Services" → "Enable APIs and Services"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `http://localhost:3001/api/auth/callback/google`
     - `http://localhost:3002/api/auth/callback/google`
     - `https://your-domain.com/api/auth/callback/google` (for production)
5. Copy the Client ID and Client Secret

### Environment Variables:
```env
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-client-secret-here
```

---

## 2️⃣ NextAuth Secret

### Generate a secure secret:
```bash
# Option 1: Using OpenSSL
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Environment Variable:
```env
NEXTAUTH_SECRET=your-generated-secret-here
NEXTAUTH_URL=http://localhost:3000
```

---

## 3️⃣ OpenAI API Key

### Steps:
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API keys section
4. Click "Create new secret key"
5. Copy the key immediately (it won't be shown again)

### Environment Variable:
```env
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### Cost Management Tips:
- Set usage limits in OpenAI dashboard
- Use GPT-3.5-turbo for development
- Monitor usage regularly

---

## 4️⃣ ElevenLabs API Key & Voice ID

### Steps:
1. Go to [ElevenLabs](https://elevenlabs.io/)
2. Sign up for an account (free tier available)
3. Go to Profile Settings
4. Copy your API key from the API section
5. Choose a voice:
   - Go to "Voices" section
   - Select a voice you like
   - Copy the Voice ID from voice settings

### Popular Voice IDs:
- Rachel (calm female): `21m00Tcm4TlvDq8ikWAM`
- Domi (energetic female): `AZnzlk1XvdvUeBnXmlld`
- Bella (soft female): `EXAVITQu4vr4xnSDxMaL`
- Josh (conversational male): `TxGEqnHWrfWFTfGW9XjX`
- Arnold (strong male): `VR6AewLTigWG4xSOukaG`

### Environment Variables:
```env
ELEVENLABS_API_KEY=your-elevenlabs-api-key-here
ELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM
```

---

## 5️⃣ PostgreSQL Database Setup

### Option A: Local PostgreSQL with Docker
```bash
# Using the docker-compose.yml already in the project
docker-compose up -d postgres

# Database URL for local Docker
DATABASE_URL="postgresql://skillbridge:skillbridge_dev_password@localhost:5432/skillbridge_ai?schema=public"
```

### Option B: Vercel Postgres (Recommended for deployment)
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (or create one)
3. Go to "Storage" tab
4. Click "Create Database" → "Postgres"
5. Copy the connection string

### Option C: Supabase (Free tier)
1. Go to [Supabase](https://supabase.com/)
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string

### Option D: Neon (Serverless Postgres)
1. Go to [Neon](https://neon.tech/)
2. Create a database
3. Copy the connection string

### Environment Variable:
```env
DATABASE_URL="your-database-connection-string"
```

---

## 6️⃣ Uclone MCP Server (Optional)

### Note: This is for the hackathon integration
- Check hackathon resources for access
- May require special registration
- Contact hackathon organizers if needed

### Environment Variables:
```env
UCLONE_MCP_SERVER_URL=https://api.uclone-mcp.com
UCLONE_MCP_API_KEY=your-uclone-api-key
```

---

## 7️⃣ Redis Setup (Optional - for caching)

### Option A: Local Redis with Docker
```bash
# Using the docker-compose.yml already in the project
docker-compose up -d redis

# Redis URL for local Docker
REDIS_URL="redis://localhost:6379"
```

### Option B: Upstash Redis (Serverless)
1. Go to [Upstash](https://upstash.com/)
2. Create a Redis database
3. Copy the connection string

### Environment Variable:
```env
REDIS_URL="redis://default:your-password@your-endpoint.upstash.io:port"
```

---

## 🚀 Quick Setup Commands

### 1. Copy environment template
```bash
cp .env.example .env.local
```

### 2. Generate NextAuth secret
```bash
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env.local
```

### 3. Start local database
```bash
docker-compose up -d postgres redis
```

### 4. Run database migrations
```bash
npm run db:push
```

### 5. Seed the database (optional)
```bash
npm run db:seed
```

### 6. Start development server
```bash
npm run dev
```

---

## 🧪 Testing Your Setup

### 1. Test Database Connection
```bash
npx prisma studio
```

### 2. Test Authentication
- Navigate to http://localhost:3000/auth/login
- Try Google sign-in
- Check for any console errors

### 3. Test API Keys (in browser console)
```javascript
// Test OpenAI
fetch('/api/ai/test')

// Test ElevenLabs
fetch('/api/voice/test')
```

---

## 🔒 Security Best Practices

1. **Never commit .env.local to git**
   - Already in .gitignore
   - Double-check before committing

2. **Use different keys for production**
   - Separate development and production API keys
   - Set stricter limits on production keys

3. **Rotate keys regularly**
   - Especially if exposed accidentally
   - Update in all environments

4. **Monitor usage**
   - Set up billing alerts
   - Check API dashboards regularly

---

## 📝 Troubleshooting

### Google OAuth Issues
- Ensure redirect URIs match exactly
- Check if Google+ API is enabled
- Clear browser cookies and try again

### Database Connection Issues
- Check if Docker is running
- Verify connection string format
- Ensure PostgreSQL port (5432) is not in use

### API Key Issues
- Check for extra spaces or quotes
- Ensure keys are in .env.local (not .env)
- Restart dev server after changing .env.local

---

## 💡 Development Tips

1. **Start with free tiers**
   - OpenAI: $5 free credit
   - ElevenLabs: 10,000 characters/month free
   - Supabase/Neon: Free PostgreSQL

2. **Use local services when possible**
   - Local PostgreSQL with Docker
   - Mock API responses during development

3. **Keep a backup of your keys**
   - Use a password manager
   - Document which keys are for which environment

---

## 🎯 Next Steps

Once all keys are configured:
1. Run `npm run dev`
2. Test authentication at `/auth/login`
3. Check database connection with `npx prisma studio`
4. Proceed to Phase 3 of development!

For hackathon demo, prioritize:
- Google OAuth (for authentication demo)
- OpenAI API (for AI features)
- ElevenLabs (for voice features)
- PostgreSQL (local Docker is fine)
