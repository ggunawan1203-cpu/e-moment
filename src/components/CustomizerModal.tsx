import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Product, SizeOption, PaperType, FrameColor, LaminationType, CartItem } from '../types';
import { PhotoMockupRenderer } from './PhotoMockupRenderer';
import { SAMPLE_STUDIO_PHOTOS } from '../data/initialData';
import { X, Upload, Check, Info, ShieldCheck, ArrowRight, ShoppingBag, MessageSquare } from 'lucide-react';

export const CustomizerModal: React.FC = () => {
  const {
    selectedProductForCustomizer,
    closeCustomizer,
    addToCart,
    setIsCartOpen,
    setIsCheckoutOpen,
  } = useApp();

  const product = selectedProductForCustomizer;
  if (!product) return null;

  // State
  const [selectedSize, setSelectedSize] = useState<SizeOption>(product.sizes[0]);
  const [selectedPaper, setSelectedPaper] = useState<PaperType>(product.supportedPapers[0]);
  const [selectedFrame, setSelectedFrame] = useState<FrameColor>(
    product.supportedFrames.includes('jati') ? 'jati' : product.supportedFrames[0]
  );
  const [hasMatboard, setHasMatboard] = useState<boolean>(true);
  const [selectedLamination, setSelectedLamination] = useState<LaminationType>(
    product.supportedLaminations[0]
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [instructions, setInstructions] = useState<string>('');
  const [customCaption, setCustomCaption] = useState<string>('Our Best Moments · 2026');

  // Customer's uploaded or selected photo
  const [userPhoto, setUserPhoto] = useState<string>(SAMPLE_STUDIO_PHOTOS[0].url);
  const [photoFileName, setPhotoFileName] = useState<string>('sample-curated-photo.jpg');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Price calculation
  // Base price + Size delta + Paper delta + Lamination delta
  let unitPrice = product.basePrice + selectedSize.priceDelta;

  if (selectedPaper === 'Fine Art Cotton Rag Matte 310gsm') {
    unitPrice += 25000;
  }
  if (selectedLamination === 'Laminasi Doff Dingin Velvet') {
    unitPrice += 15000;
  } else if (selectedLamination === 'Laminasi Glossy UV Crystal') {
    unitPrice += 15000;
  }

  const totalPrice = unitPrice * quantity;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUserPhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const buildCartItem = (): CartItem => {
    return {
      id: 'cart-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      productId: product.id,
      productName: product.name,
      category: product.category,
      userPhotoUrl: userPhoto,
      size: selectedSize,
      paper: selectedPaper,
      frame: selectedFrame,
      matboard: hasMatboard,
      lamination: selectedLamination,
      instructions: instructions.trim(),
      quantity,
      unitPrice,
      totalPrice,
    };
  };

  const handleAddToCart = () => {
    const item = buildCartItem();
    addToCart(item);
    closeCustomizer();
    setIsCartOpen(true);
  };

  const handleBuyNowDirectWA = () => {
    const item = buildCartItem();
    addToCart(item);
    closeCustomizer();
    setIsCheckoutOpen(true);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="relative w-full max-w-5xl bg-[#FAF9F6] rounded-xl shadow-2xl border border-[#1E1B18]/15 overflow-hidden my-6">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E1B18]/10 bg-white">
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-[#8B5A2B] uppercase">
              Kustomisasi Cetak Fine Art
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1E1B18]">
              {product.name}
            </h2>
          </div>
          <button
            onClick={closeCustomizer}
            className="p-2 rounded-md text-[#1E1B18]/50 hover:text-[#1E1B18] hover:bg-[#1E1B18]/5 transition-colors cursor-pointer"
            aria-label="Tutup kustomisasi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Split 2 columns (Left: Live Preview & Photo Upload, Right: Customization Controls) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[82vh] overflow-y-auto">
          
          {/* LEFT: Live Mockup & Upload (5 cols) */}
          <div className="lg:col-span-6 bg-[#F3EFEA] p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#1E1B18]/10">
            
            {/* Live Interactive Mockup View */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1E1B18]/70">
                  Live Preview Mockup Realistis
                </span>
                <span className="text-[11px] text-[#8B5A2B] font-mono">
                  {selectedSize.dimensionCm}
                </span>
              </div>

              {/* The Live Rendered Frame / Canvas / Polaroid */}
              <div className="bg-[#FAF9F6] rounded-lg border border-[#1E1B18]/10 min-h-[300px] flex items-center justify-center p-2">
                <PhotoMockupRenderer
                  photoUrl={userPhoto}
                  mockupType={product.coverMockupType}
                  frameColor={selectedFrame}
                  hasMatboard={hasMatboard}
                  aspectRatioClass="aspect-[4/3]"
                  caption={customCaption}
                />
              </div>

              {/* Photo Source Switcher & Upload */}
              <div className="bg-white p-4 rounded-lg border border-[#1E1B18]/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#1E1B18]">Foto yang Akan Dicetak:</span>
                  <span className="text-[11px] text-[#1E1B18]/50 truncate max-w-[150px]">{photoFileName}</span>
                </div>

                {/* Upload Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div className="flex gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-2 px-3 bg-[#1E1B18] text-[#FAF9F6] rounded-md text-xs font-semibold hover:bg-[#2C2723] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Foto dari HP / PC</span>
                  </button>
                </div>

                {/* Or Pick Curated Samples */}
                <div>
                  <span className="text-[10px] text-[#1E1B18]/60 uppercase tracking-wider block mb-1.5">
                    Atau coba dengan foto kurasi lab:
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {SAMPLE_STUDIO_PHOTOS.map((sample) => (
                      <button
                        key={sample.id}
                        onClick={() => {
                          setUserPhoto(sample.url);
                          setPhotoFileName(sample.title);
                        }}
                        className={`aspect-square rounded border overflow-hidden transition-all cursor-pointer ${
                          userPhoto === sample.url
                            ? 'ring-2 ring-[#8B5A2B] border-transparent'
                            : 'border-[#1E1B18]/15 hover:opacity-80'
                        }`}
                        title={sample.title}
                      >
                        <img src={sample.url} alt={sample.title} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Polaroid Memo Note Input if applicable */}
                {product.category === 'polaroid' && (
                  <div className="pt-2 border-t border-[#1E1B18]/10">
                    <label className="text-xs font-medium text-[#1E1B18] block mb-1">
                      Tulisan Caption di Bawah Polaroid:
                    </label>
                    <input
                      type="text"
                      value={customCaption}
                      onChange={(e) => setCustomCaption(e.target.value)}
                      placeholder="e.g. Bali Trip 2026"
                      className="w-full text-xs px-3 py-1.5 bg-[#FAF9F6] border border-[#1E1B18]/20 rounded focus:outline-none focus:border-[#1E1B18]"
                      maxLength={40}
                    />
                  </div>
                )}
              </div>

            </div>

            {/* Quality assurance notice */}
            <div className="mt-4 pt-3 border-t border-[#1E1B18]/10 text-[11px] text-[#1E1B18]/60 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#8B5A2B] shrink-0" />
              <span>File master resolusi tinggi asli Anda dapat dilampirkan via Google Drive atau dokumen WhatsApp saat checkout.</span>
            </div>

          </div>

          {/* RIGHT: Customization Controls (6 cols) */}
          <div className="lg:col-span-6 p-6 space-y-6 overflow-y-auto">
            
            {/* 1. Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-[#1E1B18]">
                  1. Pilih Ukuran Cetak
                </label>
                <span className="text-[11px] text-[#1E1B18]/50">Rasio Presisi</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.sizes.map((sz) => (
                  <button
                    key={sz.id}
                    onClick={() => setSelectedSize(sz)}
                    className={`p-2.5 rounded-md border text-left transition-all cursor-pointer ${
                      selectedSize.id === sz.id
                        ? 'border-[#1E1B18] bg-white ring-1 ring-[#1E1B18]'
                        : 'border-[#1E1B18]/15 bg-[#FAF9F6] hover:border-[#1E1B18]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#1E1B18]">{sz.name}</span>
                      {selectedSize.id === sz.id && <Check className="w-3.5 h-3.5 text-[#8B5A2B]" />}
                    </div>
                    <span className="text-[11px] text-[#1E1B18]/60 block font-mono">
                      {sz.dimensionCm} {sz.priceDelta > 0 && `(+${formatRupiah(sz.priceDelta)})`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Frame Color Selection (if supported) */}
            {product.supportedFrames.length > 1 && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#1E1B18] block mb-2">
                  2. Pilihan Finishing Bingkai Kayu
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {product.supportedFrames.includes('jati') && (
                    <button
                      onClick={() => setSelectedFrame('jati')}
                      className={`p-2 rounded-md border text-center transition-all cursor-pointer ${
                        selectedFrame === 'jati'
                          ? 'border-[#8B5A2B] bg-[#8B5A2B]/10 font-semibold text-[#8B5A2B]'
                          : 'border-[#1E1B18]/15 hover:bg-white'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-[#9C6734] mx-auto mb-1 border border-[#6E441B]" />
                      <span className="text-xs block">Kayu Jati Solid</span>
                    </button>
                  )}

                  {product.supportedFrames.includes('hitam') && (
                    <button
                      onClick={() => setSelectedFrame('hitam')}
                      className={`p-2 rounded-md border text-center transition-all cursor-pointer ${
                        selectedFrame === 'hitam'
                          ? 'border-[#18181B] bg-slate-100 font-semibold text-black'
                          : 'border-[#1E1B18]/15 hover:bg-white'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-[#18181B] mx-auto mb-1" />
                      <span className="text-xs block">Hitam Doff</span>
                    </button>
                  )}

                  {product.supportedFrames.includes('putih') && (
                    <button
                      onClick={() => setSelectedFrame('putih')}
                      className={`p-2 rounded-md border text-center transition-all cursor-pointer ${
                        selectedFrame === 'putih'
                          ? 'border-[#1E1B18] bg-white font-semibold text-black'
                          : 'border-[#1E1B18]/15 hover:bg-white'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white mx-auto mb-1 border border-slate-300" />
                      <span className="text-xs block">Putih Bersih</span>
                    </button>
                  )}
                </div>

                {/* Matboard Option Toggle */}
                {product.category === 'framed' && (
                  <div className="mt-3 flex items-center justify-between p-2.5 bg-white border border-[#1E1B18]/10 rounded-md">
                    <div>
                      <span className="text-xs font-semibold text-[#1E1B18] block">
                        Matboard Museum Acid-Free 2mm
                      </span>
                      <span className="text-[11px] text-[#1E1B18]/60">
                        Memberi batas nafas putih galeri & proteksi kaca
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setHasMatboard(!hasMatboard)}
                      className={`px-3 py-1 text-xs font-medium rounded cursor-pointer transition-colors ${
                        hasMatboard
                          ? 'bg-[#1E1B18] text-white'
                          : 'bg-[#1E1B18]/10 text-[#1E1B18]'
                      }`}
                    >
                      {hasMatboard ? 'Aktif (Rekomendasi)' : 'Tanpa Matboard'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* 3. Paper Selection */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#1E1B18] block mb-2">
                3. Jenis Kertas Archival Lab
              </label>
              <div className="space-y-2">
                {product.supportedPapers.map((paper) => (
                  <button
                    key={paper}
                    onClick={() => setSelectedPaper(paper)}
                    className={`w-full p-3 rounded-md border text-left transition-all cursor-pointer ${
                      selectedPaper === paper
                        ? 'border-[#1E1B18] bg-white ring-1 ring-[#1E1B18]'
                        : 'border-[#1E1B18]/15 bg-[#FAF9F6] hover:border-[#1E1B18]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#1E1B18]">{paper}</span>
                      {selectedPaper === paper && <Check className="w-3.5 h-3.5 text-[#8B5A2B]" />}
                    </div>
                    <p className="text-[11px] text-[#1E1B18]/60 mt-0.5">
                      {paper.includes('Cotton Rag')
                        ? '100% Cotton archival museum grade, tekstur beludru matte, tahan 100+ tahun (+Rp 25.000)'
                        : paper.includes('Silky Luster')
                        ? 'Semi-matte berbutir mutiara, anti sidik jari, pantulan cahaya rendah'
                        : 'Warna sangat tajam dan vibran dengan kilap reflektif elegan'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Lamination Selection */}
            {product.supportedLaminations.length > 1 && (
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#1E1B18] block mb-2">
                  4. Lapisan Pelindung Laminasi
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {product.supportedLaminations.map((lam) => (
                    <button
                      key={lam}
                      onClick={() => setSelectedLamination(lam)}
                      className={`p-2 rounded-md border text-left transition-all cursor-pointer ${
                        selectedLamination === lam
                          ? 'border-[#1E1B18] bg-white ring-1 ring-[#1E1B18]'
                          : 'border-[#1E1B18]/15 bg-[#FAF9F6]'
                      }`}
                    >
                      <span className="text-xs font-medium text-[#1E1B18] block leading-tight">{lam}</span>
                      <span className="text-[10px] text-[#1E1B18]/50 block mt-0.5">
                        {lam === 'Tanpa Laminasi' ? 'Alami' : '+Rp 15.000'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Special Notes for Lab */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#1E1B18] block mb-1.5">
                5. Instruksi Khusus Tim Lab Cetak (Opsional)
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Contoh: 'Tolong jangan crop kepala', 'Beri border putih 1cm di tepi', 'Bantu cerahkan tone wajah'."
                className="w-full text-xs p-3 bg-white border border-[#1E1B18]/20 rounded-md focus:outline-none focus:border-[#1E1B18] h-18 resize-none"
              />
            </div>

            {/* Quantity Stepper & Price Calculation */}
            <div className="pt-4 border-t border-[#1E1B18]/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#1E1B18]/60 block">Jumlah Cetak</span>
                <div className="flex items-center gap-3 mt-1 bg-white border border-[#1E1B18]/20 rounded-md px-2 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-6 h-6 flex items-center justify-center text-sm font-bold text-[#1E1B18] hover:bg-[#FAF9F6] rounded"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold font-mono min-w-4 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-6 h-6 flex items-center justify-center text-sm font-bold text-[#1E1B18] hover:bg-[#FAF9F6] rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-[#1E1B18]/50 uppercase tracking-wider block">Total Harga</span>
                <span className="font-serif text-2xl font-bold text-[#1E1B18] font-mono tabular-nums">
                  {formatRupiah(totalPrice)}
                </span>
              </div>
            </div>

            {/* Dual CTAs: Tambah ke Keranjang OR Beli Langsung ke WhatsApp */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-4 bg-white border border-[#1E1B18] text-[#1E1B18] rounded-md text-xs font-semibold hover:bg-[#1E1B18]/5 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Tambah ke Keranjang</span>
              </button>

              <button
                onClick={handleBuyNowDirectWA}
                className="flex-1 py-3 px-4 bg-[#1E1B18] text-[#FAF9F6] rounded-md text-xs font-semibold hover:bg-[#2C2723] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <MessageSquare className="w-4 h-4 text-[#25D366]" />
                <span>Beli Langsung ke WhatsApp</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
