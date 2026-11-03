import React, { useState, useEffect } from 'react';
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
  Eye,
  EyeOff,
  Check,
  User,
  UserPlus,
  Users,
  Copy,
  Trash2,
  KeyRound,
  ShieldAlert,
  Info,
  CheckCircle,
  Briefcase,
  Phone,
  Mail,
  BadgeAlert,
  Edit3,
  X,
  Award
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole, Department, SidebarTone, LogoStyle, LayoutDensity, BorderRadiusOption, ManagedUserAccount } from '../../types';
import { ERA_LIST, getEraDefinition } from '../../utils/eraSystems';

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
    setEra,
    resetTheme,
    addEmployee,
    recordAuditLog,
    setIsTimeRewardsModalOpen,
    rewardConfig
  } = useERP();

  const {
    userProfile,
    updateUserProfile,
    managedAccounts,
    addMemberByAdmin,
    removeMemberByAdmin,
    updateMemberByAdmin
  } = useAuth();

  const isSuperAdmin = userProfile?.role === 'Super Administrator';

  type SettingsTab = 'profile' | 'brand' | 'members' | 'roles' | 'company' | 'system';
  const [activeTab, setActiveTab] = useState<SettingsTab>(isSuperAdmin ? 'members' : 'profile');

  // Enforce access control: if user is not Super Administrator, clamp to 'profile' or 'brand'
  useEffect(() => {
    if (!isSuperAdmin && activeTab !== 'profile' && activeTab !== 'brand') {
      setActiveTab('profile');
    }
  }, [isSuperAdmin, activeTab]);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [seedNotice, setSeedNotice] = useState<string | null>(null);

  // Profile Form (For all users to edit their own name and personal details)
  const [profileForm, setProfileForm] = useState({
    fullName: userProfile?.fullName || currentUser?.fullName || '',
    position: userProfile?.position || 'Agency Staff',
    phone: userProfile?.phone || '+251 911 000000',
    bio: userProfile?.bio || '',
    avatarUrl: userProfile?.avatarUrl || ''
  });

  // Sync profile form when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setProfileForm({
        fullName: userProfile.fullName,
        position: userProfile.position || 'Agency Staff',
        phone: userProfile.phone || '+251 911 000000',
        bio: userProfile.bio || '',
        avatarUrl: userProfile.avatarUrl || ''
      });
    }
  }, [userProfile]);

  // Member Provisioning Form (Super Admin only)
  const [newMember, setNewMember] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    role: 'Employee' as UserRole,
    department: 'Marketing' as Department,
    position: '',
    phone: ''
  });

  const [revealedPasswords, setRevealedPasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [recentCreatedCreds, setRecentCreatedCreds] = useState<{
    fullName: string;
    username: string;
    password: string;
    role: string;
  } | null>(null);

  // Edit Existing User State & Role Management (Super Admin)
  const [editingMember, setEditingMember] = useState<ManagedUserAccount | null>(null);
  const [editForm, setEditForm] = useState({
    fullName: '',
    role: 'Employee' as UserRole,
    department: 'Marketing' as Department,
    position: '',
    phone: '',
    password: '',
    status: 'Active' as 'Active' | 'Inactive'
  });

  const handleOpenEditMember = (member: ManagedUserAccount) => {
    setEditingMember(member);
    setEditForm({
      fullName: member.fullName,
      role: member.role,
      department: member.department,
      position: member.position || '',
      phone: member.phone || '',
      password: '',
      status: member.status === 'Inactive' ? 'Inactive' : 'Active'
    });
  };

  const handleUpdateRoleDirectly = async (acc: ManagedUserAccount, newRole: UserRole) => {
    if (newRole === acc.role) return;
    const prevRole = acc.role;
    if (acc.username === 'admin' && newRole !== 'Super Administrator') {
      if (!window.confirm('Warning: Demoting the primary root "admin" account will remove its Super Administrator privileges. Continue?')) {
        return;
      }
    }

    await updateMemberByAdmin(acc.id, { role: newRole });

    recordAuditLog({
      domain: 'hr',
      action: 'UPDATE',
      entityType: 'UserRole',
      entityId: acc.username,
      summary: `Super Administrator changed role for ${acc.fullName} from "${prevRole}" to "${newRole}"`,
      previousValue: `Role: ${prevRole}`,
      newValue: `Role: ${newRole}`,
      department: acc.department || 'Management',
      severity: 'elevated'
    });

    setSuccessMessage(`Role for ${acc.fullName} changed to ${newRole}!`);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleSaveEditMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    const prevRole = editingMember.role;
    if (editingMember.username === 'admin' && editForm.role !== 'Super Administrator') {
      if (!window.confirm('Warning: Demoting the primary root "admin" account will remove its Super Administrator privileges. Continue?')) {
        return;
      }
    }

    const updates: Partial<ManagedUserAccount> = {
      fullName: editForm.fullName.trim(),
      role: editForm.role,
      department: editForm.department,
      position: editForm.position.trim(),
      phone: editForm.phone.trim(),
      status: editForm.status
    };

    if (editForm.password.trim()) {
      updates.password = editForm.password.trim();
    }

    await updateMemberByAdmin(editingMember.id, updates);

    if (editForm.role !== prevRole) {
      recordAuditLog({
        domain: 'hr',
        action: 'UPDATE',
        entityType: 'UserRole',
        entityId: editingMember.username,
        summary: `Super Administrator changed role for ${editingMember.fullName} from "${prevRole}" to "${editForm.role}"`,
        previousValue: `Role: ${prevRole}`,
        newValue: `Role: ${editForm.role}`,
        department: editForm.department,
        severity: 'elevated'
      });
    }

    setEditingMember(null);
    setSuccessMessage(`Account details and role for ${editForm.fullName} updated successfully!`);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  // Company Settings Form (Super Admin only)
  const [companyForm, setCompanyForm] = useState({
    companyName: settings.companyName,
    annualSmmTarget: settings.annualSmmTarget,
    baseCurrency: settings.baseCurrency,
    whiteBankInitialBalance: settings.whiteBankInitialBalance,
    blackCashInitialBalance: settings.blackCashInitialBalance
  });

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let res = 'OTP@';
    for (let i = 0; i < 6; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewMember((prev) => ({ ...prev, password: res }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.fullName.trim()) return;

    await updateUserProfile({
      fullName: profileForm.fullName.trim(),
      position: profileForm.position.trim(),
      phone: profileForm.phone.trim(),
      bio: profileForm.bio.trim(),
      avatarUrl: profileForm.avatarUrl.trim()
    });

    setSuccessMessage('Your profile name and personal details have been updated successfully!');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.fullName || !newMember.username || !newMember.password || !newMember.email) {
      return;
    }

    try {
      const created = await addMemberByAdmin({
        fullName: newMember.fullName.trim(),
        username: newMember.username.trim().toLowerCase(),
        email: newMember.email.trim().toLowerCase(),
        password: newMember.password.trim(),
        role: newMember.role,
        department: newMember.department,
        position: newMember.position.trim() || `${newMember.role} Specialist`,
        phone: newMember.phone.trim() || '+251 911 000000',
        status: 'Active'
      });

      // Also register in ERP employee directory
      addEmployee({
        employeeId: `OTP-${Math.floor(100 + Math.random() * 900)}`,
        fullName: created.fullName,
        department: created.department,
        position: created.position || `${created.role} Specialist`,
        email: created.email,
        phone: created.phone || '+251 911 000000',
        reportingManager: 'Nathnael Nasir',
        status: 'Active',
        joiningDate: new Date().toISOString().split('T')[0],
        workloadCapacity: 75
      });

      setRecentCreatedCreds({
        fullName: created.fullName,
        username: created.username,
        password: created.password,
        role: created.role
      });

      setNewMember({
        fullName: '',
        username: '',
        email: '',
        password: '',
        role: 'Employee',
        department: 'Marketing',
        position: '',
        phone: ''
      });

      setSuccessMessage(`Account for ${created.fullName} provisioned with login credentials!`);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      console.error('Error creating member:', err);
    }
  };

  const handleCopyCredentials = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveCompanySettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(companyForm);
    setSuccessMessage('Agency configuration and corporate targets updated!');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const rolesMatrix: {
    role: UserRole;
    scope: string;
    modules: string[];
    approvalLimit: string;
  }[] = [
    {
      role: 'Super Administrator',
      scope: 'Full global system administration & access control',
      modules: ['All 10 Modules', 'Member Provisioning', 'Database Backup', 'Audit Log Override'],
      approvalLimit: 'Unlimited'
    },
    {
      role: 'Managing Director',
      scope: 'Executive sign-off, contracts, financials, and company roadmap',
      modules: ['Dashboard', 'CRM', 'Projects', 'SMM Hub', 'Ads', 'Finance', 'HR', 'Procurement', 'Reports', 'Settings'],
      approvalLimit: 'Unlimited'
    },
    {
      role: 'Finance Manager',
      scope: 'Dual-stream ledger management, tax compliance, invoices, and reversals',
      modules: ['Finance & Accounting', 'Invoices', 'Purchase Orders', 'Executive Dashboard', 'Reports', 'Settings'],
      approvalLimit: 'Up to 5,000,000 ETB'
    },
    {
      role: 'Marketing Manager',
      scope: 'Client relationships, proposals, brand guidelines, and campaign sign-off',
      modules: ['CRM & Sales', 'SMM Hub', 'Advertising', 'Projects', 'Marketing Reports', 'Settings'],
      approvalLimit: 'Up to 1,500,000 ETB'
    },
    {
      role: 'Project Manager',
      scope: 'Operations planning, task dispatch, deadlines, and milestone sign-off',
      modules: ['Projects & Operations', 'Task Kanban', 'CRM Deals', 'Operations Reports', 'Settings'],
      approvalLimit: 'Deliverables & Deadlines'
    },
    {
      role: 'Social Media Manager',
      scope: 'Annual 1,080 SMM quota, weekly calendars, Canva QA, and scheduling',
      modules: ['Social Media Hub', 'Content Calendar', 'Asset Library', 'SMM Analytics', 'Settings'],
      approvalLimit: 'Content Publishing'
    },
    {
      role: 'Designer / Content Creator',
      scope: 'Canva design, motion graphics, video editing, and storyboards',
      modules: ['Assigned Tasks', 'SMM Ideation & Canva', 'Asset Submissions', 'Settings'],
      approvalLimit: 'Draft Submission'
    },
    {
      role: 'Media Buyer',
      scope: 'Performance advertising, Meta & Google budget management, ROAS QA',
      modules: ['Advertising & Campaigns', 'Ad Spend Analytics', 'CPC/CPL Reports', 'Settings'],
      approvalLimit: 'Up to 500,000 ETB Spend'
    },
    {
      role: 'HR Manager',
      scope: 'Employee profiles, recruitment, leave requests, and workload tracking',
      modules: ['HR & Team', 'Leave Approvals', 'Employee Directory', 'Staff Capacity', 'Settings'],
      approvalLimit: 'Leave & Personnel'
    },
    {
      role: 'Employee',
      scope: 'Personal task execution, leave submission, and workload logs',
      modules: ['My Assigned Tasks', 'Apply for Leave', 'Personal Profile & UI Settings'],
      approvalLimit: 'None'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Role Access Banner for Non-Super-Admins */}
      {!isSuperAdmin && (
        <div className="bg-amber-50/80 border border-amber-200/80 p-4 rounded-2xl flex items-start gap-3 text-xs text-amber-900 shadow-xs">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-bold text-amber-950 flex items-center gap-2">
              <span>Standard Employee Access Mode</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-200/60 font-mono text-amber-800">
                {userProfile?.role || currentUser.role}
              </span>
            </div>
            <p className="mt-0.5 text-amber-800/90 leading-relaxed">
              Administrative functions (User Provisioning, RBAC Permissions Matrix, Corporate Targets, UI Design Alterations, and Database Maintenance) are restricted to the <strong>Super Administrator</strong>. You have permission to update your personal name/profile. UI design is centrally managed corporate-wide by the Super Administrator.
            </p>
          </div>
        </div>
      )}

      {/* Global Success Notification */}
      {savedSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Navigation Tabs Header */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {/* PROFILE TAB (Available to ALL users) */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-slate-600" />
            <span>My Profile</span>
          </button>

          {/* BRAND & UI TAB (Full for Super Admin, Read-Only for other roles) */}
          <button
            onClick={() => setActiveTab('brand')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'brand'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: theme.accentColor }}
            />
            <span>Brand & UI Design {isSuperAdmin ? 'Studio' : '(Read-Only)'}</span>
            {!isSuperAdmin && <Lock className="w-3 h-3 text-slate-400 ml-0.5" />}
          </button>

          {/* TIME SPENT & LOGICAL REWARDS ENGINE STUDIO BUTTON */}
          <button
            type="button"
            onClick={() => setIsTimeRewardsModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 text-slate-700 hover:bg-white hover:text-slate-900 cursor-pointer"
          >
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Time & Rewards Engine ({rewardConfig.method})</span>
          </button>

          {/* ADMIN-ONLY TABS */}
          {isSuperAdmin && (
            <>
              <button
                onClick={() => setActiveTab('members')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'members'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-indigo-600" />
                <span>Member Provisioning & Accounts</span>
              </button>

              <button
                onClick={() => setActiveTab('roles')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'roles'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>RBAC Permissions Matrix</span>
              </button>

              <button
                onClick={() => setActiveTab('company')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'company'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-slate-600" />
                <span>Agency Configuration & Targets</span>
              </button>

              <button
                onClick={() => setActiveTab('system')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === 'system'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-cyan-600" />
                <span>System & Cloud Firestore</span>
              </button>
            </>
          )}
        </div>

        {/* Current Active Role Badge */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Current Role:</span>
          <span
            className="px-2.5 py-1 rounded-lg font-bold text-[11px] border"
            style={{
              backgroundColor: isSuperAdmin ? `${theme.accentColor}25` : '#f1f5f9',
              borderColor: isSuperAdmin ? `${theme.accentColor}60` : '#cbd5e1',
              color: isSuperAdmin ? '#7c5800' : '#334155'
            }}
          >
            {userProfile?.role || currentUser.role}
          </span>
        </div>
      </div>

      {/* =========================================================================
          TAB 1: MY PROFILE (Available to ALL users to edit their own name and UI)
          ========================================================================= */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-2xl text-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Personal Profile Settings</h3>
              <p className="text-slate-500 mt-0.5">
                Update your display name, corporate title, contact number, and avatar image.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Self-Service Profile
              </span>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            {/* Full Name Input (Editable by all roles) */}
            <div>
              <label className="block text-slate-800 font-bold mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Your Full Name</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={profileForm.fullName}
                onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                placeholder="e.g. Nathnael Nasir"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl font-semibold text-slate-900 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                This name appears on deliverables, invoices, approval logs, and system comments.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Job Position / Title */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                  <span>Job Position / Title</span>
                </label>
                <input
                  type="text"
                  value={profileForm.position}
                  onChange={(e) => setProfileForm({ ...profileForm, position: e.target.value })}
                  placeholder="e.g. Lead Designer"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Contact Phone</span>
                </label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  placeholder="+251 911 000000"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800"
                />
              </div>
            </div>

            {/* Corporate Email (Locked) */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>Corporate Email (Managed by Admin)</span>
              </label>
              <input
                type="text"
                disabled
                value={userProfile?.email || currentUser?.email || 'employee@opentechplc.com'}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed font-mono"
              />
            </div>

            {/* Role & Department (Locked with clear badge for non-super-admins) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
              <div>
                <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 mb-1">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>Assigned Role</span>
                </div>
                <div className="font-bold text-slate-900">{userProfile?.role || currentUser.role}</div>
                <span className="text-[10px] text-slate-400">Assigned by Super Administrator</span>
              </div>
              <div>
                <div className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 mb-1">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  <span>Department</span>
                </div>
                <div className="font-bold text-slate-900">
                  {userProfile?.department || currentUser?.department || 'Management'}
                </div>
                <span className="text-[10px] text-slate-400">Organizational Unit</span>
              </div>
            </div>

            {/* Avatar URL */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Avatar Image URL</label>
              <div className="flex gap-3 items-center">
                <img
                  src={profileForm.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt="Avatar Preview"
                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs"
                />
                <input
                  type="url"
                  value={profileForm.avatarUrl}
                  onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-xl text-slate-800"
                />
              </div>
            </div>

            {/* Bio / Work Notes */}
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Bio / Notes</label>
              <textarea
                rows={2}
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                placeholder="Brief professional focus or shift schedule..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                style={{
                  backgroundColor: theme.accentColor,
                  color: '#1a1a1a'
                }}
                className="px-5 py-2.5 rounded-xl font-bold text-xs shadow-xs hover:opacity-90 transition-all flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          TAB 2: MEMBER PROVISIONING & ACCOUNTS (SUPER ADMIN ONLY)
          ========================================================================= */}
      {isSuperAdmin && activeTab === 'members' && (
        <div className="space-y-6 text-xs">
          {/* Recent Credentials Banner if created */}
          {recentCreatedCreds && (
            <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl flex items-start justify-between gap-3 shadow-xs animate-in fade-in duration-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-900 text-sm">
                    Account Created: {recentCreatedCreds.fullName} ({recentCreatedCreds.role})
                  </h4>
                  <div className="mt-1 font-mono text-[11px] text-emerald-800 space-y-0.5">
                    <div>Username: <strong>{recentCreatedCreds.username}</strong></div>
                    <div>Password: <strong>{recentCreatedCreds.password}</strong></div>
                  </div>
                  <p className="text-[10px] text-emerald-700 mt-1">
                    Send these credentials to the team member for instant sign in.
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  handleCopyCredentials(
                    `OTP ERP Credentials\nUsername: ${recentCreatedCreds.username}\nPassword: ${recentCreatedCreds.password}`,
                    'recent'
                  )
                }
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 transition-colors shrink-0"
              >
                {copiedId === 'recent' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === 'recent' ? 'Copied' : 'Copy Credentials'}</span>
              </button>
            </div>
          )}

          {/* Form to Add New Team Member Manually */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-indigo-600" />
                  <span>Manual Member Provisioning</span>
                </h3>
                <p className="text-slate-500">
                  Super Administrator adds employees directly with login username, password, and assigned role.
                </p>
              </div>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-lg border border-indigo-200">
                Super Admin Privilege
              </span>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-slate-800 font-semibold mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newMember.fullName}
                    onChange={(e) => {
                      const name = e.target.value;
                      const suggested = name
                        .toLowerCase()
                        .trim()
                        .replace(/\s+/g, '.');
                      setNewMember((prev) => ({
                        ...prev,
                        fullName: name,
                        username: prev.username || suggested
                      }));
                    }}
                    placeholder="e.g. Solomon Desta"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                {/* Login Username */}
                <div>
                  <label className="block text-slate-800 font-semibold mb-1 flex items-center justify-between">
                    <span>
                      Login Username <span className="text-rose-500">*</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Used on sign-in page</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newMember.username}
                    onChange={(e) => {
                      const uname = e.target.value.toLowerCase().replace(/\s+/g, '');
                      setNewMember((prev) => ({ ...prev, username: uname }));
                    }}
                    placeholder="e.g. solomon.d"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Corporate Email */}
                <div>
                  <label className="block text-slate-800 font-semibold mb-1">
                    Corporate Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={newMember.email}
                    onChange={(e) => {
                      const em = e.target.value;
                      setNewMember((prev) => ({ ...prev, email: em }));
                    }}
                    placeholder="solomon@opentechplc.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                {/* Login Password */}
                <div>
                  <label className="block text-slate-800 font-semibold mb-1 flex items-center justify-between">
                    <span>
                      Login Password <span className="text-rose-500">*</span>
                    </span>
                    <button
                      type="button"
                      onClick={generateRandomPassword}
                      className="text-[10px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" /> Generate Password
                    </button>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={newMember.password}
                      onChange={(e) => {
                        const pass = e.target.value;
                        setNewMember((prev) => ({ ...prev, password: pass }));
                      }}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-slate-900"
                    />
                    <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* Role */}
                <div>
                  <label className="block text-slate-800 font-semibold mb-1">Assigned Role</label>
                  <select
                    value={newMember.role}
                    onChange={(e) => {
                      const r = e.target.value as UserRole;
                      setNewMember((prev) => ({ ...prev, role: r }));
                    }}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="Super Administrator">Super Administrator</option>
                    <option value="Managing Director">Managing Director</option>
                    <option value="Finance Manager">Finance Manager</option>
                    <option value="Marketing Manager">Marketing Manager</option>
                    <option value="Project Manager">Project Manager</option>
                    <option value="Social Media Manager">Social Media Manager</option>
                    <option value="Designer / Content Creator">Designer</option>
                    <option value="Media Buyer">Media Buyer</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="Employee">Employee</option>
                  </select>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-slate-800 font-semibold mb-1">Department</label>
                  <select
                    value={newMember.department}
                    onChange={(e) => {
                      const d = e.target.value as Department;
                      setNewMember((prev) => ({ ...prev, department: d }));
                    }}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="Management">Management</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Creative & Design">Creative & Design</option>
                    <option value="Video Production">Video Production</option>
                    <option value="Advertising">Advertising</option>
                    <option value="Administration">Administration</option>
                  </select>
                </div>

                {/* Position */}
                <div>
                  <label className="block text-slate-800 font-semibold mb-1">Position / Title</label>
                  <input
                    type="text"
                    value={newMember.position}
                    onChange={(e) => {
                      const pos = e.target.value;
                      setNewMember((prev) => ({ ...prev, position: pos }));
                    }}
                    placeholder="e.g. Senior Copywriter"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-slate-800 font-semibold mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={newMember.phone}
                    onChange={(e) => {
                      const ph = e.target.value;
                      setNewMember((prev) => ({ ...prev, phone: ph }));
                    }}
                    placeholder="+251 911 ..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>


              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Account is stored securely in Firestore and immediately valid for employee login.
                </span>
                <button
                  type="submit"
                  style={{
                    backgroundColor: theme.primaryColor,
                    color: theme.accentColor,
                    borderColor: theme.accentColor
                  }}
                  className="px-5 py-2.5 border rounded-xl font-bold shadow-xs hover:brightness-110 transition-all flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Provision Member Account</span>
                </button>
              </div>
            </form>
          </div>

          {/* Roster of Active Accounts */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-700" />
                  <span>Corporate Member Accounts Roster ({managedAccounts.length})</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Active login accounts and credentials provisioned by Super Administrator
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Member</th>
                    <th className="py-3 px-4">Login Username</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Password</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {managedAccounts.map((acc) => {
                    const isRevealed = revealedPasswords[acc.id] || false;
                    return (
                      <tr key={acc.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={acc.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                              alt={acc.fullName}
                              className="w-7 h-7 rounded-lg object-cover border border-slate-200"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{acc.fullName}</div>
                              <div className="text-[10px] text-slate-400">{acc.position || 'Staff'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">
                          {acc.username}
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">{acc.email}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 font-mono text-[11px]">
                            <span>{isRevealed ? acc.password : '••••••••'}</span>
                            <button
                              type="button"
                              onClick={() =>
                                setRevealedPasswords((prev) => ({
                                  ...prev,
                                  [acc.id]: !isRevealed
                                }))
                              }
                              className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
                              title={isRevealed ? 'Hide Password' : 'Show Password'}
                            >
                              {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyCredentials(
                                  `Username: ${acc.username}\nPassword: ${acc.password}`,
                                  acc.id
                                )
                              }
                              className="p-1 text-slate-400 hover:text-indigo-600 rounded-md"
                              title="Copy Credentials"
                            >
                              {copiedId === acc.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={acc.role}
                            onChange={(e) => handleUpdateRoleDirectly(acc, e.target.value as UserRole)}
                            title="Change user role (Super Admin)"
                            aria-label={`Change role for ${acc.fullName}`}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer focus:outline-hidden ${
                              acc.role === 'Super Administrator'
                                ? 'bg-amber-50 text-amber-900 border-amber-300 focus:ring-2 focus:ring-amber-500'
                                : acc.role === 'Managing Director'
                                ? 'bg-purple-50 text-purple-900 border-purple-300 focus:ring-2 focus:ring-purple-500'
                                : acc.role === 'Finance Manager'
                                ? 'bg-emerald-50 text-emerald-900 border-emerald-300 focus:ring-2 focus:ring-emerald-500'
                                : acc.role === 'Marketing Manager'
                                ? 'bg-blue-50 text-blue-900 border-blue-300 focus:ring-2 focus:ring-blue-500'
                                : acc.role === 'Project Manager'
                                ? 'bg-cyan-50 text-cyan-900 border-cyan-300 focus:ring-2 focus:ring-cyan-500'
                                : acc.role === 'Social Media Manager'
                                ? 'bg-pink-50 text-pink-900 border-pink-300 focus:ring-2 focus:ring-pink-500'
                                : acc.role === 'Designer / Content Creator'
                                ? 'bg-fuchsia-50 text-fuchsia-900 border-fuchsia-300 focus:ring-2 focus:ring-fuchsia-500'
                                : acc.role === 'Media Buyer'
                                ? 'bg-orange-50 text-orange-900 border-orange-300 focus:ring-2 focus:ring-orange-500'
                                : acc.role === 'HR Manager'
                                ? 'bg-teal-50 text-teal-900 border-teal-300 focus:ring-2 focus:ring-teal-500'
                                : 'bg-slate-50 text-slate-800 border-slate-300 focus:ring-2 focus:ring-slate-500'
                            }`}
                          >
                            <option value="Super Administrator">Super Administrator</option>
                            <option value="Managing Director">Managing Director</option>
                            <option value="Finance Manager">Finance Manager</option>
                            <option value="Marketing Manager">Marketing Manager</option>
                            <option value="Project Manager">Project Manager</option>
                            <option value="Social Media Manager">Social Media Manager</option>
                            <option value="Designer / Content Creator">Designer</option>
                            <option value="Media Buyer">Media Buyer</option>
                            <option value="HR Manager">HR Manager</option>
                            <option value="Employee">Employee</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{acc.department}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditMember(acc)}
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                              title="Edit Member Role & Account"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            {acc.username !== 'admin' && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Remove member account for ${acc.fullName}?`)) {
                                    removeMemberByAdmin(acc.id);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                title="Remove Member"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit Member & Role Modal */}
          {editingMember && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
              <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-150">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
                  <div className="flex items-center gap-3">
                    <img
                      src={editingMember.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={editingMember.fullName}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-xs"
                    />
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <span>Edit Member: {editingMember.fullName}</span>
                      </h3>
                      <p className="text-[11px] text-slate-500 font-mono">
                        @{editingMember.username} • {editingMember.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setEditingMember(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveEditMember} className="p-6 space-y-4 text-xs">
                  {/* Full Name */}
                  <div>
                    <label className="block text-slate-800 font-semibold mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={editForm.fullName}
                      onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-900 font-medium"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Assigned Role */}
                    <div>
                      <label className="block text-slate-800 font-semibold mb-1">
                        Assigned Role <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value as UserRole })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-slate-900 bg-white"
                      >
                        <option value="Super Administrator">Super Administrator</option>
                        <option value="Managing Director">Managing Director</option>
                        <option value="Finance Manager">Finance Manager</option>
                        <option value="Marketing Manager">Marketing Manager</option>
                        <option value="Project Manager">Project Manager</option>
                        <option value="Social Media Manager">Social Media Manager</option>
                        <option value="Designer / Content Creator">Designer</option>
                        <option value="Media Buyer">Media Buyer</option>
                        <option value="HR Manager">HR Manager</option>
                        <option value="Employee">Employee</option>
                      </select>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        Determines module access & permissions
                      </span>
                    </div>

                    {/* Department */}
                    <div>
                      <label className="block text-slate-800 font-semibold mb-1">Department</label>
                      <select
                        value={editForm.department}
                        onChange={(e) => setEditForm({ ...editForm, department: e.target.value as Department })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium text-slate-900 bg-white"
                      >
                        <option value="Management">Management</option>
                        <option value="Finance">Finance</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Creative & Design">Creative & Design</option>
                        <option value="Video Production">Video Production</option>
                        <option value="Advertising">Advertising</option>
                        <option value="Administration">Administration</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Position */}
                    <div>
                      <label className="block text-slate-800 font-semibold mb-1">Position / Title</label>
                      <input
                        type="text"
                        value={editForm.position}
                        onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                        placeholder="e.g. Senior Strategist"
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-slate-800 font-semibold mb-1">Contact Phone</label>
                      <input
                        type="text"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        placeholder="+251 911 ..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Reset Password Optional Field */}
                  <div>
                    <label className="block text-slate-800 font-semibold mb-1 flex items-center justify-between">
                      <span>Reset Password (Optional)</span>
                      <span className="text-[10px] text-slate-400">Leave blank to keep existing password</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={editForm.password}
                        onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                        placeholder="Enter new password to reset..."
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-slate-900 text-xs"
                      />
                      <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Account Status */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-xs">Account Access Status</div>
                      <div className="text-[11px] text-slate-500">Allow or suspend member sign in</div>
                    </div>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value as 'Active' | 'Inactive' })}
                      className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-bold"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Suspended</option>
                    </select>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setEditingMember(null)}
                      className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#1d1d1f] hover:bg-slate-800 text-white rounded-xl font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Member & Role Changes</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: BRAND & UI DESIGN STUDIO (FULL CONTROL)
          ========================================================================= */}
      {activeTab === 'brand' && (
        <div className="space-y-6 text-xs">
          {/* Super Admin Restriction Alert Banner */}
          {!isSuperAdmin && (
            <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900 shadow-xs">
              <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold flex items-center gap-2">
                  <span>UI Design System Managed by Super Administrator</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-200/60 font-mono text-amber-800">
                    {userProfile?.role || currentUser.role}
                  </span>
                </div>
                <p className="mt-0.5 text-amber-800/90 leading-relaxed">
                  Only the <strong>Super Administrator</strong> has privilege to change design eras, corporate colors, sidebar styling, and interface simplicity. You are viewing active system designs in read-only mode.
                </p>
              </div>
            </div>
          )}

          {/* Header & Status */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl overflow-hidden bg-black flex items-center justify-center shadow-md shrink-0 border border-black/20">
                <img
                  src={theme.logoImageUrl || '/assets/aistudio/2025-07-24_12.34.50_1f1aaac7.jpg'}
                  alt={theme.companyName || 'OTP'}
                  className="w-full h-full object-cover"
                />
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

            {isSuperAdmin ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    updateTheme({
                      primaryColor: '#545454',
                      accentColor: '#feb913',
                      sidebarTone: 'charcoal'
                    });
                    setSavedSuccess(true);
                    setSuccessMessage('Signature OTP palette #545454 and #feb913 applied!');
                    setTimeout(() => setSavedSuccess(false), 3000);
                  }}
                  className="px-3.5 py-2 text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
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
                    setSuccessMessage('UI theme reset to standard defaults.');
                    setTimeout(() => setSavedSuccess(false), 3000);
                  }}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 font-semibold text-xs">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Customization Locked (Admin Only)</span>
              </div>
            )}
          </div>

          {/* Grid Layout: Controls & Live Sandbox */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Controls */}
            <fieldset disabled={!isSuperAdmin} className={`lg:col-span-2 space-y-6 ${!isSuperAdmin ? 'opacity-85' : ''}`}>
              {/* Era Design Systems Selection */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#1ec94c]" />
                    <span>ERP Era Design Systems</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold">
                    Morphs entire ERP UI
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ERA_LIST.map((era) => {
                    const isSelected = (theme.era || 'cognify-bento') === era.id;
                    return (
                      <button
                        key={era.id}
                        type="button"
                        disabled={!isSuperAdmin}
                        onClick={() => {
                          if (!isSuperAdmin) return;
                          setEra(era.id);
                          setSuccessMessage(`Activated ${era.name}! Every area in the ERP system has updated.`);
                          setSavedSuccess(true);
                          setTimeout(() => setSavedSuccess(false), 3000);
                        }}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-900/10 shadow-xs'
                            : !isSuperAdmin
                            ? 'border-slate-200 bg-slate-50/50 cursor-not-allowed opacity-75'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 cursor-pointer'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-base">{era.iconEmoji}</span>
                            <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-slate-200/70 text-slate-700">
                              {era.eraName.split(' ')[0]}
                            </span>
                          </div>
                          <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                            <span>{era.name}</span>
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#1ec94c]" />
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                            {era.tagline}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-100 text-[10px]">
                          <div className="flex items-center gap-1">
                            <div className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: era.primaryColor }} />
                            <div className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ backgroundColor: era.accentColor }} />
                          </div>
                          <span className={`font-bold flex items-center gap-1 ${isSelected ? 'text-[#1ec94c]' : !isSuperAdmin ? 'text-slate-400' : 'text-slate-600'}`}>
                            {isSelected ? 'Active Era' : !isSuperAdmin ? <><Lock className="w-2.5 h-2.5 text-slate-400" /> Admin Only</> : 'Switch Era →'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Presets */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Palette className="w-4 h-4" style={{ color: theme.accentColor }} />
                  <span>Curated Agency Palettes</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      name: 'OTP Agency Signature',
                      tagline: 'Charcoal #545454 & Golden Sun #feb913',
                      primary: '#545454',
                      accent: '#feb913',
                      sidebar: 'charcoal' as SidebarTone
                    },
                    {
                      name: 'Dark Slate & Amber',
                      tagline: 'Deep onyx foundation with amber gold',
                      primary: '#27272a',
                      accent: '#f59e0b',
                      sidebar: 'dark' as SidebarTone
                    },
                    {
                      name: 'Clean Executive White',
                      tagline: 'Crisp light border with warm yellow highlight',
                      primary: '#475569',
                      accent: '#feb913',
                      sidebar: 'light' as SidebarTone
                    },
                    {
                      name: 'High-Impact Gold Accent',
                      tagline: 'Solid charcoal backdrop with golden neon edge',
                      primary: '#333333',
                      accent: '#feb913',
                      sidebar: 'accent-border' as SidebarTone
                    }
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        updateTheme({
                          primaryColor: preset.primary,
                          accentColor: preset.accent,
                          sidebarTone: preset.sidebar
                        });
                      }}
                      className="p-3 rounded-xl border text-left transition-all hover:shadow-md flex items-center justify-between"
                      style={{
                        borderColor: theme.primaryColor === preset.primary && theme.accentColor === preset.accent ? theme.accentColor : '#e2e8f0',
                        backgroundColor: theme.primaryColor === preset.primary && theme.accentColor === preset.accent ? `${theme.accentColor}10` : '#ffffff'
                      }}
                    >
                      <div>
                        <div className="font-bold text-slate-900">{preset.name}</div>
                        <div className="text-[10px] text-slate-500">{preset.tagline}</div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="w-5 h-5 rounded-full border shadow-xs" style={{ backgroundColor: preset.primary }} />
                        <div className="w-5 h-5 rounded-full border shadow-xs" style={{ backgroundColor: preset.accent }} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Exact Colors Picker */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="font-bold text-slate-900 text-sm">Fine-Tune Color Codes</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Primary Color (Hex)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.primaryColor}
                        onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer border p-0.5"
                      />
                      <input
                        type="text"
                        value={theme.primaryColor}
                        onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                        className="flex-1 px-3 py-2 border rounded-xl font-mono text-xs uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Accent Gold Color (Hex)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={theme.accentColor}
                        onChange={(e) => updateTheme({ accentColor: e.target.value })}
                        className="w-10 h-10 rounded-lg cursor-pointer border p-0.5"
                      />
                      <input
                        type="text"
                        value={theme.accentColor}
                        onChange={(e) => updateTheme({ accentColor: e.target.value })}
                        className="flex-1 px-3 py-2 border rounded-xl font-mono text-xs uppercase"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Tone & Layout Density */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="font-bold text-slate-900 text-sm">Sidebar Theme & Layout Density</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['charcoal', 'dark', 'light', 'accent-border'] as SidebarTone[]).map((tone) => (
                    <button
                      key={tone}
                      onClick={() => updateTheme({ sidebarTone: tone })}
                      className={`p-2.5 rounded-xl border text-center capitalize font-semibold transition-all ${
                        theme.sidebarTone === tone
                          ? 'border-amber-400 bg-amber-50 text-amber-900 font-bold shadow-xs'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {tone.replace('-', ' ')}
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold text-slate-800">Interface Simplicity Mode</div>
                    <div className="text-[11px] text-slate-500">Minimize decorative cards for faster operational navigation</div>
                  </div>
                  <button
                    onClick={() => updateTheme({ hideDecorativeCards: !theme.hideDecorativeCards })}
                    className={`px-3 py-1.5 rounded-xl font-semibold border transition-all ${
                      theme.hideDecorativeCards
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {theme.hideDecorativeCards ? 'Simplicity Mode Active' : 'Normal Visuals'}
                  </button>
                </div>
              </div>
            </fieldset>

            {/* Right Col: Live Interactive Preview */}
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="font-bold text-slate-900 text-sm flex items-center justify-between">
                  <span>Theme Live Preview</span>
                  <span className="text-[10px] text-slate-400">Real-time</span>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 space-y-3 bg-slate-50/50">
                  <div
                    className="p-3 rounded-xl flex items-center justify-between text-white shadow-xs"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <div className="font-bold">Primary Element</div>
                    <span
                      className="px-2 py-0.5 rounded-full font-bold text-[10px]"
                      style={{ backgroundColor: theme.accentColor, color: '#1a1a1a' }}
                    >
                      Accent Badge
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="flex-1 py-2 font-bold rounded-xl text-center shadow-xs"
                      style={{ backgroundColor: theme.accentColor, color: '#1a1a1a' }}
                    >
                      Gold Action (#feb913)
                    </button>
                    <button
                      className="flex-1 py-2 font-semibold text-white rounded-xl text-center shadow-xs"
                      style={{ backgroundColor: theme.primaryColor }}
                    >
                      Charcoal (#545454)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: ROLE-BASED ACCESS CONTROL (RBAC) MATRIX (SUPER ADMIN ONLY)
          ========================================================================= */}
      {isSuperAdmin && activeTab === 'roles' && (
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

      {/* =========================================================================
          TAB 5: COMPANY CONFIGURATION & TARGETS (SUPER ADMIN ONLY)
          ========================================================================= */}
      {isSuperAdmin && activeTab === 'company' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs max-w-2xl text-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Agency Configuration</h3>
              <p className="text-slate-500">Corporate identity and operational target constants</p>
            </div>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-lg border border-indigo-200">
              Super Admin Only
            </span>
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

      {/* =========================================================================
          TAB 6: SYSTEM & DATABASE (SUPER ADMIN ONLY)
          ========================================================================= */}
      {isSuperAdmin && activeTab === 'system' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Cloud Firestore Infrastructure</h3>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Firestore Database Provisioned & Synced</span>
              </div>
              <p className="text-emerald-700 text-[11px] leading-relaxed">
                Collections configured with zero-trust security rules and automated transaction audit trails.
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
