/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { CustomerAccountView } from './components/CustomerAccountView';
import { OrderTrackerView } from './components/OrderTrackerView';
import { AdminDashboard } from './components/AdminDashboard';
import { CustomizerModal } from './components/CustomizerModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { XamppInstallGuideModal } from './components/XamppInstallGuideModal';

const MainContent: React.FC = () => {
  const { currentView, isXamppModalOpen, setIsXamppModalOpen } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1E1B18]">
      {/* Top Header */}
      <Header />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'store' && (
          <>
            <Hero />
            <ProductCatalog />
          </>
        )}

        {currentView === 'account' && <CustomerAccountView />}

        {currentView === 'tracker' && <OrderTrackerView />}

        {currentView === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Overlays */}
      <CustomizerModal />
      <CartDrawer />
      <CheckoutModal />
      <AuthModal />
      <XamppInstallGuideModal
        isOpen={isXamppModalOpen}
        onClose={() => setIsXamppModalOpen(false)}
      />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
