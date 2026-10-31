import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Building,
  RotateCcw,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Receipt,
  Download,
  Filter,
  CreditCard
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import {
  Transaction,
  FinancialStream,
  TransactionType,
  ExpenseCategory,
  Invoice
} from '../../types';
import {
  calculateFinancialBalances,
  calculateReceivablesAndPayables
} from '../../utils/calculations';

export const FinanceModule: React.FC = () => {
  const {
    transactions,
    addTransaction,
    reverseTransaction,
    invoices,
    addInvoice,
    recordInvoicePayment,
    clients,
    projects,
    currentUser,
    settings
  } = useERP();

  const [activeTab, setActiveTab] = useState<'ledger' | 'streams' | 'invoices'>('ledger');
  const [streamFilter, setStreamFilter] = useState<'All' | 'Black Cash' | 'White Bank'>('All');
  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState<Invoice | null>(null);
  const [showReversalModal, setShowReversalModal] = useState<Transaction | null>(null);
  const [reversalReason, setReversalReason] = useState('');

  // Payment recording state
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [paymentStream, setPaymentStream] = useState<'White Bank' | 'Black Cash'>('White Bank');

  // New Transaction Form State
  const [newTx, setNewTx] = useState({
    transactionId: `TX-2024-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split('T')[0],
    type: 'Expense' as TransactionType,
    stream: 'White Bank' as FinancialStream,
    sourceOrClient: 'Awash Bank Corporate',
    details: '',
    cashAmount: 0,
    bankAmount: 25000,
    category: 'Production expenses' as ExpenseCategory,
    vendor: '',
    description: '',
    recordedById: currentUser.id
  });

  // New Invoice Form State
  const [newInvoice, setNewInvoice] = useState({
    invoiceNumber: `INV-2024-${Math.floor(100 + Math.random() * 900)}`,
    clientId: clients[0]?.id || '',
    projectId: projects[0]?.id || '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    subtotal: 500000,
    tax: 75000,
    total: 575000,
    paidAmount: 0,
    balance: 575000,
    status: 'Sent' as Invoice['status'],
    items: [{ description: 'Agency Creative & Production Services', quantity: 1, unitPrice: 500000, amount: 500000 }]
  });

  const categories: ExpenseCategory[] = [
    'Transport',
    'Food expense',
    'Equipment rental',
    'Salaries',
    'Marketing',
    'Office expenses',
    'Software and subscriptions',
    'Production expenses',
    'Other'
  ];

  const balances = calculateFinancialBalances(
    transactions,
    settings.blackCashInitialBalance,
    settings.whiteBankInitialBalance
  );
  const { accountsReceivable, totalInvoiced, totalPaid } = calculateReceivablesAndPayables(invoices);

  const filteredTransactions = streamFilter === 'All'
    ? transactions
    : transactions.filter((t) => t.stream === streamFilter);

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.details.trim()) return;

    addTransaction(newTx);
    setShowAddTxModal(false);
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    addInvoice(newInvoice);
    setShowAddInvoiceModal(false);
  };

  const handleConfirmReversal = () => {
    if (!showReversalModal || !reversalReason.trim()) return;
    reverseTransaction(showReversalModal.id, reversalReason);
    setShowReversalModal(null);
    setReversalReason('');
  };

  const handleConfirmPayment = () => {
    if (!showPaymentModal || paymentAmount <= 0) return;
    recordInvoicePayment(showPaymentModal.id, paymentAmount, paymentStream);
    setShowPaymentModal(null);
    setPaymentAmount(0);
  };

  return (
    <div className="space-y-6">
      {/* Financial Stream Header Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Black Stream: Physical Cash */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-sm border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Black Stream (Cash)
            </span>
            <span className="text-[10px] text-slate-400">Petty & Field Cash</span>
          </div>
          <div className="text-2xl font-bold mt-1">
            {balances.blackCashBalance.toLocaleString()}{' '}
            <span className="text-xs font-normal text-slate-400">ETB</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            <span>In: +{balances.blackCashIncome.toLocaleString()}</span>
            <span>Out: -{balances.blackCashExpense.toLocaleString()}</span>
          </div>
        </div>

        {/* White Stream: Corporate Bank */}
        <div className="bg-blue-900 text-white p-5 rounded-2xl shadow-sm border border-blue-800 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-300"></span>
              White Stream (Bank)
            </span>
            <span className="text-[10px] text-blue-200">Official Statutory Wire</span>
          </div>
          <div className="text-2xl font-bold mt-1">
            {balances.whiteBankBalance.toLocaleString()}{' '}
            <span className="text-xs font-normal text-blue-200">ETB</span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-800 text-[11px] text-blue-200">
            <span>In: +{balances.whiteBankIncome.toLocaleString()}</span>
            <span>Out: -{balances.whiteBankExpense.toLocaleString()}</span>
          </div>
        </div>

        {/* Consolidated Net Agency Position */}
        <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold uppercase tracking-wider">Consolidated Net Profit</span>
              <span className="text-emerald-600 font-bold">{balances.profitMargin}% Margin</span>
            </div>
            <div className="text-2xl font-bold text-emerald-600">
              {balances.netProfit.toLocaleString()} <span className="text-xs text-slate-500">ETB</span>
            </div>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            <span>Receivables: <strong>{accountsReceivable.toLocaleString()} ETB</strong></span>
            <span>Ledger Entries: <strong>{transactions.length}</strong></span>
          </div>
        </div>
      </div>

      {/* Tabs & Top Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'ledger'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Transaction Ledger ({transactions.length})
          </button>
          <button
            onClick={() => setActiveTab('streams')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'streams'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dual-Stream Comparative Breakdown
          </button>
          <button
            onClick={() => setActiveTab('invoices')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'invoices'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Client Invoices ({invoices.length})
          </button>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'ledger' && (
            <select
              value={streamFilter}
              onChange={(e) => setStreamFilter(e.target.value as any)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700"
            >
              <option value="All">All Streams</option>
              <option value="White Bank">White Bank Only</option>
              <option value="Black Cash">Black Cash Only</option>
            </select>
          )}

          <button
            onClick={() => setShowAddInvoiceModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Invoice</span>
          </button>

          <button
            onClick={() => setShowAddTxModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-blue-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Transaction</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DAILY TRANSACTION LEDGER (NON-DESTRUCTIVE AUDIT TRAIL) */}
      {activeTab === 'ledger' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">OTP General Ledger</h3>
              <p className="text-xs text-slate-500">
                Non-destructive financial records with reversal audit trails
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-slate-100 rounded-full font-medium text-slate-600">
              Audit Immutable
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">TX ID</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Stream</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Details / Description</th>
                  <th className="py-3 px-4">Source / Vendor</th>
                  <th className="py-3 px-4 text-right">Cash Amount</th>
                  <th className="py-3 px-4 text-right">Bank Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      tx.isReversal ? 'bg-amber-50/40 text-slate-400' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-medium text-slate-600">{tx.transactionId}</td>
                    <td className="py-3 px-4 text-slate-500">{tx.date}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          tx.stream === 'Black Cash'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {tx.stream}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">{tx.category}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs truncate">
                      {tx.details}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{tx.vendor || tx.sourceOrClient}</td>
                    <td className="py-3 px-4 text-right font-mono font-medium">
                      {tx.cashAmount > 0 ? (
                        <span className={tx.type === 'Income' ? 'text-emerald-600' : 'text-slate-800'}>
                          {tx.type === 'Income' ? '+' : '-'}{tx.cashAmount.toLocaleString()}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-medium">
                      {tx.bankAmount > 0 ? (
                        <span className={tx.type === 'Income' ? 'text-emerald-600' : 'text-slate-800'}>
                          {tx.type === 'Income' ? '+' : '-'}{tx.bankAmount.toLocaleString()}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {tx.isReversal ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                          Reversed
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Valid
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {!tx.isReversal ? (
                        <button
                          onClick={() => {
                            setShowReversalModal(tx);
                            setReversalReason('');
                          }}
                          className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold flex items-center justify-end gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Reversal
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">Archived</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DUAL-STREAM COMPARATIVE BREAKDOWN */}
      {activeTab === 'streams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <h3 className="text-sm font-bold text-slate-900">Black Stream: Physical Cash Tracking</h3>
              </div>
              <span className="text-xs font-mono font-bold text-amber-700">
                Balance: {balances.blackCashBalance.toLocaleString()} ETB
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              On-site field logistics, location van fuel, talent extras, catering vouchers, and emergency equipment spares.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                <span>Initial Safe Deposit:</span>
                <span className="font-bold">{settings.blackCashInitialBalance.toLocaleString()} ETB</span>
              </div>
              <div className="flex justify-between p-2.5 bg-emerald-50 rounded-xl text-emerald-800">
                <span>Total Cash Inflow:</span>
                <span className="font-bold">+{balances.blackCashIncome.toLocaleString()} ETB</span>
              </div>
              <div className="flex justify-between p-2.5 bg-rose-50 rounded-xl text-rose-800">
                <span>Total Cash Outflow:</span>
                <span className="font-bold">-{balances.blackCashExpense.toLocaleString()} ETB</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                <h3 className="text-sm font-bold text-slate-900">White Stream: Official Bank Accounts</h3>
              </div>
              <span className="text-xs font-mono font-bold text-blue-700">
                Balance: {balances.whiteBankBalance.toLocaleString()} ETB
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Client retainer wire transfers, corporate studio lease, official employee payroll, and foreign card software subscriptions.
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                <span>Initial Bank Balance:</span>
                <span className="font-bold">{settings.whiteBankInitialBalance.toLocaleString()} ETB</span>
              </div>
              <div className="flex justify-between p-2.5 bg-emerald-50 rounded-xl text-emerald-800">
                <span>Total Bank Inflow:</span>
                <span className="font-bold">+{balances.whiteBankIncome.toLocaleString()} ETB</span>
              </div>
              <div className="flex justify-between p-2.5 bg-rose-50 rounded-xl text-rose-800">
                <span>Total Bank Outflow:</span>
                <span className="font-bold">-{balances.whiteBankExpense.toLocaleString()} ETB</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CLIENT INVOICES & BILLING */}
      {activeTab === 'invoices' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Client Billing Invoices</h3>
              <p className="text-xs text-slate-500">Track outstanding receivables and record client settlements</p>
            </div>
            <div className="text-xs font-semibold text-slate-700">
              Accounts Receivable: <span className="text-amber-700 font-bold">{accountsReceivable.toLocaleString()} ETB</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Total (ETB)</th>
                  <th className="py-3 px-4 text-right">Paid</th>
                  <th className="py-3 px-4 text-right">Outstanding Balance</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => {
                  const client = clients.find((c) => c.id === inv.clientId);
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-mono font-medium text-slate-700">{inv.invoiceNumber}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{client?.companyName}</td>
                      <td className="py-3 px-4 text-slate-500">{inv.issueDate}</td>
                      <td className="py-3 px-4 text-slate-500">{inv.dueDate}</td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900">
                        {inv.total.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-emerald-600">
                        {inv.paidAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-amber-700">
                        {inv.balance.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            inv.status === 'Paid'
                              ? 'bg-emerald-100 text-emerald-800'
                              : inv.status === 'Partially Paid'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {inv.balance > 0 ? (
                          <button
                            onClick={() => {
                              setShowPaymentModal(inv);
                              setPaymentAmount(inv.balance);
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold"
                          >
                            Record Payment
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Settled
                          </span>
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

      {/* MODAL: RECORD TRANSACTION */}
      {showAddTxModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Record Ledger Transaction</h3>
              <button
                onClick={() => setShowAddTxModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Transaction Type</label>
                  <select
                    value={newTx.type}
                    onChange={(e) => setNewTx({ ...newTx, type: e.target.value as TransactionType })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-semibold"
                  >
                    <option value="Expense">Expense (Disbursement)</option>
                    <option value="Income">Income (Receipt)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Financial Stream</label>
                  <select
                    value={newTx.stream}
                    onChange={(e) => setNewTx({ ...newTx, stream: e.target.value as FinancialStream })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-semibold"
                  >
                    <option value="White Bank">White Bank (Official Bank)</option>
                    <option value="Black Cash">Black Cash (Physical Safe)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Transaction Details *</label>
                <input
                  type="text"
                  required
                  value={newTx.details}
                  onChange={(e) => setNewTx({ ...newTx, details: e.target.value })}
                  placeholder="e.g. Sony FX3 Lens Rental for Entoto Shoot"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    Amount (ETB) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newTx.stream === 'Black Cash' ? newTx.cashAmount : newTx.bankAmount}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (newTx.stream === 'Black Cash') {
                        setNewTx({ ...newTx, cashAmount: val, bankAmount: 0 });
                      } else {
                        setNewTx({ ...newTx, bankAmount: val, cashAmount: 0 });
                      }
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Expense Category</label>
                  <select
                    value={newTx.category}
                    onChange={(e) => setNewTx({ ...newTx, category: e.target.value as ExpenseCategory })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Vendor / Client Source</label>
                  <input
                    type="text"
                    value={newTx.vendor}
                    onChange={(e) => setNewTx({ ...newTx, vendor: e.target.value })}
                    placeholder="e.g. Camera Hub / Ethio Telecom"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Transaction Date</label>
                  <input
                    type="date"
                    value={newTx.date}
                    onChange={(e) => setNewTx({ ...newTx, date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddTxModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold"
                >
                  Record into Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AUDIT REVERSAL (NON-DESTRUCTIVE) */}
      {showReversalModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2.5 text-rose-600 mb-3">
              <RotateCcw className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">Non-Destructive Ledger Reversal</h3>
            </div>

            <p className="text-slate-600 leading-relaxed mb-4">
              Per OTP financial compliance policy, transactions are never silently deleted. A counter-entry will be posted with full audit traceability.
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-4 space-y-1">
              <div className="font-semibold text-slate-900">{showReversalModal.details}</div>
              <div className="text-[11px] text-slate-500">
                ID: {showReversalModal.transactionId} • Amount:{' '}
                {(showReversalModal.cashAmount || showReversalModal.bankAmount).toLocaleString()} ETB
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-slate-700 font-semibold mb-1">
                Mandatory Reversal Justification *
              </label>
              <textarea
                rows={2}
                required
                value={reversalReason}
                onChange={(e) => setReversalReason(e.target.value)}
                placeholder="State the audit reason for correction..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowReversalModal(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReversal}
                disabled={!reversalReason.trim()}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl font-semibold"
              >
                Post Reversal Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RECORD INVOICE PAYMENT */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">Record Client Payment</h3>
            <p className="text-slate-500 text-[11px] mb-4">
              Invoice #{showPaymentModal.invoiceNumber} • Outstanding:{' '}
              {showPaymentModal.balance.toLocaleString()} ETB
            </p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Payment Amount (ETB) *</label>
                <input
                  type="number"
                  value={paymentAmount}
                  max={showPaymentModal.balance}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Receipt Stream *</label>
                <select
                  value={paymentStream}
                  onChange={(e) => setPaymentStream(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white font-semibold"
                >
                  <option value="White Bank">White Bank (Official Bank Transfer)</option>
                  <option value="Black Cash">Black Cash (Physical Safe Deposit)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPaymentModal(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPayment}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold"
              >
                Confirm & Sync Ledger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: GENERATE INVOICE */}
      {showAddInvoiceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Generate Client Invoice</h3>
              <button
                onClick={() => setShowAddInvoiceModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Client Organization *</label>
                <select
                  value={newInvoice.clientId}
                  onChange={(e) => setNewInvoice({ ...newInvoice, clientId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.companyName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Subtotal Amount (ETB) *</label>
                  <input
                    type="number"
                    value={newInvoice.subtotal}
                    onChange={(e) => {
                      const sub = Number(e.target.value);
                      const tax = Math.round(sub * 0.15);
                      setNewInvoice({
                        ...newInvoice,
                        subtotal: sub,
                        tax,
                        total: sub + tax,
                        balance: sub + tax
                      });
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">VAT 15% (ETB)</label>
                  <input
                    type="number"
                    readOnly
                    value={newInvoice.tax}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Issue Date</label>
                  <input
                    type="date"
                    value={newInvoice.issueDate}
                    onChange={(e) => setNewInvoice({ ...newInvoice, issueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newInvoice.dueDate}
                    onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
                <span className="font-semibold text-slate-700">Total Invoice Amount:</span>
                <span className="text-base font-bold text-slate-900">
                  {newInvoice.total.toLocaleString()} ETB
                </span>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddInvoiceModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold"
                >
                  Dispatch Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
