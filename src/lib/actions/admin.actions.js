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


export async function getAdminProducts({ page = 1, limit = 10, search = "" }) {
  try {
    const skip = (Number(page) - 1) * limit;
    
    let whereCondition = {};
    if (search) {
      whereCondition = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { id: { contains: search, mode: 'insensitive' } },
        ]
      };
    }

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereCondition,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.product.count({ where: whereCondition })
    ]);

    const formattedProducts = products.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.id.slice(-6).toUpperCase(),
      price: Number(p.price),
      stock: p.stock,
      category: p.category,
      images: p.images,
      slug: p.slug,
      status: p.stock > 0 ? "Active" : "Out of Stock"
    }));

    return {
      data: convertToPlainObject(formattedProducts),
      totalPages: Math.ceil(totalCount / limit),
      currentPage: Number(page),
      totalCount
    };
  } catch (error) {
    console.error("Admin Products Error:", error);
    return { data: [], totalPages: 1, currentPage: 1, totalCount: 0 };
  }
}

export async function getAdminOrdersPaginated({ page = 1, limit = 10, search = "", status = "all" }) {
  try {
    const skip = (Number(page) - 1) * limit;
    
    let whereCondition = {};
    
    if (status !== "all") {
        if (status === "active") whereCondition.status = { not: "Delivered" };
        else whereCondition.status = status;
    }

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where: whereCondition,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where: whereCondition })
    ]);

    const formattedOrders = orders.map(order => {
      const address = JSON.parse(order.shippingAddress || '{}');
      return {
        ...order,
        itemsPrice: Number(order.itemsPrice),
        shippingPrice: Number(order.shippingPrice),
        taxPrice: Number(order.taxPrice),
        totalPrice: Number(order.totalPrice),
        customerName: `${address.firstName || 'Guest'} ${address.lastName || ''}`,
        email: address.email || 'No email',
        createdAt: order.createdAt.toISOString(),
      };
    });

    return {
      data: convertToPlainObject(formattedOrders),
      totalPages: Math.ceil(totalCount / limit),
      currentPage: Number(page),
      totalCount
    };
  } catch (error) {
    console.error("Admin Orders Error:", error);
    return { data: [], totalPages: 1, currentPage: 1, totalCount: 0 };
  }
}

// 4. Paginated Customers for Admin
export async function getAdminCustomersPaginated({ page = 1, limit = 10, search = "" }) {
  try {
    const skip = (Number(page) - 1) * limit;
    
    let whereCondition = { role: 'CUSTOMER' };
    if (search) {
      whereCondition.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [customers, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: whereCondition,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: { _count: { select: { orders: true } } }
      }),
      prisma.user.count({ where: whereCondition })
    ]);

    const formattedCustomers = customers.map(user => ({
      id: user.id,
      name: user.name || "Guest User",
      email: user.email,
      joinedAt: user.createdAt.toISOString(),
      totalOrders: user._count.orders
    }));

    return {
      data: convertToPlainObject(formattedCustomers),
      totalPages: Math.ceil(totalCount / limit),
      currentPage: Number(page),
      totalCount
    };
  } catch (error) {
    console.error("Admin Customers Error:", error);
    return { data: [], totalPages: 1, currentPage: 1, totalCount: 0 };
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