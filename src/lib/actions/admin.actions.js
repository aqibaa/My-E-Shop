'use server'

import prisma from "../db";
import { convertToPlainObject } from "../utils";
export async function getDashboardData() {
  try {
    const totalCustomers = await prisma.user.count({
      where: { role: 'CUSTOMER' }
    });

    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalPrice), 0);

    const recentOrders = orders.slice(0, 10).map((order) => {
      const address = JSON.parse(order.shippingAddress || '{}');
      return {
        id: order.id,
        customer: `${address.firstName || 'Guest'} ${address.lastName || ''}`,
        email: address.email || 'N/A',
        total: Number(order.totalPrice),
        status: order.isDelivered ? "Delivered" : order.isPaid ? "Processing" : "Pending",
        date: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
    });

    const productsData = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const products = productsData.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.id.slice(-6).toUpperCase(), 
      price: Number(p.price),
      stock: p.stock,
      status: p.stock > 0 ? "Active" : "Out of Stock"
    }));

    return convertToPlainObject({
      stats: {
        totalRevenue,
        totalOrders,
        totalCustomers,
      },
      recentOrders,
      products
    });

  } catch (error) {
    console.error("Admin Data Error:", error);
    throw new Error("Failed to fetch admin data");
  }
}



export async function getAllCustomers() {
  try {
    const customers = await prisma.user.findMany({
      where: { role: 'CUSTOMER' }, 
      orderBy: { createdAt: 'desc' }, 
      include: {
        _count: {
          select: { orders: true } 
        }
      }
    });

    return customers.map(user => ({
      id: user.id,
      name: user.name || "Guest User",
      email: user.email,
      joinedAt: user.createdAt.toISOString(),
      totalOrders: user._count.orders 
    }));
  } catch (error) {
    console.error("Fetch Customers Error:", error);
    return [];
  }
}



export async function getAnalyticsData() {
  try {
    const orders = await prisma.order.findMany({
      where: { 
        status: { not: "Cancelled" } 
      },
      select: {
        totalPrice: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'asc' 
      }
    });

    const monthlyData = {};

    orders.forEach(order => {
     
      const month = new Date(order.createdAt).toLocaleString('default', { month: 'short' });
      
      if (!monthlyData[month]) {
        monthlyData[month] = { name: month, revenue: 0, orders: 0 };
      }
      
      monthlyData[month].revenue += Number(order.totalPrice);
      monthlyData[month].orders += 1;
    });

    const graphData = Object.values(monthlyData);

    return graphData;

  } catch (error) {
    console.error("Analytics Error:", error);
    return [];
  }
}