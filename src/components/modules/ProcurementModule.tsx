import React, { useState } from 'react';
import {
  PackageCheck,
  Plus,
  Camera,
  Laptop,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ArrowRight,
  SlidersHorizontal,
  DollarSign,
  UserCheck
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { PurchaseOrder, POStatus, Asset, AssetCategory, AssetStatus } from '../../types';

export const ProcurementModule: React.FC = () => {
  const {
    purchaseOrders,
    addPurchaseOrder,
    updatePurchaseOrderStatus,
    assets,
    addAsset,
    updateAsset,
    employees
  } = useERP();

  const [activeTab, setActiveTab] = useState<'pos' | 'assets' | 'vendors'>('pos');
  const [showAddPOModal, setShowAddPOModal] = useState(false);
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);

  // New PO State
  const [newPO, setNewPO] = useState({
    poNumber: `PO-2024-${Math.floor(100 + Math.random() * 900)}`,
    vendor: 'Camera Hub Addis',
    description: '',
    totalAmount: 120000,
    status: 'Requested' as POStatus,
    requestedBy: 'emp-5',
    date: new Date().toISOString().split('T')[0]
  });

  // New Asset State
  const [newAsset, setNewAsset] = useState({
    assetTag: `OTP-EQ-00${assets.length + 1}`,
    name: '',
    category: 'Camera & Video' as AssetCategory,
    purchaseDate: new Date().toISOString().split('T')[0],
    purchaseCost: 280000,
    assignedTo: 'emp-5',
    status: 'Active' as AssetStatus
  });

  const poWorkflowStages: POStatus[] = [
    'Requested',
    'Approved',
    'Ordered',
    'Received',
    'Completed'
  ];

  const assetCategories: AssetCategory[] = [
    'Camera & Video',
    'Audio & Lighting',
    'Computing',
    'Office Furniture',
    'Software Subscription'
  ];

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPO.description.trim()) return;

    addPurchaseOrder(newPO);
    setShowAddPOModal(false);
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.name.trim()) return;

    addAsset(newAsset);
    setShowAddAssetModal(false);
  };

  const totalAssetValuation = assets.reduce((acc, a) => acc + (a.purchaseCost || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('pos')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'pos'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Purchase Orders ({purchaseOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'assets'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Equipment Inventory ({assets.length})
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'vendors'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Approved Vendors
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddAssetModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Tag Hardware Asset</span>
          </button>

          <button
            onClick={() => setShowAddPOModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-blue-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Purchase Request</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-medium">Hardware Asset Valuation</div>
          <div className="text-xl font-bold text-slate-900 mt-1">
            {totalAssetValuation.toLocaleString()} <span className="text-xs font-normal">ETB</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-medium">Pending Purchase Requests</div>
          <div className="text-xl font-bold text-amber-600 mt-1">
            {purchaseOrders.filter((po) => po.status === 'Requested').length} Orders
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-medium">Camera & Drone Units</div>
          <div className="text-xl font-bold text-purple-600 mt-1">
            {assets.filter((a) => a.category === 'Camera & Video').length} Units
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500 font-medium">Assets Under Maintenance</div>
          <div className="text-xl font-bold text-slate-700 mt-1">
            {assets.filter((a) => a.status === 'Under Maintenance').length}
          </div>
        </div>
      </div>

      {/* TAB 1: 5-STAGE PURCHASE ORDERS */}
      {activeTab === 'pos' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Procurement & Purchase Orders</h3>
              <p className="text-xs text-slate-500">
                5-stage approval workflow. Marking &quot;Completed&quot; posts automatically into the Dual-Stream Ledger.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full font-semibold border border-purple-200">
              Finance Connected
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">PO #</th>
                  <th className="py-3 px-4">Vendor</th>
                  <th className="py-3 px-4">Item / Service Description</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Amount (ETB)</th>
                  <th className="py-3 px-4">Requested By</th>
                  <th className="py-3 px-4">Workflow Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {purchaseOrders.map((po) => {
                  const requester = employees.find((e) => e.id === po.requestedBy);
                  return (
                    <tr key={po.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-700">{po.poNumber}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{po.vendor}</td>
                      <td className="py-3 px-4 font-medium text-slate-800 max-w-xs">{po.description}</td>
                      <td className="py-3 px-4 text-slate-500">{po.date}</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900">
                        {po.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{requester?.fullName || 'Production Unit'}</td>
                      <td className="py-3 px-4">
                        <select
                          value={po.status}
                          onChange={(e) => updatePurchaseOrderStatus(po.id, e.target.value as POStatus)}
                          className="text-[11px] bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-800"
                        >
                          {poWorkflowStages.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {po.status === 'Completed' ? (
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Paid & Logged
                          </span>
                        ) : (
                          <button
                            onClick={() => updatePurchaseOrderStatus(po.id, 'Completed')}
                            className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            Mark Completed
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

      {/* TAB 2: EQUIPMENT INVENTORY */}
      {activeTab === 'assets' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">OTP Studio Hardware & Computing Assets</h3>
              <p className="text-xs text-slate-500">Camera rigs, drones, audio setups, and edit suites</p>
            </div>
            <span className="text-xs font-semibold text-slate-600">
              Total Assets: {assets.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Tag</th>
                  <th className="py-3 px-4">Asset Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Purchase Date</th>
                  <th className="py-3 px-4 text-right">Value (ETB)</th>
                  <th className="py-3 px-4">Assigned Custodian</th>
                  <th className="py-3 px-4">Condition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assets.map((asset) => {
                  const custodian = employees.find((e) => e.id === asset.assignedTo);
                  return (
                    <tr key={asset.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-mono font-bold text-blue-600">{asset.assetTag}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{asset.name}</td>
                      <td className="py-3 px-4 font-semibold text-purple-700">{asset.category}</td>
                      <td className="py-3 px-4 text-slate-500">{asset.purchaseDate}</td>
                      <td className="py-3 px-4 text-right font-semibold text-slate-900">
                        {asset.purchaseCost.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-700">{custodian?.fullName || 'Production Hub'}</td>
                      <td className="py-3 px-4">
                        <select
                          value={asset.status}
                          onChange={(e) => updateAsset(asset.id, { status: e.target.value as AssetStatus })}
                          className="text-[11px] bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-800"
                        >
                          <option value="Active">Active</option>
                          <option value="Under Maintenance">Under Maintenance</option>
                          <option value="Decommissioned">Decommissioned</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: APPROVED VENDORS */}
      {activeTab === 'vendors' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-900">Camera Hub Addis</h4>
            <div className="text-[11px] text-purple-600 font-medium">Sony & Pro Video Equipment</div>
            <p className="text-[11px] text-slate-500 mt-2">
              Primary camera, prime lenses, and cinema stabilizer partner. Net 30 payment terms.
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-900">Aputure East Africa</h4>
            <div className="text-[11px] text-amber-600 font-medium">Continuous Lighting & Modifiers</div>
            <p className="text-[11px] text-slate-500 mt-2">
              Studio light storms, softboxes, C-stands, and portable battery packs.
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-900">Adobe / Canva / Figma</h4>
            <div className="text-[11px] text-blue-600 font-medium">Creative Cloud Software Subscriptions</div>
            <p className="text-[11px] text-slate-500 mt-2">
              Annual team licenses paid via corporate foreign currency card.
            </p>
          </div>
        </div>
      )}

      {/* MODAL: NEW PURCHASE ORDER */}
      {showAddPOModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">New Purchase Order Request</h3>
              <button onClick={() => setShowAddPOModal(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePO} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Vendor Name *</label>
                <input
                  type="text"
                  required
                  value={newPO.vendor}
                  onChange={(e) => setNewPO({ ...newPO, vendor: e.target.value })}
                  placeholder="e.g. Camera Hub Addis"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Item Description & Scope *</label>
                <input
                  type="text"
                  required
                  value={newPO.description}
                  onChange={(e) => setNewPO({ ...newPO, description: e.target.value })}
                  placeholder="e.g. 2x Sony 128GB Tough V90 SDXC Cards for TVC shoot"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Total Amount (ETB) *</label>
                  <input
                    type="number"
                    required
                    value={newPO.totalAmount}
                    onChange={(e) => setNewPO({ ...newPO, totalAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Requesting Team Member</label>
                  <select
                    value={newPO.requestedBy}
                    onChange={(e) => setNewPO({ ...newPO, requestedBy: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.fullName} ({emp.department})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddPOModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold"
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TAG ASSET */}
      {showAddAssetModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="text-base font-bold text-slate-900 mb-3">Register Equipment Asset</h3>
            <form onSubmit={handleCreateAsset} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Asset Name *</label>
                <input
                  type="text"
                  required
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  placeholder="e.g. Sony A7S III Camera Body"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={newAsset.category}
                    onChange={(e) => setNewAsset({ ...newAsset, category: e.target.value as AssetCategory })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    {assetCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Purchase Cost (ETB)</label>
                  <input
                    type="number"
                    value={newAsset.purchaseCost}
                    onChange={(e) => setNewAsset({ ...newAsset, purchaseCost: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Assigned Custodian</label>
                <select
                  value={newAsset.assignedTo}
                  onChange={(e) => setNewAsset({ ...newAsset, assignedTo: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} ({emp.position})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddAssetModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold"
                >
                  Register Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
