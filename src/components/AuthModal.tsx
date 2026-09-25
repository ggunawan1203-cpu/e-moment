import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Eye, EyeOff, User, Phone, Mail, Lock, MapPin, CheckCircle, Shield } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthOpen, setIsAuthOpen, authInitialTab, login, registerUser, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(authInitialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Login form
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regStreet, setRegStreet] = useState('');
  const [regSubdistrict, setRegSubdistrict] = useState('');
  const [regCity, setRegCity] = useState('');
  const [regPostal, setRegPostal] = useState('');

  if (!isAuthOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      showToast('Masukkan email atau nomor WhatsApp Anda.', 'error');
      return;
    }
    const success = login(loginIdentifier, loginPassword);
    if (success) {
      setIsAuthOpen(false);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim() || !regEmail.trim()) {
      showToast('Mohon lengkapi Nama, Nomor WhatsApp, dan Email.', 'error');
      return;
    }

    registerUser({
      name: regName.trim(),
      email: regEmail.trim(),
      phoneWhatsApp: regPhone.trim(),
      address: {
        street: regStreet.trim(),
        subdistrict: regSubdistrict.trim(),
        city: regCity.trim() || 'Jakarta',
        province: 'DKI Jakarta',
        postalCode: regPostal.trim(),
      },
    });

    setIsAuthOpen(false);
  };

  const handleQuickDemoLogin = (role: 'customer' | 'admin') => {
    if (role === 'customer') {
      login('ananda.putri@gmail.com');
    } else {
      login('admin@e-moment.web.id');
    }
    setIsAuthOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-md bg-[#FAF9F6] rounded-xl shadow-2xl border border-[#1E1B18]/15 overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E1B18]/10 bg-white">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-xl font-bold text-[#1E1B18]">
              {activeTab === 'login' ? 'Masuk ke Akun Pelanggan' : 'Daftar Akun e-moment'}
            </h2>
          </div>
          <button
            onClick={() => setIsAuthOpen(false)}
            className="p-1 rounded-md text-[#1E1B18]/50 hover:text-[#1E1B18] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 border-b border-[#1E1B18]/10 bg-white">
          <button
            onClick={() => setActiveTab('login')}
            className={`py-3 text-xs font-semibold transition-colors cursor-pointer text-center ${
              activeTab === 'login'
                ? 'border-b-2 border-[#1E1B18] text-[#1E1B18]'
                : 'text-[#1E1B18]/50 hover:text-[#1E1B18]'
            }`}
          >
            Masuk Akun
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`py-3 text-xs font-semibold transition-colors cursor-pointer text-center ${
              activeTab === 'register'
                ? 'border-b-2 border-[#1E1B18] text-[#1E1B18]'
                : 'text-[#1E1B18]/50 hover:text-[#1E1B18]'
            }`}
          >
            Daftar Akun Baru
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-[#1E1B18]/70 block mb-1">
                  Email atau Nomor WhatsApp
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={loginIdentifier}
                    onChange={(e) => setLoginIdentifier(e.target.value)}
                    placeholder="misal: ananda.putri@gmail.com / 081298765432"
                    className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-[#1E1B18]/20 rounded-md focus:border-[#1E1B18] outline-none"
                    required
                  />
                  <Mail className="w-4 h-4 text-[#1E1B18]/40 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#1E1B18]/70 block mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Masukkan password Anda"
                    className="w-full text-xs pl-9 pr-9 py-2.5 bg-white border border-[#1E1B18]/20 rounded-md focus:border-[#1E1B18] outline-none"
                  />
                  <Lock className="w-4 h-4 text-[#1E1B18]/40 absolute left-3 top-3" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-[#1E1B18]/40 hover:text-[#1E1B18]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-xs text-[#1E1B18]/70">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded"
                  />
                  <span>Ingat Saya</span>
                </label>
                <span className="text-[#8B5A2B] cursor-pointer hover:underline">Lupa Password?</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1E1B18] text-[#FAF9F6] text-xs font-semibold rounded-md hover:bg-[#2C2723] transition-colors cursor-pointer"
              >
                Masuk ke Akun Saya
              </button>

              {/* Quick Demo Logins for smooth evaluation */}
              <div className="pt-4 border-t border-[#1E1B18]/10 space-y-2">
                <span className="text-[10px] text-[#1E1B18]/50 uppercase tracking-wider block text-center">
                  Atau Uji Coba Cepat 1-Klik:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('customer')}
                    className="p-2 bg-white border border-[#1E1B18]/20 hover:border-[#1E1B18] rounded text-left text-xs transition-colors"
                  >
                    <span className="font-semibold text-[#1E1B18] block truncate">Akun Pelanggan</span>
                    <span className="text-[10px] text-[#1E1B18]/60 block truncate">Ananda Putri</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('admin')}
                    className="p-2 bg-[#8B5A2B]/10 border border-[#8B5A2B]/30 hover:border-[#8B5A2B] rounded text-left text-xs transition-colors"
                  >
                    <span className="font-semibold text-[#8B5A2B] block flex items-center gap-1">
                      <Shield className="w-3 h-3" /> Admin Lab
                    </span>
                    <span className="text-[10px] text-[#1E1B18]/60 block truncate">Full Dashboard</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs text-[#1E1B18]/70 block mb-1">Nama Lengkap *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Nama Lengkap Anda"
                    className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-[#1E1B18]/20 rounded focus:border-[#1E1B18] outline-none"
                    required
                  />
                  <User className="w-3.5 h-3.5 text-[#1E1B18]/40 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#1E1B18]/70 block mb-1">
                  Nomor WhatsApp Aktif (Wajib untuk Pesanan) *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="08123456789"
                    className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-[#1E1B18]/20 rounded focus:border-[#1E1B18] outline-none font-mono"
                    required
                  />
                  <Phone className="w-3.5 h-3.5 text-[#1E1B18]/40 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#1E1B18]/70 block mb-1">Email Aktif *</label>
                <div className="relative">
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="email@anda.com"
                    className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-[#1E1B18]/20 rounded focus:border-[#1E1B18] outline-none"
                    required
                  />
                  <Mail className="w-3.5 h-3.5 text-[#1E1B18]/40 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div>
                <label className="text-xs text-[#1E1B18]/70 block mb-1">Password Baru</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full text-xs pl-8 pr-8 py-2 bg-white border border-[#1E1B18]/20 rounded focus:border-[#1E1B18] outline-none"
                  />
                  <Lock className="w-3.5 h-3.5 text-[#1E1B18]/40 absolute left-2.5 top-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-[#1E1B18]/40"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#1E1B18]/70 block mb-1">
                  Alamat Pengiriman Utama (Default)
                </label>
                <input
                  type="text"
                  value={regStreet}
                  onChange={(e) => setRegStreet(e.target.value)}
                  placeholder="Jalan, No. Rumah, Apartemen"
                  className="w-full text-xs px-3 py-2 bg-white border border-[#1E1B18]/20 rounded focus:border-[#1E1B18] outline-none mb-2"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    placeholder="Kota / Kabupaten"
                    className="text-xs px-3 py-1.5 bg-white border border-[#1E1B18]/20 rounded focus:border-[#1E1B18] outline-none"
                  />
                  <input
                    type="text"
                    value={regPostal}
                    onChange={(e) => setRegPostal(e.target.value)}
                    placeholder="Kode Pos"
                    className="text-xs px-3 py-1.5 bg-white border border-[#1E1B18]/20 rounded focus:border-[#1E1B18] outline-none font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#1E1B18] text-[#FAF9F6] text-xs font-semibold rounded-md hover:bg-[#2C2723] transition-colors cursor-pointer mt-2"
              >
                Daftar & Masuk Otomatis
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
