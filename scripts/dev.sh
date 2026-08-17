#!/usr/bin/env bash

# Exit immediately on error
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

USE_TERMS=false
FORCE_SEED=false
AUTO_OPEN=false

for arg in "$@"; do
  case "$arg" in
    --terms|-t)
      USE_TERMS=true
      ;;
    --seed|-s)
      FORCE_SEED=true
      ;;
    --open|-o)
      AUTO_OPEN=true
      ;;
  esac
done

echo "============================================================"
echo "🚀 [Pramyan Dev Master] HR Management Dashboard Runner"
echo "============================================================"

# 0. Check & create .env files from templates if missing
echo "⚙️ [1/4] Checking environment configurations..."
if [ ! -f "$ROOT_DIR/backend/.env" ]; then
  if [ -f "$ROOT_DIR/backend/.env.example" ]; then
    echo "  Creating backend/.env from backend/.env.example..."
    cp "$ROOT_DIR/backend/.env.example" "$ROOT_DIR/backend/.env"
  else
    echo "  ⚠️ Warning: backend/.env.example not found."
  fi
fi

if [ ! -f "$ROOT_DIR/frontend/.env.local" ] && [ ! -f "$ROOT_DIR/frontend/.env" ]; then
  if [ -f "$ROOT_DIR/frontend/.env.example" ]; then
    echo "  Creating frontend/.env.local from frontend/.env.example..."
    cp "$ROOT_DIR/frontend/.env.example" "$ROOT_DIR/frontend/.env.local"
  else
    echo "  ⚠️ Warning: frontend/.env.example not found."
  fi
fi

# 1. Kill any process occupying ports 3000 or 5001
echo "🧹 [2/4] Checking and freeing ports 3000 and 5001..."
for PORT in 3000 5001; do
  PIDS=$(lsof -ti:$PORT 2>/dev/null || true)
  if [ -n "$PIDS" ]; then
    echo "  ⚠️ Port $PORT is occupied by PID(s): $PIDS. Freeing port..."
    kill -9 $PIDS 2>/dev/null || true
  fi
done

# 2. Check and install pnpm workspace dependencies
echo "📦 [3/5] Verifying pnpm workspace dependencies..."
cd "$ROOT_DIR"
if ! command -v pnpm &> /dev/null; then
  echo "  Installing pnpm globally..."
  npm install -g pnpm --silent
fi
pnpm install --silent

# 3. Build the application bundle before starting dev servers
echo "🔨 [4/5] Building project bundle (pnpm run build)..."
pnpm run build

# 4. Optional / Auto database seeding on hosted MongoDB Atlas
if [ "$FORCE_SEED" = true ]; then
  echo "🌱 [5/5] Force seeding hosted MongoDB Atlas database..."
  pnpm seed
else
  echo "🌱 [5/5] Checking hosted MongoDB Atlas database status..."
  node -e "
    const mongoose = require('mongoose');
    require('dotenv').config({ path: '$ROOT_DIR/backend/.env' });
    mongoose.connect(process.env.MONGO_URI)
      .then(async () => {
        const count = await mongoose.connection.collection('employees').countDocuments();
        if (count === 0) {
          console.log('  No employees found. Running initial seed on hosted MongoDB Atlas...');
          require('$ROOT_DIR/backend/seed.js');
        } else {
          console.log('  ✅ Hosted MongoDB Atlas ready with ' + count + ' employee records.');
          process.exit(0);
        }
      })
      .catch((err) => {
        console.error('  ⚠️ Hosted MongoDB check warning:', err.message);
        process.exit(0);
      });
  " 2>/dev/null || true
fi

echo ""
echo "============================================================"
echo "✨ Frontend App: http://localhost:3000"
echo "⚙️ Backend API:  http://localhost:5001"
echo "🍃 Hosted DB:    MongoDB Atlas (pramyanassignment)"
echo "🔐 Demo Creds:   admin@pramyan.com / Admin@123"
echo "============================================================"
echo ""

# Optional browser launch
if [ "$AUTO_OPEN" = true ]; then
  (sleep 2 && open "http://localhost:3000") &
fi

# 4. Launch Backend & Frontend Services
cd "$ROOT_DIR"
if [ "$USE_TERMS" = true ]; then
  echo "🖥️ Launching services in separate macOS Terminal windows..."
  osascript -e 'tell application "Terminal" to do script "cd \"'$ROOT_DIR'\" && pnpm --filter backend dev"' >/dev/null
  sleep 1
  osascript -e 'tell application "Terminal" to do script "cd \"'$ROOT_DIR'\" && pnpm --filter frontend dev"' >/dev/null
else
  pnpm dlx concurrently \
    --names "BACKEND,FRONTEND" \
    --prefix-colors "cyan,magenta" \
    --kill-others-on-fail \
    "pnpm --filter backend dev" \
    "sleep 1 && pnpm --filter frontend dev"
fi
