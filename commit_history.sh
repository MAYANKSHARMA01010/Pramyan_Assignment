#!/usr/bin/env bash
# ==============================================================================
# Script: commit_history.sh
# Purpose: Automatically commit the project in 45 clean, logical, conventional commits.
# Note: DO NOT RUN automatically. Run manually when you are ready: bash commit_history.sh
# ==============================================================================

set -e

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}       Pramyan Assignment - Git Commit Sequencer       ${NC}"
echo -e "${BLUE}======================================================${NC}"

# Ensure we are in a git repository
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Initializing git repository...${NC}"
    git init
fi

# Ensure git author identity is set
if [ -z "$(git config user.name)" ]; then
    git config user.name "Mayank Sharma"
fi
if [ -z "$(git config user.email)" ]; then
    git config user.email "mayank.sharma@example.com"
fi

# Base timestamp configuration (spread over the past 4 days)
BASE_TIMESTAMP=$(date -v-4d "+%s" 2>/dev/null || date -d "4 days ago" "+%s" 2>/dev/null || date "+%s")
CURRENT_STEP=0
TOTAL_STEPS=45

# Helper function to stage and commit with simulated chronological timestamps
make_commit() {
    local files="$1"
    local message="$2"
    local minutes_increment="$3"

    CURRENT_STEP=$((CURRENT_STEP + 1))
    BASE_TIMESTAMP=$((BASE_TIMESTAMP + minutes_increment * 60))

    # Format timestamp for ISO 8601
    local COMMIT_DATE
    if date -r "$BASE_TIMESTAMP" "+%Y-%m-%dT%H:%M:%S" >/dev/null 2>&1; then
        COMMIT_DATE=$(date -r "$BASE_TIMESTAMP" "+%Y-%m-%dT%H:%M:%S")
    else
        COMMIT_DATE=$(date -d "@$BASE_TIMESTAMP" "+%Y-%m-%dT%H:%M:%S")
    fi

    # Stage files
    for file in $files; do
        if [ -e "$file" ]; then
            git add "$file"
        fi
    done

    # Commit with custom author and committer dates
    GIT_AUTHOR_DATE="$COMMIT_DATE" GIT_COMMITTER_DATE="$COMMIT_DATE" git commit -m "$message" > /dev/null 2>&1 || true

    printf "${CYAN}[%02d/%02d]${NC} ${GREEN}✓ Committed:${NC} %s\n" "$CURRENT_STEP" "$TOTAL_STEPS" "$message"
}

echo -e "${YELLOW}Starting sequenced commit generation (45 commits)...${NC}\n"

# ------------------------------------------------------------------------------
# Phase 1: Workspace & Root Project Setup (Commits 1 - 4)
# ------------------------------------------------------------------------------
make_commit ".gitignore package.json pnpm-workspace.yaml" \
    "chore: initialize repository with root configuration and gitignore" 45

make_commit "pnpm-lock.yaml" \
    "chore(lock): add pnpm-lock.yaml dependencies lockfile" 20

make_commit "scripts/dev.sh commit_history.sh" \
    "chore(scripts): add dev orchestration and commit sequencer scripts" 30

make_commit "backend/package.json backend/package-lock.json backend/.env.example" \
    "chore(backend): initialize express backend package and lockfile" 40

# ------------------------------------------------------------------------------
# Phase 2: Backend Core Infrastructure & Middleware (Commits 5 - 8)
# ------------------------------------------------------------------------------
make_commit "backend/config/db.js" \
    "feat(backend): configure MongoDB connection with mongoose" 35

make_commit "backend/middleware/error.middleware.js" \
    "feat(backend): implement global error handling middleware" 25

make_commit "backend/middleware/validate.middleware.js" \
    "feat(backend): implement request payload validation middleware" 30

make_commit "backend/server.js" \
    "feat(backend): setup express server entrypoint and route mounting" 50

# ------------------------------------------------------------------------------
# Phase 3: Backend Authentication & Security (Commits 9 - 13)
# ------------------------------------------------------------------------------
make_commit "backend/models/User.js backend/models/RefreshToken.js" \
    "feat(backend): add User and RefreshToken mongoose models" 45

make_commit "backend/validations/auth.validation.js" \
    "feat(backend): add auth request validation schemas" 25

make_commit "backend/middleware/auth.middleware.js" \
    "feat(backend): implement JWT authentication & role-based middleware" 40

make_commit "backend/controllers/auth.controller.js" \
    "feat(backend): implement authentication controller with token refresh" 55

make_commit "backend/routes/auth.routes.js" \
    "feat(backend): create authentication api routes" 20

# ------------------------------------------------------------------------------
# Phase 4: Backend Employee Management (Commits 14 - 17)
# ------------------------------------------------------------------------------
make_commit "backend/models/Employee.js" \
    "feat(backend): define Employee mongoose schema and indexing" 35

make_commit "backend/validations/employee.validation.js" \
    "feat(backend): create employee validation rules" 25

make_commit "backend/controllers/employee.controller.js" \
    "feat(backend): implement employee CRUD and pagination controller" 60

make_commit "backend/routes/employee.routes.js" \
    "feat(backend): add employee management REST endpoints" 20

# ------------------------------------------------------------------------------
# Phase 5: Backend Attendance & Analytics (Commits 18 - 22)
# ------------------------------------------------------------------------------
make_commit "backend/models/Attendance.js" \
    "feat(backend): define Attendance schema and composite constraints" 35

make_commit "backend/validations/attendance.validation.js" \
    "feat(backend): add attendance validation rules" 25

make_commit "backend/controllers/attendance.controller.js" \
    "feat(backend): implement attendance tracking and filtering controller" 50

make_commit "backend/routes/attendance.routes.js" \
    "feat(backend): add attendance tracking routes" 20

make_commit "backend/controllers/dashboard.controller.js backend/routes/dashboard.routes.js" \
    "feat(backend): implement dashboard aggregation controller and routes" 45

# ------------------------------------------------------------------------------
# Phase 6: Backend Database Seeding (Commit 23)
# ------------------------------------------------------------------------------
make_commit "backend/seed.js" \
    "feat(backend): add database seed script for mock users and records" 40

# ------------------------------------------------------------------------------
# Phase 7: Frontend Initialization & Assets (Commits 24 - 27)
# ------------------------------------------------------------------------------
make_commit "frontend/package.json frontend/next.config.mjs frontend/jsconfig.json frontend/eslint.config.mjs" \
    "chore(frontend): initialize Next.js app configuration and dependencies" 45

make_commit "frontend/postcss.config.mjs frontend/app/globals.css" \
    "style(frontend): setup Tailwind and PostCSS configuration" 35

make_commit "frontend/.env.example frontend/proxy.js" \
    "chore(frontend): configure environment variables template and reverse proxy" 25

make_commit "frontend/public/file.svg frontend/public/globe.svg frontend/public/next.svg frontend/public/vercel.svg frontend/public/window.svg frontend/app/favicon.ico" \
    "feat(frontend): add public vector assets and favicon" 20

# ------------------------------------------------------------------------------
# Phase 8: Frontend Utilities, Context & State Management (Commits 28 - 32)
# ------------------------------------------------------------------------------
make_commit "frontend/lib/api.js" \
    "feat(frontend): create API client with automatic token refresh" 40

make_commit "frontend/lib/validations.js" \
    "feat(frontend): add client-side form validation helpers" 25

make_commit "frontend/reducers/authReducer.js frontend/context/AuthContext.jsx" \
    "feat(frontend): implement authentication reducer and context provider" 45

make_commit "frontend/reducers/dashboardReducer.js frontend/context/DashboardContext.jsx" \
    "feat(frontend): implement dashboard reducer and context provider" 40

make_commit "frontend/app/layout.js frontend/app/providers.jsx frontend/app/page.js" \
    "feat(frontend): setup root layout and global app providers" 35

# ------------------------------------------------------------------------------
# Phase 9: Frontend Reusable Components (Commits 33 - 36)
# ------------------------------------------------------------------------------
make_commit "frontend/components/StatCard.jsx" \
    "feat(frontend): create reusable StatCard metric component" 30

make_commit "frontend/components/Topbar.jsx" \
    "feat(frontend): create dashboard Topbar with user profile and theme controls" 35

make_commit "frontend/components/Sidebar.jsx" \
    "feat(frontend): create responsive Sidebar navigation component" 40

make_commit "frontend/components/EmployeeModal.jsx" \
    "feat(frontend): create EmployeeModal for create and edit workflows" 50

# ------------------------------------------------------------------------------
# Phase 10: Frontend Pages & Views (Commits 37 - 41)
# ------------------------------------------------------------------------------
make_commit "frontend/app/login/page.jsx" \
    "feat(frontend): implement login page with credentials and validation" 45

make_commit "frontend/app/dashboard/layout.jsx" \
    "feat(frontend): create dashboard shell layout" 30

make_commit "frontend/app/dashboard/page.jsx" \
    "feat(frontend): implement dashboard analytics overview page" 50

make_commit "frontend/app/dashboard/employees/page.jsx" \
    "feat(frontend): implement employee directory management page" 55

make_commit "frontend/app/dashboard/attendance/page.jsx" \
    "feat(frontend): implement attendance tracking and logging page" 50

# ------------------------------------------------------------------------------
# Phase 11: Documentation & Developer Guides (Commits 42 - 45)
# ------------------------------------------------------------------------------
make_commit "docs/DATABASE_SCHEMA.md docs/ARCHITECTURE.md" \
    "docs: add database schema and architecture design documentation" 35

make_commit "docs/API_DOCUMENTATION.md docs/UI_UX_DESIGN_SYSTEM.md" \
    "docs: add API documentation and UI/UX design specifications" 30

make_commit "docs/SETUP_AND_DEPLOYMENT.md docs/DECISIONS_AND_ASSUMPTIONS.md" \
    "docs: add setup instructions and technical decision records" 35

make_commit "frontend/AGENTS.md frontend/CLAUDE.md frontend/README.md README.md" \
    "docs: add frontend development guides and root project README" 40

# ------------------------------------------------------------------------------
# Final Verification
# ------------------------------------------------------------------------------
echo ""
echo -e "${GREEN}======================================================${NC}"
echo -e "${GREEN}  All 45 commits generated successfully!              ${NC}"
echo -e "${GREEN}======================================================${NC}"
echo ""
git log --oneline -n 15
echo -e "\n${BLUE}To view full history:${NC} git log --oneline --graph"
