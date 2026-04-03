import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { getUserOrders } from "@/lib/actions/order.actions";
import AccountTabs from "@/components/shared/account-tabs";
import { redirect } from "next/navigation";

export const metadata = {
  title: "My Account"
}

export default async function AccountPage() {
  const { userId } = await auth();
  const clerkUser = await currentUser();
  if (!userId || !clerkUser) {
    redirect("/sign-in");
  }

  let dbUser = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!dbUser) {
    try {
      dbUser = await prisma.user.create({
        data: {
          id: userId,
          name: `${clerkUser.firstName} ${clerkUser.lastName || ""}`,
          email: clerkUser.emailAddresses[0].emailAddress,
          role: "CUSTOMER",
        }
      });
    } catch (error) {
      dbUser = await prisma.user.findUnique({ where: { id: userId } });
    }
  }

  let orders = [];
  try {
    orders = await getUserOrders();
  } catch (error) {
    console.error("Error fetching orders:", error);
    orders = [];
  }

  const safeOrders = orders.map(order => ({
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


  // const plainOrders = JSON.parse(JSON.stringify(orders));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <h1 className="mb-8 font-serif text-3xl font-bold text-foreground">
        My Account
      </h1>

      <AccountTabs orders={safeOrders} />
    </div>
  );
}