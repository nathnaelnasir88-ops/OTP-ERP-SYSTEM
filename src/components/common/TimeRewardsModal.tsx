import React, { useState } from 'react';
import {
  X,
  Clock,
  Award,
  Flame,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  Sparkles,
  ShieldCheck,
  Gift,
  TrendingUp,
  Sliders,
  Plus,
  Lock,
  Users,
  Check,
  XCircle,
  Zap,
  Target,
  Info
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import { RewardMethodId } from '../../types';
import {
  REWARD_METHOD_LIST,
  REWARD_METHODS,
  calculateUserRewardBreakdown,
  formatMinutesToHoursMins,
  defaultRewardConfig
} from '../../utils/timeRewards';

export const TimeRewardsModal: React.FC = () => {
  const {
    currentUser,
    rewardConfig,
    updateRewardConfig,
    userTimeRewards,
    rewardCatalog,
    rewardRedemptions,
    isTimeRewardsModalOpen,
    setIsTimeRewardsModalOpen,
    isSessionActive,
    toggleSessionPause,
    logWorkSession,
    redeemReward,
    updateRedemptionStatus,
    awardManualBonusPoints,
    addRewardCatalogItem,
    toggleRewardCatalogItem
  } = useERP();

  const { userProfile } = useAuth();
  const activeRole = userProfile?.role || currentUser.role || 'Super Administrator';
  const isSuperAdmin = activeRole === 'Super Administrator';
  const activeUserId = userProfile?.id || currentUser.id || 'usr-1';

  const [activeTab, setActiveTab] = useState<'my-rewards' | 'admin-engine' | 'leaderboard' | 'approvals'>('my-rewards');
  const [feedbackBanner, setFeedbackBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [workNote, setWorkNote] = useState('');
  const [bonusReason, setBonusReason] = useState('Outstanding sprint execution');
  const [newCatalogItem, setNewCatalogItem] = useState({
    title: '',
    description: '',
    pointsCost: 500,
    category: 'Voucher' as 'Cash Bonus' | 'Time Off' | 'Perks & Gear' | 'Voucher',
    monetaryValueETB: 1000,
    iconName: 'Gift'
  });

  if (!isTimeRewardsModalOpen) return null;

  const myRecord =
    userTimeRewards.find((r) => r.userId === activeUserId) ||
    userTimeRewards.find((r) => r.fullName.toLowerCase() === (userProfile?.fullName || currentUser.fullName).toLowerCase()) ||
    userTimeRewards[0];

  const myBreakdown = calculateUserRewardBreakdown(myRecord, rewardConfig);
  const activeMethodDef = REWARD_METHODS[rewardConfig.method] || REWARD_METHODS['hybrid-productivity'];
  const pendingRedemptionsCount = rewardRedemptions.filter((r) => r.status === 'Pending Approval').length;

  const showToast = (type: 'success' | 'error', text: string) => {
    setFeedbackBanner({ type, text });
    setTimeout(() => setFeedbackBanner(null), 4000);
  };

  const handleQuickLogWork = (minutes: number, defaultLabel: string) => {
    const label = workNote.trim() || defaultLabel;
    logWorkSession(myRecord.userId, minutes, label);
    setWorkNote('');
    showToast(
      'success',
      `Logged +${minutes}m focused work ("${label}"). Your active time and reward points have updated!`
    );
  };

  const handleRedeem = (rewardId: string) => {
    const result = redeemReward(myRecord.userId, rewardId);
    showToast(result.success ? 'success' : 'error', result.message);
  };

  const handleSelectMethod = (methodId: RewardMethodId) => {
    if (!isSuperAdmin) return;
    updateRewardConfig({ method: methodId });
    showToast(
      'success',
      `Switched ERP Rewards Method to "${REWARD_METHODS[methodId].name}". All employee point balances recalculated logically!`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#f5f6f8] rounded-[32px] shadow-2xl border border-white flex flex-col overflow-hidden text-[#1d1d1f]">
        {/* Top Modal Header */}
        <div className="bg-white px-6 py-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#1d1d1f] text-[#feb913] flex items-center justify-center shadow-sm shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#1d1d1f]">
                  Time Spent & Logical Rewards Studio
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#1ec94c]/15 text-[#15803d] flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${isSessionActive ? 'bg-[#1ec94c] animate-pulse' : 'bg-amber-500'}`} />
                  <span>{isSessionActive ? 'Live Tracking Active' : 'Timer Paused'}</span>
                </span>
              </div>
              <p className="text-xs text-[#86868b] mt-0.5">
                Active Method: <strong className="text-[#1d1d1f]">{activeMethodDef.name}</strong> · Anti-Idle Cap: {rewardConfig.idleTimeoutMinutes}m
              </p>
            </div>
          </div>

          {/* Navigation Pills inside Modal */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab('my-rewards')}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'my-rewards'
                  ? 'bg-[#1d1d1f] text-white shadow-xs'
                  : 'bg-[#ebedf0] hover:bg-[#dfe2e7] text-[#1d1d1f]'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>My Time & Rewards</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('leaderboard')}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'leaderboard'
                  ? 'bg-[#1d1d1f] text-white shadow-xs'
                  : 'bg-[#ebedf0] hover:bg-[#dfe2e7] text-[#1d1d1f]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Team Leaderboard</span>
            </button>

            {isSuperAdmin && (
              <>
                <button
                  type="button"
                  onClick={() => setActiveTab('admin-engine')}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'admin-engine'
                      ? 'bg-[#1d7dfa] text-white shadow-xs'
                      : 'bg-[#1d7dfa]/10 hover:bg-[#1d7dfa]/20 text-[#1d7dfa]'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Admin Rewards Method</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('approvals')}
                  className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'approvals'
                      ? 'bg-[#1d1d1f] text-white shadow-xs'
                      : 'bg-[#ebedf0] hover:bg-[#dfe2e7] text-[#1d1d1f]'
                  }`}
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>Redemptions</span>
                  {pendingRedemptionsCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#f73b9b] text-white font-bold">
                      {pendingRedemptionsCount}
                    </span>
                  )}
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setIsTimeRewardsModalOpen(false)}
              className="w-9 h-9 rounded-full bg-[#ebedf0] hover:bg-[#dfe2e7] flex items-center justify-center text-[#1d1d1f] ml-1 cursor-pointer"
              aria-label="Close Time & Rewards Studio"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feedback Toast Banner */}
        {feedbackBanner && (
          <div
            className={`px-6 py-2.5 text-xs font-semibold flex items-center justify-between ${
              feedbackBanner.type === 'success'
                ? 'bg-[#1ec94c] text-white'
                : 'bg-rose-600 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{feedbackBanner.text}</span>
            </div>
            <button onClick={() => setFeedbackBanner(null)} className="text-white/80 hover:text-white">
              ✕
            </button>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* ===================================================================
              TAB 1: MY TIME & REWARDS (ALL USERS)
              =================================================================== */}
          {activeTab === 'my-rewards' && (
            <>
              {/* Top 4 Bento Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: Available Reward Points */}
                <div className="bg-[#1d1d1f] text-white rounded-[24px] p-5 flex flex-col justify-between shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-medium">Available Reward Points</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#feb913] text-black">
                      {myBreakdown.tierBadge} Tier
                    </span>
                  </div>
                  <div className="my-3">
                    <div className="text-3xl font-bold tracking-tight text-[#feb913] flex items-baseline gap-1.5">
                      <span>{myBreakdown.availablePoints.toLocaleString()}</span>
                      <span className="text-xs font-semibold text-slate-300">pts</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Lifetime Earned: {myBreakdown.totalEarnedPoints.toLocaleString()} pts · Redeemed: {myRecord.redeemedPoints} pts
                    </div>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                    <span>Next Tier Target</span>
                    <span className="font-semibold text-[#1ec94c]">{myBreakdown.nextTierPoints.toLocaleString()} pts</span>
                  </div>
                </div>

                {/* Card 2: Today's Active & Pause Time */}
                <div className="bg-white rounded-[24px] p-5 flex flex-col justify-between shadow-2xs border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#86868b] font-medium">Today's Engaged Time</span>
                    <button
                      type="button"
                      onClick={toggleSessionPause}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                        isSessionActive
                          ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                    >
                      {isSessionActive ? (
                        <>
                          <PauseCircle className="w-3 h-3" />
                          <span>Pause</span>
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-3 h-3" />
                          <span>Resume</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="my-3">
                    <div className="text-3xl font-semibold tracking-tight text-[#1d1d1f]">
                      {formatMinutesToHoursMins(myRecord.todayActiveMinutes)}
                    </div>
                    <div className="text-[11px] text-[#86868b] mt-1 flex items-center gap-2">
                      <span>Pause / Idle: {formatMinutesToHoursMins(myRecord.todayPauseMinutes)}</span>
                      <span>·</span>
                      <span className="text-[#1ec94c] font-semibold">
                        {myBreakdown.dailyGoalProgress}% of {formatMinutesToHoursMins(rewardConfig.dailyTargetMinutes)} goal
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#1ec94c] transition-all duration-300"
                      style={{ width: `${myBreakdown.dailyGoalProgress}%` }}
                    />
                  </div>
                </div>

                {/* Card 3: Cumulative Active Time vs Pause Time (Cognify Reference Metrics) */}
                <div className="bg-white rounded-[24px] p-5 flex flex-col justify-between shadow-2xs border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#86868b] font-medium">Total Active vs Pause</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1d7dfa]/10 text-[#1d7dfa]">
                      {myBreakdown.efficiencyRatio}% Focus
                    </span>
                  </div>

                  <div className="my-3">
                    <div className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">
                      {formatMinutesToHoursMins(myRecord.totalActiveMinutes)}
                    </div>
                    <div className="text-[11px] text-[#86868b] mt-1">
                      Total Pause Time: <strong className="text-[#f73b9b]">{formatMinutesToHoursMins(myRecord.totalPauseMinutes)}</strong>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-[#86868b]">Min Efficiency Required</span>
                    <span className="font-semibold text-[#1d1d1f]">{rewardConfig.minEfficiencyThreshold}%</span>
                  </div>
                </div>

                {/* Card 4: Verified Output & Focus Streak */}
                <div className="bg-white rounded-[24px] p-5 flex flex-col justify-between shadow-2xs border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#86868b] font-medium">Verified Work Output</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-600 flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      <span>{myRecord.streakDays}d Streak</span>
                    </span>
                  </div>

                  <div className="my-3 grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-2xl bg-[#f8f9fb]">
                      <div className="text-lg font-bold text-[#1d1d1f]">{myRecord.tasksCompletedCount}</div>
                      <div className="text-[10px] text-[#86868b]">Tasks Done</div>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-[#f8f9fb]">
                      <div className="text-lg font-bold text-[#1d7dfa]">{myRecord.deliverablesApprovedCount}</div>
                      <div className="text-[10px] text-[#86868b]">Approved Assets</div>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#86868b] flex items-center justify-between">
                    <span>Output Bonus</span>
                    <span className="font-bold text-[#1ec94c]">+{myBreakdown.deliverablePoints} pts</span>
                  </div>
                </div>
              </div>

              {/* Logical Formula Breakdown & Log Focused Work Session */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Left 2 Cols: How Your Points Are Calculated Under Current Admin Method */}
                <div className="lg:col-span-2 bg-white rounded-[24px] p-5 border border-slate-100 shadow-2xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#1d7dfa]" />
                        <h3 className="text-sm font-bold text-[#1d1d1f]">
                          Active Admin Calculation Method: {activeMethodDef.name}
                        </h3>
                      </div>
                      <p className="text-xs text-[#86868b] mt-0.5">{activeMethodDef.whyLogical}</p>
                    </div>
                    {isSuperAdmin ? (
                      <button
                        type="button"
                        onClick={() => setActiveTab('admin-engine')}
                        className="px-3 py-1.5 rounded-full bg-[#1d7dfa]/10 text-[#1d7dfa] hover:bg-[#1d7dfa]/20 text-xs font-semibold cursor-pointer"
                      >
                        Change Method (Admin) →
                      </button>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Set by Super Admin
                      </span>
                    )}
                  </div>

                  {/* Mathematical Formula Pill */}
                  <div className="p-3 rounded-2xl bg-[#f8f9fb] border border-slate-200/60 font-mono text-xs text-[#1d1d1f] flex items-center justify-between">
                    <span>Formula: {activeMethodDef.formulaSummary}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-slate-200 font-sans font-bold text-[#1ec94c]">
                      Logical Anti-Idle Verified
                    </span>
                  </div>

                  {/* 4-Part Points Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-2xl bg-[#f8f9fb]">
                      <div className="text-[11px] text-[#86868b]">Engaged Time Points</div>
                      <div className="text-base font-bold text-[#1d1d1f] mt-1">+{myBreakdown.timePoints} pts</div>
                      <div className="text-[10px] text-[#86868b] mt-0.5">
                        {rewardConfig.pointsPerActiveHour} pts / active hr
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#f8f9fb]">
                      <div className="text-[11px] text-[#86868b]">Deliverable Points</div>
                      <div className="text-base font-bold text-[#1d7dfa] mt-1">+{myBreakdown.deliverablePoints} pts</div>
                      <div className="text-[10px] text-[#86868b] mt-0.5">
                        {rewardConfig.pointsPerCompletedTask}p/task · {rewardConfig.pointsPerApprovedContent}p/asset
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#f8f9fb]">
                      <div className="text-[11px] text-[#86868b]">Streak & Goal Bonus</div>
                      <div className="text-base font-bold text-[#1ec94c] mt-1">+{myBreakdown.streakAndMilestonePoints} pts</div>
                      <div className="text-[10px] text-[#86868b] mt-0.5">
                        +{rewardConfig.dailyMilestoneBonus}p at {formatMinutesToHoursMins(rewardConfig.dailyTargetMinutes)}
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#f8f9fb]">
                      <div className="text-[11px] text-[#86868b]">Admin Bonus / Redeemed</div>
                      <div className="text-base font-bold text-amber-600 mt-1">
                        +{myRecord.manualBonusPoints} / -{myRecord.redeemedPoints}
                      </div>
                      <div className="text-[10px] text-[#86868b] mt-0.5">Net adjustments</div>
                    </div>
                  </div>
                </div>

                {/* Right Col: Log Focused Work Block (Interactive) */}
                <div className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-2xs flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-[#feb913]" />
                        <span>Log Focused Work Session</span>
                      </h3>
                      <span className="text-[10px] font-semibold text-[#1ec94c]">Instant Points</span>
                    </div>
                    <p className="text-xs text-[#86868b] mt-1">
                      Record a verified deep-work sprint to credit your active time and earn points under the active formula.
                    </p>

                    <div className="mt-3">
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Session Deliverable / Sprint Note
                      </label>
                      <input
                        type="text"
                        value={workNote}
                        onChange={(e) => setWorkNote(e.target.value)}
                        placeholder="e.g. Telebirr Campaign Creative & Ad Copy"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:border-[#1d1d1f]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickLogWork(30, '30m Focused Task Sprint')}
                        className="py-2.5 px-2 rounded-xl bg-[#f4f5f7] hover:bg-[#e5e7ec] text-xs font-bold text-[#1d1d1f] transition-colors cursor-pointer"
                      >
                        +30m Focus
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickLogWork(60, '1h Deep Work Session')}
                        className="py-2.5 px-2 rounded-xl bg-[#1d1d1f] hover:bg-slate-800 text-xs font-bold text-white transition-colors cursor-pointer"
                      >
                        +1h Deep Work
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickLogWork(120, '2h Production Block')}
                        className="py-2.5 px-2 rounded-xl bg-[#1ec94c] hover:bg-[#19b342] text-xs font-bold text-white transition-colors cursor-pointer"
                      >
                        +2h Sprint
                      </button>
                    </div>
                    <p className="text-[10px] text-[#86868b] text-center">
                      Daily time points capped at {rewardConfig.dailyMaxTimePoints} pts/day to prevent idle tab gaming.
                    </p>
                  </div>
                </div>
              </div>

              {/* Corporate Rewards Catalog Grid */}
              <div className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-2xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                      <Gift className="w-4 h-4 text-[#f73b9b]" />
                      <span>Redeem Points — Corporate Rewards Catalog</span>
                    </h3>
                    <p className="text-xs text-[#86868b]">
                      Use your earned reward points for agency cash bonuses, paid time off, and executive perks.
                    </p>
                  </div>
                  <div className="px-3.5 py-1.5 rounded-full bg-[#1d1d1f] text-[#feb913] text-xs font-bold">
                    Your Balance: {myBreakdown.availablePoints.toLocaleString()} pts
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rewardCatalog.filter((item) => item.available || isSuperAdmin).map((item) => {
                    const affordable = myBreakdown.availablePoints >= item.pointsCost && item.available;
                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                          affordable
                            ? 'border-slate-200 bg-[#f8f9fb] hover:border-[#1d1d1f]'
                            : 'border-slate-100 bg-slate-50/60 opacity-75'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white border border-slate-200 text-slate-700">
                              {item.category}
                            </span>
                            <span className="text-xs font-bold text-[#1d7dfa]">
                              {(item.monetaryValueETB || 0).toLocaleString()} ETB Value
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-[#1d1d1f]">{item.title}</h4>
                          <p className="text-[11px] text-[#86868b] mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-slate-200/70 flex items-center justify-between">
                          <div>
                            <span className="text-sm font-bold text-[#1d1d1f]">
                              {item.pointsCost.toLocaleString()} pts
                            </span>
                          </div>
                          <button
                            type="button"
                            disabled={!affordable}
                            onClick={() => handleRedeem(item.id)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                              affordable
                                ? 'bg-[#1d1d1f] hover:bg-[#1ec94c] text-white cursor-pointer shadow-2xs'
                                : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                            }`}
                          >
                            {affordable
                              ? 'Redeem Reward'
                              : `Need ${item.pointsCost - myBreakdown.availablePoints} more pts`}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* ===================================================================
              TAB 2: ADMIN REWARDS METHOD & ENGINE CONTROL (SUPER ADMIN ONLY)
              =================================================================== */}
          {activeTab === 'admin-engine' && (
            <div className="space-y-6">
              {!isSuperAdmin ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center space-y-2">
                  <Lock className="w-8 h-8 text-amber-600 mx-auto" />
                  <h3 className="text-sm font-bold text-amber-900">Super Administrator Authority Required</h3>
                  <p className="text-xs text-amber-800 max-w-md mx-auto">
                    Only the Super Administrator can decide and configure the agency's logical rewards calculation method and point conversion rates.
                  </p>
                </div>
              ) : (
                <>
                  {/* Step 1: Choose Logical Rewards Calculation Method */}
                  <div className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-2xs space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-[#1d7dfa]" />
                          <h3 className="text-sm font-bold text-[#1d1d1f]">
                            1. Decide the Logical Rewards Calculation Method (Super Admin)
                          </h3>
                        </div>
                        <p className="text-xs text-[#86868b] mt-0.5">
                          Select how employee time spent and work deliverables convert into reward points across Open Technology PLC.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          updateRewardConfig(defaultRewardConfig);
                          showToast('success', 'Reset reward engine rules to recommended logical defaults.');
                        }}
                        className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
                      >
                        Reset Logical Defaults
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {REWARD_METHOD_LIST.map((m) => {
                        const isSelected = rewardConfig.method === m.id;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => handleSelectMethod(m.id)}
                            className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'border-[#1d1d1f] bg-[#1d1d1f] text-white shadow-md'
                                : 'border-slate-200 bg-[#f8f9fb] hover:border-slate-300 text-[#1d1d1f]'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                    isSelected
                                      ? 'bg-[#feb913] text-black'
                                      : 'bg-white border border-slate-200 text-slate-700'
                                  }`}
                                >
                                  {m.badge}
                                </span>
                                {isSelected && (
                                  <span className="text-[11px] font-bold text-[#1ec94c] flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Active Method
                                  </span>
                                )}
                              </div>

                              <h4 className="text-sm font-bold">{m.name}</h4>
                              <p
                                className={`text-xs mt-1 leading-relaxed ${
                                  isSelected ? 'text-slate-300' : 'text-[#86868b]'
                                }`}
                              >
                                {m.description}
                              </p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-200/20 space-y-1.5">
                              <div
                                className={`text-[11px] font-mono px-2.5 py-1.5 rounded-xl ${
                                  isSelected ? 'bg-white/10 text-[#feb913]' : 'bg-white text-slate-800 border border-slate-200/70'
                                }`}
                              >
                                {m.formulaSummary}
                              </div>
                              <div
                                className={`text-[10px] flex items-start gap-1.5 ${
                                  isSelected ? 'text-slate-300' : 'text-slate-600'
                                }`}
                              >
                                <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#1ec94c]" />
                                <span>
                                  <strong>Why Logical:</strong> {m.whyLogical}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2: Fine-Tune Logical Rates, Anti-Idle Thresholds & Caps */}
                  <div className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-2xs space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-[#1ec94c]" />
                        <span>2. Configure Logical Rates, Anti-Idle Cap & Focus Thresholds</span>
                      </h3>
                      <p className="text-xs text-[#86868b] mt-0.5">
                        Prevent idle time abuse by enforcing daily time point caps, idle pause detection, and deliverable weights.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                      <div className="p-3.5 rounded-2xl bg-[#f8f9fb] border border-slate-200/60">
                        <label className="block font-bold text-[#1d1d1f] mb-1">
                          Points per Active Hour
                        </label>
                        <input
                          type="number"
                          min={5}
                          max={200}
                          value={rewardConfig.pointsPerActiveHour}
                          onChange={(e) =>
                            updateRewardConfig({ pointsPerActiveHour: Math.max(5, Number(e.target.value)) })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-sm"
                        />
                        <span className="text-[10px] text-[#86868b] mt-1 block">
                          Base rate for verified active ERP hours
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#f8f9fb] border border-slate-200/60">
                        <label className="block font-bold text-[#1d1d1f] mb-1">
                          Points per Completed Task
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={500}
                          value={rewardConfig.pointsPerCompletedTask}
                          onChange={(e) =>
                            updateRewardConfig({ pointsPerCompletedTask: Math.max(0, Number(e.target.value)) })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-sm"
                        />
                        <span className="text-[10px] text-[#86868b] mt-1 block">
                          Awarded automatically when task is Done
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#f8f9fb] border border-slate-200/60">
                        <label className="block font-bold text-[#1d1d1f] mb-1">
                          Points per Approved Asset
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={500}
                          value={rewardConfig.pointsPerApprovedContent}
                          onChange={(e) =>
                            updateRewardConfig({ pointsPerApprovedContent: Math.max(0, Number(e.target.value)) })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-sm"
                        />
                        <span className="text-[10px] text-[#86868b] mt-1 block">
                          Awarded when SMM deliverable is published
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#f8f9fb] border border-slate-200/60">
                        <label className="block font-bold text-[#1d1d1f] mb-1">
                          Daily Focus Target (Minutes)
                        </label>
                        <input
                          type="number"
                          min={60}
                          max={600}
                          step={30}
                          value={rewardConfig.dailyTargetMinutes}
                          onChange={(e) =>
                            updateRewardConfig({ dailyTargetMinutes: Math.max(60, Number(e.target.value)) })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-sm"
                        />
                        <span className="text-[10px] text-[#86868b] mt-1 block">
                          Currently {formatMinutesToHoursMins(rewardConfig.dailyTargetMinutes)} / day
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#f8f9fb] border border-slate-200/60">
                        <label className="block font-bold text-[#1d1d1f] mb-1">
                          Daily Target Milestone Bonus
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={500}
                          value={rewardConfig.dailyMilestoneBonus}
                          onChange={(e) =>
                            updateRewardConfig({ dailyMilestoneBonus: Math.max(0, Number(e.target.value)) })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-sm"
                        />
                        <span className="text-[10px] text-[#86868b] mt-1 block">
                          Extra points when daily target is hit
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#f8f9fb] border border-slate-200/60">
                        <label className="block font-bold text-[#1d1d1f] mb-1">
                          Anti-Idle Timeout (Minutes)
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={60}
                          value={rewardConfig.idleTimeoutMinutes}
                          onChange={(e) =>
                            updateRewardConfig({ idleTimeoutMinutes: Math.max(1, Number(e.target.value)) })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-sm"
                        />
                        <span className="text-[10px] text-[#86868b] mt-1 block">
                          Switches to Pause Time if inactive
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#f8f9fb] border border-slate-200/60">
                        <label className="block font-bold text-[#1d1d1f] mb-1">
                          Daily Max Time Points Cap
                        </label>
                        <input
                          type="number"
                          min={50}
                          max={2000}
                          value={rewardConfig.dailyMaxTimePoints}
                          onChange={(e) =>
                            updateRewardConfig({ dailyMaxTimePoints: Math.max(50, Number(e.target.value)) })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-sm"
                        />
                        <span className="text-[10px] text-[#86868b] mt-1 block">
                          Prevents leaving browser open overnight
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-[#f8f9fb] border border-slate-200/60">
                        <label className="block font-bold text-[#1d1d1f] mb-1">
                          Min Focus Efficiency (%)
                        </label>
                        <input
                          type="number"
                          min={50}
                          max={98}
                          value={rewardConfig.minEfficiencyThreshold}
                          onChange={(e) =>
                            updateRewardConfig({ minEfficiencyThreshold: Math.min(98, Math.max(50, Number(e.target.value))) })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 font-bold text-sm"
                        />
                        <span className="text-[10px] text-[#86868b] mt-1 block">
                          Active / (Active + Pause) threshold
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ===================================================================
              TAB 3: EMPLOYEE TIME & POINTS LEADERBOARD
              =================================================================== */}
          {activeTab === 'leaderboard' && (
            <div className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-[#1d1d1f] flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#1ec94c]" />
                    <span>Agency Time Spent & Logical Points Leaderboard</span>
                  </h3>
                  <p className="text-xs text-[#86868b] mt-0.5">
                    Live rankings calculated using <strong className="text-[#1d1d1f]">{activeMethodDef.name}</strong> ({activeMethodDef.formulaSummary})
                  </p>
                </div>

                {isSuperAdmin && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 font-medium">Bonus Reason:</span>
                    <input
                      type="text"
                      value={bonusReason}
                      onChange={(e) => setBonusReason(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs w-48"
                      placeholder="Bonus reason..."
                    />
                  </div>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f8f9fb] border-b border-slate-200 text-[#86868b] uppercase text-[10px] tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Rank & Member</th>
                      <th className="py-3 px-4">Today Active</th>
                      <th className="py-3 px-4">Total Active / Pause</th>
                      <th className="py-3 px-4">Efficiency</th>
                      <th className="py-3 px-4">Output (Tasks / SMM)</th>
                      <th className="py-3 px-4">Tier</th>
                      <th className="py-3 px-4">Available Points</th>
                      {isSuperAdmin && <th className="py-3 px-4 text-right">Admin Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[...userTimeRewards]
                      .map((rec) => ({
                        rec,
                        breakdown: calculateUserRewardBreakdown(rec, rewardConfig)
                      }))
                      .sort((a, b) => b.breakdown.availablePoints - a.breakdown.availablePoints)
                      .map(({ rec, breakdown }, idx) => (
                        <tr key={rec.userId} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <span
                                className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center ${
                                  idx === 0
                                    ? 'bg-[#feb913] text-black'
                                    : idx === 1
                                    ? 'bg-slate-200 text-slate-800'
                                    : idx === 2
                                    ? 'bg-amber-700/20 text-amber-800'
                                    : 'bg-slate-100 text-slate-500'
                                }`}
                              >
                                {idx + 1}
                              </span>
                              <img
                                src={rec.avatarUrl}
                                alt={rec.fullName}
                                className="w-8 h-8 rounded-full object-cover border border-slate-200"
                              />
                              <div>
                                <div className="font-bold text-[#1d1d1f]">{rec.fullName}</div>
                                <div className="text-[10px] text-[#86868b]">{rec.role}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-[#1d1d1f]">
                            {formatMinutesToHoursMins(rec.todayActiveMinutes)}
                            <div className="text-[10px] text-[#1ec94c] font-normal">
                              {breakdown.dailyGoalProgress}% of daily goal
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-[#1d1d1f]">
                              {formatMinutesToHoursMins(rec.totalActiveMinutes)}
                            </div>
                            <div className="text-[10px] text-[#f73b9b]">
                              Pause: {formatMinutesToHoursMins(rec.totalPauseMinutes)}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                breakdown.efficiencyRatio >= rewardConfig.minEfficiencyThreshold
                                  ? 'bg-[#1ec94c]/15 text-[#15803d]'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {breakdown.efficiencyRatio}% Focus
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-700">
                            <span className="font-bold">{rec.tasksCompletedCount}</span> tasks ·{' '}
                            <span className="font-bold text-[#1d7dfa]">{rec.deliverablesApprovedCount}</span> assets
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ebedf0] text-[#1d1d1f]">
                              {breakdown.tierBadge}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="text-sm font-bold text-[#1d1d1f]">
                              {breakdown.availablePoints.toLocaleString()} pts
                            </div>
                            <div className="text-[10px] text-[#86868b]">
                              Time: {breakdown.timePoints} · Output: {breakdown.deliverablePoints}
                            </div>
                          </td>
                          {isSuperAdmin && (
                            <td className="py-3.5 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  awardManualBonusPoints(rec.userId, 100, bonusReason || 'Admin Performance Bonus');
                                  showToast('success', `Awarded +100 bonus points to ${rec.fullName}!`);
                                }}
                                className="px-3 py-1.5 rounded-full bg-[#1d1d1f] hover:bg-[#1ec94c] text-white text-[11px] font-bold transition-colors cursor-pointer"
                              >
                                +100 Bonus
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================================================================
              TAB 4: REDEMPTION APPROVALS & CATALOG MANAGER (SUPER ADMIN)
              =================================================================== */}
          {activeTab === 'approvals' && isSuperAdmin && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Employee Redemption Requests */}
              <div className="lg:col-span-2 bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-2xs space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-[#1d1d1f]">Employee Reward Redemptions Queue</h3>
                  <p className="text-xs text-[#86868b]">
                    Approve, fulfill, or reject point redemptions (rejecting automatically refunds points to the user).
                  </p>
                </div>

                <div className="space-y-3">
                  {rewardRedemptions.map((red) => (
                    <div
                      key={red.id}
                      className="p-4 rounded-2xl bg-[#f8f9fb] border border-slate-200/60 flex flex-wrap items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#1d1d1f]">{red.rewardTitle}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              red.status === 'Fulfilled' || red.status === 'Approved'
                                ? 'bg-[#1ec94c]/15 text-[#15803d]'
                                : red.status === 'Rejected'
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {red.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#86868b] mt-1">
                          Requested by <strong className="text-[#1d1d1f]">{red.userName}</strong> ({red.userRole}) ·{' '}
                          <strong className="text-[#1d7dfa]">{red.pointsSpent} pts</strong> ({(red.monetaryValueETB || 0).toLocaleString()} ETB) · {red.requestedAt}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {red.status === 'Pending Approval' && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                updateRedemptionStatus(red.id, 'Fulfilled');
                                showToast('success', `Fulfilled "${red.rewardTitle}" for ${red.userName}.`);
                              }}
                              className="px-3 py-1.5 rounded-full bg-[#1ec94c] hover:bg-[#19b342] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve & Fulfill</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                updateRedemptionStatus(red.id, 'Rejected');
                                showToast('error', `Rejected request and refunded ${red.pointsSpent} pts to ${red.userName}.`);
                              }}
                              className="px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject & Refund</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Col: Add New Corporate Reward to Catalog */}
              <div className="bg-white rounded-[24px] p-6 border border-slate-200/80 shadow-2xs space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-[#1d1d1f]">Add Custom Reward Item</h3>
                  <p className="text-xs text-[#86868b]">Create new incentives in the employee catalog.</p>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newCatalogItem.title.trim()) return;
                    addRewardCatalogItem({
                      ...newCatalogItem,
                      available: true
                    });
                    setNewCatalogItem({
                      title: '',
                      description: '',
                      pointsCost: 500,
                      category: 'Voucher',
                      monetaryValueETB: 1000,
                      iconName: 'Gift'
                    });
                    showToast('success', 'Added new reward item to the corporate catalog!');
                  }}
                  className="space-y-3 text-xs"
                >
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Reward Title</label>
                    <input
                      type="text"
                      required
                      value={newCatalogItem.title}
                      onChange={(e) => setNewCatalogItem({ ...newCatalogItem, title: e.target.value })}
                      placeholder="e.g. Weekend Resort Retreat Pass"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category</label>
                    <select
                      value={newCatalogItem.category}
                      onChange={(e) =>
                        setNewCatalogItem({ ...newCatalogItem, category: e.target.value as any })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="Cash Bonus">Cash Bonus</option>
                      <option value="Time Off">Time Off</option>
                      <option value="Voucher">Voucher</option>
                      <option value="Perks & Gear">Perks & Gear</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Points Cost</label>
                      <input
                        type="number"
                        min={50}
                        required
                        value={newCatalogItem.pointsCost}
                        onChange={(e) =>
                          setNewCatalogItem({ ...newCatalogItem, pointsCost: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">ETB Value</label>
                      <input
                        type="number"
                        min={100}
                        required
                        value={newCatalogItem.monetaryValueETB}
                        onChange={(e) =>
                          setNewCatalogItem({ ...newCatalogItem, monetaryValueETB: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={newCatalogItem.description}
                      onChange={(e) => setNewCatalogItem({ ...newCatalogItem, description: e.target.value })}
                      placeholder="Explain how the reward is fulfilled..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#1d1d1f] hover:bg-slate-800 text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Rewards Catalog</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
