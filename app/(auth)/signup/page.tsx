import Navbar from "@/app/landing/navbar/nav"
import { SignupForm } from "@/app/components/signup-form"
import { GalleryVerticalEnd } from "lucide-react"

export default function Page() {
  return (
    <>
      <Navbar />
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <a href="#" className="flex items-center justify-center py-3 gap-2 self-center font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            SIGNUP PAGE
          </a>
          <SignupForm />
        </div>
      </div>
    </>
  )
}
