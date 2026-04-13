export const useHistoryStore = create(
  persist((set) => ({
    viewedItems: [],
    addToHistory: (product) => set((state) => {
      const filtered = state.viewedItems.filter((i) => i.id !== product.id);
      return { viewedItems: [product, ...filtered].slice(0, 10) }; 
    }),
  }), { name: 'history-storage' })
);