import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CourierOption, FileDeliveryMethod, UserAddress } from '../types';
import { X, MessageSquare, Truck, ShieldCheck, Check, Send, Link as LinkIcon, User, MapPin, Eye } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartSubtotal,
    clearCart,
    currentUser,
    createOrder,
    setCurrentView,
    setTrackingOrderId,
    shopSettings,
    registerUser,
  } = useApp();

  if (!isCheckoutOpen) return null;

  // Form Fields
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phoneWhatsApp || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [street, setStreet] = useState(currentUser?.address.street || '');
  const [subdistrict, setSubdistrict] = useState(currentUser?.address.subdistrict || '');
  const [city, setCity] = useState(currentUser?.address.city || '');
  const [province, setProvince] = useState(currentUser?.address.province || 'DKI Jakarta');
  const [postalCode, setPostalCode] = useState(currentUser?.address.postalCode || '');

  // Guest options
  const [saveAsAccount, setSaveAsAccount] = useState(false);
  const [guestPassword, setGuestPassword] = useState('');

  // Shipping & File
  const [courier, setCourier] = useState<CourierOption>('SiCepat Reguler');
  const [fileMethod, setFileMethod] = useState<FileDeliveryMethod>('web_upload');
  const [fileLink, setFileLink] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [showWaPreview, setShowWaPreview] = useState(false);

  // Sync if currentUser changes
  useEffect(() => {
    if (currentUser) {
      setCustomerName(currentUser.name);
      setCustomerPhone(currentUser.phoneWhatsApp);
      setCustomerEmail(currentUser.email);
      setStreet(currentUser.address.street);
      setSubdistrict(currentUser.address.subdistrict);
      setCity(currentUser.address.city);
      setProvince(currentUser.address.province);
      setPostalCode(currentUser.address.postalCode);
    }
  }, [currentUser]);

  // Shipping cost calculation
  const freeThreshold = shopSettings.freeShippingThreshold;
  const isFreeShipping = cartSubtotal >= freeThreshold;
  let shippingCost = isFreeShipping ? 0 : shopSettings.flatShippingFee;

  if (courier === 'Ambil Sendiri di Studio') {
    shippingCost = 0;
  } else if (courier === 'JNE YES') {
    shippingCost = isFreeShipping ? 15000 : shopSettings.flatShippingFee + 15000;
  } else if (courier === 'GoSend / Grab Instant') {
    shippingCost = 35000;
  }

  const grandTotal = cartSubtotal + shippingCost;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Build clean markdown message for WhatsApp
  const generateWhatsAppMessage = (orderIdPlaceholder = 'EMO-XXXXXX') => {
    let cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);

    const itemsText = cart
      .map(
        (it, idx) =>
          `${idx + 1}. *${it.productName}*\n   - Ukuran: ${it.size.name}\n   - Kertas: ${it.paper}\n   - Bingkai/Matboard: ${it.frame !== 'none' ? it.frame.toUpperCase() : 'Tanpa Frame'}${it.matboard ? ' (Matboard Galeri)' : ''}\n   - Jumlah: ${it.quantity}x @ ${formatRupiah(it.unitPrice)} = *${formatRupiah(it.totalPrice)}*${it.instructions ? `\n   - Catatan Khusus: "${it.instructions}"` : ''}`
      )
      .join('\n\n');

    let fileMethodText = '';
    if (fileMethod === 'web_upload') {
      fileMethodText = 'Foto sudah di-upload melalui formulir website e-moment.';
    } else if (fileMethod === 'google_drive') {
      fileMethodText = `Link Google Drive / Cloud Master: ${fileLink || '[Link belum diisi]'}`;
    } else {
      fileMethodText = 'File master akan saya kirim langsung via Dokumen WhatsApp di chat ini.';
    }

    return `*HALO TIM LAB E-MOMENT — PESANAN CETAK BARU*
Nomor Pesanan: *#${orderIdPlaceholder}*
Tanggal: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}

*DATA PEMESAN:*
- Nama: *${customerName || '-'}*
- No. WhatsApp: *${cleanPhone || '-'}*
- Email: *${customerEmail || '-'}*
- Alamat Kirim: ${courier === 'Ambil Sendiri di Studio' ? '*AMBIL SENDIRI DI STUDIO LAB*' : `${street}, ${subdistrict}, ${city}, ${province} ${postalCode}`}
- Pilihan Ekspedisi: *${courier}*

*RINCIAN ITEM CETAK (${cart.reduce((a, b) => a + b.quantity, 0)} Pcs):*
${itemsText}

*RINGKASAN PEMBAYARAN:*
- Subtotal Produk: ${formatRupiah(cartSubtotal)}
- Biaya Ongkir: ${shippingCost === 0 ? 'GRATIS (Rp 0)' : formatRupiah(shippingCost)}
- *TOTAL TAGIHAN: ${formatRupiah(grandTotal)}*

*PENGIRIMAN FILE FOTO MASTER:*
${fileMethodText}

${customerNotes ? `*CATATAN TAMBAHAN:* \n"${customerNotes}"\n` : ''}
Mohon konfirmasi ketersediaan antrean cetak dan nomor rekening pembayaran resmi lab. Terima kasih!`;
  };

  const handleCompleteOrder = () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Mohon lengkapi Nama dan Nomor WhatsApp aktif Anda.');
      return;
    }

    if (courier !== 'Ambil Sendiri di Studio' && (!street.trim() || !city.trim())) {
      alert('Mohon lengkapi Alamat Jalan dan Kota tujuan pengiriman.');
      return;
    }

    let cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);

    const shippingAddress: UserAddress = {
      street: street.trim() || 'Studio Pick-Up',
      subdistrict: subdistrict.trim(),
      city: city.trim() || 'Jakarta',
      province: province.trim() || 'DKI Jakarta',
      postalCode: postalCode.trim(),
    };

    // If guest wants to register
    if (!currentUser && saveAsAccount) {
      registerUser({
        name: customerName,
        email: customerEmail || `${cleanPhone}@emoment.id`,
        phoneWhatsApp: cleanPhone,
        address: shippingAddress,
      });
    }

    // 1. Create order in context
    const created = createOrder({
      userId: currentUser?.id,
      customerName: customerName.trim(),
      customerPhoneWhatsApp: cleanPhone,
      customerEmail: customerEmail.trim(),
      shippingAddress,
      isGuest: !currentUser,
      items: [...cart],
      subtotal: cartSubtotal,
      shippingCost,
      courier,
      totalAmount: grandTotal,
      fileMethod,
      fileLink: fileLink.trim(),
      customerNotes: customerNotes.trim(),
    });

    // 2. Generate final WA text
    const finalWaText = generateWhatsAppMessage(created.id);
    const waUrl = `https://wa.me/${shopSettings.adminWhatsApp}?text=${encodeURIComponent(finalWaText)}`;

    // 3. Open WhatsApp in new tab
    window.open(waUrl, '_blank');

    // 4. Clean cart & Route to Tracker
    clearCart();
    setIsCheckoutOpen(false);
    setTrackingOrderId(created.id);
    setCurrentView('tracker');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-4xl bg-[#FAF9F6] rounded-xl shadow-2xl border border-[#1E1B18]/15 overflow-hidden my-6">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E1B18]/10 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366]">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider text-[#8B5A2B] uppercase">
                Direct WhatsApp Checkout
              </span>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#1E1B18]">
                Checkout Pesanan Cetak Foto
              </h2>
            </div>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-md text-[#1E1B18]/50 hover:text-[#1E1B18] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body (Form Left, Order Summary Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[82vh] overflow-y-auto">
          
          {/* LEFT: Customer & Delivery Details (7 cols) */}
          <div className="lg:col-span-7 p-6 space-y-6 border-b lg:border-b-0 lg:border-r border-[#1E1B18]/10">
            
            {/* Auto-fill indicator if logged in */}
            {currentUser ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-800 flex items-center justify-between">
                <span>Data terisi otomatis dari profil Anda: <strong>{currentUser.name}</strong></span>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-emerald-100 px-1.5 py-0.5 rounded">Tersimpan</span>
              </div>
            ) : (
              <div className="p-3 bg-[#FAF9F6] border border-[#1E1B18]/10 rounded-md text-xs text-[#1E1B18]/70 flex items-center justify-between">
                <span>Mode Tamu (Guest Checkout). Tanpa ribet daftar.</span>
                <button
                  onClick={() => {
                    setIsCheckoutOpen(false);
                    setCurrentView('account');
                  }}
                  className="text-xs text-[#8B5A2B] font-semibold underline"
                >
                  Masuk Akun
                </button>
              </div>
            )}

            {/* 1. Contact Information */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E1B18] flex items-center gap-1.5 mb-3">
                <User className="w-3.5 h-3.5 text-[#8B5A2B]" />
                <span>1. Data Kontak Pemesan (Wajib WhatsApp)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-[#1E1B18]/70 block mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nama Anda"
                    className="w-full text-xs px-3 py-2 bg-white border border-[#1E1B18]/20 rounded focus:border-[#1E1B18] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-[#1E1B18]/70 block mb-1">Nomor WhatsApp Aktif *</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="08123456789"
                    className="w-full text-xs px-3 py-2 bg-white border border-[#1E1B18]/20 rounded focus:border-[#1E1B18] outline-none font-mono"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs text-[#1E1B18]/70 block mb-1">Alamat Email (Untuk Bukti Faktur)</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="email@anda.com"
                    className="w-full text-xs px-3 py-2 bg-white border border-[#1E1B18]/20 rounded focus:border-[#1E1B18] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Courier Selection */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E1B18] flex items-center gap-1.5 mb-3">
                <Truck className="w-3.5 h-3.5 text-[#8B5A2B]" />
                <span>2. Metode Pengiriman / Pengambilan</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { id: 'SiCepat Reguler', label: 'SiCepat Reguler (2-3 Hari)', cost: isFreeShipping ? 'Gratis' : 'Rp 18.000' },
                  { id: 'JNE Reguler', label: 'JNE Reguler (2-3 Hari)', cost: isFreeShipping ? 'Gratis' : 'Rp 18.000' },
                  { id: 'JNE YES', label: 'JNE YES (Besok Sampai)', cost: isFreeShipping ? '+Rp 15.000' : 'Rp 33.000' },
                  { id: 'GoSend / Grab Instant', label: 'Instant Kurir (Jabodetabek)', cost: 'Rp 35.000' },
                  { id: 'Ambil Sendiri di Studio', label: 'Ambil Sendiri di Studio Menteng', cost: 'Gratis (Rp 0)' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCourier(c.id as CourierOption)}
                    className={`p-2.5 rounded border text-left transition-all cursor-pointer ${
                      courier === c.id
                        ? 'border-[#1E1B18] bg-white ring-1 ring-[#1E1B18]'
                        : 'border-[#1E1B18]/15 bg-[#FAF9F6]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-[#1E1B18]">
                      <span>{c.label}</span>
                      {courier === c.id && <Check className="w-3.5 h-3.5 text-[#8B5A2B]" />}
                    </div>
                    <span className="text-[11px] text-[#8B5A2B] font-mono block mt-0.5">{c.cost}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Address fields (only if not studio pickup) */}
            {courier !== 'Ambil Sendiri di Studio' && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E1B18] flex items-center gap-1.5 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-[#8B5A2B]" />
                  <span>3. Alamat Lengkap Pengiriman</span>
                </h3>
                <div className="space-y-2">
                  <div>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Nama Jalan, No. Rumah / Gedung / Apartemen, RT/RW"
                      className="w-full text-xs px-3 py-2 bg-white border border-[#1E1B18]/20 rounded focus:border-[#1E1B18] outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={subdistrict}
                      onChange={(e) => setSubdistrict(e.target.value)}
                      placeholder="Kecamatan"
                      className="text-xs px-3 py-2 bg-white border border-[#1E1B18]/20 rounded focus:border-[#1E1B18] outline-none"
                    />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Kota / Kabupaten"
                      className="text-xs px-3 py-2 bg-white border border-[#1E1B18]/20 rounded focus:border-[#1E1B18] outline-none"
                    />
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="Kode Pos"
                      className="text-xs px-3 py-2 bg-white border border-[#1E1B18]/20 rounded focus:border-[#1E1B18] outline-none font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. High-Res Master File Delivery Method */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E1B18] flex items-center gap-1.5 mb-2">
                <LinkIcon className="w-3.5 h-3.5 text-[#8B5A2B]" />
                <span>4. Pengiriman File Foto Asli Resolusi Penuh</span>
              </h3>
              <div className="space-y-2 text-xs">
                {[
                  {
                    id: 'web_upload',
                    title: 'Gunakan foto yang telah di-upload di website ini',
                    desc: 'Tim lab akan langsung mengolah file yang sudah Anda unggah.',
                  },
                  {
                    id: 'google_drive',
                    title: 'Lampirkan Link Google Drive / WeTransfer / Dropbox',
                    desc: 'Direkomendasikan untuk file master RAW / TIFF / resolusi raksasa.',
                  },
                  {
                    id: 'wa_document',
                    title: 'Kirim file langsung via Dokumen WhatsApp',
                    desc: 'Kirim foto kualitas tanpa kompresi setelah room chat WA terbuka.',
                  },
                ].map((m) => (
                  <label
                    key={m.id}
                    className={`block p-3 rounded border cursor-pointer transition-colors ${
                      fileMethod === m.id
                        ? 'border-[#1E1B18] bg-white ring-1 ring-[#1E1B18]'
                        : 'border-[#1E1B18]/15 bg-[#FAF9F6]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="fileMethod"
                        checked={fileMethod === m.id}
                        onChange={() => setFileMethod(m.id as FileDeliveryMethod)}
                        className="text-[#1E1B18]"
                      />
                      <span className="font-semibold text-[#1E1B18]">{m.title}</span>
                    </div>
                    <p className="text-[11px] text-[#1E1B18]/60 mt-1 pl-5">{m.desc}</p>
                  </label>
                ))}

                {fileMethod === 'google_drive' && (
                  <div className="pt-2 pl-5">
                    <input
                      type="url"
                      value={fileLink}
                      onChange={(e) => setFileLink(e.target.value)}
                      placeholder="https://drive.google.com/drive/folders/..."
                      className="w-full text-xs px-3 py-2 bg-white border border-[#1E1B18]/20 rounded focus:border-[#1E1B18] outline-none"
                    />
                    <span className="text-[10px] text-[#1E1B18]/50 block mt-1">
                      Pastikan hak akses link sudah disetel ke "Siapa saja yang memiliki link dapat melihat".
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 5. Additional Notes */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#1E1B18] block mb-1">
                5. Catatan Tambahan (Opsional)
              </label>
              <input
                type="text"
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Misal: untuk kado ulang tahun tgl 28 September, tolong bungkus rapi."
                className="w-full text-xs px-3 py-2 bg-white border border-[#1E1B18]/20 rounded focus:border-[#1E1B18] outline-none"
              />
            </div>

            {/* Guest save account toggle */}
            {!currentUser && (
              <div className="p-3 bg-[#1E1B18]/5 rounded-md space-y-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#1E1B18]">
                  <input
                    type="checkbox"
                    checked={saveAsAccount}
                    onChange={(e) => setSaveAsAccount(e.target.checked)}
                    className="rounded"
                  />
                  <span>Simpan data ini sebagai Akun Pelanggan (Agar mudah lacak pesanan)</span>
                </label>
                {saveAsAccount && (
                  <div className="pt-1">
                    <input
                      type="password"
                      value={guestPassword}
                      onChange={(e) => setGuestPassword(e.target.value)}
                      placeholder="Buat Password Akun Anda"
                      className="w-full text-xs px-3 py-1.5 bg-white border border-[#1E1B18]/20 rounded"
                    />
                  </div>
                )}
              </div>
            )}

          </div>

          {/* RIGHT: Order Summary & WhatsApp Preview (5 cols) */}
          <div className="lg:col-span-5 p-6 bg-[#FAF9F6] flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E1B18]/10 pb-3">
                <h3 className="font-serif text-base font-bold text-[#1E1B18]">
                  Ringkasan Pesanan ({cart.length} Item)
                </h3>
                <button
                  type="button"
                  onClick={() => setShowWaPreview(!showWaPreview)}
                  className="text-xs text-[#8B5A2B] font-semibold flex items-center gap-1 hover:underline"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showWaPreview ? 'Lihat Rincian Item' : 'Preview Format WA'}</span>
                </button>
              </div>

              {/* Show either Item List OR WhatsApp message live preview */}
              {showWaPreview ? (
                <div className="p-3.5 bg-[#DCF8C6]/50 border border-[#25D366]/30 rounded-lg text-xs font-mono text-[#1E1B18] space-y-2 max-h-72 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  <div className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider mb-1">
                    Preview Pesan yang Dikirim ke WhatsApp Lab:
                  </div>
                  {generateWhatsAppMessage()}
                </div>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3 text-xs bg-white p-3 rounded border border-[#1E1B18]/10">
                      <img
                        src={item.userPhotoUrl}
                        alt={item.productName}
                        className="w-12 h-12 object-cover rounded shrink-0 border"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-[#1E1B18] truncate">{item.productName}</p>
                        <p className="text-[11px] text-[#8B5A2B] font-mono">{item.size.name} · {item.quantity}x</p>
                        <p className="text-[10px] text-[#1E1B18]/60 truncate">{item.paper}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold font-mono tabular-nums">{formatRupiah(item.totalPrice)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Cost Calculations */}
              <div className="p-4 bg-white rounded-lg border border-[#1E1B18]/10 space-y-2 text-xs">
                <div className="flex justify-between text-[#1E1B18]/70">
                  <span>Subtotal Item:</span>
                  <span className="font-mono tabular-nums text-[#1E1B18]">{formatRupiah(cartSubtotal)}</span>
                </div>

                <div className="flex justify-between text-[#1E1B18]/70">
                  <span>Ongkos Kirim ({courier}):</span>
                  <span className="font-mono tabular-nums text-[#1E1B18]">
                    {shippingCost === 0 ? (
                      <span className="text-emerald-700 font-bold">GRATIS</span>
                    ) : (
                      formatRupiah(shippingCost)
                    )}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#1E1B18]/10 flex justify-between text-sm font-bold text-[#1E1B18]">
                  <span>Total Tagihan:</span>
                  <span className="font-serif text-lg text-[#8B5A2B] font-mono tabular-nums">
                    {formatRupiah(grandTotal)}
                  </span>
                </div>
              </div>

              {/* Bank & Payment Info Snippet */}
              <div className="p-3 bg-[#1E1B18]/5 rounded text-[11px] text-[#1E1B18]/70 space-y-1">
                <p className="font-semibold text-[#1E1B18]">Instruksi Pembayaran:</p>
                <p>Setelah mengklik tombol di bawah, rincian pesanan akan langsung terkirim ke WhatsApp Lab e-moment (+{shopSettings.adminWhatsApp}). Tim kami akan memvalidasi foto dan mengirim rekening resmi BCA/Mandiri atau QRIS.</p>
              </div>

            </div>

            {/* Primary Action Button */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleCompleteOrder}
                className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-md transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Pesanan ke WhatsApp & Selesaikan</span>
              </button>

              <p className="text-[10px] text-center text-[#1E1B18]/50">
                Pemesanan Anda akan tersimpan di sistem riwayat & langsung membuka WhatsApp.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
