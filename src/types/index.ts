export type UserRole =
  | 'Super Administrator'
  | 'Managing Director'
  | 'Finance Manager'
  | 'Marketing Manager'
  | 'Project Manager'
  | 'Social Media Manager'
  | 'Designer / Content Creator'
  | 'Media Buyer'
  | 'HR Manager'
  | 'Employee';

export type AppModule =
  | 'dashboard'
  | 'messages'
  | 'crm'
  | 'projects'
  | 'smm'
  | 'advertising'
  | 'finance'
  | 'hr'
  | 'procurement'
  | 'reports'
  | 'settings';

export type LeadStage =
  | 'New Lead'
  | 'Contacted'
  | 'Meeting'
  | 'Proposal'
  | 'Negotiation'
  | 'Won'
  | 'Lost';

export type ProjectStatus =
  | 'Planning'
  | 'Active'
  | 'On Hold'
  | 'In Review'
  | 'Completed'
  | 'Cancelled';

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type TaskStatus = 'Todo' | 'In Progress' | 'In Review' | 'Done';

export type SMMPlatform = 'Instagram' | 'Facebook' | 'TikTok' | 'LinkedIn' | 'YouTube';

export type ContentFormat = 'Reel' | 'Story' | 'Carousel' | 'Static Graphic' | 'Video';

export type SMMApprovalStatus = 'Pending' | 'Approved' | 'Revision Requested';

export type SMMProductionStatus =
  | 'Ideation'
  | 'In Canva'
  | 'Review'
  | 'Approved'
  | 'Scheduled'
  | 'Published';

export type AdPlatform =
  | 'Meta Ads'
  | 'Facebook'
  | 'Instagram'
  | 'Google Ads'
  | 'TikTok Ads'
  | 'LinkedIn Ads';

export type CampaignStatus = 'Draft' | 'Pending Approval' | 'Active' | 'Paused' | 'Completed';

export type FinancialStream = 'Black Cash' | 'White Bank';

export type TransactionType = 'Income' | 'Expense';

export type ExpenseCategory =
  | 'Transport'
  | 'Food expense'
  | 'Equipment rental'
  | 'Salaries'
  | 'Marketing'
  | 'Office expenses'
  | 'Software and subscriptions'
  | 'Production expenses'
  | 'Other';

export type InvoiceStatus = 'Draft' | 'Sent' | 'Partially Paid' | 'Paid' | 'Overdue';

export type Department =
  | 'Management'
  | 'Marketing'
  | 'Creative & Design'
  | 'Video Production'
  | 'Advertising'
  | 'Finance'
  | 'Administration';

export type POStatus = 'Requested' | 'Approved' | 'Ordered' | 'Received' | 'Completed';

export type AssetCategory =
  | 'Camera & Video'
  | 'Audio & Lighting'
  | 'Computing'
  | 'Office Furniture'
  | 'Software Subscription';

export type AssetStatus = 'Active' | 'Under Maintenance' | 'Decommissioned';

export type LeaveType = 'Annual' | 'Sick' | 'Maternity/Paternity' | 'Emergency' | 'Unpaid';

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  fullName: string;
  role: UserRole;
  department: Department;
  avatarUrl?: string;
  phone?: string;
  position?: string;
  bio?: string;
  status: 'Active' | 'Inactive';
  createdAt?: string;
}

export interface ManagedUserAccount {
  id: string;
  fullName: string;
  username: string; // login username
  email: string;    // corporate email
  password: string; // login password created by super admin
  role: UserRole;
  department: Department;
  phone?: string;
  position?: string;
  avatarUrl?: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  createdAt: string;
}


export interface Client {
  id: string;
  clientId: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  industry: string;
  address: string;
  assignedAccountManagerId: string;
  contractValue: number;
  serviceType: string;
  status: 'Active' | 'Prospect' | 'Inactive' | 'Churned';
  notes?: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  leadId: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  source: string;
  stage: LeadStage;
  estimatedValue: number;
  assignedTo: string;
  notes?: string;
  wonProjectId?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  projectId: string;
  name: string;
  clientId: string;
  projectManagerId: string;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  priority: PriorityLevel;
  status: ProjectStatus;
  progressPercentage: number;
  deliverables: string;
  createdAt: string;
}

export interface Task {
  id: string;
  taskId: string;
  projectId: string;
  title: string;
  description: string;
  assigneeId: string;
  priority: PriorityLevel;
  status: TaskStatus;
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
  createdAt: string;
}

export interface ContentAsset {
  id: string;
  contentId: string;
  brandId?: string;
  clientId: string;
  platform: SMMPlatform;
  topic: string;
  caption: string;
  format: ContentFormat;
  assignedDesignerId: string;
  assignedCopywriterId: string;
  designLink: string;
  publishDate: string;
  approvalStatus: SMMApprovalStatus;
  productionStatus: SMMProductionStatus;
  publishedUrl?: string;
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  reach?: number;
  createdAt: string;
}

export interface AdCampaign {
  id: string;
  campaignId: string;
  clientId: string;
  name: string;
  platform: AdPlatform;
  allocatedBudget: number;
  actualSpend: number;
  startDate: string;
  endDate: string;
  status: CampaignStatus;
  impressions: number;
  reach: number;
  clicks: number;
  leads: number;
  conversions: number;
  revenueGenerated: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  transactionId: string;
  date: string;
  type: TransactionType;
  stream: FinancialStream;
  sourceOrClient: string;
  details: string;
  cashAmount: number;
  bankAmount: number;
  category: ExpenseCategory;
  vendor?: string;
  description: string;
  recordedById: string;
  receiptUrl?: string;
  isReversal?: boolean;
  reversalOfTransactionId?: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  projectId?: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  total: number;
  paidAmount: number;
  balance: number;
  status: InvoiceStatus;
  items?: { description: string; quantity: number; unitPrice: number; amount: number }[];
  createdAt: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  fullName: string;
  department: Department;
  position: string;
  reportingManager: string;
  email: string;
  phone: string;
  status: 'Active' | 'On Leave' | 'Terminated';
  joiningDate: string;
  workloadCapacity: number; // percentage 0-100
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendor: string;
  description: string;
  totalAmount: number;
  status: POStatus;
  requestedBy: string;
  approvedBy?: string;
  date: string;
  createdAt: string;
}

export interface Asset {
  id: string;
  assetTag: string;
  name: string;
  category: AssetCategory;
  purchaseDate: string;
  purchaseCost: number;
  assignedTo: string;
  status: AssetStatus;
}

export interface LeaveRequest {
  id: string;
  employeeName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'Deadline' | 'Approval' | 'Budget' | 'Invoice' | 'Leave';
  isRead: boolean;
  timestamp: string;
  linkModule?: AppModule;
}

export interface SystemSettings {
  companyName: string;
  annualSmmTarget: number;
  baseCurrency: string;
  whiteBankInitialBalance: number;
  blackCashInitialBalance: number;
}

export type AuditLogDomain =
  | 'finance'
  | 'hr'
  | 'crm'
  | 'projects'
  | 'smm'
  | 'advertising'
  | 'procurement'
  | 'system';

export type AuditActionType =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'REVERSAL'
  | 'APPROVAL'
  | 'PAYMENT'
  | 'STATUS_CHANGE';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  actorEmail: string;
  domain: AuditLogDomain;
  action: AuditActionType;
  entityType: string;
  entityId: string;
  summary: string;
  previousValue?: string;
  newValue?: string;
  streamOrDepartment?: string;
  stream?: FinancialStream;
  department?: string;
  severity: 'normal' | 'elevated' | 'critical';
}


export type LogoStyle = 'monogram' | 'shield-emblem' | 'custom-image' | 'minimal-text';
export type SidebarTone = 'charcoal' | 'dark' | 'light' | 'accent-border';
export type LayoutDensity = 'compact' | 'comfortable' | 'spacious';
export type BorderRadiusOption = 'sharp' | 'subtle' | 'modern' | 'rounded';
export type SimplicityMode = 'clean' | 'balanced' | 'compact';

export type EraSystemId =
  | 'cognify-bento'
  | 'cyberpunk-neon'
  | 'classic-90s-erp'
  | 'swiss-bauhaus'
  | 'neo-brutalist'
  | 'executive-luxury';

export interface EraSystemDefinition {
  id: EraSystemId;
  name: string;
  eraName: string;
  tagline: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  accentSecondary: string;
  accentTertiary: string;
  appBackground: string;
  shellBackground: string;
  cardBackground: string;
  textColor: string;
  mutedTextColor: string;
  borderColor: string;
  borderRadius: BorderRadiusOption;
  borderRadiusValue: string;
  shadowStyle: 'soft-bento' | 'neon-glow' | 'beveled-3d' | 'sharp-border' | 'hard-brutalist' | 'luxury-glass';
  fontStyle: 'modern-sans' | 'tactical-mono' | 'system-90s' | 'swiss-editorial' | 'bold-brutalist' | 'executive-serif';
  iconEmoji: string;
}

export interface BrandThemeConfig {
  era: EraSystemId;
  primaryColor: string; // Hex e.g. #1d1d1f
  accentColor: string; // Hex e.g. #1ec94c
  accentSecondary?: string;
  accentTertiary?: string;
  sidebarTone: SidebarTone;
  logoStyle: LogoStyle;
  logoImageUrl?: string;
  companyName: string;
  companyShortName: string;
  companyTagline: string;
  density: LayoutDensity;
  simplicityMode: SimplicityMode;
  borderRadius: BorderRadiusOption;
  hideDecorativeCards: boolean;
  highContrastTables: boolean;
  enableTransitions: boolean;
}

export type RewardMethodId =
  | 'hybrid-productivity'
  | 'time-based'
  | 'milestone-streak'
  | 'kpi-weighted';

export interface RewardMethodDefinition {
  id: RewardMethodId;
  name: string;
  badge: string;
  shortFormula: string;
  formulaSummary?: string;
  shortLabel?: string;
  description: string;
  whyLogical: string;
}

export interface RewardConfig {
  method: RewardMethodId;
  pointsPerActiveHour: number;
  pointsPerCompletedTask: number;
  pointsPerApprovedContent: number;
  dailyTargetMinutes: number;
  dailyMilestoneBonus: number;
  streakBonusPerDay: number;
  idleTimeoutMinutes: number;
  dailyMaxTimePoints: number;
  minEfficiencyThreshold: number;
  allowRedemptions: boolean;
  updatedBy?: string;
  updatedAt?: string;
}

export interface DailyTimePointEntry {
  day?: string;
  date?: string;
  activeMinutes: number;
  pauseMinutes: number;
  pointsEarned?: number;
  earnedPoints?: number;
  tasksCompleted?: number;
  deliverablesApproved?: number;
}

export interface UserTimeRewardRecord {
  userId: string;
  username?: string;
  fullName: string;
  role: UserRole;
  department: Department;
  avatarUrl?: string;
  todayActiveMinutes: number;
  todayPauseMinutes: number;
  weeklyActiveMinutes: number;
  totalActiveMinutes: number;
  totalPauseMinutes: number;
  tasksCompletedCount: number;
  deliverablesApprovedCount: number;
  streakDays: number;
  manualBonusPoints: number;
  redeemedPoints: number;
  lastActiveTimestamp: string;
  dailyHistory: DailyTimePointEntry[];
}

export interface RewardCatalogItem {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: 'Cash Bonus' | 'Time Off' | 'Perks & Vouchers' | 'Career & Tech' | 'Perks & Gear' | 'Voucher';
  badgeText?: string;
  monetaryValueETB?: number;
  iconName?: string;
  available: boolean;
}

export interface RewardRedemption {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  rewardId: string;
  rewardTitle: string;
  pointsSpent: number;
  monetaryValueETB?: number;
  status: 'Pending Approval' | 'Approved' | 'Fulfilled' | 'Rejected';
  requestedAt: string;
  resolvedBy?: string;
  processedBy?: string;
}

export type ChatChannelType = 'channel' | 'dm';

export interface ChatChannel {
  id: string;
  name: string;
  type: ChatChannelType;
  description: string;
  department?: Department | 'All Agency';
  participantIds?: string[]; // Used for Direct Messages (dm)
  isPrivate?: boolean;
  createdBy: string;
  createdAt: string;
}

export interface ChatAttachmentLink {
  entityType: 'Project' | 'Task' | 'Invoice' | 'PurchaseOrder' | 'Campaign';
  entityId: string;
  title: string;
  statusOrValue?: string;
  targetModule: AppModule;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderDepartment?: Department;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  createdAtMs: number;
  priority?: 'Normal' | 'Urgent' | 'Approval Needed' | 'Announcement';
  replyToMessageId?: string;
  replyToSenderName?: string;
  replyToSnippet?: string;
  linkedEntity?: ChatAttachmentLink;
  reactions?: Record<string, string[]>; // emoji -> array of userIds
  isPinned?: boolean;
  isEdited?: boolean;
}



