"use client";

import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
    { day: "11/28", fatigue: 3, sleep: 7 },
    { day: "11/29", fatigue: 4, sleep: 6 },
    { day: "11/30", fatigue: 2, sleep: 8 },
    { day: "12/1", fatigue: 5, sleep: 5 },
    { day: "12/2", fatigue: 3, sleep: 7 },
    { day: "12/3", fatigue: 2, sleep: 7.5 },
    { day: "12/4", fatigue: 3, sleep: 7 },
];

export function ConditionTrendChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">コンディション推移</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="day"
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 10 }}
                            />
                            <YAxis
                                yAxisId="left"
                                domain={[1, 5]}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12 }}
                                label={{ value: '疲労度', angle: -90, position: 'insideLeft', fontSize: 10 }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                domain={[0, 10]}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12 }}
                                label={{ value: '睡眠(h)', angle: 90, position: 'insideRight', fontSize: 10 }}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="fatigue"
                                name="疲労度"
                                stroke="#f97316"
                                strokeWidth={2}
                                dot={{ r: 4, fill: '#f97316' }}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="sleep"
                                name="睡眠時間"
                                stroke="#6366f1"
                                strokeWidth={2}
                                dot={{ r: 4, fill: '#6366f1' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
