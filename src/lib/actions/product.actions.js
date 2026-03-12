'use server'

import { revalidatePath } from "next/cache";

import prisma from "../db";
import { convertToPlainObject } from "@/lib/utils";


// sare product dikhany k liye 

export async function getAllProducts() {
  const data = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  return convertToPlainObject(data);
}
//sari categories k liye 
export async function getAllCategories() {
  const data = await prisma.product.findMany({
    select: {
      category: true,
    },
    distinct: ['category'],
    orderBy: {
      category: 'asc',
    },
  });
  return data.map((item) => ({
    id: item.category,
    name: item.category,
    slug: item.category.toLowerCase().replace(/ /g, '-'),
  }));
}


// slug products k liye 
export async function getProductBySlug(slug) {
  const data = await prisma.product.findUnique({ where: { slug } });
  return convertToPlainObject(data);
}

// related product k liye 
export async function getRelatedProducts({ categoryId, productId, limit = 4 }) {
  const data = await prisma.product.findMany({
    where: { category: categoryId, id: { not: productId } },
    take: limit
  });
  return convertToPlainObject(data);
}



// naya product create k liye 
export async function createProduct(formData) {
  try {
    const baseSlug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-5)}`;

    const newProduct = await prisma.product.create({
      data: {
        name: formData.name,
        slug: uniqueSlug,
        description: formData.description,
        price: formData.price,
        originalPrice: formData.originalPrice || null,
        category: formData.category,
        brand: formData.brand,
        stock: parseInt(formData.stock),
        images: formData.images,
        isFeatured: formData.isFeatured || false,
        colors: [],
        sizes: [],
        features: []
      }
    });
    revalidatePath("/admin/products");
    revalidatePath("/product");

    return convertToPlainObject(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    throw new Error("Failed to create product");
  }
}


//  Delete Product Function
export async function deleteProduct(id) {
  try {
    const orderItemsCount = await prisma.orderItem.count({
      where: { productId: id }
    });

    if (orderItemsCount > 0) {
      throw new Error(`Cannot delete! This product is linked to ${orderItemsCount} past order(s). Please mark it out of stock instead.`);
    }

     await prisma.product.delete({
      where: { id: id }
    });

    revalidatePath("/admin/products");
    revalidatePath("/product");
    return true;
  } catch (error) {
    console.error("Delete Error:", error);
    throw new Error("Failed to delete product");
  }
}

//  Get Product By ID (Edit page ke liye zaroori)
export async function getProductById(id) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: id }
    });
    return convertToPlainObject(product);
  } catch (error) {
    console.error("Get Product Error:", error);
    return null;
  }
}

//  Update Product Function
export async function updateProduct(id, formData) {
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        originalPrice: formData.originalPrice,
        category: formData.category,
        brand: formData.brand,
        stock: formData.stock,
        images: formData.images,
      }
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}`);
    revalidatePath(`/product/${updatedProduct.slug}`);

    return convertToPlainObject(updatedProduct);
  } catch (error) {
    console.error("Update Error:", error);
    throw new Error("Failed to update product");
  }
}