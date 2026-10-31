import React from 'react';
import {
  Users,
  Briefcase,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertCircle,
  Share2,
  Megaphone,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
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
    transactions,
    invoices,
    contentAssets,
    adCampaigns,
    employees,
    purchaseOrders,
    setCurrentModule,
    settings,
    theme
  } = useERP();

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
      : 80;

  // Monthly breakdown for financial chart
  const monthlyFinancialData = [
    { month: 'Jun', revenue: 980000, expenses: 540000, profit: 440000 },
    { month: 'Jul', revenue: 1120000, expenses: 620000, profit: 500000 },
    { month: 'Aug', revenue: 1350000, expenses: 710000, profit: 640000 },
    { month: 'Sep', revenue: 1680000, expenses: 830000, profit: 850000 },
    {
      month: 'Oct',
      revenue: financialBalances.totalIncome || 2100000,
      expenses: financialBalances.totalExpense || 890000,
      profit: financialBalances.netProfit || 1210000
    }
  ];

  // Project distribution
  const projectStatusCounts = [
    { name: 'Active', value: projects.filter((p) => p.status === 'Active').length, color: '#3b82f6' },
    { name: 'In Review', value: projects.filter((p) => p.status === 'In Review').length, color: '#f59e0b' },
    { name: 'Planning', value: projects.filter((p) => p.status === 'Planning').length, color: '#8b5cf6' },
    { name: 'Completed', value: projects.filter((p) => p.status === 'Completed').length, color: '#10b981' }
  ].filter((p) => p.value > 0);

  // Pending items for executive action
  const pendingPOs = purchaseOrders.filter((po) => po.status === 'Requested');
  const reviewContent = contentAssets.filter(
    (c) => c.approvalStatus === 'Pending' || c.productionStatus === 'Review'
  );

  return (
    <div className="space-y-6">
      {/* Top Welcome & Summary Header (Dynamic Brand Colors & Simplicity Mode) */}
      {!theme.hideDecorativeCards ? (
        <div
          className="rounded-2xl p-6 text-white shadow-md relative overflow-hidden transition-all"
          style={{
            backgroundColor: theme.primaryColor,
            backgroundImage: `linear-gradient(135deg, ${theme.primaryColor} 0%, #2b2b2b 100%)`
          }}
        >
          <div
            className="absolute right-0 top-0 bottom-0 w-96 pointer-events-none opacity-20"
            style={{
              background: `radial-gradient(ellipse at top right, ${theme.accentColor}, transparent 70%)`
            }}
          />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div
                className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold mb-2 border"
                style={{
                  backgroundColor: `${theme.accentColor}20`,
                  color: theme.accentColor,
                  borderColor: `${theme.accentColor}50`
                }}
              >
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: theme.accentColor }}
                ></span>
                Live Agency ERP Engine
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                {theme.companyName || 'Open Technology PLC'} — Executive Overview
              </h2>
              <p className="text-slate-200 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed opacity-90">
                Consolidated operations across SMM target execution (1,080 quota), multi-platform advertising, and dual-stream financials.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentModule('finance')}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-colors shadow-xs"
              >
                Financial Ledger
              </button>
              <button
                onClick={() => setCurrentModule('smm')}
                className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md"
                style={{
                  backgroundColor: theme.accentColor,
                  color: '#1a1a1a',
                  boxShadow: `0 4px 12px ${theme.accentColor}40`
                }}
              >
                SMM 1,080 Hub
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white px-5 py-3 rounded-xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: theme.accentColor }}
            />
            <span className="font-bold text-slate-900 text-xs">
              {theme.companyName} Operations Dashboard
            </span>
            <span className="text-slate-400 text-xs">·</span>
            <span className="text-slate-500 text-xs">Minimalist High-Signal View</span>
          </div>
          <div className="flex gap-2 text-xs">
            <button
              onClick={() => setCurrentModule('finance')}
              className="font-semibold text-slate-700 hover:text-slate-900"
            >
              Finance →
            </button>
            <button
              onClick={() => setCurrentModule('smm')}
              className="font-bold"
              style={{ color: theme.accentColor }}
            >
              SMM Hub →
            </button>
          </div>
        </div>
      )}

      {/* 10 Real-Time KPI Cards (All dynamically computed) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* 1. Active Clients */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Active Clients</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900">{activeClientsCount}</div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-medium">+2 this quarter</span>
          </div>
        </div>

        {/* 2. Active Projects */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Active Projects</span>
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900">{projectMetrics.activeCount}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Total {projects.length} in pipeline
          </div>
        </div>

        {/* 3. Monthly Revenue */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Revenue</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900">
            {financialBalances.totalIncome.toLocaleString()} <span className="text-xs font-normal text-slate-500">ETB</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Bank & Cash Inflow
          </div>
        </div>

        {/* 4. Monthly Expenses */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Expenses</span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900">
            {financialBalances.totalExpense.toLocaleString()} <span className="text-xs font-normal text-slate-500">ETB</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Production & Overhead
          </div>
        </div>

        {/* 5. Net Profit */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Net Profit</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-600">
            {financialBalances.netProfit.toLocaleString()} <span className="text-xs font-normal text-slate-500">ETB</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {financialBalances.profitMargin}% margin
          </div>
        </div>

        {/* 6. Outstanding Receivables */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Receivables</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-700">
            {accountsReceivable.toLocaleString()} <span className="text-xs font-normal text-slate-500">ETB</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Pending client invoices</div>
        </div>

        {/* 7. Total Ad Spend */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Ad Spend</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Megaphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900">
            {totalAdSpend.toLocaleString()} <span className="text-xs font-normal text-slate-500">ETB</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Meta, Google, TikTok Ads</div>
        </div>

        {/* 8. SMM Posts Published */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">SMM Published</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-blue-600">
            {smmMetrics.totalPublished} <span className="text-xs font-normal text-slate-400">/ 1,080</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">{smmMetrics.annualFulfillmentRate}% fulfilled</div>
        </div>

        {/* 9. Team Productivity */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Productivity</span>
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900">{avgTeamCapacity}%</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Across 7 departments</div>
        </div>

        {/* 10. Project Completion Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Completion</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900">{projectMetrics.completionRate}%</div>
          <div className="text-[11px] text-slate-500 mt-1">On-time delivery</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue vs Expenses Performance Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Revenue vs. Expenses Trend</h3>
              <p className="text-xs text-slate-500">Monthly agency financial performance (ETB)</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              Consolidated Ledger
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyFinancialData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val: any) => [`${Number(val).toLocaleString()} ETB`, '']}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="revenue" name="Total Revenue" fill={theme.accentColor} radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Total Expenses" fill={theme.primaryColor} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Status Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900">Project Operations</h3>
              <span className="text-xs text-blue-600 font-medium">{projects.length} Total</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">Distribution by current workflow status</p>

            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={projectStatusCounts}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {projectStatusCounts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
            {projectStatusCounts.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 text-[11px] truncate">{item.name}:</span>
                <span className="font-bold text-slate-900 text-[11px]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operational Highlights: Recent Transactions & Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Ledger Transactions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Dual-Stream Ledger Feed</h3>
              <p className="text-xs text-slate-500">Latest Black Cash & White Bank entries</p>
            </div>
            <button
              onClick={() => setCurrentModule('finance')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
            >
              Full Ledger <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {transactions.slice(0, 4).map((tx) => (
              <div key={tx.id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      tx.type === 'Income'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {tx.type === 'Income' ? '+' : '-'}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-800">{tx.details}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span>{tx.date}</span>
                      <span>•</span>
                      <span
                        className={`font-medium ${
                          tx.stream === 'Black Cash' ? 'text-amber-700' : 'text-blue-700'
                        }`}
                      >
                        {tx.stream}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div
                    className={`text-xs font-bold ${
                      tx.type === 'Income' ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {(tx.cashAmount || tx.bankAmount).toLocaleString()} ETB
                  </div>
                  <div className="text-[10px] text-slate-400 capitalize">{tx.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Approvals & SMM Quota Health */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Pending Approvals & QA</h3>
                <p className="text-xs text-slate-500">Executive sign-offs requiring attention</p>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {pendingPOs.length + reviewContent.length} pending
              </span>
            </div>

            <div className="space-y-3">
              {pendingPOs.map((po) => (
                <div
                  key={po.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">
                        Purchase Order #{po.poNumber}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">
                        {po.vendor} • {po.description}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-900">{po.totalAmount.toLocaleString()} ETB</div>
                    <button
                      onClick={() => setCurrentModule('procurement')}
                      className="text-[10px] text-blue-600 hover:underline font-semibold"
                    >
                      Review PO
                    </button>
                  </div>
                </div>
              ))}

              {reviewContent.slice(0, 2).map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <Share2 className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="text-xs font-semibold text-slate-900">
                        {c.platform} {c.format} Asset
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-xs">
                        {c.topic}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentModule('smm')}
                    className="text-xs font-semibold text-purple-700 bg-purple-100 px-2.5 py-1 rounded-lg hover:bg-purple-200"
                  >
                    Approve
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>SMM Quota Run-Rate: <strong>90 posts/month target</strong></span>
            <button
              onClick={() => setCurrentModule('reports')}
              className="text-blue-600 font-semibold hover:underline"
            >
              Export Monthly Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
