import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  ShieldCheck,
  ChevronDown,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole, AppModule } from '../../types';
import { filterAccessibleNavItems } from '../../utils/rbac';

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
    resetToSampleData,
    searchQuery,
    setSearchQuery,
    clients,
    projects,
    leads
  } = useERP();

  const { userProfile, updateUserRole, logout } = useAuth();
  const activeRole = userProfile?.role || currentUser.role || 'Super Administrator';
  const isSuperAdmin = activeRole === 'Super Administrator';

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
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

  const allNavPills: { id: AppModule; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'crm', label: 'CRM' },
    { id: 'projects', label: 'Projects' },
    { id: 'smm', label: 'SMM Hub' },
    { id: 'advertising', label: 'Ads' },
    { id: 'finance', label: 'Finance' },
    { id: 'hr', label: 'HR' },
    { id: 'procurement', label: 'Procurement' },
    { id: 'reports', label: 'Reports' },
    { id: 'settings', label: 'Settings' }
  ];

  const accessiblePills = filterAccessibleNavItems(allNavPills, activeRole);

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
    <header className="sticky top-0 z-30 bg-[#f5f6f8]/90 backdrop-blur-md px-4 sm:px-7 lg:px-9 pt-4 pb-3">
      <div className="flex items-center justify-between gap-2">
        {/* Left: Brand Pill (Cognify Style) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleSidebar}
            className="flex items-center gap-2 bg-[#ebedf0] hover:bg-[#dfe2e7] px-3.5 py-2 rounded-full transition-all group cursor-pointer"
            title="Open navigation drawer"
          >
            <div className="w-6 h-6 rounded-full bg-[#1d1d1f] text-white flex items-center justify-center font-black text-[10px] tracking-tight">
              {theme.companyShortName || 'OTP'}
            </div>
            <span className="font-bold text-sm text-[#1d1d1f] tracking-tight">
              {theme.companyName === 'Open Technology PLC' ? 'OpenTech' : theme.companyName}
            </span>
          </button>
        </div>

        {/* Center: Horizontal Pill Navigation Bar (Exact Cognify Aesthetic) */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1 max-w-full">
          {accessiblePills.map((pill) => {
            const isActive = currentModule === pill.id;
            return (
              <button
                key={pill.id}
                onClick={() => setCurrentModule(pill.id)}
                className={`px-3.5 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#1d1d1f] text-white shadow-xs'
                    : 'bg-[#ebedf0] hover:bg-[#dfe2e7] text-[#1d1d1f]'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>


        {/* Right: Circular Utility Buttons & Avatar */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Expandable Global Search Pill */}
          <div className="relative hidden sm:block" ref={searchRef}>
            {showSearchInput ? (
              <div className="flex items-center bg-white rounded-full px-3.5 py-1.5 border border-slate-200 shadow-xs w-56 transition-all">
                <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  onFocus={() => setShowSearchDropdown(true)}
                  placeholder="Search ERP..."
                  className="w-full text-xs bg-transparent focus:outline-hidden text-[#1d1d1f]"
                />
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearchInput(false);
                  }}
                  className="text-[10px] text-slate-400 hover:text-slate-700 ml-1"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearchInput(true)}
                className="w-10 h-10 rounded-full bg-[#ebedf0] hover:bg-[#dfe2e7] flex items-center justify-center text-[#1d1d1f] transition-colors"
                title="Search clients, projects, leads"
                aria-label="Search ERP"
              >
                <Search className="w-4 h-4" />
              </button>
            )}

            {/* Quick Search Results Dropdown */}
            {showSearchDropdown && hasSearchResults && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden z-50 max-h-80 overflow-y-auto p-2">
                {matchingProjects.length > 0 && (
                  <div className="p-2 border-b border-slate-100">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                      Projects ({matchingProjects.length})
                    </div>
                    {matchingProjects.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          navigateTo('projects');
                          setShowSearchDropdown(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-[#f5f6f8] rounded-xl flex items-center justify-between text-xs"
                      >
                        <span className="font-medium text-[#1d1d1f] truncate">{p.name}</span>
                        <span className="text-[10px] text-[#1d7dfa] font-semibold">{p.status}</span>
                      </button>
                    ))}
                  </div>
                )}

                {matchingClients.length > 0 && (
                  <div className="p-2 border-b border-slate-100">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                      Clients ({matchingClients.length})
                    </div>
                    {matchingClients.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          navigateTo('crm', 'clients');
                          setShowSearchDropdown(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-[#f5f6f8] rounded-xl flex items-center justify-between text-xs"
                      >
                        <span className="font-medium text-[#1d1d1f] truncate">{c.companyName}</span>
                        <span className="text-[10px] text-slate-500">{c.industry}</span>
                      </button>
                    ))}
                  </div>
                )}

                {matchingLeads.length > 0 && (
                  <div className="p-2">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                      Sales Leads ({matchingLeads.length})
                    </div>
                    {matchingLeads.map((l) => (
                      <button
                        key={l.id}
                        onClick={() => {
                          navigateTo('crm', 'pipeline');
                          setShowSearchDropdown(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-[#f5f6f8] rounded-xl flex items-center justify-between text-xs"
                      >
                        <span className="font-medium text-[#1d1d1f] truncate">{l.companyName}</span>
                        <span className="text-[10px] font-medium text-[#1ec94c]">{l.stage}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Role Switcher / Indicator Pill */}
          <div className="relative" ref={roleMenuRef}>
            {isSuperAdmin ? (
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#ebedf0] hover:bg-[#dfe2e7] transition-all text-xs cursor-pointer"
                aria-label="Switch User Role"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#1d7dfa]" />
                <div className="text-left">
                  <span className="sr-only">Role</span>
                  <span className="font-medium text-[#1d1d1f] truncate max-w-[120px]">
                    {activeRole}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>
            ) : (
              <div
                className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#ebedf0] text-xs cursor-default"
                title="Your assigned corporate role"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
                <span className="sr-only">Role</span>
                <span className="font-medium text-[#1d1d1f] truncate max-w-[120px]">
                  {activeRole}
                </span>
              </div>
            )}

            {isSuperAdmin && showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 p-2 overflow-hidden">
                <div className="px-3 py-2 border-b border-slate-100 text-[11px] font-medium text-slate-500 flex items-center justify-between">
                  <span>Switch Role (Test RBAC)</span>
                  <span className="text-[9px] bg-[#ebedf0] text-[#1d1d1f] px-2 py-0.5 rounded-full font-bold">Admin</span>
                </div>
                <div className="max-h-72 overflow-y-auto py-1 space-y-0.5">
                  {rolesList.map((r) => {
                    const isCurrent = activeRole === r;
                    return (
                      <button
                        key={r}
                        onClick={() => {
                          updateUserRole(r);
                          setUserRole(r);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 rounded-full text-xs flex items-center justify-between transition-colors ${
                          isCurrent
                            ? 'bg-[#1d1d1f] text-white font-medium'
                            : 'text-[#1d1d1f] hover:bg-[#f5f6f8]'
                        }`}
                      >
                        <span>{r}</span>
                        {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-[#1ec94c]"></span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Settings / UI Customizer Circular Button (Exact Cognify Gear Icon) */}
          <button
            onClick={() => setIsCustomizerOpen(true)}
            title="Design & Brand Studio"
            aria-label="Design & Brand"
            className="w-10 h-10 rounded-full bg-[#ebedf0] hover:bg-[#dfe2e7] flex items-center justify-center text-[#1d1d1f] transition-colors cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Notifications Bell Circular Button (with Green Dot like Cognify) */}
          <div className="relative" ref={notifMenuRef}>
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative w-10 h-10 rounded-full bg-[#ebedf0] hover:bg-[#dfe2e7] flex items-center justify-center text-[#1d1d1f] transition-colors cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#1ec94c] ring-2 ring-[#ebedf0]"></span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 bg-[#f8f9fb] border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#1d1d1f] text-xs">Notifications</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#ebedf0] text-[#1d1d1f]">
                      {unreadCount} unread
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-[11px] text-[#1d7dfa] hover:underline font-medium"
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
                      className={`p-4 hover:bg-[#f8f9fb] transition-colors cursor-pointer flex gap-3 ${
                        !n.isRead ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      <div className="mt-0.5">
                        {n.type === 'Deadline' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                        {n.type === 'Approval' && <CheckCircle2 className="w-4 h-4 text-[#1ec94c]" />}
                        {n.type === 'Budget' && <AlertTriangle className="w-4 h-4 text-[#f73b9b]" />}
                        {n.type === 'Invoice' && <FileText className="w-4 h-4 text-[#1d7dfa]" />}
                        {n.type === 'Leave' && <User className="w-4 h-4 text-purple-500" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-semibold text-[#1d1d1f]">{n.title}</h4>
                          <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Circular User Profile Avatar & Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center p-0.5 rounded-full bg-[#ebedf0] hover:ring-2 hover:ring-[#1d1d1f]/20 transition-all cursor-pointer"
              aria-label="User Account Menu"
            >
              <img
                src={userProfile?.avatarUrl || currentUser.avatarUrl}
                alt={userProfile?.fullName || currentUser.fullName}
                className="w-9 h-9 rounded-full object-cover"
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 z-50 p-2 overflow-hidden">
                <div className="px-3.5 py-3 border-b border-slate-100">
                  <div className="font-semibold text-xs text-[#1d1d1f] truncate">
                    {userProfile?.fullName || currentUser.fullName}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {userProfile?.email || currentUser.email}
                  </div>
                  <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#ebedf0] text-[#1d1d1f]">
                    <ShieldCheck className="w-3 h-3 text-[#1ec94c]" />
                    <span>{activeRole}</span>
                  </div>
                </div>

                <div className="py-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setCurrentModule('settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3.5 py-2 rounded-full text-xs text-[#1d1d1f] hover:bg-[#f5f6f8] flex items-center gap-2 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span>My Profile & Settings</span>
                  </button>

                  {isSuperAdmin && (
                    <button
                      onClick={() => {
                        if (window.confirm('Reset ERP state to standard Open Technology PLC sample data?')) {
                          resetToSampleData();
                        }
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 rounded-full text-xs text-[#1d1d1f] hover:bg-[#f5f6f8] flex items-center gap-2 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Reset Demo Data</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      logout();
                    }}
                    className="w-full text-left px-3.5 py-2 rounded-full text-xs text-rose-600 hover:bg-rose-50 font-medium flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
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
