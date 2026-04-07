export const useHistoryStore = create(
  persist((set) => ({
    viewedItems: [],
    addToHistory: (product) => set((state) => {
      const filtered = state.viewedItems.filter((i) => i.id !== product.id);
      return { viewedItems: [product, ...filtered].slice(0, 10) }; // Max 10 items
    }),
  }), { name: 'history-storage' })
);