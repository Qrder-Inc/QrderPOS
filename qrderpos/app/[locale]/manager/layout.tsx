import { getUserMembership } from "@/dal/user";
import { Sidebar } from "./sidebar"
import { Navbar } from "@/components/navbar"  
import { redirect } from "next/navigation";
import { AUTH_ROUTES } from "@/config/routes";
import { Role } from "@/types/role";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const role = await getUserMembership();

  if (role.role !== Role.OWNER) {
    redirect(AUTH_ROUTES.UNAUTHORIZED);
  }

  return (
    <>
    <Navbar/>
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
    </>
  )
}