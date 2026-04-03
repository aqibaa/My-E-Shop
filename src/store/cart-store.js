// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// export const useCartStore = create(
//     persist(
//         (set, get) => ({
//             items: [],

//             // FIX 1: Arguments ka sequence exactly match karna chahiye
//             addItem: (product, quantity=1 , selectedColor = null, selectedSize = null, selectedImage = null) => {
//                 const items = get().items;
                
//                 // Fallback for old items without cartItemId
//                 const cartItemId = `${product.id}-${selectedColor || 'default'}-${selectedSize || 'default'}`;
                
//                 const existingItem = items.find((item) => item.cartItemId === cartItemId || item.id === product.id); // Also checks old format

//                 if (existingItem) {
//                     const updatedItems = items.map((item) =>
//                         (item.cartItemId === cartItemId || item.id === product.id)
//                             ? { ...item, quantity: item.quantity + quantity }
//                             : item
//                     );
//                     set({ items: updatedItems });
//                 } else {
//                     set({
//                         items: [...items, {
//                             ...product, 
//                             quantity: quantity,
//                             cartItemId: cartItemId,
//                             selectedColor: selectedColor,
//                             selectedSize: selectedSize,
//                             cartImage: selectedImage || product.image || (product.images?.[0]), // Fallback image
//                         }]
//                     });
//                 }
//             },

//             removeItem: (cartItemIdOrId) => {
//                 const items = get().items;
                
//                 // FIX 2: Safely find the item (Support both old ID and new CartItemID)
//                 const existingItem = items.find((item) => 
//                    item.cartItemId === cartItemIdOrId || item.id === cartItemIdOrId
//                 );

//                 // Agar item hai hi nahi store mein to bahar niklo
//                 if (!existingItem) return;

//                 if (existingItem.quantity > 1) {
//                     const updatedItems = items.map((item) =>
//                         (item.cartItemId === cartItemIdOrId || item.id === cartItemIdOrId) 
//                            ? { ...item, quantity: item.quantity - item.quantity } 
//                            : item
//                     );
//                     set({ items: updatedItems });
//                 } else {
//                     set({ items: items.filter((item) => 
//                        item.cartItemId !== cartItemIdOrId && item.id !== cartItemIdOrId
//                     )});
//                 }
//             },

//             updateQuantity: (cartItemIdOrId, newQuantity) => {
//                 const items = get().items;
//                 const updatedItems = items.map((item) =>
//                     (item.cartItemId === cartItemIdOrId || item.id === cartItemIdOrId) 
//                        ? { ...item, quantity: newQuantity } 
//                        : item
//                 );
//                 set({ items: updatedItems });
//             },

//             clearCart: () => set({ items: [] }),
//         }),
//         {
//             name: 'shopping-cart',
//         }
//     )
// );




import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],

            // 1. ADD ITEM OR INCREASE QUANTITY
            addItem: (product, quantity = 1, selectedColor = null, selectedSize = null, selectedImage = null) => {
                const items = get().items;
                const cartItemId = `${product.id}-${selectedColor || 'default'}-${selectedSize || 'default'}`;
                const existingItem = items.find((item) => item.cartItemId === cartItemId || item.id === product.id);

                if (existingItem) {
                    // Agar pehle se hai toh sirf quantity badhao
                    const updatedItems = items.map((item) =>
                        (item.cartItemId === cartItemId || item.id === product.id)
                            ? { ...item, quantity: item.quantity + quantity } 
                            : item
                    );
                    set({ items: updatedItems });
                } else {
                    // Naya item add karo
                    set({
                        items: [...items, {
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

            // 2. DECREASE QUANTITY (Minus Button ke liye)
            decreaseQuantity: (cartItemIdOrId) => {
                const items = get().items;
                const existingItem = items.find((item) => 
                   item.cartItemId === cartItemIdOrId || item.id === cartItemIdOrId
                );

                if (!existingItem) return;

                if (existingItem.quantity > 1) {
                    // Ek minus karo (THE FIX WAS HERE)
                    const updatedItems = items.map((item) =>
                        (item.cartItemId === cartItemIdOrId || item.id === cartItemIdOrId) 
                           ? { ...item, quantity: item.quantity - 1 } 
                           : item
                    );
                    set({ items: updatedItems });
                } else {
                    // Agar quantity 1 thi aur minus dabaya, toh item nikaal do
                    set({ items: items.filter((item) => 
                       item.cartItemId !== cartItemIdOrId && item.id !== cartItemIdOrId
                    )});
                }
            },

            // 3. FULLY REMOVE ITEM (Trash Button ke liye)
            removeItem: (cartItemIdOrId) => {
                const items = get().items;
                // Item ko array se filter (delete) kar do
                set({ items: items.filter((item) => 
                   item.cartItemId !== cartItemIdOrId && item.id !== cartItemIdOrId
                )});
            },

            // 4. CLEAR ENTIRE CART
            clearCart: () => set({ items: [] }),
        }),
        {
            name: 'shopping-cart',
        }
    )
);