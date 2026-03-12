import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCheckoutStore = create(
  persist(
    (set) => ({
      currentStep: 1,
      shippingAddress: {
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        zip: '',
        phone: '',
      },
      paymentMethod: 'Credit Card', 

      setStep: (step) => set({ currentStep: step }),
      saveAddress: (address) => set((state) => ({
        shippingAddress: { ...state.shippingAddress, ...address }
      })),
      
      setPaymentMethod: (method) => set({ paymentMethod: method }),

      resetCheckout: () => set({
        currentStep: 1,
        shippingAddress: {
            firstName: '', lastName: '', email: '', address: '', city: '', zip: '', phone: ''
        },
        paymentMethod: 'Credit Card'
      }),
    }),
    {
      name: 'checkout-storage', 
      skipHydration: true,      
    }
  )
);