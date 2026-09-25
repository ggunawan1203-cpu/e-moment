import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Order,
  User,
  CartItem,
  ShopSettings,
  OrderStatus,
  UserAddress,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_USERS,
  INITIAL_SHOP_SETTINGS,
} from '../data/initialData';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  // Navigation & Modals
  currentView: 'store' | 'account' | 'tracker' | 'admin';
  setCurrentView: (view: 'store' | 'account' | 'tracker' | 'admin') => void;
  selectedProductForCustomizer: Product | null;
  openCustomizer: (product: Product) => void;
  closeCustomizer: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  authInitialTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  trackingOrderId: string;
  setTrackingOrderId: (id: string) => void;
  isXamppModalOpen: boolean;
  setIsXamppModalOpen: (open: boolean) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Orders
  orders: Order[];
  createOrder: (orderPayload: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string) => void;

  // Auth & Users
  currentUser: User | null;
  login: (emailOrPhone: string, password?: string) => boolean;
  registerUser: (userData: {
    name: string;
    email: string;
    phoneWhatsApp: string;
    address: UserAddress;
  }) => User;
  updateUserProfile: (updates: Partial<User>) => void;
  logout: () => void;

  // Settings
  shopSettings: ShopSettings;
  updateShopSettings: (settings: Partial<ShopSettings>) => void;

  // Toast
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Navigation State
  const [currentView, setCurrentView] = useState<'store' | 'account' | 'tracker' | 'admin'>('store');
  const [selectedProductForCustomizer, setSelectedProductForCustomizer] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'register'>('login');
  const [trackingOrderId, setTrackingOrderId] = useState<string>('');
  const [isXamppModalOpen, setIsXamppModalOpen] = useState(false);

  // 2. Data State with LocalStorage
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('emoment_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('emoment_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_ORDERS;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('emoment_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('emoment_currentUser');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    // Default to the demo customer for seamless demonstration
    return INITIAL_USERS[0];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('emoment_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  const [shopSettings, setShopSettings] = useState<ShopSettings>(() => {
    const saved = localStorage.getItem('emoment_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_SHOP_SETTINGS;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('emoment_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('emoment_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('emoment_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('emoment_currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('emoment_currentUser');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('emoment_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('emoment_settings', JSON.stringify(shopSettings));
  }, [shopSettings]);

  // Toast Helpers
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (ci) =>
          ci.productId === item.productId &&
          ci.size.id === item.size.id &&
          ci.paper === item.paper &&
          ci.frame === item.frame &&
          ci.lamination === item.lamination &&
          ci.userPhotoUrl === item.userPhotoUrl
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += item.quantity;
        next[existingIndex].totalPrice = next[existingIndex].quantity * next[existingIndex].unitPrice;
        return next;
      }
      return [...prev, item];
    });
    showToast(`"${item.productName}" ditambahkan ke keranjang`, 'success');
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
    showToast('Item dihapus dari keranjang', 'info');
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: newQty * item.unitPrice,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);

  // Products Operations
  const addProduct = (newProd: Omit<Product, 'id'>) => {
    const id = 'prod-' + Date.now().toString(36);
    const created: Product = { ...newProd, id };
    setProducts((prev) => [created, ...prev]);
    showToast(`Produk "${created.name}" berhasil ditambahkan!`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Produk berhasil diperbarui', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Produk telah dihapus', 'info');
  };

  // Orders Operations
  const createOrder = (
    orderPayload: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ): Order => {
    // Generate order ID: EMO-YYMMDD-XXXX
    const now = new Date();
    const yy = now.getFullYear().toString().slice(2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    const orderId = `EMO-${yy}${mm}${dd}-${randomSuffix}`;

    const newOrder: Order = {
      ...orderPayload,
      id: orderId,
      status: 'Menunggu Pembayaran',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status,
            trackingNumber: trackingNumber !== undefined ? trackingNumber : o.trackingNumber,
            updatedAt: new Date().toISOString(),
          };
        }
        return o;
      })
    );
    showToast(`Status pesanan ${orderId} diubah menjadi "${status}"`, 'success');
  };

  // Auth Operations
  const login = (emailOrPhone: string, _password?: string): boolean => {
    const cleanSearch = emailOrPhone.trim().toLowerCase();
    const cleanPhone = emailOrPhone.replace(/\D/g, '');

    const found = users.find(
      (u) =>
        u.email.toLowerCase() === cleanSearch ||
        u.phoneWhatsApp.replace(/\D/g, '') === cleanPhone
    );

    if (found) {
      setCurrentUser(found);
      showToast(`Selamat datang kembali, ${found.name}!`, 'success');
      return true;
    }

    // If user typed 'admin' or admin email
    if (cleanSearch === 'admin' || cleanSearch === 'admin@e-moment.web.id') {
      const adminUser = users.find((u) => u.role === 'admin') || INITIAL_USERS[1];
      setCurrentUser(adminUser);
      showToast('Masuk sebagai Admin Lab e-moment', 'success');
      return true;
    }

    // If not found in seed, create account on the fly for convenience
    const newDemoUser: User = {
      id: 'usr-' + Date.now().toString(36),
      name: emailOrPhone.split('@')[0] || 'Pelanggan e-moment',
      email: emailOrPhone.includes('@') ? emailOrPhone : `${cleanPhone}@emoment.user`,
      phoneWhatsApp: cleanPhone || '6281200000000',
      address: {
        street: 'Jl. Merdeka No. 10',
        subdistrict: 'Gambir',
        city: 'Jakarta Pusat',
        province: 'DKI Jakarta',
        postalCode: '10110',
      },
      role: 'customer',
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newDemoUser]);
    setCurrentUser(newDemoUser);
    showToast(`Akun berhasil dibuat. Selamat datang, ${newDemoUser.name}!`, 'success');
    return true;
  };

  const registerUser = (userData: {
    name: string;
    email: string;
    phoneWhatsApp: string;
    address: UserAddress;
  }): User => {
    // Format WhatsApp
    let cleanPhone = userData.phoneWhatsApp.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('62')) {
      cleanPhone = '62' + cleanPhone;
    }

    const newUser: User = {
      id: 'usr-' + Date.now().toString(36),
      name: userData.name,
      email: userData.email,
      phoneWhatsApp: cleanPhone,
      address: userData.address,
      role: 'customer',
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    showToast(`Pendaftaran berhasil! Selamat datang di e-moment, ${newUser.name}`, 'success');
    return newUser;
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated: User = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    showToast('Profil Anda berhasil diperbarui', 'success');
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Anda telah keluar dari akun', 'info');
  };

  // Shop Settings
  const updateShopSettings = (settings: Partial<ShopSettings>) => {
    setShopSettings((prev) => ({ ...prev, ...settings }));
    showToast('Pengaturan toko lab berhasil disimpan', 'success');
  };

  const openCustomizer = (product: Product) => {
    setSelectedProductForCustomizer(product);
  };

  const closeCustomizer = () => {
    setSelectedProductForCustomizer(null);
  };

  const openAuthModal = (tab: 'login' | 'register' = 'login') => {
    setAuthInitialTab(tab);
    setIsAuthOpen(true);
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProductForCustomizer,
        openCustomizer,
        closeCustomizer,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAuthOpen,
        setIsAuthOpen,
        authInitialTab,
        openAuthModal,
        trackingOrderId,
        setTrackingOrderId,
        isXamppModalOpen,
        setIsXamppModalOpen,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,

        products,
        addProduct,
        updateProduct,
        deleteProduct,

        orders,
        createOrder,
        updateOrderStatus,

        currentUser,
        login,
        registerUser,
        updateUserProfile,
        logout,

        shopSettings,
        updateShopSettings,

        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
