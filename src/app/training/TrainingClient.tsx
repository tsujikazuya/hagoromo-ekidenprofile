'use client';

import { useState, useTransition } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Tag, AlignLeft, Pencil, Trash2, Dumbbell, UserCog, User, Clock } from "lucide-react";
import { ja } from "date-fns/locale";
import { upsertTrainingMenu, deleteTrainingMenu } from "./actions";
import { useRouter } from "next/navigation";

export interface TrainingMenu {
    id: string;
    date: Date;
    type: string;
    title: string;
    content: string | null;
    time: string | null;
    distance: string | null;
    targetTime: string | null;
    author: string;
}

export function TrainingClient({ 
    initialMenus,
    userRole
}: { 
    initialMenus: TrainingMenu[],
    userRole: string
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    // デモ用にトグル可能にする
    const [isCoach, setIsCoach] = useState(userRole === "coach" || userRole === "staff" || userRole === "manager");

    const [date, setDate] = useState<Date | undefined>(new Date());
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingMenuId, setEditingMenuId] = useState<string | null>(null);

    // Form states
    const [newTitle, setNewTitle] = useState("");
    const [newType, setNewType] = useState<string>("practice");
    const [newTime, setNewTime] = useState("");
    const [newContent, setNewContent] = useState("");
    const [newDistance, setNewDistance] = useState("");
    const [newTargetTime, setNewTargetTime] = useState("");

    const resetForm = () => {
        setEditingMenuId(null);
        setNewTitle("");
        setNewType("practice");
        setNewTime("");
        setNewContent("");
        setNewDistance("");
        setNewTargetTime("");
    };

    const handleEditMenu = (menu: TrainingMenu) => {
        setEditingMenuId(menu.id);
        setNewTitle(menu.title);
        setNewType(menu.type);
        setNewTime(menu.time || "");
        setNewContent(menu.content || "");
        setNewDistance(menu.distance || "");
        setNewTargetTime(menu.targetTime || "");
        setIsDialogOpen(true);
    };

    const handleSaveMenu = (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !newTitle) return;

        startTransition(async () => {
            const data = {
                id: editingMenuId || undefined,
                date: new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())),
                title: newTitle,
                type: newType,
                time: newTime || undefined,
                content: newContent || undefined,
                distance: newDistance || undefined,
                targetTime: newTargetTime || undefined,
            };

            const res = await upsertTrainingMenu(data);
            if (res.success) {
                setIsDialogOpen(false);
                resetForm();
                router.refresh();
            } else {
                alert("保存に失敗しました: " + res.error);
            }
        });
    };

    const handleDeleteMenu = () => {
        if (!editingMenuId) return;
        if (window.confirm("このメニューを削除しますか？")) {
            startTransition(async () => {
                const res = await deleteTrainingMenu(editingMenuId);
                if (res.success) {
                    setIsDialogOpen(false);
                    resetForm();
                    router.refresh();
                } else {
                    alert("削除に失敗しました: " + res.error);
                }
            });
        }
    };

    const getMenusForDate = (date: Date | undefined) => {
        if (!date) return [];
        return initialMenus.filter(menu => {
            const mDate = new Date(menu.date);
            return mDate.getDate() === date.getDate() &&
                   mDate.getMonth() === date.getMonth() &&
                   mDate.getFullYear() === date.getFullYear()
        });
    };

    const selectedDateMenus = getMenusForDate(date);

    return (
        <div className="p-4 space-y-6 pb-24 max-w-2xl mx-auto">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                        <Dumbbell className="w-6 h-6 text-pink-600" />
                        トレーニング内容
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">日々の練習メニューを確認・管理します</p>
                </div>
                
                {/* 権限切り替えモックアップ（デモ用） */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCoach(!isCoach)}
                    className={`gap-1 text-xs border-2 ${isCoach ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'}`}
                >
                    {isCoach ? <UserCog className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    {isCoach ? "指導者モード" : "選手モード"}
                </Button>
            </header>

            <div className="grid md:grid-cols-[auto_1fr] gap-6">
                <div>
                    <Card className="border-none shadow-sm bg-white/50 backdrop-blur inline-block w-full">
                        <CardContent className="p-2">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border-0 bg-transparent mx-auto"
                                locale={ja}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                            <span className="w-1 h-6 bg-pink-600 rounded-full"></span>
                            {date?.toLocaleDateString("ja-JP", { month: "long", day: "numeric", weekday: "short" })}
                        </h2>
                        
                        {isCoach && (
                            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                                setIsDialogOpen(open);
                                if (!open) resetForm();
                            }}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="bg-pink-600 hover:bg-pink-700 text-white gap-1 rounded-full px-4 shadow-lg shadow-pink-500/20">
                                        <Plus className="w-4 h-4" /> メニュー追加
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <form onSubmit={handleSaveMenu}>
                                        <DialogHeader>
                                            <DialogTitle>{editingMenuId ? "メニューを編集" : "メニューを追加"}</DialogTitle>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="title">タイトル <span className="text-red-500">*</span></Label>
                                                <Input id="title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required placeholder="例: ペース走、インターバル" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="time">実施時間</Label>
                                                    <Input id="time" type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="type">トレーニング種別</Label>
                                                    <Select value={newType} onValueChange={setNewType}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="practice">通常練習</SelectItem>
                                                            <SelectItem value="lsd">LSD</SelectItem>
                                                            <SelectItem value="jog">ジョグ</SelectItem>
                                                            <SelectItem value="pace">ペース走</SelectItem>
                                                            <SelectItem value="interval">インターバル</SelectItem>
                                                            <SelectItem value="buildup">ビルドアップ</SelectItem>
                                                            <SelectItem value="recovery">回復系</SelectItem>
                                                            <SelectItem value="other">その他</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="content">詳細・メニュー内容</Label>
                                                <Textarea id="content" value={newContent} onChange={(e) => setNewContent(e.target.value)} className="min-h-[100px]" placeholder="アップ 20分, 本メニュー, ダウン" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="grid gap-2">
                                                    <Label htmlFor="distance">距離設定</Label>
                                                    <Input id="distance" value={newDistance} onChange={(e) => setNewDistance(e.target.value)} placeholder="例: 10km, 400m×10" />
                                                </div>
                                                <div className="grid gap-2">
                                                    <Label htmlFor="targetTime">設定ペース/タイム</Label>
                                                    <Input id="targetTime" value={newTargetTime} onChange={(e) => setNewTargetTime(e.target.value)} placeholder="例: 3:30/km, 72秒" />
                                                </div>
                                            </div>
                                        </div>
                                        <DialogFooter className="sm:justify-between items-center flex-row">
                                            {editingMenuId ? (
                                                <Button type="button" variant="destructive" size="icon" onClick={handleDeleteMenu} disabled={isPending}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            ) : <div></div>}
                                            <Button type="submit" disabled={isPending || !newTitle} className="bg-pink-600 hover:bg-pink-700 text-white min-w-[120px]">
                                                {isPending ? "保存中..." : (editingMenuId ? "更新する" : "追加する")}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>

                    <div className="space-y-4">
                        {selectedDateMenus.length > 0 ? (
                            selectedDateMenus.map((menu) => (
                                <Card key={menu.id} className="border-l-4 border-l-pink-600 shadow-sm transition-all hover:shadow-md bg-white">
                                    <CardHeader className="py-3 px-4">
                                        <div className="flex justify-between items-center mb-1">
                                            <Badge variant="secondary" className="bg-pink-50 text-pink-600 hover:bg-pink-100">
                                                {menu.type === 'interval' ? 'インターバル' : 
                                                 menu.type === 'pace' ? 'ペース走' : 
                                                 menu.type === 'lsd' ? 'LSD' : 
                                                 menu.type === 'recovery' ? '回復' : '練習'}
                                            </Badge>
                                            
                                            {isCoach && (
                                                <div className="flex gap-1">
                                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600" onClick={() => handleEditMenu(menu)}>
                                                        <Pencil className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                        <CardTitle className="text-lg font-bold text-gray-800">
                                            {menu.title}
                                        </CardTitle>
                                    </CardHeader>
                                    
                                    <CardContent className="pb-4 px-4 space-y-3">
                                        {(menu.time || menu.distance || menu.targetTime) && (
                                            <div className="p-3 bg-pink-50/50 rounded-lg border border-pink-100/50 flex flex-wrap gap-4 text-sm">
                                                {menu.time && (
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-pink-600" />
                                                        <span className="font-bold text-gray-700">開始時間:</span>
                                                        <span className="font-mono text-pink-700">{menu.time}</span>
                                                    </div>
                                                )}
                                                {menu.distance && (
                                                    <div className="flex items-center gap-2">
                                                        <Tag className="w-4 h-4 text-pink-600" />
                                                        <span className="font-bold text-gray-700">設定距離:</span>
                                                        <span className="font-mono text-pink-700">{menu.distance}</span>
                                                    </div>
                                                )}
                                                {menu.targetTime && (
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-pink-600" />
                                                        <span className="font-bold text-gray-700">設定ペース:</span>
                                                        <span className="font-mono text-pink-700">{menu.targetTime}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        
                                        {menu.content && (
                                            <div className="p-3 bg-gray-50 rounded-lg whitespace-pre-wrap text-gray-700 text-sm leading-relaxed border border-gray-100">
                                                <div className="flex items-center gap-2 mb-2 text-xs text-gray-400 font-bold uppercase border-b border-gray-200 pb-1">
                                                    <AlignLeft className="w-3 h-3" /> メニュー詳細
                                                </div>
                                                {menu.content}
                                            </div>
                                        )}
                                        
                                        <div className="text-right mt-2">
                                            <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                                作成者: {menu.author}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <Dumbbell className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                                <p className="text-sm font-medium">この日のトレーニングメニューはありません</p>
                                {isCoach ? (
                                    <p className="text-xs mt-1">「メニュー追加」ボタンから登録してください</p>
                                ) : (
                                    <p className="text-xs mt-1">指導者からのメニュー登録をお待ちください</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
