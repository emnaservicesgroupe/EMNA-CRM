# AI Workforce API Documentation

## Base URL

```
http://localhost:3000/api/ai-workforce
```

## Authentication

All requests require JWT token in header:

```
Authorization: Bearer {token}
```

## Endpoints

### 1. COMMANDER - Main AI Manager

#### Initialize COMMANDER

```http
POST /commander/initialize
Content-Type: application/json

{
  "userId": "user-123"
}
```

**Response:**
```json
{
  "success": true,
  "commanderId": "cmd-123",
  "status": "INITIALIZED",
  "agents": [
    { "agent": "EVA", "status": "ACTIVE" },
    { "agent": "ORION", "status": "ACTIVE" }
  ]
}
```

#### Process Command

```http
POST /commander/command
Content-Type: application/json

{
  "text": "COMMANDER, check missing documents",
  "language": "en",
  "userId": "user-123"
}
```

**Response:**
```json
{
  "success": true,
  "commandId": "cmd-456",
  "status": "EXECUTING",
  "agent": "EVA",
  "estimatedTime": 5,
  "requiresApproval": false
}
```

#### Get System Status

```http
GET /commander/status
```

**Response:**
```json
{
  "commanderActive": true,
  "agentsActive": 6,
  "recentCommands": 45,
  "alerts": 3,
  "systemHealth": "EXCELLENT"
}
```

#### Approve Command

```http
POST /commander/approve/{commandId}
Content-Type: application/json

{
  "userId": "user-123"
}
```

**Response:**
```json
{
  "success": true,
  "commandId": "cmd-456",
  "status": "APPROVED",
  "executedAt": "2026-05-15T14:30:00Z"
}
```

### 2. EVA Agent - Candidates

#### Check Missing Documents

```http
POST /agents/eva/missing-documents
Content-Type: application/json

{
  "userId": "user-123"
}
```

**Response:**
```json
{
  "success": true,
  "count": 12,
  "candidates": [
    {
      "candidateId": "cand-001",
      "name": "Ahmed Ben Ali",
      "email": "ahmed@example.com",
      "missingDocuments": ["PASSPORT", "B3"]
    }
  ]
}
```

#### Prepare Messages

```http
POST /agents/eva/prepare-messages
Content-Type: application/json

{
  "messageType": "MISSING_DOCUMENT",
  "userId": "user-123"
}
```

**Response:**
```json
{
  "success": true,
  "messagesGenerated": 5,
  "messages": [
    {
      "candidateId": "cand-001",
      "email": "ahmed@example.com",
      "message": "Hi Ahmed, please upload missing documents.",
      "requiresApproval": true
    }
  ]
}
```

### 3. ORION Agent - Documents

#### Verify Passports

```http
POST /agents/orion/verify-passports
Content-Type: application/json

{
  "userId": "user-123"
}
```

**Response:**
```json
{
  "success": true,
  "total": 15,
  "verified": 14,
  "failed": 1,
  "results": [
    {
      "documentId": "doc-001",
      "verified": true,
      "confidence": "98.5%"
    }
  ]
}
```

#### Check Expiry Dates

```http
POST /agents/orion/check-expiry
Content-Type: application/json

{
  "userId": "user-123"
}
```

**Response:**
```json
{
  "success": true,
  "expiringDocuments": 8,
  "documents": [
    {
      "documentId": "doc-123",
      "candidateName": "Ahmed Ben Ali",
      "expiryDate": "2026-06-15",
      "daysUntilExpiry": 31
    }
  ]
}
```

### 4. ATLAS Agent - Visa Workflow

#### Find Delayed Files

```http
POST /agents/atlas/delayed-files
Content-Type: application/json

{
  "userId": "user-123"
}
```

**Response:**
```json
{
  "success": true,
  "totalDelayed": 5,
  "critical": {
    "count": 2,
    "files": [
      {
        "visaFileId": "visa-001",
        "candidateName": "Ahmed Ben Ali",
        "currentStage": "EMBASSY",
        "daysDelayed": 35
      }
    ]
  },
  "warning": { "count": 3 }
}
```

#### Get Stage Status

```http
GET /agents/atlas/stages
```

**Response:**
```json
{
  "success": true,
  "stages": [
    {
      "stage": "DOCUMENTS",
      "total": 10,
      "completed": 8,
      "delayed": 1
    }
  ]
}
```

### 5. NOVA Agent - Finance

#### Get Unpaid Candidates

```http
POST /agents/nova/unpaid-candidates
Content-Type: application/json

{
  "userId": "user-123"
}
```

**Response:**
```json
{
  "success": true,
  "unpaidCount": 3,
  "totalAmount": 1500.00,
  "candidates": [
    {
      "candidateId": "cand-001",
      "name": "Ahmed Ben Ali",
      "amountDue": 500.00,
      "daysOverdue": 15
    }
  ]
}
```

#### Generate Financial Report

```http
POST /agents/nova/report
Content-Type: application/json

{
  "period": "MONTHLY",
  "userId": "user-123"
}
```

**Response:**
```json
{
  "success": true,
  "report": {
    "period": "May 2026",
    "revenue": 25000.00,
    "expenses": 8000.00,
    "netProfit": 17000.00
  }
}
```

### 6. TITAN Agent - Business

#### Get Job Offers Status

```http
POST /agents/titan/jobs
Content-Type: application/json

{
  "userId": "user-123"
}
```

**Response:**
```json
{
  "success": true,
  "activeJobs": 12,
  "jobs": [
    {
      "jobId": "job-001",
      "title": "Software Engineer",
      "company": "Tech Company",
      "applications": 25,
      "views": 120
    }
  ]
}
```

#### Check Website Status

```http
POST /agents/titan/website-status
Content-Type: application/json

{
  "userId": "user-123"
}
```

**Response:**
```json
{
  "success": true,
  "health": "HEALTHY",
  "uptime": "99.8%",
  "responseTime": 145,
  "recentErrors": 0
}
```

### 7. SENTINEL Agent - Security & QA

#### Run Security Audit

```http
POST /agents/sentinel/security-audit
Content-Type: application/json

{
  "userId": "user-123"
}
```

**Response:**
```json
{
  "success": true,
  "rating": "EXCELLENT",
  "vulnerabilities": 0,
  "audit": {
    "authentication": { "score": 95 },
    "encryption": { "score": 98 },
    "permissions": { "score": 92 }
  }
}
```

#### Run CRM Tests

```http
POST /agents/sentinel/test-crm
Content-Type: application/json

{
  "userId": "user-123"
}
```

**Response:**
```json
{
  "success": true,
  "totalTests": 10,
  "passed": 10,
  "failed": 0
}
```

### 8. Audit Logs

#### Get Command History

```http
GET /logs/commands?limit=50&agent=EVA
```

**Response:**
```json
{
  "success": true,
  "commands": [
    {
      "commandId": "cmd-001",
      "timestamp": "2026-05-15T14:30:00Z",
      "agent": "EVA",
      "command": "check missing documents",
      "status": "COMPLETED",
      "result": {}
    }
  ]
}
```

#### Get Audit Trail

```http
GET /logs/audit?resource=candidates&days=7
```

**Response:**
```json
{
  "success": true,
  "logs": [
    {
      "logId": "log-001",
      "timestamp": "2026-05-15T14:30:00Z",
      "userId": "user-123",
      "agent": "EVA",
      "action": "READ",
      "resource": "candidates",
      "result": "SUCCESS"
    }
  ]
}
```

### 9. Dashboard Data

#### Get Dashboard Overview

```http
GET /dashboard
```

**Response:**
```json
{
  "success": true,
  "commanderStatus": { "active": true },
  "agentStatuses": [
    { "agent": "EVA", "active": true, "tasksCompleted": 156 }
  ],
  "recentAlerts": [],
  "systemHealth": { "database": true, "api": true },
  "performanceMetrics": {
    "avgResponseTime": 245,
    "successRate": 99.2,
    "errorRate": 0.8
  }
}
```

### 10. Approval Workflow

#### Get Pending Approvals

```http
GET /approvals/pending
```

**Response:**
```json
{
  "success": true,
  "pending": [
    {
      "approvalId": "aprv-001",
      "commandId": "cmd-456",
      "agent": "EVA",
      "action": "SEND_MESSAGE",
      "description": "Send message to 5 candidates",
      "requestedBy": "user-123",
      "requestedAt": "2026-05-15T14:30:00Z"
    }
  ]
}
```

#### Approve Request

```http
POST /approvals/{approvalId}/approve
Content-Type: application/json

{
  "userId": "user-123"
}
```

**Response:**
```json
{
  "success": true,
  "approvalId": "aprv-001",
  "status": "APPROVED"
}
```

#### Reject Request

```http
POST /approvals/{approvalId}/reject
Content-Type: application/json

{
  "reason": "Not urgent at this time",
  "userId": "user-123"
}
```

**Response:**
```json
{
  "success": true,
  "approvalId": "aprv-001",
  "status": "REJECTED"
}
```

## Error Responses

### 400 - Bad Request

```json
{
  "success": false,
  "error": "Invalid command format",
  "code": "INVALID_REQUEST"
}
```

### 401 - Unauthorized

```json
{
  "success": false,
  "error": "Invalid or expired token",
  "code": "UNAUTHORIZED"
}
```

### 403 - Forbidden

```json
{
  "success": false,
  "error": "Insufficient permissions",
  "code": "FORBIDDEN"
}
```

### 500 - Server Error

```json
{
  "success": false,
  "error": "Internal server error",
  "code": "SERVER_ERROR"
}
```

## Rate Limiting

- Commands: 10 per minute
- API calls: 100 per minute
- Large exports: 5 per hour

Headers returned:
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 8
X-RateLimit-Reset: 1621095600
```

## WebSocket Events

For real-time updates:

```javascript
const socket = io('http://localhost:3000');

// Subscribe to agent events
socket.on('agent:status', (data) => {
  console.log('Agent status updated:', data);
});

socket.on('command:completed', (command) => {
  console.log('Command completed:', command);
});

socket.on('alert:new', (alert) => {
  console.log('New alert:', alert);
});
```

## Examples

### cURL Example

```bash
curl -X POST http://localhost:3000/api/ai-workforce/commander/command \
  -H "Authorization: Bearer token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "COMMANDER, check missing documents",
    "language": "en",
    "userId": "user-123"
  }'
```

### Python Example

```python
import requests

headers = {
    "Authorization": "Bearer token_here",
    "Content-Type": "application/json"
}

payload = {
    "text": "COMMANDER, check missing documents",
    "language": "en",
    "userId": "user-123"
}

response = requests.post(
    "http://localhost:3000/api/ai-workforce/commander/command",
    headers=headers,
    json=payload
)

print(response.json())
```

### JavaScript Example

```javascript
const response = await fetch('http://localhost:3000/api/ai-workforce/commander/command', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer token_here',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: 'COMMANDER, check missing documents',
    language: 'en',
    userId: 'user-123'
  })
});

const data = await response.json();
console.log(data);
```

