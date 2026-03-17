"use client"

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
      
   <Link href="/" className="group flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#00273D] to-[#00273D] sm:h-9 sm:w-9">
            <span className="text-sm font-bold text-white sm:text-base">T</span>
          </div>
          <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-base font-bold text-transparent sm:text-lg lg:text-xl">
            TaskMaster
          </span>
        </Link>

      <NavUser user={user} />

    </nav>
  )
}