"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Users, ClipboardList, Bell, Settings, LogOut } from "lucide-react";

export default function CoachLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItems = [
        { href: "/coach", icon: Users, label: "選手一覧" },
        { href: "/coach/menus", icon: ClipboardList, label: "メニュー作成" },
        { href: "/coach/notices", icon: Bell, label: "お知らせ" },
        { href: "/coach/settings", icon: Settings, label: "設定" },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r h-screen sticky top-0">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold text-gray-900">羽衣国際大学<br />女子駅伝部</h1>
                    <p className="text-sm text-gray-500 mt-1">ヘッドコーチ用管理画面</p>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                pathname === item.href
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-700 hover:bg-gray-50"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t">
                    <button className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">
                        <LogOut className="w-5 h-5" />
                        ログアウト
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden bg-white border-b p-4 flex justify-between items-center sticky top-0 z-10">
                <h1 className="font-bold text-gray-900">ヘッドコーチ用管理画面</h1>
                <button className="p-2">
                    <Users className="w-6 h-6 text-gray-600" />
                </button>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                {children}
            </main>

            {/* Mobile Bottom Nav (Coach specific) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t pb-safe-area-inset-bottom z-50">
                <div className="flex justify-around items-center h-16">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1",
                                pathname === item.href ? "text-blue-600" : "text-gray-500"
                            )}
                        >
                            <item.icon className="w-6 h-6" />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
