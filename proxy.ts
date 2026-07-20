import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { EmployeeStatus } from "@/types/enums"

export function proxy(req: any) {
  const token = req.nextauth?.token
  const pathname = req.nextUrl.pathname

  // Block employees who are in Pending_Approval status from entering enterprise dashboard
  if (pathname.startsWith("/dashboard")) {
    if (token?.employeeStatus === EmployeeStatus.PENDING_APPROVAL) {
      return NextResponse.redirect(new URL("/onboarding/pending-approval", req.url))
    }
  }

  return NextResponse.next()
}

export default withAuth(proxy, {
  callbacks: {
    authorized: ({ token }) => !!token,
  },
})

export const config = {
  matcher: ["/dashboard/:path*", "/candidate/:path*", "/interview/:path*"],
}
