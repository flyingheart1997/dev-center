import { NextRequest, NextResponse } from "next/server"
import { EmployeeStatus } from "@/types/enums"
import { getToken } from "next-auth/jwt"

// NextAuth cookie keys (handles HTTP and HTTPS secure cookie names)
const NEXTAUTH_COOKIE_KEYS = [
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
]

function isAppRouterDataRequest(request: NextRequest) {
  return (
    request.headers.has("rsc") ||
    request.headers.has("next-router-prefetch") ||
    request.headers.get("purpose") === "prefetch" ||
    request.nextUrl.searchParams.has("_rsc")
  )
}

function getSafeRedirectUrl(targetPath: string, request: NextRequest): URL {
  return new URL(targetPath, request.url)
}

function isPublicRoute(pathname: string) {
  const publicRoutes = ["/login", "/register", "/forgot-password", "/privacy", "/terms"]
  const isStaticAsset = /\.(png|jpg|jpeg|gif|webp|svg|ico|css|js)$/i.test(pathname)

  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/public") ||
    isStaticAsset ||
    publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))
  )
}

function resolveUserWorkspaceRedirect(token: any, request: NextRequest): NextResponse {
  if (token?.employeeStatus === EmployeeStatus.PENDING_APPROVAL) {
    return NextResponse.redirect(getSafeRedirectUrl("/pending-approval", request))
  }
  if (token?.organizationId || token?.employeeId) {
    return NextResponse.redirect(getSafeRedirectUrl("/dashboard", request))
  }
  if (token?.candidateId) {
    return NextResponse.redirect(getSafeRedirectUrl("/candidate", request))
  }
  return NextResponse.redirect(getSafeRedirectUrl("/onboarding", request))
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl

  // 1. PRE-FLIGHT BYPASS (Allow internal Next.js assets & NextAuth endpoints to pass untouched)
  if (pathname.startsWith("/_next") || pathname.startsWith("/public") || pathname.startsWith("/api/auth")) {
    return NextResponse.next()
  }

  // 2. DIRECT COOKIE CHECK
  const hasCookieToken = NEXTAUTH_COOKIE_KEYS.some((key) => !!request.cookies.get(key)?.value)

  // Unauthenticated user accessing public pages -> Allow immediately
  if (!hasCookieToken && isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  // Unauthenticated user accessing protected pages -> Redirect to /login (or 401 for RSC prefetch)
  if (!hasCookieToken && !isPublicRoute(pathname)) {
    if (isAppRouterDataRequest(request)) {
      return new NextResponse(null, {
        status: 401,
        headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
      })
    }
    const loginUrl = getSafeRedirectUrl("/login", request)
    loginUrl.searchParams.set("callbackUrl", request.url)
    return NextResponse.redirect(loginUrl)
  }

  // 3. DEEP TOKEN VERIFICATION (Only when session cookie exists)
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  })

  const isAuthenticated = !!(token && (token.id || token.sub || token.email))

  // Fallback for expired or invalid token cookie
  if (!isAuthenticated && !isPublicRoute(pathname)) {
    if (isAppRouterDataRequest(request)) {
      return new NextResponse(null, { status: 401 })
    }
    const loginUrl = getSafeRedirectUrl("/login", request)
    loginUrl.searchParams.set("callbackUrl", request.url)
    return NextResponse.redirect(loginUrl)
  }

  // 4. AUTHENTICATED USER ROUTING
  const isGuestAuthRoute = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password"

  // Logged-in user visiting guest auth routes (/login, /register, /forgot-password) -> Redirect to workspace
  if (isAuthenticated && isGuestAuthRoute && !isAppRouterDataRequest(request)) {
    return resolveUserWorkspaceRedirect(token, request)
  }

  // Logged-in user visiting /onboarding after already being onboarded -> Redirect to workspace
  if (isAuthenticated && pathname.startsWith("/onboarding") && !isAppRouterDataRequest(request)) {
    if (token?.organizationId || token?.employeeId || token?.candidateId || token?.employeeStatus === EmployeeStatus.PENDING_APPROVAL) {
      return resolveUserWorkspaceRedirect(token, request)
    }
  }

  // Logged-in employee with PENDING_APPROVAL accessing /dashboard/* -> Redirect to /pending-approval
  if (isAuthenticated && pathname.startsWith("/dashboard") && token?.employeeStatus === EmployeeStatus.PENDING_APPROVAL) {
    return NextResponse.redirect(getSafeRedirectUrl("/pending-approval", request))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
