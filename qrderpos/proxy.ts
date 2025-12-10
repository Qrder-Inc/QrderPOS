import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { type NextRequest } from 'next/server'

// Supabase Middleware
import { updateSession } from "./utils/supabase/middleware";

// Create next-intl middleware instance
const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  // --- 1. Run Supabase session update first
  const supabaseResponse = await updateSession(request);
  
  // --- 2. If Supabase redirects (login required), return that
  if (supabaseResponse.headers.get('location')) {
    return supabaseResponse;
  }
  
  // --- 3. Otherwise, run next-intl middleware
  const intlResponse = intlMiddleware(request);
  
  // --- 4. Return intl response if it exists, otherwise supabase response
  return intlResponse || supabaseResponse;
}

// --- Unified Proxy-Friendly Matcher ---
export const config = {
  matcher: [
    // Match everything EXCEPT:
    // - API routes
    // - next internal files
    // - static/image assets
    // - vercel internals
    // - any file with extension (favicon, images, etc.)
    "/((?!api|trpc|_next|_vercel|_next/static|_next/image|.*\\..*).*)",
  ],
};
