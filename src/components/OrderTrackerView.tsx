import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';
import { Search, CheckCircle2, Circle, Clock, Truck, Package, MessageSquare, Copy, Check, ArrowRight } from 'lucide-react';

export const OrderTrackerView: React.FC = () => {
  const { orders, trackingOrderId, setTrackingOrderId, shopSettings } = useApp();

  const [searchQuery, setSearchQuery] = useState(trackingOrderId || '');
  const [matchedOrder, setMatchedOrder] = useState<Order | null>(null);
  const [copiedResi, setCopiedResi] = useState(false);

  useEffect(() => {
    if (trackingOrderId) {
      setSearchQuery(trackingOrderId);
      findOrder(trackingOrderId);
    } else if (orders.length > 0) {
      // Default to the first order for instant demonstration
      setMatchedOrder(orders[0]);
      setSearchQuery(orders[0].id);
    }
  }, [trackingOrderId, orders]);

  const findOrder = (query: string) => {
    const cleanQuery = query.trim().toUpperCase();
    const cleanPhone = query.replace(/\D/g, '');

    const found = orders.find(
      (o) =>
        o.id.toUpperCase() === cleanQuery ||
        (cleanPhone.length >= 8 && o.customerPhoneWhatsApp.replace(/\D/g, '').includes(cleanPhone))
    );

    setMatchedOrder(found || null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    findOrder(searchQuery);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Timeline Step logic
  const TIMELINE_STEPS: { status: OrderStatus; label: string; desc: string }[] = [
    {
      status: 'Menunggu Pembayaran',
      label: '1. Pesanan Diterima & Verifikasi File',
      desc: 'Pesanan dicatat, kurator lab memverifikasi kelayakan resolusi foto master.',
    },
    {
      status: 'Pembayaran Diterima',
      label: '2. Pembayaran Terkonfirmasi',
      desc: 'Bukti transfer BCA/Mandiri atau QRIS telah diverifikasi finance lab.',
    },
    {
      status: 'Sedang Dicetak',
      label: '3. Proses Cetak Pigmen 12-Warna',
      desc: 'File di-rastering dengan profil ICC kertas bersangkutan di mesin lab Jepang.',
    },
    {
      status: 'Finishing & Bingkai',
      label: '4. Finishing, Bingkai & Quality Control',
      desc: 'Pemasangan matboard museum, frame kayu jati solid, dan inspeksi detail.',
    },
    {
      status: 'Dikirim',
      label: '5. Paket Diserahkan ke Ekspedisi / Siap Diambil',
      desc: 'Paket dibungkus bubble wrap lapis tebal & diserahkan ke kurir pilihan.',
    },
    {
      status: 'Selesai',
      label: '6. Pesanan Selesai Diterima',
      desc: 'Foto telah menghiasi dinding ruangan Anda dengan indah dan aman.',
    },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'Menunggu Pembayaran':
        return 0;
      case 'Pembayaran Diterima':
        return 1;
      case 'Sedang Dicetak':
        return 2;
      case 'Finishing & Bingkai':
        return 3;
      case 'Dikirim':
      case 'Siap Diambil':
        return 4;
      case 'Selesai':
        return 5;
      default:
        return 0;
    }
  };

  const currentStepIdx = matchedOrder ? getStepIndex(matchedOrder.status) : 0;

  const handleCopyResi = (resi: string) => {
    navigator.clipboard.writeText(resi);
    setCopiedResi(true);
    setTimeout(() => setCopiedResi(false), 2000);
  };

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-semibold tracking-wider text-[#8B5A2B] uppercase">
          Customer Order Tracker
        </span>
        <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1E1B18] mt-1">
          Lacak Proses Pengerjaan Cetak Foto Anda
        </h1>
        <p className="text-xs text-[#1E1B18]/70 mt-2">
          Masukkan ID Pesanan (misal: EMO-260925-1048) atau Nomor WhatsApp aktif yang Anda gunakan saat pemesanan.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto mb-10">
        <div className="flex bg-white rounded-lg border border-[#1E1B18]/20 shadow-sm p-1.5 focus-within:border-[#1E1B18] focus-within:ring-1 focus-within:ring-[#1E1B18] transition-all">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari ID Pesanan (EMO-...) atau No. WhatsApp"
            className="w-full text-xs sm:text-sm px-4 py-2 bg-transparent outline-none text-[#1E1B18]"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#1E1B18] text-[#FAF9F6] text-xs font-semibold rounded-md hover:bg-[#2C2723] transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Lacak</span>
          </button>
        </div>

        {/* Quick Sample Links */}
        <div className="mt-2 text-center text-[11px] text-[#1E1B18]/50 flex items-center justify-center gap-2 flex-wrap">
          <span>Coba ID contoh:</span>
          {orders.slice(0, 3).map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => {
                setSearchQuery(o.id);
                findOrder(o.id);
              }}
              className="text-[#8B5A2B] hover:underline font-mono"
            >
              {o.id}
            </button>
          ))}
        </div>
      </form>

      {/* Results View */}
      {matchedOrder ? (
        <div className="bg-white rounded-xl border border-[#1E1B18]/10 shadow-xs overflow-hidden space-y-6">
          
          {/* Order Snapshot Header */}
          <div className="p-6 bg-[#FAF9F6] border-b border-[#1E1B18]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-serif text-xl font-bold text-[#1E1B18] font-mono">
                  #{matchedOrder.id}
                </h2>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-[#8B5A2B]/10 text-[#8B5A2B] border border-[#8B5A2B]/20">
                  {matchedOrder.status}
                </span>
              </div>
              <p className="text-xs text-[#1E1B18]/60 mt-1">
                Pemesan: <strong>{matchedOrder.customerName}</strong> ({matchedOrder.customerPhoneWhatsApp})
              </p>
            </div>

            {/* Direct WA Consultation Button */}
            <a
              href={`https://wa.me/${shopSettings.adminWhatsApp}?text=${encodeURIComponent(
                `Halo Admin Lab e-moment, saya ingin menanyakan perkembangan pesanan saya *#${matchedOrder.id}* (Status: ${matchedOrder.status}).`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold rounded-md flex items-center gap-2 transition-colors shrink-0 shadow-xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Tanya Admin via WhatsApp</span>
            </a>
          </div>

          {/* Tracking Number Callout (if shipped) */}
          {matchedOrder.trackingNumber ? (
            <div className="mx-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <span className="font-semibold text-emerald-900 block">Paket Sedang Dalam Pengiriman</span>
                  <span className="text-emerald-700">
                    Ekspedisi: <strong>{matchedOrder.courier}</strong> · No. Resi:{' '}
                    <strong className="font-mono text-sm">{matchedOrder.trackingNumber}</strong>
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopyResi(matchedOrder.trackingNumber!)}
                className="px-3 py-1.5 bg-white border border-emerald-300 rounded text-emerald-800 font-medium flex items-center gap-1.5 hover:bg-emerald-100 transition-colors"
              >
                {copiedResi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedResi ? 'Tersalin!' : 'Salin Resi'}</span>
              </button>
            </div>
          ) : matchedOrder.courier === 'Ambil Sendiri di Studio' && matchedOrder.status === 'Siap Diambil' ? (
            <div className="mx-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 space-y-1">
              <span className="font-semibold block">Pesanan Siap Diambil di Studio Menteng!</span>
              <p>Silakan tunjukkan ID Pesanan <strong>#{matchedOrder.id}</strong> kepada staf lab kami di {shopSettings.studioAddress}.</p>
            </div>
          ) : null}

          {/* Visual Step-by-Step Timeline */}
          <div className="p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E1B18] mb-6">
              Timeline Progress Pengerjaan Cetak
            </h3>

            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1E1B18]/15">
              {TIMELINE_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;

                return (
                  <div key={step.status} className="relative group">
                    {/* Circle icon */}
                    <div
                      className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${
                        isCurrent
                          ? 'bg-[#8B5A2B] text-white ring-4 ring-[#8B5A2B]/20'
                          : isPassed
                          ? 'bg-[#1E1B18] text-white'
                          : 'bg-white border-2 border-[#1E1B18]/20 text-[#1E1B18]/40'
                      }`}
                    >
                      {isPassed ? <Check className="w-3 h-3" /> : idx + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4
                          className={`text-xs sm:text-sm font-bold ${
                            isCurrent
                              ? 'text-[#8B5A2B]'
                              : isPassed
                              ? 'text-[#1E1B18]'
                              : 'text-[#1E1B18]/50'
                          }`}
                        >
                          {step.label}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] bg-[#8B5A2B]/10 text-[#8B5A2B] font-semibold px-2 py-0.5 rounded">
                            Sedang Berjalan
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-xs mt-1 leading-relaxed ${
                          isPassed ? 'text-[#1E1B18]/70' : 'text-[#1E1B18]/40'
                        }`}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Item Details Summary in Order */}
          <div className="p-6 bg-[#FAF9F6] border-t border-[#1E1B18]/10 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1B18]">
              Foto & Format yang Sedang Diproses
            </h4>

            <div className="space-y-3">
              {matchedOrder.items.map((item) => (
                <div key={item.id} className="flex gap-4 bg-white p-3.5 rounded border border-[#1E1B18]/10 text-xs">
                  <img
                    src={item.userPhotoUrl}
                    alt={item.productName}
                    className="w-14 h-14 object-cover rounded border shrink-0 bg-[#FAF9F6]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[#1E1B18]">{item.productName}</p>
                    <p className="text-[11px] text-[#8B5A2B] font-mono mt-0.5">
                      {item.size.name} · {item.quantity} pcs · {formatRupiah(item.totalPrice)}
                    </p>
                    <p className="text-[10px] text-[#1E1B18]/60 mt-0.5 truncate">
                      Kertas: {item.paper} {item.frame !== 'none' ? `· Bingkai: ${item.frame}` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 flex items-center justify-between text-xs text-[#1E1B18]/70">
              <span>Alamat Pengiriman: {matchedOrder.shippingAddress.street}, {matchedOrder.shippingAddress.city}</span>
              <span className="font-bold text-[#1E1B18]">Total: {formatRupiah(matchedOrder.totalAmount)}</span>
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white p-12 rounded-xl border border-[#1E1B18]/10 text-center space-y-3 max-w-lg mx-auto">
          <Clock className="w-10 h-10 text-[#1E1B18]/30 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-[#1E1B18]">Pesanan Tidak Ditemukan</h3>
          <p className="text-xs text-[#1E1B18]/60 leading-relaxed">
            Tidak ada pesanan yang cocok dengan kata kunci "{searchQuery}". Periksa kembali ID Pesanan atau nomor WhatsApp yang Anda masukkan.
          </p>
        </div>
      )}

    </div>
  );
};
