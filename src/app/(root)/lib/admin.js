

// import { auth } from "@clerk/nextjs/server";
// import  prisma  from "@/lib/db";
// import { redirect } from "next/navigation";

// export async function checkAdmin() {
//   const { userId } = await auth();

//   if (!userId) {
//     redirect("/sign-in");
//   }

//   // Database mein check karo ki kya ye ADMIN hai
//   const dbUser = await prisma.user.findUnique({
//     where: { id: userId }
//   });

//   if (!dbUser || dbUser.role !== "ADMIN") {
//     redirect("/"); // Agar CUSTOMER hai, toh Home page pe bhej do
//   }

//   return true;
// }


import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";

const ADMIN_EMAILS = ["aaqib.codes@gmail.com", "aaqib.codes@gmail.com"]; 

export async function checkAdmin() {
  try{
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  const userEmail = user.emailAddresses[0].emailAddress.toLowerCase();

  if (!ADMIN_EMAILS.includes(userEmail)) {
    redirect("/"); 
  }

  let dbUser = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: userId,
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Admin User',
        email: userEmail,
        role: "ADMIN", 
        image: user.imageUrl || null
      }
    });
  } 
  else if (dbUser.role !== "ADMIN") {
    dbUser = await prisma.user.update({
      where: { id: userId },
      data: { role: "ADMIN" }
    });
  }

  return true;
} catch(error){

    if (error.message === "NEXT_REDIRECT") {
      throw error; 
    }
    console.error("Database connection failed in Check Admin:", error);
    return false; 
}
}