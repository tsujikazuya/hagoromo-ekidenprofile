"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Phone, Mail, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { WeeklyDistanceChart } from "@/components/charts/WeeklyDistanceChart";
import { ConditionTrendChart } from "@/components/charts/ConditionTrendChart";

export default function PlayerDetailPage() {
    const params = useParams();
    // In a real app, fetch player data based on params.id
    const player = {
        id: params.id as string,
        name: "選手 B",
        grade: "2年",
        status: "warning",
        fatigue: 4,
        pain: "右膝",
    };

    return (
        <div className="space-y-6 pb-20 md:pb-0">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/coach">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{player.name}</h1>
                    <p className="text-sm text-gray-500">学籍番号: 1234568 / {player.grade}</p>
                </div>
            </div>

            {/* Alert Banner if warning */}
            {player.status === "warning" && (
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-bold text-orange-800">コンディション注意</h3>
                        <p className="text-sm text-orange-700">
                            疲労度が高く、右膝に痛みを訴えています。練習メニューの調整を検討してください。
                        </p>
                    </div>
                </div>
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-900">週間走行距離</h3>
                    <WeeklyDistanceChart />
                </div>
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-900">コンディション推移</h3>
                    <ConditionTrendChart />
                </div>
            </div>

            {/* Recent Logs */}
            <div className="space-y-4">
                <h3 className="font-bold text-gray-900">直近の日報</h3>
                <Card>
                    <CardContent className="p-0 divide-y">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="p-4 hover:bg-gray-50">
                                <div className="flex justify-between mb-1">
                                    <span className="font-bold text-gray-900">12/{5 - i} (水)</span>
                                    <span className="text-sm text-gray-500">ポイント練習</span>
                                </div>
                                <p className="text-sm text-gray-700">
                                    設定タイム通り走れたが、後半少しきつかった。右膝に違和感あり。
                                </p>
                                <div className="mt-2 flex gap-3 text-xs text-gray-500">
                                    <span>走行: 12km</span>
                                    <span>疲労: {i + 2}</span>
                                    <span>睡眠: 7h</span>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Contact Actions */}
            <div className="flex gap-4">
                <Button variant="outline" className="flex-1 gap-2">
                    <Phone className="w-4 h-4" /> 電話する
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                    <Mail className="w-4 h-4" /> メッセージ
                </Button>
            </div>
        </div>
    );
}
