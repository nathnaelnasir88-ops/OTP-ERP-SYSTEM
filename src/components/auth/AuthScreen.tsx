import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Building,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole, Department } from '../../types';

export const AuthScreen: React.FC = () => {
  const {
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    loginAsDemoUser,
    authError,
    clearAuthError,
    loading
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('Managing Director');
  const [department, setDepartment] = useState<Department>('Management');

  const demoAccounts: {
    name: string;
    role: UserRole;
    dept: Department;
    email: string;
    avatar: string;
  }[] = [
    {
      name: 'Nathnael Nasir',
      role: 'Managing Director',
      dept: 'Management',
      email: 'nathnaelnasir88@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    {
      name: 'Sara Alemayehu',
      role: 'Finance Manager',
      dept: 'Finance',
      email: 'sara.a@opentechplc.com',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    },
    {
      name: 'Dawit Tadesse',
      role: 'Marketing Manager',
      dept: 'Marketing',
      email: 'dawit.t@opentechplc.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    {
      name: 'Selamawit Kebede',
      role: 'Designer / Content Creator',
      dept: 'Creative & Design',
      email: 'selam.k@opentechplc.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
    },
    {
      name: 'Biruk Hailu',
      role: 'Media Buyer',
      dept: 'Advertising',
      email: 'biruk.h@opentechplc.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    {
      name: 'Meron Teshome',
      role: 'HR Manager',
      dept: 'Administration',
      email: 'meron.t@opentechplc.com',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
    }
  ];

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();

    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password, fullName, role, department);
      }
    } catch (err: any) {
      console.warn('Email Auth error:', err);
    }
  };

  const handleGoogleLogin = async () => {
    clearAuthError();
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.warn('Google login failed or popup closed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#242424] flex flex-col justify-center items-center p-4 sm:p-6 text-slate-100 font-sans">
      <div className="w-full max-w-md">
        {/* Brand Logo & Header */}
        <div className="text-center mb-6">
          <div
            className="inline-flex w-14 h-14 rounded-2xl items-center justify-center font-black text-2xl tracking-wider mb-3 shadow-xl transition-transform hover:scale-105"
            style={{
              backgroundColor: '#545454',
              color: '#feb913',
              border: '2px solid #feb913',
              boxShadow: '0 8px 24px rgba(254, 185, 19, 0.25)'
            }}
          >
            OTP
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Open Technology PLC</h1>
          <p className="text-xs text-slate-300 mt-1 font-medium">Enterprise Integrated Agency Resource Planning</p>
        </div>

        {/* Auth Card */}
        <div className="bg-[#333333] border border-[#484848] rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Tabs: Sign In / Register */}
          <div className="flex bg-[#262626] p-1 rounded-xl mb-6 border border-[#444444]">
            <button
              onClick={() => {
                setMode('login');
                clearAuthError();
              }}
              style={mode === 'login' ? { backgroundColor: '#feb913', color: '#1a1a1a' } : undefined}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login' ? 'shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('register');
                clearAuthError();
              }}
              style={mode === 'register' ? { backgroundColor: '#feb913', color: '#1a1a1a' } : undefined}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'register' ? 'shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              Register Member
            </button>
          </div>

          {authError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2 mb-4">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* 1-Click Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-60 mb-4"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[10px] text-slate-500 font-semibold uppercase tracking-wider absolute">
              or corporate credentials
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3.5 text-xs">
            {mode === 'register' && (
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Dawit Tadesse"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-white placeholder:text-slate-600 focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Corporate Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="employee@opentechplc.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-white placeholder:text-slate-600 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-white placeholder:text-slate-600 focus:outline-hidden"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-[11px]"
                  >
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

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Department</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as Department)}
                    className="w-full px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-[11px]"
                  >
                    <option value="Management">Management</option>
                    <option value="Finance">Finance</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Creative & Design">Creative</option>
                    <option value="Video Production">Video</option>
                    <option value="Advertising">Advertising</option>
                    <option value="Administration">Admin</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#feb913',
                color: '#1a1a1a',
                boxShadow: '0 4px 14px rgba(254, 185, 19, 0.3)'
              }}
              className="w-full py-2.5 hover:bg-[#e5a408] font-bold rounded-xl text-xs transition-colors disabled:opacity-50 mt-2"
            >
              {mode === 'login' ? 'Sign In to Portal' : 'Register OTP Account'}
            </button>
          </form>

          {/* Quick Demo Role Switcher */}
          <div className="mt-6 pt-5 border-t border-slate-700/80">
            <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
              <span className="font-semibold text-slate-300">Quick Test: Sign in as Role</span>
              <span className="text-[10px] text-[#feb913] font-semibold">1-Click Test</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.slice(0, 4).map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() =>
                    loginAsDemoUser({
                      fullName: acc.name,
                      role: acc.role,
                      department: acc.dept,
                      email: acc.email,
                      avatarUrl: acc.avatar
                    })
                  }
                  className="p-2 bg-[#262626] hover:bg-[#3d3d3d] border border-[#444444] rounded-xl text-left transition-all"
                >
                  <div className="font-bold text-slate-100 text-[11px] truncate">{acc.name}</div>
                  <div className="text-[10px] text-[#feb913] font-medium truncate">{acc.role}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-4 text-[11px] text-slate-500">
          Open Technology PLC ERP Portal • Cloud Firestore v2
        </div>
      </div>
    </div>
  );
};
