'use server'

import { revalidatePath } from "next/cache";
import { auth, currentUser } from '@clerk/nextjs/server'
import prisma from '../db';

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
        paymentMethod: orderData.paymentMethod,
        itemsPrice: orderData.itemsPrice,
        shippingPrice: orderData.shippingPrice,
        taxPrice: orderData.taxPrice,
        totalPrice: orderData.totalPrice,

        orderItems: {
          create: orderData.items.map((item) => ({
            name: item.name,
            qty: item.quantity,
            image: (item.images && item.images[0]) ? item.images[0] : (item.image || "/placeholder.jpg"),
            price: item.price,
            product: { connect: { id: item.id } },
          })),
        },
      },
    });

    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
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
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      orderItems: true,
    },
  });
  return order;
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