"use client"

import Image from "next/image"
import { NavUser } from "@/app/components/nav-user"
import Link from "next/link";

interface AppSidebarProps {
  user: {
    name: string
    email: string
    avatar: string
  }
}

export function AppSidebar({ user }: AppSidebarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-3 shadow-sm sm:px-4 lg:px-6">
      
 <Link href="/" className="flex items-center group">
  <Image
    src="/logo_final.webp"
    alt="KaamHubs Logo"
    width={160}
    height={44}
    className="h-10 w-auto object-contain group-hover:opacity-90 transition-opacity"
    priority
  />
</Link>

      <NavUser user={user} />

    </nav>
  )
}