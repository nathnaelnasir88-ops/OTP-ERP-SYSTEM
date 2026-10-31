import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSMMMetrics,
  calculateCampaignMetrics,
  calculateFinancialBalances,
  calculateReceivablesAndPayables,
  calculateProjectProgress
} from './calculations';
import { ContentAsset, Transaction, Invoice, Project } from '../types';

test('SMM target calculations compute fulfillment and remaining quota correctly', () => {
  const assets: Partial<ContentAsset>[] = [
    { id: '1', format: 'Video', productionStatus: 'Published' } as ContentAsset,
    { id: '2', format: 'Reel', productionStatus: 'Published' } as ContentAsset,
    { id: '3', format: 'Static Graphic', productionStatus: 'Published' } as ContentAsset,
    { id: '4', format: 'Carousel', productionStatus: 'In Canva' } as ContentAsset,
    { id: '5', format: 'Story', productionStatus: 'Ideation' } as ContentAsset
  ];

  const metrics = calculateSMMMetrics(assets as ContentAsset[], 1080);
  assert.equal(metrics.targetAnnual, 1080);
  assert.equal(metrics.monthlyTarget, 90);
  assert.equal(metrics.totalAssets, 5);
  assert.equal(metrics.totalPublished, 3);
  assert.equal(metrics.remainingQuota, 1077);
  assert.equal(metrics.videoCount, 1);
  assert.equal(metrics.reelsCount, 1);
  assert.equal(metrics.graphicCount, 1);
  assert.equal(metrics.carouselCount, 1);
  assert.equal(metrics.storiesCount, 1);
  assert.ok(metrics.annualFulfillmentRate >= 0.2);
});

test('Ad Campaign metrics calculate CPC, CTR, CPL, and ROAS accurately', () => {
  const campaign = {
    allocatedBudget: 50000,
    actualSpend: 25000,
    impressions: 500000,
    reach: 250000,
    clicks: 10000,
    leads: 500,
    conversions: 100,
    revenueGenerated: 100000
  };

  const res = calculateCampaignMetrics(campaign);
  assert.equal(res.remainingBudget, 25000);
  assert.equal(res.budgetUtilization, 50); // 25k / 50k
  assert.equal(res.cpc, 2.5); // 25000 / 10000
  assert.equal(res.ctr, 2); // 10000 / 500000 * 100
  assert.equal(res.cpl, 50); // 25000 / 500
  assert.equal(res.roas, 4); // 100000 / 25000
});

test('Dual-Stream Finance ledger tracks Black Cash and White Bank independently', () => {
  const transactions: Partial<Transaction>[] = [
    {
      id: 'tx1',
      type: 'Income',
      stream: 'White Bank',
      cashAmount: 0,
      bankAmount: 150000
    } as Transaction,
    {
      id: 'tx2',
      type: 'Income',
      stream: 'Black Cash',
      cashAmount: 40000,
      bankAmount: 0
    } as Transaction,
    {
      id: 'tx3',
      type: 'Expense',
      stream: 'White Bank',
      cashAmount: 0,
      bankAmount: 50000
    } as Transaction,
    {
      id: 'tx4',
      type: 'Expense',
      stream: 'Black Cash',
      cashAmount: 15000,
      bankAmount: 0
    } as Transaction
  ];

  const balances = calculateFinancialBalances(transactions as Transaction[], 10000, 200000);
  assert.equal(balances.blackCashIncome, 40000);
  assert.equal(balances.blackCashExpense, 15000);
  assert.equal(balances.blackCashBalance, 10000 + 40000 - 15000); // 35000

  assert.equal(balances.whiteBankIncome, 150000);
  assert.equal(balances.whiteBankExpense, 50000);
  assert.equal(balances.whiteBankBalance, 200000 + 150000 - 50000); // 300000

  assert.equal(balances.totalIncome, 190000);
  assert.equal(balances.totalExpense, 65000);
  assert.equal(balances.netProfit, 125000);
});

test('Receivables and Payables calculate outstanding invoice balances', () => {
  const invoices: Partial<Invoice>[] = [
    { id: 'inv1', total: 100000, paidAmount: 100000, balance: 0, status: 'Paid' } as Invoice,
    { id: 'inv2', total: 60000, paidAmount: 20000, balance: 40000, status: 'Partially Paid' } as Invoice,
    { id: 'inv3', total: 80000, paidAmount: 0, balance: 80000, status: 'Sent' } as Invoice
  ];

  const res = calculateReceivablesAndPayables(invoices as Invoice[]);
  assert.equal(res.totalInvoiced, 240000);
  assert.equal(res.totalPaid, 120000);
  assert.equal(res.accountsReceivable, 120000);
});

test('Project progress calculates completion rate and budgets', () => {
  const projects: Partial<Project>[] = [
    { id: 'p1', status: 'Completed', budget: 100000, spent: 90000 } as Project,
    { id: 'p2', status: 'Active', budget: 80000, spent: 40000 } as Project,
    { id: 'p3', status: 'Planning', budget: 50000, spent: 5000 } as Project
  ];

  const res = calculateProjectProgress(projects as Project[]);
  assert.equal(res.activeCount, 1);
  assert.equal(res.totalBudget, 230000);
  assert.equal(res.totalSpent, 135000);
  assert.equal(res.completionRate, 33.3);
});
