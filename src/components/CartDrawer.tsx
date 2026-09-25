import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, ArrowRight, Truck, ShoppingBag, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    setIsCheckoutOpen,
    shopSettings,
  } = useApp();

  if (!isCartOpen) return null;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const freeShippingThreshold = shopSettings.freeShippingThreshold;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = freeShippingThreshold - cartSubtotal;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF9F6] border-l border-[#1E1B18]/15 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-[#1E1B18]/10 bg-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#8B5A2B]" />
              <h2 className="font-serif text-lg font-bold text-[#1E1B18]">Keranjang Cetak</h2>
              <span className="text-xs font-mono text-[#1E1B18]/60">({cart.length} item)</span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-md text-[#1E1B18]/60 hover:text-[#1E1B18] transition-colors"
              aria-label="Tutup keranjang"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="bg-[#FAF9F6] px-6 py-3 border-b border-[#1E1B18]/10">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center gap-1.5 font-medium text-[#1E1B18]">
                <Truck className="w-3.5 h-3.5 text-[#8B5A2B]" />
                {cartSubtotal >= freeShippingThreshold ? (
                  <span className="text-emerald-700 font-semibold">Selamat! Anda mendapatkan Gratis Ongkir!</span>
                ) : (
                  <span>
                    Belanja <strong>{formatRupiah(remainingForFreeShipping)}</strong> lagi untuk Gratis Ongkir
                  </span>
                )}
              </div>
              <span className="font-mono text-[11px] text-[#1E1B18]/60">{progressPercent}%</span>
            </div>
            {/* Meter Bar */}
            <div className="w-full bg-[#1E1B18]/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#8B5A2B] h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#1E1B18]/5 flex items-center justify-center text-[#1E1B18]/40">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-base font-bold text-[#1E1B18]">Keranjang Anda Kosong</h3>
                <p className="text-xs text-[#1E1B18]/60 max-w-xs leading-relaxed">
                  Belum ada foto yang dipilih. Jelajahi katalog cetak foto berbingkai, kanvas, atau album kami.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-4 py-2 bg-[#1E1B18] text-[#FAF9F6] text-xs font-semibold rounded-md hover:bg-[#2C2723] transition-colors"
                >
                  Lihat Katalog Cetak
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-white rounded-lg border border-[#1E1B18]/10 shadow-xs flex gap-4"
                >
                  {/* Photo Thumbnail */}
                  <div className="w-20 h-20 rounded bg-[#FAF9F6] border border-[#1E1B18]/10 overflow-hidden shrink-0 relative">
                    <img
                      src={item.userPhotoUrl}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {item.frame !== 'none' && (
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[8px] text-white text-center py-0.5 uppercase tracking-wider">
                        {item.frame}
                      </span>
                    )}
                  </div>

                  {/* Item Specs & Price */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-[#1E1B18] truncate">
                          {item.productName}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#1E1B18]/40 hover:text-red-600 transition-colors p-0.5"
                          title="Hapus item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-[#1E1B18]/70 mt-1 space-y-0.5">
                        <p className="font-mono text-[#8B5A2B]">{item.size.name}</p>
                        <p className="truncate">{item.paper}</p>
                        {item.instructions && (
                          <p className="text-[10px] text-[#1E1B18]/50 italic truncate">
                            Catatan: "{item.instructions}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Stepper & Total Item Price */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#1E1B18]/5 mt-2">
                      <div className="flex items-center gap-2 border border-[#1E1B18]/20 rounded px-1.5 py-0.5 bg-[#FAF9F6]">
                        <button
                          onClick={() => updateCartQuantity(item.id, -1)}
                          className="text-xs text-[#1E1B18] hover:font-bold px-1"
                        >
                          -
                        </button>
                        <span className="text-xs font-mono font-bold min-w-3 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, 1)}
                          className="text-xs text-[#1E1B18] hover:font-bold px-1"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-bold text-[#1E1B18] font-mono tabular-nums">
                        {formatRupiah(item.totalPrice)}
                      </span>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#1E1B18]/10 bg-white space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#1E1B18]/70">
                  <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} item):</span>
                  <span className="font-mono tabular-nums text-[#1E1B18] font-medium">
                    {formatRupiah(cartSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-[#1E1B18]/70">
                  <span>Estimasi Ongkir:</span>
                  <span className="font-mono tabular-nums text-[#1E1B18] font-medium">
                    {cartSubtotal >= freeShippingThreshold ? 'Gratis (Jabodetabek)' : 'Dihitung di Checkout'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#1E1B18] pt-2 border-t border-[#1E1B18]/10">
                  <span>Total Tagihan:</span>
                  <span className="font-mono tabular-nums text-base text-[#8B5A2B]">
                    {formatRupiah(cartSubtotal)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 bg-[#1E1B18] text-[#FAF9F6] text-xs font-semibold rounded-md hover:bg-[#2C2723] transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <span>Lanjut ke Checkout WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[10px] text-center text-[#1E1B18]/50 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#8B5A2B]" />
                <span>Pemesanan Langsung Terhubung ke WhatsApp Lab e-moment</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
