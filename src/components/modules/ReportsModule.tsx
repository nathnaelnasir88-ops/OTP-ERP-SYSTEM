import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  FileSpreadsheet,
  TrendingUp,
  Share2,
  DollarSign,
  Briefcase,
  Users
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
  LineChart,
  Line
} from 'recharts';
import { useERP } from '../../context/ERPContext';
import {
  calculateFinancialBalances,
  calculateReceivablesAndPayables,
  calculateSMMMetrics,
  calculateCampaignMetrics,
  calculateProjectProgress
} from '../../utils/calculations';

export const ReportsModule: React.FC = () => {
  const {
    clients,
    projects,
    transactions,
    invoices,
    contentAssets,
    adCampaigns,
    employees,
    settings
  } = useERP();

  const [reportType, setReportType] = useState<'financial' | 'marketing' | 'operations' | 'executive'>('executive');
  const [dateFilter, setDateFilter] = useState<'All' | 'Q3' | 'Q4'>('All');

  const balances = calculateFinancialBalances(
    transactions,
    settings.blackCashInitialBalance,
    settings.whiteBankInitialBalance
  );
  const { accountsReceivable, totalInvoiced, totalPaid } = calculateReceivablesAndPayables(invoices);
  const smmMetrics = calculateSMMMetrics(contentAssets, settings.annualSmmTarget);
  const projectMetrics = calculateProjectProgress(projects);

  const totalAdSpend = adCampaigns.reduce((acc, c) => acc + (c.actualSpend || 0), 0);
  const totalRevenue = adCampaigns.reduce((acc, c) => acc + (c.revenueGenerated || 0), 0);
  const blendedROAS = totalAdSpend > 0 ? (totalRevenue / totalAdSpend).toFixed(2) : '0';

  // Function to export table data as CSV
  const handleExportCSV = (filename: string, rows: any[]) => {
    if (!rows || rows.length === 0) return;
    const keys = Object.keys(rows[0]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [keys.join(','), ...rows.map((row) => keys.map((k) => `"${row[k]}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Tab Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setReportType('executive')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              reportType === 'executive'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Executive Summary
          </button>
          <button
            onClick={() => setReportType('financial')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              reportType === 'financial'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Financial P&L Statement
          </button>
          <button
            onClick={() => setReportType('marketing')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              reportType === 'marketing'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Marketing & SMM Fulfillment
          </button>
          <button
            onClick={() => setReportType('operations')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              reportType === 'operations'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Operations & Capacity
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (reportType === 'financial') {
                handleExportCSV(
                  'OTP_Financial_Ledger_Report',
                  transactions.map((t) => ({
                    ID: t.transactionId,
                    Date: t.date,
                    Stream: t.stream,
                    Type: t.type,
                    Category: t.category,
                    Cash: t.cashAmount,
                    Bank: t.bankAmount,
                    Vendor: t.vendor || t.sourceOrClient
                  }))
                );
              } else if (reportType === 'marketing') {
                handleExportCSV(
                  'OTP_SMM_1080_Campaign_Report',
                  contentAssets.map((c) => ({
                    ID: c.contentId,
                    Platform: c.platform,
                    Format: c.format,
                    Topic: c.topic,
                    Status: c.productionStatus,
                    Date: c.publishDate
                  }))
                );
              } else {
                handleExportCSV(
                  'OTP_Executive_Operations_Report',
                  projects.map((p) => ({
                    ID: p.projectId,
                    Name: p.name,
                    Budget: p.budget,
                    Spent: p.spent,
                    Progress: `${p.progressPercentage}%`,
                    Status: p.status
                  }))
                );
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export to CSV</span>
          </button>
        </div>
      </div>

      {/* EXECUTIVE REPORT */}
      {reportType === 'executive' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Net Profit (Oct)</div>
              <div className="text-xl font-bold text-emerald-600 mt-1">
                {balances.netProfit.toLocaleString()} ETB
              </div>
              <div className="text-[10px] text-slate-400 mt-1">{balances.profitMargin}% margin</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">SMM 1,080 Fulfillment</div>
              <div className="text-xl font-bold text-purple-600 mt-1">
                {smmMetrics.annualFulfillmentRate}%
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                {smmMetrics.totalPublished} published / {smmMetrics.remainingQuota} to target
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Project Delivery Rate</div>
              <div className="text-xl font-bold text-blue-600 mt-1">
                {projectMetrics.completionRate}%
              </div>
              <div className="text-[10px] text-slate-400 mt-1">{projects.length} Total Projects</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Blended Client ROAS</div>
              <div className="text-xl font-bold text-teal-600 mt-1">{blendedROAS}x</div>
              <div className="text-[10px] text-slate-400 mt-1">Ad return efficiency</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Agency Executive Performance Review</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Open Technology PLC continues strong growth across Q4 with retainer revenue outperforming quarterly expense run rates. Cash reserves across Black Stream (physical cash safe) and White Stream (corporate Awash Bank accounts) remain solvent and fully auditable.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                <div className="font-bold text-slate-800">Financial Stream Integrity</div>
                <div className="flex justify-between text-slate-600">
                  <span>Physical Cash Safe Balance:</span>
                  <span className="font-bold text-slate-900">{balances.blackCashBalance.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Corporate Bank Wire Balance:</span>
                  <span className="font-bold text-slate-900">{balances.whiteBankBalance.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Client Receivables Pending:</span>
                  <span className="font-bold text-amber-700">{accountsReceivable.toLocaleString()} ETB</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl space-y-2">
                <div className="font-bold text-slate-800">Operational Agency Pacing</div>
                <div className="flex justify-between text-slate-600">
                  <span>Active Clients:</span>
                  <span className="font-bold text-slate-900">{clients.filter((c) => c.status === 'Active').length} Corporate Retainers</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>SMM Run-Rate Pacing:</span>
                  <span className="font-bold text-purple-700">90 Posts / Month Required</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Average Team Capacity:</span>
                  <span className="font-bold text-slate-900">82% across 7 Departments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FINANCIAL REPORT */}
      {reportType === 'financial' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-bold text-slate-900">Income Statement & Dual-Stream Ledger Report</h3>
            <p className="text-xs text-slate-500">
              Preserves distinction between physical cash management and statutory corporate bank accounting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Income breakdown */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Income & Receipts</h4>
              <div className="p-3 bg-slate-50 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">Official White Bank Wire Inflow:</span>
                  <span className="font-bold text-slate-900">{balances.whiteBankIncome.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Physical Black Cash Inflow:</span>
                  <span className="font-bold text-slate-900">{balances.blackCashIncome.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-emerald-600">
                  <span>Total Gross Revenue:</span>
                  <span>{balances.totalIncome.toLocaleString()} ETB</span>
                </div>
              </div>
            </div>

            {/* Expense breakdown */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Expenses & Disbursements</h4>
              <div className="p-3 bg-slate-50 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-600">White Bank (Studio Lease & Subscriptions):</span>
                  <span className="font-bold text-slate-900">{balances.whiteBankExpense.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Black Cash (On-Site Crew & Logistics):</span>
                  <span className="font-bold text-slate-900">{balances.blackCashExpense.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-rose-600">
                  <span>Total Operating Expenses:</span>
                  <span>{balances.totalExpense.toLocaleString()} ETB</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs font-bold text-emerald-900">
            <span>Net Operating Margin (Consolidated):</span>
            <span className="text-base">{balances.netProfit.toLocaleString()} ETB ({balances.profitMargin}%)</span>
          </div>
        </div>
      )}

      {/* MARKETING & SMM REPORT */}
      {reportType === 'marketing' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900">SMM Quota & Advertising Performance Summary</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-slate-500">Annual Target</div>
              <div className="text-base font-bold text-slate-900 mt-1">{smmMetrics.targetAnnual} Posts</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-slate-500">Posts Published</div>
              <div className="text-base font-bold text-emerald-600 mt-1">{smmMetrics.totalPublished} Posts</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-slate-500">Quota Remaining</div>
              <div className="text-base font-bold text-amber-600 mt-1">{smmMetrics.remainingQuota} Posts</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <div className="text-slate-500">Ad Spend Efficiency</div>
              <div className="text-base font-bold text-teal-600 mt-1">{blendedROAS}x ROAS</div>
            </div>
          </div>
        </div>
      )}

      {/* OPERATIONS & CAPACITY REPORT */}
      {reportType === 'operations' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900">Project Operations & Department Workload</h3>
          <div className="divide-y divide-slate-100 text-xs">
            {projects.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">{p.name}</div>
                  <div className="text-[11px] text-slate-500">
                    Budget: {p.budget.toLocaleString()} ETB • Spent: {p.spent.toLocaleString()} ETB
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-blue-600">{p.progressPercentage}% Completed</span>
                  <div className="text-[10px] text-slate-400 capitalize">{p.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
