import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
    persist(
        (set, get) => ({
            items:[],

            appliedCoupon: null,
            discountPercentage: 0,

            applyCoupon: (code, percentage) => set({ 
                appliedCoupon: code, 
                discountPercentage: percentage 
            }),
            
            removeCoupon: () => set({ 
                appliedCoupon: null, 
                discountPercentage: 0 
            }),

            addItem: (product, quantity = 1, selectedColor = null, selectedSize = null, selectedImage = null) => {
                const items = get().items;
                const cartItemId = `${product.id}-${selectedColor || 'default'}-${selectedSize || 'default'}`;
                const existingItem = items.find((item) => item.cartItemId === cartItemId);
                if (existingItem) {
                    const updatedItems = items.map((item) =>
                        (item.cartItemId === cartItemId)
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                    set({ items: updatedItems });
                } else {
                    set({
                        items:[...items, {
                            ...product,
                            quantity: quantity,
                            cartItemId: cartItemId,
                            selectedColor: selectedColor,
                            selectedSize: selectedSize,
                            cartImage: selectedImage || product.image || (product.images?.[0]),
                        }]
                    });
                }
            },

            decreaseQuantity: (cartItemIdOrId) => {
                const items = get().items;
                const existingItem = items.find((item) =>
                    item.cartItemId === cartItemIdOrId || item.id === cartItemIdOrId
                );

                if (!existingItem) return;

                if (existingItem.quantity > 1) {
                    const updatedItems = items.map((item) =>
                        (item.cartItemId === cartItemIdOrId || item.id === cartItemIdOrId)
                            ? { ...item, quantity: item.quantity - 1 }
                            : item
                    );
                    set({ items: updatedItems });
                } else {
                    set({
                        items: items.filter((item) =>
                            item.cartItemId !== cartItemIdOrId && item.id !== cartItemIdOrId
                        )
                    });
                }
            },

            removeItem: (cartItemIdOrId) => {
                const items = get().items;
                set({
                    items: items.filter((item) =>
                        item.cartItemId !== cartItemIdOrId && item.id !== cartItemIdOrId
                    )
                });
            },

            clearCart: () => set({ items:[], appliedCoupon: null, discountPercentage: 0 }),
        }),
        {
            name: 'shopping-cart',
        }
    )
);