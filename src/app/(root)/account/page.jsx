"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Package,
  User,
  MapPin,
  Settings,
  LogOut,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const navItems = [
  { id: "orders", label: "My Orders", icon: Package },
  { id: "profile", label: "Profile", icon: User },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "settings", label: "Settings", icon: Settings },
]

const orders = [
  {
    id: "ORD-2024-001",
    date: "Feb 15, 2026",
    total: 499.97,
    status: "Delivered",
    items: 3,
  },
  {
    id: "ORD-2024-002",
    date: "Feb 10, 2026",
    total: 189.0,
    status: "In Transit",
    items: 1,
  },
  {
    id: "ORD-2024-003",
    date: "Jan 28, 2026",
    total: 129.99,
    status: "Pending",
    items: 1,
  },
  {
    id: "ORD-2024-004",
    date: "Jan 15, 2026",
    total: 284.98,
    status: "Delivered",
    items: 2,
  },
]

function getStatusVariant(status) {
  switch (status) {
    case "Delivered":
      return "default" 
    case "In Transit":
      return "secondary" 
    case "Pending":
      return "outline" 
    default:
      return "outline" 
  }
}

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("orders")

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <h1 className="mb-8 font-serif text-3xl font-bold text-foreground">
        My Account
      </h1>

      <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
        {/* Sidebar */}
        <aside className="w-80">
          <div className="rounded-2xl border bg-card p-6">
            <div className="mb-6 flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  JD
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground">John Doe</p>
                <p className="text-xs text-muted-foreground">john@example.com</p>
              </div>
            </div>

            <Separator className="mb-4" />

            <nav className="flex flex-col gap-3">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2 font-medium transition-colors ${
                      activeTab === item.id
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="size-5" />
                    {item.label}
                  </button>
                )
              })}
              <Separator className="my-2" />
              <button className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-destructive">
                <LogOut className="size-4" />
                Sign Out
              </button>
            </nav>
          </div>
        </aside>

        <div className="flex-1">
          {activeTab === "orders" && (
            <div>
              <h2 className="mb-6 text-lg font-semibold text-foreground">
                Order History
              </h2>
              <div className="flex flex-col gap-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-foreground">
                          {order.id}
                        </span>
                        <Badge
                          variant={getStatusVariant(order.status)}
                          className="rounded-lg text-[10px]"
                        >
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {order.date} &middot; {order.items} item
                        {order.items > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-foreground">
                        ${order.total.toFixed(2)}
                      </span>
                      <Button variant="outline" size="sm" className="rounded-xl">
                        <Eye className="mr-1.5 size-3" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div>
              <h2 className="mb-6 text-lg font-semibold text-foreground">
                Personal Information
              </h2>
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label>First Name</Label>
                    <Input defaultValue="John" className="rounded-xl" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Last Name</Label>
                    <Input defaultValue="Doe" className="rounded-xl" />
                  </div>
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      defaultValue="john@example.com"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="flex flex-col gap-2 sm:col-span-2">
                    <Label>Phone</Label>
                    <Input
                      type="tel"
                      defaultValue="+1 (555) 000-0000"
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <Button className="mt-6 rounded-xl px-8">Save Changes</Button>
              </div>
            </div>
          )}

          {activeTab === "addresses" && (
            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">
                  Saved Addresses
                </h2>
                <Button variant="outline" size="sm" className="rounded-xl">
                  Add New
                </Button>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  {
                    label: "Home",
                    address: "123 Main Street, Apt 4B, New York, NY 10001",
                    isDefault: true,
                  },
                  {
                    label: "Office",
                    address: "456 Business Ave, Suite 200, New York, NY 10002",
                    isDefault: false,
                  },
                ].map((addr) => (
                  <div
                    key={addr.label}
                    className={`rounded-2xl border p-5 ${
                      addr.isDefault
                        ? "border-foreground bg-card"
                        : "border-border bg-card"
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {addr.label}
                      </span>
                      {addr.isDefault && (
                        <Badge variant="secondary" className="rounded-lg text-[10px]">
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {addr.address}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Button variant="ghost" size="sm" className="text-xs">
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-muted-foreground"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h2 className="mb-6 text-lg font-semibold text-foreground">
                Account Settings
              </h2>
              <div className="flex flex-col gap-6">
                <div className="rounded-2xl border border-border bg-card p-6">
                  <h3 className="mb-4 text-sm font-semibold text-foreground">
                    Change Password
                  </h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <Label>Current Password</Label>
                      <Input type="password" className="rounded-xl" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>New Password</Label>
                      <Input type="password" className="rounded-xl" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>Confirm New Password</Label>
                      <Input type="password" className="rounded-xl" />
                    </div>
                  </div>
                  <Button className="mt-4 rounded-xl px-8">
                    Update Password
                  </Button>
                </div>

                <div className="rounded-2xl border border-destructive/30 bg-card p-6">
                  <h3 className="mb-2 text-sm font-semibold text-foreground">
                    Danger Zone
                  </h3>
                  <p className="mb-4 text-xs text-muted-foreground">
                    Permanently delete your account and all associated data.
                  </p>
                  <Button variant="destructive" size="sm" className="rounded-xl">
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
