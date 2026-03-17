import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/app/components/login-form"
import Navbar from "@/app/landing/navbar/nav"

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <a href="#" className="flex items-center gap-2 self-center font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            LOGIN PAGE
          </a>
          <LoginForm />
        </div>
      </div>
    </>
  )
}
