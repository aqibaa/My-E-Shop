"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Settings, Store, Menu
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger,SheetHeader,SheetTitle } from "@/components/ui/sheet"


const sidebarLinks = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Back to Store", href: "/", icon: Store },
]



const NavLinks = ({ pathname, setMobileOpen }) => (
  <nav className="flex flex-col gap-1 mt-4">
    {sidebarLinks.map((link) => {
      const Icon = link.icon
      if (link.href === "/") {
        return (
          <div key="home-divider" className="pt-4 mt-4 border-t border-border">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <Icon className="size-4" />
              {link.label}
            </Link>
          </div>
        )
      }

      const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href))

      return (
        <Link
          key={link.href}
          href={link.href}
          onClick={() => setMobileOpen && setMobileOpen(false)} 
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
        >
          <Icon className="size-4" />
          {link.label}
        </Link>
      )
    })}
  </nav>
)

export default function AdminSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)


  return (
    <>
      <div className="lg:hidden flex items-center justify-between bg-card border-b p-4 sticky top-0 z-40 w-full">
        <div className="flex items-center gap-2">

          <Store className="size-5 text-foreground" />
          <span className="text-sm font-bold text-foreground">Admin Panel</span>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-4">
            <SheetTitle className="font-serif text-xl">My-E-Shop</SheetTitle>
            <div className="flex items-center gap-2 px-3 pt-4">
              <Store className="size-5 text-foreground" />
              <span className="text-sm font-bold text-foreground">Admin Panel</span>
            </div>
            <NavLinks pathname={pathname} setMobileOpen={setMobileOpen} />
          </SheetContent>
        </Sheet>
      </div>


      {/* For Desktop Screen */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card lg:block">
        <div className="sticky top-[6.5rem] flex flex-col gap-1 p-4">
          <div className="mb-4 flex items-center gap-2 px-3">
            <Store className="size-5 text-foreground" />
            <span className="text-sm font-bold text-foreground">Admin Panel</span>
          </div>

          <nav className="flex flex-col gap-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                >
                  <Icon className="size-4" />
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
}