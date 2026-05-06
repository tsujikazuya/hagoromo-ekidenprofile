"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AlertCircle, CheckCircle2, ChevronRight, Users, AlertTriangle, FileText } from "lucide-react";
import Link from "next/link";
import { StaffInputMockup } from '@/components/research/StaffInputMockup';

interface AthleteData {
    id: string;
    name: string;
    status: 'ok' | 'warning' | 'danger' | 'unknown';
    fatigue: number;
    submitted: boolean;
    latestCondition: any;
    latestBloodTest: any;
}

interface DashboardData {
    teamStatus: {
        total: number;
        submittedToday: number;
        warnings: number;
    };
    athletes: AthleteData[];
}

export default function StaffDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/staff/dashboard')
            .then(res => res.json())
            .then(d => {
                setData(d);
                setLoading(false);
            })
            .catch(e => {
                console.error(e);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">読み込み中...</div>;
    }

    if (!data) {
        return <div className="p-8 text-center text-red-500">データの取得に失敗しました。</div>;
    }

    const { teamStatus, athletes } = data;

    // Filter athletes by status for the alert section
    const alertAthletes = athletes.filter(a => a.status === 'danger' || a.status === 'warning');

    return (
        <div className="container mx-auto p-4 md:p-6 space-y-8 bg-slate-50 min-h-screen pb-24">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-800">専門スタッフ・指導者用ダッシュボード</h1>
                    <p className="text-sm text-slate-500 mt-1">チーム状況の俯瞰および専門データの入力・管理</p>
                </div>
            </div>

            {/* Quick Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-l-4 border-blue-500 shadow-sm">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">コンディション提出率</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-slate-800">{teamStatus.submittedToday}</span>
                                <span className="text-sm text-slate-500">/ {teamStatus.total} 名</span>
                            </div>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                            <FileText className="w-6 h-6" />
                        </div>
                    </CardContent>
                </Card>
                
                <Card className="border-l-4 border-rose-500 shadow-sm">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">要注意アラート</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-rose-600">{teamStatus.warnings}</span>
                                <span className="text-sm text-slate-500">名</span>
                            </div>
                        </div>
                        <div className="bg-rose-100 p-3 rounded-full text-rose-600">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-emerald-500 shadow-sm">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">登録選手数</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold text-slate-800">{teamStatus.total}</span>
                                <span className="text-sm text-slate-500">名</span>
                            </div>
                        </div>
                        <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
                            <Users className="w-6 h-6" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Alerts & Player List */}
                <div className="lg:col-span-5 space-y-6">
                    {/* Alerts Section */}
                    {alertAthletes.length > 0 && (
                        <Card className="border-rose-200 shadow-sm">
                            <CardHeader className="bg-rose-50 border-b border-rose-100 pb-4">
                                <CardTitle className="text-rose-800 flex items-center gap-2 text-lg">
                                    <AlertCircle className="w-5 h-5" />
                                    要注意選手 ({alertAthletes.length}名)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-rose-100">
                                    {alertAthletes.map(player => (
                                        <Link key={player.id} href={`/staff/player/${player.id}`} className="block">
                                            <div className="p-4 flex items-center justify-between bg-white hover:bg-rose-50/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 border border-rose-200">
                                                    <AvatarFallback className="bg-rose-100 text-rose-700 font-medium">
                                                        {player.name.substring(0, 1) || "A"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm">{player.name}</p>
                                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                        {player.fatigue > 60 && (
                                                            <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                                                                高疲労 ({player.fatigue}/100)
                                                            </span>
                                                        )}
                                                        {player.latestBloodTest && player.latestBloodTest.ferritin < 30 && (
                                                            <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                                                                低フェリチン ({player.latestBloodTest.ferritin})
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                                <ChevronRight className="w-4 h-4 text-slate-300" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* All Players List */}
                    <Card className="shadow-sm">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg text-slate-800">チーム状況一覧</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
                                {athletes.map((player) => (
                                    <Link key={player.id} href={`/staff/player/${player.id}`} className="block">
                                        <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarFallback className="bg-slate-200 text-slate-600 text-sm">
                                                    {player.name.substring(0, 1) || "A"}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium text-slate-900 text-sm">{player.name}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    {!player.submitted ? (
                                                        <span className="text-[10px] text-slate-400">未提出</span>
                                                    ) : (
                                                        <span className="text-[10px] text-slate-500">
                                                            疲労: {player.fatigue}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            {player.status === "danger" && <AlertCircle className="w-4 h-4 text-red-500" />}
                                            {player.status === "warning" && <AlertCircle className="w-4 h-4 text-orange-500" />}
                                            {player.status === "ok" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                            {player.status === "unknown" && <div className="w-4 h-4 rounded-full border-2 border-slate-200" />}
                                        </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Data Entry */}
                <div className="lg:col-span-7">
                    <div className="sticky top-6">
                        <StaffInputMockup />
                    </div>
                </div>

            </div>
        </div>
    );
}
