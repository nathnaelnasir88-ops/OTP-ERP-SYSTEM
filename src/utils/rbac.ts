import { AppModule, UserRole } from '../types';

export const ROLE_PERMISSIONS: Record<UserRole, AppModule[]> = {
  'Super Administrator': [
    'dashboard',
    'crm',
    'projects',
    'smm',
    'advertising',
    'finance',
    'hr',
    'procurement',
    'reports',
    'settings'
  ],
  'Managing Director': [
    'dashboard',
    'crm',
    'projects',
    'smm',
    'advertising',
    'finance',
    'hr',
    'procurement',
    'reports',
    'settings'
  ],
  'Finance Manager': [
    'dashboard',
    'finance',
    'procurement',
    'reports',
    'settings'
  ],
  'Marketing Manager': [
    'dashboard',
    'crm',
    'smm',
    'advertising',
    'projects',
    'reports'
  ],
  'Project Manager': [
    'dashboard',
    'projects',
    'crm',
    'smm',
    'reports'
  ],
  'Social Media Manager': [
    'dashboard',
    'smm',
    'projects',
    'reports'
  ],
  'Designer / Content Creator': [
    'dashboard',
    'smm',
    'projects'
  ],
  'Media Buyer': [
    'dashboard',
    'advertising',
    'reports'
  ],
  'HR Manager': [
    'dashboard',
    'hr',
    'reports'
  ],
  'Employee': [
    'dashboard',
    'projects'
  ]
};

export function hasModuleAccess(role: UserRole, module: AppModule): boolean {
  const allowed = ROLE_PERMISSIONS[role];
  if (!allowed) return false;
  return allowed.includes(module);
}

export function getDefaultModuleForRole(role: UserRole): AppModule {
  const allowed = ROLE_PERMISSIONS[role];
  if (allowed && allowed.length > 0) {
    return allowed[0];
  }
  return 'dashboard';
}

export function getAccessibleModules(role: UserRole): AppModule[] {
  return ROLE_PERMISSIONS[role] || ['dashboard'];
}

export function filterAccessibleNavItems<T extends { id: AppModule }>(items: T[], role: UserRole): T[] {
  return items.filter((item) => hasModuleAccess(role, item.id));
}

