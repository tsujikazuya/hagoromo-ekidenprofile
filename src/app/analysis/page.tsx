"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, Activity, Trophy } from "lucide-react";
import Link from "next/link";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function AnalysisPage() {
    // Mock Data for Heart Rate Zones
    const hrZoneData = [
        { name: "Zone 1", value: 15, fill: "#e0e7ff" }, // Recovery
        { name: "Zone 2", value: 35, fill: "#bfdbfe" }, // Aerobic
        { name: "Zone 3", value: 30, fill: "#93c5fd" }, // Tempo
        { name: "Zone 4", value: 15, fill: "#60a5fa" }, // Threshold
        { name: "Zone 5", value: 5, fill: "#3b82f6" },  // Anaerobic
    ];

    // Mock Data for ACWR (Acute:Chronic Workload Ratio)
    const acwrData = [
        { day: "11/28", acute: 800, chronic: 750, ratio: 1.06 },
        { day: "11/29", acute: 850, chronic: 760, ratio: 1.11 },
        { day: "11/30", acute: 600, chronic: 750, ratio: 0.8 },
        { day: "12/1", acute: 1200, chronic: 780, ratio: 1.53 }, // Spike
        { day: "12/2", acute: 0, chronic: 720, ratio: 0 },
        { day: "12/3", acute: 900, chronic: 740, ratio: 1.21 },
        { day: "12/4", acute: 1000, chronic: 760, ratio: 1.31 },
    ];

    // Mock Personal Records
    const records = [
        { distance: "1500m", time: "4:30.5", date: "2024/10/15" },
        { distance: "3000m", time: "9:45.2", date: "2024/11/03" },
        { distance: "5000m", time: "16:20.8", date: "2024/09/20" },
    ];

    return (
        <div className="p-4 space-y-6 pb-24">
            <header className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                </Button>
                <h1 className="text-xl font-bold">データ分析</h1>
            </header>

            {/* Heart Rate Zones */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Activity className="w-5 h-5 text-blue-600" /> 心拍ゾーン分析 (週間)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={hrZoneData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={50} tick={{ fontSize: 10 }} />
                                <Tooltip />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                        Zone 2 (有酸素) の割合が最も高く、良好なベース作りができています。
                    </p>
                </CardContent>
            </Card>

            {/* ACWR */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" /> 負荷管理 (ACWR)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={acwrData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" tick={{ fontSize: 10 }} />
                                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tick={{ fontSize: 10 }} domain={[0, 2]} />
                                <Tooltip />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="acute" stroke="#8884d8" name="急性負荷" dot={false} />
                                <Line yAxisId="left" type="monotone" dataKey="chronic" stroke="#82ca9d" name="慢性負荷" dot={false} />
                                <Line yAxisId="right" type="monotone" dataKey="ratio" stroke="#ff7300" name="ACWR" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-2 p-2 bg-yellow-50 rounded text-xs text-yellow-800">
                        <span className="font-bold">注意:</span> 12/1 に急激な負荷上昇 (1.53) が見られます。怪我のリスクが高まるため、翌日は調整練習としました。
                    </div>
                </CardContent>
            </Card>

            {/* Personal Records */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-yellow-500" /> 自己ベスト
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {records.map((record) => (
                            <div key={record.distance} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="font-bold text-gray-700">{record.distance}</span>
                                <div className="text-right">
                                    <div className="font-bold text-xl text-gray-900">{record.time}</div>
                                    <div className="text-xs text-gray-400">{record.date}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
