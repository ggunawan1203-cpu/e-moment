import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Order, OrderStatus, ProductCategory } from '../types';
import {
  Shield,
  Package,
  ShoppingCart,
  DollarSign,
  Clock,
  Plus,
  Search,
  MessageSquare,
  Edit,
  Trash2,
  CheckCircle,
  Truck,
  Settings,
  Send,
  ExternalLink,
  X,
  Save,
  Eye,
  Database,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    shopSettings,
    updateShopSettings,
    showToast,
    setIsXamppModalOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings'>('orders');

  // Order filters & search
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>('');

  // Quick Tracking Number Modal / State
  const [editingTrackingOrderId, setEditingTrackingOrderId] = useState<string | null>(null);
  const [quickTrackingNumber, setQuickTrackingNumber] = useState<string>('');

  // Customer WhatsApp Chat Modal
  const [activeChatOrder, setActiveChatOrder] = useState<Order | null>(null);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);
  const [customChatMessage, setCustomChatMessage] = useState<string>('');

  // Product Add / Edit Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<ProductCategory>('framed');
  const [prodTagline, setProdTagline] = useState('');
  const [prodDescription, setProdDescription] = useState('');
  const [prodBasePrice, setProdBasePrice] = useState(125000);
  const [prodEstDays, setProdEstDays] = useState('2 - 3 Hari Kerja');
  const [prodInStock, setProdInStock] = useState(true);
  const [prodMockupType, setProdMockupType] = useState<Product['coverMockupType']>('framed');

  // Store settings form state
  const [settingsShopName, setSettingsShopName] = useState(shopSettings.shopName);
  const [settingsAdminWa, setSettingsAdminWa] = useState(shopSettings.adminWhatsApp);
  const [settingsStudioAddr, setSettingsStudioAddr] = useState(shopSettings.studioAddress);
  const [settingsBankInfo, setSettingsBankInfo] = useState(shopSettings.bankInfo);
  const [settingsFlatShipping, setSettingsFlatShipping] = useState(shopSettings.flatShippingFee);
  const [settingsFreeThreshold, setSettingsFreeThreshold] = useState(shopSettings.freeShippingThreshold);
  const [settingsHours, setSettingsHours] = useState(shopSettings.operatingHours);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Summary Metrics
  const totalOmset = orders
    .filter((o) => o.status !== 'Dibatalkan' && o.status !== 'Menunggu Pembayaran')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const totalOrdersCount = orders.length;
  const pendingPaymentCount = orders.filter((o) => o.status === 'Menunggu Pembayaran').length;
  const inProgressCount = orders.filter(
    (o) => o.status === 'Sedang Dicetak' || o.status === 'Finishing & Bingkai'
  ).length;

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    const matchStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const cleanSearch = orderSearchQuery.toLowerCase().trim();
    const matchSearch =
      !cleanSearch ||
      o.id.toLowerCase().includes(cleanSearch) ||
      o.customerName.toLowerCase().includes(cleanSearch) ||
      o.customerPhoneWhatsApp.includes(cleanSearch);
    return matchStatus && matchSearch;
  });

  // Open Chat WhatsApp Modal with templates
  const openCustomerChatModal = (order: Order) => {
    setActiveChatOrder(order);
    setSelectedTemplateIndex(0);
    // set initial template message
    updateTemplateText(order, 0);
  };

  const getChatTemplates = (order: Order) => [
    {
      title: '1. Rincian Tagihan & Rekening Bank',
      text: `Halo Kak *${order.customerName}*, terima kasih telah memesan cetak foto di *e-moment.web.id*.\n\nPesanan Kakak telah kami catat dengan nomor: *#${order.id}*\nTotal Tagihan: *${formatRupiah(order.totalAmount)}*\n\nSilakan transfer ke rekening resmi lab kami:\n${shopSettings.bankInfo}\n\nSetelah transfer, mohon kirimkan bukti transfer ke chat ini ya Kak agar segera masuk ke antrean cetak mesin. Terima kasih!`,
    },
    {
      title: '2. Pembayaran Diterima & Masuk Antrean Cetak',
      text: `Halo Kak *${order.customerName}*,\n\nPembayaran untuk pesanan *#${order.id}* telah kami terima dengan baik. File foto Kakak saat ini sudah masuk ke antrean kalibrasi warna dan mesin cetak pigmen 12-warna kami. Estimasi selesai pengerjaan: 1-2 hari kerja. Kami akan kabari kembali saat proses cetak selesai!`,
    },
    {
      title: '3. Update Cetak Selesai & Finishing Bingkai',
      text: `Halo Kak *${order.customerName}*,\n\nKabar baik! Foto pesanan Kakak *#${order.id}* sudah selesai dicetak dengan sempurna. Saat ini sedang dalam tahap pemasangan bingkai kayu/finishing dan Quality Control (QC) agar hasilnya maksimal dan presisi sebelum dikemas.`,
    },
    {
      title: '4. Kirim Nomor Resi Ekspedisi',
      text: `Halo Kak *${order.customerName}*,\n\nPaket pesanan cetak foto Kakak *#${order.id}* telah rapi terbungkus bubble wrap tebal dan sudah diserahkan ke ekspedisi *${order.courier}*.\n\nNomor Resi: *${order.trackingNumber || '[Belum diisi]'}*\nKakak dapat melacak perjalanan paket di web kurir atau di: https://e-moment.web.id\n\nTerima kasih telah mempercayakan kenangan Kakak bersama e-moment!`,
    },
    {
      title: '5. Siap Diambil di Studio Menteng',
      text: `Halo Kak *${order.customerName}*,\n\nPesanan cetak foto Kakak *#${order.id}* SUDAH SELESAI dan siap diambil di Studio Lab e-moment Menteng.\n\nAlamat: ${shopSettings.studioAddress}\nJam Operasional: ${shopSettings.operatingHours}\n\nSilakan tunjukkan ID Pesanan #${order.id} kepada tim kami saat mengambil. Ditunggu kedatangannya Kak!`,
    },
    {
      title: '6. Pesan Bebas Kustom',
      text: `Halo Kak *${order.customerName}*, terkait pesanan cetak *#${order.id}* di e-moment: `,
    },
  ];

  const updateTemplateText = (order: Order, index: number) => {
    const tpls = getChatTemplates(order);
    setSelectedTemplateIndex(index);
    setCustomChatMessage(tpls[index].text);
  };

  const handleSendWaToCustomer = () => {
    if (!activeChatOrder) return;
    const cleanPhone = activeChatOrder.customerPhoneWhatsApp.replace(/\D/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(customChatMessage)}`;
    window.open(url, '_blank');
  };

  // Product Add / Edit Handlers
  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProdName('');
    setProdCategory('framed');
    setProdTagline('');
    setProdDescription('');
    setProdBasePrice(125000);
    setProdEstDays('2 - 3 Hari Kerja');
    setProdInStock(true);
    setProdMockupType('framed');
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProdName(p.name);
    setProdCategory(p.category);
    setProdTagline(p.tagline);
    setProdDescription(p.description);
    setProdBasePrice(p.basePrice);
    setProdEstDays(p.estimatedProductionDays);
    setProdInStock(p.inStock);
    setProdMockupType(p.coverMockupType);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) return;

    if (editingProductId) {
      updateProduct(editingProductId, {
        name: prodName,
        category: prodCategory,
        tagline: prodTagline,
        description: prodDescription,
        basePrice: prodBasePrice,
        estimatedProductionDays: prodEstDays,
        inStock: prodInStock,
        coverMockupType: prodMockupType,
      });
    } else {
      addProduct({
        name: prodName,
        category: prodCategory,
        tagline: prodTagline || 'Cetak Foto Archival Berkualitas Galeri',
        description: prodDescription || 'Dibuat dengan standar kuratorial museum.',
        basePrice: prodBasePrice,
        estimatedProductionDays: prodEstDays,
        inStock: prodInStock,
        coverMockupType: prodMockupType,
        coverAccent: '#8B5A2B',
        sizes: [
          { id: 'size-1', name: 'Standar (20 x 25 cm)', dimensionCm: '20 x 25 cm', ratio: '4:5', priceDelta: 0 },
          { id: 'size-2', name: 'Large (30 x 40 cm)', dimensionCm: '30 x 40 cm', ratio: '3:4', priceDelta: 85000 },
        ],
        supportedPapers: [
          'Fine Art Cotton Rag Matte 310gsm',
          'Silky Luster Satin 260gsm',
          'Glossy High-Definition 260gsm',
        ],
        supportedFrames: prodCategory === 'framed' ? ['jati', 'hitam', 'putih'] : ['none'],
        supportedLaminations: [
          'Tanpa Laminasi',
          'Laminasi Doff Dingin Velvet',
          'Laminasi Glossy UV Crystal',
        ],
      });
    }

    setIsProductModalOpen(false);
  };

  const handleSaveShopSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateShopSettings({
      shopName: settingsShopName,
      adminWhatsApp: settingsAdminWa.replace(/\D/g, ''),
      studioAddress: settingsStudioAddr,
      bankInfo: settingsBankInfo,
      flatShippingFee: Number(settingsFlatShipping),
      freeShippingThreshold: Number(settingsFreeThreshold),
      operatingHours: settingsHours,
    });
  };

  const ALL_ORDER_STATUSES: OrderStatus[] = [
    'Menunggu Pembayaran',
    'Pembayaran Diterima',
    'Sedang Dicetak',
    'Finishing & Bingkai',
    'Dikirim',
    'Siap Diambil',
    'Selesai',
    'Dibatalkan',
  ];

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Dashboard Top Header */}
      <div className="bg-white p-6 rounded-xl border border-[#1E1B18]/10 shadow-xs mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-[#8B5A2B]/10 text-[#8B5A2B]">
              <Shield className="w-5 h-5" />
            </span>
            <h1 className="font-serif text-2xl font-bold text-[#1E1B18]">
              Dashboard Manajemen Admin Lab
            </h1>
          </div>
          <p className="text-xs text-[#1E1B18]/60 mt-1">
            Kelola pesanan cetak foto, update resi kurir, kirim pesan WhatsApp pelanggan, dan atur katalog produk.
          </p>
        </div>

        {/* Live Admin WhatsApp Indicator & XAMPP DB Button */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsXamppModalOpen(true)}
            className="bg-[#8B5A2B] hover:bg-[#72481F] text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Panduan XAMPP & MySQL</span>
          </button>

          <div className="bg-[#FAF9F6] border border-[#1E1B18]/10 rounded-lg p-2 text-xs flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse" />
            <span>Penerima WA: <strong>+{shopSettings.adminWhatsApp}</strong></span>
          </div>
        </div>
      </div>

      {/* Metrics Row (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-lg border border-[#1E1B18]/10 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1E1B18]/50 block">
            Total Omset Diterima
          </span>
          <span className="font-serif text-2xl font-bold text-[#1E1B18] mt-1 block font-mono tabular-nums">
            {formatRupiah(totalOmset)}
          </span>
          <span className="text-[10px] text-emerald-700 mt-1 block">Dari pesanan terverifikasi</span>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#1E1B18]/10 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1E1B18]/50 block">
            Total Pesanan Masuk
          </span>
          <span className="font-serif text-2xl font-bold text-[#1E1B18] mt-1 block font-mono tabular-nums">
            {totalOrdersCount} Pesanan
          </span>
          <span className="text-[10px] text-[#1E1B18]/60 mt-1 block">Tersimpan di database</span>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#1E1B18]/10 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-800 block">
            Menunggu Pembayaran
          </span>
          <span className="font-serif text-2xl font-bold text-amber-700 mt-1 block font-mono tabular-nums">
            {pendingPaymentCount}
          </span>
          <span className="text-[10px] text-amber-800/70 mt-1 block">Perlu konfirmasi rekening</span>
        </div>

        <div className="bg-white p-5 rounded-lg border border-[#1E1B18]/10 shadow-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8B5A2B] block">
            Sedang Dalam Produksi
          </span>
          <span className="font-serif text-2xl font-bold text-[#8B5A2B] mt-1 block font-mono tabular-nums">
            {inProgressCount}
          </span>
          <span className="text-[10px] text-[#8B5A2B]/70 mt-1 block">Cetak & pasang frame</span>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex border-b border-[#1E1B18]/10 mb-6 gap-6">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'orders'
              ? 'border-b-2 border-[#1E1B18] text-[#1E1B18]'
              : 'text-[#1E1B18]/50 hover:text-[#1E1B18]'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Pesanan Masuk & Chat WhatsApp ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'products'
              ? 'border-b-2 border-[#1E1B18] text-[#1E1B18]'
              : 'text-[#1E1B18]/50 hover:text-[#1E1B18]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Manajemen Produk Cetak ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'settings'
              ? 'border-b-2 border-[#1E1B18] text-[#1E1B18]'
              : 'text-[#1E1B18]/50 hover:text-[#1E1B18]'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Pengaturan Toko & Bank</span>
        </button>
      </div>

      {/* TAB 1: ORDERS & CUSTOMER CHAT INTEGRATION */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          
          {/* Filters & Search Bar */}
          <div className="bg-white p-4 rounded-lg border border-[#1E1B18]/10 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="flex items-center gap-2 bg-[#FAF9F6] border border-[#1E1B18]/15 rounded-md px-3 py-1.5 flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#1E1B18]/40 shrink-0" />
              <input
                type="text"
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                placeholder="Cari ID Pesanan, Nama, atau No. WA..."
                className="w-full text-xs bg-transparent outline-none"
              />
            </div>

            {/* Status Filter Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#1E1B18]/60 whitespace-nowrap">Filter Status:</span>
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="text-xs bg-[#FAF9F6] border border-[#1E1B18]/15 rounded px-2.5 py-1.5 outline-none font-medium"
              >
                <option value="all">Semua Status ({orders.length})</option>
                {ALL_ORDER_STATUSES.map((st) => (
                  <option key={st} value={st}>
                    {st} ({orders.filter((o) => o.status === st).length})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Orders Table / Cards List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-xl border border-[#1E1B18]/10">
                <p className="text-xs text-[#1E1B18]/50">Tidak ada pesanan yang sesuai dengan filter.</p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-[#1E1B18]/10 shadow-xs overflow-hidden"
                >
                  {/* Top Bar Order */}
                  <div className="p-4 bg-[#FAF9F6] border-b border-[#1E1B18]/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-serif font-bold text-sm text-[#1E1B18] font-mono">
                        #{order.id}
                      </span>
                      <span className="text-[#1E1B18]/50">·</span>
                      <span className="font-semibold text-[#1E1B18]">{order.customerName}</span>
                      <span className="text-[#1E1B18]/50">({order.customerPhoneWhatsApp})</span>
                    </div>

                    {/* Status Changer Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#1E1B18]/60">Status:</span>
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="text-xs bg-white border border-[#1E1B18]/20 font-bold rounded px-2 py-1 outline-none cursor-pointer"
                      >
                        {ALL_ORDER_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                    
                    {/* Item Thumbnails & Details (6 cols) */}
                    <div className="md:col-span-6 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-[#1E1B18]/40 tracking-wider block">
                        Detail Item ({order.items.length} Macam)
                      </span>
                      {order.items.map((it) => (
                        <div key={it.id} className="flex gap-2.5 items-center bg-[#FAF9F6] p-2 rounded border border-[#1E1B18]/5">
                          <img src={it.userPhotoUrl} alt="" className="w-10 h-10 object-cover rounded border" />
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-[#1E1B18] truncate">{it.productName}</p>
                            <p className="text-[11px] text-[#8B5A2B] font-mono">
                              {it.size.name} · {it.quantity}x ({it.paper})
                            </p>
                          </div>
                          <span className="font-mono font-bold">{formatRupiah(it.totalPrice)}</span>
                        </div>
                      ))}

                      {order.fileMethod === 'google_drive' && order.fileLink && (
                        <div className="pt-1">
                          <a
                            href={order.fileLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline font-semibold"
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span>Buka Folder Google Drive Master Foto</span>
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Shipping & Quick Tracking Resi (3 cols) */}
                    <div className="md:col-span-3 space-y-2 border-t md:border-t-0 md:border-l border-[#1E1B18]/10 md:pl-4">
                      <span className="text-[10px] uppercase font-bold text-[#1E1B18]/40 tracking-wider block">
                        Pengiriman & Ekspedisi
                      </span>
                      <p className="font-medium text-[#1E1B18]">{order.courier}</p>
                      <p className="text-[#1E1B18]/60 text-[11px]">
                        {order.shippingAddress.street}, {order.shippingAddress.city}
                      </p>

                      {/* Quick Resi Input */}
                      <div className="pt-2">
                        <label className="text-[10px] text-[#1E1B18]/50 block mb-1">Nomor Resi Kurir:</label>
                        <div className="flex gap-1">
                          <input
                            type="text"
                            defaultValue={order.trackingNumber || ''}
                            placeholder="Input no resi..."
                            onBlur={(e) => {
                              if (e.target.value !== order.trackingNumber) {
                                updateOrderStatus(order.id, order.status, e.target.value.trim());
                              }
                            }}
                            className="w-full text-xs px-2 py-1 bg-white border border-[#1E1B18]/20 rounded font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Actions & Chat WhatsApp (3 cols) */}
                    <div className="md:col-span-3 space-y-3 border-t md:border-t-0 md:border-l border-[#1E1B18]/10 md:pl-4 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#1E1B18]/40 tracking-wider block">
                          Total Tagihan
                        </span>
                        <span className="font-serif text-lg font-bold text-[#8B5A2B] font-mono tabular-nums">
                          {formatRupiah(order.totalAmount)}
                        </span>
                        <span className="text-[10px] text-[#1E1B18]/50 block">
                          Ongkir: {order.shippingCost === 0 ? 'Gratis' : formatRupiah(order.shippingCost)}
                        </span>
                      </div>

                      {/* THE DIRECT WHATSAPP INTEGRATION BUTTON */}
                      <button
                        onClick={() => openCustomerChatModal(order)}
                        className="w-full py-2.5 px-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold rounded flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Chat WhatsApp Pelanggan</span>
                      </button>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS MANAGEMENT */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#1E1B18]">Katalog Produk Cetak</h2>
              <p className="text-xs text-[#1E1B18]/60">Tambah atau sesuaikan harga dasar dan status stok produk lab.</p>
            </div>
            <button
              onClick={handleOpenAddProduct}
              className="py-2.5 px-4 bg-[#1E1B18] text-[#FAF9F6] text-xs font-semibold rounded-md hover:bg-[#2C2723] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Produk Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="bg-white rounded-lg border border-[#1E1B18]/10 p-5 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-[#1E1B18]/50 uppercase tracking-wider font-semibold">
                    <span>{p.category}</span>
                    <button
                      onClick={() => updateProduct(p.id, { inStock: !p.inStock })}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                        p.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {p.inStock ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </div>

                  <h3 className="font-serif text-base font-bold text-[#1E1B18] mt-1">{p.name}</h3>
                  <p className="text-xs text-[#1E1B18]/70 mt-1 line-clamp-2">{p.description}</p>
                  
                  <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-[#1E1B18]/5">
                    <span className="text-[#1E1B18]/60">Estimasi Jadi:</span>
                    <span className="font-medium text-[#1E1B18]">{p.estimatedProductionDays}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1E1B18]/10 flex items-center justify-between">
                  <span className="font-mono font-bold text-sm text-[#1E1B18]">
                    {formatRupiah(p.basePrice)}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditProduct(p)}
                      className="p-1.5 hover:bg-[#FAF9F6] border border-[#1E1B18]/20 rounded text-[#1E1B18] hover:text-[#8B5A2B]"
                      title="Edit Produk"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Yakin ingin menghapus produk "${p.name}"?`)) {
                          deleteProduct(p.id);
                        }
                      }}
                      className="p-1.5 hover:bg-rose-50 border border-rose-200 rounded text-rose-600"
                      title="Hapus Produk"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: STORE SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveShopSettings} className="bg-white p-6 sm:p-8 rounded-xl border border-[#1E1B18]/10 shadow-xs space-y-6 max-w-3xl">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#1E1B18]">Pengaturan Toko & Informasi Rekening</h2>
            <p className="text-xs text-[#1E1B18]/60 mt-1">
              Atur nomor WhatsApp admin yang menerima pesanan, detail rekening bank/QRIS, serta tarif ongkir.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-[#1E1B18] block mb-1">Nomor WhatsApp Admin Penerima Pesanan *</label>
              <input
                type="text"
                value={settingsAdminWa}
                onChange={(e) => setSettingsAdminWa(e.target.value)}
                placeholder="6281288997700"
                className="w-full px-3 py-2 bg-white border border-[#1E1B18]/20 rounded font-mono outline-none"
                required
              />
              <span className="text-[10px] text-[#1E1B18]/50 block mt-0.5">Gunakan format 62 tanpa tanda + atau spasi.</span>
            </div>

            <div>
              <label className="font-semibold text-[#1E1B18] block mb-1">Nama Toko Lab</label>
              <input
                type="text"
                value={settingsShopName}
                onChange={(e) => setSettingsShopName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#1E1B18]/20 rounded outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-[#1E1B18] block mb-1">Info Rekening Pembayaran Resmi Toko *</label>
              <textarea
                value={settingsBankInfo}
                onChange={(e) => setSettingsBankInfo(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-white border border-[#1E1B18]/20 rounded font-mono outline-none resize-none"
              />
              <span className="text-[10px] text-[#1E1B18]/50 block mt-0.5">Rincian ini akan otomatis disisipkan di template pesan WhatsApp tagihan.</span>
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-[#1E1B18] block mb-1">Alamat Fisik Studio Menteng</label>
              <input
                type="text"
                value={settingsStudioAddr}
                onChange={(e) => setSettingsStudioAddr(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#1E1B18]/20 rounded outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-[#1E1B18] block mb-1">Tarif Ongkir Standar Flat (Rp)</label>
              <input
                type="number"
                value={settingsFlatShipping}
                onChange={(e) => setSettingsFlatShipping(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-[#1E1B18]/20 rounded font-mono outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-[#1E1B18] block mb-1">Minimal Belanja Gratis Ongkir (Rp)</label>
              <input
                type="number"
                value={settingsFreeThreshold}
                onChange={(e) => setSettingsFreeThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-[#1E1B18]/20 rounded font-mono outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-[#1E1B18] block mb-1">Jam Operasional Studio</label>
              <input
                type="text"
                value={settingsHours}
                onChange={(e) => setSettingsHours(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#1E1B18]/20 rounded outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#1E1B18]/10 flex justify-end">
            <button
              type="submit"
              className="py-2.5 px-6 bg-[#1E1B18] text-[#FAF9F6] text-xs font-semibold rounded-md hover:bg-[#2C2723] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Pengaturan Toko</span>
            </button>
          </div>
        </form>
      )}

      {/* MODAL 1: WHATSAPP DIRECT CHAT WITH TEMPLATES */}
      {activeChatOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="relative w-full max-w-2xl bg-[#FAF9F6] rounded-xl shadow-2xl border border-[#1E1B18]/15 overflow-hidden my-6">
            
            {/* Header */}
            <div className="p-4 sm:p-5 bg-white border-b border-[#1E1B18]/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1E1B18]">
                    Chat WhatsApp Pelanggan: {activeChatOrder.customerName}
                  </h3>
                  <span className="text-[11px] text-[#1E1B18]/60 font-mono">
                    Nomor Tujuan: +{activeChatOrder.customerPhoneWhatsApp} · Order #{activeChatOrder.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveChatOrder(null)}
                className="p-1 rounded text-[#1E1B18]/50 hover:text-[#1E1B18]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 sm:p-6 space-y-4">
              
              {/* Template Selectors */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#1E1B18] block mb-2">
                  Pilih Template Pesan Siap Pakai:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {getChatTemplates(activeChatOrder).map((tpl, idx) => (
                    <button
                      key={tpl.title}
                      onClick={() => updateTemplateText(activeChatOrder, idx)}
                      className={`p-2.5 rounded border text-left text-xs transition-all cursor-pointer ${
                        selectedTemplateIndex === idx
                          ? 'border-[#25D366] bg-[#25D366]/10 font-bold text-emerald-900 ring-1 ring-[#25D366]'
                          : 'border-[#1E1B18]/15 bg-white hover:bg-[#FAF9F6]'
                      }`}
                    >
                      {tpl.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Editable Text Area */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-[#1E1B18]">
                    Isi Pesan (Bisa diedit sebelum dikirim):
                  </label>
                  <span className="text-[10px] text-[#1E1B18]/50">Format Markdown Didukung</span>
                </div>
                <textarea
                  value={customChatMessage}
                  onChange={(e) => setCustomChatMessage(e.target.value)}
                  rows={8}
                  className="w-full text-xs p-3.5 bg-white border border-[#1E1B18]/20 rounded-md font-sans leading-relaxed focus:border-[#25D366] outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setActiveChatOrder(null)}
                  className="py-2.5 px-4 bg-white border border-[#1E1B18]/20 text-[#1E1B18] text-xs font-semibold rounded hover:bg-[#1E1B18]/5"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleSendWaToCustomer}
                  className="flex-1 py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim via WhatsApp ke +{activeChatOrder.customerPhoneWhatsApp}</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT PRODUCT */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="relative w-full max-w-lg bg-[#FAF9F6] rounded-xl shadow-2xl border border-[#1E1B18]/15 overflow-hidden my-6">
            
            <div className="p-4 sm:p-5 bg-white border-b border-[#1E1B18]/10 flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-[#1E1B18]">
                {editingProductId ? 'Edit Produk Cetak' : 'Tambah Produk Cetak Baru'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded text-[#1E1B18]/50 hover:text-[#1E1B18]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-5 sm:p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-[#1E1B18] block mb-1">Nama Produk *</label>
                <input
                  type="text"
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="Misal: Cetak Frame Kayu Jati Minimalis"
                  className="w-full px-3 py-2 bg-white border border-[#1E1B18]/20 rounded outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#1E1B18] block mb-1">Kategori</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value as ProductCategory)}
                    className="w-full px-2.5 py-2 bg-white border border-[#1E1B18]/20 rounded outline-none font-medium"
                  >
                    <option value="framed">Framed Kayu Galeri</option>
                    <option value="canvas">Kanvas Spanram 3cm</option>
                    <option value="standard">Cetak Foto Standar</option>
                    <option value="polaroid">Set Polaroid Retro</option>
                    <option value="photobook">Layflat Photobook</option>
                    <option value="photostrip">Photo Strip Magnet</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#1E1B18] block mb-1">Harga Dasar (Rp)</label>
                  <input
                    type="number"
                    value={prodBasePrice}
                    onChange={(e) => setProdBasePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-[#1E1B18]/20 rounded font-mono outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#1E1B18] block mb-1">Tagline Ringkas</label>
                <input
                  type="text"
                  value={prodTagline}
                  onChange={(e) => setProdTagline(e.target.value)}
                  placeholder="Bingkai Kayu Jati Solid Natural & Matboard Museum"
                  className="w-full px-3 py-2 bg-white border border-[#1E1B18]/20 rounded outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-[#1E1B18] block mb-1">Deskripsi Produk</label>
                <textarea
                  value={prodDescription}
                  onChange={(e) => setProdDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-white border border-[#1E1B18]/20 rounded outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#1E1B18] block mb-1">Estimasi Waktu Pengerjaan</label>
                  <input
                    type="text"
                    value={prodEstDays}
                    onChange={(e) => setProdEstDays(e.target.value)}
                    placeholder="2 - 3 Hari Kerja"
                    className="w-full px-3 py-2 bg-white border border-[#1E1B18]/20 rounded outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#1E1B18] block mb-1">Status Stok</label>
                  <select
                    value={prodInStock ? 'true' : 'false'}
                    onChange={(e) => setProdInStock(e.target.value === 'true')}
                    className="w-full px-2.5 py-2 bg-white border border-[#1E1B18]/20 rounded outline-none font-medium"
                  >
                    <option value="true">In Stock (Tersedia)</option>
                    <option value="false">Out of Stock (Habis)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1E1B18]/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="py-2 px-4 bg-white border border-[#1E1B18]/20 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="py-2 px-5 bg-[#1E1B18] text-[#FAF9F6] font-semibold rounded hover:bg-[#2C2723]"
                >
                  Simpan Produk
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
