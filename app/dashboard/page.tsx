import { ChatButton } from "@/app/components/chat-button"
import { AppSidebar } from "@/app/components/app-sidebar"
import ResumeBuilder from "@/app/components/ResumeBuilder"
import { ResumeProvider } from "@/app/components/context/ResumeContext"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Page() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  const sidebarUser = {
    name: user.name ?? "User",
    email: user.email ?? "",
    avatar: "/avatars/shadcn.jpg",
  }

  return (
    <>
      <AppSidebar user={sidebarUser} />

      <main className="pt-16">
        <ResumeProvider>
          <ResumeBuilder />
        </ResumeProvider>
      </main>

      <ChatButton />
    </>
  )
}