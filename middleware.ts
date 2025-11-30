import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/admin/login');

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/admin/dashboard', req.url));
      }
      return NextResponse.next();
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }

      return NextResponse.redirect(
        new URL(`/admin/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // السماح بالوصول لصفحة تسجيل الدخول
        if (req.nextUrl.pathname === '/admin/login') {
          return true;
        }
        return !!token;
      },
    },
    pages: {
      signIn: '/admin/login',
    },
  }
);

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/admin/services/:path*',
    '/admin/orders/:path*',
    '/admin/portfolio/:path*',
    '/admin/settings/:path*',
    '/admin/users/:path*',
    '/admin/about/:path*',
    '/admin/contact/:path*',
    '/admin/login',
  ],
};
