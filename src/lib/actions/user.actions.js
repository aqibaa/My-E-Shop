'use server'

import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "../db";


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