"use client"

import { useState } from "react"
import { addAddress, deleteAddress } from "@/lib/actions/user.actions";
import Link from "next/link"
import { useClerk, useUser, UserProfile } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import {
  Package, User, ShieldCheck, MapPin, Settings, LogOut, Eye, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Toaster } from "../ui/sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner";

const navItems = [
  { id: "orders", label: "My Orders", icon: Package },
  { id: "profile", label: "Profile", icon: User },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "settings", label: "Settings", icon: Settings },
]

const ADMIN_EMAILS = ["aaqib.codes@gmail.com"];


export default function AccountTabs({ orders, addresses }) {
  const { user } = useUser();
  const isAdmin = user && ADMIN_EMAILS.includes(user.primaryEmailAddress?.emailAddress?.toLowerCase());
  const [activeTab, setActiveTab] = useState("orders")
  const { signOut } = useClerk();
  const router = useRouter();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newAddress, setNewAddress] = useState({
    firstName: "", lastName: "", email: "", phone: "", address: "", city: "", zip: "", country: ""
  });


  const handleAddAddress = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await addAddress(newAddress);
      toast.success("Address added successfully!");
      setShowAddressForm(false);
      setNewAddress({ firstName: "", lastName: "", email: "", phone: "", address: "", city: "", zip: "", country: "" });
    } catch (error) {
      toast.error("Failed to add address.");
    } finally {
      setIsSaving(false);
    }
  }

  const handleDeleteAddress = async (id) => {
    if (confirm("Are you sure you want to delete this address?")) {
      try {
        await deleteAddress(id);
        toast.success("Address deleted.");
      } catch (e) {
        toast.error("Could not delete.");
      }
    }
  }


  function getStatusVariant(status) {
    switch (status) {
      case "Delivered":
        return "default";
      case "Shipped":
        return "secondary";
      case "Processing":
        return "secondary";
      case "Pending":
        return "outline";
      case "Cancelled":
        return "destructive";
      default:
        return "outline";
    }
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  }


  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
      <aside className="lg:w-80 w-full shrink-0">
        <div className="rounded-2xl border bg-card p-6">
          <div className="mb-6 flex items-center gap-3">
            <Avatar className="size-10">
              <AvatarImage src={user?.imageUrl} />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {user?.firstName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-foreground truncate">{user?.fullName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.primaryEmailAddress?.emailAddress}</p>
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
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 font-medium transition-colors ${activeTab === item.id
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
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-destructive hover:bg-red-50 w-full text-left"
            >
              <LogOut className="size-4" />
              Sign Out
            </button>
          </nav>
        </div>
      </aside>

      <div className="flex-1 min-h-125">
        {activeTab === "orders" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="mb-6 text-lg font-semibold text-foreground">Order History</h2>
            {orders.length > 0 ? (
              <div className="flex flex-col gap-4">
                {orders.map((order) => (
                  <div key={order.id} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between hover:shadow-md transition-shadow">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-foreground truncate max-w-37.5">
                          #{order.id.slice(-8).toUpperCase()}
                        </span>
                        <Badge variant={getStatusVariant(order.status)} className="rounded-lg text-[10px]">
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)} &middot; {order.orderItems.length} item{order.orderItems.length > 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-foreground">
                        ${Number(order.totalPrice).toFixed(2)}
                      </span>
                      <Link href={`/order/${order.id}`}>
                        <Button variant="outline" size="sm" className="rounded-xl">
                          <Eye className="mr-1.5 size-3" /> View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border rounded-2xl border-dashed">
                <Package className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No orders found.</p>
                <Link href="/products" className="text-blue-600 text-sm hover:underline">Start Shopping</Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {isAdmin && (
              <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded-xl text-red-600">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-red-900">Administrator Account</h3>
                    <p className="text-sm text-red-700">You have full access to manage products, orders, and store settings.</p>
                  </div>
                </div>
                <Link href="/admin">
                  <Button variant="destructive" className="rounded-xl whitespace-nowrap">
                    Go to Admin Dashboard
                  </Button>
                </Link>
              </div>
            )}
            <h2 className="mb-6 text-lg font-semibold text-foreground">Personal Information</h2>
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label>First Name</Label>
                  <Input value={user?.firstName || ''} disabled className="rounded-xl bg-gray-50" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Last Name</Label>
                  <Input value={user?.lastName || ''} disabled className="rounded-xl bg-gray-50" />
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <Label>Email</Label>
                  <Input value={user?.primaryEmailAddress?.emailAddress || ''} disabled className="rounded-xl bg-gray-50" />
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                To change your personal details, please use the Clerk User Profile settings below.
              </p>
            </div>
          </div>
        )}

         {activeTab === "addresses" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Saved Addresses</h2>
              <Button onClick={() => setShowAddressForm(!showAddressForm)} variant={showAddressForm ? "secondary" : "default"} size="sm" className="rounded-xl">
                {showAddressForm ? "Cancel" : "Add New Address"}
              </Button>
            </div>

            {/* ADD ADDRESS FORM */}
            {showAddressForm && (
                <form onSubmit={handleAddAddress} className="bg-gray-50 border p-6 rounded-2xl mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>First Name</Label><Input required value={newAddress.firstName} onChange={(e)=> setNewAddress({...newAddress, firstName: e.target.value})} className="bg-white rounded-xl" /></div>
                    <div className="space-y-2"><Label>Last Name</Label><Input required value={newAddress.lastName} onChange={(e)=> setNewAddress({...newAddress, lastName: e.target.value})} className="bg-white rounded-xl" /></div>
                    <div className="space-y-2"><Label>Email</Label><Input required type="email" value={newAddress.email} onChange={(e)=> setNewAddress({...newAddress, email: e.target.value})} className="bg-white rounded-xl" /></div>
                    <div className="space-y-2"><Label>Phone</Label><Input required value={newAddress.phone} onChange={(e)=> setNewAddress({...newAddress, phone: e.target.value})} className="bg-white rounded-xl" /></div>
                    <div className="space-y-2 sm:col-span-2"><Label>Street Address</Label><Input required value={newAddress.address} onChange={(e)=> setNewAddress({...newAddress, address: e.target.value})} className="bg-white rounded-xl" /></div>
                    <div className="space-y-2"><Label>City</Label><Input required value={newAddress.city} onChange={(e)=> setNewAddress({...newAddress, city: e.target.value})} className="bg-white rounded-xl" /></div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2"><Label>Zip</Label><Input required value={newAddress.zip} onChange={(e)=> setNewAddress({...newAddress, zip: e.target.value})} className="bg-white rounded-xl" /></div>
                        <div className="space-y-2"><Label>Country</Label><Input required value={newAddress.country} onChange={(e)=> setNewAddress({...newAddress, country: e.target.value})} className="bg-white rounded-xl" /></div>
                    </div>
                    <div className="sm:col-span-2 mt-2">
                        <Button type="submit" disabled={isSaving} className="rounded-xl w-full">
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Address"}
                        </Button>
                    </div>
                </form>
            )}

            {/* LIST REAL ADDRESSES */}
            {addresses.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {addresses.map((addr) => (
                    <div key={addr.id} className={`rounded-2xl border p-5 relative group ${addr.isDefault ? "border-blue-600 bg-blue-50/30" : "border-border bg-card"}`}>
                        <div className="mb-2 flex items-center gap-2">
                            <span className="text-sm font-semibold text-foreground">{addr.firstName} {addr.lastName}</span>
                            {addr.isDefault && <Badge className="rounded-lg text-[10px] bg-blue-600">Default</Badge>}
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            {addr.address}, {addr.city} <br/> {addr.zip}, {addr.country}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">{addr.phone} • {addr.email}</p>
                        
                        <div className="mt-4 flex gap-2">
                            <Button onClick={() => handleDeleteAddress(addr.id)} variant="ghost" size="sm" className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50">
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
                </div>
            ) : (
                !showAddressForm && (
                  <div className="text-center py-10 text-gray-500 border border-dashed rounded-2xl">
                      No addresses saved yet. Click above to add one.
                  </div>
                )
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="mb-6 text-lg font-semibold text-foreground">Account Settings</h2>

            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border">
              <UserProfile
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none border-0 w-full max-w-none rounded-none",
                    navbar: "hidden",
                    pageScrollBox: "p-6",
                  }
                }}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  )
}