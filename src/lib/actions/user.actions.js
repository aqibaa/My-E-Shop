'use server'

import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "../db";
import { revalidatePath } from "next/cache";



export async function isUserAdmin() {
  try {
    const { userId } = await auth();
    if (!userId) return false;

    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true } 
    });

    return dbUser?.role === "ADMIN";
  } catch (error) {
    console.error("Admin Check Error:", error);
    return false;
  }
}


export async function syncUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) return null;

    let dbUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: userId,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User',
          email: user.emailAddresses[0].emailAddress,
          role: "CUSTOMER",
          image: user.imageUrl || null
        }
      });
      console.log(`✅ Naya User DB mein add ho gaya: ${dbUser.email}`);
    }

    return dbUser;
  } catch (error) {
    console.error("❌ User Sync Error:", error);
    return null;
  }
}



export async function getUserAddresses() {
  try {
    const { userId } = await auth();
    if (!userId) return[];

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' } 
    });
    return JSON.parse(JSON.stringify(addresses));
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return[];
  }
}

export async function addAddress(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Not logged in");

    const count = await prisma.address.count({ where: { userId } });
    const isDefault = count === 0 || data.isDefault;

    if (isDefault && count > 0) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }

    await prisma.address.create({
      data: {
        userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        address: data.address,
        city: data.city,
        zip: data.zip,
        phone: data.phone,
        country: data.country ,
        isDefault
      }
    });

    revalidatePath("/account");
    return { success: true };
  } catch (error) {
    console.error("Error adding address:", error);
    throw new Error("Failed to add address");
  }
}

export async function deleteAddress(addressId) {
  try {
    const { userId } = await auth();
    await prisma.address.delete({
      where: { id: addressId, userId } 
    });
    revalidatePath("/account");
    return { success: true };
  } catch (error) {
    throw new Error("Failed to delete address");
  }
}


export async function toggleWishlistAction(productId) {
  try {
    const { userId } = await auth();
    if (!userId) return { success: false, message: "Not logged in" };

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { wishlist: { select: { id: true } } }
    });

    if (!user) return { success: false };

    const isWishlisted = user.wishlist.some(p => p.id === productId);

    if (isWishlisted) {
      await prisma.user.update({
        where: { id: userId },
        data: { wishlist: { disconnect: { id: productId } } }
      });
    } else {
      await prisma.user.update({
        where: { id: userId },
        data: { wishlist: { connect: { id: productId } } }
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Wishlist Toggle Error:", error);
    return { success: false };
  }
}

export async function getUserWishlist() {
  try {
    const { userId } = await auth();
    if (!userId) return[];

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { wishlist: true } 
    });

    return JSON.parse(JSON.stringify(user?.wishlist ||[]));
  } catch (error) {
    console.error("Fetch Wishlist Error:", error);
    return[];
  }
}