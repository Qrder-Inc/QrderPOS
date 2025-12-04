"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Home,
  ShoppingCart,
  Users,
  BookOpen,
  BarChart3,
  Settings,
} from "lucide-react"
import { DASHBOARD_ROUTES } from "@/config/routes"
import { useTranslations } from "next-intl"



export function Sidebar() {
  const t = useTranslations("dashboard")

  const navigation = [
  {
    name: t("sidebarHome"),
    href: DASHBOARD_ROUTES.DASHBOARD,
    icon: Home
  },
  {
    name: t("sidebarOrders"),
    href: DASHBOARD_ROUTES.ORDERS,
    icon: ShoppingCart
  },
  {
    name: t("sidebarMenu"),
    href: DASHBOARD_ROUTES.MENU,
    icon: BookOpen
  },
  {
    name: t("sidebarCustomers"),
    href: DASHBOARD_ROUTES.CUSTOMERS,
    icon: Users
  },
  {
    name: t("sidebarReports"),
    href: DASHBOARD_ROUTES.REPORTS,
    icon: BarChart3
  },
  {
    name: t("sidebarSettings"),
    href: DASHBOARD_ROUTES.SETTINGS,
    icon: Settings
  }
]

  // Remove locale prefix from pathname (e.g., /en/manager/dashboard -> /manager/dashboard)
  const pathname = usePathname().replace(/^\/[a-z]{2}(\/|$)/, '/')

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)
          
          return (
            <Link key={item.name} href={item.href}>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.name}
              </Button>
            </Link>
          )
        })}
      </nav>

    </div>
  )
}