import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  UserProfile,
  UserRole,
  AppModule,
  Client,
  Lead,
  Project,
  Task,
  ContentAsset,
  AdCampaign,
  Transaction,
  Invoice,
  Employee,
  PurchaseOrder,
  Asset,
  LeaveRequest,
  NotificationItem,
  SystemSettings,
  BrandThemeConfig,
  SMMProductionStatus,
  AdPlatform,
  FinancialStream,
  AuditLogEntry
} from '../types';
import {
  initialCurrentUser,
  initialSettings,
  defaultBrandTheme,
  initialClients,
  initialLeads,
  initialProjects,
  initialTasks,
  initialContentAssets,
  initialAdCampaigns,
  initialTransactions,
  initialInvoices,
  initialEmployees,
  initialPurchaseOrders,
  initialAssets,
  initialLeaveRequests,
  initialNotifications,
  initialAuditLogs
} from '../services/mockData';
import { db, testConnection, handleFirestoreError, OperationType } from '../services/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import {
  calculateFinancialBalances,
  calculateReceivablesAndPayables,
  calculateSMMMetrics,
  calculateCampaignMetrics,
  calculateProjectProgress,
  DualStreamBalances,
  SMMMetrics,
  AdCampaignCalculations
} from '../utils/calculations';

interface ERPContextType {
  // Navigation & Shell State
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  setUserRole: (role: UserRole) => void;
  currentModule: AppModule;
  setCurrentModule: (mod: AppModule) => void;
  activeSubSection: string;
  setActiveSubSection: (sec: string) => void;
  navigateTo: (module: AppModule, subSection?: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Appearance & Brand Studio
  theme: BrandThemeConfig;
  updateTheme: (updates: Partial<BrandThemeConfig>) => void;
  resetTheme: () => void;
  isCustomizerOpen: boolean;
  setIsCustomizerOpen: (open: boolean) => void;

  // System & Targets
  settings: SystemSettings;
  updateSettings: (newSettings: Partial<SystemSettings>) => void;
  isFirebaseConnected: boolean;

  // Clients
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;

  // Leads & CRM
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  convertLeadToProject: (leadId: string, projectName: string, budget: number) => void;
  deleteLead: (id: string) => void;

  // Projects & Tasks
  projects: Project[];
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProjectById: (id: string) => Project | undefined;

  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTasksByProjectId: (projectId: string) => Task[];

  // Social Media Management
  contentAssets: ContentAsset[];
  addContentAsset: (asset: Omit<ContentAsset, 'id' | 'createdAt'>) => void;
  updateContentAsset: (id: string, updates: Partial<ContentAsset>) => void;
  deleteContentAsset: (id: string) => void;
  getContentAssetsByClient: (clientId: string) => ContentAsset[];
  getContentAssetsByStatus: (status: SMMProductionStatus) => ContentAsset[];

  // Advertising & Campaigns
  adCampaigns: AdCampaign[];
  addAdCampaign: (campaign: Omit<AdCampaign, 'id' | 'createdAt'>) => void;
  updateAdCampaign: (id: string, updates: Partial<AdCampaign>) => void;
  deleteAdCampaign: (id: string) => void;
  getCampaignsByPlatform: (platform: AdPlatform) => AdCampaign[];

  // Dual-Stream Financial Ledger
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  reverseTransaction: (id: string, reason: string) => void;
  getTransactionsByStream: (stream: FinancialStream) => Transaction[];

  // Invoices & Billing
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  recordInvoicePayment: (invoiceId: string, amount: number, stream: 'Black Cash' | 'White Bank') => void;

  // HR & Employees
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  getEmployeeById: (id: string) => Employee | undefined;

  // Procurement & Hardware Assets
  purchaseOrders: PurchaseOrder[];
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'createdAt'>) => void;
  updatePurchaseOrderStatus: (id: string, status: PurchaseOrder['status']) => void;

  assets: Asset[];
  addAsset: (asset: Omit<Asset, 'id'>) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;

  // Leaves & Attendance
  leaveRequests: LeaveRequest[];
  addLeaveRequest: (req: Omit<LeaveRequest, 'id' | 'createdAt'>) => void;
  updateLeaveRequestStatus: (id: string, status: LeaveRequest['status']) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Enterprise Activity & Audit Logs
  auditLogs: AuditLogEntry[];
  recordAuditLog: (
    entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'actorName' | 'actorRole' | 'actorEmail'>
  ) => void;

  // Operational Selectors & Approval Center
  getPendingApprovals: () => {
    pos: PurchaseOrder[];
    leaves: LeaveRequest[];
    content: ContentAsset[];
  };

  // Live Derived Metrics across Modules
  financialBalances: DualStreamBalances;
  smmMetrics: SMMMetrics;
  campaignMetrics: AdCampaignCalculations;
  projectMetrics: {
    completionRate: number;
    activeCount: number;
    totalBudget: number;
    totalSpent: number;
  };
  receivablesAndPayables: {
    accountsReceivable: number;
    totalInvoiced: number;
    totalPaid: number;
  };

  // Environment & Firestore Sync
  syncDocToFirestore: (collectionName: string, docId: string, data: any) => Promise<void>;
  resetToSampleData: () => void;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'OTP_ERP_STATE_V1';

export const ERPProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>(initialCurrentUser);
  const [currentModule, setCurrentModule] = useState<AppModule>('dashboard');
  const [activeSubSection, setActiveSubSection] = useState<string>('default');
  const [searchQuery, setSearchQuery] = useState('');

  // Core Data Stores
  const [settings, setSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_settings`);
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_clients`);
    return saved ? JSON.parse(saved) : initialClients;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_leads`);
    return saved ? JSON.parse(saved) : initialLeads;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_projects`);
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_tasks`);
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [contentAssets, setContentAssets] = useState<ContentAsset[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_content`);
    return saved ? JSON.parse(saved) : initialContentAssets;
  });

  const [adCampaigns, setAdCampaigns] = useState<AdCampaign[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_campaigns`);
    return saved ? JSON.parse(saved) : initialAdCampaigns;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_transactions`);
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_invoices`);
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_employees`);
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_pos`);
    return saved ? JSON.parse(saved) : initialPurchaseOrders;
  });

  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_assets`);
    return saved ? JSON.parse(saved) : initialAssets;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_leaves`);
    return saved ? JSON.parse(saved) : initialLeaveRequests;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_notifications`);
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_audit_logs`);
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  // Appearance & Brand Studio State
  const [theme, setTheme] = useState<BrandThemeConfig>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_theme`);
      return saved ? { ...defaultBrandTheme, ...JSON.parse(saved) } : defaultBrandTheme;
    } catch {
      return defaultBrandTheme;
    }
  });
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Apply CSS custom variables and theme persistence
  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_theme`, JSON.stringify(theme));
      document.documentElement.style.setProperty('--otp-primary', theme.primaryColor);
      document.documentElement.style.setProperty('--otp-accent', theme.accentColor);
      document.documentElement.setAttribute('data-theme-density', theme.density);
      document.documentElement.setAttribute('data-theme-simplicity', theme.simplicityMode);
      document.documentElement.setAttribute('data-theme-radius', theme.borderRadius);
    } catch (e) {
      console.warn('Failed to persist theme:', e);
    }
  }, [theme]);

  const updateTheme = (updates: Partial<BrandThemeConfig>) => {
    setTheme((prev) => ({ ...prev, ...updates }));
  };

  const resetTheme = () => {
    setTheme(defaultBrandTheme);
  };

  // Verify Firebase Firestore readiness on boot
  useEffect(() => {
    testConnection().then((connected) => {
      setIsFirebaseConnected(connected);
    });
  }, []);

  // Save to persistent storage automatically
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_settings`, JSON.stringify(settings));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_clients`, JSON.stringify(clients));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_leads`, JSON.stringify(leads));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_projects`, JSON.stringify(projects));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_tasks`, JSON.stringify(tasks));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_content`, JSON.stringify(contentAssets));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_campaigns`, JSON.stringify(adCampaigns));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_transactions`, JSON.stringify(transactions));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_invoices`, JSON.stringify(invoices));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_employees`, JSON.stringify(employees));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_pos`, JSON.stringify(purchaseOrders));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_assets`, JSON.stringify(assets));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_leaves`, JSON.stringify(leaveRequests));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_notifications`, JSON.stringify(notifications));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_audit_logs`, JSON.stringify(auditLogs));
  }, [
    settings,
    clients,
    leads,
    projects,
    tasks,
    contentAssets,
    adCampaigns,
    transactions,
    invoices,
    employees,
    purchaseOrders,
    assets,
    leaveRequests,
    notifications,
    auditLogs
  ]);

  // Navigation Helper
  const navigateTo = (mod: AppModule, subSection: string = 'default') => {
    setCurrentModule(mod);
    setActiveSubSection(subSection);
  };

  const setUserRole = (role: UserRole) => {
    setCurrentUser((prev) => ({ ...prev, role }));
  };

  const updateSettings = (newSettings: Partial<SystemSettings>) => {
    const prevCompany = settings.companyName;
    setSettings((prev) => ({ ...prev, ...newSettings }));
    recordAuditLog({
      domain: 'system',
      action: 'UPDATE',
      entityType: 'SystemSettings',
      entityId: 'SYS-CFG',
      summary: `Updated enterprise system configuration parameters`,
      previousValue: `Company: ${prevCompany}, Dual-Stream Initials`,
      newValue: `Updated system targets & thresholds`,
      severity: 'elevated'
    });
  };

  // Helper method: Sync individual doc to Firestore with graceful offline handling
  const syncDocToFirestore = async (collectionName: string, docId: string, data: any) => {
    if (!isFirebaseConnected) return;
    try {
      await setDoc(doc(db, collectionName, docId), data, { merge: true });
    } catch (error) {
      console.warn(`Firestore sync note (${collectionName}/${docId}):`, error);
    }
  };

  // Helper method: Record immutable Audit Log entry with active actor metadata
  const recordAuditLog = (
    entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'actorName' | 'actorRole' | 'actorEmail'>
  ) => {
    let activeActor = currentUser;
    try {
      const savedAuthProfile = localStorage.getItem('OTP_ERP_USER_PROFILE');
      if (savedAuthProfile) {
        const parsed = JSON.parse(savedAuthProfile);
        if (parsed && parsed.fullName && parsed.role) {
          activeActor = parsed;
        }
      }
    } catch {
      // Fallback to currentUser
    }

    const now = new Date();
    const formattedTimestamp = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;

    const newLog: AuditLogEntry = {
      ...entry,
      id: `aud-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: formattedTimestamp,
      actorName: activeActor.fullName || 'Dawit Tadesse',
      actorRole: activeActor.role || 'Super Administrator',
      actorEmail: activeActor.email || 'dawit@otpmarketing.com'
    };

    setAuditLogs((prev) => [newLog, ...prev]);
    syncDocToFirestore('audit_logs', newLog.id, newLog);
  };

  // CLIENTS
  const addClient = (data: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...data,
      id: `cli-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setClients((prev) => [newClient, ...prev]);
    syncDocToFirestore('clients', newClient.id, newClient);
    recordAuditLog({
      domain: 'crm',
      action: 'CREATE',
      entityType: 'Client',
      entityId: newClient.clientId,
      summary: `Registered client organization "${newClient.companyName}" (${newClient.serviceType})`,
      previousValue: 'Unregistered Prospect',
      newValue: `Contract Value: ${newClient.contractValue.toLocaleString()} ETB (${newClient.status})`,
      severity: 'normal'
    });
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    const existing = clients.find((c) => c.id === id);
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = { ...c, ...updates };
          syncDocToFirestore('clients', id, updated);
          return updated;
        }
        return c;
      })
    );
    if (existing) {
      recordAuditLog({
        domain: 'crm',
        action: 'UPDATE',
        entityType: 'Client',
        entityId: existing.clientId,
        summary: `Updated client profile for "${existing.companyName}"`,
        previousValue: `Status: ${existing.status}, Value: ${existing.contractValue.toLocaleString()} ETB`,
        newValue: `Status: ${updates.status || existing.status}, Value: ${(updates.contractValue ?? existing.contractValue).toLocaleString()} ETB`,
        severity: 'normal'
      });
    }
  };

  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  const getClientById = (id: string) => clients.find((c) => c.id === id);

  // LEADS
  const addLead = (data: Omit<Lead, 'id' | 'createdAt'>) => {
    const newLead: Lead = {
      ...data,
      id: `lead-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setLeads((prev) => [newLead, ...prev]);
    syncDocToFirestore('leads', newLead.id, newLead);
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          const updated = { ...l, ...updates };
          syncDocToFirestore('leads', id, updated);
          return updated;
        }
        return l;
      })
    );
  };

  const convertLeadToProject = (leadId: string, projectName: string, budget: number) => {
    const lead = leads.find((l) => l.id === leadId);
    if (!lead) return;

    let targetClient = clients.find(
      (c) => c.companyName.toLowerCase() === lead.companyName.toLowerCase()
    );

    if (!targetClient) {
      targetClient = {
        id: `cli-${Date.now()}`,
        clientId: `CLI-${Math.floor(1000 + Math.random() * 9000)}`,
        companyName: lead.companyName,
        contactPerson: lead.contactPerson,
        phone: lead.phone,
        email: lead.email,
        industry: 'General Commercial',
        address: 'Addis Ababa, Ethiopia',
        assignedAccountManagerId: lead.assignedTo || 'emp-3',
        contractValue: budget,
        serviceType: 'Campaign & Production',
        status: 'Active',
        notes: `Converted from Won Lead ${lead.leadId}`,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setClients((prev) => [targetClient!, ...prev]);
      syncDocToFirestore('clients', targetClient.id, targetClient);
    }

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      projectId: `PRJ-24-${Math.floor(10 + Math.random() * 90)}`,
      name: projectName || `${lead.companyName} Agency Kickoff`,
      clientId: targetClient.id,
      projectManagerId: lead.assignedTo || 'emp-3',
      budget: budget || lead.estimatedValue,
      spent: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'High',
      status: 'Active',
      progressPercentage: 5,
      deliverables: 'Deliverables scoping, initial creative concepts & production schedule',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setProjects((prev) => [newProject, ...prev]);
    syncDocToFirestore('projects', newProject.id, newProject);

    updateLead(leadId, { stage: 'Won', wonProjectId: newProject.id });

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Deal Won & Project Launched',
      message: `Project ${newProject.name} created for client ${targetClient.companyName}.`,
      type: 'Approval',
      isRead: false,
      timestamp: 'Just now',
      linkModule: 'projects'
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  // PROJECTS
  const addProject = (data: Omit<Project, 'id' | 'createdAt'>) => {
    const newProject: Project = {
      ...data,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProjects((prev) => [newProject, ...prev]);
    syncDocToFirestore('projects', newProject.id, newProject);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          syncDocToFirestore('projects', id, updated);
          return updated;
        }
        return p;
      })
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const getProjectById = (id: string) => projects.find((p) => p.id === id);

  // TASKS
  const addTask = (data: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...data,
      id: `tsk-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTasks((prev) => [newTask, ...prev]);
    syncDocToFirestore('tasks', newTask.id, newTask);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...updates };
          syncDocToFirestore('tasks', id, updated);
          return updated;
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const getTasksByProjectId = (projectId: string) =>
    tasks.filter((t) => t.projectId === projectId);

  // CONTENT ASSETS
  const addContentAsset = (data: Omit<ContentAsset, 'id' | 'createdAt'>) => {
    const newAsset: ContentAsset = {
      ...data,
      id: `cnt-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setContentAssets((prev) => [newAsset, ...prev]);
    syncDocToFirestore('contentAssets', newAsset.id, newAsset);
  };

  const updateContentAsset = (id: string, updates: Partial<ContentAsset>) => {
    setContentAssets((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const updated = { ...a, ...updates };
          syncDocToFirestore('contentAssets', id, updated);
          return updated;
        }
        return a;
      })
    );
  };

  const deleteContentAsset = (id: string) => {
    setContentAssets((prev) => prev.filter((a) => a.id !== id));
  };

  const getContentAssetsByClient = (clientId: string) =>
    contentAssets.filter((a) => a.clientId === clientId);

  const getContentAssetsByStatus = (status: SMMProductionStatus) =>
    contentAssets.filter((a) => a.productionStatus === status);

  // AD CAMPAIGNS
  const addAdCampaign = (data: Omit<AdCampaign, 'id' | 'createdAt'>) => {
    const newCamp: AdCampaign = {
      ...data,
      id: `cmp-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAdCampaigns((prev) => [newCamp, ...prev]);
    syncDocToFirestore('adCampaigns', newCamp.id, newCamp);
  };

  const updateAdCampaign = (id: string, updates: Partial<AdCampaign>) => {
    setAdCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = { ...c, ...updates };
          syncDocToFirestore('adCampaigns', id, updated);
          return updated;
        }
        return c;
      })
    );
  };

  const deleteAdCampaign = (id: string) => {
    setAdCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  const getCampaignsByPlatform = (platform: AdPlatform) =>
    adCampaigns.filter((c) => c.platform === platform);

    // TRANSACTIONS
  const addTransaction = (data: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...data,
      id: `tx-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setTransactions((prev) => [newTx, ...prev]);
    syncDocToFirestore('transactions', newTx.id, newTx);

    const txAmount = newTx.stream === 'Black Cash' ? newTx.cashAmount : newTx.bankAmount;
    recordAuditLog({
      domain: 'finance',
      action: 'CREATE',
      entityType: 'Transaction',
      entityId: newTx.transactionId,
      summary: `Recorded ${newTx.type} in ${newTx.stream}: "${newTx.details}" (${txAmount.toLocaleString()} ETB)`,
      previousValue: 'No Prior Entry',
      newValue: `${newTx.type}: ${txAmount.toLocaleString()} ETB (${newTx.category})`,
      stream: newTx.stream,
      department: 'Finance',
      severity: txAmount >= 100000 ? 'elevated' : 'normal'
    });
  };

  const reverseTransaction = (id: string, reason: string) => {
    const original = transactions.find((t) => t.id === id);
    if (!original) return;

    const reversalTx: Transaction = {
      id: `tx-rev-${Date.now()}`,
      transactionId: `REV-${original.transactionId}`,
      date: new Date().toISOString().split('T')[0],
      type: original.type === 'Income' ? 'Expense' : 'Income',
      stream: original.stream,
      sourceOrClient: original.sourceOrClient,
      details: `Reversal of ${original.transactionId}: ${reason}`,
      cashAmount: original.cashAmount,
      bankAmount: original.bankAmount,
      category: original.category,
      vendor: original.vendor,
      description: `Audit Reversal: ${reason}. Original recorded on ${original.date}`,
      recordedById: currentUser.id,
      isReversal: true,
      reversalOfTransactionId: original.id,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setTransactions((prev) => [
      reversalTx,
      ...prev.map((t) => (t.id === id ? { ...t, isReversal: true } : t))
    ]);

    syncDocToFirestore('transactions', reversalTx.id, reversalTx);

    const revAmount = original.cashAmount || original.bankAmount;
    recordAuditLog({
      domain: 'finance',
      action: 'REVERSAL',
      entityType: 'Transaction',
      entityId: original.transactionId,
      summary: `Executed non-destructive ledger reversal (${reversalTx.transactionId}) — Reason: "${reason}"`,
      previousValue: `Valid ${original.type} (${revAmount.toLocaleString()} ETB)`,
      newValue: `Reversed via ${reversalTx.transactionId} (${revAmount.toLocaleString()} ETB counter-entry)`,
      stream: original.stream,
      department: 'Finance',
      severity: 'critical'
    });

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Financial Transaction Reversal',
      message: `Transaction ${original.transactionId} reversed: "${reason}".`,
      type: 'Invoice',
      isRead: false,
      timestamp: 'Just now',
      linkModule: 'finance'
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const getTransactionsByStream = (stream: FinancialStream) =>
    transactions.filter((t) => t.stream === stream);

  // INVOICES
  const addInvoice = (data: Omit<Invoice, 'id' | 'createdAt'>) => {
    const newInv: Invoice = {
      ...data,
      id: `inv-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setInvoices((prev) => [newInv, ...prev]);
    syncDocToFirestore('invoices', newInv.id, newInv);

    const client = clients.find((c) => c.id === newInv.clientId);
    recordAuditLog({
      domain: 'finance',
      action: 'CREATE',
      entityType: 'Invoice',
      entityId: newInv.invoiceNumber,
      summary: `Generated client invoice ${newInv.invoiceNumber} for ${client?.companyName || 'Client'}`,
      previousValue: 'Draft',
      newValue: `Total: ${newInv.total.toLocaleString()} ETB (Status: ${newInv.status})`,
      stream: 'White Bank',
      department: 'Finance',
      severity: 'normal'
    });
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === id) {
          const updated = { ...inv, ...updates };
          syncDocToFirestore('invoices', id, updated);
          return updated;
        }
        return inv;
      })
    );
  };

  const recordInvoicePayment = (
    invoiceId: string,
    amount: number,
    stream: 'Black Cash' | 'White Bank'
  ) => {
    const inv = invoices.find((i) => i.id === invoiceId);
    if (!inv) return;

    const prevBalance = inv.balance;
    const prevStatus = inv.status;
    const newPaid = (inv.paidAmount || 0) + amount;
    const newBalance = Math.max(0, inv.total - newPaid);
    const newStatus = newBalance === 0 ? 'Paid' : 'Partially Paid';

    updateInvoice(invoiceId, {
      paidAmount: newPaid,
      balance: newBalance,
      status: newStatus
    });

    const client = clients.find((c) => c.id === inv.clientId);
    recordAuditLog({
      domain: 'finance',
      action: 'PAYMENT',
      entityType: 'Invoice',
      entityId: inv.invoiceNumber,
      summary: `Recorded ${amount.toLocaleString()} ETB payment for Invoice ${inv.invoiceNumber} (${client?.companyName || 'Client'}) via ${stream}`,
      previousValue: `Balance: ${prevBalance.toLocaleString()} ETB (${prevStatus})`,
      newValue: `Balance: ${newBalance.toLocaleString()} ETB (${newStatus})`,
      stream,
      department: 'Finance',
      severity: 'elevated'
    });

    addTransaction({
      transactionId: `TX-PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      type: 'Income',
      stream,
      sourceOrClient: client?.companyName || 'Client Payment',
      details: `Settlement for Invoice #${inv.invoiceNumber}`,
      cashAmount: stream === 'Black Cash' ? amount : 0,
      bankAmount: stream === 'White Bank' ? amount : 0,
      category: 'Marketing',
      vendor: client?.companyName,
      description: `Payment applied to Invoice ${inv.invoiceNumber}. Remaining balance: ${newBalance} ETB.`,
      recordedById: currentUser.id
    });
  };

  // EMPLOYEES
  const addEmployee = (data: Omit<Employee, 'id'>) => {
    const newEmp: Employee = {
      ...data,
      id: `emp-${Date.now()}`
    };
    setEmployees((prev) => [...prev, newEmp]);
    syncDocToFirestore('employees', newEmp.id, newEmp);

    recordAuditLog({
      domain: 'hr',
      action: 'CREATE',
      entityType: 'Employee',
      entityId: newEmp.employeeId,
      summary: `Onboarded new team member ${newEmp.fullName} as ${newEmp.position} (${newEmp.department})`,
      previousValue: 'Candidate / Unregistered',
      newValue: `Status: ${newEmp.status} • Capacity: ${newEmp.workloadCapacity}%`,
      department: newEmp.department,
      severity: 'normal'
    });
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    const existing = employees.find((e) => e.id === id);
    setEmployees((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          const updated = { ...e, ...updates };
          syncDocToFirestore('employees', id, updated);
          return updated;
        }
        return e;
      })
    );

    if (existing) {
      const prevDesc = `Status: ${existing.status}, Capacity: ${existing.workloadCapacity}%, Role: ${existing.position}`;
      const nextDesc = `Status: ${updates.status || existing.status}, Capacity: ${updates.workloadCapacity ?? existing.workloadCapacity}%, Role: ${updates.position || existing.position}`;
      recordAuditLog({
        domain: 'hr',
        action: 'UPDATE',
        entityType: 'Employee',
        entityId: existing.employeeId,
        summary: `Updated HR personnel record for ${existing.fullName} (${existing.department})`,
        previousValue: prevDesc,
        newValue: nextDesc,
        department: updates.department || existing.department,
        severity: updates.status && updates.status !== existing.status ? 'elevated' : 'normal'
      });
    }
  };

  const getEmployeeById = (id: string) => employees.find((e) => e.id === id);

  // PURCHASE ORDERS
  const addPurchaseOrder = (data: Omit<PurchaseOrder, 'id' | 'createdAt'>) => {
    const newPO: PurchaseOrder = {
      ...data,
      id: `po-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setPurchaseOrders((prev) => [newPO, ...prev]);
    syncDocToFirestore('purchaseOrders', newPO.id, newPO);

    recordAuditLog({
      domain: 'procurement',
      action: 'CREATE',
      entityType: 'PurchaseOrder',
      entityId: newPO.poNumber,
      summary: `Submitted Purchase Order ${newPO.poNumber} to ${newPO.vendor} (${newPO.totalAmount.toLocaleString()} ETB)`,
      previousValue: 'Draft Requisition',
      newValue: `Status: ${newPO.status} (${newPO.totalAmount.toLocaleString()} ETB)`,
      department: newPO.department,
      severity: 'normal'
    });
  };

  const updatePurchaseOrderStatus = (id: string, status: PurchaseOrder['status']) => {
    const existing = purchaseOrders.find((p) => p.id === id);
    setPurchaseOrders((prev) =>
      prev.map((po) => {
        if (po.id !== id) return po;
        const updated = { ...po, status };
        syncDocToFirestore('purchaseOrders', id, updated);
        if (status === 'Completed' && po.status !== 'Completed') {
          addTransaction({
            transactionId: `TX-PO-${Math.floor(1000 + Math.random() * 9000)}`,
            date: new Date().toISOString().split('T')[0],
            type: 'Expense',
            stream: 'White Bank',
            sourceOrClient: 'Procurement Disbursement',
            details: `Fulfilled PO #${po.poNumber}: ${po.description}`,
            cashAmount: 0,
            bankAmount: po.totalAmount,
            category: 'Equipment rental',
            vendor: po.vendor,
            description: `Payment for purchase order ${po.poNumber}.`,
            recordedById: currentUser.id
          });
        }
        return updated;
      })
    );

    if (existing) {
      recordAuditLog({
        domain: 'procurement',
        action: status === 'Approved' ? 'APPROVAL' : 'STATUS_CHANGE',
        entityType: 'PurchaseOrder',
        entityId: existing.poNumber,
        summary: `Changed Purchase Order ${existing.poNumber} status to ${status}`,
        previousValue: `Status: ${existing.status}`,
        newValue: `Status: ${status}`,
        department: existing.department,
        severity: status === 'Approved' || status === 'Completed' ? 'elevated' : 'normal'
      });
    }
  };

  // ASSETS
  const addAsset = (data: Omit<Asset, 'id'>) => {
    const newAsset: Asset = {
      ...data,
      id: `ast-${Date.now()}`
    };
    setAssets((prev) => [...prev, newAsset]);
    syncDocToFirestore('assets', newAsset.id, newAsset);
  };

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    setAssets((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const updated = { ...a, ...updates };
          syncDocToFirestore('assets', id, updated);
          return updated;
        }
        return a;
      })
    );
  };

  // LEAVE REQUESTS
  const addLeaveRequest = (data: Omit<LeaveRequest, 'id' | 'createdAt'>) => {
    const newLeave: LeaveRequest = {
      ...data,
      id: `lv-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setLeaveRequests((prev) => [newLeave, ...prev]);
    syncDocToFirestore('leaveRequests', newLeave.id, newLeave);

    const emp = employees.find((e) => e.fullName === newLeave.employeeName);
    recordAuditLog({
      domain: 'hr',
      action: 'CREATE',
      entityType: 'LeaveRequest',
      entityId: newLeave.id.toUpperCase(),
      summary: `Submitted ${newLeave.totalDays}-day ${newLeave.leaveType} leave request for ${newLeave.employeeName}`,
      previousValue: 'No Active Request',
      newValue: `Status: ${newLeave.status} (${newLeave.startDate} → ${newLeave.endDate})`,
      department: emp?.department || 'Administration',
      severity: 'normal'
    });
  };

  const updateLeaveRequestStatus = (id: string, status: LeaveRequest['status']) => {
    const existing = leaveRequests.find((l) => l.id === id);
    setLeaveRequests((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          const updated = { ...l, status };
          syncDocToFirestore('leaveRequests', id, updated);
          return updated;
        }
        return l;
      })
    );

    if (existing) {
      const emp = employees.find((e) => e.fullName === existing.employeeName);
      recordAuditLog({
        domain: 'hr',
        action: 'APPROVAL',
        entityType: 'LeaveRequest',
        entityId: existing.id.toUpperCase(),
        summary: `${status} ${existing.totalDays}-day ${existing.leaveType} leave request for ${existing.employeeName}`,
        previousValue: `Status: ${existing.status}`,
        newValue: `Status: ${status}`,
        department: emp?.department || 'Administration',
        severity: status === 'Rejected' ? 'elevated' : 'normal'
      });
    }
  };

  // NOTIFICATIONS
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Helper selector: Pending Approvals
  const getPendingApprovals = () => ({
    pos: purchaseOrders.filter((po) => po.status === 'Requested'),
    leaves: leaveRequests.filter((l) => l.status === 'Pending'),
    content: contentAssets.filter(
      (c) => c.approvalStatus === 'Pending' || c.productionStatus === 'Review'
    )
  });

  // Derived live metrics using useMemo
  const financialBalances = useMemo(
    () =>
      calculateFinancialBalances(
        transactions,
        settings.blackCashInitialBalance,
        settings.whiteBankInitialBalance
      ),
    [transactions, settings.blackCashInitialBalance, settings.whiteBankInitialBalance]
  );

  const receivablesAndPayables = useMemo(
    () => calculateReceivablesAndPayables(invoices),
    [invoices]
  );

  const smmMetrics = useMemo(
    () => calculateSMMMetrics(contentAssets, settings.annualSmmTarget),
    [contentAssets, settings.annualSmmTarget]
  );

  const projectMetrics = useMemo(
    () => calculateProjectProgress(projects),
    [projects]
  );

  const campaignMetrics = useMemo(() => {
    const totalAllocated = adCampaigns.reduce((acc, c) => acc + (c.allocatedBudget || 0), 0);
    const totalSpend = adCampaigns.reduce((acc, c) => acc + (c.actualSpend || 0), 0);
    const totalImpressions = adCampaigns.reduce((acc, c) => acc + (c.impressions || 0), 0);
    const totalClicks = adCampaigns.reduce((acc, c) => acc + (c.clicks || 0), 0);
    const totalLeads = adCampaigns.reduce((acc, c) => acc + (c.leads || 0), 0);
    const totalRevenue = adCampaigns.reduce((acc, c) => acc + (c.revenueGenerated || 0), 0);

    return calculateCampaignMetrics({
      allocatedBudget: totalAllocated,
      actualSpend: totalSpend,
      impressions: totalImpressions,
      reach: totalImpressions * 0.6,
      clicks: totalClicks,
      leads: totalLeads,
      conversions: totalLeads * 0.4,
      revenueGenerated: totalRevenue
    });
  }, [adCampaigns]);

  const resetToSampleData = () => {
    setSettings(initialSettings);
    setTheme(defaultBrandTheme);
    setClients(initialClients);
    setLeads(initialLeads);
    setProjects(initialProjects);
    setTasks(initialTasks);
    setContentAssets(initialContentAssets);
    setAdCampaigns(initialAdCampaigns);
    setTransactions(initialTransactions);
    setInvoices(initialInvoices);
    setEmployees(initialEmployees);
    setPurchaseOrders(initialPurchaseOrders);
    setAssets(initialAssets);
    setLeaveRequests(initialLeaveRequests);
    setNotifications(initialNotifications);
    setAuditLogs(initialAuditLogs);
  };

  return (
    <ERPContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        setUserRole,
        currentModule,
        setCurrentModule,
        activeSubSection,
        setActiveSubSection,
        navigateTo,
        searchQuery,
        setSearchQuery,
        theme,
        updateTheme,
        resetTheme,
        isCustomizerOpen,
        setIsCustomizerOpen,
        settings,
        updateSettings,
        isFirebaseConnected,
        clients,
        addClient,
        updateClient,
        deleteClient,
        getClientById,
        leads,
        addLead,
        updateLead,
        convertLeadToProject,
        deleteLead,
        projects,
        addProject,
        updateProject,
        deleteProject,
        getProjectById,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        getTasksByProjectId,
        contentAssets,
        addContentAsset,
        updateContentAsset,
        deleteContentAsset,
        getContentAssetsByClient,
        getContentAssetsByStatus,
        adCampaigns,
        addAdCampaign,
        updateAdCampaign,
        deleteAdCampaign,
        getCampaignsByPlatform,
        transactions,
        addTransaction,
        reverseTransaction,
        getTransactionsByStream,
        invoices,
        addInvoice,
        updateInvoice,
        recordInvoicePayment,
        employees,
        addEmployee,
        updateEmployee,
        getEmployeeById,
        purchaseOrders,
        addPurchaseOrder,
        updatePurchaseOrderStatus,
        assets,
        addAsset,
        updateAsset,
        leaveRequests,
        addLeaveRequest,
        updateLeaveRequestStatus,
        notifications,
        markNotificationAsRead,
        clearAllNotifications,
        auditLogs,
        recordAuditLog,
        getPendingApprovals,
        financialBalances,
        smmMetrics,
        campaignMetrics,
        projectMetrics,
        receivablesAndPayables,
        syncDocToFirestore,
        resetToSampleData
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
};
