"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CoachMenusPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [date, setDate] = useState("");
    const [menuType, setMenuType] = useState("");
    const [details, setDetails] = useState("");

    const handleSubmit = () => {
        // Mock submission
        console.log("Submitted:", { date, menuType, details });
        setIsOpen(false);
        setDate("");
        setMenuType("");
        setDetails("");
        alert("練習メニューを作成しました（モック）");
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">メニュー作成</h2>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4" /> 新規作成
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>練習メニューの作成</DialogTitle>
                            <DialogDescription>
                                選手に配信するトレーニングメニューを作成します。
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="date">日付</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>練習タイプ</Label>
                                <Select onValueChange={setMenuType} value={menuType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="選択してください" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="jog">ジョグ</SelectItem>
                                        <SelectItem value="interval">インターバル</SelectItem>
                                        <SelectItem value="pace">ペース走</SelectItem>
                                        <SelectItem value="distance">距離走</SelectItem>
                                        <SelectItem value="rest">休養</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="details">メニュー詳細</Label>
                                <Textarea
                                    id="details"
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    placeholder="例: 400m × 10 (r: 200m jog) 設定: 76-78秒"
                                    className="h-32"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={handleSubmit}>作成する</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="bg-gray-50 border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <p>作成済みのメニューはありません</p>
                    <p className="text-sm mt-2">「新規作成」ボタンから練習メニューを作成してください</p>
                </CardContent>
            </Card>
        </div>
    );
}
