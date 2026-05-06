"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, MessageSquare, Plus, Loader2, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';

interface Notice {
    id: string;
    title: string;
    content: string;
    author: string;
    date: string; // ISO string from API
    type: string;
}

export default function MessagesPage() {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [newTitle, setNewTitle] = useState("");
    const [newContent, setNewContent] = useState("");
    const [newAuthor, setNewAuthor] = useState("田中コーチ"); // Default
    const [newType, setNewType] = useState("normal");

    const fetchNotices = async () => {
        try {
            const res = await fetch('/api/notices');
            if (res.ok) {
                const data = await res.json();
                setNotices(data);
            }
        } catch (error) {
            console.error("Failed to fetch notices", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/notices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newTitle,
                    content: newContent,
                    author: newAuthor,
                    type: newType,
                }),
            });

            if (res.ok) {
                // Reset form and refresh list
                setNewTitle("");
                setNewContent("");
                setNewType("normal");
                setIsDialogOpen(false);
                fetchNotices();
            } else {
                alert("投稿に失敗しました");
            }
        } catch (error) {
            console.error("Error posting notice:", error);
            alert("エラーが発生しました");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 space-y-6 pb-24">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">連絡・お知らせ</h1>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="bg-pink-600 hover:bg-pink-700 text-white gap-1">
                            <Plus className="w-4 h-4" /> 新規投稿
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>お知らせを投稿</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">タイトル</Label>
                                <Input
                                    id="title"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="例: 集合時間の変更について"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">重要度</Label>
                                <Select value={newType} onValueChange={setNewType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="normal">通常</SelectItem>
                                        <SelectItem value="important">重要</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="author">投稿者名</Label>
                                <Input
                                    id="author"
                                    value={newAuthor}
                                    onChange={(e) => setNewAuthor(e.target.value)}
                                    placeholder="投稿者名"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content">内容</Label>
                                <Textarea
                                    id="content"
                                    value={newContent}
                                    onChange={(e) => setNewContent(e.target.value)}
                                    placeholder="お知らせの内容を入力..."
                                    className="min-h-[100px]"
                                    required
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={isSubmitting} className="w-full bg-pink-600 hover:bg-pink-700">
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                                    投稿する
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 text-pink-500 animate-spin" />
                    </div>
                ) : notices.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                        <p>お知らせはありません</p>
                    </div>
                ) : (
                    notices.map((notice) => (
                        <Card key={notice.id} className={notice.type === "important" ? "border-red-200 bg-red-50" : "bg-white"}>
                            <CardHeader className="pb-2 flex flex-row items-start gap-4 space-y-0">
                                <Avatar>
                                    <AvatarFallback>{notice.author[0]}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-bold text-gray-900">{notice.author}</span>
                                        <span className="text-xs text-gray-500">
                                            {formatDistanceToNow(new Date(notice.date), { addSuffix: true, locale: ja })}
                                        </span>
                                    </div>
                                    <CardTitle className="text-base mt-1">{notice.title}</CardTitle>
                                    {notice.type === "important" && (
                                        <span className="inline-block mt-1 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">重要</span>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                    {notice.content}
                                </p>
                                <div className="mt-3 flex gap-4 text-gray-500">
                                    <button className="flex items-center gap-1 text-xs hover:text-gray-900">
                                        <MessageSquare className="w-4 h-4" /> 返信
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
