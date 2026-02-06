import { withAuth } from "next-auth/middleware";
// @ts-ignore
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req: any) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;
        const role = token?.role;

        // === ADMIN ONLY ROUTES ===
        // Chỉ ADMIN mới được truy cập /dashboard/system (quản lý users)
        if (path.startsWith('/dashboard/system') && role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/dashboard?error=admin_only', req.url));
        }

        // === API ADMIN PROTECTION ===
        // API /api/admin/* chỉ dành cho ADMIN
        if (path.startsWith('/api/admin') && role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
        }

        // === HOME DASHBOARD REDIRECT ===
        // Chuyển hướng từ /dashboard về trang riêng của từng tổ
        if (path === '/dashboard') {
            if (role === 'TECHNICAL') return NextResponse.redirect(new URL('/dashboard/technical', req.url));
            if (role === 'NURSING') return NextResponse.redirect(new URL('/dashboard/nursing', req.url));
            if (role === 'DRIVER') return NextResponse.redirect(new URL('/dashboard/driver', req.url));
            if (role === 'SECURITY') return NextResponse.redirect(new URL('/dashboard/security', req.url));
            if (role === 'SUPPLY') return NextResponse.redirect(new URL('/dashboard/supply', req.url));
            if (role === 'ENVIRONMENT') return NextResponse.redirect(new URL('/dashboard/environment', req.url));
            // ADMIN vẫn giữ ở /dashboard chung
        }

        // === PUBLIC ROUTES (cho tất cả users đã đăng nhập) ===
        // Trang gửi yêu cầu - tất cả users đều có quyền truy cập
        if (path.startsWith('/dashboard/request')) {
            return NextResponse.next();
        }

        // === DEPARTMENT ACCESS CONTROL ===
        // User chỉ được truy cập dashboard của tổ mình hoặc là Admin
        const departmentRoutes: Record<string, string> = {
            '/dashboard/technical': 'TECHNICAL',
            '/dashboard/nursing': 'NURSING',
            '/dashboard/driver': 'DRIVER',
            '/dashboard/security': 'SECURITY',
            '/dashboard/supply': 'SUPPLY',
            '/dashboard/environment': 'ENVIRONMENT',
        };

        for (const [route, requiredRole] of Object.entries(departmentRoutes)) {
            if (path.startsWith(route) && role !== requiredRole && role !== 'ADMIN') {
                return NextResponse.redirect(new URL('/dashboard', req.url));
            }
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*", "/api/admin/:path*"],
};
