"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CoachNoticesPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const handleSubmit = () => {
        // Mock submission
        console.log("Submitted:", { title, content });
        setIsOpen(false);
        setTitle("");
        setContent("");
        alert("お知らせを投稿しました（モック）");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">お知らせ管理</h2>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4" /> 新規投稿
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>お知らせの投稿</DialogTitle>
                            <DialogDescription>
                                チーム全体に通知されます。
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">タイトル</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="例: 週末の集合時間について"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="content">本文</Label>
                                <Textarea
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="詳細を入力してください"
                                    className="h-32"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={handleSubmit}>投稿する</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">週末の記録会の集合時間について</CardTitle>
                        <p className="text-sm text-gray-500">2時間前 • 田中コーチ</p>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-gray-700">
                            今週末の記録会ですが、集合時間を変更します。8:00 → 7:30 に現地集合でお願いします。
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
