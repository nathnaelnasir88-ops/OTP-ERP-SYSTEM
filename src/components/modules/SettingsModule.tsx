import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Building2,
  Database,
  RefreshCw,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Wallet,
  Palette,
  Sparkles,
  Shield,
  RotateCcw,
  Sliders,
  Image,
  Eye,
  Check
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { UserRole, SidebarTone, LogoStyle, LayoutDensity, BorderRadiusOption } from '../../types';

export const SettingsModule: React.FC = () => {
  const {
    settings,
    updateSettings,
    currentUser,
    setUserRole,
    resetToSampleData,
    isFirebaseConnected,
    theme,
    updateTheme,
    resetTheme
  } = useERP();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'company' | 'roles' | 'brand' | 'system'>('brand');
  const [seedNotice, setSeedNotice] = useState<string | null>(null);

  const [companyForm, setCompanyForm] = useState({
    companyName: settings.companyName,
    annualSmmTarget: settings.annualSmmTarget,
    baseCurrency: settings.baseCurrency,
    whiteBankInitialBalance: settings.whiteBankInitialBalance,
    blackCashInitialBalance: settings.blackCashInitialBalance
  });

  const rolesMatrix: {
    role: UserRole;
    scope: string;
    modules: string[];
    approvalLimit: string;
  }[] = [
    {
      role: 'Super Administrator',
      scope: 'Full global system administration & access control',
      modules: ['All 10 Modules', 'User Provisioning', 'Database Backup', 'Audit Log Override'],
      approvalLimit: 'Unlimited'
    },
    {
      role: 'Managing Director',
      scope: 'Executive sign-off, contracts, financials, and company roadmap',
      modules: ['Dashboard', 'CRM', 'Projects', 'SMM Hub', 'Ads', 'Finance', 'HR', 'Procurement', 'Reports'],
      approvalLimit: 'Unlimited'
    },
    {
      role: 'Finance Manager',
      scope: 'Dual-stream ledger management, tax compliance, invoices, and reversals',
      modules: ['Finance & Accounting', 'Invoices', 'Purchase Orders', 'Executive Dashboard', 'Reports'],
      approvalLimit: 'Up to 5,000,000 ETB'
    },
    {
      role: 'Marketing Manager',
      scope: 'Client relationships, proposals, brand guidelines, and campaign sign-off',
      modules: ['CRM & Sales', 'SMM Hub', 'Advertising', 'Projects', 'Marketing Reports'],
      approvalLimit: 'Up to 1,500,000 ETB'
    },
    {
      role: 'Project Manager',
      scope: 'Operations planning, task dispatch, deadlines, and milestone sign-off',
      modules: ['Projects & Operations', 'Task Kanban', 'CRM Deals', 'Operations Reports'],
      approvalLimit: 'Deliverables & Deadlines'
    },
    {
      role: 'Social Media Manager',
      scope: 'Annual 1,080 SMM quota, weekly calendars, Canva QA, and scheduling',
      modules: ['Social Media Hub', 'Content Calendar', 'Asset Library', 'SMM Analytics'],
      approvalLimit: 'Content Publishing'
    },
    {
      role: 'Designer / Content Creator',
      scope: 'Canva design, motion graphics, video editing, and storyboards',
      modules: ['Assigned Tasks', 'SMM Ideation & Canva', 'Asset Submissions'],
      approvalLimit: 'Draft Submission'
    },
    {
      role: 'Media Buyer',
      scope: 'Performance advertising, Meta & Google budget management, ROAS QA',
      modules: ['Advertising & Campaigns', 'Ad Spend Analytics', 'CPC/CPL Reports'],
      approvalLimit: 'Up to 500,000 ETB Spend'
    },
    {
      role: 'HR Manager',
      scope: 'Employee profiles, recruitment, leave requests, and workload tracking',
      modules: ['HR & Team', 'Leave Approvals', 'Employee Directory', 'Staff Capacity'],
      approvalLimit: 'Leave & Personnel'
    },
    {
      role: 'Employee',
      scope: 'Personal task execution, leave submission, and workload logs',
      modules: ['My Assigned Tasks', 'Apply for Leave', 'Personal Profile'],
      approvalLimit: 'None'
    }
  ];

  const handleSaveCompanySettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(companyForm);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('brand')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'brand'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: theme.accentColor }}
            />
            <span>Brand & UI Design Studio</span>
          </button>
          <button
            onClick={() => setActiveTab('company')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'company'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Company & Agency Targets
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'roles'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Role-Based Permissions (RBAC)
          </button>
          <button
            onClick={() => setActiveTab('system')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'system'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            System & Cloud Firestore
          </button>
        </div>
      </div>

      {/* TAB 1: COMPANY SETTINGS & TARGETS */}
      {activeTab === 'company' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-2xl text-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Agency Configuration</h3>
              <p className="text-slate-500">Corporate identity and operational target constants</p>
            </div>
            {savedSuccess && (
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg flex items-center gap-1 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved Successfully
              </span>
            )}
          </div>

          <form onSubmit={handleSaveCompanySettings} className="space-y-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Company Legal Name</label>
              <input
                type="text"
                value={companyForm.companyName}
                onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Annual SMM Published Target (Posts)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={companyForm.annualSmmTarget}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, annualSmmTarget: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold text-purple-700"
                  />
                  <Flame className="w-4 h-4 text-orange-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Mandatory OTP quota (Default: 1,080 posts / 90 per month)
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Base Currency</label>
                <input
                  type="text"
                  value={companyForm.baseCurrency}
                  onChange={(e) => setCompanyForm({ ...companyForm, baseCurrency: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  White Bank Initial Balance (ETB)
                </label>
                <input
                  type="number"
                  value={companyForm.whiteBankInitialBalance}
                  onChange={(e) =>
                    setCompanyForm({
                      ...companyForm,
                      whiteBankInitialBalance: Number(e.target.value)
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Black Cash Initial Safe Balance (ETB)
                </label>
                <input
                  type="number"
                  value={companyForm.blackCashInitialBalance}
                  onChange={(e) =>
                    setCompanyForm({
                      ...companyForm,
                      blackCashInitialBalance: Number(e.target.value)
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: ROLE-BASED ACCESS CONTROL (RBAC) MATRIX */}
      {activeTab === 'roles' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">OTP 10-Tier RBAC Authority Matrix</h3>
              <p className="text-xs text-slate-500">
                Defined permissions, module visibility, and financial approval thresholds
              </p>
            </div>
            <div className="text-xs text-slate-600">
              Active Simulation Role: <strong className="text-blue-600">{currentUser.role}</strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Role Title</th>
                  <th className="py-3 px-4">Operational Scope</th>
                  <th className="py-3 px-4">Authorized Modules</th>
                  <th className="py-3 px-4">Approval Authority</th>
                  <th className="py-3 px-4 text-right">Test Mode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rolesMatrix.map((r) => {
                  const isCurrent = currentUser.role === r.role;
                  return (
                    <tr
                      key={r.role}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isCurrent ? 'bg-blue-50/50 font-medium' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                        <ShieldCheck
                          className={`w-4 h-4 ${isCurrent ? 'text-blue-600' : 'text-slate-400'}`}
                        />
                        <span>{r.role}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-xs">{r.scope}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {r.modules.map((m) => (
                            <span
                              key={m}
                              className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-purple-700">{r.approvalLimit}</td>
                      <td className="py-3 px-4 text-right">
                        {isCurrent ? (
                          <span className="text-[10px] text-blue-600 font-bold px-2 py-0.5 rounded-full bg-blue-100">
                            Active Role
                          </span>
                        ) : (
                          <button
                            onClick={() => setUserRole(r.role)}
                            className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            Switch to Role
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: BRAND & UI DESIGN STUDIO (FULL CONTROL) */}
      {activeTab === 'brand' && (
        <div className="space-y-6 text-xs">
          {/* Header & Status */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md font-black text-lg tracking-wider"
                style={{
                  backgroundColor: theme.primaryColor,
                  color: theme.accentColor,
                  border: `2px solid ${theme.accentColor}`
                }}
              >
                {theme.companyShortName}
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Open Technology PLC Brand & UI Design Studio</span>
                  <span
                    className="text-[10px] px-2.5 py-0.5 rounded-full font-bold font-mono uppercase"
                    style={{ backgroundColor: `${theme.accentColor}25`, color: '#7c5800' }}
                  >
                    Active Aesthetic
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete control over primary colors, golden accents, agency logo, layout density, and interface simplicity.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  updateTheme({
                    primaryColor: '#545454',
                    accentColor: '#feb913',
                    sidebarTone: 'charcoal'
                  });
                  setSavedSuccess(true);
                  setTimeout(() => setSavedSuccess(false), 3000);
                }}
                className="px-3.5 py-2 text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all"
                style={{
                  backgroundColor: '#feb913',
                  color: '#1a1a1a',
                  border: '1px solid #e5a408'
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Apply #545454 & #feb913 OTP Signature</span>
              </button>

              <button
                onClick={() => {
                  resetTheme();
                  setSavedSuccess(true);
                  setTimeout(() => setSavedSuccess(false), 3000);
                }}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Theme and branding preferences updated and persisted across all ERP modules!</span>
            </div>
          )}

          {/* Grid Layout: Controls & Live Sandbox */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Controls */}
            <div className="lg:col-span-2 space-y-6">
              {/* SECTION 1: 1-Click Aesthetic Presets */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Palette className="w-4 h-4" style={{ color: theme.accentColor }} />
                  <span>Curated Agency Palettes</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      name: 'OTP Agency Signature',
                      primary: '#545454',
                      accent: '#feb913',
                      tone: 'charcoal' as SidebarTone,
                      desc: 'Requested #545454 graphite & #feb913 gold'
                    },
                    {
                      name: 'Obsidian High Contrast',
                      primary: '#1c1c1e',
                      accent: '#feb913',
                      tone: 'dark' as SidebarTone,
                      desc: 'Deep OLED black with glowing gold highlights'
                    },
                    {
                      name: 'Warm Slate Studio',
                      primary: '#44403c',
                      accent: '#f59e0b',
                      tone: 'accent-border' as SidebarTone,
                      desc: 'Stone gray with amber gold border trim'
                    },
                    {
                      name: 'Executive Minimalist',
                      primary: '#262626',
                      accent: '#e4e4e7',
                      tone: 'charcoal' as SidebarTone,
                      desc: 'Distraction-free black & silver'
                    }
                  ].map((p) => {
                    const isSelected =
                      theme.primaryColor.toLowerCase() === p.primary.toLowerCase() &&
                      theme.accentColor.toLowerCase() === p.accent.toLowerCase();
                    return (
                      <button
                        key={p.name}
                        onClick={() => {
                          updateTheme({
                            primaryColor: p.primary,
                            accentColor: p.accent,
                            sidebarTone: p.tone
                          });
                          setSavedSuccess(true);
                          setTimeout(() => setSavedSuccess(false), 2500);
                        }}
                        className={`p-3.5 rounded-xl border text-left flex items-start justify-between transition-all ${
                          isSelected
                            ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-2">
                            <span
                              className="w-7 h-7 rounded-full border-2 border-white shadow-xs"
                              style={{ backgroundColor: p.primary }}
                            />
                            <span
                              className="w-7 h-7 rounded-full border-2 border-white shadow-xs"
                              style={{ backgroundColor: p.accent }}
                            />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs">{p.name}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">{p.desc}</div>
                            <div className="font-mono text-[9px] text-slate-400 mt-0.5">
                              {p.primary} • {p.accent}
                            </div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-slate-900 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: Custom Color Pickers */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="font-bold text-slate-900 text-sm">Fine-Tune Color Codes</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Primary Color Picker */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-800">
                        Primary Brand Color (Default #545454)
                      </label>
                      <span className="font-mono text-slate-500 uppercase">{theme.primaryColor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.primaryColor}
                        onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 p-0.5 bg-white shadow-2xs"
                      />
                      <input
                        type="text"
                        value={theme.primaryColor}
                        onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                        className="flex-1 px-3 py-2 text-xs font-mono uppercase bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-400 mr-1">Presets:</span>
                      {['#545454', '#3f3f3f', '#262626', '#18181b', '#0f172a', '#44403c'].map((hex) => (
                        <button
                          key={hex}
                          onClick={() => updateTheme({ primaryColor: hex })}
                          style={{ backgroundColor: hex }}
                          className={`w-6 h-6 rounded-md border border-slate-200 transition-transform hover:scale-110 ${
                            theme.primaryColor.toLowerCase() === hex.toLowerCase() ? 'ring-2 ring-blue-500' : ''
                          }`}
                          title={hex}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Accent Color Picker */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-800">
                        Accent Color (Default #feb913)
                      </label>
                      <span className="font-mono text-slate-500 uppercase">{theme.accentColor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.accentColor}
                        onChange={(e) => updateTheme({ accentColor: e.target.value })}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 p-0.5 bg-white shadow-2xs"
                      />
                      <input
                        type="text"
                        value={theme.accentColor}
                        onChange={(e) => updateTheme({ accentColor: e.target.value })}
                        className="flex-1 px-3 py-2 text-xs font-mono uppercase bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-400 mr-1">Presets:</span>
                      {['#feb913', '#f59e0b', '#facc15', '#10b981', '#3b82f6', '#f43f5e'].map((hex) => (
                        <button
                          key={hex}
                          onClick={() => updateTheme({ accentColor: hex })}
                          style={{ backgroundColor: hex }}
                          className={`w-6 h-6 rounded-md border border-slate-200 transition-transform hover:scale-110 ${
                            theme.accentColor.toLowerCase() === hex.toLowerCase() ? 'ring-2 ring-blue-500' : ''
                          }`}
                          title={hex}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar Finish */}
                <div className="pt-3 border-t border-slate-100">
                  <label className="block font-bold text-slate-800 mb-2">Sidebar Background Finish</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'charcoal' as SidebarTone, label: 'Charcoal #545454', desc: 'Agency Baseline' },
                      { id: 'dark' as SidebarTone, label: 'Pure Obsidian', desc: 'Dark OLED' },
                      { id: 'accent-border' as SidebarTone, label: 'Gold Trimmed', desc: 'Amber Border' },
                      { id: 'light' as SidebarTone, label: 'Clean Light', desc: 'White Theme' }
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => updateTheme({ sidebarTone: t.id })}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          theme.sidebarTone === t.id
                            ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="font-bold text-slate-900 text-xs">{t.label}</div>
                        <div className="text-[10px] text-slate-500">{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 3: Agency Identity & Logo */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Image className="w-4 h-4 text-slate-600" />
                  <span>Company Logo & Brand Identity</span>
                </div>

                {/* Logo Style Options */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">
                    Logo Display Format
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {[
                      { id: 'monogram' as LogoStyle, label: 'Monogram Badge', desc: 'Gold on Charcoal' },
                      { id: 'shield-emblem' as LogoStyle, label: 'Tech Shield', desc: 'Geometric Vector' },
                      { id: 'custom-image' as LogoStyle, label: 'Custom Logo Image', desc: 'External Asset' },
                      { id: 'minimal-text' as LogoStyle, label: 'Minimal Wordmark', desc: 'Typographic' }
                    ].map((s) => (
                      <button
                        key={s.id}
                        onClick={() => updateTheme({ logoStyle: s.id })}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          theme.logoStyle === s.id
                            ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="font-bold text-slate-900 text-xs">{s.label}</div>
                        <div className="text-[10px] text-slate-500">{s.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Logo URL */}
                {theme.logoStyle === 'custom-image' && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      Custom Logo URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={theme.logoImageUrl || ''}
                        onChange={(e) => updateTheme({ logoImageUrl: e.target.value })}
                        placeholder="https://example.com/logo.svg"
                        className="flex-1 px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl"
                      />
                      <button
                        onClick={() =>
                          updateTheme({
                            logoImageUrl:
                              'https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/layers.svg'
                          })
                        }
                        className="px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-xl hover:bg-slate-100"
                      >
                        Use Sample
                      </button>
                    </div>
                  </div>
                )}

                {/* Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Legal Company Name
                    </label>
                    <input
                      type="text"
                      value={theme.companyName}
                      onChange={(e) => updateTheme({ companyName: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-medium"
                      placeholder="Open Technology PLC"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Short Monogram Code
                    </label>
                    <input
                      type="text"
                      value={theme.companyShortName}
                      onChange={(e) => updateTheme({ companyShortName: e.target.value.toUpperCase() })}
                      maxLength={5}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase font-bold"
                      placeholder="OTP"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Agency Tagline
                    </label>
                    <input
                      type="text"
                      value={theme.companyTagline}
                      onChange={(e) => updateTheme({ companyTagline: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
                      placeholder="Marketing & Digital Advertising Agency"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: Simplicity & Layout Density */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-slate-600" />
                  <span>UI Simplicity & Layout Density</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Spacing Density
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'compact' as LayoutDensity, label: 'Compact' },
                        { id: 'comfortable' as LayoutDensity, label: 'Comfortable' },
                        { id: 'spacious' as LayoutDensity, label: 'Spacious' }
                      ].map((d) => (
                        <button
                          key={d.id}
                          onClick={() => updateTheme({ density: d.id })}
                          className={`py-2 px-2 text-center rounded-xl border text-xs font-semibold transition-all ${
                            theme.density === d.id
                              ? 'border-slate-900 bg-slate-900 text-white'
                              : 'border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-2">
                      Corner Radius
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { id: 'sharp' as BorderRadiusOption, label: 'Sharp' },
                        { id: 'subtle' as BorderRadiusOption, label: '6px' },
                        { id: 'modern' as BorderRadiusOption, label: '10px' },
                        { id: 'rounded' as BorderRadiusOption, label: '16px' }
                      ].map((r) => (
                        <button
                          key={r.id}
                          onClick={() => updateTheme({ borderRadius: r.id })}
                          className={`py-2 px-1 text-center rounded-xl border text-xs font-semibold transition-all ${
                            theme.borderRadius === r.id
                              ? 'border-slate-900 bg-slate-900 text-white'
                              : 'border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50/50 cursor-pointer">
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Distraction-Free Mode</div>
                      <div className="text-[11px] text-slate-500">
                        Hide decorative sidebar meter and highlight purely operational data tables
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={theme.hideDecorativeCards}
                      onChange={(e) => updateTheme({ hideDecorativeCards: e.target.checked })}
                      className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50/50 cursor-pointer">
                    <div>
                      <div className="font-bold text-slate-900 text-xs">High-Contrast Table Dividers</div>
                      <div className="text-[11px] text-slate-500">
                        Crisp hairline outlines for rapid accounting and lead scanning
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={theme.highContrastTables}
                      onChange={(e) => updateTheme({ highContrastTables: e.target.checked })}
                      className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Right Col: Live Interactive Component Sandbox */}
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs sticky top-20 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Real-Time Component Preview</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">#feb913 & #545454</span>
                </div>

                {/* Mini Sidebar Preview */}
                <div
                  className="p-4 rounded-xl text-white shadow-md space-y-3"
                  style={{
                    backgroundColor:
                      theme.sidebarTone === 'charcoal'
                        ? '#3b3b3b'
                        : theme.sidebarTone === 'dark'
                        ? '#18181b'
                        : theme.sidebarTone === 'accent-border'
                        ? '#323232'
                        : '#ffffff',
                    color: theme.sidebarTone === 'light' ? '#1e293b' : '#ffffff',
                    borderRight:
                      theme.sidebarTone === 'accent-border'
                        ? `3px solid ${theme.accentColor}`
                        : undefined
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    {theme.logoStyle === 'shield-emblem' ? (
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: theme.primaryColor, border: `2px solid ${theme.accentColor}` }}
                      >
                        <Shield className="w-4 h-4" style={{ color: theme.accentColor }} />
                      </div>
                    ) : theme.logoStyle === 'custom-image' && theme.logoImageUrl ? (
                      <img
                        src={theme.logoImageUrl}
                        alt="Logo"
                        className="w-8 h-8 object-contain rounded-lg border bg-white p-0.5"
                        style={{ borderColor: theme.accentColor }}
                      />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs tracking-wider shrink-0"
                        style={{
                          backgroundColor: theme.primaryColor,
                          color: theme.accentColor,
                          border: `2px solid ${theme.accentColor}`
                        }}
                      >
                        {theme.companyShortName}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="font-bold text-xs truncate">{theme.companyName}</div>
                      <div className="text-[10px] opacity-70 truncate">{theme.companyTagline}</div>
                    </div>
                  </div>

                  {/* Active Nav Item */}
                  <div
                    className="p-2.5 rounded-lg text-xs font-bold flex items-center justify-between shadow-xs"
                    style={{
                      backgroundColor: theme.accentColor,
                      color: '#1a1a1a'
                    }}
                  >
                    <span>Executive Dashboard</span>
                    <span className="text-[10px] bg-black/20 px-1.5 py-0.5 rounded-sm">Active</span>
                  </div>

                  <div className="p-2 rounded-lg text-xs opacity-80 flex items-center justify-between hover:bg-white/10">
                    <span>Projects & Operations</span>
                    <span className="text-[10px] opacity-60">12</span>
                  </div>
                </div>

                {/* Sample KPI Card */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>Monthly Agency Revenue</span>
                    <span
                      className="px-2 py-0.5 rounded-full font-bold text-[10px]"
                      style={{ backgroundColor: `${theme.accentColor}25`, color: '#7c5800' }}
                    >
                      +18.4%
                    </span>
                  </div>
                  <div className="text-xl font-bold font-mono text-slate-900">4,850,000 ETB</div>
                  <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: '74%', backgroundColor: theme.accentColor }}
                    />
                  </div>
                </div>

                {/* Action Button Test */}
                <div className="space-y-2 pt-2">
                  <button
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-transform active:scale-95"
                    style={{
                      backgroundColor: theme.accentColor,
                      color: '#1a1a1a'
                    }}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Primary Action (#feb913)</span>
                  </button>

                  <button
                    className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-white shadow-xs transition-colors"
                    style={{
                      backgroundColor: theme.primaryColor
                    }}
                  >
                    Secondary Action (#545454)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM & DATABASE */}
      {activeTab === 'system' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Cloud Firestore Infrastructure</h3>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Firestore Database Provisioned & Synced</span>
              </div>
              <p className="text-emerald-700 text-[11px] leading-relaxed">
                24 normalized collections configured with zero-trust security rules and automated transaction audit trails.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Security Rules:</span>
                <span className="font-mono font-bold text-slate-900">Hardened ABAC rules v2</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Dual-Stream Sync:</span>
                <span className="font-bold text-blue-600">Active (Non-destructive)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Local State Fallback:</span>
                <span className="font-bold text-emerald-600">Enabled & Resilient</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Demo Seed & Environment Recovery</h3>
            <p className="text-slate-500 leading-relaxed">
              Open Technology PLC realistic agency datasets (Telebirr, Dashen Bank, Ride, Kuriftu, SMM 1,080 pipeline, and multi-department staff).
            </p>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div className="font-semibold text-slate-800">Reset Demo Database</div>
              <p className="text-slate-500 text-[11px]">
                Restore standard baseline projects, leads, invoices, and production assets.
              </p>
              <button
                onClick={() => {
                  resetToSampleData();
                  setSeedNotice('ERP environment re-seeded with sample data!');
                  setTimeout(() => setSeedNotice(null), 3000);
                }}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-seed Sample Data
              </button>
              {seedNotice && (
                <div className="text-emerald-700 text-[11px] font-semibold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {seedNotice}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
