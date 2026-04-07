'use server'
import { render } from '@react-email/render';
import { revalidatePath } from "next/cache";
import { auth, currentUser } from '@clerk/nextjs/server'
import prisma from '../db';
import Stripe from 'stripe';
import { Resend } from 'resend';
import OrderReceiptEmail from "@/app/(root)/emails/OrderReceipt";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createOrder(orderData) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) throw new Error('User not authenticated');

    const dbUser = await prisma.user.findUnique({
      where: { email: user.emailAddresses[0].emailAddress }
    });

    if (!dbUser) {
      await prisma.user.create({
        data: {
          id: userId,
          name: `${user.firstName} ${user.lastName || ''}`,
          email: user.emailAddresses[0].emailAddress,
          role: 'CUSTOMER',
        }
      });
    }

    const order = await prisma.order.create({
      data: {
        userId: userId,
        shippingAddress: JSON.stringify(orderData.shippingAddress),
        paymentMethod: 'Stripe',
        itemsPrice: orderData.itemsPrice,
        shippingPrice: orderData.shippingPrice,
        taxPrice: orderData.taxPrice,
        totalPrice: orderData.totalPrice,
        isPaid: false,
        status: "Pending",
        orderItems: {
          create: orderData.items.map((item) => ({
            name: item.name,
            qty: item.quantity,
            image: (item.cartImage) ? item.cartImage : (item.images && item.images[0] ? item.images[0] : "/placeholder.jpg"),
            price: item.price,
            color: item.selectedColor || null,
            size: item.selectedSize || null,
            product: { connect: { id: item.id } },
          })),
        },
      },
    });

    const lineItems = orderData.items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    if (orderData.shippingPrice > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Shipping' },
          unit_amount: Math.round(orderData.shippingPrice * 100),
        },
        quantity: 1,
      });
    }
    if (orderData.taxPrice > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Tax' },
          unit_amount: Math.round(orderData.taxPrice * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      metadata: { orderId: order.id },

      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/order/${order.id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/order/${order.id}?canceled=true`,
    });

    return { url: session.url, orderId: order.id };

  } catch (error) {
    console.error('Error creating order/stripe:', error);
    throw new Error('Failed to create order and checkout session');
  }
}


export async function getUserOrders() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const userExists = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!userExists) {
    return [];
  }

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      orderItems: true
    }
  });

  return orders;
}



export async function getOrderById(orderId) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: true,
      },
    });

    if (!order) return null;

    return {
      ...order,
      itemsPrice: Number(order.itemsPrice),
      shippingPrice: Number(order.shippingPrice),
      taxPrice: Number(order.taxPrice),
      totalPrice: Number(order.totalPrice),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      orderItems: order.orderItems.map(item => ({
        ...item,
        price: Number(item.price)
      }))
    };
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return null;
  }
}



export async function getAllAdminOrders() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        orderItems: true
      }
    });

    return orders.map(order => ({
      ...order,
      itemsPrice: Number(order.itemsPrice),
      shippingPrice: Number(order.shippingPrice),
      taxPrice: Number(order.taxPrice),
      totalPrice: Number(order.totalPrice),
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
      orderItems: order.orderItems.map(item => ({
        ...item,
        price: Number(item.price)
      }))
    }));
  } catch (error) {
    console.error("Fetch Admin Orders Error:", error);
    return [];
  }
}



export async function updateOrderStatus(orderId, newStatus) {
  try {
    const isDelivered = newStatus === "Delivered";
    const deliveredAt = isDelivered ? new Date() : null;

    const isPaid = newStatus !== "Pending" && newStatus !== "Cancelled";
    const paidAt = isPaid ? new Date() : null;

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: newStatus,
        isDelivered: isDelivered,
        deliveredAt: deliveredAt,
        isPaid: isPaid,
        paidAt: paidAt,
      }
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    revalidatePath("/account");

    return JSON.parse(JSON.stringify({
      success: true,
      status: updatedOrder.status
    }));

  } catch (error) {
    console.error("Action Error - updateOrderStatus:", error);
    throw new Error("Could not update status in DB");
  }
}



// Verify Stripe Payment
const resend = new Resend(process.env.RESEND_API_KEY);

export async function verifyStripePayment(sessionId, orderId) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: {
          isPaid: true,
          paidAt: new Date(),
          paymentResult: JSON.stringify({
            id: session.id,
            status: session.payment_status,
            email: session.customer_details?.email,
          })
        },
        include: { orderItems: true }
      });
      const customerEmail = JSON.parse(updatedOrder.shippingAddress || '{}').email;
      const emailHtml = await render(OrderReceiptEmail({ order: updatedOrder }));
      try {
        await resend.emails.send({
          from: 'My E-Shop <onboarding@resend.dev>',
          to: customerEmail,
          subject: `Order Confirmation #${updatedOrder.id.slice(-8).toUpperCase()}`,
          html: emailHtml,
        });
        console.log("Email sent successfully!");
      } catch (emailError) {
        console.error("Failed to send email:", emailError);
      }
      return true;
    }
    return false;
  } catch (error) {
    console.error("Stripe Verification Error:", error);
    return false;
  }
}