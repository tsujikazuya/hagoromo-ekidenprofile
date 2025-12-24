"use client";

import { Home, Calendar, PlusCircle, MessageCircle, User, Bot } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function BottomNav() {
    const pathname = usePathname();

    // Hide on login page and coach pages (coach has its own nav)
    if (pathname === "/login" || pathname?.startsWith("/coach")) return null;

    const navItems = [
        { href: "/", icon: Home, label: "ホーム" },
        { href: "/schedule", icon: Calendar, label: "予定" },
        { href: "/record", icon: PlusCircle, label: "記録", highlight: true },
        { href: "/messages", icon: MessageCircle, label: "連絡" },
        { href: "/manager", icon: Bot, label: "AI主務" },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe-area-inset-bottom">
            <div className="absolute inset-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-t border-white/20 dark:border-zinc-800 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]"></div>
            <div className="relative flex justify-around items-center h-20 pb-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-full h-full space-y-1",
                                isActive ? "text-pink-600" : "text-gray-500",
                                item.highlight && "text-pink-600"
                            )}
                        >
                            {item.highlight ? (
                                <div className="bg-pink-600 text-white p-3 rounded-full -mt-6 shadow-lg border-4 border-white">
                                    <item.icon className="w-6 h-6" />
                                </div>
                            ) : (
                                <item.icon className="w-6 h-6" />
                            )}
                            {!item.highlight && <span className="text-[10px] font-medium">{item.label}</span>}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
