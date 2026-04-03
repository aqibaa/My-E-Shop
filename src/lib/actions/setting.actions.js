'use server'


import prisma from "../db";
import { revalidatePath } from "next/cache"

export async function getStoreSettings() {
  try {
    let settings = await prisma.storeSettings.findUnique({
      where: { id: "default" }
    });

    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {
          id: "default",
          storeName: "My E-Shop",
          supportEmail: "support@myeshop.com",
          taxRate: 8.00,
          shippingCost: 15.00,
          isMaintenance: false
        }
      });
    }
    return JSON.parse(JSON.stringify(settings));
  } catch (error) {
    console.error("Error fetching settings:", error);
    return null;
  }
}

export async function updateStoreSettings(formData) {
  try {
    const updatedSettings = await prisma.storeSettings.update({
      where: { id: "default" },
      data: {
        storeName: formData.storeName,
        supportEmail: formData.supportEmail,
        taxRate: Number(formData.taxRate),
        shippingCost: Number(formData.shippingCost),
        isMaintenance: formData.isMaintenance
      }
    });

    revalidatePath('/', 'layout'); 
    return JSON.parse(JSON.stringify(updatedSettings));
  } catch (error) {
    console.error("Error updating settings:", error);
    throw new Error("Failed to update settings");
  }
}