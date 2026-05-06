import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Utensils, AlertCircle, ChevronRight, Trophy, Zap, Bell, CheckCircle2, MessageSquare, Clock, MapPin, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { ShareButton } from "@/components/ShareButton";

export default async function Home() {
    // 1. Session Check
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('auth_session');
    
    if (!sessionCookie) {
        redirect('/login');
    }

    let session;
    try {
        session = JSON.parse(sessionCookie.value);
    } catch (e) {
        redirect('/login');
    }

    // 2. Fetch User Data
    const athlete = await prisma.athlete.findUnique({
        where: { id: session.userId },
        include: {
            dailyConditions: {
                orderBy: { date: 'desc' },
                take: 1
            }
        }
    });

    if (!athlete) {
        redirect('/login');
    }

    // 3. Process Data
    const todayText = new Date().toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' });
    const latestCondition = athlete.dailyConditions[0];
    
    let isConditionSubmittedToday = false;
    if (latestCondition) {
        const conditionDateText = new Date(latestCondition.date).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo' });
        if (conditionDateText === todayText) {
            isConditionSubmittedToday = true;
        }
    }

    // 4. Fetch Schedule & Notices
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todaySchedule = await prisma.schedule.findFirst({
        where: {
            date: {
                gte: todayStart,
                lte: todayEnd,
            }
        }
    });

    const notices = await prisma.notice.findMany({
        orderBy: { createdAt: 'desc' },
        take: 3
    });

    const pendingTasks = [];
    if (!isConditionSubmittedToday) {
        pendingTasks.push({ type: 'condition', label: '体調未入力', color: 'text-rose-500', bg: 'bg-rose-100', icon: Activity });
    }


    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-900 pb-32">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl px-5 py-4 flex justify-between items-center border-b border-slate-200/50 shadow-sm">
                <div>
                    <h1 className="text-xl font-black tracking-tight text-slate-800 dark:text-white">
                        Hi, <span className="text-pink-600">{athlete.name}</span> 選手
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">{todayText}</p>
                </div>
                <div className="flex items-center gap-3">
                    <ShareButton />
                    <Link href="/profile">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
                            <span className="text-sm font-bold text-slate-600">{athlete.name[0]}</span>
                        </div>
                    </Link>
                </div>
            </header>

            <main className="px-4 mt-6 space-y-6">
                
                {/* Section 1: Today's Practice (今日の練習) */}
                <section>
                    <h2 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-3">Today's Schedule</h2>
                    <Card className="border-0 shadow-sm overflow-hidden bg-white">
                        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-500" />
                        <CardContent className="p-5">
                            {todaySchedule ? (
                                <>
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-0 text-xs font-bold px-2 py-0.5">
                                                    {todaySchedule.type}
                                                </Badge>
                                            </div>
                                            <h3 className="text-xl font-black text-slate-800">{todaySchedule.title}</h3>
                                        </div>
                                    </div>
                                    
                                    {todaySchedule.description && (
                                        <div className="bg-slate-50 p-3 rounded-lg space-y-2 mb-4 border border-slate-100">
                                            <p className="text-sm font-medium text-slate-700 leading-snug">{todaySchedule.description}</p>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                                        {todaySchedule.time && (
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4 text-blue-500" />
                                                {todaySchedule.time}
                                            </div>
                                        )}
                                        {todaySchedule.location && (
                                            <div className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4 text-emerald-500" />
                                                {todaySchedule.location}
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-sm font-bold text-slate-500">本日の練習予定は登録されていません</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </section>

                {/* Section 2: Messages & Notices */}
                <section>
                    <h2 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-3 flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-blue-500" />
                        指導者からの連絡
                    </h2>
                    <div className="space-y-3">
                        {notices.length > 0 ? notices.map((notice) => (
                            <Link href="#" key={notice.id} className="block">
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-start gap-3 hover:border-blue-200 transition-colors">
                                    <div className={`p-2 rounded-full mt-0.5 ${notice.type === 'important' ? 'bg-rose-100 text-rose-500' : 'bg-slate-100 text-slate-500'}`}>
                                        <Bell className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] font-bold text-slate-400">{notice.author}</span>
                                            <span className="text-[10px] text-slate-400">
                                                {new Date(notice.createdAt).toLocaleDateString('ja-JP')}
                                            </span>
                                        </div>
                                        <p className="text-sm font-bold text-slate-800 leading-snug">{notice.title}</p>
                                    </div>
                                </div>
                            </Link>
                        )) : (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 text-center">
                                <p className="text-sm font-bold text-slate-500">新しい連絡はありません</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Section 3: Pending Tasks (未対応項目) */}
                {pendingTasks.length > 0 && (
                    <section>
                        <h2 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-3 flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4 text-rose-500" />
                            未対応タスク
                        </h2>
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {pendingTasks.map((task, i) => {
                                const Icon = task.icon;
                                return (
                                    <div key={i} className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200/60 shadow-sm bg-white`}>
                                        <div className={`p-1.5 rounded-full ${task.bg} ${task.color}`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <span className={`text-sm font-bold text-slate-700`}>{task.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Section 4: Today's Condition Summary */}
                <section>
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-xs font-bold text-slate-500 tracking-wider uppercase">Condition Summary</h2>
                        <Link href="/condition" className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center">
                            入力・詳細 <ChevronRight className="w-3 h-3 ml-0.5" />
                        </Link>
                    </div>
                    {isConditionSubmittedToday && latestCondition ? (
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 text-center">
                                <p className="text-[10px] text-slate-400 font-bold mb-1">睡眠の質</p>
                                <p className="text-lg font-black text-slate-800">{latestCondition.sleepQuality || '-'}<span className="text-xs text-slate-400 font-normal ml-0.5">/5</span></p>
                            </div>
                            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 text-center">
                                <p className="text-[10px] text-slate-400 font-bold mb-1">主観的疲労</p>
                                <p className={`text-lg font-black ${latestCondition.subjectiveFatigue && latestCondition.subjectiveFatigue > 60 ? 'text-orange-500' : 'text-slate-800'}`}>
                                    {latestCondition.subjectiveFatigue || '-'}
                                </p>
                            </div>
                            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 text-center">
                                <p className="text-[10px] text-slate-400 font-bold mb-1">痛み・違和感</p>
                                <p className="text-sm font-black text-emerald-500 mt-1">なし</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-rose-100 p-6 text-center">
                            <Activity className="w-8 h-8 text-rose-200 mx-auto mb-2" />
                            <p className="text-sm font-bold text-slate-600 mb-3">本日のコンディションが未入力です</p>
                            <Button asChild className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold shadow-sm">
                                <Link href="/condition">今すぐ入力する</Link>
                            </Button>
                        </div>
                    )}
                </section>

                {/* Section 5: Quick Access */}
                <section className="pt-2">
                    <h2 className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-3">Quick Access</h2>
                    <div className="grid grid-cols-2 gap-3">
                        <Link href="/nutrition">
                            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3 active:scale-95 transition-transform">
                                <div className="bg-orange-50 p-2 rounded-lg text-orange-500">
                                    <Utensils className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-bold text-slate-700">食事管理</span>
                            </div>
                        </Link>
                        <Link href="/analysis">
                            <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-center gap-3 active:scale-95 transition-transform">
                                <div className="bg-emerald-50 p-2 rounded-lg text-emerald-500">
                                    <Trophy className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-bold text-slate-700">データ分析</span>
                            </div>
                        </Link>
                    </div>
                </section>

            </main>
        </div>
    );
}
