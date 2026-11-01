/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ERPProvider, useERP } from './context/ERPContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { AuthScreen } from './components/auth/AuthScreen';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { ExecutiveDashboard } from './components/modules/ExecutiveDashboard';
import { CRMSalesModule } from './components/modules/CRMSalesModule';
import { ProjectsModule } from './components/modules/ProjectsModule';
import { SMMModule } from './components/modules/SMMModule';
import { AdvertisingModule } from './components/modules/AdvertisingModule';
import { FinanceModule } from './components/modules/FinanceModule';
import { HRModule } from './components/modules/HRModule';
import { ProcurementModule } from './components/modules/ProcurementModule';
import { ReportsModule } from './components/modules/ReportsModule';
import { SettingsModule } from './components/modules/SettingsModule';
import { BrandCustomizerModal } from './components/common/BrandCustomizerModal';

const MainContent: React.FC = () => {
  const { currentModule } = useERP();
  const { userProfile, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#e4e7ec] flex flex-col items-center justify-center p-4 text-[#1d1d1f]">
        <div className="w-12 h-12 rounded-2xl bg-[#1d1d1f] text-white flex items-center justify-center font-bold text-lg tracking-wider mb-4 shadow-lg animate-pulse">
          OTP
        </div>
        <div className="text-sm font-medium text-slate-600">Authenticating Open Technology PLC session...</div>
      </div>
    );
  }

  if (!userProfile) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-[#e4e7ec] text-[#1d1d1f] font-sans antialiased p-2 sm:p-4 lg:p-6 flex flex-col">
      {/* Slide-over Sidebar Drawer (Accessible via Menu & preserved in DOM for RBAC navigation) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Elevated Cognify-Style Bento App Shell */}
      <div className="flex-1 bg-[#f5f6f8] rounded-[28px] sm:rounded-[38px] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-white/90 flex flex-col min-w-0 max-w-[1480px] w-full mx-auto overflow-hidden">
        <TopNavbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 px-4 sm:px-7 lg:px-9 pb-8 pt-2 w-full mx-auto">
          <ProtectedRoute module={currentModule}>
            {currentModule === 'dashboard' && <ExecutiveDashboard />}
            {currentModule === 'crm' && <CRMSalesModule />}
            {currentModule === 'projects' && <ProjectsModule />}
            {currentModule === 'smm' && <SMMModule />}
            {currentModule === 'advertising' && <AdvertisingModule />}
            {currentModule === 'finance' && <FinanceModule />}
            {currentModule === 'hr' && <HRModule />}
            {currentModule === 'procurement' && <ProcurementModule />}
            {currentModule === 'reports' && <ReportsModule />}
            {currentModule === 'settings' && <SettingsModule />}
          </ProtectedRoute>
        </main>
      </div>

      {/* Global Brand & UI Appearance Studio Modal */}
      <BrandCustomizerModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ERPProvider>
        <MainContent />
      </ERPProvider>
    </AuthProvider>
  );
}
