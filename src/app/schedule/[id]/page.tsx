"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Clock, MapPin, Tag, MessageCircle, Send, User } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

// Mock Data (In a real app, fetch from API/DB)
const MOCK_TRAINING_DATA = {
    id: "1",
    date: new Date(),
    title: "ポイント練習",
    type: "Interval",
    time: "16:30 - 19:00",
    location: "大学グラウンド",
    description: "400m x 10 (r: 200m/90s)\nラスト1本Free",
    targetTime: "76-78秒",
    lapTime: "38-39秒(200m)",
    distance: "12.0km",
    duration: "120分",
    rpe: 8,
    weather: "晴れ",
    temp: "15℃",
    feedback: "設定タイム通り走れた。後半少し動きが硬くなった。",
    comments: [
        {
            id: "c1",
            author: "高橋コーチ",
            content: "後半の動きについては、腕振りが少し横に流れていたので、次回意識してみましょう。タイムは素晴らしいです。",
            date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            isCoach: true
        },
        {
            id: "c2",
            author: "選手A",
            content: "ありがとうございます。次回は脇を締める意識で取り組みます。",
            date: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
            isCoach: false
        }
    ]
};

export default function TrainingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [comment, setComment] = useState("");
    // In a real app, use the ID to fetch data
    // const { id } = params; 
    const data = MOCK_TRAINING_DATA;

    const handlePostComment = () => {
        if (!comment.trim()) return;
        // Mock post comment
        console.log("Posting comment:", comment);
        // Add to local state (mock)
        data.comments.push({
            id: `c${Date.now()}`,
            author: "現在のユーザー", // Should get from auth
            content: comment,
            date: new Date(),
            isCoach: false // Or true based on user role
        });
        setComment("");
    };

    return (
        <div className="p-4 space-y-6 pb-24 max-w-2xl mx-auto">
            <header className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/schedule">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                </Button>
                <h1 className="text-xl font-bold">トレーニング詳細</h1>
            </header>

            {/* Training Summary Card */}
            <Card className="border-l-4 border-l-pink-600 shadow-sm">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Badge variant="secondary" className="bg-pink-50 text-pink-600">
                                    {data.type}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                    {format(data.date, "yyyy/MM/dd (E)", { locale: ja })}
                                </span>
                            </div>
                            <CardTitle className="text-xl font-bold">{data.title}</CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4" /> {data.time}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" /> {data.location}
                        </div>
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg whitespace-pre-wrap text-gray-700 leading-relaxed border border-gray-100">
                        {data.description}
                    </div>

                    {(data.targetTime || data.lapTime) && (
                        <div className="p-3 bg-pink-50 rounded-lg border border-pink-100 space-y-2">
                            {data.targetTime && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Tag className="w-4 h-4 text-pink-600" />
                                    <span className="font-bold text-gray-700">設定:</span>
                                    <span className="font-mono text-pink-700">{data.targetTime}</span>
                                </div>
                            )}
                            {data.lapTime && (
                                <div className="flex items-center gap-2 text-sm">
                                    <Tag className="w-4 h-4 text-pink-600" />
                                    <span className="font-bold text-gray-700">ラップ:</span>
                                    <span className="font-mono text-pink-700">{data.lapTime}</span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 mt-2">
                        <div className="text-center">
                            <p className="text-xs text-gray-400">距離</p>
                            <p className="font-bold text-lg">{data.distance}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-400">時間</p>
                            <p className="font-bold text-lg">{data.duration}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-gray-400">RPE</p>
                            <p className="font-bold text-lg text-pink-600">{data.rpe}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Player Feedback Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <User className="w-5 h-5 text-gray-600" /> 選手の感想・振り返り
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-4 bg-gray-50 rounded-lg text-gray-800 whitespace-pre-wrap leading-relaxed">
                        {data.feedback}
                    </div>
                </CardContent>
            </Card>

            {/* Comments Section */}
            <div className="space-y-4">
                <h2 className="font-bold text-lg flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-blue-600" /> コメント ({data.comments.length})
                </h2>

                <div className="space-y-3">
                    {data.comments.map((comment) => (
                        <div key={comment.id} className={`flex gap-3 ${comment.isCoach ? 'flex-row-reverse' : ''}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${comment.isCoach ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'}`}>
                                <User className="w-4 h-4" />
                            </div>
                            <div className={`max-w-[80%] rounded-2xl p-3 ${comment.isCoach
                                    ? 'bg-blue-50 text-blue-900 rounded-tr-none'
                                    : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                                }`}>
                                <div className="flex justify-between items-baseline gap-4 mb-1">
                                    <span className="text-xs font-bold">{comment.author}</span>
                                    <span className="text-[10px] text-gray-400">
                                        {format(comment.date, "MM/dd HH:mm")}
                                    </span>
                                </div>
                                <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Comment Input */}
                <div className="flex gap-2 items-end pt-4 bg-white sticky bottom-0 p-2 border-t border-gray-100">
                    <Textarea
                        placeholder="コメントを入力..."
                        className="min-h-[80px]"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <Button
                        size="icon"
                        className="h-10 w-10 bg-blue-600 hover:bg-blue-700 rounded-full shrink-0 mb-1"
                        onClick={handlePostComment}
                        disabled={!comment.trim()}
                    >
                        <Send className="w-4 h-4 text-white" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
