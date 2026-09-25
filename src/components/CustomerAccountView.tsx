import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Phone, Mail, MapPin, Package, Clock, MessageSquare, ArrowRight, Save, LogOut } from 'lucide-react';

export const CustomerAccountView: React.FC = () => {
  const {
    currentUser,
    orders,
    updateUserProfile,
    logout,
    openAuthModal,
    setCurrentView,
    setTrackingOrderId,
    shopSettings,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  // Edit profile state
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phoneWhatsApp || '');
  const [street, setStreet] = useState(currentUser?.address.street || '');
  const [subdistrict, setSubdistrict] = useState(currentUser?.address.subdistrict || '');
  const [city, setCity] = useState(currentUser?.address.city || '');
  const [province, setProvince] = useState(currentUser?.address.province || 'DKI Jakarta');
  const [postalCode, setPostalCode] = useState(currentUser?.address.postalCode || '');

  if (!currentUser) {
    return (
      <div className="py-20 max-w-xl mx-auto px-4 text-center">
        <div className="bg-white p-8 rounded-xl border border-[#1E1B18]/10 shadow-sm space-y-4">
          <div className="w-14 h-14 rounded-full bg-[#1E1B18]/5 flex items-center justify-center mx-auto text-[#8B5A2B]">
            <User className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1E1B18]">
            Masuk ke Akun Pelanggan
          </h2>
          <p className="text-xs text-[#1E1B18]/70 leading-relaxed max-w-md mx-auto">
            Dapatkan kemudahan checkout otomatis tanpa isi ulang alamat, pantau riwayat cetak foto Anda, dan simpan alamat favorit.
          </p>
          <div className="pt-3 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => openAuthModal('login')}
              className="py-2.5 px-6 bg-[#1E1B18] text-[#FAF9F6] text-xs font-semibold rounded-md hover:bg-[#2C2723] transition-colors cursor-pointer"
            >
              Masuk Akun
            </button>
            <button
              onClick={() => openAuthModal('register')}
              className="py-2.5 px-6 border border-[#1E1B18]/20 text-[#1E1B18] text-xs font-semibold rounded-md hover:bg-[#1E1B18]/5 transition-colors cursor-pointer"
            >
              Daftar Akun Baru
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter orders for current user by ID or by customer email/phone
  const userOrders = orders.filter(
    (o) =>
      o.userId === currentUser.id ||
      o.customerEmail.toLowerCase() === currentUser.email.toLowerCase() ||
      o.customerPhoneWhatsApp.replace(/\D/g, '') === currentUser.phoneWhatsApp.replace(/\D/g, '')
  );

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      phoneWhatsApp: phone,
      address: {
        street,
        subdistrict,
        city,
        province,
        postalCode,
      },
    });
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Menunggu Pembayaran':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Pembayaran Diterima':
      case 'Sedang Dicetak':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Finishing & Bingkai':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Dikirim':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      case 'Siap Diambil':
      case 'Selesai':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Dibatalkan':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="py-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Account Header */}
      <div className="bg-white p-6 rounded-xl border border-[#1E1B18]/10 shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#8B5A2B]/10 text-[#8B5A2B] font-serif font-bold text-xl flex items-center justify-center border border-[#8B5A2B]/20">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-[#1E1B18]">{currentUser.name}</h1>
              <span className="text-[10px] text-[#8B5A2B] font-semibold uppercase tracking-wider bg-[#8B5A2B]/10 px-2 py-0.5 rounded">
                {currentUser.role === 'admin' ? 'Admin Lab' : 'Pelanggan'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-[#1E1B18]/60 mt-1">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#25D366]" />
                +{currentUser.phoneWhatsApp}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                {currentUser.email}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Akun</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1E1B18]/10 mb-8 gap-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'orders'
              ? 'border-b-2 border-[#1E1B18] text-[#1E1B18]'
              : 'text-[#1E1B18]/50 hover:text-[#1E1B18]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Riwayat Pesanan Saya ({userOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'profile'
              ? 'border-b-2 border-[#1E1B18] text-[#1E1B18]'
              : 'text-[#1E1B18]/50 hover:text-[#1E1B18]'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Data Diri & Buku Alamat Default</span>
        </button>
      </div>

      {/* TAB 1: ORDER HISTORY */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {userOrders.length === 0 ? (
            <div className="bg-white p-12 rounded-xl border border-[#1E1B18]/10 text-center space-y-3">
              <Package className="w-10 h-10 text-[#1E1B18]/30 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-[#1E1B18]">Belum Ada Pesanan Cetak</h3>
              <p className="text-xs text-[#1E1B18]/60 max-w-sm mx-auto">
                Anda belum pernah memesan cetak foto di e-moment. Buat karya berbingkai kayu atau kanvas galeri pertama Anda sekarang.
              </p>
              <button
                onClick={() => setCurrentView('store')}
                className="mt-2 px-5 py-2.5 bg-[#1E1B18] text-[#FAF9F6] text-xs font-semibold rounded-md hover:bg-[#2C2723] transition-colors"
              >
                Mulai Kustomisasi Foto
              </button>
            </div>
          ) : (
            userOrders.map((order) => {
              const waAskMessage = `Halo Tim Lab e-moment, saya ingin menanyakan status pesanan saya *#${order.id}* (a/n ${order.customerName}).`;
              const waUrl = `https://wa.me/${shopSettings.adminWhatsApp}?text=${encodeURIComponent(waAskMessage)}`;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-[#1E1B18]/10 shadow-xs overflow-hidden"
                >
                  {/* Order Top Bar */}
                  <div className="p-4 sm:p-5 bg-[#FAF9F6] border-b border-[#1E1B18]/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-[#1E1B18] font-mono">
                          #{order.id}
                        </span>
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#1E1B18]/60 block mt-0.5">
                        Dipesan pada: {new Date(order.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })} WIB
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-medium rounded flex items-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Tanya Admin via WA</span>
                      </a>

                      <button
                        onClick={() => {
                          setTrackingOrderId(order.id);
                          setCurrentView('tracker');
                        }}
                        className="px-3 py-1.5 bg-[#1E1B18] text-[#FAF9F6] text-xs font-medium rounded hover:bg-[#2C2723] transition-colors flex items-center gap-1"
                      >
                        <span>Lacak Timeline</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 sm:p-6 divide-y divide-[#1E1B18]/10 space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                        <img
                          src={item.userPhotoUrl}
                          alt={item.productName}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded border border-[#1E1B18]/10 shrink-0 bg-[#FAF9F6]"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h4 className="font-serif font-bold text-sm text-[#1E1B18] truncate">
                              {item.productName}
                            </h4>
                            <div className="text-xs text-[#1E1B18]/70 mt-1 space-y-0.5">
                              <p>
                                Ukuran: <strong className="font-mono">{item.size.name}</strong> · Kertas:{' '}
                                {item.paper}
                              </p>
                              {item.frame !== 'none' && (
                                <p>Bingkai: Kayu {item.frame.toUpperCase()}{item.matboard ? ' + Matboard Galeri' : ''}</p>
                              )}
                              {item.instructions && (
                                <p className="text-[11px] text-[#1E1B18]/50 italic">
                                  Instruksi: "{item.instructions}"
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs pt-2">
                            <span className="text-[#1E1B18]/60">Jumlah: {item.quantity} pcs</span>
                            <span className="font-mono font-bold text-[#1E1B18] tabular-nums">
                              {formatRupiah(item.totalPrice)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer & Tracking Snippet */}
                  <div className="p-4 sm:p-5 bg-[#FAF9F6] border-t border-[#1E1B18]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <p className="text-[#1E1B18]/70">
                        Ekspedisi: <strong>{order.courier}</strong>
                      </p>
                      {order.trackingNumber ? (
                        <p className="text-[#8B5A2B] font-mono mt-0.5">
                          No. Resi Pengiriman: <strong>{order.trackingNumber}</strong>
                        </p>
                      ) : (
                        <p className="text-[#1E1B18]/50 text-[11px] mt-0.5">
                          Nomor resi akan dikirim via chat WhatsApp setelah paket diserahkan ke kurir.
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-[#1E1B18]/50 uppercase tracking-wider block">Total Pembayaran</span>
                      <span className="font-serif text-lg font-bold text-[#8B5A2B] font-mono tabular-nums">
                        {formatRupiah(order.totalAmount)}
                      </span>
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: PROFILE & ADDRESS BOOK */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white p-6 sm:p-8 rounded-xl border border-[#1E1B18]/10 shadow-xs space-y-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1E1B18]">Informasi Data Diri</h3>
            <p className="text-xs text-[#1E1B18]/60 mt-1">
              Data ini akan otomatis mengisi form setiap kali Anda checkout cetak foto di e-moment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#1E1B18] block mb-1">Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-[#1E1B18]/20 rounded focus:border-[#1E1B18] outline-none"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1E1B18] block mb-1">Nomor WhatsApp Aktif</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-[#1E1B18]/20 rounded focus:border-[#1E1B18] outline-none font-mono"
                required
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#1E1B18]/10 space-y-4">
            <div>
              <h4 className="font-serif text-base font-bold text-[#1E1B18]">Buku Alamat Pengiriman Utama</h4>
              <p className="text-xs text-[#1E1B18]/60 mt-0.5">
                Alamat pengiriman default untuk kirim paket bingkai kayu atau kanvas galeri Anda.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#1E1B18] block mb-1">Alamat Jalan & No. Rumah / Apartemen</label>
              <input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder="Jl. Thamrin No. 1, Tower B Lt. 12"
                className="w-full text-xs px-3 py-2 bg-white border border-[#1E1B18]/20 rounded focus:border-[#1E1B18] outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#1E1B18] block mb-1">Kecamatan</label>
                <input
                  type="text"
                  value={subdistrict}
                  onChange={(e) => setSubdistrict(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-[#1E1B18]/20 rounded focus:border-[#1E1B18] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1E1B18] block mb-1">Kota / Kabupaten</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-[#1E1B18]/20 rounded focus:border-[#1E1B18] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#1E1B18] block mb-1">Kode Pos</label>
                <input
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-[#1E1B18]/20 rounded focus:border-[#1E1B18] outline-none font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#1E1B18]/10 flex justify-end">
            <button
              type="submit"
              className="py-2.5 px-6 bg-[#1E1B18] text-[#FAF9F6] text-xs font-semibold rounded-md hover:bg-[#2C2723] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Perubahan Profil</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
