'use server'

import { revalidatePath } from "next/cache";
import prisma from "../db";
import { convertToPlainObject } from "@/lib/utils";


export async function getAllProducts({ query = "", category = "", sort = "newest", limit = 12, page = 1 } = {}) {
  try {
    let whereCondition = {};

    if (category && category !== "All" && category !== "all") {
      whereCondition.category = {
        equals: category,
        mode: 'insensitive'
      };
    }

    if (query && query.trim() !== "") {
      whereCondition.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { brand: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
    }

    let orderByCondition = { createdAt: 'desc' }; // Default is newest

    if (sort === "lowest") {
      orderByCondition = { price: 'asc' };
    } else if (sort === "highest") {
      orderByCondition = { price: 'desc' };
    } else if (sort === "rating") {
      orderByCondition = { rating: 'desc' };
    }

    const skip = (Number(page) - 1) * limit;

    const data = await prisma.product.findMany({
      where: Object.keys(whereCondition).length > 0 ? whereCondition : undefined,
      orderBy: orderByCondition,
      skip: skip,
      take: limit
    });

    const totalCount = await prisma.product.count({
      where: Object.keys(whereCondition).length > 0 ? whereCondition : undefined,
    });

    const allCategories = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category'],
    });

    const allBrands = await prisma.product.findMany({
      select: { brand: true },
      distinct: ['brand'],
    });

    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: convertToPlainObject(data),
      totalPages: totalPages,
      currentPage: Number(page),
      availableCategories: allCategories.map(c => c.category).filter(Boolean),
      availableBrands: allBrands.map(b => b.brand).filter(Boolean)
    };
  } catch (error) {
    console.error("Database connection error in getAllProducts:", error);
    return { data: [], totalPages: 1, currentPage: 1 };
  }
}

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
        colors: formData.colors,
        sizes: formData.sizes,
        features: formData.features
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

export async function updateProduct(id, formData) {
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: {
        name: formData.name,
        description: formData.description,
        brand: formData.brand,
        category: formData.category,
        price: formData.price,
        originalPrice: formData.originalPrice ?? null,
        stock: formData.stock,

        // ✅ these were missing before
        features: formData.features,      // String[]
        sizes: formData.sizes,         // String[]
        image: formData.image,         // String
        images: formData.images,        // String[]
        colors: formData.colors,        // Json
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