# 🛒 My E-Shop - Modern Full-Stack E-Commerce Platform

A production-ready, full-stack e-commerce application built with Next.js (App Router), featuring a seamless shopping experience, real-time advanced filtering, Stripe payments, and a powerful Admin Dashboard.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)

## ✨ Key Features

### 🛍️ Customer Experience
*   **Smart Search & Filtering:** Debounced global search, dynamic faceted filtering (Categories & Brands), and server-side pagination.
*   **Advanced Product Details:** Amazon-style image hover zoom, fullscreen lightbox gallery, and dynamic color/size variant selection.
*   **Persisted Cart & Wishlist:** Zustand-powered state management synced with LocalStorage and Database (for logged-in users).
*   **Seamless Checkout:** Frictionless multi-step checkout with auto-filled saved addresses.
*   **Promo Codes:** Real-time discount calculations at checkout.
*   **Real Payments:** Fully integrated Stripe Checkout with dynamic line items and discounts.
*   **Order Management:** Customer dashboard to view order history, track status, and manage profile/addresses.
*   **Authentic Reviews:** Customers can leave star ratings and comments, instantly updating the product's overall rating.

### 🛡️ Admin Dashboard
*   **Business Analytics:** Real-time revenue and order volume charts built with Recharts.
*   **Product Management:** Full CRUD operations with Cloudinary multi-image upload and complex variant (color/size) handling.
*   **Order Fulfillment:** Update order statuses (Pending -> Shipped -> Delivered) with instant UI updates.
*   **Customer Directory:** Track registered users and their total order counts.
*   **Store Settings:** Control global tax rates, flat shipping costs, and toggle **Maintenance Mode** to pause checkouts.

## 🛠️ Tech Stack

*   **Framework:** Next.js 15 (App Router, Server Actions)
*   **Styling:** Tailwind CSS, Shadcn UI, Framer Motion
*   **Database:** PostgreSQL (Neon DB) & Prisma ORM
*   **Authentication:** Clerk
*   **State Management:** Zustand, React Hook Form
*   **Payments:** Stripe & Stripe Webhooks
*   **Emails:** Resend & React-Email
*   **Media:** Cloudinary

## 🚀 Getting Started

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/aqibaa/My-E-Shop.git
cd my-eshop
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Setup Environment Variables
Create a \`.env\` file in the root and add the following:
\`\`\`env
DATABASE_URL="your_neon_postgres_url"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_pub_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloudinary_name"
CLOUDINARY_API_KEY="your_cloudinary_api"
CLOUDINARY_API_SECRET="your_cloudinary_secret"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your_stripe_pub_key"
STRIPE_SECRET_KEY="your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret"
RESEND_API_KEY="your_resend_api_key"
NEXT_PUBLIC_SERVER_URL="http://localhost:3000"
\`\`\`

### 4. Setup Database & Seed
\`\`\`bash
npx prisma generate
npx prisma db push
node prisma/seed.js
\`\`\`

### 5. Run the Application
\`\`\`bash
npm run dev
\`\`\`
Your app will be running at `http://localhost:3000`.

---
*Built with ❤️ as a demonstration of modern web architecture.*