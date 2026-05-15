# Security Guidelines

## Principles

✅ **Defense in Depth** - Multiple layers of security  
✅ **Least Privilege** - Minimal necessary permissions  
✅ **Zero Trust** - Verify everything  
✅ **Encryption** - Encrypt at rest and in transit  
✅ **Audit** - Log all actions  

## Authentication & Authorization

### 1. User Authentication

```typescript
// JWT Token Example
{
  "userId": "user-123",
  "role": "ADMIN",
  "permissions": ["read:all", "write:all"],
  "iat": 1621095600,
  "exp": 1621182000
}
```

**Token Requirements:**
- Minimum 32 characters
- Expires in 24 hours
- Refresh tokens rotate on use
- Stored securely (HttpOnly cookies)

### 2. Role-Based Access Control (RBAC)

```typescript
export const ROLES = {
  ADMIN: {
    permissions: ['read:all', 'write:all', 'delete:all', 'approve:all']
  },
  MANAGER: {
    permissions: ['read:all', 'write:documents', 'approve:documents']
  },
  OPERATOR: {
    permissions: ['read:assigned', 'write:assigned']
  },
  VIEWER: {
    permissions: ['read:assigned']
  }
};
```

### 3. API Key Management

```bash
# Generate API key
npm run security:generate-apikey

# Rotate API keys periodically
npm run security:rotate-apikeys

# Revoke API keys
npm run security:revoke-apikey -- --key=key_to_revoke
```

**API Key Storage:**
```typescript
// Store in database with hash
const apiKeyHash = bcrypt.hash(apiKey, 10);
const salt = bcrypt.genSalt(10);
```

## Data Protection

### 1. Encryption at Rest

```typescript
// Use AES-256-GCM
import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(KEY), iv);
  const encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
  const authTag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
};
```

### 2. Encryption in Transit

```typescript
// Use HTTPS/TLS 1.3+
// Configure in Nginx/Apache
ssl_protocols TLSv1.3 TLSv1.2;
ssl_ciphers HIGH:!aNULL:!MD5;
ssl_prefer_server_ciphers on;
```

### 3. Sensitive Data Masking

```typescript
// Mask PII in logs
const maskEmail = (email: string) => {
  const [user, domain] = email.split('@');
  return `${user.substring(0, 2)}***@${domain}`;
};

const maskPhone = (phone: string) => {
  return `${phone.substring(0, 3)}****${phone.substring(-2)}`;
};

const maskPassport = (passport: string) => {
  return `${passport.substring(0, 2)}***${passport.substring(-2)}`;
};
```

## Input Validation

### 1. SQL Injection Prevention

```typescript
// Use parameterized queries
const query = 'SELECT * FROM candidates WHERE email = $1';
const result = await db.query(query, [userEmail]);

// Never use string concatenation
// ❌ WRONG:
const wrongQuery = `SELECT * FROM candidates WHERE email = '${userEmail}'`;
```

### 2. XSS Prevention

```typescript
// Sanitize HTML input
import DOMPurify from 'dompurify';

const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
};
```

### 3. Command Injection Prevention

```typescript
// Use child_process safely
import { execFile } from 'child_process';

// ✅ SAFE:
execFile('convert', ['input.jpg', 'output.png']);

// ❌ UNSAFE:
exec(`convert ${userInput}`);
```

## CSRF Protection

```typescript
// Generate CSRF token
app.use(csrfProtection);

// Use in forms
app.get('/form', (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});

// Verify on POST
app.post('/api/submit', csrfProtection, (req, res) => {
  // Token verified automatically
});
```

## Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const commandLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // Max 10 commands per minute
  message: 'Too many commands, please try later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/api/ai-workforce/commander/command', commandLimiter, (req, res) => {
  // Handle request
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per 15 minutes
});

app.use('/api/', apiLimiter);
```

## File Upload Security

```typescript
import multer from 'multer';
import path from 'path';

const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    // Only allow specific file types
    const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max
  }
});

// Rename files to prevent directory traversal
const renameFile = (file: Express.Multer.File) => {
  const ext = path.extname(file.originalname);
  return `${crypto.randomBytes(16).toString('hex')}${ext}`;
};
```

## API Security

### 1. CORS Configuration

```typescript
import cors from 'cors';

const corsOptions = {
  origin: ['https://emnaservices.com', 'https://app.emnaservices.com'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### 2. Security Headers

```typescript
import helmet from 'helmet';

app.use(helmet());

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});
```

### 3. Request Validation

```typescript
import Joi from 'joi';

const commandSchema = Joi.object({
  text: Joi.string().required().min(1).max(500),
  language: Joi.string().valid('ar', 'ar-TN', 'en', 'fr').required(),
  userId: Joi.string().required()
});

app.post('/api/command', (req, res) => {
  const { error, value } = commandSchema.validate(req.body);
  if (error) return res.status(400).send(error.details);
  // Process valid request
});
```

## Audit Logging

### 1. Log All Sensitive Actions

```typescript
interface AuditLog {
  timestamp: Date;
  userId: string;
  action: string;
  resource: string;
  result: 'SUCCESS' | 'FAILED';
  ipAddress: string;
  userAgent: string;
}

async function logAudit(log: AuditLog) {
  await db.query(
    'INSERT INTO audit_logs (timestamp, user_id, action, resource, result, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [log.timestamp, log.userId, log.action, log.resource, log.result, log.ipAddress, log.userAgent]
  );
}
```

### 2. Monitor Suspicious Activity

```bash
# Find failed login attempts
SELECT * FROM audit_logs 
WHERE action = 'LOGIN' AND result = 'FAILED' 
AND timestamp > NOW() - INTERVAL '24 hours'
GROUP BY user_id 
HAVING COUNT(*) > 5;

# Find after-hours access
SELECT * FROM audit_logs 
WHERE EXTRACT(HOUR FROM timestamp) NOT BETWEEN 8 AND 18 
AND action IN ('READ', 'UPDATE', 'DELETE');
```

## Backup Security

### 1. Encrypt Backups

```bash
# Create encrypted backup
tar czf backup.tar.gz src/
openssl enc -aes-256-cbc -in backup.tar.gz -out backup.tar.gz.enc

# Restore encrypted backup
openssl enc -d -aes-256-cbc -in backup.tar.gz.enc -out backup.tar.gz
tar xzf backup.tar.gz
```

### 2. Store Backups Securely

```bash
# Upload to S3 with encryption
aws s3 cp backup.tar.gz.enc s3://emna-backups/ \
  --sse AES256 \
  --storage-class GLACIER
```

### 3. Test Backup Restoration

```bash
# Regular restore drills
npm run backup:restore -- --test
```

## Third-Party Security

### 1. Dependency Scanning

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Audit with detailed report
npm audit --json > audit-report.json
```

### 2. Keep Dependencies Updated

```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Install latest major versions
npm install -g npm-check-updates
ncu -u
```

### 3. License Compliance

```bash
# Check licenses
npm ls --depth=0 | grep license

# Generate license report
npm install -g license-report
license-report --csv
```

## Incident Response

### 1. Security Breach Procedure

```bash
# 1. Immediately revoke compromised credentials
npm run security:revoke-apikey -- --key=compromised_key

# 2. Rotate encryption keys
npm run security:rotate-keys

# 3. Review audit logs
npm run logs -- --level=ERROR --days=7

# 4. Reset affected user passwords
npm run security:reset-passwords -- --user=affected_user

# 5. Enable 2FA
npm run security:enable-2fa -- --user=affected_user

# 6. Notify affected users
npm run security:notify-users
```

### 2. Communication Template

```
Subject: Security Alert

Dear User,

We detected unusual activity on your account. As a precaution:
1. Your password has been reset
2. Please set a new password immediately
3. Enable 2-factor authentication
4. Review your recent activity

If you didn't initiate this, please contact us immediately.

Security Team
```

## Compliance

### GDPR Compliance

```typescript
// Right to deletion
app.delete('/api/candidates/:id', async (req, res) => {
  // Delete candidate data
  await db.query('DELETE FROM candidates WHERE id = $1', [req.params.id]);
  
  // Delete related documents
  await db.query('DELETE FROM documents WHERE candidate_id = $1', [req.params.id]);
  
  // Delete audit logs (after retention period)
  await db.query('DELETE FROM audit_logs WHERE user_id = $1 AND timestamp < NOW() - INTERVAL \'90 days\'', [req.params.id]);
});

// Data portability
app.get('/api/candidates/:id/export', async (req, res) => {
  const data = await db.query('SELECT * FROM candidates WHERE id = $1', [req.params.id]);
  res.json({ data, format: 'JSON', exportedAt: new Date() });
});
```

### CCPA Compliance

```typescript
// Collect consent
app.post('/api/consent', async (req, res) => {
  const { userId, consentType, consentStatus } = req.body;
  
  await db.query(
    'INSERT INTO consent_log (user_id, consent_type, status, timestamp) VALUES ($1, $2, $3, $4)',
    [userId, consentType, consentStatus, new Date()]
  );
  
  res.json({ success: true });
});
```

## Regular Security Tasks

- [ ] **Daily**: Check audit logs for suspicious activity
- [ ] **Weekly**: Review security alerts and incidents
- [ ] **Monthly**: Audit user permissions and API keys
- [ ] **Quarterly**: Run full security assessment
- [ ] **Annually**: Update security policies

## Security Contacts

- **Security Issues**: security@emnaservices.com
- **On-Call**: +1-555-0123
- **Legal**: legal@emnaservices.com

---

**Last Updated:** 2026-05-15  
**Status:** Production Ready  
**Compliance:** GDPR, CCPA, ISO 27001 Ready
