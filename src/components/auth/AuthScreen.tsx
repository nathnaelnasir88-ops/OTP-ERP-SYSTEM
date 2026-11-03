import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  KeyRound,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AuthScreen: React.FC = () => {
  const {
    loginWithEmail,
    authError,
    clearAuthError,
    managedAccounts,
    loading
  } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();

    try {
      await loginWithEmail(usernameOrEmail, password);
    } catch (err: any) {
      console.warn('Login attempt failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#e4e7ec] flex flex-col justify-center items-center p-4 sm:p-6 text-[#1d1d1f] font-sans">
      <div className="w-full max-w-md">
        {/* Brand Pill & Header */}
        <div className="text-center mb-6 flex flex-col items-center">
          <div className="inline-flex items-center gap-2.5 bg-white px-4 py-2 rounded-full shadow-xs mb-3">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-black flex items-center justify-center shrink-0 border border-slate-200 shadow-xs">
              <img
                src="/assets/aistudio/2025-07-24_12.34.50_1f1aaac7.jpg"
                alt="Open Technology PLC Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-bold text-sm text-[#1d1d1f] tracking-tight">OpenTech</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-[#1d1d1f]">
            Open Technology PLC
          </h1>
          <p className="text-xs text-[#86868b] mt-1">
            Enterprise Integrated Agency Resource Planning
          </p>
        </div>

        {/* Auth Bento Card */}
        <div className="bg-white rounded-[32px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white">
          <div className="mb-6 pb-4 border-b border-slate-100 text-center">
            <h2 className="text-lg font-medium text-[#1d1d1f] flex items-center justify-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#1ec94c] ring-4 ring-[#1ec94c]/20 text-white flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <span>Employee Portal Sign In</span>
            </h2>
            <p className="text-xs text-[#86868b] mt-1.5">
              Enter your corporate username or email provided by the Super Administrator
            </p>
          </div>

          {authError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-[#1d1d1f] font-medium mb-1.5">
                Username or Corporate Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="e.g. admin or employee@opentechplc.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f4f5f7] focus:bg-white border border-transparent focus:border-slate-300 rounded-2xl text-[#1d1d1f] placeholder:text-slate-400 focus:outline-hidden transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#1d1d1f] font-medium mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f4f5f7] focus:bg-white border border-transparent focus:border-slate-300 rounded-2xl text-[#1d1d1f] placeholder:text-slate-400 focus:outline-hidden transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#1d1d1f] hover:bg-[#323236] text-white font-medium rounded-full text-xs transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <span>Sign In to ERP Portal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Enterprise Security Notice */}
          <div className="mt-5 p-3.5 rounded-2xl bg-[#f8f9fb] border border-slate-100 flex items-start gap-2.5 text-[11px] text-[#86868b]">
            <ShieldAlert className="w-4 h-4 text-[#1d7dfa] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-[#1d1d1f]">Enterprise RBAC Policy:</strong> Self-registration is disabled. All team accounts and initial passwords are created and provisioned manually by the <strong className="text-[#1d1d1f]">Super Administrator</strong>.
            </p>
          </div>

          {/* Quick Roster Accounts (Pre-configured Staff Login Helpers) */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-[#86868b] mb-2.5">
              <span className="font-medium text-[#1d1d1f] flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-[#f73b9b]" />
                Provisioned Team Accounts
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#f4f5f7] text-[#1d1d1f] font-medium">
                Click to Autofill
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {managedAccounts.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => {
                    setUsernameOrEmail(acc.username);
                    setPassword(acc.password);
                  }}
                  className="p-2.5 bg-[#f8f9fb] hover:bg-[#ebedf0] rounded-2xl text-left transition-all group cursor-pointer"
                  title={`Username: ${acc.username} | Password: ${acc.password}`}
                >
                  <div className="font-medium text-[#1d1d1f] text-[11px] truncate">
                    {acc.fullName}
                  </div>
                  <div className="text-[10px] text-[#86868b] truncate">{acc.role}</div>
                  <div className="text-[9px] text-[#1d7dfa] font-mono mt-0.5">user: {acc.username}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-4 text-[11px] text-[#86868b]">
          Open Technology PLC ERP Portal • Enterprise Multi-Role Security
        </div>
      </div>
    </div>
  );
};
