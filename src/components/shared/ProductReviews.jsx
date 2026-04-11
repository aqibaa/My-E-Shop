"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Star, Loader2, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { createReview } from "@/lib/actions/review.actions"
import { usePathname } from "next/navigation"

export default function ProductReviews({ product }) {
    const { isSignedIn } = useUser()
    const pathname = usePathname()

    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showForm, setShowForm] = useState(false)

    const reviews = product.reviews || []

    const distribution = [5, 4, 3, 2, 1].map((star) => {
        const count = reviews.filter((r) => r.rating === star).length;
        const percentage = product.reviewCount > 0 ? Math.round((count / product.reviewCount) * 100) : 0;
        return { stars: star, percentage, count };
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return toast.error("Please write a comment.");

        setIsSubmitting(true);
        try {
            await createReview({
                productId: product.id,
                rating,
                comment,
                path: pathname
            });
            toast.success("Review submitted successfully!");
            setShowForm(false);
            setComment("");
            setRating(5);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="mt-16 border-t pt-10">
            <h2 className="mb-8 font-serif text-2xl font-bold text-foreground">Customer Reviews</h2>

            <div className="flex flex-col gap-10 lg:flex-row">

                <div className="lg:w-1/3 space-y-6">
                    <div className="flex flex-col items-center p-6 bg-gray-50 rounded-2xl border">
                        <span className="text-5xl font-bold text-foreground">{Number(product.rating).toFixed(1)}</span>
                        <div className="flex items-center gap-0.5 mt-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`size-5 ${i < Math.round(product.rating) ? "fill-yellow-500 text-yellow-500" : "fill-gray-200 text-gray-200"}`} />
                            ))}
                        </div>
                        <span className="text-sm text-muted-foreground mt-2">Based on {product.reviewCount} reviews</span>
                    </div>

                    <div className="flex flex-col gap-3">
                        {distribution.map(({ stars, percentage }) => (
                            <div key={stars} className="flex items-center gap-3">
                                <span className="w-12 text-sm text-muted-foreground">{stars} stars</span>
                                <Progress value={percentage} className="h-2 flex-1" />
                                <span className="w-10 text-right text-sm text-muted-foreground">{percentage}%</span>
                            </div>
                        ))}
                    </div>

                    {!showForm && (
                        <Button onClick={() => setShowForm(true)} className="w-full rounded-xl" variant="outline">
                            Write a Review
                        </Button>
                    )}
                </div>

                <div className="flex-1">
                    {showForm ? (
                        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border shadow-sm animate-in fade-in zoom-in-95 duration-300">
                            <h3 className="text-lg font-semibold mb-4">Share your thoughts</h3>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                                            <Star className={`size-8 transition-colors ${star <= rating ? "fill-yellow-500 text-yellow-500" : "fill-gray-200 text-gray-200 hover:text-yellow-300"}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                                <Textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="What did you like or dislike? What did you use this product for?"
                                    className="rounded-xl min-h-[120px]"
                                    required
                                />
                            </div>

                            <div className="flex gap-3">
                                <Button type="submit" disabled={!isSignedIn || isSubmitting} className="rounded-xl px-8">
                                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Submit Review
                                </Button>
                                <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="rounded-xl">Cancel</Button>
                            </div>
                            {!isSignedIn && <p className="text-xs text-red-500 mt-3">You must be signed in to submit a review.</p>}
                        </form>
                    ) : (
                        <div className="space-y-6">
                            {reviews.length > 0 ? (
                                reviews.map((review) => (
                                    <div key={review.id} className="border-b pb-6 last:border-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="size-8">
                                                    <AvatarImage src={review.user?.image} />
                                                    <AvatarFallback>{review.user?.name?.charAt(0) || "U"}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium text-sm">{review.user?.name || "Verified Customer"}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <div className="flex gap-0.5 mb-3">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} className={`size-3 ${i < review.rating ? "fill-yellow-500 text-yellow-500" : "fill-gray-200 text-gray-200"}`} />
                                            ))}
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50 rounded-2xl border border-dashed">
                                    <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
                                    <p className="text-gray-500 font-medium">No reviews yet</p>
                                    <p className="text-sm text-gray-400">Be the first to review this product!</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}