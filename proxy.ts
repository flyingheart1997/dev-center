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
  const publicRoutes = [
    "/login",
    "/register",
    "/verify-email",
    "/forgot-password",
    "/reset-password",
    "/privacy",
    "/terms",
  ]
  const isStaticAsset = /\.(png|jpg|jpeg|gif|webp|svg|ico|css|js)$/i.test(pathname)

  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/api/trpc") ||
    pathname.startsWith("/public") ||
    isStaticAsset ||
    publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))
  )
}

// /dashboard is the single shared landing route — the page itself renders the org or
// candidate view based on session. Every other org/candidate page lives at a bare
// top-level path (via the (organization)/(candidate) route groups under (dashboard)),
// so there's no shared URL prefix left to gate on. Each such route must be registered
// in exactly one of these sets for the cross-workspace check below to protect it.
const CANDIDATE_ONLY_ROUTE_SEGMENTS = new Set([
  "voice-arena",
  "resume-studio",
  "coding-practice",
  "applications",
  "profile",
])

const ORG_ONLY_ROUTE_SEGMENTS = new Set([
  "jobs",
  "candidates",
  "interviews",
  "team",
  "billing",
  "settings",
])

function resolveUserWorkspaceRedirect(token: any, request: NextRequest): NextResponse {
  if (token?.organizationId || token?.employeeId || token?.candidateId) {
    return NextResponse.redirect(getSafeRedirectUrl("/dashboard", request))
  }
  // Intent (candidate vs organization) is chosen at registration time now, and candidates
  // are auto-created the moment they verify/sign up — so the only way an authenticated user
  // has no workspace at all is an organization sign-up that hasn't finished /setup-org yet.
  return NextResponse.redirect(getSafeRedirectUrl("/setup-org", request))
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

  // Cross-Workspace Protection. /dashboard itself is shared (the page renders per-session);
  // every other registered dashboard-area route is gated by which persona owns it.
  if (isAuthenticated) {
    const hasOrgAccess = !!(token?.organizationId || token?.employeeId)
    const hasCandidateAccess = !!token?.candidateId
    const topSegment = pathname.split("/")[1] // "/dashboard" -> "dashboard", "/jobs" -> "jobs"

    if (topSegment === "dashboard") {
      if (!hasOrgAccess && !hasCandidateAccess && !isAppRouterDataRequest(request)) {
        return NextResponse.redirect(getSafeRedirectUrl("/setup-org", request))
      }
    } else if (CANDIDATE_ONLY_ROUTE_SEGMENTS.has(topSegment)) {
      if (!hasCandidateAccess && !isAppRouterDataRequest(request)) {
        return hasOrgAccess
          ? NextResponse.redirect(getSafeRedirectUrl("/dashboard", request))
          : NextResponse.redirect(getSafeRedirectUrl("/setup-org", request))
      }
    } else if (ORG_ONLY_ROUTE_SEGMENTS.has(topSegment)) {
      if (!hasOrgAccess && !isAppRouterDataRequest(request)) {
        return hasCandidateAccess
          ? NextResponse.redirect(getSafeRedirectUrl("/dashboard", request))
          : NextResponse.redirect(getSafeRedirectUrl("/setup-org", request))
      }
    }
  }

  // Logged-in user visiting /setup-org when a workspace already exists
  if (isAuthenticated && pathname === "/setup-org") {
    if (token?.organizationId || token?.employeeId || token?.candidateId) {
      if (!isAppRouterDataRequest(request)) return NextResponse.redirect(getSafeRedirectUrl("/dashboard", request))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
