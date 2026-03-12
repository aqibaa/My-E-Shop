import { create } from 'zustand';
import { getAllCategories } from '@/lib/actions/product.actions'; // Server action (agar aapne banaya ho)

export const useCategoryStore = create((set, get) => ({
  categories: [], 
  activeCategory: 'All', 
  isLoading: false,
  error: null,

  setActiveCategory: (category) => set({ activeCategory: category }),

  fetchCategories: async () => {
    if (get().categories.length > 0) return;

    set({ isLoading: true });
    try {
      const data = await getAllCategories(); 
      
      set({ categories: data, isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },
}));