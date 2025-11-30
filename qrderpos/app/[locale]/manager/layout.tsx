import { Sidebar } from "./sidebar"
import { Navbar } from "@/components/navbar"  

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
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