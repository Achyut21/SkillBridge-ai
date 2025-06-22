#!/bin/bash

# Script to commit all TypeScript fixes
echo "🔧 Committing TypeScript fixes..."

# Add all modified TypeScript files
git add src/components/learning/skill-radar.tsx
git add src/components/pwa/pwa-manager.tsx
git add src/hooks/use-market-data.ts
git add src/lib/performance/performance-hooks.tsx
git add src/services/ai/openai.ts
git add src/services/ai/recommendation-engine.ts
git add src/stores/redux/slices/ai-slice.ts
git add src/components/advanced-ux/micro-interactions.tsx
git add package.json package-lock.json  # For @types/lodash
git add .dev-progress.md

# Create commit
git commit -m "fix: resolve all TypeScript type errors for production build

- Fix GradientButton variant types in skill-radar.tsx
- Remove unsupported vibrate property in PWA notifications
- Fix type annotations in use-market-data hook
- Add @types/lodash and fix debounce/throttle types
- Import and use proper enum types (Difficulty, LearningStyle)
- Replace PersonalizedRecommendation with SkillRecommendation
- Fix syntax error in micro-interactions.tsx
- Add necessary type assertions for dynamic properties

All TypeScript errors resolved - 0 errors remaining"

echo "✅ TypeScript fixes committed!"
echo "📤 Run 'git push' to deploy to Vercel"
