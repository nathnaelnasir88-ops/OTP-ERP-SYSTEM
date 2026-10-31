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
  Sparkles,
  Palette,
  Shield
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import { AppModule } from '../../types';
import { calculateSMMMetrics } from '../../utils/calculations';
import { hasModuleAccess, getDefaultModuleForRole, filterAccessibleNavItems } from '../../utils/rbac';

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
    setIsCustomizerOpen
  } = useERP();
  const { userProfile } = useAuth();

  const activeRole = userProfile?.role || currentUser?.role || 'Super Administrator';

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
    badgeColor?: string;
  }[] = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'crm', label: 'CRM & Sales', icon: Users2, badge: activeLeadsCount, badgeColor: 'bg-amber-100 text-amber-900' },
    { id: 'projects', label: 'Projects & Operations', icon: FolderKanban, badge: activeProjectsCount, badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'smm', label: 'Social Media Hub', icon: Share2, badge: reviewContentCount > 0 ? `${reviewContentCount} review` : undefined, badgeColor: 'bg-amber-100 text-amber-900' },
    { id: 'advertising', label: 'Advertising & Campaigns', icon: Megaphone },
    { id: 'finance', label: 'Finance & Ledger', icon: Wallet, badge: 'Dual-Stream', badgeColor: 'bg-amber-100 text-amber-900' },
    { id: 'hr', label: 'HR & Team', icon: UserCheck },
    { id: 'procurement', label: 'Procurement & Assets', icon: PackageCheck },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings & Admin', icon: Settings },
  ];

  // Dynamically filter navigation items based on active role permissions
  const accessibleNavItems = filterAccessibleNavItems(navItems, activeRole);

  // Dynamic sidebar tone styles
  const getSidebarBackground = () => {
    switch (theme.sidebarTone) {
      case 'charcoal':
        return 'bg-[#3b3b3b] text-slate-100 border-[#4d4d4d]';
      case 'dark':
        return 'bg-[#18181b] text-slate-100 border-[#27272a]';
      case 'light':
        return 'bg-white text-slate-800 border-slate-200';
      case 'accent-border':
        return 'bg-[#323232] text-slate-100 border-r-2 border-[#feb913]';
      default:
        return 'bg-[#3b3b3b] text-slate-100 border-[#4d4d4d]';
    }
  };

  const getHeaderBackground = () => {
    switch (theme.sidebarTone) {
      case 'light':
        return 'bg-slate-50 border-slate-200';
      case 'dark':
        return 'bg-[#121215] border-[#27272a]';
      default:
        return 'bg-[#2e2e2e] border-[#444444]';
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 transition-transform duration-200 ease-in-out lg:translate-x-0 flex flex-col border-r shadow-lg ${getSidebarBackground()} ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className={`flex items-center justify-between px-5 py-4 border-b ${getHeaderBackground()}`}>
          <div className="flex items-center gap-3 min-w-0">
            {/* Dynamic Logo rendering */}
            {theme.logoStyle === 'custom-image' && theme.logoImageUrl ? (
              <img
                src={theme.logoImageUrl}
                alt={theme.companyName}
                className="w-10 h-10 rounded-xl object-contain bg-white p-1 shadow-md border"
                style={{ borderColor: theme.accentColor }}
                onError={(e) => {
                  // Fallback to monogram if image fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : theme.logoStyle === 'shield-emblem' ? (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md shrink-0"
                style={{ backgroundColor: theme.primaryColor, border: `2px solid ${theme.accentColor}` }}
              >
                <Shield className="w-5 h-5" style={{ color: theme.accentColor }} />
              </div>
            ) : (
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm tracking-wider shadow-md shrink-0 transition-transform hover:scale-105"
                style={{
                  backgroundColor: theme.primaryColor,
                  color: theme.accentColor,
                  border: `2px solid ${theme.accentColor}`,
                  boxShadow: `0 4px 12px ${theme.accentColor}33`
                }}
              >
                {theme.companyShortName || 'OTP'}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm tracking-tight truncate text-white" title={theme.companyName}>
                {theme.companyName || 'Open Technology PLC'}
              </div>
              <div className="text-[11px] text-slate-300 font-medium flex items-center gap-1.5 truncate">
                <span
                  className="w-2 h-2 rounded-full shrink-0 animate-pulse"
                  style={{ backgroundColor: theme.accentColor }}
                ></span>
                <span className="truncate">{theme.companyTagline || 'Agency ERP'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* SMM Target Mini-Tracker Banner (Only displayed if enabled and active role has access to SMM module) */}
        {!theme.hideDecorativeCards && hasModuleAccess(activeRole, 'smm') && (
          <div className="mx-3 mt-3 p-3 rounded-xl bg-black/25 border border-white/10 text-xs">
            <div className="flex items-center justify-between text-slate-200 mb-1.5">
              <span className="flex items-center gap-1.5 font-medium text-slate-200 text-[11px]">
                <Flame className="w-3.5 h-3.5" style={{ color: theme.accentColor }} />
                Annual SMM Target
              </span>
              <span className="font-bold font-mono text-[11px]" style={{ color: theme.accentColor }}>
                {smmMetrics.totalPublished} / {smmMetrics.targetAnnual}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-black/40 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, smmMetrics.annualFulfillmentRate)}%`,
                  backgroundColor: theme.accentColor
                }}
              />
            </div>
            <div className="flex justify-between items-center mt-1.5 text-[10px] text-slate-300 font-medium">
              <span>{smmMetrics.annualFulfillmentRate}% fulfilled</span>
              <span>{smmMetrics.remainingQuota} remaining</span>
            </div>
          </div>
        )}

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto" aria-label="Main ERP Navigation">
          <div className="px-3 pb-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Modules ({accessibleNavItems.length})</span>
            <span
              className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold truncate max-w-[130px]"
              style={{ backgroundColor: `${theme.accentColor}25`, color: theme.accentColor }}
              title={`Role: ${activeRole}`}
            >
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
                style={
                  isActive
                    ? {
                        backgroundColor: theme.accentColor,
                        color: '#1a1a1a',
                        fontWeight: 700,
                        boxShadow: `0 4px 14px ${theme.accentColor}40`
                      }
                    : undefined
                }
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? ''
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive
                        ? 'text-slate-950 font-bold'
                        : 'text-slate-300 group-hover:text-amber-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                        isActive
                          ? 'bg-black/20 text-slate-900'
                          : 'bg-black/30 text-amber-200 border border-amber-300/20'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-90 text-slate-950" />}
                </div>
              </button>
            );
          })}
        </nav>


        {/* Footer info & Customizer Quick Trigger */}
        <div className={`p-3.5 border-t border-white/10 ${getHeaderBackground()} text-xs`}>
          <button
            onClick={() => setIsCustomizerOpen(true)}
            className="w-full py-2 px-3 mb-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all border shadow-xs"
            style={{
              backgroundColor: `${theme.accentColor}20`,
              borderColor: `${theme.accentColor}60`,
              color: theme.accentColor
            }}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Customize Brand & UI</span>
          </button>

          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>{theme.companyShortName} ERP System</span>
            <span
              className="font-mono text-[9px] px-1.5 py-0.5 rounded-sm font-semibold"
              style={{ backgroundColor: `${theme.accentColor}25`, color: theme.accentColor }}
            >
              #545454 & #feb913
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
