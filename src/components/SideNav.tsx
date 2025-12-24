"use client";

import { Home, Calendar, Dumbbell, ClipboardList, Activity, MessageCircle, User, LogOut, Utensils, Bot, FlaskConical } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function SideNav() {
    const pathname = usePathname();

    // Hide on login page and coach pages
    if (pathname === "/login" || pathname?.startsWith("/coach")) return null;

    const navItems = [
        { href: "/", icon: Home, label: "ホーム" },
        { href: "/schedule", icon: Calendar, label: "スケジュール" },
        // { href: "/training", icon: Dumbbell, label: "トレーニング内容" }, // Consolidated into Record
        { href: "/record", icon: ClipboardList, label: "トレーニング記録" },
        { href: "/nutrition", icon: Utensils, label: "食事記録" },
        { href: "/condition", icon: Activity, label: "コンディショニング" },
        { href: "/manager", icon: Bot, label: "AI主務" },
        { href: "/messages", icon: MessageCircle, label: "連絡" },
        { href: "/research", icon: FlaskConical, label: "貧血研究用データ" },
        { href: "/profile", icon: User, label: "マイページ" },
    ];

    return (
        <aside className="hidden md:flex flex-col w-64 fixed left-0 top-0 bottom-0 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border-r border-white/40 dark:border-zinc-800 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            <div className="p-8">
                <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:to-gray-400 tracking-tighter leading-tight">
                    羽衣国際大学<br />女子駅伝部
                </h1>
                <p className="text-[10px] font-bold text-pink-500 uppercase tracking-widest mt-1 ml-0.5">Athlete Portal</p>
            </div>

            <nav className="flex-1 px-4 space-y-3 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "bg-gradient-to-br from-pink-500 to-orange-500 text-white shadow-lg shadow-pink-500/25"
                                    : "text-gray-500 hover:bg-white/50 hover:text-gray-900"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400 group-hover:text-gray-700")} />
                            <span className="font-bold tracking-wide text-sm">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100/50">
                <Button variant="ghost" className="w-full justify-start text-gray-500 hover:text-red-500 hover:bg-red-50/50 gap-2" asChild>
                    <Link href="/login">
                        <LogOut className="w-4 h-4" />
                        ログアウト
                    </Link>
                </Button>
            </div>
        </aside>
    );
}
