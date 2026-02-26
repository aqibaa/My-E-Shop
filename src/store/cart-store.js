import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product, quantity = 1) => {
                const items = get().items;
                const existingItem = items.find((item) => item.id === product.id);

                if (existingItem) {
                    const updatedItems = items.map((item) =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                    set({ items: updatedItems });
                } else {
                    set({ items: [...items, { ...product, quantity: quantity }] });
                }
            },

            removeItem: (id) => {
                const items = get().items;
                const existingItem = items.find((item) => item.id === id);

                if (existingItem.quantity > 1) {
                    const updatedItems = items.map((item) =>
                        item.id === id ? { ...item, quantity: item.quantity - 1 } : item
                    );
                    set({ items: updatedItems });
                } else {
                    set({ items: items.filter((item) => item.id !== id) });
                }
            },
            updateQuantity: (id, quantity) => {
                const items = get().items;
                const updatedItems = items.map((item) =>
                    item.id === id ? { ...item, quantity: quantity } : item
                );
                set({ items: updatedItems });
            },

            clearCart: () => set({ items: [] }),
        }),
        {
            name: 'shopping-cart',
        }
    )
);