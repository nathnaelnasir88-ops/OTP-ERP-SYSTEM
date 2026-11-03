import React from 'react';
import {
  LayoutDashboard,
  Users2,
  FolderKanban,
  Share2,
  Megaphone,
  Wallet,
  UserCheck,
  PackageCheck,
  BarChart3,
  Settings,
  Flame,
  ChevronRight,
  Palette,
  Shield,
  Lock,
  MessageSquare
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import { AppModule } from '../../types';
import { calculateSMMMetrics } from '../../utils/calculations';
import { hasModuleAccess, getDefaultModuleForRole, filterAccessibleNavItems } from '../../utils/rbac';
import { getEraDefinition } from '../../utils/eraSystems';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    currentModule,
    setCurrentModule,
    projects,
    contentAssets,
    leads,
    settings,
    theme,
    setIsCustomizerOpen,
    chatMessages
  } = useERP();
  const { userProfile } = useAuth();

  const activeRole = userProfile?.role || currentUser?.role || 'Super Administrator';
  const isSuperAdmin = activeRole === 'Super Administrator';

  // Automatically reroute if user's current module is not allowed for their active role
  React.useEffect(() => {
    if (activeRole && !hasModuleAccess(activeRole, currentModule)) {
      const fallbackModule = getDefaultModuleForRole(activeRole);
      setCurrentModule(fallbackModule);
    }
  }, [activeRole, currentModule, setCurrentModule]);

  const smmMetrics = calculateSMMMetrics(contentAssets, settings.annualSmmTarget);

  const activeProjectsCount = projects.filter((p) => p.status === 'Active').length;
  const activeLeadsCount = leads.filter((l) => l.stage !== 'Won' && l.stage !== 'Lost').length;
  const reviewContentCount = contentAssets.filter(
    (c) => c.productionStatus === 'Review' || c.approvalStatus === 'Pending'
  ).length;

  const navItems: {
    id: AppModule;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
  }[] = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'messages', label: 'Messages & Team Chat', icon: MessageSquare, badge: `${chatMessages.length} live` },
    { id: 'crm', label: 'CRM & Sales', icon: Users2, badge: activeLeadsCount },
    { id: 'projects', label: 'Projects & Operations', icon: FolderKanban, badge: activeProjectsCount },
    { id: 'smm', label: 'Social Media Hub', icon: Share2, badge: reviewContentCount > 0 ? `${reviewContentCount} review` : undefined },
    { id: 'advertising', label: 'Advertising & Campaigns', icon: Megaphone },
    { id: 'finance', label: 'Finance & Ledger', icon: Wallet, badge: 'Dual-Stream' },
    { id: 'hr', label: 'HR & Team', icon: UserCheck },
    { id: 'procurement', label: 'Procurement & Assets', icon: PackageCheck },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings & Admin', icon: Settings },
  ];

  // Dynamically filter navigation items based on active role permissions
  const accessibleNavItems = filterAccessibleNavItems(navItems, activeRole);

  return (
    <>
      {/* Backdrop when drawer is opened */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/25 backdrop-blur-xs transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-3 bottom-3 left-3 z-50 w-72 rounded-[28px] bg-white text-[#1d1d1f] border border-slate-200/80 shadow-2xl transition-transform duration-300 ease-out flex flex-col overflow-hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-[115%]'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-[#f8f9fb]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-black flex items-center justify-center shadow-xs shrink-0 border border-slate-200">
              <img
                src={theme.logoImageUrl || '/assets/aistudio/2025-07-24_12.34.50_1f1aaac7.jpg'}
                alt={theme.companyName || 'OTP'}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm tracking-tight truncate text-[#1d1d1f]" title={theme.companyName}>
                {theme.companyName || 'Open Technology PLC'}
              </div>
              <div className="text-[11px] text-slate-500 font-medium truncate">
                {activeRole}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#eef0f4] hover:bg-slate-200 flex items-center justify-center text-slate-600 text-xs transition-colors"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* SMM Target Mini-Tracker Banner */}
        {!theme.hideDecorativeCards && hasModuleAccess(activeRole, 'smm') && (
          <div className="mx-3 mt-3 p-3.5 rounded-2xl bg-[#f5f6f8] border border-slate-200/60 text-xs">
            <div className="flex items-center justify-between text-[#1d1d1f] mb-1.5">
              <span className="flex items-center gap-1.5 font-semibold text-[11px]">
                <Flame className="w-3.5 h-3.5 text-[#f73b9b]" />
                Annual SMM Target
              </span>
              <span className="font-bold font-mono text-[11px] text-[#1d7dfa]">
                {smmMetrics.totalPublished} / {smmMetrics.targetAnnual}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200/80 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#1ec94c] cognify-stripes transition-all duration-500"
                style={{
                  width: `${Math.max(6, Math.min(100, smmMetrics.annualFulfillmentRate))}%`
                }}
              />
            </div>
            <div className="flex justify-between items-center mt-1.5 text-[10px] text-slate-500 font-medium">
              <span>{smmMetrics.annualFulfillmentRate}% fulfilled</span>
              <span>{smmMetrics.remainingQuota} remaining</span>
            </div>
          </div>
        )}

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto" aria-label="Main ERP Navigation">
          <div className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Modules ({accessibleNavItems.length})</span>
            <span className="font-mono text-[10px] text-slate-500 truncate max-w-[130px]">
              {activeRole}
            </span>
          </div>

          {accessibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentModule === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentModule(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-[#1d1d1f] text-white shadow-xs'
                    : 'text-[#1d1d1f] hover:bg-[#eef0f4]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-500 group-hover:text-[#1d1d1f]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 text-[10px] rounded-full font-semibold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-[#eef0f4] text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80 text-white" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer info: Brand Studio for Super Admin, Brand Info for other roles */}
        <div className="p-3.5 border-t border-slate-100 bg-[#f8f9fb] text-xs">
          {isSuperAdmin ? (
            <button
              onClick={() => {
                setIsCustomizerOpen(true);
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-full text-xs font-medium bg-[#1d1d1f] text-white hover:bg-[#323235] flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Customize Brand & UI</span>
            </button>
          ) : (
            <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-white border border-slate-200/80 text-[11px] text-slate-500 shadow-xs">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <span>{theme.era ? getEraDefinition(theme.era).iconEmoji : '⚡'}</span>
                <span>{theme.era ? getEraDefinition(theme.era).name : 'Brand Theme'}</span>
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                <Lock className="w-2.5 h-2.5" /> Managed by Admin
              </span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
