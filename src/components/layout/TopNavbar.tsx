import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Search,
  Bell,
  ShieldCheck,
  ChevronDown,
  RefreshCw,
  Database,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  Briefcase,
  Palette
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole, AppModule } from '../../types';
import { LogOut } from 'lucide-react';

interface TopNavbarProps {
  onToggleSidebar: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onToggleSidebar }) => {
  const {
    currentUser,
    setUserRole,
    currentModule,
    setCurrentModule,
    navigateTo,
    theme,
    setIsCustomizerOpen,
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    isFirebaseConnected,
    resetToSampleData,
    searchQuery,
    setSearchQuery,
    clients,
    projects,
    leads,
    employees
  } = useERP();

  const { userProfile, updateUserRole, logout } = useAuth();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const rolesList: UserRole[] = [
    'Super Administrator',
    'Managing Director',
    'Finance Manager',
    'Marketing Manager',
    'Project Manager',
    'Social Media Manager',
    'Designer / Content Creator',
    'Media Buyer',
    'HR Manager',
    'Employee'
  ];

  const moduleTitles: Record<AppModule, { title: string; subtitle: string }> = {
    dashboard: { title: 'Executive Overview', subtitle: 'Real-time operational KPIs & company health' },
    crm: { title: 'CRM & Sales Pipeline', subtitle: 'Lead tracking, client accounts & deal conversions' },
    projects: { title: 'Projects & Operations', subtitle: 'Deliverables, task assignments & Gantt milestones' },
    smm: { title: 'Social Media Hub', subtitle: 'Annual 1,080 post quota, monthly schedules & 6-stage workflow' },
    advertising: { title: 'Advertising & Performance', subtitle: 'Multi-platform ad spend, CPC/CTR & ROAS tracking' },
    finance: { title: 'Finance & Dual-Stream Ledger', subtitle: 'Black cash & white bank streams, non-destructive audit trail' },
    hr: { title: 'HR & Team Workload', subtitle: 'Employee records, department capacity & leave management' },
    procurement: { title: 'Procurement & Assets', subtitle: '5-stage purchase requests, vendor directory & camera equipment' },
    reports: { title: 'Reports & Analytics', subtitle: 'Exportable business intelligence & financial statements' },
    settings: { title: 'Settings & RBAC Administration', subtitle: 'Company configurations & role permissions' }
  };

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (roleMenuRef.current && !roleMenuRef.current.contains(event.target as Node)) {
        setShowRoleMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Quick search matching results
  const matchingClients = searchQuery.trim()
    ? clients.filter((c) => c.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];
  const matchingProjects = searchQuery.trim()
    ? projects.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];
  const matchingLeads = searchQuery.trim()
    ? leads.filter((l) => l.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const hasSearchResults =
    searchQuery.trim().length > 0 &&
    (matchingClients.length > 0 || matchingProjects.length > 0 || matchingLeads.length > 0);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Left: Mobile hamburger + Breadcrumbs */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-hidden"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="truncate max-w-[140px] sm:max-w-none">{theme.companyName || 'Open Technology PLC'}</span>
              <span className="text-slate-300">/</span>
              <span className="font-semibold capitalize text-slate-800">{currentModule}</span>
            </div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
              {moduleTitles[currentModule]?.title || 'ERP Portal'}
            </h1>
          </div>
        </div>

        {/* Center: Global Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-6 relative" ref={searchRef}>
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              placeholder="Search clients, projects, leads, campaigns..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs border border-slate-200 focus:border-blue-500 rounded-xl focus:outline-hidden transition-all text-slate-800 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Search Dropdown */}
          {showSearchDropdown && hasSearchResults && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 max-h-80 overflow-y-auto">
              {matchingProjects.length > 0 && (
                <div className="p-2 border-b border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Projects ({matchingProjects.length})
                  </div>
                  {matchingProjects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        navigateTo('projects');
                        setShowSearchDropdown(false);
                      }}
                      className="w-full text-left px-2 py-1.5 hover:bg-blue-50 rounded-lg flex items-center justify-between text-xs"
                    >
                      <span className="font-medium text-slate-800 truncate">{p.name}</span>
                      <span className="text-[10px] text-blue-600 font-semibold">{p.status}</span>
                    </button>
                  ))}
                </div>
              )}

              {matchingClients.length > 0 && (
                <div className="p-2 border-b border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Clients ({matchingClients.length})
                  </div>
                  {matchingClients.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        navigateTo('crm', 'clients');
                        setShowSearchDropdown(false);
                      }}
                      className="w-full text-left px-2 py-1.5 hover:bg-blue-50 rounded-lg flex items-center justify-between text-xs"
                    >
                      <span className="font-medium text-slate-800 truncate">{c.companyName}</span>
                      <span className="text-[10px] text-slate-500">{c.industry}</span>
                    </button>
                  ))}
                </div>
              )}

              {matchingLeads.length > 0 && (
                <div className="p-2">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Sales Leads ({matchingLeads.length})
                  </div>
                  {matchingLeads.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => {
                        navigateTo('crm', 'pipeline');
                        setShowSearchDropdown(false);
                      }}
                      className="w-full text-left px-2 py-1.5 hover:bg-blue-50 rounded-lg flex items-center justify-between text-xs"
                    >
                      <span className="font-medium text-slate-800 truncate">{l.companyName}</span>
                      <span className="text-[10px] font-medium text-emerald-600">{l.stage}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Firestore indicator */}
          <div
            title="Cloud Firestore Connection Status"
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Firestore Synced</span>
          </div>

          {/* Theme & Brand Customizer Button */}
          <button
            onClick={() => setIsCustomizerOpen(true)}
            title="Full control over brand colors, logo, and UI simplicity"
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-all text-xs font-semibold text-slate-800 shadow-2xs group"
            aria-label="Customize Brand and UI"
          >
            <div className="flex -space-x-1.5 items-center">
              <span
                className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs"
                style={{ backgroundColor: theme.primaryColor }}
              />
              <span
                className="w-3.5 h-3.5 rounded-full border border-white shadow-2xs"
                style={{ backgroundColor: theme.accentColor }}
              />
            </div>
            <span className="hidden sm:inline text-xs font-semibold">Design & Brand</span>
          </button>

          {/* Quick Demo Reset / Seed button */}
          <button
            onClick={() => {
              if (window.confirm('Reset ERP state to standard Open Technology PLC sample data?')) {
                resetToSampleData();
              }
            }}
            title="Reset to fresh demo sample data"
            className="p-1.5 sm:px-2 sm:py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px] font-medium">Seed Data</span>
          </button>

          {/* Notifications Drawer Toggle */}
          <div className="relative" ref={notifMenuRef}>
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-xs">Notifications</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      {unreadCount} unread
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        if (n.linkModule) {
                          navigateTo(n.linkModule);
                          setShowNotifMenu(false);
                        }
                      }}
                      className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3 ${
                        !n.isRead ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <div className="mt-0.5">
                        {n.type === 'Deadline' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                        {n.type === 'Approval' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                        {n.type === 'Budget' && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                        {n.type === 'Invoice' && <FileText className="w-4 h-4 text-indigo-500" />}
                        {n.type === 'Leave' && <User className="w-4 h-4 text-purple-500" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-semibold text-slate-900">{n.title}</h4>
                          <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Role Switcher */}
          <div className="relative" ref={roleMenuRef}>
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/70 hover:bg-slate-100 transition-all text-xs"
              aria-label="Switch User Role"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <div className="text-left hidden sm:block">
                <div className="text-[10px] uppercase font-bold text-slate-400 leading-none">Role</div>
                <div className="font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
                  {userProfile?.role || currentUser.role}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-2 overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-100 text-[11px] font-medium text-slate-500">
                  Switch Role (Test RBAC Permissions)
                </div>
                <div className="max-h-72 overflow-y-auto py-1 space-y-0.5">
                  {rolesList.map((r) => {
                    const activeRole = userProfile?.role || currentUser.role;
                    const isCurrent = activeRole === r;
                    return (
                      <button
                        key={r}
                        onClick={() => {
                          updateUserRole(r);
                          setUserRole(r);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          isCurrent
                            ? 'bg-blue-50 text-blue-700 font-semibold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span>{r}</span>
                        {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* User profile avatar & dropdown */}
          <div className="relative pl-1" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-blue-400 transition-all"
              aria-label="User Account Menu"
            >
              <img
                src={userProfile?.avatarUrl || currentUser.avatarUrl}
                alt={userProfile?.fullName || currentUser.fullName}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-200"
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 p-3 overflow-hidden text-xs">
                <div className="pb-3 border-b border-slate-100">
                  <div className="font-bold text-slate-900 text-sm">
                    {userProfile?.fullName || currentUser.fullName}
                  </div>
                  <div className="text-slate-500 text-[11px] truncate">
                    {userProfile?.email || currentUser.email}
                  </div>
                  <div className="mt-1.5 inline-block px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px]">
                    {userProfile?.role || currentUser.role}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={async () => {
                      setShowProfileMenu(false);
                      await logout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
