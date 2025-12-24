"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Utensils, AlertCircle, ChevronRight, Trophy, Zap, Bell } from "lucide-react";
import Link from "next/link";
import { ShareButton } from "@/components/ShareButton";

export default function Home() {
  // Mock data
  const todayMenu = {
    title: "ポイント練習",
    type: "Interval",
    details: "400m × 10 (r: 200m)",
    location: "大学G",
    time: "16:30",
  };

  const conditionStatus = {
    submitted: false,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F8] via-[#FFFBFB] to-[#F8FAFF] dark:from-black dark:to-zinc-900 pb-32">
      {/* Compact Header with Glass Effect */}
      <header className="sticky top-0 z-40 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl px-5 py-3 flex justify-between items-center border-b border-white/20 dark:border-zinc-800 shadow-sm">
        <div>
          <h1 className="text-lg font-black tracking-tight text-gray-800 dark:text-white">
            Hi, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">選手A</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <ShareButton />
          <Link href="/profile">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-pink-500 to-orange-400 p-[2px] shadow-lg shadow-pink-500/20">
              <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-200">A</span>
              </div>
            </div>
          </Link>
        </div>
      </header>

      {/* Ticker Notification with Gloss */}
      <div className="bg-gradient-to-r from-pink-50/80 to-white/80 dark:from-pink-900/20 dark:to-zinc-900/20 backdrop-blur-sm px-5 py-2.5 flex items-center gap-3 border-b border-pink-100/50 dark:border-pink-900/30">
        <div className="bg-pink-100 dark:bg-pink-900/50 p-1 rounded-full">
          <Bell className="w-3 h-3 text-pink-600 dark:text-pink-400 shrink-0" />
        </div>
        <p className="text-xs font-medium text-gray-600 dark:text-gray-300 truncate">
          <span className="font-bold text-pink-600 dark:text-pink-400 mr-2">NEWS</span>
          週末の記録会の集合時間が変更になりました (14:00 → 13:30)
        </p>
      </div>

      <div className="px-5 space-y-5 mt-5">

        {/* Compact Hero: Today's Training */}
        <section>
          <div className="flex justify-between items-baseline mb-3">
            <h2 className="text-[10px] font-black text-gray-400 tracking-widest uppercase">TODAY'S MAIN</h2>
            <Link href="/schedule" className="text-xs font-bold text-pink-500 hover:text-pink-600 transition-colors">
              週間予定
            </Link>
          </div>

          <Card className="border-0 shadow-xl shadow-pink-500/10 overflow-hidden relative group h-32 rounded-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 z-0"></div>
            {/* Abstract Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl -mr-20 -mt-32"></div>

            <CardContent className="relative z-10 p-5 text-white flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant="secondary" className="bg-white/10 text-white border-0 text-[10px] px-2 h-5 backdrop-blur-md">
                      {todayMenu.type}
                    </Badge>
                    <span className="text-xs text-gray-300 font-medium tracking-wide">{todayMenu.time} <span className="opacity-50 mx-1">/</span> {todayMenu.location}</span>
                  </div>
                  <h3 className="text-xl font-black leading-none tracking-tight">{todayMenu.title}</h3>
                  <p className="text-white/60 font-mono text-xs mt-1">{todayMenu.details}</p>
                </div>
                <Button size="sm" className="h-9 w-9 p-0 rounded-full bg-white text-black hover:bg-gray-200 shadow-lg shadow-white/10" asChild>
                  <Link href="/record">
                    <ChevronRight className="w-5 h-5 ml-0.5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Unified 2x2 Cockpit Grid */}
        <section>
          <h2 className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-3">QUICK ACCESS</h2>
          <div className="grid grid-cols-2 gap-3">

            {/* 1. Condition */}
            <Link href="/condition" className="block group">
              <div className="glass-panel p-4 rounded-2xl relative h-28 flex flex-col justify-between transition-transform transform group-hover:scale-[1.02] duration-300">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-blue-50/80 dark:bg-blue-900/30 rounded-xl text-blue-500">
                    <Activity className="w-5 h-5" />
                  </div>
                  {!conditionStatus.submitted && (
                    <span className="flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-800 dark:text-gray-100">体調チェック</h3>
                  <p className={`text-[10px] font-bold mt-0.5 ${conditionStatus.submitted ? 'text-green-500' : 'text-red-500'}`}>
                    {conditionStatus.submitted ? '提出済' : '未提出'}
                  </p>
                </div>
              </div>
            </Link>

            {/* 2. Nutrition */}
            <Link href="/nutrition" className="block group">
              <div className="glass-panel p-4 rounded-2xl relative h-28 flex flex-col justify-between transition-transform transform group-hover:scale-[1.02] duration-300">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-orange-50/80 dark:bg-orange-900/30 rounded-xl text-orange-500">
                    <Utensils className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-800 dark:text-gray-100">食事管理</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">朝・昼 記録済</p>
                </div>
              </div>
            </Link>

            {/* 3. Analysis */}
            <Link href="/analysis" className="block group">
              <div className="glass-panel p-4 rounded-2xl relative h-28 flex flex-col justify-between overflow-hidden transition-transform transform group-hover:scale-[1.02] duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-full -mr-8 -mt-8"></div>
                <div className="flex justify-between items-start relative z-10">
                  <div className="p-2 bg-indigo-50/80 dark:bg-indigo-900/30 rounded-xl text-indigo-500">
                    <Trophy className="w-5 h-5" />
                  </div>
                </div>
                <div className="relative z-10">
                  <h3 className="font-bold text-sm text-gray-800 dark:text-gray-100">データ分析</h3>
                  <p className="text-[10px] text-indigo-500 font-medium mt-0.5">Performance</p>
                </div>
              </div>
            </Link>

            {/* 4. Video AI */}
            <Link href="/video" className="block group">
              <div className="glass-panel p-4 rounded-2xl relative h-28 flex flex-col justify-between overflow-hidden transition-transform transform group-hover:scale-[1.02] duration-300">
                <div className="absolute top-0 right-0 w-20 h-20 bg-pink-500/5 rounded-full -mr-8 -mt-8"></div>
                <div className="flex justify-between items-start relative z-10">
                  <div className="p-2 bg-pink-50/80 dark:bg-pink-900/30 rounded-xl text-pink-500">
                    <Zap className="w-5 h-5" />
                  </div>
                </div>
                <div className="relative z-10">
                  <h3 className="font-bold text-sm text-gray-800 dark:text-gray-100">AI動画分析</h3>
                  <p className="text-[10px] text-pink-500 font-medium mt-0.5">Form Check</p>
                </div>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
