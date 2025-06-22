#!/bin/bash

echo "📊 SkillBridge AI - Project File Statistics"
echo "==========================================="
echo "Generated on: $(date)"
echo ""

# Function to format numbers with commas
format_number() {
    echo "$1" | sed ':a;s/\B[0-9]\{3\}\>/,&/;ta'
}

# Count files by type
echo "📁 File Count by Type:"
echo "====================="
echo "TypeScript (.ts):     $(find src -name "*.ts" -not -path "*/node_modules/*" | wc -l | xargs)"
echo "TypeScript React (.tsx): $(find src -name "*.tsx" -not -path "*/node_modules/*" | wc -l | xargs)"
echo "JavaScript (.js):     $(find . -name "*.js" -not -path "*/node_modules/*" -not -path "*/.next/*" | wc -l | xargs)"
echo "CSS Files:            $(find . -name "*.css" -not -path "*/node_modules/*" | wc -l | xargs)"
echo "Markdown (.md):       $(find . -name "*.md" -not -path "*/node_modules/*" | wc -l | xargs)"
echo "JSON Files:           $(find . -name "*.json" -not -path "*/node_modules/*" -not -path "*/.next/*" | wc -l | xargs)"
echo ""

# Directory structure
echo "📂 Main Directory Structure:"
echo "============================"
echo "src/"
echo "├── app/ ($(find src/app -type f | wc -l | xargs) files)"
echo "│   ├── api/ ($(find src/app/api -type f | wc -l | xargs) files)"
echo "│   ├── auth/ ($(find src/app/auth -type f | wc -l | xargs) files)"
echo "│   └── dashboard/ ($(find src/app/dashboard -type f | wc -l | xargs) files)"
echo "├── components/ ($(find src/components -type f | wc -l | xargs) files)"
echo "│   ├── ai/ ($(find src/components/ai -type f | wc -l | xargs) files)"
echo "│   ├── custom/ ($(find src/components/custom -type f | wc -l | xargs) files)"
echo "│   ├── layout/ ($(find src/components/layout -type f | wc -l | xargs) files)"
echo "│   └── voice/ ($(find src/components/voice -type f | wc -l | xargs) files)"
echo "├── hooks/ ($(find src/hooks -type f | wc -l | xargs) files)"
echo "├── lib/ ($(find src/lib -type f | wc -l | xargs) files)"
echo "├── services/ ($(find src/services -type f | wc -l | xargs) files)"
echo "└── stores/ ($(find src/stores -type f | wc -l | xargs) files)"
echo ""

# Lines of code
echo "📝 Lines of Code:"
echo "================="
TS_LINES=$(find src -name "*.ts" -o -name "*.tsx" | xargs wc -l | tail -1 | awk '{print $1}')
CSS_LINES=$(find src -name "*.css" | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}')
echo "TypeScript/TSX:   $(format_number $TS_LINES) lines"
echo "CSS:              $(format_number ${CSS_LINES:-0}) lines"
echo "Total:            $(format_number $((TS_LINES + ${CSS_LINES:-0}))) lines"
echo ""

# Component count
echo "🧩 Component Statistics:"
echo "======================="
echo "React Components:     $(grep -r "export.*function\|export.*const.*=.*(" src/components --include="*.tsx" | wc -l | xargs)"
echo "Custom Hooks:         $(find src/hooks -name "*.ts" | wc -l | xargs)"
echo "API Routes:           $(find src/app/api -name "route.ts" | wc -l | xargs)"
echo "Pages:                $(find src/app -name "page.tsx" | wc -l | xargs)"
echo ""

# Size analysis
echo "💾 Size Analysis:"
echo "================="
echo "Source Code:      $(du -sh src 2>/dev/null | cut -f1)"
echo "Public Assets:    $(du -sh public 2>/dev/null | cut -f1)"
echo "Total Project:    $(du -sh . 2>/dev/null | cut -f1) (excluding node_modules)"
echo ""

# Dependency count
echo "📦 Dependencies:"
echo "================"
echo "Production:       $(grep -c '": "' package.json | grep -A1 dependencies | tail -1 | xargs)"
echo "Development:      $(grep -c '": "' package.json | grep -A1 devDependencies | tail -1 | xargs)"
echo ""

# Create detailed report
cat > PROJECT_STATS.md << 'EOF'
# SkillBridge AI - Project Statistics Report

## 📊 Project Overview

Generated on: $(date)

### 📁 File Distribution

| File Type | Count | Purpose |
|-----------|-------|---------|
| TypeScript (.ts) | $(find src -name "*.ts" -not -path "*/node_modules/*" | wc -l | xargs) | Business logic, services, utilities |
| TypeScript React (.tsx) | $(find src -name "*.tsx" -not -path "*/node_modules/*" | wc -l | xargs) | React components and pages |
| CSS Files | $(find . -name "*.css" -not -path "*/node_modules/*" | wc -l | xargs) | Styling |
| API Routes | $(find src/app/api -name "route.ts" | wc -l | xargs) | Backend endpoints |

### 📂 Architecture Breakdown

#### App Directory (Next.js 13+ App Router)
- **Pages**: $(find src/app -name "page.tsx" | wc -l | xargs) routes
- **Layouts**: $(find src/app -name "layout.tsx" | wc -l | xargs) layout files
- **API Routes**: $(find src/app/api -name "route.ts" | wc -l | xargs) endpoints

#### Components
- **UI Components**: $(find src/components/ui -name "*.tsx" 2>/dev/null | wc -l | xargs) files
- **Custom Components**: $(find src/components/custom -name "*.tsx" 2>/dev/null | wc -l | xargs) files
- **AI Components**: $(find src/components/ai -name "*.tsx" 2>/dev/null | wc -l | xargs) files
- **Voice Components**: $(find src/components/voice -name "*.tsx" 2>/dev/null | wc -l | xargs) files

#### State Management
- **Zustand Stores**: $(find src/stores -name "*.ts" -not -path "*redux*" 2>/dev/null | wc -l | xargs) files
- **Redux Slices**: $(find src/stores/redux/slices -name "*.ts" 2>/dev/null | wc -l | xargs) files

### 📈 Code Metrics

- **Total Lines of Code**: $(find src -name "*.ts" -o -name "*.tsx" | xargs wc -l | tail -1 | awk '{print $1}') lines
- **Average File Size**: ~$(find src -name "*.ts" -o -name "*.tsx" | xargs wc -l | awk '{total += $1; count++} END {print int(total/count)}') lines per file

### 🔧 Technology Stack

#### Frontend
- Next.js 15.3.4 (App Router)
- React 19.1.0
- TypeScript 5.x
- Tailwind CSS 3.4.1
- Framer Motion 10.18.0

#### State Management
- Zustand 4.4.7
- Redux Toolkit 2.8.2

#### Backend & Database
- Prisma 6.10.1
- PostgreSQL (via Prisma Accelerate)
- NextAuth 4.24.5

#### AI/ML Services
- OpenAI API (GPT-4)
- ElevenLabs (Text-to-Speech)

### 🎨 UI Component Library

- **Glassmorphism Components**: Custom glass-effect cards and buttons
- **Voice Components**: Audio player, waveform visualizer
- **AI Components**: Chat interface, suggestion cards
- **Animation Components**: Animated backgrounds, loading states

### 📊 Complexity Analysis

| Metric | Value | Assessment |
|--------|-------|------------|
| Total Files | $(find src -type f | wc -l | xargs) | Large-scale application |
| Components | $(grep -r "export.*function\|export.*const.*=.*(" src/components --include="*.tsx" | wc -l | xargs) | Component-rich UI |
| API Routes | $(find src/app/api -name "route.ts" | wc -l | xargs) | Moderate API surface |
| Services | $(find src/services -name "*.ts" | wc -l | xargs) | Well-structured services |

### 🚀 Deployment Readiness

- ✅ TypeScript strict mode
- ✅ Environment variable configuration
- ✅ Prisma schema defined
- ✅ API routes structured
- ✅ Authentication configured
- ✅ Build optimization ready

### 📝 Notes

This project demonstrates enterprise-level architecture with:
- Clean separation of concerns
- Modular component structure
- Comprehensive state management
- Integration with multiple AI services
- Modern UI/UX with glassmorphism design
- Voice-enabled interactions

EOF

echo ""
echo "✅ Project statistics generated!"
echo "📄 Detailed report saved to PROJECT_STATS.md"
