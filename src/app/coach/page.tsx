"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge"; // Need to check if badge exists or use span
import { AlertCircle, CheckCircle2, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function CoachDashboard() {
    // Mock player data
    const players = [
        { id: 1, name: "選手 A", status: "ok", fatigue: 2, pain: false, submitted: true },
        { id: 2, name: "選手 B", status: "warning", fatigue: 4, pain: true, submitted: true },
        { id: 3, name: "選手 C", status: "ok", fatigue: 1, pain: false, submitted: true },
        { id: 4, name: "選手 D", status: "danger", fatigue: 5, pain: true, submitted: true },
        { id: 5, name: "選手 E", status: "unknown", fatigue: 0, pain: false, submitted: false },
    ];

    return (
        <div className="space-y-6 pb-20 md:pb-0">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">チーム状況一覧</h2>
                <span className="text-sm text-gray-500">2024年12月4日 (水)</span>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-sm text-gray-500">提出率</span>
                        <span className="text-2xl font-bold text-blue-600">80%</span>
                        <span className="text-xs text-gray-400">4/5人</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-sm text-gray-500">要注意</span>
                        <span className="text-2xl font-bold text-red-600">2名</span>
                        <span className="text-xs text-gray-400">疲労・痛み</span>
                    </CardContent>
                </Card>
            </div>

            {/* Player List */}
            <Card>
                <CardHeader>
                    <CardTitle>選手一覧</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y">
                        {players.map((player) => (
                            <Link
                                key={player.id}
                                href={`/coach/player/${player.id}`}
                                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarFallback>{player.name[3]}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold text-gray-900">{player.name}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            {!player.submitted ? (
                                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" /> 未提出
                                                </span>
                                            ) : (
                                                <>
                                                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                                                        疲労: {player.fatigue}
                                                    </span>
                                                    {player.pain && (
                                                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold">
                                                            痛みあり
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {player.status === "danger" && <AlertCircle className="w-5 h-5 text-red-500" />}
                                    {player.status === "warning" && <AlertCircle className="w-5 h-5 text-orange-500" />}
                                    {player.status === "ok" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                    <ChevronRight className="w-5 h-5 text-gray-300" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
