import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SAMPLE_STUDIO_PHOTOS } from '../data/initialData';
import { PhotoMockupRenderer } from './PhotoMockupRenderer';
import { ArrowRight, Sparkles, Check, Image as ImageIcon } from 'lucide-react';

export const Hero: React.FC = () => {
  const { products, openCustomizer, setCurrentView } = useApp();
  const [activeMockupTab, setActiveMockupTab] = useState<'framed' | 'canvas' | 'polaroid'>('framed');
  const [activeFrameColor, setActiveFrameColor] = useState<'jati' | 'hitam' | 'putih'>('jati');

  // Featured product (Framed minimalis)
  const featuredProduct = products.find((p) => p.category === 'framed') || products[0];

  return (
    <section className="relative overflow-hidden bg-[#FAF9F6] border-b border-[#1E1B18]/10 pt-10 pb-16 lg:py-20">
      {/* Background architectural fine lines */}
      <div className="absolute inset-0 paper-texture opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Unboxed Quiet Kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[#8B5A2B] uppercase">
              <span>Bespoke Photo & Fine Art Printing Lab</span>
              <span aria-hidden="true">·</span>
              <span>Kualitas Galeri Seni</span>
            </div>

            {/* Display Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#1E1B18] leading-[1.12] text-balance">
              Ubah Foto Berharga Anda Menjadi Karya Seni Bertaraf Galeri.
            </h1>

            {/* Body Prose */}
            <p className="text-base sm:text-lg text-[#1E1B18]/75 leading-relaxed max-w-2xl font-light">
              Laboratorium cetak foto independen dengan standar kuratorial museum. Menggunakan tinta pigmen 12-warna tahan pudar 100+ tahun, media katun archival bebas asam, serta bingkai kayu jati solid pilihan. Transaksi instan via Direct WhatsApp.
            </p>

            {/* Unboxed Metadata Proof Points */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-[#1E1B18]/70">
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-[#8B5A2B]" />
                12-Warna UltraChrome Archival
              </span>
              <span aria-hidden="true" className="text-[#1E1B18]/30">·</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-[#8B5A2B]" />
                Cotton Rag 310gsm Acid-Free
              </span>
              <span aria-hidden="true" className="text-[#1E1B18]/30">·</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-[#8B5A2B]" />
                Bingkai Kayu Jati Solid Natural
              </span>
              <span aria-hidden="true" className="text-[#1E1B18]/30">·</span>
              <span className="flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5 text-[#8B5A2B]" />
                Direct Order ke WhatsApp
              </span>
            </div>

            {/* CTA Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => openCustomizer(featuredProduct)}
                className="px-6 py-3.5 bg-[#1E1B18] text-[#FAF9F6] text-sm font-semibold rounded-md hover:bg-[#2C2723] transition-all shadow-sm flex items-center gap-2 group cursor-pointer"
              >
                <span>Mulai Kustomisasi Foto Saya</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setCurrentView('tracker')}
                className="px-5 py-3.5 border border-[#1E1B18]/20 text-[#1E1B18] text-sm font-medium rounded-md hover:bg-[#1E1B18]/5 transition-colors cursor-pointer"
              >
                Lacak Status Pesanan
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-6 border-t border-[#1E1B18]/10 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <p className="font-serif text-2xl font-bold text-[#1E1B18]">100+</p>
                <p className="text-xs text-[#1E1B18]/60 mt-0.5">Tahun Tahan Pudar</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-[#1E1B18]">2-3</p>
                <p className="text-xs text-[#1E1B18]/60 mt-0.5">Hari Kerja Jadi</p>
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-[#1E1B18]">4.9 / 5</p>
                <p className="text-xs text-[#1E1B18]/60 mt-0.5">Kepuasan Pelanggan</p>
              </div>
            </div>

          </div>

          {/* Right Column: Live Interactive Mockup Showcase (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-[#FAF9F6] border border-[#1E1B18]/15 rounded-lg p-4 sm:p-6 shadow-sm">
              
              {/* Mockup Header Switcher (Interactive Segmented Control) */}
              <div className="flex items-center justify-between border-b border-[#1E1B18]/10 pb-3 mb-4">
                <span className="text-xs font-semibold text-[#1E1B18] uppercase tracking-wider">
                  Live Gallery Preview
                </span>
                
                {/* Segmented Controls for mockup type */}
                <div className="flex items-center gap-1 bg-[#1E1B18]/5 p-0.5 rounded-md">
                  <button
                    onClick={() => setActiveMockupTab('framed')}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                      activeMockupTab === 'framed'
                        ? 'bg-white text-[#1E1B18] shadow-xs'
                        : 'text-[#1E1B18]/60 hover:text-[#1E1B18]'
                    }`}
                  >
                    Framed
                  </button>
                  <button
                    onClick={() => setActiveMockupTab('canvas')}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                      activeMockupTab === 'canvas'
                        ? 'bg-white text-[#1E1B18] shadow-xs'
                        : 'text-[#1E1B18]/60 hover:text-[#1E1B18]'
                    }`}
                  >
                    Kanvas
                  </button>
                  <button
                    onClick={() => setActiveMockupTab('polaroid')}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                      activeMockupTab === 'polaroid'
                        ? 'bg-white text-[#1E1B18] shadow-xs'
                        : 'text-[#1E1B18]/60 hover:text-[#1E1B18]'
                    }`}
                  >
                    Polaroid
                  </button>
                </div>
              </div>

              {/* Live Render Area */}
              <div className="min-h-[300px] flex items-center justify-center bg-[#FAF9F6]/80 rounded-md border border-[#1E1B18]/5">
                <PhotoMockupRenderer
                  photoUrl={
                    activeMockupTab === 'framed'
                      ? SAMPLE_STUDIO_PHOTOS[0].url
                      : activeMockupTab === 'canvas'
                      ? SAMPLE_STUDIO_PHOTOS[1].url
                      : SAMPLE_STUDIO_PHOTOS[2].url
                  }
                  mockupType={activeMockupTab}
                  frameColor={activeFrameColor}
                  hasMatboard={true}
                  aspectRatioClass="aspect-[4/3]"
                  caption="Liburan Keluarga di Bromo · 2026"
                />
              </div>

              {/* Sub-controls when 'framed' is active */}
              {activeMockupTab === 'framed' && (
                <div className="mt-4 pt-3 border-t border-[#1E1B18]/10 flex items-center justify-between">
                  <span className="text-xs text-[#1E1B18]/70">Pilihan Bingkai Kayu:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveFrameColor('jati')}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-all cursor-pointer ${
                        activeFrameColor === 'jati'
                          ? 'bg-[#8B5A2B] text-white font-medium shadow-xs'
                          : 'bg-[#1E1B18]/5 text-[#1E1B18]/80 hover:bg-[#1E1B18]/10'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-[#9C6734]" />
                      Kayu Jati
                    </button>
                    <button
                      onClick={() => setActiveFrameColor('hitam')}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-all cursor-pointer ${
                        activeFrameColor === 'hitam'
                          ? 'bg-[#18181B] text-white font-medium shadow-xs'
                          : 'bg-[#1E1B18]/5 text-[#1E1B18]/80 hover:bg-[#1E1B18]/10'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-[#18181B]" />
                      Hitam Doff
                    </button>
                    <button
                      onClick={() => setActiveFrameColor('putih')}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-all cursor-pointer ${
                        activeFrameColor === 'putih'
                          ? 'bg-[#E4E4E7] text-[#1E1B18] font-medium shadow-xs'
                          : 'bg-[#1E1B18]/5 text-[#1E1B18]/80 hover:bg-[#1E1B18]/10'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full bg-white border border-slate-300" />
                      Putih Bersih
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Quick Test Drive Button */}
              <div className="mt-4">
                <button
                  onClick={() => openCustomizer(featuredProduct)}
                  className="w-full py-2.5 bg-[#FAF9F6] border border-[#1E1B18]/20 hover:border-[#1E1B18] text-[#1E1B18] text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-[#8B5A2B]" />
                  <span>Coba Pasang Foto Sendiri di Mockup Ini</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
