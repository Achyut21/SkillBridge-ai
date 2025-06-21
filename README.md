# SkillBridge AI Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 24.2.0 (use NVM)
- Docker & Docker Compose (for local database)
- Google OAuth credentials

### 1. Clone and Install
```bash
git clone [your-repo]
cd skillbridge-ai
nvm use 24.2.0
npm install
```

### 2. Database Setup

#### Option A: Local PostgreSQL with Docker (Recommended)
```bash
# Start PostgreSQL and Redis
docker-compose up -d

# Update .env.local
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/skillbridge"
```

#### Option B: Supabase (Free Tier)
1. Create account at https://supabase.com
2. Create new project
3. Copy connection string from Settings > Database
4. Update DATABASE_URL in .env.local

#### Option C: Vercel Postgres
1. Deploy to Vercel
2. Add Postgres from Vercel dashboard
3. Copy DATABASE_URL from environment variables

### 3. Configure Environment Variables
```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local with your values:
# - DATABASE_URL (from step 2)
# - GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET
# - OPENAI_API_KEY (when ready for Phase 4)
# - ELEVENLABS_API_KEY (when ready for voice features)
```

### 4. Database Migration
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Seed with sample data
npm run db:seed
```

### 5. Google OAuth Setup
1. Go to https://console.cloud.google.com
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - http://localhost:3004/api/auth/callback/google
   - (your production URL)/api/auth/callback/google

### 6. Start Development Server
```bash
npm run dev
# Server runs on http://localhost:3004
```

## 📁 Project Structure
```
skillbridge-ai/
├── src/
│   ├── app/              # Next.js 14 App Router
│   ├── components/       # React components
│   ├── lib/             # Utilities & configs
│   ├── services/        # External services
│   └── stores/          # State management
├── prisma/              # Database schema
├── public/              # Static assets
└── docker-compose.yml   # Local development
```

## 🎨 UI Design System

### Phase 3 UI Updates (Current)

#### **Monochromatic Purple Theme**
The entire application now uses a sophisticated purple color palette for a cohesive, modern look:

- **Primary Colors**: Purple shades from `brand-50` to `brand-950`
- **Accent Colors**: Focused on `brand-500` (#A855F7) as the main accent
- **Neutral Colors**: Gray scale for text and backgrounds
- **Removed**: All rainbow colors (blue, pink, cyan, etc.) for consistency

#### **Component Updates**
1. **GlassmorphismCard**: Three variants (light, medium, heavy) with purple-tinted glass effects
2. **GradientButton**: Four consistent variants (primary, secondary, ghost, outline) with proper sizing
3. **NeonBorder**: Subtle purple glow effects instead of harsh neon
4. **AnimatedBackground**: Reduced particle count with subtle purple connections

#### **Layout Improvements**
- **Fixed Double Header/Sidebar Issue**: Dashboard pages now use Next.js 13+ file-based layouts properly
- **Responsive Design**: Mobile-friendly with collapsible sidebar and responsive grids
- **Consistent Spacing**: Unified padding and margins across all components
- **Sticky Header**: Header remains visible while scrolling

#### **Page Enhancements**
- **Dashboard**: Clean stat cards with hover effects, organized content sections
- **Voice Coach**: Ready for ElevenLabs integration with purple-themed UI
- **Market Trends**: Real-time insights with consistent data visualization
- **Profile**: User management with glassmorphism effects
- **Auth Pages**: Sleek login/register with purple gradients

### Design Principles
- **Glassmorphism**: Subtle backdrop blur with purple tints
- **Minimal Animations**: Smooth transitions without distraction
- **Accessibility**: High contrast ratios and keyboard navigation
- **Performance**: Hardware-accelerated CSS animations

## 🛠️ Development Commands

```bash
# Development
npm run dev          # Start dev server (port 3004)
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes
npm run db:seed      # Seed sample data
npm run db:studio    # Open Prisma Studio

# Utilities
npm run check        # System check
npm run test:api     # Test API endpoints
./scripts/start-dev.sh  # One-command startup
```

## 🔧 Troubleshooting

### Common Issues

1. **Node Version Error**
   ```bash
   nvm use 24.2.0
   ```

2. **Database Connection**
   - Ensure Docker is running: `docker ps`
   - Check DATABASE_URL in .env.local
   - Run `npm run db:push` to sync schema

3. **Google OAuth Issues**
   - Verify redirect URIs match port 3004
   - Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
   - Ensure Google+ API is enabled

4. **Port Conflicts**
   - Server runs on port 3004 by default
   - Change in package.json if needed

## 📊 Current Status

### ✅ Phase 3 Complete
- Modern purple monochromatic UI theme
- Glassmorphism effects with consistent styling  
- Voice UI components ready for integration
- Responsive dashboard with 6 pages
- Authentication with Google OAuth
- Fixed layout issues (no double headers/sidebars)

### 🚀 Ready for Phase 4
- OpenAI integration pending
- ElevenLabs voice features pending
- Market data connectors pending
- Real-time analytics pending

## 🔗 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [NextAuth.js](https://next-auth.js.org)

---

Built for the 2025 Dream AI Hackathon 🚀
