import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  TrendingUp,
  DollarSign,
  MousePointer,
  Users,
  Target,
  BarChart3,
  AlertTriangle,
  Play,
  Pause,
  Filter
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { useERP } from '../../context/ERPContext';
import { AdCampaign, AdPlatform, CampaignStatus } from '../../types';
import { calculateCampaignMetrics } from '../../utils/calculations';

export const AdvertisingModule: React.FC = () => {
  const { adCampaigns, addAdCampaign, updateAdCampaign, clients } = useERP();

  const [platformFilter, setPlatformFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCampaignDetail, setSelectedCampaignDetail] = useState<AdCampaign | null>(null);

  const [newCampaign, setNewCampaign] = useState({
    campaignId: `ADC-2024-${Math.floor(10 + Math.random() * 90)}`,
    clientId: clients[0]?.id || '',
    name: '',
    platform: 'Meta Ads' as AdPlatform,
    allocatedBudget: 250000,
    actualSpend: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'Active' as CampaignStatus,
    impressions: 100000,
    reach: 60000,
    clicks: 4500,
    leads: 280,
    conversions: 120,
    revenueGenerated: 450000
  });

  const platforms: AdPlatform[] = [
    'Meta Ads',
    'Facebook',
    'Instagram',
    'Google Ads',
    'TikTok Ads',
    'LinkedIn Ads'
  ];

  const filteredCampaigns = platformFilter === 'All'
    ? adCampaigns
    : adCampaigns.filter((c) => c.platform === platformFilter);

  // Aggregated calculations
  const totalAllocated = adCampaigns.reduce((acc, c) => acc + (c.allocatedBudget || 0), 0);
  const totalSpend = adCampaigns.reduce((acc, c) => acc + (c.actualSpend || 0), 0);
  const totalClicks = adCampaigns.reduce((acc, c) => acc + (c.clicks || 0), 0);
  const totalImpressions = adCampaigns.reduce((acc, c) => acc + (c.impressions || 0), 0);
  const totalLeads = adCampaigns.reduce((acc, c) => acc + (c.leads || 0), 0);
  const totalRevenue = adCampaigns.reduce((acc, c) => acc + (c.revenueGenerated || 0), 0);

  const aggregateCalc = calculateCampaignMetrics({
    allocatedBudget: totalAllocated,
    actualSpend: totalSpend,
    impressions: totalImpressions,
    reach: totalImpressions * 0.6,
    clicks: totalClicks,
    leads: totalLeads,
    conversions: totalLeads * 0.4,
    revenueGenerated: totalRevenue
  });

  const chartData = adCampaigns.map((c) => ({
    name: c.name.length > 18 ? `${c.name.slice(0, 18)}...` : c.name,
    budget: c.allocatedBudget,
    spend: c.actualSpend,
    revenue: c.revenueGenerated
  }));

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.name.trim()) return;

    addAdCampaign(newCampaign);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Overview */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Performance Advertising Management
          </h2>
          <p className="text-xs text-slate-500">
            Multi-channel campaign deployment across Meta, Google, TikTok, and LinkedIn
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700"
          >
            <option value="All">All Platforms</option>
            {platforms.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-blue-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Launch Ad Campaign</span>
          </button>
        </div>
      </div>

      {/* 6 Automated Performance KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-semibold text-slate-400 uppercase">Allocated Budget</div>
          <div className="text-base font-bold text-slate-900 mt-1">
            {totalAllocated.toLocaleString()} <span className="text-[10px] font-normal">ETB</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Across {adCampaigns.length} accounts</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-semibold text-slate-400 uppercase">Actual Ad Spend</div>
          <div className="text-base font-bold text-purple-600 mt-1">
            {totalSpend.toLocaleString()} <span className="text-[10px] font-normal">ETB</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">{aggregateCalc.budgetUtilization}% utilized</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-semibold text-slate-400 uppercase">Avg. CPC</div>
          <div className="text-base font-bold text-slate-900 mt-1">
            {aggregateCalc.cpc} <span className="text-[10px] font-normal">ETB</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">{totalClicks.toLocaleString()} total clicks</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-semibold text-slate-400 uppercase">Avg. CTR</div>
          <div className="text-base font-bold text-blue-600 mt-1">{aggregateCalc.ctr}%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{(totalImpressions / 1000).toFixed(0)}k impressions</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-semibold text-slate-400 uppercase">Cost Per Lead (CPL)</div>
          <div className="text-base font-bold text-amber-600 mt-1">
            {aggregateCalc.cpl} <span className="text-[10px] font-normal">ETB</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">{totalLeads.toLocaleString()} leads captured</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-[10px] font-semibold text-slate-400 uppercase">Blended ROAS</div>
          <div className="text-base font-bold text-emerald-600 mt-1">{aggregateCalc.roas}x</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{totalRevenue.toLocaleString()} ETB generated</div>
        </div>
      </div>

      {/* Chart: Budget vs Spend vs Revenue */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Campaign Performance & Return</h3>
            <p className="text-xs text-slate-500">Allocated budget vs. Actual spend vs. Client revenue generated</p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
            Real-Time Analytics
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(val: any) => [`${Number(val).toLocaleString()} ETB`, '']}
                contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="budget" name="Allocated Budget" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="spend" name="Actual Spend" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="revenue" name="Revenue Generated" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Campaign Data Table with Live Calculators */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Active Campaign Ledgers</h3>
          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredCampaigns.length} campaigns
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Campaign Name</th>
                <th className="py-3 px-4">Platform</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Budget / Spend</th>
                <th className="py-3 px-4">Utilization</th>
                <th className="py-3 px-4">CPC / CTR</th>
                <th className="py-3 px-4">CPL</th>
                <th className="py-3 px-4">ROAS</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCampaigns.map((camp) => {
                const client = clients.find((c) => c.id === camp.clientId);
                const metrics = calculateCampaignMetrics(camp);

                return (
                  <tr key={camp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{camp.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{camp.campaignId}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{camp.platform}</td>
                    <td className="py-3 px-4 text-slate-600">{client?.companyName}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{camp.actualSpend.toLocaleString()} ETB</div>
                      <div className="text-[10px] text-slate-400">of {camp.allocatedBudget.toLocaleString()} ETB</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-bold ${
                            metrics.budgetUtilization > 90
                              ? 'text-rose-600'
                              : metrics.budgetUtilization > 75
                              ? 'text-amber-600'
                              : 'text-slate-700'
                          }`}
                        >
                          {metrics.budgetUtilization}%
                        </span>
                        {metrics.budgetUtilization > 85 && (
                          <span title="High budget utilization">
                            <AlertTriangle className="w-3 h-3 text-amber-500" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{metrics.cpc} ETB</div>
                      <div className="text-[10px] text-slate-400">{metrics.ctr}% CTR</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-amber-600">{metrics.cpl} ETB</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {metrics.roas}x
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={camp.status}
                        onChange={(e) =>
                          updateAdCampaign(camp.id, { status: e.target.value as CampaignStatus })
                        }
                        className="text-[11px] bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-800"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Pending Approval">Pending</option>
                        <option value="Active">Active</option>
                        <option value="Paused">Paused</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedCampaignDetail(camp)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        Breakdown
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: CREATE CAMPAIGN */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Launch New Advertising Campaign</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Campaign Name *</label>
                <input
                  type="text"
                  required
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  placeholder="e.g. Telebirr Q4 Remittance Growth Spark Ads"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Client *</label>
                  <select
                    value={newCampaign.clientId}
                    onChange={(e) => setNewCampaign({ ...newCampaign, clientId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.companyName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Platform *</label>
                  <select
                    value={newCampaign.platform}
                    onChange={(e) => setNewCampaign({ ...newCampaign, platform: e.target.value as AdPlatform })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    {platforms.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Allocated Budget (ETB) *</label>
                  <input
                    type="number"
                    required
                    value={newCampaign.allocatedBudget}
                    onChange={(e) => setNewCampaign({ ...newCampaign, allocatedBudget: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Initial Spend</label>
                  <input
                    type="number"
                    value={newCampaign.actualSpend}
                    onChange={(e) => setNewCampaign({ ...newCampaign, actualSpend: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newCampaign.startDate}
                    onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    value={newCampaign.endDate}
                    onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold"
                >
                  Create Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {selectedCampaignDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono text-purple-600 font-bold">
                  {selectedCampaignDetail.campaignId} • {selectedCampaignDetail.platform}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedCampaignDetail.name}</h3>
              </div>
              <button
                onClick={() => setSelectedCampaignDetail(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div className="grid grid-cols-3 gap-2 text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <div className="text-[10px] text-slate-400">Impressions</div>
                  <div className="font-bold text-slate-900">{selectedCampaignDetail.impressions.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Clicks</div>
                  <div className="font-bold text-blue-600">{selectedCampaignDetail.clicks.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Leads</div>
                  <div className="font-bold text-amber-600">{selectedCampaignDetail.leads.toLocaleString()}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-slate-400 text-[10px]">Budget & Spend</div>
                  <div className="font-bold text-slate-900 mt-1">
                    {selectedCampaignDetail.actualSpend.toLocaleString()} / {selectedCampaignDetail.allocatedBudget.toLocaleString()} ETB
                  </div>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="text-emerald-700 text-[10px] font-semibold">Revenue Generated</div>
                  <div className="font-bold text-emerald-800 mt-1">
                    {selectedCampaignDetail.revenueGenerated.toLocaleString()} ETB
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedCampaignDetail(null)}
                className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
