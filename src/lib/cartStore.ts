import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const current = get().items;
        const existing = current.find((i) => i.id === item.id);
        if (existing) {
          set({
            items: current.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...current, { ...item, quantity: 1 }] });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      updateQuantity: (id, delta) => {
        const current = get().items;
        const target = current.find(i => i.id === id);
        if (!target) return;
        
        const newQty = target.quantity + delta;
        if (newQty <= 0) {
           set({ items: current.filter(i => i.id !== id) });
        } else {
           set({ items: current.map(i => i.id === id ? { ...i, quantity: newQty } : i) });
        }
      },

      clearCart: () => set({ items: [] }),

      total: () => get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    }),
    { name: 'pixel-cart-storage' }
  )
);
