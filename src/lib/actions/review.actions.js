'use server'

import { auth } from "@clerk/nextjs/server";

import { revalidatePath } from "next/cache";
import prisma from "../db";

export async function createReview(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("You must be logged in to write a review.");

    const { productId, rating, comment, path } = data;

    const existingReview = await prisma.review.findFirst({
      where: { productId, userId }
    });

    if (existingReview) {
      throw new Error("You have already reviewed this product.");
    }

    await prisma.review.create({
      data: {
        rating: Number(rating),
        comment,
        productId,
        userId
      }
    });

    const allReviews = await prisma.review.findMany({
      where: { productId }
    });

    const newReviewCount = allReviews.length;
    const totalStars = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const newAverageRating = totalStars / newReviewCount;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: newAverageRating,
        reviewCount: newReviewCount
      }
    });

    revalidatePath(path);
    return { success: true };

  } catch (error) {
    console.error("Review Error:", error);
    throw new Error(error.message || "Failed to submit review.");
  }
}