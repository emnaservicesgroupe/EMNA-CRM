#!/bin/bash

# EMNA AI Workforce Setup Script
# Complete setup for AI Workforce system

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     EMNA AI Workforce Manager - Setup Wizard               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"

# Check prerequisites
check_prerequisites() {
  echo -e "\n${BLUE}[1/6] Checking prerequisites...${NC}"
  
  if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
  fi
  
  if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm not found. Please install npm 9+${NC}"
    exit 1
  fi
  
  if ! command -v psql &> /dev/null; then
    echo -e "${RED}✗ PostgreSQL not found. Please install PostgreSQL 12+${NC}"
    exit 1
  fi
  
  NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
  if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}✗ Node.js 18+ required (you have $(node -v))${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}✓ All prerequisites met${NC}"
  echo -e "${GREEN}  - Node.js: $(node -v)${NC}"
  echo -e "${GREEN}  - npm: $(npm -v)${NC}"
  echo -e "${GREEN}  - PostgreSQL: $(psql --version)${NC}"
}

# Install dependencies
install_dependencies() {
  echo -e "\n${BLUE}[2/6] Installing dependencies...${NC}"
  
  npm install
  
  echo -e "${GREEN}✓ Dependencies installed${NC}"
}

# Setup environment
setup_environment() {
  echo -e "\n${BLUE}[3/6] Setting up environment...${NC}"
  
  if [ ! -f ".env.local" ]; then
    echo -e "${BLUE}Creating .env.local file...${NC}"
    
    cat > .env.local << 'EOF'
# Database Configuration
DATABASE_URL=postgresql://emna_user:secure_password@localhost:5432/emna_crm
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=emna_user
DATABASE_PASSWORD=secure_password_here
DATABASE_NAME=emna_crm

# Redis Configuration
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRATION=24h

# Encryption Configuration
ENCRYPTION_KEY=your_encryption_key_32_characters_long

# AI Configuration
AI_ENABLED=true
AI_LOG_LEVEL=INFO
AI_MAX_CONCURRENT_AGENTS=6

# Server Configuration
PORT=3000
NODE_ENV=development
API_URL=http://localhost:3000
EOF
    
    echo -e "${BLUE}Please update .env.local with your configuration${NC}"
  fi
  
  echo -e "${GREEN}✓ Environment setup complete${NC}"
}

# Setup database
setup_database() {
  echo -e "\n${BLUE}[4/6] Setting up database...${NC}"
  
  read -p "PostgreSQL username [emna_user]: " DB_USER
  DB_USER=${DB_USER:-emna_user}
  
  read -s -p "PostgreSQL password: " DB_PASS
  echo ""
  
  # Create user if not exists
  psql -U postgres << EOF
DO \$do\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_user WHERE usename = '$DB_USER') THEN
    CREATE ROLE $DB_USER WITH LOGIN PASSWORD '$DB_PASS';
  END IF;
END
\$do\$;
EOF
  
  # Create database
  psql -U postgres << EOF
CREATE DATABASE emna_crm OWNER $DB_USER;
GRANT ALL PRIVILEGES ON DATABASE emna_crm TO $DB_USER;
EOF
  
  echo -e "${GREEN}✓ Database setup complete${NC}"
}

# Initialize AI system
initialize_ai() {
  echo -e "\n${BLUE}[5/6] Initializing AI Workforce system...${NC}"
  
  echo -e "${BLUE}Creating AI agent tables...${NC}"
  npm run ai:setup || true
  
  echo -e "${BLUE}Generating security keys...${NC}"
  npm run ai:generate-keys || true
  
  echo -e "${BLUE}Initializing agents...${NC}"
  npm run ai:init || true
  
  echo -e "${GREEN}✓ AI system initialized${NC}"
}

# Verify installation
verify_installation() {
  echo -e "\n${BLUE}[6/6] Verifying installation...${NC}"
  
  echo -e "${BLUE}Running health checks...${NC}"
  npm run test:health || true
  
  echo -e "${GREEN}✓ Installation verified${NC}"
}

# Print summary
print_summary() {
  echo -e "\n${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║          🎉 Setup Complete! Ready to Launch 🎉              ║${NC}"
  echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
  
  echo -e "\n${BLUE}Next Steps:${NC}"
  echo -e "  1. Update .env.local with your configuration"
  echo -e "  2. Start the application: ${GREEN}npm run dev${NC}"
  echo -e "  3. Access dashboard: ${GREEN}http://localhost:3000${NC}"
  echo -e "  4. Try a command: ${GREEN}COMMANDER, check full CRM today${NC}"
  
  echo -e "\n${BLUE}Available Commands:${NC}"
  echo -e "  npm run dev              - Start development server"
  echo -e "  npm start                - Start production server"
  echo -e "  npm run logs:tail        - View real-time logs"
  echo -e "  npm run test:agents      - Test all agents"
  echo -e "  npm run security:audit   - Run security audit"
  
  echo -e "\n${BLUE}Documentation:${NC}"
  echo -e "  - API: src/ai-workforce/docs/api.md"
  echo -e "  - Security: src/ai-workforce/docs/security.md"
  echo -e "  - Installation: src/ai-workforce/docs/installation.md"
  
  echo -e "\n${BLUE}Support:${NC}"
  echo -e "  - GitHub: https://github.com/emnaservicesgroupe/EMNA-CRM"
  echo -e "  - Issues: https://github.com/emnaservicesgroupe/EMNA-CRM/issues"
  echo -e "  - Email: support@emnaservices.com"
  echo ""
}

# Run setup steps
check_prerequisites
install_dependencies
setup_environment
read -p "Do you want to setup the database now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  setup_database
fi
initialize_ai
verify_installation
print_summary

echo -e "${GREEN}✓ All done!${NC}\n"
