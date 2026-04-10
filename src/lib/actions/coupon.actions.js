'use server'

import prisma from "../db";
export async function verifyCoupon(code) {
  try {
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() }
    });

    if (!coupon) {
      return { success: false, message: "Invalid coupon code!" };
    }
    
    if (!coupon.isActive) {
      return { success: false, message: "This coupon is no longer active." };
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return { success: false, message: "This coupon has expired." };
    }

    return { 
      success: true, 
      discount: coupon.discountPercentage, 
      code: coupon.code,
      message: `${coupon.discountPercentage}% discount applied!` 
    };

  } catch (error) {
    console.error("Coupon Verification Error:", error);
    return { success: false, message: "Something went wrong. Try again." };
  }
}