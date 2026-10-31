import React from 'react';
import { ShieldAlert, ArrowLeft, Lock, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useERP } from '../../context/ERPContext';
import { AppModule, UserRole } from '../../types';
import { hasModuleAccess, ROLE_PERMISSIONS, getDefaultModuleForRole } from '../../utils/rbac';

interface ProtectedRouteProps {
  module: AppModule;
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ module, children }) => {
  const { userProfile, updateUserRole } = useAuth();
  const { setCurrentModule, theme } = useERP();

  if (!userProfile) {
    return null;
  }

  const isAllowed = hasModuleAccess(userProfile.role, module);

  if (!isAllowed) {
    // Find which roles have access to this module
    const authorizedRoles = (Object.keys(ROLE_PERMISSIONS) as UserRole[]).filter((r) =>
      ROLE_PERMISSIONS[r].includes(module)
    );

    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm my-8">
        <div
          className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 border shadow-inner"
          style={{
            backgroundColor: `${theme.accentColor}20`,
            borderColor: `${theme.accentColor}50`,
            color: '#7c5800'
          }}
        >
          <ShieldAlert className="w-8 h-8" style={{ color: theme.accentColor }} />
        </div>

        <span
          className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
          style={{
            backgroundColor: `${theme.accentColor}25`,
            color: '#7c5800'
          }}
        >
          RBAC Policy Enforced
        </span>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-3">
          Restricted Module Access
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed">
          Your current session role <strong className="text-slate-900 font-bold">&quot;{userProfile.role}&quot;</strong> is not authorized to access the{' '}
          <strong className="capitalize font-bold" style={{ color: theme.primaryColor }}>&quot;{module}&quot;</strong> module under OTP corporate governance rules.
        </p>

        <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 text-left max-w-md mx-auto text-xs">
          <div className="font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Authorized Roles for this Module:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {authorizedRoles.map((r) => (
              <span
                key={r}
                className="px-2 py-0.5 rounded-lg font-medium text-[11px] border"
                style={{
                  backgroundColor: `${theme.accentColor}15`,
                  color: '#7c5800',
                  borderColor: `${theme.accentColor}40`
                }}
              >
                {r}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => setCurrentModule(getDefaultModuleForRole(userProfile.role))}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to My Dashboard</span>
          </button>

          <button
            onClick={() => updateUserRole('Managing Director')}
            style={{
              backgroundColor: theme.accentColor,
              color: '#1a1a1a',
              boxShadow: `0 4px 12px ${theme.accentColor}35`
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Switch to Managing Director</span>
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
