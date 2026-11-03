import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatMinutesToHoursMins,
  calculateEfficiencyRatio,
  calculateUserRewardBreakdown,
  canRedeemReward,
  defaultRewardConfig,
  initialRewardCatalog
} from './timeRewards';
import { UserTimeRewardRecord } from '../types';

const sampleRecord: UserTimeRewardRecord = {
  userId: 'usr-1',
  username: 'admin',
  fullName: 'Nathnael Nasir',
  role: 'Super Administrator',
  department: 'Management',
  todayActiveMinutes: 270, // 4h 30m (meets 240m daily target)
  todayPauseMinutes: 25,
  weeklyActiveMinutes: 1320, // 22h
  totalActiveMinutes: 3600, // 60h active
  totalPauseMinutes: 360, // 6h pause (~91% efficiency)
  tasksCompletedCount: 12,
  deliverablesApprovedCount: 8,
  streakDays: 5,
  manualBonusPoints: 50,
  redeemedPoints: 100,
  lastActiveTimestamp: '2026-11-02T10:00:00Z',
  dailyHistory: [
    { day: 'Mon', activeMinutes: 250, pauseMinutes: 20, pointsEarned: 110 },
    { day: 'Tue', activeMinutes: 280, pauseMinutes: 30, pointsEarned: 125 },
    { day: 'Wed', activeMinutes: 270, pauseMinutes: 25, pointsEarned: 120 }
  ]
};

test('formatMinutesToHoursMins formats minutes into Xh YYm accurately', () => {
  assert.equal(formatMinutesToHoursMins(0), '0h 00m');
  assert.equal(formatMinutesToHoursMins(145), '2h 25m');
  assert.equal(formatMinutesToHoursMins(7618), '126h 58m');
});

test('calculateEfficiencyRatio computes active vs total time percentage', () => {
  assert.equal(calculateEfficiencyRatio(90, 10), 90);
  assert.equal(calculateEfficiencyRatio(0, 0), 100);
  assert.equal(calculateEfficiencyRatio(50, 50), 50);
});

test('calculateUserRewardBreakdown computes distinct logical scores across all 4 Admin Reward Methods', () => {
  const hybrid = calculateUserRewardBreakdown(sampleRecord, {
    ...defaultRewardConfig,
    method: 'hybrid-productivity'
  });
  const pureTime = calculateUserRewardBreakdown(sampleRecord, {
    ...defaultRewardConfig,
    method: 'time-based'
  });
  const milestone = calculateUserRewardBreakdown(sampleRecord, {
    ...defaultRewardConfig,
    method: 'milestone-streak'
  });
  const kpiWeighted = calculateUserRewardBreakdown(sampleRecord, {
    ...defaultRewardConfig,
    method: 'kpi-weighted'
  });

  // Hybrid includes both timePoints (60h * 20 = 1200) and deliverablePoints (12*25 + 8*15 = 420)
  assert.equal(hybrid.timePoints, 1200);
  assert.equal(hybrid.deliverablePoints, 420);
  assert.equal(hybrid.efficiencyQualified, true);
  assert.equal(hybrid.dailyTargetReached, true);

  // Pure time-based sets deliverablePoints to 0 and weights active hours higher
  assert.equal(pureTime.deliverablePoints, 0);
  assert.ok(pureTime.timePoints > hybrid.timePoints);

  // Milestone-streak rewards higher streakAndMilestonePoints than hybrid
  assert.ok(milestone.streakAndMilestonePoints > hybrid.streakAndMilestonePoints);

  // KPI-weighted applies 1.35x focus multiplier to deliverablePoints when efficiencyQualified is true
  assert.equal(kpiWeighted.deliverablePoints, Math.round(420 * 1.35));

  // Available points properly deducts redeemedPoints
  assert.equal(hybrid.availablePoints, hybrid.grossPoints - 100);
});

test('Low efficiency ratio penalizes time points in hybrid-productivity to prevent idle farming', () => {
  const idleRecord: UserTimeRewardRecord = {
    ...sampleRecord,
    totalActiveMinutes: 1200, // 20h
    totalPauseMinutes: 1800 // 30h pause -> 40% efficiency (< 70% threshold)
  };

  const breakdown = calculateUserRewardBreakdown(idleRecord, defaultRewardConfig);
  assert.equal(breakdown.efficiencyQualified, false);
  // 20h * 20pts * 0.75 penalty factor = 300
  assert.equal(breakdown.timePoints, 300);
});

test('canRedeemReward validates point balance, availability, and admin toggle', () => {
  const cashReward = initialRewardCatalog[0]; // 600 pts
  assert.deepEqual(canRedeemReward(750, cashReward, defaultRewardConfig), { allowed: true });
  assert.equal(canRedeemReward(400, cashReward, defaultRewardConfig).allowed, false);
  assert.equal(
    canRedeemReward(900, cashReward, { ...defaultRewardConfig, allowRedemptions: false }).allowed,
    false
  );
});
