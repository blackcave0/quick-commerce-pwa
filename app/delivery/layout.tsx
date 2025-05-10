import type React from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import { Home, Package, Settings, MapPin, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DeliveryLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-blue-800 text-white p-4 hidden md:block">
        <div className="mb-8">
          <h1 className="text-xl font-bold">Delivery Dashboard</h1>
        </div>

        <nav className="space-y-1">
          <NavItem href="/delivery" icon={<Home size={18} />} label="Dashboard" />
          <NavItem href="/delivery/orders" icon={<Package size={18} />} label="Orders" />
          <NavItem href="/delivery/pending" icon={<Clock size={18} />} label="Pending" />
          <NavItem href="/delivery/completed" icon={<CheckCircle size={18} />} label="Completed" />
          <NavItem href="/delivery/map" icon={<MapPin size={18} />} label="Map View" />
          <NavItem href="/delivery/settings" icon={<Settings size={18} />} label="Settings" />
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b h-16 flex items-center px-4 md:px-6">
          <Button variant="outline" size="sm" className="md:hidden mr-4">
            <span className="sr-only">Toggle menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <line x1="3" x2="21" y1="6" y2="6" />
              <line x1="3" x2="21" y1="12" y2="12" />
              <line x1="3" x2="21" y1="18" y2="18" />
            </svg>
          </Button>
          <h1 className="text-lg font-medium">Delivery Dashboard</h1>
        </header>

        <main className="flex-1 p-4 md:p-6 bg-gray-50 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

function NavItem({
  href,
  icon,
  label,
}: {
  href: string
  icon: React.ReactNode
  label: string
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 text-gray-300 hover:text-white hover:bg-blue-700 rounded-md transition-colors"
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}
