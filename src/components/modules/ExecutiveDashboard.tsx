import React, { useState } from 'react';
import {
  Users,
  Briefcase,
  ArrowUpRight,
  ArrowRight,
  Plus,
  Calendar,
  ChevronDown,
  Infinity as InfinityIcon,
  CheckCircle2,
  ShieldAlert,
  Share2,
  ListTodo,
  Layers,
  Sparkles,
  Wallet
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine
} from 'recharts';
import { useERP } from '../../context/ERPContext';
import {
  calculateFinancialBalances,
  calculateReceivablesAndPayables,
  calculateSMMMetrics,
  calculateProjectProgress
} from '../../utils/calculations';

export const ExecutiveDashboard: React.FC = () => {
  const {
    clients,
    projects,
    tasks,
    transactions,
    invoices,
    contentAssets,
    adCampaigns,
    employees,
    purchaseOrders,
    setCurrentModule,
    settings
  } = useERP();

  const [statusMode, setStatusMode] = useState<'count' | 'percent'>('count');
  const [selectedDay, setSelectedDay] = useState<string>('Wed');
  const [trendPeriod, setTrendPeriod] = useState<'Daily' | 'Monthly'>('Daily');

  // DERIVED METRICS
  const activeClientsCount = clients.filter((c) => c.status === 'Active').length;
  const financialBalances = calculateFinancialBalances(
    transactions,
    settings.blackCashInitialBalance,
    settings.whiteBankInitialBalance
  );
  const { accountsReceivable } = calculateReceivablesAndPayables(invoices);
  const smmMetrics = calculateSMMMetrics(contentAssets, settings.annualSmmTarget);
  const projectMetrics = calculateProjectProgress(projects);
  const totalAdSpend = adCampaigns.reduce((acc, c) => acc + (c.actualSpend || 0), 0);

  // Average team productivity
  const avgTeamCapacity =
    employees.length > 0
      ? Math.round(employees.reduce((acc, e) => acc + (e.workloadCapacity || 0), 0) / employees.length)
      : 78;

  // Pending items for executive action
  const pendingPOs = purchaseOrders.filter((po) => po.status === 'Requested');
  const reviewContent = contentAssets.filter(
    (c) => c.approvalStatus === 'Pending' || c.productionStatus === 'Review'
  );

  // Productivity & Financial Wave Data (Smooth dual spline like Cognify)
  const waveChartData = [
    { day: 'Mon', revenueIndex: 70, spendIndex: 35, label: '1,420k ETB', spendLabel: '410k ETB' },
    { day: 'Tue', revenueIndex: 82, spendIndex: 48, label: '1,650k ETB', spendLabel: '460k ETB' },
    { day: 'Wed', revenueIndex: 92, spendIndex: 43, label: '2,185k ETB', spendLabel: '476k ETB' },
    { day: 'Thu', revenueIndex: 74, spendIndex: 58, label: '1,890k ETB', spendLabel: '520k ETB' },
    { day: 'Fri', revenueIndex: 86, spendIndex: 50, label: '2,040k ETB', spendLabel: '490k ETB' }
  ];

  // Project & Deliverable distribution for Center Ring Gauge
  const totalDeliverables = settings.annualSmmTarget || 1080;
  const completedCount = smmMetrics.totalPublished + tasks.filter((t) => t.status === 'Done').length;
  const inProgressCount = projects.filter((p) => p.status === 'Active').length + tasks.filter((t) => t.status === 'In Progress').length;
  const upcomingCount = reviewContent.length + projects.filter((p) => p.status === 'Planning' || p.status === 'In Review').length;

  const totalProjectsAndTasks = projects.length + tasks.length + contentAssets.length;
  const completedRatio = Math.round(((completedCount || 4) / Math.max(1, totalProjectsAndTasks)) * 100);
  const inProgressRatio = Math.round(((inProgressCount || 5) / Math.max(1, totalProjectsAndTasks)) * 100);
  const upcomingRatio = Math.max(10, 100 - completedRatio - inProgressRatio);

  return (
    <div className="space-y-6 pb-4">
      {/* =========================================================================
          TOP PAGE HEADER (Exact Cognify Title + Dark Pill Action Button)
          ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 pb-1">
        <div>
          <h1 className="text-2xl sm:text-[32px] font-normal tracking-tight text-[#1d1d1f] leading-tight">
            Project & Agency Management Overview
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentModule('smm')}
            className="px-4 py-2.5 rounded-full text-xs font-medium bg-white hover:bg-[#ebedf0] text-[#1d1d1f] border border-slate-200/80 transition-all shadow-2xs cursor-pointer"
          >
            SMM 1,080 Quota ({smmMetrics.totalPublished}/{totalDeliverables})
          </button>
          <button
            onClick={() => setCurrentModule('projects')}
            className="px-5 py-2.5 rounded-full text-xs font-medium bg-[#1d1d1f] hover:bg-[#323236] text-white flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New task</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          ROW 1: THREE SIGNATURE COGNIFY KPI BENTO CARDS
          ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* CARD 1: Active Projects (Vibrant Green Accent) */}
        <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.025)] flex flex-col justify-between min-h-[196px]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#1ec94c] ring-4 ring-[#1ec94c]/20 flex items-center justify-center text-white shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="text-sm font-medium text-[#1d1d1f] leading-snug">
                <div>Active</div>
                <div>Projects & Accounts</div>
              </div>
            </div>

            <button
              onClick={() => setCurrentModule('projects')}
              className="w-10 h-10 rounded-full bg-[#f4f5f7] hover:bg-[#e5e7ec] flex items-center justify-center text-[#1d1d1f] transition-colors cursor-pointer"
              title="Open Projects & Operations"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="my-4 flex items-baseline gap-2">
            <span className="text-4xl sm:text-[42px] font-normal tracking-tight text-[#1d1d1f] leading-none">
              {projectMetrics.activeCount}
            </span>
            <span className="text-xs font-semibold text-[#1ec94c] -translate-y-3 inline-flex items-center">
              ↑ 18%
            </span>
            <span className="text-xs text-slate-400 ml-1">
              ({activeClientsCount} active clients)
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-xs text-[#86868b]">
              <InfinityIcon className="w-4 h-4 text-slate-400" />
              <span>Dynamic of changes</span>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-[#f4f5f7] text-[#1d1d1f] text-xs font-medium">
              Monthly
            </span>
          </div>
        </div>

        {/* CARD 2: Total Tasks & SMM Deliverables (Vibrant Blue Accent) */}
        <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.025)] flex flex-col justify-between min-h-[196px]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#1d7dfa] ring-4 ring-[#1d7dfa]/20 flex items-center justify-center text-white shrink-0">
                <ListTodo className="w-5 h-5" />
              </div>
              <div className="text-sm font-medium text-[#1d1d1f] leading-snug">
                <div>Total</div>
                <div>SMM & Agency Tasks</div>
              </div>
            </div>

            <button
              onClick={() => setCurrentModule('smm')}
              className="w-10 h-10 rounded-full bg-[#f4f5f7] hover:bg-[#e5e7ec] flex items-center justify-center text-[#1d1d1f] transition-colors cursor-pointer"
              title="Open Social Media Hub"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="my-4 flex items-baseline gap-2">
            <span className="text-4xl sm:text-[42px] font-normal tracking-tight text-[#1d1d1f] leading-none">
              {totalDeliverables}
            </span>
            <span className="text-xs font-semibold text-[#1ec94c] -translate-y-3 inline-flex items-center">
              ↑ 23%
            </span>
            <span className="text-xs text-slate-400 ml-1">
              ({smmMetrics.totalPublished} published)
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2 text-xs text-[#86868b]">
              <InfinityIcon className="w-4 h-4 text-slate-400" />
              <span>Dynamic of changes</span>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-[#f4f5f7] text-[#1d1d1f] text-xs font-medium">
              Monthly
            </span>
          </div>
        </div>

        {/* CARD 3: Team Members & Customers (Vibrant Pink Accent) */}
        <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.025)] flex flex-col justify-between min-h-[196px]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-[#f73b9b] ring-4 ring-[#f73b9b]/20 flex items-center justify-center text-white shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div className="text-sm font-medium text-[#1d1d1f] leading-snug">
                <div>Team</div>
                <div>Members & Clients</div>
              </div>
            </div>

            <button
              onClick={() => setCurrentModule('hr')}
              className="w-10 h-10 rounded-full bg-[#f4f5f7] hover:bg-[#e5e7ec] flex items-center justify-center text-[#1d1d1f] transition-colors cursor-pointer"
              title="Open HR & Team Directory"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="my-4 flex items-baseline gap-2">
            <span className="text-4xl sm:text-[42px] font-normal tracking-tight text-[#1d1d1f] leading-none">
              {employees.length + clients.length}
            </span>
            <span className="text-xs text-slate-400 ml-1">
              ({employees.length} staff · {clients.length} clients)
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setCurrentModule('crm')}
              className="text-xs text-[#86868b] hover:text-[#1d1d1f] transition-colors cursor-pointer"
            >
              Manage Customers
            </button>

            <div className="flex items-center">
              <button
                onClick={() => setCurrentModule('hr')}
                className="w-8 h-8 rounded-full bg-[#f4f5f7] hover:bg-[#e5e7ec] flex items-center justify-center text-[#1d1d1f] text-xs font-medium z-10 cursor-pointer"
                title="Add or view team"
              >
                +
              </button>
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Team member"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white -ml-2 z-20"
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                alt="Team member"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-white -ml-2 z-30"
              />
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ROW 2: THREE SIGNATURE VISUAL ANALYTICS BENTO CARDS
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* BOTTOM-LEFT CARD: Task Progress with 3 Overlapping Striped 3D Blocks */}
        <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.025)] flex flex-col justify-between">
          <div className="grid grid-cols-12 gap-2">
            {/* Left Side: Title + Big Percentage */}
            <div className="col-span-7 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-medium text-[#1d1d1f]">Task Progress</h3>
                <div className="text-4xl sm:text-[44px] font-normal tracking-tight text-[#1d1d1f] mt-4 leading-none">
                  {avgTeamCapacity}%
                </div>
                <p className="text-xs text-[#86868b] mt-2">Average agency progress</p>
              </div>
            </div>

            {/* Right Side: 3 Department Breakdowns */}
            <div className="col-span-5 space-y-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#f73b9b] flex items-center justify-center text-white text-[10px]">
                    <Layers className="w-3 h-3" />
                  </span>
                  <span className="text-xs text-[#86868b]">Creative & SMM</span>
                </div>
                <div className="text-base font-medium text-[#1d1d1f] mt-0.5 pl-8">87%</div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1d7dfa] flex items-center justify-center text-white text-[10px]">
                    <Sparkles className="w-3 h-3" />
                  </span>
                  <span className="text-xs text-[#86868b]">Ad Campaigns</span>
                </div>
                <div className="text-base font-medium text-[#1d1d1f] mt-0.5 pl-8">64%</div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1ec94c] flex items-center justify-center text-white text-[10px]">
                    <CheckCircle2 className="w-3 h-3" />
                  </span>
                  <span className="text-xs text-[#86868b]">Production</span>
                </div>
                <div className="text-base font-medium text-[#1d1d1f] mt-0.5 pl-8">78%</div>
              </div>
            </div>
          </div>

          {/* Signature 3 Overlapping Colorful Rounded Blocks with Diagonal Hatched Stripes */}
          <div className="relative h-48 mt-4 flex items-end">
            {/* Block 1: Pink (Left, Tallest) */}
            <div
              onClick={() => setCurrentModule('smm')}
              className="w-[42%] h-44 rounded-[22px] bg-gradient-to-b from-[#ff4da6] to-[#f73b9b] p-2.5 flex flex-col justify-between shadow-md relative z-10 cursor-pointer transition-transform hover:-translate-y-1"
            >
              <span className="inline-flex self-start px-2.5 py-1 rounded-full bg-white/25 backdrop-blur-xs text-white text-[11px] font-medium">
                {contentAssets.length || 205}
              </span>
              <div className="w-full h-[72%] rounded-[16px] cognify-stripes border border-white/30" />
            </div>

            {/* Block 2: Blue (Center, Overlapping) */}
            <div
              onClick={() => setCurrentModule('advertising')}
              className="w-[38%] h-32 -ml-5 rounded-[22px] bg-gradient-to-b from-[#3894ff] to-[#1d7dfa] p-2.5 flex flex-col justify-between shadow-lg relative z-20 cursor-pointer transition-transform hover:-translate-y-1"
            >
              <span className="inline-flex self-start px-2.5 py-1 rounded-full bg-white/25 backdrop-blur-xs text-white text-[11px] font-medium">
                {adCampaigns.length * 26 || 106}
              </span>
              <div className="w-full h-[46%] rounded-[14px] cognify-stripes border border-white/30" />
            </div>

            {/* Block 3: Green (Right, Overlapping) */}
            <div
              onClick={() => setCurrentModule('projects')}
              className="w-[38%] h-36 -ml-5 rounded-[22px] bg-gradient-to-b from-[#2be05c] to-[#1ec94c] p-2.5 flex flex-col justify-between shadow-lg relative z-30 cursor-pointer transition-transform hover:-translate-y-1"
            >
              <span className="inline-flex self-start px-2.5 py-1 rounded-full bg-white/25 backdrop-blur-xs text-white text-[11px] font-medium">
                {tasks.length * 24 || 168}
              </span>
              <div className="w-full h-[64%] rounded-[14px] cognify-stripes border border-white/30" />
            </div>
          </div>
        </div>

        {/* BOTTOM-CENTER CARD: Project Status with Multi-Segment Ring Gauge & Striped Bars */}
        <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.025)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-[#1d1d1f]">Project Status</h3>

            {/* Σ | % Segmented Pill Toggle */}
            <div className="flex items-center bg-[#f4f5f7] p-1 rounded-full text-xs">
              <button
                onClick={() => setStatusMode('count')}
                className={`w-7 h-7 rounded-full flex items-center justify-center font-serif font-semibold transition-all cursor-pointer ${
                  statusMode === 'count' ? 'bg-white text-[#1d1d1f] shadow-2xs' : 'text-slate-500'
                }`}
                title="Show counts"
              >
                Σ
              </button>
              <button
                onClick={() => setStatusMode('percent')}
                className={`w-7 h-7 rounded-full flex items-center justify-center font-semibold transition-all cursor-pointer ${
                  statusMode === 'percent' ? 'bg-white text-[#1d1d1f] shadow-2xs' : 'text-slate-500'
                }`}
                title="Show percentages"
              >
                %
              </button>
            </div>
          </div>

          {/* Center Multi-Segment Ring Gauge */}
          <div className="relative my-3 flex items-center justify-center">
            <svg className="w-44 h-44 -rotate-90" viewBox="0 0 160 160">
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r="60"
                fill="none"
                stroke="#f4f5f7"
                strokeWidth="12"
              />
              {/* Green Segment (Completed / Active) */}
              <circle
                cx="80"
                cy="80"
                r="60"
                fill="none"
                stroke="#1ec94c"
                strokeWidth="12"
                strokeDasharray="150 377"
                strokeDashoffset="0"
                strokeLinecap="round"
              />
              {/* Pink Segment (In Progress) */}
              <circle
                cx="80"
                cy="80"
                r="60"
                fill="none"
                stroke="#f73b9b"
                strokeWidth="12"
                strokeDasharray="95 377"
                strokeDashoffset="-162"
                strokeLinecap="round"
              />
              {/* Blue Segment (Upcoming) */}
              <circle
                cx="80"
                cy="80"
                r="60"
                fill="none"
                stroke="#1d7dfa"
                strokeWidth="12"
                strokeDasharray="95 377"
                strokeDashoffset="-270"
                strokeLinecap="round"
              />
            </svg>

            {/* Floating Callout Pill */}
            <div className="absolute top-5 left-4 px-2.5 py-1 rounded-full bg-white shadow-md border border-slate-100 flex items-center gap-1.5 text-[11px] font-medium text-[#1d1d1f]">
              <span className="w-2 h-2 rounded-full bg-[#1ec94c]" />
              <span>
                {statusMode === 'count'
                  ? `${projects.length} (${projectMetrics.completionRate || 52}%)`
                  : `${projectMetrics.completionRate || 52}%`}
              </span>
            </div>

            {/* Center Metric Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <div className="text-3xl sm:text-4xl font-normal tracking-tight text-[#1d1d1f]">
                {totalProjectsAndTasks}
              </div>
              <div className="text-xs text-[#86868b]">deliverables</div>
            </div>
          </div>

          {/* 3 Status Rows with Striped Progress Bars */}
          <div className="space-y-3 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#86868b]">Completed</span>
                <span className="font-medium text-[#1d1d1f]">
                  {statusMode === 'count'
                    ? `${completedCount}/${totalProjectsAndTasks}`
                    : `${completedRatio}%`}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#f4f5f7] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#1ec94c] cognify-stripes-strong"
                  style={{ width: `${Math.max(25, completedRatio)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#86868b]">In progress</span>
                <span className="font-medium text-[#1d1d1f]">
                  {statusMode === 'count'
                    ? `${inProgressCount}/${totalProjectsAndTasks}`
                    : `${inProgressRatio}%`}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#f4f5f7] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#f73b9b] cognify-stripes-strong"
                  style={{ width: `${Math.max(18, inProgressRatio)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[#86868b]">Upcoming & Review</span>
                <span className="font-medium text-[#1d1d1f]">
                  {statusMode === 'count'
                    ? `${upcomingCount}/${totalProjectsAndTasks}`
                    : `${upcomingRatio}%`}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#f4f5f7] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#1d7dfa] cognify-stripes-strong"
                  style={{ width: `${Math.max(32, upcomingRatio)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM-RIGHT CARD: Financial & Productivity Trend (Smooth Dual Spline Chart) */}
        <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.025)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-[#1d1d1f]">Productivity & Cash Trend</h3>

            <button
              onClick={() => setTrendPeriod(trendPeriod === 'Daily' ? 'Monthly' : 'Daily')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f4f5f7] hover:bg-[#e5e7ec] text-xs font-medium text-[#1d1d1f] transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{trendPeriod}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>
          </div>

          {/* Inner Soft Gray Chart Box */}
          <div className="bg-[#f8f9fb] rounded-[22px] p-4 my-3 flex flex-col justify-between">
            {/* Floating Legend Pills */}
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <div
                className="px-2.5 py-1 rounded-full bg-[#1d1d1f] text-white text-[11px] font-medium flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
                title={`White Bank Balance: ${financialBalances.whiteBankBalance.toLocaleString()} ETB`}
              >
                <span className="w-2 h-2 rounded-full bg-[#1d7dfa]" />
                <span>White Bank: {(financialBalances.whiteBankBalance / 1000).toFixed(0)}k ETB</span>
              </div>
              <div
                className="px-2.5 py-1 rounded-full bg-white text-[#1d1d1f] text-[11px] font-medium flex items-center gap-1.5 shadow-2xs border border-slate-100 whitespace-nowrap"
                title={`Black Cash Safe: ${financialBalances.blackCashBalance.toLocaleString()} ETB`}
              >
                <span className="w-2 h-2 rounded-full bg-[#f73b9b]" />
                <span>Black Cash: {(financialBalances.blackCashBalance / 1000).toFixed(0)}k ETB</span>
              </div>
            </div>

            {/* Smooth Spline Wave Chart */}
            <div className="h-32 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={waveChartData} margin={{ top: 10, right: 12, left: 12, bottom: 5 }}>
                  <XAxis dataKey="day" hide />
                  <YAxis domain={[20, 100]} hide />
                  <Tooltip
                    formatter={(val: any, name: any) => [
                      name === 'revenueIndex' ? 'Revenue Stream Index: ' + val : 'Expense Stream Index: ' + val,
                      ''
                    ]}

                    contentStyle={{
                      backgroundColor: '#1d1d1f',
                      borderRadius: '14px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '11px'
                    }}
                  />
                  <ReferenceLine x={selectedDay} stroke="#d1d5db" strokeDasharray="2 2" />
                  <Line
                    type="monotone"
                    dataKey="revenueIndex"
                    stroke="#1d7dfa"
                    strokeWidth={2.5}
                    dot={(props: any) =>
                      props.payload.day === selectedDay ? (
                        <circle
                          key={props.payload.day}
                          cx={props.cx}
                          cy={props.cy}
                          r={5}
                          fill="#1d7dfa"
                          stroke="#ffffff"
                          strokeWidth={2}
                        />
                      ) : (
                        <g key={props.payload.day} />
                      )
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="spendIndex"
                    stroke="#f73b9b"
                    strokeWidth={2.5}
                    dot={(props: any) =>
                      props.payload.day === selectedDay ? (
                        <circle
                          key={props.payload.day}
                          cx={props.cx}
                          cy={props.cy}
                          r={5}
                          fill="#f73b9b"
                          stroke="#ffffff"
                          strokeWidth={2}
                        />
                      ) : (
                        <g key={props.payload.day} />
                      )
                    }
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Day Selector Pills */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 text-xs">
              {waveChartData.map((d) => {
                const isSelected = d.day === selectedDay;
                return (
                  <button
                    key={d.day}
                    onClick={() => setSelectedDay(d.day)}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white text-[#1d1d1f] font-medium shadow-xs border border-slate-200/80'
                        : 'text-[#86868b] hover:text-[#1d1d1f]'
                    }`}
                  >
                    {d.day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom Dual Readouts */}
          <div className="grid grid-cols-2 gap-4 pt-1">
            <div>
              <div className="text-xs text-[#86868b]">Total Revenue</div>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-xl sm:text-2xl font-normal tracking-tight text-[#1d1d1f]">
                  {(financialBalances.totalIncome / 1000).toFixed(0)}k ETB
                </span>
                <span className="text-[11px] font-semibold text-[#1ec94c]">↑ 14%</span>
              </div>
            </div>

            <div>
              <div className="text-xs text-[#86868b]">Net Profit</div>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-xl sm:text-2xl font-normal tracking-tight text-[#1d1d1f]">
                  {(financialBalances.netProfit / 1000).toFixed(0)}k ETB
                </span>
                <span className="text-[11px] font-semibold text-[#f73b9b]">
                  {financialBalances.profitMargin}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          ROW 3: EXECUTIVE OPERATIONAL FEED (Dual-Stream Ledger & Approvals in Cognify Style)
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Dual-Stream Ledger Feed */}
        <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.025)]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1d7dfa]/10 text-[#1d7dfa] flex items-center justify-center">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-medium text-[#1d1d1f]">Dual-Stream Ledger Feed</h3>
                <p className="text-xs text-[#86868b]">
                  Latest Black Cash & White Bank entries · Receivables: {accountsReceivable.toLocaleString()} ETB
                </p>
              </div>
            </div>
            <button
              onClick={() => setCurrentModule('finance')}
              className="px-4 py-2 rounded-full bg-[#f4f5f7] hover:bg-[#e5e7ec] text-xs font-medium text-[#1d1d1f] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Full Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {transactions.slice(0, 4).map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                      tx.type === 'Income'
                        ? 'bg-[#1ec94c]/15 text-[#1ec94c]'
                        : 'bg-[#f73b9b]/15 text-[#f73b9b]'
                    }`}
                  >
                    {tx.type === 'Income' ? '+' : '-'}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[#1d1d1f]">{tx.details}</div>
                    <div className="text-[11px] text-[#86868b] flex items-center gap-1.5 mt-0.5">
                      <span>{tx.date}</span>
                      <span>·</span>
                      <span className="font-medium text-[#1d1d1f]">{tx.stream}</span>
                      <span>·</span>
                      <span>{tx.category}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-xs font-semibold ${
                      tx.type === 'Income' ? 'text-[#1ec94c]' : 'text-[#1d1d1f]'
                    }`}
                  >
                    {(tx.cashAmount || tx.bankAmount).toLocaleString()} ETB
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Executive Approvals & Ad Spend Summary */}
        <div className="bg-white rounded-[28px] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.025)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#f73b9b]/10 text-[#f73b9b] flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-medium text-[#1d1d1f]">Pending Approvals & QA</h3>
                  <p className="text-xs text-[#86868b]">
                    {pendingPOs.length + reviewContent.length} items awaiting executive sign-off · Ad Spend: {totalAdSpend.toLocaleString()} ETB
                  </p>
                </div>
              </div>

              <button
                onClick={() => setCurrentModule('reports')}
                className="px-4 py-2 rounded-full bg-[#f4f5f7] hover:bg-[#e5e7ec] text-xs font-medium text-[#1d1d1f] transition-colors cursor-pointer"
              >
                Reports
              </button>
            </div>

            <div className="space-y-2.5">
              {pendingPOs.map((po) => (
                <div
                  key={po.id}
                  className="p-3.5 rounded-2xl bg-[#f8f9fb] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f73b9b] shrink-0" />
                    <div>
                      <div className="text-xs font-medium text-[#1d1d1f]">
                        Purchase Order #{po.poNumber}
                      </div>
                      <div className="text-[11px] text-[#86868b] truncate max-w-xs">
                        {po.vendor} · {po.description}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-[#1d1d1f]">
                      {po.totalAmount.toLocaleString()} ETB
                    </span>
                    <button
                      onClick={() => setCurrentModule('procurement')}
                      className="px-3 py-1.5 rounded-full bg-white hover:bg-[#ebedf0] text-[11px] font-medium text-[#1d1d1f] shadow-2xs cursor-pointer"
                    >
                      Review PO
                    </button>
                  </div>
                </div>
              ))}

              {reviewContent.slice(0, 2).map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-2xl bg-[#f8f9fb] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1d7dfa] shrink-0" />
                    <div>
                      <div className="text-xs font-medium text-[#1d1d1f]">
                        {c.platform} {c.format} Asset
                      </div>
                      <div className="text-[11px] text-[#86868b] truncate max-w-xs">
                        {c.topic}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentModule('smm')}
                    className="px-3.5 py-1.5 rounded-full bg-[#1d1d1f] text-white text-[11px] font-medium hover:bg-[#323236] cursor-pointer"
                  >
                    Approve
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#86868b]">
            <span>SMM Quota Run-Rate: <strong className="text-[#1d1d1f] font-medium">90 posts/month target</strong></span>
            <button
              onClick={() => setCurrentModule('reports')}
              className="text-[#1d1d1f] font-medium hover:underline cursor-pointer"
            >
              Export Monthly Report →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
