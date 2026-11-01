import {
  Transaction,
  ContentAsset,
  AdCampaign,
  Project,
  Invoice,
  AuditLogEntry,
  AuditLogDomain,
  AuditActionType
} from '../types';

export interface SMMMetrics {
  targetAnnual: number;
  monthlyTarget: number;
  totalAssets: number;
  totalPublished: number;
  remainingQuota: number;
  annualFulfillmentRate: number; // 0 - 100
  videoCount: number;
  graphicCount: number;
  reelsCount: number;
  carouselCount: number;
  storiesCount: number;
}

export function calculateSMMMetrics(
  assets: ContentAsset[],
  targetAnnual: number = 1080
): SMMMetrics {
  const totalAssets = assets.length;
  const publishedAssets = assets.filter((a) => a.productionStatus === 'Published');
  const totalPublished = publishedAssets.length;
  const remainingQuota = Math.max(0, targetAnnual - totalPublished);
  const annualFulfillmentRate = targetAnnual > 0 ? (totalPublished / targetAnnual) * 100 : 0;
  const monthlyTarget = Math.round(targetAnnual / 12);

  const videoCount = assets.filter((a) => a.format === 'Video').length;
  const reelsCount = assets.filter((a) => a.format === 'Reel').length;
  const carouselCount = assets.filter((a) => a.format === 'Carousel').length;
  const storiesCount = assets.filter((a) => a.format === 'Story').length;
  const graphicCount = assets.filter((a) => a.format === 'Static Graphic').length;

  return {
    targetAnnual,
    monthlyTarget,
    totalAssets,
    totalPublished,
    remainingQuota,
    annualFulfillmentRate: Number(annualFulfillmentRate.toFixed(1)),
    videoCount,
    graphicCount,
    reelsCount,
    carouselCount,
    storiesCount
  };
}

export interface AdCampaignCalculations {
  allocatedBudget: number;
  actualSpend: number;
  remainingBudget: number;
  budgetUtilization: number; // percentage
  cpc: number; // Cost Per Click
  ctr: number; // Click-Through Rate %
  engagementRate: number; // %
  cpl: number; // Cost Per Lead
  roas: number; // Return on Ad Spend
}

export function calculateCampaignMetrics(campaign: {
  allocatedBudget: number;
  actualSpend: number;
  impressions: number;
  reach: number;
  clicks: number;
  leads: number;
  conversions: number;
  revenueGenerated: number;
}): AdCampaignCalculations {
  const allocatedBudget = campaign.allocatedBudget || 0;
  const actualSpend = campaign.actualSpend || 0;
  const remainingBudget = Math.max(0, allocatedBudget - actualSpend);
  const budgetUtilization = allocatedBudget > 0 ? (actualSpend / allocatedBudget) * 100 : 0;

  const clicks = campaign.clicks || 0;
  const impressions = campaign.impressions || 0;
  const reach = campaign.reach || 0;
  const leads = campaign.leads || 0;
  const revenue = campaign.revenueGenerated || 0;

  const cpc = clicks > 0 ? actualSpend / clicks : 0;
  const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
  const engagementRate = reach > 0 ? (clicks / reach) * 100 : 0;
  const cpl = leads > 0 ? actualSpend / leads : 0;
  const roas = actualSpend > 0 ? revenue / actualSpend : 0;

  return {
    allocatedBudget,
    actualSpend,
    remainingBudget,
    budgetUtilization: Number(budgetUtilization.toFixed(1)),
    cpc: Number(cpc.toFixed(2)),
    ctr: Number(ctr.toFixed(2)),
    engagementRate: Number(engagementRate.toFixed(2)),
    cpl: Number(cpl.toFixed(2)),
    roas: Number(roas.toFixed(2))
  };
}

export interface DualStreamBalances {
  blackCashIncome: number;
  blackCashExpense: number;
  blackCashBalance: number;
  whiteBankIncome: number;
  whiteBankExpense: number;
  whiteBankBalance: number;
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  profitMargin: number; // %
}

export function calculateFinancialBalances(
  transactions: Transaction[],
  initialCash: number = 0,
  initialBank: number = 0
): DualStreamBalances {
  let blackCashIncome = 0;
  let blackCashExpense = 0;
  let whiteBankIncome = 0;
  let whiteBankExpense = 0;

  for (const t of transactions) {
    const cash = Number(t.cashAmount) || 0;
    const bank = Number(t.bankAmount) || 0;

    if (t.type === 'Income') {
      if (t.stream === 'Black Cash' || cash > 0) {
        blackCashIncome += cash;
      }
      if (t.stream === 'White Bank' || bank > 0) {
        whiteBankIncome += bank;
      }
    } else if (t.type === 'Expense') {
      if (t.stream === 'Black Cash' || cash > 0) {
        blackCashExpense += cash;
      }
      if (t.stream === 'White Bank' || bank > 0) {
        whiteBankExpense += bank;
      }
    }
  }

  const blackCashBalance = initialCash + blackCashIncome - blackCashExpense;
  const whiteBankBalance = initialBank + whiteBankIncome - whiteBankExpense;
  const totalIncome = blackCashIncome + whiteBankIncome;
  const totalExpense = blackCashExpense + whiteBankExpense;
  const netProfit = totalIncome - totalExpense;
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

  return {
    blackCashIncome,
    blackCashExpense,
    blackCashBalance,
    whiteBankIncome,
    whiteBankExpense,
    whiteBankBalance,
    totalIncome,
    totalExpense,
    netProfit,
    profitMargin: Number(profitMargin.toFixed(1))
  };
}

export function calculateReceivablesAndPayables(invoices: Invoice[]) {
  let accountsReceivable = 0;
  let totalInvoiced = 0;
  let totalPaid = 0;

  for (const inv of invoices) {
    totalInvoiced += inv.total || 0;
    totalPaid += inv.paidAmount || 0;
    if (inv.status !== 'Paid') {
      accountsReceivable += inv.balance || 0;
    }
  }

  return {
    accountsReceivable,
    totalInvoiced,
    totalPaid
  };
}

export function calculateProjectProgress(projects: Project[]) {
  if (projects.length === 0) return { completionRate: 0, activeCount: 0, totalBudget: 0, totalSpent: 0 };
  const completed = projects.filter((p) => p.status === 'Completed').length;
  const activeCount = projects.filter((p) => p.status === 'Active').length;
  const completionRate = (completed / projects.length) * 100;
  const totalBudget = projects.reduce((acc, p) => acc + (p.budget || 0), 0);
  const totalSpent = projects.reduce((acc, p) => acc + (p.spent || 0), 0);

  return {
    completionRate: Number(completionRate.toFixed(1)),
    activeCount,
    totalBudget,
    totalSpent
  };
}

export interface AuditLogFilterOptions {
  domain?: AuditLogDomain | 'all' | 'ALL';
  action?: AuditActionType | 'ALL';
  streamOrDepartment?: string | 'All' | 'ALL';
  stream?: string | 'All' | 'ALL';
  department?: string | 'All' | 'ALL';
  searchQuery?: string;
}

export function filterAuditLogs(
  logs: AuditLogEntry[],
  options: AuditLogFilterOptions
): AuditLogEntry[] {
  const {
    domain = 'all',
    action = 'ALL',
    streamOrDepartment = 'All',
    stream = 'All',
    department = 'All',
    searchQuery = ''
  } = options;

  const query = searchQuery.trim().toLowerCase();

  return logs.filter((entry) => {
    if (domain !== 'all' && domain !== 'ALL' && entry.domain !== domain) return false;
    if (action !== 'ALL' && entry.action !== action) return false;

    const entryStreamOrDept = entry.streamOrDepartment || entry.stream || entry.department || '';

    if (
      streamOrDepartment !== 'All' &&
      streamOrDepartment !== 'ALL' &&
      entryStreamOrDept !== streamOrDepartment
    ) {
      return false;
    }

    if (
      stream !== 'All' &&
      stream !== 'ALL' &&
      entry.stream !== stream &&
      entry.streamOrDepartment !== stream
    ) {
      return false;
    }

    if (
      department !== 'All' &&
      department !== 'ALL' &&
      entry.department !== department &&
      entry.streamOrDepartment !== department
    ) {
      return false;
    }

    if (query) {
      const haystack = [
        entry.actorName,
        entry.actorRole,
        entry.actorEmail,
        entry.entityType,
        entry.entityId,
        entry.summary,
        entry.previousValue || '',
        entry.newValue || '',
        entryStreamOrDept
      ]
        .join(' ')
        .toLowerCase();

      if (!haystack.includes(query)) return false;
    }

    return true;
  });
}

export function calculateAuditLogSummary(logs: AuditLogEntry[]) {
  const totalEvents = logs.length;
  const financeEvents = logs.filter((l) => l.domain === 'finance').length;
  const hrEvents = logs.filter((l) => l.domain === 'hr').length;
  const criticalOrElevatedEvents = logs.filter(
    (l) => l.severity === 'critical' || l.severity === 'elevated'
  ).length;
  const reversalsCount = logs.filter((l) => l.action === 'REVERSAL').length;
  const uniqueActors = new Set(logs.map((l) => l.actorEmail || l.actorName)).size;

  return {
    totalEvents,
    financeEvents,
    hrEvents,
    criticalOrElevatedEvents,
    criticalEvents: criticalOrElevatedEvents,
    reversalsCount,
    uniqueActors
  };
}

