# Installation & Setup Guide

## System Requirements

- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **PostgreSQL**: 12.0 or higher (or MySQL 8.0+)
- **Redis**: 6.0 or higher (for caching)
- **Docker**: Optional (for containerized deployment)

## Environment Setup

### 1. Install Dependencies

```bash
# Clone repository
git clone https://github.com/emnaservicesgroupe/EMNA-CRM.git
cd EMNA-CRM

# Checkout feature branch
git checkout feature/ai-workforce-manager

# Install npm packages
npm install

# Navigate to AI Workforce directory
cd src/ai-workforce
npm install
```

### 2. Environment Variables

Create `.env.local` file in root directory:

```bash
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/emna_crm
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=emna_user
DATABASE_PASSWORD=secure_password_here
DATABASE_NAME=emna_crm

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=redis_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=7d

# Encryption Configuration
ENCRYPTION_KEY=your_encryption_key_32_characters
ENCRYPTION_ALGORITHM=aes-256-gcm

# AI Workforce Configuration
AI_ENABLED=true
AI_LOG_LEVEL=INFO
AI_MAX_CONCURRENT_AGENTS=6
AI_COMMAND_TIMEOUT=30000

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=app_specific_password
SMTP_FROM=noreply@emnaservices.com

# WhatsApp Configuration (Optional)
WHATSAPP_API_URL=https://api.whatsapp.com/send
WHATSAPP_API_KEY=your_whatsapp_api_key
WHATSAPP_BUSINESS_ACCOUNT_ID=your_business_account_id

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log
LOG_MAX_SIZE=10m
LOG_MAX_FILES=14

# Server Configuration
PORT=3000
NODE_ENV=development
API_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3001

# Voice Assistant Configuration
VOICE_ENABLED=true
VOICE_API_KEY=your_voice_api_key
SUPPORTED_LANGUAGES=ar,ar-TN,en,fr
```

### 3. Database Setup

```bash
# Create database
createdb emna_crm

# Run migrations
npm run migrate:up

# Seed initial data (optional)
npm run seed:database
```

### 4. Redis Setup

```bash
# Start Redis (if using local installation)
redis-server

# Or using Docker
docker run -d -p 6379:6379 redis:latest
```

## Development Setup

### 1. Initialize AI Workforce System

```bash
# Set up AI agents database tables
npm run ai:setup

# Initialize agent configuration
npm run ai:init

# Generate API keys
npm run ai:generate-keys
```

### 2. Start Development Server

```bash
# Option 1: Start entire application
npm run dev

# Option 2: Start AI Workforce separately
npm run start:ai-workforce

# Option 3: Start with Nodemon (auto-reload)
npm run dev:watch
```

### 3. Verify Installation

```bash
# Test API connectivity
npm run test:api

# Health check
curl http://localhost:3000/health

# Check AI agents status
curl http://localhost:3000/api/ai-workforce/status
```

## Docker Deployment

### 1. Build Docker Image

```bash
# Build image
docker build -t emna-crm:latest .

# Build with specific tag
docker build -t emna-crm:1.0.0 -f Dockerfile .
```

### 2. Run Container

```bash
# Run with environment file
docker run -d \
  --name emna-crm \
  --env-file .env.local \
  -p 3000:3000 \
  -v ./uploads:/app/uploads \
  emna-crm:latest

# Run with Docker Compose
docker-compose up -d
```

### 3. Docker Compose Configuration

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    container_name: emna-crm
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://emna_user:secure_password@postgres:5432/emna_crm
      - REDIS_URL=redis://redis:6379
      - NODE_ENV=production
    depends_on:
      - postgres
      - redis
    volumes:
      - ./uploads:/app/uploads
      - ./logs:/app/logs
    restart: unless-stopped

  postgres:
    image: postgres:14-alpine
    container_name: emna-postgres
    environment:
      - POSTGRES_USER=emna_user
      - POSTGRES_PASSWORD=secure_password
      - POSTGRES_DB=emna_crm
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: emna-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

## Production Deployment

### 1. Pre-deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Security keys generated and stored
- [ ] SSL certificates installed
- [ ] Backups configured
- [ ] Monitoring configured
- [ ] Logging aggregation set up
- [ ] Error tracking enabled

### 2. Deploy to AWS

```bash
# Using AWS Elastic Beanstalk
eb init emna-crm --platform node.js-18

# Deploy
eb create emna-crm-prod
eb deploy

# Check status
eb status
```

### 3. Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create emna-crm-prod

# Set environment variables
heroku config:set DATABASE_URL=postgresql://...
heroku config:set JWT_SECRET=...

# Deploy
git push heroku main

# Check logs
heroku logs --tail
```

### 4. Deploy to DigitalOcean App Platform

```bash
# Create app specification
cat > app.yaml << EOF
name: emna-crm
services:
- name: api
  github:
    repo: emnaservicesgroupe/EMNA-CRM
    branch: main
  envs:
  - key: DATABASE_URL
    value: ${db.connection_string}
  - key: NODE_ENV
    value: production
  http_port: 3000
EOF

# Deploy
doctl apps create --spec app.yaml
```

## Verification Tests

### 1. Health Checks

```bash
# API health
curl http://localhost:3000/health

# Database connection
npm run test:database

# Redis connection
npm run test:redis

# All systems
npm run test:health
```

### 2. Agent Verification

```bash
# Test each agent
npm run test:agent:eva
npm run test:agent:orion
npm run test:agent:atlas
npm run test:agent:nova
npm run test:agent:titan
npm run test:agent:sentinel

# Run all agent tests
npm run test:agents
```

### 3. API Testing

```bash
# Run API tests
npm run test:api

# Test with coverage
npm run test:api:coverage

# Performance test
npm run test:performance
```

## Database Initialization

### 1. Create Tables

```bash
# Run schema migration
npm run migrate:latest

# Verify tables created
psql -U emna_user -d emna_crm -c "\dt"
```

### 2. Initial Seed Data

```bash
# Seed with sample data
npm run seed:initial

# Reset database (WARNING: deletes all data)
npm run db:reset

# Dump database backup
npm run db:backup
```

## Monitoring & Logs

### 1. View Application Logs

```bash
# Real-time logs
npm run logs:tail

# Logs from last hour
npm run logs:recent

# Filter by agent
npm run logs:filter -- --agent=EVA

# Export logs
npm run logs:export -- --format=csv
```

### 2. Monitor System Health

```bash
# Check system metrics
npm run monitor:metrics

# Memory usage
npm run monitor:memory

# Database queries
npm run monitor:database

# Active processes
npm run monitor:processes
```

## Troubleshooting

### Issue: Database Connection Failed

```bash
# Check PostgreSQL is running
psql -U postgres -d postgres -c "SELECT version();"

# Verify connection string
echo $DATABASE_URL

# Test connection
npm run test:database

# View connection logs
tail -f logs/database.log
```

### Issue: Redis Connection Failed

```bash
# Check Redis is running
redis-cli ping

# Verify Redis configuration
redis-cli CONFIG GET "*"

# Clear Redis cache (if needed)
redis-cli FLUSHDB

# View Redis logs
tail -f /var/log/redis/redis-server.log
```

### Issue: Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Use different port
PORT=3001 npm start
```

### Issue: Out of Memory

```bash
# Check memory usage
free -h

# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm start

# Monitor memory
npm run monitor:memory
```

## Performance Optimization

### 1. Enable Caching

```bash
# Clear cache
npm run cache:clear

# Warm cache
npm run cache:warm

# Cache statistics
npm run cache:stats
```

### 2. Database Optimization

```bash
# Analyze query performance
npm run db:analyze

# Create missing indexes
npm run db:index:create

# Vacuum database (PostgreSQL)
npm run db:vacuum
```

### 3. Application Tuning

```bash
# Enable compression
# Set in .env: ENABLE_COMPRESSION=true

# Enable HTTP caching
# Set in .env: ENABLE_HTTP_CACHE=true

# Optimize bundle
npm run build:optimize
```

## Security Hardening

### 1. Generate Security Keys

```bash
# Generate JWT secret
npm run security:generate-secret

# Generate encryption key
npm run security:generate-encryption-key

# Generate API keys
npm run security:generate-apikey
```

### 2. Enable 2FA

```bash
# Generate TOTP secret
npm run security:2fa:generate -- --user=admin

# Verify 2FA setup
npm run security:2fa:verify
```

### 3. Security Audit

```bash
# Run npm audit
npm audit

# Fix vulnerabilities
npm audit fix

# Generate security report
npm run security:audit
```

## Backup & Recovery

### 1. Automatic Backups

```bash
# Set up automated backups
npm run backup:setup

# Create backup now
npm run backup:create

# List backups
npm run backup:list

# Restore from backup
npm run backup:restore -- --backup=backup_name
```

### 2. Backup Configuration

Create `.backuprc`:

```json
{
  "destination": "s3://emna-backups",
  "frequency": "daily",
  "retention": 30,
  "encryption": true,
  "compression": "gzip"
}
```

## Maintenance

### 1. Regular Tasks

```bash
# Daily
npm run maintenance:daily

# Weekly
npm run maintenance:weekly

# Monthly
npm run maintenance:monthly

# View maintenance logs
tail -f logs/maintenance.log
```

### 2. Update Dependencies

```bash
# Check outdated packages
npm outdated

# Update all packages
npm update

# Update major versions
npm install -g npm-check-updates
ncu -u
npm install
```

## Support

- **Documentation**: https://github.com/emnaservicesgroupe/EMNA-CRM/wiki
- **Issues**: https://github.com/emnaservicesgroupe/EMNA-CRM/issues
- **Email**: support@emnaservices.com
- **Slack**: #emna-crm channel

---

**Last Updated:** 2026-05-15  
**Status:** Production Ready  
**Version:** 1.0.0
