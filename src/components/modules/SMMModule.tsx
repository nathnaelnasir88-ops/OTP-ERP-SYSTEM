import React, { useState } from 'react';
import {
  Share2,
  Plus,
  Flame,
  Calendar,
  Layers,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Filter,
  BarChart2,
  Eye,
  ThumbsUp,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import {
  ContentAsset,
  SMMPlatform,
  ContentFormat,
  SMMProductionStatus,
  SMMApprovalStatus
} from '../../types';
import { calculateSMMMetrics } from '../../utils/calculations';

export const SMMModule: React.FC = () => {
  const {
    contentAssets,
    addContentAsset,
    updateContentAsset,
    clients,
    employees,
    settings
  } = useERP();

  const [activeTab, setActiveTab] = useState<'kanban' | 'calendar' | 'assets' | 'performance'>('kanban');
  const [selectedMonth, setSelectedMonth] = useState<number>(10); // October = 10
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAssetDetail, setSelectedAssetDetail] = useState<ContentAsset | null>(null);

  // New Content Asset Form State
  const [newAsset, setNewAsset] = useState({
    contentId: `SMM-24-${Math.floor(100 + Math.random() * 900)}`,
    clientId: clients[0]?.id || '',
    platform: 'Instagram' as SMMPlatform,
    topic: '',
    caption: '',
    format: 'Reel' as ContentFormat,
    assignedDesignerId: 'emp-4',
    assignedCopywriterId: 'emp-3',
    designLink: 'https://canva.com/design/otp-draft',
    publishDate: new Date().toISOString().split('T')[0],
    approvalStatus: 'Pending' as SMMApprovalStatus,
    productionStatus: 'Ideation' as SMMProductionStatus,
    publishedUrl: ''
  });

  const smmMetrics = calculateSMMMetrics(contentAssets, settings.annualSmmTarget);

  const workflowStages: SMMProductionStatus[] = [
    'Ideation',
    'In Canva',
    'Review',
    'Approved',
    'Scheduled',
    'Published'
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const platforms: SMMPlatform[] = ['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'YouTube'];
  const formats: ContentFormat[] = ['Reel', 'Story', 'Carousel', 'Static Graphic', 'Video'];

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.topic.trim()) return;

    addContentAsset(newAsset);
    setShowAddModal(false);
    setNewAsset({
      contentId: `SMM-24-${Math.floor(100 + Math.random() * 900)}`,
      clientId: clients[0]?.id || '',
      platform: 'Instagram',
      topic: '',
      caption: '',
      format: 'Reel',
      assignedDesignerId: 'emp-4',
      assignedCopywriterId: 'emp-3',
      designLink: 'https://canva.com/design/otp-draft',
      publishDate: new Date().toISOString().split('T')[0],
      approvalStatus: 'Pending',
      productionStatus: 'Ideation',
      publishedUrl: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Annual Target Mega Hub Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md border border-purple-900/40 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-300 mb-1.5">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Annual Agency Mandate</span>
                <span className="text-slate-400">•</span>
                <span className="text-emerald-400">Target: {smmMetrics.targetAnnual} Posts</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                OTP Social Media Management Hub
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Centralized production engine from Canva ideation to client review, scheduling, and multi-channel publication.
              </p>
            </div>

            {/* Hub Metrics Pill Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/5 p-3 rounded-xl border border-white/10 text-center">
              <div className="p-2">
                <div className="text-[10px] text-slate-300 uppercase font-semibold">Published</div>
                <div className="text-lg font-bold text-emerald-400">{smmMetrics.totalPublished}</div>
                <div className="text-[10px] text-slate-400">{smmMetrics.annualFulfillmentRate}% of annual</div>
              </div>
              <div className="p-2">
                <div className="text-[10px] text-slate-300 uppercase font-semibold">Monthly Quota</div>
                <div className="text-lg font-bold text-white">{smmMetrics.monthlyTarget}</div>
                <div className="text-[10px] text-slate-400">Posts / month</div>
              </div>
              <div className="p-2">
                <div className="text-[10px] text-slate-300 uppercase font-semibold">Videos & Reels</div>
                <div className="text-lg font-bold text-purple-300">
                  {smmMetrics.videoCount + smmMetrics.reelsCount}
                </div>
                <div className="text-[10px] text-slate-400">High-yield media</div>
              </div>
              <div className="p-2">
                <div className="text-[10px] text-slate-300 uppercase font-semibold">Remaining Quota</div>
                <div className="text-lg font-bold text-amber-400">{smmMetrics.remainingQuota}</div>
                <div className="text-[10px] text-slate-400">To 1,080 annual target</div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-5">
            <div className="flex justify-between items-center text-xs text-slate-300 mb-1.5 font-medium">
              <span>Annual Target Progress ({smmMetrics.totalPublished} of {smmMetrics.targetAnnual} Posts)</span>
              <span className="font-bold text-emerald-400">{smmMetrics.annualFulfillmentRate}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, smmMetrics.annualFulfillmentRate)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Controls & Sub-Navigation */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('kanban')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'kanban'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            6-Stage Production Kanban
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'calendar'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            12-Month Calendar
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'assets'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Asset Library ({contentAssets.length})
          </button>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-purple-500/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Content Asset</span>
        </button>
      </div>

      {/* TAB 1: 6-STAGE PRODUCTION KANBAN */}
      {activeTab === 'kanban' && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1300px]">
            {workflowStages.map((stage) => {
              const stageAssets = contentAssets.filter((a) => a.productionStatus === stage);

              return (
                <div
                  key={stage}
                  className="flex-1 bg-slate-50/80 rounded-2xl p-3 border border-slate-200/80 min-w-[210px] flex flex-col"
                >
                  <div className="flex items-center justify-between px-1 mb-2">
                    <span className="text-xs font-bold text-slate-800">{stage}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      {stageAssets.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto max-h-[580px]">
                    {stageAssets.map((asset) => {
                      const client = clients.find((c) => c.id === asset.clientId);
                      const designer = employees.find((e) => e.id === asset.assignedDesignerId);

                      return (
                        <div
                          key={asset.id}
                          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-purple-400 hover:shadow-md transition-all flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                              <span>{asset.contentId}</span>
                              <span className="font-semibold text-purple-600 bg-purple-50 px-1.5 py-0.2 rounded">
                                {asset.format}
                              </span>
                            </div>

                            <div className="text-[11px] font-semibold text-slate-500 mb-1">
                              {client?.companyName} • {asset.platform}
                            </div>

                            <h4 className="text-xs font-bold text-slate-900 leading-snug">
                              {asset.topic}
                            </h4>

                            {asset.caption && (
                              <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                                {asset.caption}
                              </p>
                            )}

                            <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400">
                              <span>Designer: {designer?.fullName.split(' ')[0] || 'Team'}</span>
                              <span>Date: {asset.publishDate}</span>
                            </div>
                          </div>

                          {/* Quick stage transition dropdown & approval */}
                          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                            <select
                              value={asset.productionStatus}
                              onChange={(e) =>
                                updateContentAsset(asset.id, {
                                  productionStatus: e.target.value as SMMProductionStatus
                                })
                              }
                              className="text-[10px] bg-slate-50 border border-slate-200 rounded-lg px-1.5 py-1 font-semibold text-slate-700"
                            >
                              {workflowStages.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>

                            <button
                              onClick={() => setSelectedAssetDetail(asset)}
                              className="text-[10px] text-purple-600 font-semibold hover:underline"
                            >
                              Inspect
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: 12-MONTH EDITORIAL CALENDAR */}
      {activeTab === 'calendar' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">OTP Annual 1,080 SMM Schedule</h3>
              <p className="text-xs text-slate-500">Monthly quota allocation (90 posts/month required target)</p>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
              {months.map((m, idx) => (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(idx + 1)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedMonth === idx + 1
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {m.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Month Overview */}
          <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-purple-900">
                {months[selectedMonth - 1]} 2024 Editorial Schedule
              </div>
              <div className="text-[11px] text-purple-700 mt-0.5">
                Target: 90 posts • Produced so far: {contentAssets.length} assets
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="px-3 py-1 bg-white rounded-lg font-bold text-purple-700 border border-purple-200">
                Pacing: On Track
              </span>
            </div>
          </div>

          {/* Scheduled posts list for month */}
          <div className="divide-y divide-slate-100">
            {contentAssets.map((asset) => (
              <div key={asset.id} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex flex-col items-center justify-center font-bold">
                    <span className="text-[9px] uppercase leading-none">Day</span>
                    <span className="text-sm leading-tight">{asset.publishDate.split('-')[2] || '15'}</span>
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{asset.topic}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {asset.platform} • {asset.format} • {clients.find((c) => c.id === asset.clientId)?.companyName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      asset.productionStatus === 'Published'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {asset.productionStatus}
                  </span>
                  {asset.publishedUrl && (
                    <a
                      href={asset.publishedUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ASSET LIBRARY */}
      {activeTab === 'assets' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-semibold">
                <tr>
                  <th className="py-3 px-4">Asset ID</th>
                  <th className="py-3 px-4">Platform & Format</th>
                  <th className="py-3 px-4">Topic / Content Description</th>
                  <th className="py-3 px-4">Brand / Client</th>
                  <th className="py-3 px-4">Publish Date</th>
                  <th className="py-3 px-4">Approval</th>
                  <th className="py-3 px-4">Production Status</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contentAssets.map((asset) => {
                  const client = clients.find((c) => c.id === asset.clientId);
                  return (
                    <tr key={asset.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-mono font-medium text-slate-500">{asset.contentId}</td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {asset.platform} ({asset.format})
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900 max-w-xs truncate">
                        {asset.topic}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{client?.companyName}</td>
                      <td className="py-3 px-4 text-slate-500">{asset.publishDate}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            asset.approvalStatus === 'Approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {asset.approvalStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-lg text-[11px]">
                          {asset.productionStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedAssetDetail(asset)}
                          className="text-xs text-purple-600 hover:text-purple-800 font-semibold"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD CONTENT ASSET */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Queue New SMM Content Asset</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAsset} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Content Topic & Hook *</label>
                <input
                  type="text"
                  required
                  value={newAsset.topic}
                  onChange={(e) => setNewAsset({ ...newAsset, topic: e.target.value })}
                  placeholder="e.g. Telebirr International Remittance zero fee campaign"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-purple-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Client / Brand *</label>
                  <select
                    value={newAsset.clientId}
                    onChange={(e) => setNewAsset({ ...newAsset, clientId: e.target.value })}
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
                  <label className="block text-slate-700 font-semibold mb-1">Format *</label>
                  <select
                    value={newAsset.format}
                    onChange={(e) => setNewAsset({ ...newAsset, format: e.target.value as ContentFormat })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    {formats.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Platform</label>
                  <select
                    value={newAsset.platform}
                    onChange={(e) => setNewAsset({ ...newAsset, platform: e.target.value as SMMPlatform })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    {platforms.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Publish Date</label>
                  <input
                    type="date"
                    value={newAsset.publishDate}
                    onChange={(e) => setNewAsset({ ...newAsset, publishDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Caption & Copy</label>
                <textarea
                  rows={2}
                  value={newAsset.caption}
                  onChange={(e) => setNewAsset({ ...newAsset, caption: e.target.value })}
                  placeholder="Instagram/TikTok caption with emojis and hashtags..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Design Link (Canva/Drive)</label>
                  <input
                    type="url"
                    value={newAsset.designLink}
                    onChange={(e) => setNewAsset({ ...newAsset, designLink: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Initial Status</label>
                  <select
                    value={newAsset.productionStatus}
                    onChange={(e) =>
                      setNewAsset({ ...newAsset, productionStatus: e.target.value as SMMProductionStatus })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    {workflowStages.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold"
                >
                  Create Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSPECT DETAIL MODAL */}
      {selectedAssetDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono text-purple-600 font-bold">
                  {selectedAssetDetail.contentId} • {selectedAssetDetail.platform} ({selectedAssetDetail.format})
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedAssetDetail.topic}</h3>
              </div>
              <button
                onClick={() => setSelectedAssetDetail(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-semibold text-slate-500 uppercase mb-1">Post Caption</div>
                <p className="text-slate-800 leading-relaxed">{selectedAssetDetail.caption || 'No caption entered yet.'}</p>
              </div>

              {selectedAssetDetail.designLink && (
                <div className="flex items-center justify-between p-2.5 bg-purple-50 rounded-xl border border-purple-100">
                  <span className="font-medium text-purple-900">Canva / Creative Workspace:</span>
                  <a
                    href={selectedAssetDetail.designLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-700 font-bold hover:underline flex items-center gap-1"
                  >
                    Open Canvas <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Performance metrics if published */}
              {selectedAssetDetail.productionStatus === 'Published' && (
                <div className="grid grid-cols-4 gap-2 text-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <div className="text-[10px] text-slate-400">Views</div>
                    <div className="font-bold text-slate-900">{selectedAssetDetail.views?.toLocaleString() || '18.4k'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Likes</div>
                    <div className="font-bold text-emerald-600">{selectedAssetDetail.likes?.toLocaleString() || '1.4k'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Comments</div>
                    <div className="font-bold text-blue-600">{selectedAssetDetail.comments?.toLocaleString() || '142'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Shares</div>
                    <div className="font-bold text-purple-600">{selectedAssetDetail.shares?.toLocaleString() || '210'}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  updateContentAsset(selectedAssetDetail.id, {
                    approvalStatus: 'Approved',
                    productionStatus: 'Approved'
                  });
                  setSelectedAssetDetail(null);
                }}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Approve Asset
              </button>

              <button
                onClick={() => setSelectedAssetDetail(null)}
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
