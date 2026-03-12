import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const ADMIN_EMAILS = ["aaqib.codes@gmail.com", "aaqibaarif2025@gmail.com"]; 

export async function checkAdmin() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  const userEmail = user.emailAddresses[0].emailAddress;

  if (!ADMIN_EMAILS.includes(userEmail)) {
    redirect("/");
  }

  return true;
}