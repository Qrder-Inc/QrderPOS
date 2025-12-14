import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { type NextRequest } from 'next/server'

// Supabase Middleware
import { updateSession } from "./utils/supabase/middleware";

// Create next-intl middleware instance
const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const supabaseResponse = await updateSession(request);

  if (supabaseResponse.headers.get('location')) {
    return supabaseResponse;
  }

  const intlResponse = intlMiddleware(request);

  if (intlResponse) {
    // Preserve Supabase cookies
    supabaseResponse.headers.forEach((value, key) => {
      if (key === 'set-cookie') {
        intlResponse.headers.append(key, value);
      }
    });
    return intlResponse;
  }

  return supabaseResponse;
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
