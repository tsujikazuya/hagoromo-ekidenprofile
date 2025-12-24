"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, MessageSquare } from "lucide-react";

export default function MessagesPage() {
    const notices = [
        {
            id: 1,
            author: "田中コーチ",
            title: "週末の記録会の集合時間について",
            content: "今週末の記録会ですが、集合時間を変更します。8:00 → 7:30 に現地集合でお願いします。",
            date: "2時間前",
            type: "important",
        },
        {
            id: 2,
            author: "鈴木マネージャー",
            title: "合宿費の集金について",
            content: "来月の合宿費ですが、今週金曜日までに提出をお願いします。",
            date: "昨日",
            type: "normal",
        },
    ];

    return (
        <div className="p-4 space-y-6 pb-24">
            <h1 className="text-xl font-bold">連絡・お知らせ</h1>

            <div className="space-y-4">
                {notices.map((notice) => (
                    <Card key={notice.id} className={notice.type === "important" ? "border-red-200 bg-red-50" : ""}>
                        <CardHeader className="pb-2 flex flex-row items-start gap-4 space-y-0">
                            <Avatar>
                                <AvatarFallback>{notice.author[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <span className="text-sm font-bold text-gray-900">{notice.author}</span>
                                    <span className="text-xs text-gray-500">{notice.date}</span>
                                </div>
                                <CardTitle className="text-base mt-1">{notice.title}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {notice.content}
                            </p>
                            <div className="mt-3 flex gap-4 text-gray-500">
                                <button className="flex items-center gap-1 text-xs hover:text-gray-900">
                                    <MessageSquare className="w-4 h-4" /> 返信
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
