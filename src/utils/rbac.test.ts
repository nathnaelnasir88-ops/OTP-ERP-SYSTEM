import test from 'node:test';
import assert from 'node:assert/strict';
import {
  hasModuleAccess,
  getDefaultModuleForRole,
  getAccessibleModules,
  filterAccessibleNavItems,
  canChangeUIDesign,
  ROLE_PERMISSIONS
} from './rbac';
import { AppModule } from '../types';

test('Super Administrator and Managing Director have access to all modules', () => {
  assert.equal(hasModuleAccess('Super Administrator', 'finance'), true);
  assert.equal(hasModuleAccess('Super Administrator', 'settings'), true);
  assert.equal(hasModuleAccess('Managing Director', 'crm'), true);
  assert.equal(hasModuleAccess('Managing Director', 'smm'), true);
});

test('Finance Manager has access to finance and procurement, but not SMM or advertising', () => {
  assert.equal(hasModuleAccess('Finance Manager', 'finance'), true);
  assert.equal(hasModuleAccess('Finance Manager', 'procurement'), true);
  assert.equal(hasModuleAccess('Finance Manager', 'smm'), false);
  assert.equal(hasModuleAccess('Finance Manager', 'advertising'), false);
});

test('Designer has access to SMM, projects, and settings, but not finance or hr', () => {
  assert.equal(hasModuleAccess('Designer / Content Creator', 'smm'), true);
  assert.equal(hasModuleAccess('Designer / Content Creator', 'projects'), true);
  assert.equal(hasModuleAccess('Designer / Content Creator', 'settings'), true);
  assert.equal(hasModuleAccess('Designer / Content Creator', 'finance'), false);
  assert.equal(hasModuleAccess('Designer / Content Creator', 'hr'), false);
});

test('Employee has access to dashboard, projects, and personal settings', () => {
  assert.equal(hasModuleAccess('Employee', 'dashboard'), true);
  assert.equal(hasModuleAccess('Employee', 'projects'), true);
  assert.equal(hasModuleAccess('Employee', 'settings'), true);
  assert.equal(hasModuleAccess('Employee', 'finance'), false);
  assert.equal(hasModuleAccess('Employee', 'hr'), false);
});

test('Default module returns first allowed module', () => {
  assert.equal(getDefaultModuleForRole('Finance Manager'), 'dashboard');
});

test('filterAccessibleNavItems returns permitted modules including personal settings for Employee role', () => {
  const dummyItems: { id: AppModule; label: string }[] = [
    { id: 'dashboard', label: 'Executive Dashboard' },
    { id: 'crm', label: 'CRM & Sales' },
    { id: 'projects', label: 'Projects & Operations' },
    { id: 'finance', label: 'Finance & Ledger' },
    { id: 'settings', label: 'Settings & Admin' }
  ];

  const employeeItems = filterAccessibleNavItems(dummyItems, 'Employee');
  assert.equal(employeeItems.length, 3);
  assert.deepEqual(employeeItems.map((i) => i.id), ['dashboard', 'projects', 'settings']);

  const financeItems = filterAccessibleNavItems(dummyItems, 'Finance Manager');
  assert.equal(financeItems.length, 3);
  assert.deepEqual(financeItems.map((i) => i.id), ['dashboard', 'finance', 'settings']);
});

test('getAccessibleModules returns expected list of modules for HR Manager', () => {
  const hrModules = getAccessibleModules('HR Manager');
  assert.deepEqual(hrModules, ['dashboard', 'messages', 'hr', 'reports', 'settings']);
});

test('All corporate roles have access to the messages chat environment', () => {
  const roles = Object.keys(ROLE_PERMISSIONS) as (keyof typeof ROLE_PERMISSIONS)[];
  for (const role of roles) {
    assert.equal(hasModuleAccess(role, 'messages'), true, `${role} should have access to messages`);
  }
});

test('Only Super Administrator can change the UI design', () => {
  assert.equal(canChangeUIDesign('Super Administrator'), true);
  assert.equal(canChangeUIDesign('Managing Director'), false);
  assert.equal(canChangeUIDesign('Finance Manager'), false);
  assert.equal(canChangeUIDesign('Marketing Manager'), false);
  assert.equal(canChangeUIDesign('Project Manager'), false);
  assert.equal(canChangeUIDesign('Social Media Manager'), false);
  assert.equal(canChangeUIDesign('Designer / Content Creator'), false);
  assert.equal(canChangeUIDesign('Media Buyer'), false);
  assert.equal(canChangeUIDesign('HR Manager'), false);
  assert.equal(canChangeUIDesign('Employee'), false);
});



