import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import AdminPageClient from "./AdminClient";

export default async function AdminPage() {
  const cookieStore = cookies();
  const tokenFromCookie = cookieStore.get("refreshToken")?.value;

  if (!tokenFromCookie) {
    redirect("/auth/login");
  }

  const decodedToken = jwt.decode(tokenFromCookie) as { role: string } | null;
  if (!decodedToken || !decodedToken.role) {
    redirect("/auth/login");
  }

  const allowedRoles = ["ADMIN", "SUPER_ADMIN", "MODERATOR"];
  if (!allowedRoles.includes(decodedToken.role)) {
    redirect("/");
  }

  return <AdminPageClient user={decodedToken} />;
}
