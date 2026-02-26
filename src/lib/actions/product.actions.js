'use server'

import prisma from "../db";
import { convertToPlainObject } from "@/lib/utils"; // Import

export async function getAllProducts() {
  const data = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  return convertToPlainObject(data); // Convert before returning
}

export async function getProductBySlug(slug) {
  const data = await prisma.product.findUnique({ where: { slug } });
  return convertToPlainObject(data); // Convert
}

export async function getRelatedProducts({ categoryId, productId, limit = 4 }) {
  const data = await prisma.product.findMany({
    where: { category: categoryId, id: { not: productId } },
    take: limit
  });
  return convertToPlainObject(data); // Convert
}