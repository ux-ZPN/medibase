import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const { pathname } = request.nextUrl;

  // 1. Instant bypass for public non-protected routes (avoids slow Supabase roundtrips on initial load)
  const isPublicRoute =
    pathname === "/" ||
    pathname === "/role-select" ||
    pathname === "/features" ||
    pathname.startsWith("/api/health") ||
    pathname.startsWith("/api/hospitals") ||
    pathname.startsWith("/api/auth");

  if (isPublicRoute) {
    return supabaseResponse;
  }

  const demoRole = request.cookies.get("medibase_demo_role")?.value as
    | "patient"
    | "hospital_staff"
    | undefined;

  const isStaffRoute = pathname.startsWith("/staff") && pathname !== "/staff/login";
  const isPatientRoute = pathname.startsWith("/patient") && pathname !== "/patient/login";
  const isStaffLogin = pathname === "/staff/login";
  const isPatientLogin = pathname === "/patient/login";

  let authenticatedUser = null;
  let userRole: "patient" | "hospital_staff" | "system_admin" | null = demoRole || null;

  // If we already have a demo role and are on standard routes, avoid blocking network call
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey && (isStaffRoute || isPatientRoute)) {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      authenticatedUser = user;

      if (user) {
        if (user.user_metadata?.role) {
          userRole = user.user_metadata.role as "patient" | "hospital_staff" | "system_admin";
        } else {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .maybeSingle();

          if (profile?.role) {
            userRole = profile.role as "patient" | "hospital_staff" | "system_admin";
          }
        }
      }
    } catch {
      // Supabase connection fallback to demo role if active
    }
  }

  const isAuthenticated = Boolean(authenticatedUser || demoRole);

  // 2. Unauthenticated users trying to access protected routes
  if (isStaffRoute && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/staff/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (isPatientRoute && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/patient/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // 3. Role-based checks for authenticated users
  if (isAuthenticated) {
    // Patient trying to access hospital staff protected routes
    if (isStaffRoute && userRole === "patient" && !demoRole) {
      const url = request.nextUrl.clone();
      url.pathname = "/patient/dashboard";
      return NextResponse.redirect(url);
    }

    // Hospital staff trying to access patient protected routes
    if (isPatientRoute && (userRole === "hospital_staff" || userRole === "system_admin") && !demoRole) {
      const url = request.nextUrl.clone();
      url.pathname = "/staff/dashboard";
      return NextResponse.redirect(url);
    }

    // Redirect already authenticated users away from login pages ONLY if they are matching role
    if (isStaffLogin && demoRole === "hospital_staff" && !request.nextUrl.searchParams.has("switch")) {
      const url = request.nextUrl.clone();
      url.pathname = "/staff/dashboard";
      return NextResponse.redirect(url);
    }

    if (isPatientLogin && demoRole === "patient" && !request.nextUrl.searchParams.has("switch")) {
      const url = request.nextUrl.clone();
      url.pathname = "/patient/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

