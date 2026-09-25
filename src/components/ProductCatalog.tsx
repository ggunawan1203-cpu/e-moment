import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCategory, Product } from '../types';
import { PhotoMockupRenderer } from './PhotoMockupRenderer';
import { SAMPLE_STUDIO_PHOTOS } from '../data/initialData';
import { ArrowRight, Sliders, CheckCircle, Shield, Award, Sparkles } from 'lucide-react';

export const ProductCatalog: React.FC = () => {
  const { products, openCustomizer } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');

  const categories: { id: ProductCategory; label: string }[] = [
    { id: 'all', label: 'Semua Koleksi' },
    { id: 'framed', label: 'Framed Galeri Kayu' },
    { id: 'canvas', label: 'Kanvas Spanram 3cm' },
    { id: 'standard', label: 'Cetak Standar (2R - 20R)' },
    { id: 'polaroid', label: 'Set Polaroid Retro' },
    { id: 'photobook', label: 'Layflat Photobook' },
    { id: 'photostrip', label: 'Photo Strip Magnet' },
  ];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Catalog Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-semibold tracking-wider text-[#8B5A2B] uppercase">
          Koleksi Cetak Berkualitas Galeri
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1E1B18] mt-2 text-balance">
          Pilih Format Cetak Sesuai Selera Ruangan Anda
        </h2>
        <p className="text-sm sm:text-base text-[#1E1B18]/70 mt-3 font-light">
          Setiap karya dikerjakan teliti dengan kalibrasi monitor profesional, kertas impor bersertifikat, dan opsi pemesanan instan ke WhatsApp.
        </p>

        {/* Category Filter Bar (Interactive Segmented Control) */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2 p-1.5 bg-[#FAF9F6] border border-[#1E1B18]/10 rounded-lg">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-[#1E1B18] text-[#FAF9F6] shadow-sm'
                  : 'text-[#1E1B18]/70 hover:text-[#1E1B18] hover:bg-[#1E1B18]/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid: 3-column desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product, idx) => {
          // Assign demo image per product
          const samplePhoto = SAMPLE_STUDIO_PHOTOS[idx % SAMPLE_STUDIO_PHOTOS.length].url;

          return (
            <div
              key={product.id}
              className="group bg-white border border-[#1E1B18]/10 rounded-lg overflow-hidden flex flex-col hover:border-[#1E1B18]/30 transition-all duration-200 hover:-translate-y-1 shadow-xs"
            >
              {/* Product Visual Mockup Container (65-75% visual weight) */}
              <div className="relative bg-[#FAF9F6] p-6 border-b border-[#1E1B18]/5 flex items-center justify-center overflow-hidden min-h-[280px]">
                {product.badgeText && (
                  <div className="absolute top-3 left-3 z-10 text-[11px] font-semibold text-[#8B5A2B] bg-white/90 px-2 py-0.5 rounded-sm border border-[#8B5A2B]/20">
                    {product.badgeText}
                  </div>
                )}

                <div className="w-full flex items-center justify-center transform group-hover:scale-[1.02] transition-transform duration-300">
                  <PhotoMockupRenderer
                    photoUrl={samplePhoto}
                    mockupType={product.coverMockupType}
                    frameColor="jati"
                    hasMatboard={true}
                    aspectRatioClass="aspect-[4/3]"
                  />
                </div>
              </div>

              {/* Product Details Content */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  {/* Category & Production Time unboxed metadata */}
                  <div className="flex items-center gap-2 text-[11px] text-[#1E1B18]/60 uppercase tracking-wider font-medium">
                    <span>{product.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{product.estimatedProductionDays}</span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#1E1B18] mt-1 group-hover:text-[#8B5A2B] transition-colors leading-snug">
                    {product.name}
                  </h3>

                  <p className="text-xs text-[#1E1B18]/70 mt-2 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Size options preview snippet */}
                  <div className="mt-3 text-[11px] text-[#1E1B18]/60 flex items-center gap-1.5 flex-wrap">
                    <span className="font-medium text-[#1E1B18]">Pilihan:</span>
                    {product.sizes.slice(0, 3).map((s) => (
                      <span key={s.id} className="bg-[#1E1B18]/5 px-1.5 py-0.5 rounded text-[10px]">
                        {s.dimensionCm}
                      </span>
                    ))}
                    {product.sizes.length > 3 && (
                      <span className="text-[10px] text-[#1E1B18]/50">+{product.sizes.length - 3} lagi</span>
                    )}
                  </div>
                </div>

                {/* Price Baseline & Action Button */}
                <div className="pt-4 border-t border-[#1E1B18]/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#1E1B18]/50 block uppercase tracking-wider">Mulai Dari</span>
                    <span className="text-base font-bold text-[#1E1B18] font-mono tabular-nums">
                      {formatRupiah(product.basePrice)}
                    </span>
                  </div>

                  <button
                    onClick={() => openCustomizer(product)}
                    className="px-4 py-2 bg-[#1E1B18] text-[#FAF9F6] text-xs font-semibold rounded-md hover:bg-[#2C2723] transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Kustomisasi</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Craftsmanship & Paper Guide Section (Anchor `#craftsmanship-section`) */}
      <section id="craftsmanship-section" className="mt-28 pt-16 border-t border-[#1E1B18]/10">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-wider text-[#8B5A2B] uppercase">
            Standar Kuratorial Lab
          </span>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-[#1E1B18] mt-2">
            Material Seni Berstandar Museum ISO 9706
          </h2>
          <p className="text-sm text-[#1E1B18]/70 mt-2">
            Kami hanya menggunakan bahan pilihan yang dirancang untuk menjaga estetika, warna tajam, dan ketahanan fisik melintasi generasi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Paper 1: Cotton Rag */}
          <div className="p-6 bg-white border border-[#1E1B18]/10 rounded-lg space-y-3">
            <div className="w-9 h-9 rounded-md bg-[#8B5A2B]/10 text-[#8B5A2B] flex items-center justify-center font-bold text-xs font-mono">
              310g
            </div>
            <h3 className="font-serif text-lg font-bold text-[#1E1B18]">
              Fine Art Cotton Rag Matte 310gsm
            </h3>
            <p className="text-xs text-[#1E1B18]/70 leading-relaxed">
              100% serat katun murni tanpa pemutih kimia (OBA-free). Tekstur matte beludru lembut, bayangan hitam pekat (D-Max tinggi), dan daya tahan uji laboratorium hingga lebih dari 100 tahun bebas pudar.
            </p>
            <div className="pt-2 text-[11px] text-[#8B5A2B] font-medium flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Cocok untuk: Fotografi Monokrom, Lukisan & Galeri
            </div>
          </div>

          {/* Paper 2: Silky Luster Satin */}
          <div className="p-6 bg-white border border-[#1E1B18]/10 rounded-lg space-y-3">
            <div className="w-9 h-9 rounded-md bg-[#8B5A2B]/10 text-[#8B5A2B] flex items-center justify-center font-bold text-xs font-mono">
              260g
            </div>
            <h3 className="font-serif text-lg font-bold text-[#1E1B18]">
              Silky Luster Satin 260gsm
            </h3>
            <p className="text-xs text-[#1E1B18]/70 leading-relaxed">
              Permukaan semi-matte berbutir mutiara halus. Tahan sidik jari, tidak silau saat terkena pantulan lampu ruangan, dan memberikan saturasi warna cerah yang sangat seimbang.
            </p>
            <div className="pt-2 text-[11px] text-[#8B5A2B] font-medium flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Cocok untuk: Foto Wedding, Potret Keluarga, Travel
            </div>
          </div>

          {/* Paper 3: Teak Wood & Matboard */}
          <div className="p-6 bg-white border border-[#1E1B18]/10 rounded-lg space-y-3">
            <div className="w-9 h-9 rounded-md bg-[#8B5A2B]/10 text-[#8B5A2B] flex items-center justify-center font-bold text-xs">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#1E1B18]">
              Bingkai Kayu Jati & Matboard Acid-Free
            </h3>
            <p className="text-xs text-[#1E1B18]/70 leading-relaxed">
              Kayu jati solid perhutani dengan finishing wax alami mempertahankan serat urat kayu eksotis. Dipadukan matboard putih museum 2mm yang mencegah kaca menempel langsung ke permukaan cetakan.
            </p>
            <div className="pt-2 text-[11px] text-[#8B5A2B] font-medium flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" />
              Cocok untuk: Hiasan Dinding Ruang Tamu, Kantor, Hadiah
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
