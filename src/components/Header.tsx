import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, User as UserIcon, Shield, Search, Menu, X, ArrowRight, LogOut, Check, Database } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartCount,
    setIsCartOpen,
    currentUser,
    openAuthModal,
    logout,
    setIsXamppModalOpen,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleNavClick = (view: 'store' | 'account' | 'tracker' | 'admin') => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#1E1B18]/10 transition-colors">
      {/* Top micro banner */}
      <div className="bg-[#1E1B18] text-[#FAF9F6] text-xs py-1.5 px-4 text-center tracking-wide">
        <span className="font-medium">Gratis Ongkos Kirim Jabodetabek</span>
        <span className="mx-2 text-[#FAF9F6]/40">·</span>
        <span>Pesanan di atas Rp 200.000</span>
        <span className="mx-2 text-[#FAF9F6]/40">·</span>
        <span className="text-[#FAF9F6]/80">Lab Resmi Fine Art Menteng Jakarta</span>
      </div>

      {/* Main Top Bar Contract: 3 zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Zone 1: Single text element Brand Wordmark */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => handleNavClick('store')}
            className="text-left group focus:outline-none"
          >
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1E1B18] group-hover:opacity-85 transition-opacity">
              e-moment<span className="text-[#8B5A2B]">.web.id</span>
            </span>
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#1E1B18]/70">
          <button
            onClick={() => handleNavClick('store')}
            className={`hover:text-[#1E1B18] transition-colors py-1 ${
              currentView === 'store' ? 'text-[#1E1B18] font-semibold border-b-2 border-[#1E1B18]' : ''
            }`}
          >
            Katalog Cetak
          </button>

          <button
            onClick={() => {
              handleNavClick('store');
              setTimeout(() => {
                const el = document.getElementById('craftsmanship-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="hover:text-[#1E1B18] transition-colors py-1"
          >
            Kualitas Kertas
          </button>

          <button
            onClick={() => handleNavClick('tracker')}
            className={`hover:text-[#1E1B18] transition-colors py-1 ${
              currentView === 'tracker' ? 'text-[#1E1B18] font-semibold border-b-2 border-[#1E1B18]' : ''
            }`}
          >
            Lacak Pesanan
          </button>

          {currentUser ? (
            <button
              onClick={() => handleNavClick('account')}
              className={`hover:text-[#1E1B18] transition-colors py-1 ${
                currentView === 'account' ? 'text-[#1E1B18] font-semibold border-b-2 border-[#1E1B18]' : ''
              }`}
            >
              Akun & Riwayat
            </button>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="hover:text-[#1E1B18] transition-colors py-1"
            >
              Daftar / Masuk
            </button>
          )}

          <button
            onClick={() => handleNavClick('admin')}
            className={`flex items-center gap-1.5 hover:text-[#1E1B18] transition-colors py-1 ${
              currentView === 'admin' ? 'text-[#1E1B18] font-semibold border-b-2 border-[#1E1B18]' : ''
            }`}
            title="Kelola Produk, Pesanan & Chat WhatsApp"
          >
            <Shield className="w-3.5 h-3.5 text-[#8B5A2B]" />
            <span>Admin Lab</span>
          </button>

          <button
            onClick={() => setIsXamppModalOpen(true)}
            className="flex items-center gap-1.5 text-xs text-[#8B5A2B] bg-[#8B5A2B]/10 hover:bg-[#8B5A2B]/15 px-2.5 py-1 rounded transition-colors cursor-pointer"
            title="Panduan Instalasi XAMPP & Database MySQL"
          >
            <Database className="w-3.5 h-3.5" />
            <span>XAMPP & DB</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* User Account Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#1E1B18] bg-[#1E1B18]/5 hover:bg-[#1E1B18]/10 rounded-md transition-colors"
              >
                <UserIcon className="w-4 h-4 text-[#8B5A2B]" />
                <span className="hidden sm:inline max-w-[120px] truncate">{currentUser.name.split(' ')[0]}</span>
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-[#1E1B18]/10 rounded-lg shadow-lg py-2 z-50 text-xs text-[#1E1B18]">
                  <div className="px-4 py-2 border-b border-[#1E1B18]/5">
                    <p className="font-semibold text-sm truncate">{currentUser.name}</p>
                    <p className="text-[#1E1B18]/60 truncate">{currentUser.phoneWhatsApp}</p>
                    <span className="inline-block mt-1 text-[10px] text-[#8B5A2B] font-medium uppercase tracking-wider">
                      {currentUser.role === 'admin' ? 'Admin Lab' : 'Pelanggan Terverifikasi'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleNavClick('account');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#FAF9F6] flex items-center justify-between"
                  >
                    <span>Akun Saya & Riwayat Pesanan</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#1E1B18]/40" />
                  </button>

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      handleNavClick('tracker');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#FAF9F6]"
                  >
                    Lacak Pengerjaan Cetak
                  </button>

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        handleNavClick('admin');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#FAF9F6] text-[#8B5A2B] font-medium"
                    >
                      Buka Dashboard Admin Lab
                    </button>
                  )}

                  <div className="border-t border-[#1E1B18]/5 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-1.5"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Keluar Akun</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#1E1B18] hover:bg-[#1E1B18]/5 rounded-md transition-colors"
            >
              <UserIcon className="w-4 h-4" />
              <span>Masuk Akun</span>
            </button>
          )}

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-2 bg-[#1E1B18] text-[#FAF9F6] rounded-md hover:bg-[#2C2723] transition-colors focus:outline-none"
            aria-label="Buka Keranjang Belanja"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-medium hidden sm:inline">Keranjang</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#8B5A2B] text-white text-[11px] font-bold flex items-center justify-center font-mono">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#1E1B18] hover:bg-[#1E1B18]/5 rounded-md"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1E1B18]/10 bg-[#FAF9F6] px-4 py-4 space-y-3">
          <button
            onClick={() => handleNavClick('store')}
            className="block w-full text-left py-2 text-sm font-medium text-[#1E1B18]"
          >
            Katalog Cetak Foto
          </button>
          <button
            onClick={() => handleNavClick('tracker')}
            className="block w-full text-left py-2 text-sm font-medium text-[#1E1B18]"
          >
            Lacak Pesanan
          </button>
          <button
            onClick={() => handleNavClick('account')}
            className="block w-full text-left py-2 text-sm font-medium text-[#1E1B18]"
          >
            Akun Saya & Riwayat Pesanan
          </button>
          <button
            onClick={() => handleNavClick('admin')}
            className="block w-full text-left py-2 text-sm font-medium text-[#8B5A2B] flex items-center gap-2"
          >
            <Shield className="w-4 h-4" />
            <span>Dashboard Admin Lab</span>
          </button>

          <div className="pt-2 border-t border-[#1E1B18]/10 flex flex-col gap-2">
            {currentUser ? (
              <div className="flex items-center justify-between text-xs py-2">
                <span>Login sebagai: <strong>{currentUser.name}</strong></span>
                <button onClick={logout} className="text-red-600 font-medium">Keluar</button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal('login');
                }}
                className="w-full py-2.5 bg-[#1E1B18] text-[#FAF9F6] text-xs font-semibold rounded-md text-center"
              >
                Daftar / Masuk Akun
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
