import React from "react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen w-screen flex justify-center items-center bg-neutral-100 dark:bg-neutral-900">
      <div className="w-full max-w-md rounded-2xl">
        {children}
      </div>
    </main>
  )
}
