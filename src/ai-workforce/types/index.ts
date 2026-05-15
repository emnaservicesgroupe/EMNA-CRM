// TypeScript Interfaces for EMNA AI Workforce System

// ============================================
// BASE TYPES
// ============================================

export type CommandLanguage = 'ar' | 'ar-TN' | 'en' | 'fr';
export type AgentType = 'EVA' | 'ORION' | 'ATLAS' | 'NOVA' | 'TITAN' | 'SENTINEL';
export type ActionStatus = 'PENDING' | 'EXECUTING' | 'COMPLETED' | 'FAILED' | 'APPROVED' | 'REJECTED';
export type ActionType = 'READ' | 'CREATE' | 'UPDATE' | 'DELETE' | 'SEND' | 'VERIFY' | 'APPROVE';

// ============================================
// COMMANDER TYPES
// ============================================

export interface CommanderConfig {
  id: string;
  name: string;
  version: string;
  agents: AgentType[];
  languages: CommandLanguage[];
  voiceEnabled: boolean;
  textEnabled: boolean;
  maxConcurrentCommands: number;
}

export interface Command {
  commandId: string;
  userId: string;
  text: string;
  language: CommandLanguage;
  timestamp: Date;
  status: ActionStatus;
  agent?: AgentType;
  requiresApproval: boolean;
  approvalId?: string;
  result?: Record<string, any>;
  error?: string;
}

export interface CommanderStatus {
  commanderActive: boolean;
  agentsActive: number;
  recentCommands: number;
  pendingApprovals: number;
  systemHealth: 'EXCELLENT' | 'GOOD' | 'WARNING' | 'CRITICAL';
  lastUpdate: Date;
}

export interface Alert {
  alertId: string;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  timestamp: Date;
  data?: Record<string, any>;
}

// ============================================
// AGENT TYPES
// ============================================

export interface AgentConfig {
  agentId: string;
  agentType: AgentType;
  name: string;
  description: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR';
  permissions: string[];
  capabilities: string[];
}

export interface AgentTask {
  taskId: string;
  commandId: string;
  agentType: AgentType;
  taskType: string;
  status: ActionStatus;
  startTime: Date;
  endTime?: Date;
  result?: Record<string, any>;
  error?: string;
}

// ============================================
// EVA AGENT - CANDIDATES
// ============================================

export interface Candidate {
  candidateId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  passport: string;
  cin: string;
  status: 'NEW' | 'PROCESSING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  createdAt: Date;
  updatedAt: Date;
}

export interface CandidateWithDocuments extends Candidate {
  documents: Document[];
  missingDocuments: string[];
  notes: string;
}

export interface EVATask {
  taskId: string;
  commandId: string;
  taskType: 'CHECK_MISSING' | 'PREPARE_MESSAGES' | 'UPDATE_STATUS' | 'SEND_REMINDER';
  candidateIds?: string[];
  result: {
    processed: number;
    successful: number;
    failed: number;
    details: Record<string, any>;
  };
}

// ============================================
// ORION AGENT - DOCUMENTS
// ============================================

export interface Document {
  documentId: string;
  candidateId: string;
  documentType: 'PASSPORT' | 'CIN' | 'B3' | 'DIPLOMA' | 'WORK_PERMIT' | 'VISA';
  fileUrl: string;
  fileName: string;
  uploadedAt: Date;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
  verificationDate?: Date;
  expiryDate?: Date;
  ocrData?: Record<string, any>;
  matchScore?: number;
}

export interface ORIONTask {
  taskId: string;
  commandId: string;
  taskType: 'VERIFY_PASSPORT' | 'CHECK_EXPIRY' | 'OCR_SCAN' | 'VERIFY_CIN' | 'VERIFY_B3';
  documentIds?: string[];
  result: {
    total: number;
    verified: number;
    failed: number;
    details: Document[];
  };
}

// ============================================
// ATLAS AGENT - VISA WORKFLOW
// ============================================

export type VisaStage = 'DOCUMENTS' | 'PROGRAMARI' | 'WORK_PERMIT' | 'EMBASSY' | 'RESULT' | 'TRAVEL' | 'COMPLETED';

export interface VisaFile {
  visaFileId: string;
  candidateId: string;
  currentStage: VisaStage;
  createdAt: Date;
  startDate?: Date;
  expectedCompletionDate?: Date;
  actualCompletionDate?: Date;
  tasks: VisaTask[];
  timeline: VisaTimeline[];
  delayReasons?: string[];
}

export interface VisaTask {
  visaTaskId: string;
  visaFileId: string;
  stage: VisaStage;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';
  dueDate: Date;
  completedDate?: Date;
  assignedTo?: string;
  notes?: string;
}

export interface VisaTimeline {
  timelineId: string;
  visaFileId: string;
  stage: VisaStage;
  enterDate: Date;
  exitDate?: Date;
  durationDays?: number;
  delayDays?: number;
  notes?: string;
}

export interface ATLASTask {
  taskId: string;
  commandId: string;
  taskType: 'GET_DELAYED' | 'GET_STATUS' | 'UPDATE_STAGE' | 'CREATE_TASK' | 'CHECK_TIMELINE';
  result: {
    total: number;
    processed: number;
    details: VisaFile[];
  };
}

// ============================================
// NOVA AGENT - FINANCE
// ============================================

export interface Invoice {
  invoiceId: string;
  candidateId: string;
  amount: number;
  currency: 'TND' | 'EUR' | 'USD';
  description: string;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  paymentMethod?: 'CASH' | 'BANK_TRANSFER' | 'CARD' | 'CHEQUE';
}

export interface Payment {
  paymentId: string;
  invoiceId?: string;
  candidateId: string;
  amount: number;
  currency: 'TND' | 'EUR' | 'USD';
  paymentDate: Date;
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CARD' | 'CHEQUE';
  reference: string;
  notes?: string;
}

export interface FinancialReport {
  reportId: string;
  period: string;
  revenue: number;
  expenses: number;
  netProfit: number;
  invoices: {
    total: number;
    paid: number;
    overdue: number;
    pending: number;
  };
  topClients: Array<{ clientId: string; revenue: number }>;
}

export interface NOVATask {
  taskId: string;
  commandId: string;
  taskType: 'GET_UNPAID' | 'SEND_REMINDER' | 'GENERATE_REPORT' | 'CREATE_INVOICE' | 'RECORD_PAYMENT';
  result: {
    processed: number;
    successful: number;
    failed: number;
    details: Record<string, any>;
  };
}

// ============================================
// TITAN AGENT - BUSINESS
// ============================================

export interface JobOffer {
  jobId: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: number;
  currency?: string;
  jobType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'TEMPORARY';
  postedDate: Date;
  expiryDate?: Date;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  applications: number;
  views: number;
}

export interface Partner {
  partnerId: string;
  companyName: string;
  contactEmail: string;
  contactPhone: string;
  industry: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PROSPECT';
  joinDate: Date;
  lastContactDate?: Date;
  notes?: string;
}

export interface TITANTask {
  taskId: string;
  commandId: string;
  taskType: 'GET_JOBS' | 'GET_PARTNERS' | 'SEND_EMAIL' | 'UPDATE_JOB' | 'CHECK_WEBSITE';
  result: {
    processed: number;
    successful: number;
    failed: number;
    details: Record<string, any>;
  };
}

// ============================================
// SENTINEL AGENT - SECURITY & QA
// ============================================

export interface SecurityTest {
  testId: string;
  agentId: string;
  testType: 'AUTHENTICATION' | 'ENCRYPTION' | 'PERMISSIONS' | 'INPUT_VALIDATION' | 'API_SECURITY';
  status: 'PASSED' | 'FAILED' | 'WARNING';
  timestamp: Date;
  findings?: string[];
  severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface CRMTest {
  testId: string;
  agentId: string;
  component: 'DASHBOARD' | 'FORMS' | 'BUTTONS' | 'FILTERS' | 'UPLOADS' | 'REPORTS';
  testType: 'FUNCTIONAL' | 'PERFORMANCE' | 'SECURITY' | 'USABILITY';
  status: 'PASSED' | 'FAILED' | 'PARTIAL';
  timestamp: Date;
  errors?: string[];
  responseTime?: number;
}

export interface SecurityAudit {
  auditId: string;
  timestamp: Date;
  vulnerabilities: number;
  warnings: number;
  rating: 'EXCELLENT' | 'GOOD' | 'WARNING' | 'CRITICAL';
  checks: {
    authentication: { score: number };
    encryption: { score: number };
    permissions: { score: number };
    inputValidation: { score: number };
    apiSecurity: { score: number };
  };
}

export interface SENTINELTask {
  taskId: string;
  commandId: string;
  taskType: 'RUN_AUDIT' | 'TEST_CRM' | 'TEST_API' | 'TEST_PORTAL' | 'CHECK_BACKUP';
  result: {
    totalTests: number;
    passed: number;
    failed: number;
    warnings: number;
    details: SecurityTest[] | CRMTest[];
  };
}

// ============================================
// APPROVAL & AUDIT
// ============================================

export interface Approval {
  approvalId: string;
  commandId: string;
  agentType: AgentType;
  action: ActionType;
  description: string;
  requestedBy: string;
  requestedAt: Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
}

export interface AuditLog {
  logId: string;
  timestamp: Date;
  userId: string;
  agent: AgentType;
  action: ActionType;
  resource: string;
  resourceId?: string;
  result: 'SUCCESS' | 'FAILED' | 'PENDING';
  ipAddress: string;
  userAgent: string;
  details?: Record<string, any>;
  error?: string;
}

// ============================================
// USER & PERMISSIONS
// ============================================

export type UserRole = 'ADMIN' | 'MANAGER' | 'OPERATOR' | 'VIEWER';

export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: string[];
  twoFactorEnabled: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface Permission {
  permissionId: string;
  name: string;
  description: string;
  resource: string;
  action: string;
  roles: UserRole[];
}

// ============================================
// API RESPONSES
// ============================================

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  timestamp: Date;
}

// ============================================
// DASHBOARD
// ============================================

export interface DashboardOverview {
  commanderStatus: CommanderStatus;
  agentStatuses: Array<{
    agent: AgentType;
    active: boolean;
    tasksCompleted: number;
    activeCommands: number;
  }>;
  recentAlerts: Alert[];
  systemHealth: {
    database: boolean;
    api: boolean;
    redis: boolean;
    fileStorage: boolean;
  };
  performanceMetrics: {
    avgResponseTime: number;
    successRate: number;
    errorRate: number;
  };
  urgentCounts: {
    missingDocuments: number;
    expiredDocuments: number;
    unpaidInvoices: number;
    delayedVisas: number;
    securityAlerts: number;
  };
}

// ============================================
// VOICE INTERFACE
// ============================================

export interface VoiceCommand {
  audioData: Blob | Buffer;
  language: CommandLanguage;
  confidence?: number;
  transcription?: string;
}

export interface VoiceResponse {
  text: string;
  audio?: Blob;
  language: CommandLanguage;
}
