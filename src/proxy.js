import { NextResponse } from 'next/server';

// ─── Auth Proxy — replaces deprecated middleware.js ──────────────────────────
// Docs: node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md
//
// The function MUST be named `proxy` (not `middleware`) in Next.js 16.
// The config.matcher keeps the same shape as before.

export function proxy(request) {
  const token = request.cookies.get('admin_token')?.value;
  const { pathname } = request.nextUrl;

  // Protect Dashboard Routes: Redirect unauthenticated users to login
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect Guest Routes: Redirect authenticated users away from login/signup
  if (pathname === '/login' || pathname === '/signup') {
    if (token) {
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  // Protect API Routes: Block unauthenticated mutating requests
  if (pathname.startsWith('/api')) {
    const isMutatingRequest = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method);

    // Public endpoints — accessible without a token
    const isPublicEndpoint =
      pathname.startsWith('/api/auth/login') ||
      pathname.startsWith('/api/auth/logout') ||
      pathname.startsWith('/api/enquiries');

    if (isMutatingRequest && !isPublicEndpoint && !token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Missing admin token' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  // Match dashboard, login/signup, and all API routes
  matcher: ['/dashboard/:path*', '/login', '/signup', '/api/:path*'],
};
