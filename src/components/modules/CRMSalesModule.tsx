import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  CheckCircle,
  Building2,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  ArrowRight,
  TrendingUp,
  FolderPlus,
  Briefcase,
  Calendar,
  Clock,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { LeadStage, Client, Lead } from '../../types';

export const CRMSalesModule: React.FC = () => {
  const { clients, leads, addClient, updateClient, addLead, updateLead, convertLeadToProject, employees } = useERP();

  const [activeTab, setActiveTab] = useState<'pipeline' | 'clients' | 'proposals'>('pipeline');
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState<Lead | null>(null);
  const [selectedClientDetail, setSelectedClientDetail] = useState<Client | null>(null);

  // New Lead Form State
  const [newLeadData, setNewLeadData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    source: 'Referral',
    stage: 'New Lead' as LeadStage,
    estimatedValue: 1500000,
    assignedTo: 'emp-3',
    notes: ''
  });

  // New Client Form State
  const [newClientData, setNewClientData] = useState({
    clientId: `CLI-${Math.floor(1000 + Math.random() * 9000)}`,
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    industry: 'Technology & FMCG',
    address: 'Bole, Addis Ababa',
    assignedAccountManagerId: 'emp-3',
    contractValue: 2400000,
    serviceType: '360° Agency Retainer',
    status: 'Active' as Client['status'],
    notes: ''
  });

  // Convert to Project form
  const [projectNameInput, setProjectNameInput] = useState('');
  const [projectBudgetInput, setProjectBudgetInput] = useState(0);

  const pipelineStages: LeadStage[] = [
    'New Lead',
    'Contacted',
    'Meeting',
    'Proposal',
    'Negotiation',
    'Won',
    'Lost'
  ];

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadData.companyName.trim()) return;

    addLead({
      leadId: `LD-${Date.now().toString().slice(-4)}`,
      ...newLeadData
    });
    setShowAddLeadModal(false);
    setNewLeadData({
      companyName: '',
      contactPerson: '',
      email: '',
      phone: '',
      source: 'Referral',
      stage: 'New Lead',
      estimatedValue: 1500000,
      assignedTo: 'emp-3',
      notes: ''
    });
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientData.companyName.trim()) return;

    addClient(newClientData);
    setShowAddClientModal(false);
  };

  const handleConfirmConvert = () => {
    if (!showConvertModal) return;
    convertLeadToProject(
      showConvertModal.id,
      projectNameInput || `${showConvertModal.companyName} Campaign`,
      projectBudgetInput || showConvertModal.estimatedValue
    );
    setShowConvertModal(null);
  };

  const totalPipelineValue = leads
    .filter((l) => l.stage !== 'Lost')
    .reduce((acc, l) => acc + (l.estimatedValue || 0), 0);

  const wonLeadsCount = leads.filter((l) => l.stage === 'Won').length;

  return (
    <div className="space-y-6">
      {/* Top Action & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'pipeline'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sales Pipeline Kanban ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'clients'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Client Directory ({clients.length})
          </button>
          <button
            onClick={() => setActiveTab('proposals')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'proposals'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Proposals & Contracts
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddLeadModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-blue-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Sales Lead</span>
          </button>

          <button
            onClick={() => setShowAddClientModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>New Client Account</span>
          </button>
        </div>
      </div>

      {/* CRM Stats Summary Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-medium">Pipeline Deal Value</div>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {totalPipelineValue.toLocaleString()} <span className="text-xs font-normal">ETB</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-medium">Deals Won & Converted</div>
          <div className="text-xl font-bold text-emerald-600 mt-1">{wonLeadsCount} Deals</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-medium">Active Retainer Clients</div>
          <div className="text-xl font-bold text-blue-600 mt-1">
            {clients.filter((c) => c.status === 'Active').length} Accounts
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-medium">Lead-to-Project Conversion</div>
          <div className="text-xl font-bold text-purple-600 mt-1">
            {leads.length > 0 ? `${((wonLeadsCount / leads.length) * 100).toFixed(0)}%` : '0%'}
          </div>
        </div>
      </div>

      {/* TAB 1: SALES PIPELINE KANBAN */}
      {activeTab === 'pipeline' && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1200px]">
            {pipelineStages.map((stage) => {
              const stageLeads = leads.filter((l) => l.stage === stage);
              const stageValue = stageLeads.reduce((acc, l) => acc + (l.estimatedValue || 0), 0);

              return (
                <div
                  key={stage}
                  className="flex-1 bg-slate-50/80 rounded-2xl p-3 border border-slate-200/80 flex flex-col min-w-[200px]"
                >
                  {/* Stage Header */}
                  <div className="flex items-center justify-between mb-2 px-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800">{stage}</span>
                      <span className="text-[11px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 font-semibold">
                        {stageLeads.length}
                      </span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono mb-3 px-1">
                    {(stageValue / 1000).toFixed(0)}k ETB
                  </div>

                  {/* Stage Cards */}
                  <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[550px]">
                    {stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="text-xs font-bold text-slate-900 leading-snug">
                              {lead.companyName}
                            </h4>
                            <span className="text-[10px] font-mono text-slate-400 shrink-0">
                              {lead.leadId}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                            <Users className="w-3 h-3 text-slate-400" />
                            <span>{lead.contactPerson}</span>
                          </div>
                          <div className="text-[11px] font-semibold text-blue-600 mt-2">
                            {lead.estimatedValue.toLocaleString()} ETB
                          </div>
                          {lead.notes && (
                            <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                              {lead.notes}
                            </p>
                          )}
                        </div>

                        {/* Stage Mover Controls */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                          <select
                            value={lead.stage}
                            onChange={(e) => {
                              const newStage = e.target.value as LeadStage;
                              if (newStage === 'Won' && lead.stage !== 'Won') {
                                setShowConvertModal(lead);
                                setProjectNameInput(`${lead.companyName} Campaign`);
                                setProjectBudgetInput(lead.estimatedValue);
                              } else {
                                updateLead(lead.id, { stage: newStage });
                              }
                            }}
                            className="text-[11px] bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-medium text-slate-700"
                          >
                            {pipelineStages.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>

                          {lead.stage === 'Won' && !lead.wonProjectId && (
                            <button
                              onClick={() => {
                                setShowConvertModal(lead);
                                setProjectNameInput(`${lead.companyName} Campaign`);
                                setProjectBudgetInput(lead.estimatedValue);
                              }}
                              className="text-[10px] text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-md flex items-center gap-1 border border-emerald-200"
                            >
                              <FolderPlus className="w-3 h-3" /> Convert
                            </button>
                          )}
                          {lead.wonProjectId && (
                            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Live
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CLIENTS DIRECTORY */}
      {activeTab === 'clients' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">OTP Client Portfolio</h3>
              <p className="text-xs text-slate-500">Corporate accounts and retainer contracts</p>
            </div>
            <div className="text-xs font-semibold text-slate-600">
              Total Contracted: {clients.reduce((acc, c) => acc + (c.contractValue || 0), 0).toLocaleString()} ETB
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Client ID</th>
                  <th className="py-3 px-4">Company Name</th>
                  <th className="py-3 px-4">Contact Person</th>
                  <th className="py-3 px-4">Industry</th>
                  <th className="py-3 px-4">Contract Value</th>
                  <th className="py-3 px-4">Service Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-600">{client.clientId}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{client.companyName}</td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{client.contactPerson}</div>
                      <div className="text-[11px] text-slate-400">{client.email}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{client.industry}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {client.contractValue.toLocaleString()} ETB
                    </td>
                    <td className="py-3 px-4 text-slate-600">{client.serviceType}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          client.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {client.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedClientDetail(client)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        View Dossier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PROPOSALS & CONTRACTS */}
      {activeTab === 'proposals' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Standard Agency Proposals</h3>
            <p className="text-xs text-slate-500 mb-4">Proposals under review by prospective partners</p>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Safaricom Enterprise Cloud Blitz 2025
                  </h4>
                  <div className="text-[11px] text-slate-500">Proposal #OTP-PROP-24-08 • 4,200,000 ETB</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  Sent
                </span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Ethiopian Airlines Cargo E-Commerce Documentary
                  </h4>
                  <div className="text-[11px] text-slate-500">Proposal #OTP-PROP-24-07 • 5,500,000 ETB</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  Negotiating
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-2">Master Service Agreements (MSA)</h3>
            <p className="text-xs text-slate-500 mb-4">Signed active multi-year corporate agreements</p>
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-emerald-50/50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Telebirr SuperApp Annual Marketing MSA
                  </h4>
                  <div className="text-[11px] text-slate-500">Contract #OTP-CTR-2023-01 • Value: 4.8M ETB</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>
              <div className="p-3.5 rounded-xl border border-slate-200 bg-emerald-50/50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Dashen Bank Amole Digital Retainer Agreement
                  </h4>
                  <div className="text-[11px] text-slate-500">Contract #OTP-CTR-2023-02 • Value: 3.6M ETB</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD LEAD */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Add New CRM Lead</h3>
              <button
                onClick={() => setShowAddLeadModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Company / Organization Name *</label>
                <input
                  type="text"
                  required
                  value={newLeadData.companyName}
                  onChange={(e) => setNewLeadData({ ...newLeadData, companyName: e.target.value })}
                  placeholder="e.g. Awash Wine SC"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Contact Person</label>
                  <input
                    type="text"
                    value={newLeadData.contactPerson}
                    onChange={(e) => setNewLeadData({ ...newLeadData, contactPerson: e.target.value })}
                    placeholder="e.g. Abebe Bikila"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Estimated Value (ETB)</label>
                  <input
                    type="number"
                    value={newLeadData.estimatedValue}
                    onChange={(e) => setNewLeadData({ ...newLeadData, estimatedValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    value={newLeadData.email}
                    onChange={(e) => setNewLeadData({ ...newLeadData, email: e.target.value })}
                    placeholder="contact@company.com"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    value={newLeadData.phone}
                    onChange={(e) => setNewLeadData({ ...newLeadData, phone: e.target.value })}
                    placeholder="+251 911 ..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Lead Source</label>
                  <select
                    value={newLeadData.source}
                    onChange={(e) => setNewLeadData({ ...newLeadData, source: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-hidden bg-white"
                  >
                    <option value="Executive Referral">Executive Referral</option>
                    <option value="Inbound Website">Inbound Website</option>
                    <option value="Cold Outreach">Cold Outreach</option>
                    <option value="Social Media Campaign">Social Media Campaign</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Initial Stage</label>
                  <select
                    value={newLeadData.stage}
                    onChange={(e) => setNewLeadData({ ...newLeadData, stage: e.target.value as LeadStage })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-hidden bg-white"
                  >
                    {pipelineStages.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Notes & Objectives</label>
                <textarea
                  rows={2}
                  value={newLeadData.notes}
                  onChange={(e) => setNewLeadData({ ...newLeadData, notes: e.target.value })}
                  placeholder="Key campaign goals, expected scope..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Create Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CLIENT */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Add New Client Account</h3>
              <button
                onClick={() => setShowAddClientModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Client Company Name *</label>
                <input
                  type="text"
                  required
                  value={newClientData.companyName}
                  onChange={(e) => setNewClientData({ ...newClientData, companyName: e.target.value })}
                  placeholder="e.g. Zemen Bank SC"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Contact Person</label>
                  <input
                    type="text"
                    required
                    value={newClientData.contactPerson}
                    onChange={(e) => setNewClientData({ ...newClientData, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Industry</label>
                  <input
                    type="text"
                    value={newClientData.industry}
                    onChange={(e) => setNewClientData({ ...newClientData, industry: e.target.value })}
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
                    value={newClientData.email}
                    onChange={(e) => setNewClientData({ ...newClientData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    value={newClientData.phone}
                    onChange={(e) => setNewClientData({ ...newClientData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Contract Value (ETB)</label>
                  <input
                    type="number"
                    value={newClientData.contractValue}
                    onChange={(e) => setNewClientData({ ...newClientData, contractValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Service Type</label>
                  <input
                    type="text"
                    value={newClientData.serviceType}
                    onChange={(e) => setNewClientData({ ...newClientData, serviceType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddClientModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold"
                >
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONVERT WON LEAD TO PROJECT (CRITICAL WORKFLOW) */}
      {showConvertModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-emerald-600 mb-3">
              <div className="p-2 rounded-full bg-emerald-50">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Convert Won Deal to Project</h3>
                <p className="text-xs text-slate-500">Launch agency operations for this client</p>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 mb-4 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Client:</span>
                <span className="font-bold text-slate-900">{showConvertModal.companyName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Deal Value:</span>
                <span className="font-bold text-emerald-600">
                  {showConvertModal.estimatedValue.toLocaleString()} ETB
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs mb-5">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Project Name</label>
                <input
                  type="text"
                  value={projectNameInput}
                  onChange={(e) => setProjectNameInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Allocated Budget (ETB)</label>
                <input
                  type="number"
                  value={projectBudgetInput}
                  onChange={(e) => setProjectBudgetInput(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConvertModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 text-xs"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={handleConfirmConvert}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>Launch Project</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLIENT DETAIL SLIDEOVER / MODAL */}
      {selectedClientDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono text-slate-400">{selectedClientDetail.clientId}</span>
                <h3 className="text-base font-bold text-slate-900">{selectedClientDetail.companyName}</h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                {selectedClientDetail.status}
              </span>
            </div>

            <div className="py-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <div className="text-slate-400 text-[10px]">Contact Person</div>
                  <div className="font-semibold text-slate-800 mt-0.5">{selectedClientDetail.contactPerson}</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <div className="text-slate-400 text-[10px]">Industry</div>
                  <div className="font-semibold text-slate-800 mt-0.5">{selectedClientDetail.industry}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <div className="text-slate-400 text-[10px]">Email</div>
                  <div className="font-semibold text-slate-800 mt-0.5">{selectedClientDetail.email}</div>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-xl">
                  <div className="text-slate-400 text-[10px]">Phone</div>
                  <div className="font-semibold text-slate-800 mt-0.5">{selectedClientDetail.phone}</div>
                </div>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                <div className="text-blue-600 text-[10px] font-semibold uppercase">Contract Terms</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  {selectedClientDetail.contractValue.toLocaleString()} ETB
                </div>
                <div className="text-slate-600 mt-0.5">{selectedClientDetail.serviceType}</div>
              </div>

              {selectedClientDetail.notes && (
                <div>
                  <div className="text-slate-500 font-semibold mb-1">Account Notes</div>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {selectedClientDetail.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedClientDetail(null)}
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
