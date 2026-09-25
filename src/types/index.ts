export type OrderStatus =
  | 'Menunggu Pembayaran'
  | 'Pembayaran Diterima'
  | 'Sedang Dicetak'
  | 'Finishing & Bingkai'
  | 'Dikirim'
  | 'Siap Diambil'
  | 'Selesai'
  | 'Dibatalkan';

export type ProductCategory =
  | 'all'
  | 'framed'
  | 'canvas'
  | 'standard'
  | 'polaroid'
  | 'photobook'
  | 'photostrip';

export type PaperType =
  | 'Silky Luster Satin 260gsm'
  | 'Glossy High-Definition 260gsm'
  | 'Fine Art Cotton Rag Matte 310gsm';

export type FrameColor =
  | 'none'
  | 'jati'
  | 'hitam'
  | 'putih';

export type LaminationType =
  | 'Tanpa Laminasi'
  | 'Laminasi Doff Dingin Velvet'
  | 'Laminasi Glossy UV Crystal';

export interface SizeOption {
  id: string;
  name: string;
  dimensionCm: string;
  ratio: string;
  priceDelta: number;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  tagline: string;
  description: string;
  basePrice: number;
  estimatedProductionDays: string;
  inStock: boolean;
  coverMockupType: 'framed' | 'canvas' | 'polaroid' | 'photobook' | 'photostrip' | 'standard';
  coverAccent: string;
  sizes: SizeOption[];
  supportedPapers: PaperType[];
  supportedFrames: FrameColor[];
  supportedLaminations: LaminationType[];
  badgeText?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  category: ProductCategory;
  userPhotoUrl: string;
  size: SizeOption;
  paper: PaperType;
  frame: FrameColor;
  matboard: boolean;
  lamination: LaminationType;
  instructions: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface UserAddress {
  street: string;
  subdistrict: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phoneWhatsApp: string;
  address: UserAddress;
  role: 'customer' | 'admin';
  createdAt: string;
}

export type CourierOption =
  | 'JNE Reguler'
  | 'JNE YES'
  | 'SiCepat Reguler'
  | 'GoSend / Grab Instant'
  | 'Ambil Sendiri di Studio';

export type FileDeliveryMethod =
  | 'web_upload'
  | 'google_drive'
  | 'wa_document';

export interface Order {
  id: string; // e.g. EMO-260925-1082
  userId?: string;
  customerName: string;
  customerPhoneWhatsApp: string;
  customerEmail: string;
  shippingAddress: UserAddress;
  isGuest: boolean;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  courier: CourierOption;
  totalAmount: number;
  fileMethod: FileDeliveryMethod;
  fileLink?: string;
  customerNotes?: string;
  status: OrderStatus;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShopSettings {
  shopName: string;
  tagline: string;
  adminWhatsApp: string; // e.g. "6281234567890" without +
  studioAddress: string;
  bankInfo: string;
  qrisInstruction: string;
  flatShippingFee: number;
  freeShippingThreshold: number;
  operatingHours: string;
}
