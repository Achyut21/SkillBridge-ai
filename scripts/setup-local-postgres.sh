# Quick PostgreSQL Setup Script

# Step 1: Install PostgreSQL on Mac
brew install postgresql@15
brew services start postgresql@15

# Step 2: Create database
createdb skillbridge_ai

# Step 3: Update your DATABASE_URL in .env and .env.local
echo 'DATABASE_URL="postgresql://localhost:5432/skillbridge_ai"' > .env
echo 'DATABASE_URL="postgresql://localhost:5432/skillbridge_ai"' > .env.local

# Step 4: Generate Prisma Client (regular, not proxy)
npx prisma generate

# Step 5: Run migrations
npx prisma migrate dev --name init

# Step 6: Seed database (optional)
npm run db:seed

# Step 7: Start dev server
npm run dev
