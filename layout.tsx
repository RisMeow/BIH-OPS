"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Wrench,
    HeartHandshake,
    Car,
    ShieldCheck,
    Package,
    Trees,
    Bell,
    LogOut,
    User
} from "lucide-react";
import styles from "./layout.module.css";

const menuItems = [
    { name: "Tổng quan", href: "/dashboard", icon: LayoutDashboard },
    { name: "Kỹ thuật vận hành", href: "/dashboard/technical", icon: Wrench },
    { name: "Tổ Hộ lý", href: "/dashboard/nursing", icon: HeartHandshake },
    { name: "Tổ Lái xe", href: "/dashboard/driver", icon: Car },
    { name: "Tổ Bảo vệ", href: "/dashboard/security", icon: ShieldCheck },
    { name: "Tổ Cung ứng", href: "/dashboard/supply", icon: Package },
    { name: "Tổ Môi trường", href: "/dashboard/environment", icon: Trees },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className={styles.layout}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <h2 className={styles.sidebarTitle}>BECAMEX</h2>
                    <span className={styles.sidebarSubtitle}>Admin Portal</span>
                </div>

                <nav className={styles.nav}>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                            >
                                <Icon size={20} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className={styles.userProfile}>
                    <div className={styles.userInfo}>
                        <div className={styles.avatar}>AD</div>
                        <div className={styles.userDetails}>
                            <span className={styles.userName}>Admin Quản trị</span>
                            <span className={styles.userRole}>Trưởng phòng</span>
                        </div>
                    </div>
                    <Link href="/" className={styles.logoutBtn}>
                        <LogOut size={18} />
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className={styles.mainWrapper}>
                <header className={styles.header}>
                    <h1 className={styles.pageTitle}>Phòng Quản trị Vận hành</h1>
                    <div className={styles.headerActions}>
                        <button className={`${styles.iconBtn} ${styles.hasNotification}`}>
                            <Bell size={20} />
                        </button>
                    </div>
                </header>

                <main className={styles.content}>
                    {children}
                </main>
            </div>
        </div>
    );
}
