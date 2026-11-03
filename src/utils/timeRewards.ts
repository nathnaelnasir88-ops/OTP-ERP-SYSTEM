import {
  RewardConfig,
  RewardMethodDefinition,
  RewardMethodId,
  UserTimeRewardRecord,
  RewardCatalogItem
} from '../types';

export const REWARD_METHODS: Record<RewardMethodId, RewardMethodDefinition> = {
  'hybrid-productivity': {
    id: 'hybrid-productivity',
    name: 'Active Time + Output Hybrid (Recommended)',
    badge: 'Balanced & Anti-Idle',
    shortLabel: 'Hybrid Time + Output',
    shortFormula: '(Active Hours × Rate) + (Tasks × Bonus) + Focus Efficiency',
    formulaSummary: '(Active Hours × Rate) + (Tasks × Bonus) + Focus Efficiency',
    description:
      'Rewards employees for engaged active time in the ERP while requiring real task and deliverable output to unlock full multipliers.',
    whyLogical:
      'Prevents passive "clock-watching" by combining active focus hours with verifiable agency deliverables (tasks completed & content approved).'
  },
  'time-based': {
    id: 'time-based',
    name: 'Pure Engaged Time-Based (With Idle Cap)',
    badge: 'Strict Active Timer',
    shortLabel: 'Engaged Time-Based',
    shortFormula: 'Active Hours × Hourly Point Rate (Capped Daily)',
    formulaSummary: 'Active Hours × Hourly Point Rate (Capped Daily)',
    description:
      'Awards points strictly for active engaged minutes inside the ERP. Automatically pauses when idle and enforces a daily point cap.',
    whyLogical:
      'Ideal for support, administration, or monitoring roles whose primary KPI is consistent online availability and system presence.'
  },
  'milestone-streak': {
    id: 'milestone-streak',
    name: 'Daily Focus Target & Streak Method',
    badge: 'Habit & Consistency',
    shortLabel: 'Daily Target & Streak',
    shortFormula: 'Daily Target Unlock + Consecutive Day Streak + Base Time',
    formulaSummary: 'Daily Target Unlock + Consecutive Day Streak + Base Time',
    description:
      'Focuses on hitting the daily active work threshold (e.g., 4h focused ERP work) and maintaining consecutive daily attendance streaks.',
    whyLogical:
      'Encourages steady daily discipline and consistent platform adoption across all departments without burnout.'
  },
  'kpi-weighted': {
    id: 'kpi-weighted',
    name: 'KPI & Deliverable Weighted Efficiency',
    badge: 'High-Output Agency',
    shortLabel: 'KPI Weighted Efficiency',
    shortFormula: '(Deliverables × Points) × Active Focus Efficiency Multiplier',
    formulaSummary: '(Deliverables × Points) × Active Focus Efficiency Multiplier',
    description:
      'Uses active time efficiency (Active vs. Pause ratio) as a 1.35× multiplier on completed tasks and approved SMM/Campaign deliverables.',
    whyLogical:
      'Rewards fast, high-focus specialists who complete high volumes of quality work in concentrated active sessions.'
  }
};

export const REWARD_METHOD_LIST: RewardMethodDefinition[] = Object.values(REWARD_METHODS);

export const defaultRewardConfig: RewardConfig = {
  method: 'hybrid-productivity',
  pointsPerActiveHour: 20,
  pointsPerCompletedTask: 25,
  pointsPerApprovedContent: 15,
  dailyTargetMinutes: 240, // 4h focused ERP active time per day
  dailyMilestoneBonus: 50,
  streakBonusPerDay: 10,
  idleTimeoutMinutes: 5,
  dailyMaxTimePoints: 160,
  minEfficiencyThreshold: 70,
  allowRedemptions: true,
  updatedBy: 'Super Administrator',
  updatedAt: '2025-02-24'
};

export const initialRewardCatalog: RewardCatalogItem[] = [
  {
    id: 'rew-1',
    title: '1,500 ETB Performance Cash Bonus',
    description: 'Direct cash bonus disbursed via White Bank or Black Cash payroll stream.',
    pointsCost: 600,
    category: 'Cash Bonus',
    badgeText: '1,500 ETB',
    monetaryValueETB: 1500,
    available: true
  },
  {
    id: 'rew-2',
    title: 'Half-Day Paid Time Off (PTO)',
    description: 'Redeem for an approved afternoon or morning off without deducting annual leave.',
    pointsCost: 400,
    category: 'Time Off',
    badgeText: '4 Hours Off',
    monetaryValueETB: 1200,
    available: true
  },
  {
    id: 'rew-3',
    title: 'Executive Lunch & Coffee Voucher',
    description: 'Sponsored lunch and specialty coffee voucher at Kaldi’s or Bole dining partners.',
    pointsCost: 180,
    category: 'Perks & Vouchers',
    badgeText: 'Perk Voucher',
    monetaryValueETB: 600,
    available: true
  },
  {
    id: 'rew-4',
    title: 'Unlimited 5G Monthly Mobile Data',
    description: 'Full Ethio Telecom / Safaricom high-speed data package for creative & remote work.',
    pointsCost: 250,
    category: 'Career & Tech',
    badgeText: 'Data Package',
    monetaryValueETB: 1000,
    available: true
  },
  {
    id: 'rew-5',
    title: 'Full Day Paid Leave Pass',
    description: '1 full paid rest day added to your personal HR leave balance.',
    pointsCost: 750,
    category: 'Time Off',
    badgeText: '1 Full Day',
    monetaryValueETB: 2500,
    available: true
  },
  {
    id: 'rew-6',
    title: '3,500 ETB Quarterly Excellence Award',
    description: 'Executive monetary recognition for top tier time & productivity contributors.',
    pointsCost: 1100,
    category: 'Cash Bonus',
    badgeText: '3,500 ETB',
    monetaryValueETB: 3500,
    available: true
  }
];

export function formatMinutesToHoursMins(totalMinutes: number): string {
  const safeMins = Math.max(0, Math.round(totalMinutes));
  const hours = Math.floor(safeMins / 60);
  const mins = safeMins % 60;
  return `${hours}h ${mins.toString().padStart(2, '0')}m`;
}

export function calculateEfficiencyRatio(activeMinutes: number, pauseMinutes: number): number {
  const active = Math.max(0, activeMinutes);
  const pause = Math.max(0, pauseMinutes);
  const total = active + pause;
  if (total === 0) return 100;
  return Math.min(100, Math.max(0, Math.round((active / total) * 100)));
}

export interface UserRewardBreakdown {
  efficiencyPct: number;
  efficiencyRatio: number;
  efficiencyQualified: boolean;
  timePoints: number;
  deliverablePoints: number;
  streakAndMilestonePoints: number;
  manualBonusPoints: number;
  grossPoints: number;
  totalEarnedPoints: number;
  redeemedPoints: number;
  availablePoints: number;
  todayTimePoints: number;
  todayTargetProgressPct: number;
  dailyGoalProgress: number;
  dailyTargetReached: boolean;
  tier: 'Diamond Partner' | 'Gold Specialist' | 'Silver Contributor' | 'Bronze Starter';
  tierBadge: string;
  nextTierPoints: number;
}

export function calculateUserRewardBreakdown(
  record: UserTimeRewardRecord,
  config: RewardConfig
): UserRewardBreakdown {
  const efficiencyPct = calculateEfficiencyRatio(
    record.totalActiveMinutes,
    record.totalPauseMinutes
  );
  const efficiencyQualified = efficiencyPct >= config.minEfficiencyThreshold;
  const dailyTargetReached = record.todayActiveMinutes >= config.dailyTargetMinutes;
  const todayTargetProgressPct = Math.min(
    100,
    Math.round((record.todayActiveMinutes / Math.max(1, config.dailyTargetMinutes)) * 100)
  );

  const rawTodayTimePoints = Math.round(
    (record.todayActiveMinutes / 60) * config.pointsPerActiveHour
  );
  const todayTimePoints = Math.min(config.dailyMaxTimePoints, rawTodayTimePoints);

  const totalActiveHours = record.totalActiveMinutes / 60;
  let timePoints = 0;
  let deliverablePoints = 0;
  let streakAndMilestonePoints = 0;

  const rawDeliverables =
    record.tasksCompletedCount * config.pointsPerCompletedTask +
    record.deliverablesApprovedCount * config.pointsPerApprovedContent;

  switch (config.method) {
    case 'hybrid-productivity': {
      const efficiencyFactor = efficiencyQualified ? 1.0 : 0.75;
      timePoints = Math.round(totalActiveHours * config.pointsPerActiveHour * efficiencyFactor);
      deliverablePoints = rawDeliverables;
      streakAndMilestonePoints =
        (dailyTargetReached ? Math.round(config.dailyMilestoneBonus * 0.6) : 0) +
        record.streakDays * Math.round(config.streakBonusPerDay * 0.6);
      break;
    }

    case 'time-based': {
      const efficiencyFactor = efficiencyQualified ? 1.0 : 0.8;
      // Pure time-based rewards active hours at a 1.35x rate since deliverables aren't counted separately
      timePoints = Math.round(totalActiveHours * config.pointsPerActiveHour * 1.35 * efficiencyFactor);
      deliverablePoints = 0;
      streakAndMilestonePoints = dailyTargetReached ? config.dailyMilestoneBonus : 0;
      break;
    }

    case 'milestone-streak': {
      timePoints = Math.round(totalActiveHours * (config.pointsPerActiveHour * 0.65));
      deliverablePoints = Math.round(rawDeliverables * 0.75);
      streakAndMilestonePoints =
        (dailyTargetReached ? config.dailyMilestoneBonus * 2 : 0) +
        record.streakDays * (config.streakBonusPerDay * 2);
      break;
    }

    case 'kpi-weighted': {
      timePoints = Math.round(totalActiveHours * (config.pointsPerActiveHour * 0.45));
      const focusMultiplier = efficiencyQualified ? 1.35 : 0.95;
      deliverablePoints = Math.round(rawDeliverables * focusMultiplier);
      streakAndMilestonePoints = record.streakDays * config.streakBonusPerDay;
      break;
    }
  }

  const manualBonusPoints = record.manualBonusPoints || 0;
  const grossPoints = Math.max(
    0,
    timePoints + deliverablePoints + streakAndMilestonePoints + manualBonusPoints
  );
  const redeemedPoints = record.redeemedPoints || 0;
  const availablePoints = Math.max(0, grossPoints - redeemedPoints);

  let tier: UserRewardBreakdown['tier'] = 'Bronze Starter';
  let nextTierPoints = 500;
  if (grossPoints >= 2500) {
    tier = 'Diamond Partner';
    nextTierPoints = 3500;
  } else if (grossPoints >= 1400) {
    tier = 'Gold Specialist';
    nextTierPoints = 2500;
  } else if (grossPoints >= 600) {
    tier = 'Silver Contributor';
    nextTierPoints = 1400;
  }

  return {
    efficiencyPct,
    efficiencyRatio: efficiencyPct,
    efficiencyQualified,
    timePoints,
    deliverablePoints,
    streakAndMilestonePoints,
    manualBonusPoints,
    grossPoints,
    totalEarnedPoints: grossPoints,
    redeemedPoints,
    availablePoints,
    todayTimePoints,
    todayTargetProgressPct,
    dailyGoalProgress: todayTargetProgressPct,
    dailyTargetReached,
    tier,
    tierBadge: tier,
    nextTierPoints
  };
}

export function canRedeemReward(
  availablePoints: number,
  item: RewardCatalogItem,
  config: RewardConfig = defaultRewardConfig
): { allowed: boolean; reason?: string } {
  if (!config.allowRedemptions) {
    return { allowed: false, reason: 'Redemptions are currently paused by the Super Administrator.' };
  }
  if (!item.available) {
    return { allowed: false, reason: 'This reward item is currently out of stock.' };
  }
  if (availablePoints < item.pointsCost) {
    return {
      allowed: false,
      reason: `Need ${item.pointsCost - availablePoints} more pts to redeem.`
    };
  }
  return { allowed: true };
}


