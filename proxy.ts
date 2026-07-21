import { NextRequest, NextResponse } from "next/server"
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

  // 1. PRE-FLIGHT BYPASS (Allow internal Next.js assets & API endpoints to pass untouched)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/public") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/trpc")
  ) {
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

  // 4. EMAIL VERIFICATION GATE
  // If user is logged in but email is NOT verified, force redirect to /verify-email
  if (isAuthenticated && !token?.emailVerified && pathname !== "/verify-email") {
    if (!isAppRouterDataRequest(request)) {
      const verifyUrl = getSafeRedirectUrl("/verify-email", request)
      if (token?.email) verifyUrl.searchParams.set("email", token.email)
      return NextResponse.redirect(verifyUrl)
    }
  }

  // 5. AUTHENTICATED USER ROUTING
  const isGuestAuthRoute = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password"

  // Logged-in user visiting guest auth routes (/login, /register, /forgot-password) -> Redirect to workspace
  if (isAuthenticated && isGuestAuthRoute && !isAppRouterDataRequest(request)) {
    return resolveUserWorkspaceRedirect(token, request)
  }

  // Prevent verified users from accessing /verify-email
  if (isAuthenticated && token?.emailVerified && pathname === "/verify-email") {
    if (!isAppRouterDataRequest(request)) {
      return resolveUserWorkspaceRedirect(token, request)
    }
  }

  // Prevent onboarded users from accessing /onboarding
  if (isAuthenticated && pathname === "/onboarding" && (token?.candidateId || token?.organizationId || token?.employeeId)) {
    if (!isAppRouterDataRequest(request)) {
      return resolveUserWorkspaceRedirect(token, request)
    }
  }

  // Cross-Workspace Protection
  if (isAuthenticated) {
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/organization")) {
      if (!token?.organizationId && !token?.employeeId) {
        if (!isAppRouterDataRequest(request)) {
           return token?.candidateId 
             ? NextResponse.redirect(getSafeRedirectUrl("/candidate", request))
             : NextResponse.redirect(getSafeRedirectUrl("/onboarding", request))
        }
      }
    }

    if (pathname.startsWith("/candidate")) {
      if (!token?.candidateId) {
        if (!isAppRouterDataRequest(request)) {
           return (token?.organizationId || token?.employeeId)
             ? NextResponse.redirect(getSafeRedirectUrl("/dashboard", request))
             : NextResponse.redirect(getSafeRedirectUrl("/onboarding", request))
        }
      }
    }
  }

  // Logged-in user visiting /setup-org when Org is ALREADY set up OR is a Candidate
  if (isAuthenticated && pathname === "/setup-org") {
    if (token?.organizationId || token?.employeeId) {
      if (!isAppRouterDataRequest(request)) return NextResponse.redirect(getSafeRedirectUrl("/dashboard", request))
    }
    if (token?.candidateId) {
      if (!isAppRouterDataRequest(request)) return NextResponse.redirect(getSafeRedirectUrl("/candidate", request))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
