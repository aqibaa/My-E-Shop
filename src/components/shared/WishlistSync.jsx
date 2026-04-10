"use client"

import { useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { getUserWishlist } from "@/lib/actions/user.actions"
import { useWishlistStore } from "@/store/wishlist-store"

export default function WishlistSync() {
  const { isSignedIn, isLoaded } = useUser()
  const setWishlist = useWishlistStore((state) => state.setWishlist)

  useEffect(() => {
    async function syncDBtoLocal() {
      if (isLoaded && isSignedIn) {
        const dbWishlist = await getUserWishlist();
        if (dbWishlist && dbWishlist.length > 0) {
           setWishlist(dbWishlist); 
        }
      }
    }
    
    syncDBtoLocal();
  },[isLoaded, isSignedIn, setWishlist])

  return null;
}