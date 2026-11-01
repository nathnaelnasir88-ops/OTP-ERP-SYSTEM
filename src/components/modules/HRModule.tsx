import React, { useState } from 'react';
import {
  Users,
  Plus,
  Briefcase,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  ShieldAlert,
  Percent,
  ShieldCheck,
  Search,
  Download,
  History,
  Activity,
  ArrowRight
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';
import { Employee, Department, LeaveRequest, LeaveType, AuditActionType } from '../../types';
import { filterAuditLogs, calculateAuditLogSummary } from '../../utils/calculations';

export const HRModule: React.FC = () => {
  const {
    employees,
    addEmployee,
    updateEmployee,
    leaveRequests,
    addLeaveRequest,
    updateLeaveRequestStatus,
    tasks,
    currentUser,
    auditLogs
  } = useERP();
  const { userProfile } = useAuth();

  const activeRole = userProfile?.role || currentUser.role;
  const isSuperAdmin = activeRole === 'Super Administrator';

  const [activeTab, setActiveTab] = useState<'employees' | 'leaves' | 'workload' | 'audit'>('employees');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('All');
  const [auditScope, setAuditScope] = useState<'hr' | 'ALL'>('hr');
  const [auditActionFilter, setAuditActionFilter] = useState<AuditActionType | 'ALL'>('ALL');
  const [auditDeptFilter, setAuditDeptFilter] = useState<string>('ALL');
  const [auditSearch, setAuditSearch] = useState('');
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // New Employee state
  const [newEmp, setNewEmp] = useState({
    employeeId: `OTP-00${employees.length + 1}`,
    fullName: '',
    department: 'Creative & Design' as Department,
    position: 'Motion Graphics Designer',
    reportingManager: 'Dawit Tadesse',
    email: '',
    phone: '+251 911 000 000',
    status: 'Active' as Employee['status'],
    joiningDate: new Date().toISOString().split('T')[0],
    workloadCapacity: 80
  });

  // New Leave state
  const [newLeave, setNewLeave] = useState({
    employeeName: employees[0]?.fullName || 'Selamawit Kebede',
    leaveType: 'Annual' as LeaveType,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalDays: 3,
    reason: 'Family event and rest',
    status: 'Pending' as LeaveRequest['status']
  });

  const departments: Department[] = [
    'Management',
    'Marketing',
    'Creative & Design',
    'Video Production',
    'Advertising',
    'Finance',
    'Administration'
  ];

  const filteredEmployees = selectedDeptFilter === 'All'
    ? employees
    : employees.filter((e) => e.department === selectedDeptFilter);

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmp.fullName.trim()) return;

    addEmployee(newEmp);
    setShowAddEmployeeModal(false);
  };

  const handleCreateLeave = (e: React.FormEvent) => {
    e.preventDefault();
    addLeaveRequest(newLeave);
    setShowLeaveModal(false);
  };

  const auditSummary = calculateAuditLogSummary(auditLogs);
  const filteredAuditLogs = filterAuditLogs(auditLogs, {
    domain: auditScope,
    action: auditActionFilter,
    department: auditDeptFilter,
    searchQuery: auditSearch
  });

  const handleExportHRAuditCSV = () => {
    const headers = [
      'Timestamp',
      'Actor Name',
      'Actor Role',
      'Actor Email',
      'Module Domain',
      'Action',
      'Entity Type',
      'Entity ID',
      'Department',
      'Summary',
      'Previous Value',
      'New Value',
      'Severity'
    ];
    const rows = filteredAuditLogs.map((log) => [
      `"${log.timestamp}"`,
      `"${log.actorName}"`,
      `"${log.actorRole}"`,
      `"${log.actorEmail}"`,
      `"${log.domain}"`,
      `"${log.action}"`,
      `"${log.entityType}"`,
      `"${log.entityId}"`,
      `"${log.department || '-'}"`,
      `"${(log.summary || '').replace(/"/g, '""')}"`,
      `"${(log.previousValue || '-').replace(/"/g, '""')}"`,
      `"${(log.newValue || '-').replace(/"/g, '""')}"`,
      `"${log.severity}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `otp-hr-audit-log-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-4 rounded-[24px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 bg-[#f4f5f7] p-1.5 rounded-full">
          <button
            onClick={() => setActiveTab('employees')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'employees'
                ? 'bg-[#1d1d1f] text-white shadow-sm'
                : 'text-[#6e6e73] hover:text-[#1d1d1f]'
            }`}
          >
            Staff Directory ({employees.length})
          </button>
          <button
            onClick={() => setActiveTab('leaves')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'leaves'
                ? 'bg-[#1d1d1f] text-white shadow-sm'
                : 'text-[#6e6e73] hover:text-[#1d1d1f]'
            }`}
          >
            Leave Requests ({leaveRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('workload')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'workload'
                ? 'bg-[#1d1d1f] text-white shadow-sm'
                : 'text-[#6e6e73] hover:text-[#1d1d1f]'
            }`}
          >
            Team Workload & Capacity
          </button>
          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'audit'
                  ? 'bg-[#1d1d1f] text-white shadow-sm'
                  : 'text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#1ec94c]" />
              <span>HR & ERP Audit Log</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeTab === 'audit' ? 'bg-white/20 text-white' : 'bg-white text-[#1d1d1f]'
                }`}
              >
                {auditScope === 'hr' ? auditSummary.hrEvents : auditSummary.totalEvents}
              </span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLeaveModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Apply for Leave</span>
          </button>

          <button
            onClick={() => setShowAddEmployeeModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-blue-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Onboard Employee</span>
          </button>
        </div>
      </div>

      {/* Department summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {departments.map((dept) => {
          const count = employees.filter((e) => e.department === dept).length;
          return (
            <div
              key={dept}
              onClick={() => setSelectedDeptFilter(selectedDeptFilter === dept ? 'All' : dept)}
              className={`p-3 rounded-xl border text-center cursor-pointer transition-all ${
                selectedDeptFilter === dept
                  ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-[10px] text-slate-500 font-semibold truncate">{dept}</div>
              <div className="text-lg font-bold text-slate-900 mt-1">{count}</div>
              <div className="text-[10px] text-slate-400">Team members</div>
            </div>
          );
        })}
      </div>

      {/* TAB 1: EMPLOYEE DIRECTORY */}
      {activeTab === 'employees' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">OTP Team Roster</h3>
              <p className="text-xs text-slate-500">Department profiles and contact records</p>
            </div>
            {selectedDeptFilter !== 'All' && (
              <button
                onClick={() => setSelectedDeptFilter('All')}
                className="text-xs text-blue-600 font-semibold"
              >
                Clear Filter (Showing {selectedDeptFilter})
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Employee ID</th>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Position</th>
                  <th className="py-3 px-4">Reporting Manager</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Capacity</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-500">{emp.employeeId}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{emp.fullName}</td>
                    <td className="py-3 px-4 font-semibold text-blue-700">{emp.department}</td>
                    <td className="py-3 px-4 text-slate-700">{emp.position}</td>
                    <td className="py-3 px-4 text-slate-500">{emp.reportingManager}</td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800">{emp.email}</div>
                      <div className="text-[10px] text-slate-400">{emp.phone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              emp.workloadCapacity > 85 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${emp.workloadCapacity}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-700 text-[11px]">{emp.workloadCapacity}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() =>
                          updateEmployee(emp.id, {
                            status: emp.status === 'Active' ? 'On Leave' : 'Active'
                          })
                        }
                        title="Click to toggle employee status (logged in HR Audit Trail)"
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-colors ${
                          emp.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                        }`}
                      >
                        {emp.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: LEAVE REQUESTS */}
      {activeTab === 'leaves' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Leave Approvals</h3>
              <p className="text-xs text-slate-500">Employee absence tracking & manager sign-off</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Leave Type</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Total Days</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Manager Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaveRequests.map((leave) => (
                  <tr key={leave.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4 font-bold text-slate-900">{leave.employeeName}</td>
                    <td className="py-3 px-4 font-semibold text-purple-700">{leave.leaveType}</td>
                    <td className="py-3 px-4 text-slate-500">
                      {leave.startDate} → {leave.endDate}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{leave.totalDays} Days</td>
                    <td className="py-3 px-4 text-slate-600 max-w-xs">{leave.reason}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          leave.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : leave.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {leave.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => updateLeaveRequestStatus(leave.id, 'Approved')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-[11px]"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateLeaveRequestStatus(leave.id, 'Rejected')}
                            className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 font-semibold rounded-lg text-[11px]"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Resolved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: WORKLOAD OVERVIEW */}
      {activeTab === 'workload' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Department Capacity Utilization</h3>
            <p className="text-xs text-slate-500 mb-4">Average workload per department</p>
            <div className="space-y-3">
              {departments.map((dept) => {
                const deptEmps = employees.filter((e) => e.department === dept);
                const avgCap =
                  deptEmps.length > 0
                    ? Math.round(deptEmps.reduce((a, b) => a + b.workloadCapacity, 0) / deptEmps.length)
                    : 75;
                return (
                  <div key={dept} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800">{dept}</span>
                      <span className={avgCap > 85 ? 'text-amber-600' : 'text-slate-700'}>{avgCap}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${avgCap > 85 ? 'bg-amber-500' : 'bg-blue-600'}`}
                        style={{ width: `${avgCap}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Active Task Allocations</h3>
            <p className="text-xs text-slate-500 mb-4">Assignments across team members</p>
            <div className="space-y-2.5 max-h-80 overflow-y-auto">
              {employees.map((emp) => {
                const assignedTasks = tasks.filter((t) => t.assigneeId === emp.id);
                return (
                  <div key={emp.id} className="p-3 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{emp.fullName}</div>
                      <div className="text-[11px] text-slate-500">{emp.position}</div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-blue-600">{assignedTasks.length} Tasks</span>
                      <div className="text-[10px] text-slate-400">
                        {assignedTasks.filter((t) => t.status === 'Done').length} completed
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SUPER ADMIN HR & ERP AUDIT LOG */}
      {activeTab === 'audit' && isSuperAdmin && (
        <div className="space-y-5">
          {/* Cognify Soft Bento Audit KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-[28px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#1ec94c] flex items-center justify-center text-white shadow-[0_4px_14px_rgba(30,201,76,0.3)]">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#1d1d1f]">HR & Personnel Events</div>
                    <div className="text-[11px] text-[#86868b]">Onboarding, Leaves & Capacity</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#f4f5f7] text-[#1d1d1f] text-[11px] font-semibold">
                  Audited
                </span>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div className="text-3xl font-bold text-[#1d1d1f] tracking-tight">
                  {auditSummary.hrEvents}
                </div>
                <span className="text-xs font-medium text-[#1ec94c]">
                  Full HR change attribution
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[28px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#1d7dfa] flex items-center justify-center text-white shadow-[0_4px_14px_rgba(29,125,250,0.3)]">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#1d1d1f]">Monitored ERP Actors</div>
                    <div className="text-[11px] text-[#86868b]">Distinct Team & Admin Accounts</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#f4f5f7] text-[#1d1d1f] text-[11px] font-semibold">
                  Role Verified
                </span>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div className="text-3xl font-bold text-[#1d1d1f] tracking-tight">
                  {auditSummary.uniqueActors}
                </div>
                <span className="text-xs font-medium text-[#1d7dfa]">
                  Tracked by role & email
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[28px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#f73b9b] flex items-center justify-center text-white shadow-[0_4px_14px_rgba(247,59,155,0.3)]">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-[#1d1d1f]">Cross-ERP Audit Trail</div>
                    <div className="text-[11px] text-[#86868b]">All Modules & Approvals</div>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#f4f5f7] text-[#1d1d1f] text-[11px] font-semibold">
                  {auditSummary.financeEvents} Finance
                </span>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <div className="text-3xl font-bold text-[#1d1d1f] tracking-tight">
                  {auditSummary.totalEvents}
                </div>
                <span className="text-xs font-medium text-[#f73b9b]">
                  Complete ERP governance log
                </span>
              </div>
            </div>
          </div>

          {/* Audit Filter & Table Card */}
          <div className="bg-white rounded-[28px] border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#1d1d1f]">
                    Super Admin HR & Cross-ERP Activity Log
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#1d1d1f] text-white text-[10px] font-semibold">
                    Super Admin Exclusive
                  </span>
                </div>
                <p className="text-xs text-[#86868b] mt-0.5">
                  Track employee onboarding, leave approvals, status/workload changes, and cross-ERP modifications by actor.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center bg-[#f4f5f7] p-1 rounded-full">
                  <button
                    type="button"
                    onClick={() => setAuditScope('hr')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      auditScope === 'hr'
                        ? 'bg-[#1d1d1f] text-white shadow-xs'
                        : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                    }`}
                  >
                    HR & Team Only ({auditSummary.hrEvents})
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuditScope('ALL')}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      auditScope === 'ALL'
                        ? 'bg-[#1d1d1f] text-white shadow-xs'
                        : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                    }`}
                  >
                    All ERP Modules ({auditSummary.totalEvents})
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleExportHRAuditCSV}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#f4f5f7] hover:bg-slate-200 text-[#1d1d1f] rounded-full text-xs font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export HR Audit CSV</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="px-5 py-3.5 bg-[#f8f9fb] border-b border-slate-100 flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  placeholder="Search by actor name, employee ID, department, or leave approval..."
                  aria-label="Search HR audit log"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-full text-xs text-slate-800 focus:outline-none focus:border-slate-400"
                />
              </div>

              <select
                value={auditActionFilter}
                onChange={(e) => setAuditActionFilter(e.target.value as AuditActionType | 'ALL')}
                aria-label="Filter HR audit by action"
                className="text-xs font-semibold bg-white border border-slate-200 rounded-full px-3.5 py-2 text-slate-700"
              >
                <option value="ALL">All Action Types</option>
                <option value="CREATE">Onboard / Request (CREATE)</option>
                <option value="APPROVAL">Leave Decision (APPROVAL)</option>
                <option value="UPDATE">Profile / Capacity (UPDATE)</option>
                <option value="PAYMENT">Finance Settlement (PAYMENT)</option>
                <option value="REVERSAL">Ledger Reversal (REVERSAL)</option>
                <option value="STATUS_CHANGE">Status Change</option>
              </select>

              <select
                value={auditDeptFilter}
                onChange={(e) => setAuditDeptFilter(e.target.value)}
                aria-label="Filter HR audit by department"
                className="text-xs font-semibold bg-white border border-slate-200 rounded-full px-3.5 py-2 text-slate-700"
              >
                <option value="ALL">All Departments</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Audit Trail Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-100 text-[#86868b] uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">Timestamp</th>
                    <th className="py-3.5 px-4">Actor (Who)</th>
                    <th className="py-3.5 px-4">Module & Action</th>
                    <th className="py-3.5 px-4">Target Record</th>
                    <th className="py-3.5 px-4">Activity Description (What)</th>
                    <th className="py-3.5 px-4">State Diff (Before → After)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAuditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-10 text-center text-slate-400 text-xs">
                        No HR or ERP audit log entries match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredAuditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                log.severity === 'critical'
                                  ? 'bg-rose-500'
                                  : log.severity === 'elevated'
                                  ? 'bg-amber-500'
                                  : 'bg-[#1ec94c]'
                              }`}
                              title={`Severity: ${log.severity}`}
                            />
                            <span className="font-mono text-[11px] text-slate-600">{log.timestamp}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#1d1d1f]">{log.actorName}</div>
                          <div className="text-[10px] text-[#86868b] flex items-center gap-1.5 mt-0.5">
                            <span className="px-1.5 py-0.2 bg-[#f4f5f7] text-[#1d1d1f] rounded font-semibold">
                              {log.actorRole}
                            </span>
                            <span>• {log.actorEmail}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {log.domain}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                log.action === 'REVERSAL'
                                  ? 'bg-rose-100 text-rose-700'
                                  : log.action === 'APPROVAL' || log.action === 'PAYMENT'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : log.action === 'CREATE'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {log.action}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-mono font-bold text-slate-800">{log.entityId}</div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <span>{log.entityType}</span>
                            {(log.department || log.streamOrDepartment) && (
                              <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 text-[9px] font-bold">
                                {log.department || log.streamOrDepartment}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="font-semibold text-[#1d1d1f] leading-snug">{log.summary}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap items-center gap-1.5 text-[11px] bg-[#f8f9fb] px-2.5 py-1.5 rounded-xl border border-slate-100">
                            <span className="text-slate-500 line-through">{log.previousValue || 'None'}</span>
                            <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="font-semibold text-[#1d1d1f]">{log.newValue || 'Recorded'}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ONBOARD EMPLOYEE */}
      {showAddEmployeeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Onboard Team Member</h3>
              <button onClick={() => setShowAddEmployeeModal(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newEmp.fullName}
                  onChange={(e) => setNewEmp({ ...newEmp, fullName: e.target.value })}
                  placeholder="e.g. Almaz Tadesse"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Department</label>
                  <select
                    value={newEmp.department}
                    onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value as Department })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Position Title</label>
                  <input
                    type="text"
                    required
                    value={newEmp.position}
                    onChange={(e) => setNewEmp({ ...newEmp, position: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newEmp.email}
                    onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    value={newEmp.phone}
                    onChange={(e) => setNewEmp({ ...newEmp, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddEmployeeModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold"
                >
                  Save Employee Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: APPLY FOR LEAVE */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="text-base font-bold text-slate-900 mb-3">Submit Leave Request</h3>
            <form onSubmit={handleCreateLeave} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Employee Name</label>
                <select
                  value={newLeave.employeeName}
                  onChange={(e) => setNewLeave({ ...newLeave, employeeName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.fullName}>
                      {e.fullName} ({e.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Leave Type</label>
                  <select
                    value={newLeave.leaveType}
                    onChange={(e) => setNewLeave({ ...newLeave, leaveType: e.target.value as LeaveType })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Annual">Annual Leave</option>
                    <option value="Sick">Sick Leave</option>
                    <option value="Emergency">Emergency Leave</option>
                    <option value="Maternity/Paternity">Maternity/Paternity</option>
                    <option value="Unpaid">Unpaid Leave</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Total Days</label>
                  <input
                    type="number"
                    value={newLeave.totalDays}
                    onChange={(e) => setNewLeave({ ...newLeave, totalDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Reason & Notes</label>
                <textarea
                  rows={2}
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
