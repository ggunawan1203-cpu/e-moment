import React from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, Phone, MapPin, Clock, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, shopSettings, openAuthModal } = useApp();

  return (
    <footer className="bg-[#1E1B18] text-[#FAF9F6] border-t border-[#FAF9F6]/10 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand Promise Ribbon */}
        <div className="border-b border-[#FAF9F6]/10 pb-12 mb-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="w-10 h-10 rounded-md bg-[#FAF9F6]/5 flex items-center justify-center shrink-0 text-[#D4A373]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm tracking-wide text-[#FAF9F6]">Garansi Archival Museum</h4>
              <p className="text-xs text-[#FAF9F6]/60 mt-1 leading-relaxed">
                Tinta pigmen 12-warna tahan pudar lebih dari 100 tahun di atas media bebas asam (acid-free cotton rag).
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="w-10 h-10 rounded-md bg-[#FAF9F6]/5 flex items-center justify-center shrink-0 text-[#D4A373]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm tracking-wide text-[#FAF9F6]">Pengerjaan Lab Presisi</h4>
              <p className="text-xs text-[#FAF9F6]/60 mt-1 leading-relaxed">
                Setiap file dikalibrasi warnanya oleh kurator cetak profesional sebelum naik ke mesin produksi.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="w-10 h-10 rounded-md bg-[#FAF9F6]/5 flex items-center justify-center shrink-0 text-[#D4A373]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm tracking-wide text-[#FAF9F6]">Direct WhatsApp Checkout</h4>
              <p className="text-xs text-[#FAF9F6]/60 mt-1 leading-relaxed">
                Pemesanan praktis tanpa kartu kredit rumit, langsung terhubung ke konsultan lab cetak kami.
              </p>
            </div>
          </div>
        </div>

        {/* 4-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-xs">
          
          {/* Col 1: Brand Wordmark & About */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl font-bold tracking-tight text-[#FAF9F6]">
              e-moment<span className="text-[#D4A373]">.web.id</span>
            </h3>
            <p className="text-[#FAF9F6]/70 leading-relaxed">
              Laboratorium cetak foto fine art independen di Menteng, Jakarta. Mengubah kenangan digital berharga Anda menjadi karya seni rupa abadi bernilai galeri tinggi.
            </p>
            <a
              href={`https://wa.me/${shopSettings.adminWhatsApp}?text=${encodeURIComponent('Halo Tim Lab e-moment, saya ingin konsultasi cetak foto fine art.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-[#25D366] text-white font-medium hover:bg-[#20ba59] transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Chat WhatsApp Lab: +{shopSettings.adminWhatsApp}</span>
            </a>
          </div>

          {/* Col 2: Katalog Koleksi */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm tracking-wider uppercase text-[#FAF9F6]/90">Koleksi Cetak</h4>
            <ul className="space-y-2 text-[#FAF9F6]/70">
              <li>
                <button onClick={() => setCurrentView('store')} className="hover:text-white transition-colors">
                  Cetak Framed Kayu Jati Solid
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('store')} className="hover:text-white transition-colors">
                  Kanvas Stretched Spanram 3cm
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('store')} className="hover:text-white transition-colors">
                  Fine Art Enlargement (2R - 20R)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('store')} className="hover:text-white transition-colors">
                  Set Polaroid Retro & Wooden Clip
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('store')} className="hover:text-white transition-colors">
                  Bespoke Layflat Photobook Album
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('store')} className="hover:text-white transition-colors">
                  Photo Strip Magnet Kulkas
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Layanan & Akun */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm tracking-wider uppercase text-[#FAF9F6]/90">Layanan & Akun</h4>
            <ul className="space-y-2 text-[#FAF9F6]/70">
              <li>
                <button onClick={() => setCurrentView('tracker')} className="hover:text-white transition-colors">
                  Lacak Status Pengerjaan Pesanan
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('account')} className="hover:text-white transition-colors">
                  Buku Alamat & Akun Saya
                </button>
              </li>
              <li>
                <button onClick={() => openAuthModal('register')} className="hover:text-white transition-colors">
                  Daftar Akun Baru (Pelanggan)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('admin')} className="hover:text-white transition-colors text-[#D4A373]">
                  Portal Manajemen Admin Lab
                </button>
              </li>
              <li>
                <span className="text-[#FAF9F6]/50">Pengiriman: SiCepat, JNE, GoSend/Grab, Ambil Studio</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Studio Fisik & Jam Buka */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm tracking-wider uppercase text-[#FAF9F6]/90">Studio & Workshop</h4>
            <div className="space-y-2 text-[#FAF9F6]/70">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4A373] shrink-0 mt-0.5" />
                <span>{shopSettings.studioAddress}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#D4A373] shrink-0 mt-0.5" />
                <span>{shopSettings.operatingHours}</span>
              </div>
            </div>
            <div className="pt-2">
              <span className="text-[11px] text-[#FAF9F6]/50 block">Pembayaran Resmi:</span>
              <span className="text-xs text-[#FAF9F6]/80 font-mono">BCA · Mandiri · QRIS All Payment</span>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-[#FAF9F6]/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FAF9F6]/50 gap-4">
          <p>© {new Date().getFullYear()} e-moment.web.id. All rights reserved. Bespoke Fine Art Printing Lab.</p>
          <div className="flex items-center gap-6">
            <span>Standar Kertas Archival ISO 9706</span>
            <span aria-hidden="true">·</span>
            <span>Jakarta Pusat, Indonesia</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
