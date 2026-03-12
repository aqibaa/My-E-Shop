import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner'; 

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],

      toggleWishlist: (product) => {
        const { items } = get();
        const exists = items.find((item) => item.id === product.id);

        if (exists) {
          set({ items: items.filter((item) => item.id !== product.id) });
          toast.success("Removed from Wishlist");
        } else {
          set({ items: [...items, product] });
          toast.success("Added to Wishlist");
        }
      },

      isInWishlist: (id) => {
        return get().items.some((item) => item.id === id);
      },

      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage',
    }
  )
);