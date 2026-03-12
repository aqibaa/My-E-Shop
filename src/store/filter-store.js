import { create } from 'zustand';

export const useFilterStore = create((set) => ({
  priceRange: [0, 3000],
  selectedBrands: [],
  selectedCategories: [],
  sortBy: 'featured',
  searchQuery: '', 


  setPriceRange: (range) => set({ priceRange: range }),
  
  toggleBrand: (brand) => set((state) => {
    const brands = state.selectedBrands.includes(brand)
      ? state.selectedBrands.filter((b) => b !== brand)
      : [...state.selectedBrands, brand];
    return { selectedBrands: brands };
  }),

  toggleCategory: (category) => set((state) => {
    const categories = state.selectedCategories.includes(category)
      ? state.selectedCategories.filter((c) => c !== category)
      : [...state.selectedCategories, category];
    return { selectedCategories: categories };
  }),

  setSortBy: (sort) => set({ sortBy: sort }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  resetFilters: () => set({
    priceRange: [0, 3000],
    selectedBrands: [],
    selectedCategories: [],
    sortBy: 'featured',
    searchQuery: ''
  }),
}));