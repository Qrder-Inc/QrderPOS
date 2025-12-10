import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { getCurrentUser, getUserRoles } from '@/dal/user';
import { AUTH_ROUTES, PUBLIC_ROUTES } from '@/config/routes';

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
      request,
    })

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )
      const {
      data: { user },
    } = await supabase.auth.getUser()

    // Strip locale prefix to check actual route
    const pathname = request.nextUrl.pathname;
    const pathnameWithoutLocale = pathname.replace(/^\/(en|es|zh)/, '') || '/';

    /** ------------------------- FETCH ROLE ---------------------------- **/

    /** -------------------------  LOGIN REDIRECT ---------------------------- **/
    if (user && pathnameWithoutLocale === PUBLIC_ROUTES.LOGIN) {
      const url = request.nextUrl.clone()
      url.pathname = AUTH_ROUTES.AUTHORIZATION
      return NextResponse.redirect(url)
    }

    if (user && pathnameWithoutLocale === PUBLIC_ROUTES.REGISTER) {
      const url = request.nextUrl.clone()
      url.pathname = AUTH_ROUTES.AUTHORIZATION
      return NextResponse.redirect(url)
    }

    if (
      !user &&
      (
        pathnameWithoutLocale.startsWith(AUTH_ROUTES.MANAGER) ||
        pathnameWithoutLocale.startsWith(AUTH_ROUTES.POS)

      )
    ) {
      const url = request.nextUrl.clone()
      // Get locale from cookie or use default
      const locale = request.cookies.get('NEXT_LOCALE')?.value || 'es';
      url.pathname = `/${locale}${PUBLIC_ROUTES.LOGIN}`
      return NextResponse.redirect(url)
    }

    // ** --------- CHECK USER ROLES AND REDIRECT ACCORDINGLY --------- **
    if (user && pathnameWithoutLocale.startsWith(AUTH_ROUTES.MANAGER)) {
      const roles = await getUserRoles();
      const isOwner = roles.role === 'owner';
      if (!isOwner) {
        const url = request.nextUrl.clone()
        // Get locale from cookie or use default
        const locale = request.cookies.get('NEXT_LOCALE')?.value || 'es';
        url.pathname = `/${locale}${AUTH_ROUTES.UNAUTHORIZED}`
        return NextResponse.redirect(url)
      }
    }

    // ** --------- REDIRECT TO POS WITH RESTAURANT ID --------- **
    if (user && pathnameWithoutLocale === (AUTH_ROUTES.POS)) {
      const roles = await getUserRoles();
      console.log("User roles in middleware:", roles.restaurant_id);
      const url = request.nextUrl.clone()
      // Get locale from cookie or use default
      const locale = request.cookies.get('NEXT_LOCALE')?.value || 'es';
      url.pathname = `/${locale}/pos/${roles.restaurant_id}/`
      return NextResponse.redirect(url)
    }

    return supabaseResponse;
};