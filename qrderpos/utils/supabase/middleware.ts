import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { PUBLIC_ROUTES } from '@/config/routes';

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
    const locale = request.cookies.get('NEXT_LOCALE')?.value || 'es';

    /** -------------------------  LOGIN REDIRECT ---------------------------- **/

    // Pages guests shouldn’t enter if logged in
    const guestOnlyRoutes = [PUBLIC_ROUTES.LOGIN, PUBLIC_ROUTES.REGISTER];

    if (user && guestOnlyRoutes.includes(pathnameWithoutLocale)) {
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}${PUBLIC_ROUTES.HOME}`;
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
};