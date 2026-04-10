'use server'
import { revalidatePath } from "next/cache";
import { auth, currentUser } from '@clerk/nextjs/server'
import prisma from '../db';
import Stripe from 'stripe';


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
 if (userId) {
      const shippingInfo = orderData.shippingAddress;
      
      // Check karo kya is user ka ye exact address pehle se DB mein hai?
      const existingAddress = await prisma.address.findFirst({
        where: { 
          userId: userId, 
          address: shippingInfo.address, 
          city: shippingInfo.city 
        }
      });

      // Agar address naya hai, toh Address book mein save kar lo
      if (!existingAddress) {
        // Check karo ki koi purana address hai ya nahi (to make this default)
        const addressCount = await prisma.address.count({ where: { userId } });
        
        await prisma.address.create({
          data: {
            userId: userId,
            firstName: shippingInfo.firstName,
            lastName: shippingInfo.lastName,
            email: shippingInfo.email,
            phone: shippingInfo.phone,
            address: shippingInfo.address,
            city: shippingInfo.city,
            zip: shippingInfo.zip,
            country: shippingInfo.country || "USA",
            isDefault: addressCount === 0 // Agar pehla address hai, to default bana do
          }
        });
      }
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




export async function verifyStripePayment(sessionId, orderId) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {

      const order = await prisma.order.findUnique({ where: { id: orderId } });
      if (order.isPaid) return true;
      await prisma.order.update({
        where: { id: orderId },
        data: {
          isPaid: true,
          status: 'Processing',
          paidAt: new Date(),
          paymentResult: JSON.stringify({
            id: session.id,
            status: session.payment_status,
          })
        }
      });
      return true;
    }
    return false;

  } catch (error) {
    console.error("Stripe Verification Error:", error);
    return false;
  }
}