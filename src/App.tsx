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
      <div className="min-h-screen bg-[#2c2c2c] flex flex-col items-center justify-center p-4 text-white">
        <div className="w-12 h-12 rounded-2xl bg-[#545454] border-2 border-[#feb913] text-[#feb913] flex items-center justify-center font-bold text-lg tracking-wider mb-4 shadow-lg shadow-[#feb913]/20 animate-pulse">
          OTP
        </div>
        <div className="text-sm font-semibold text-slate-200">Authenticating Open Technology PLC session...</div>
      </div>
    );
  }

  if (!userProfile) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans antialiased flex">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0 min-h-screen">
        <TopNavbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
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
