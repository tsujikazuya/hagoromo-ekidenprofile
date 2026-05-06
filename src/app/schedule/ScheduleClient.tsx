"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Clock, Plus, Tag, AlignLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { ja } from "date-fns/locale";
import { upsertSchedule, deleteSchedule } from "./actions";

// DBから取得するEvent型
export interface ScheduleEvent {
    id: string;
    date: Date;
    title: string;
    type: string;
    time: string | null;
    location: string | null;
    description: string | null;
    targetTime: string | null;
    lapTime: string | null;
    isCompleted: boolean;
}

export function ScheduleClient({ 
    initialEvents, 
    isCoach 
}: { 
    initialEvents: ScheduleEvent[], 
    isCoach: boolean 
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [date, setDate] = useState<Date | undefined>(new Date());
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingEventId, setEditingEventId] = useState<string | null>(null);

    // Form states
    const [newTitle, setNewTitle] = useState("");
    const [newTime, setNewTime] = useState("");
    const [newLocation, setNewLocation] = useState("");
    const [newType, setNewType] = useState<string>("practice");
    const [newDescription, setNewDescription] = useState("");
    const [newTargetTime, setNewTargetTime] = useState("");
    const [newLapTime, setNewLapTime] = useState("");
    const [newIsCompleted, setNewIsCompleted] = useState(false);

    const resetForm = () => {
        setEditingEventId(null);
        setNewTitle("");
        setNewTime("");
        setNewLocation("");
        setNewType("practice");
        setNewDescription("");
        setNewTargetTime("");
        setNewLapTime("");
        setNewIsCompleted(false);
    };

    const handleEditEvent = (event: ScheduleEvent) => {
        setEditingEventId(event.id);
        setNewTitle(event.title);
        setNewTime(event.time || "");
        setNewLocation(event.location || "");
        setNewType(event.type);
        setNewDescription(event.description || "");
        setNewTargetTime(event.targetTime || "");
        setNewLapTime(event.lapTime || "");
        setNewIsCompleted(event.isCompleted);
        setIsDialogOpen(true);
    };

    const handleSaveEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!date || !newTitle) return;

        startTransition(async () => {
            const data = {
                id: editingEventId || undefined,
                date: new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())), // 日付ズレ防止のためUTC等で揃えるか、ローカルのまま送る
                title: newTitle,
                type: newType,
                time: newTime || undefined,
                location: newLocation || undefined,
                description: newDescription || undefined,
                targetTime: newTargetTime || undefined,
                lapTime: newLapTime || undefined,
                isCompleted: newIsCompleted
            };

            const res = await upsertSchedule(data);
            if (res.success) {
                setIsDialogOpen(false);
                resetForm();
                router.refresh();
            } else {
                alert("保存に失敗しました: " + res.error);
            }
        });
    };

    const handleDeleteEvent = () => {
        if (!editingEventId) return;
        if (window.confirm("この予定を削除しますか？")) {
            startTransition(async () => {
                const res = await deleteSchedule(editingEventId);
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

    const getEventsForDate = (date: Date | undefined) => {
        if (!date) return [];
        return initialEvents.filter(event => {
            const eDate = new Date(event.date);
            return eDate.getDate() === date.getDate() &&
                   eDate.getMonth() === date.getMonth() &&
                   eDate.getFullYear() === date.getFullYear()
        });
    };

    const selectedDateEvents = getEventsForDate(date);

    return (
        <div className="p-4 space-y-6 pb-24 max-w-md mx-auto">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold">スケジュール</h1>
                
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="bg-pink-600 hover:bg-pink-700 text-white gap-1 rounded-full px-4 shadow-lg shadow-pink-500/20">
                            <Plus className="w-4 h-4" /> 予定追加
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                            <form onSubmit={handleSaveEvent}>
                                <DialogHeader>
                                    <DialogTitle>{editingEventId ? "予定・練習を編集" : "予定・練習を追加"}</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="title">タイトル <span className="text-red-500">*</span></Label>
                                        <Input id="title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required placeholder="例: ポイント練習、記録会" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="time">時間</Label>
                                            <Input id="time" type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="type">種類</Label>
                                            <Select value={newType} onValueChange={setNewType}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="practice">練習</SelectItem>
                                                    <SelectItem value="race">試合</SelectItem>
                                                    <SelectItem value="other">その他</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="location">場所</Label>
                                        <Input id="location" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="description">詳細・メニュー</Label>
                                        <Textarea id="description" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className="min-h-[100px]" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="targetTime">設定タイム</Label>
                                            <Input id="targetTime" value={newTargetTime} onChange={(e) => setNewTargetTime(e.target.value)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="lapTime">ラップ設定</Label>
                                            <Input id="lapTime" value={newLapTime} onChange={(e) => setNewLapTime(e.target.value)} />
                                        </div>
                                    </div>
                                    {editingEventId && (
                                        <div className="flex items-center gap-2 mt-2">
                                            <input type="checkbox" id="completed" checked={newIsCompleted} onChange={(e) => setNewIsCompleted(e.target.checked)} className="rounded text-pink-600 focus:ring-pink-500" />
                                            <Label htmlFor="completed" className="text-sm font-medium">この予定を完了にする</Label>
                                        </div>
                                    )}
                                </div>
                                <DialogFooter className="sm:justify-between items-center flex-row">
                                    {editingEventId ? (
                                        <Button type="button" variant="destructive" size="icon" onClick={handleDeleteEvent} disabled={isPending}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    ) : <div></div>}
                                    <Button type="submit" disabled={isPending || !newTitle} className="bg-pink-600 hover:bg-pink-700 text-white min-w-[120px]">
                                        {isPending ? "保存中..." : (editingEventId ? "更新する" : "追加する")}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
            </div>

            <Card className="border-none shadow-sm bg-white/50 backdrop-blur">
                <CardContent className="p-0">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border bg-white mx-auto"
                        locale={ja}
                    />
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    <span className="w-1 h-6 bg-pink-600 rounded-full"></span>
                    {date?.toLocaleDateString("ja-JP", { month: "long", day: "numeric", weekday: "short" })}
                    <span className="text-sm font-normal text-gray-400 ml-auto">{selectedDateEvents.length}件の予定</span>
                </h2>

                <div className="space-y-3">
                    {selectedDateEvents.length > 0 ? (
                        selectedDateEvents.map((event) => (
                            <Card key={event.id} className={`border-l-4 shadow-sm transition-all hover:shadow-md ${event.type === 'practice' ? 'border-l-pink-600' :
                                event.type === 'race' ? 'border-l-blue-600' : 'border-l-gray-400'
                                } ${event.isCompleted ? 'bg-gray-50 opacity-80' : 'bg-white'}`}>
                                <CardHeader className="py-3 px-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className={`${event.type === 'practice' ? 'bg-pink-50 text-pink-600 hover:bg-pink-100' :
                                                event.type === 'race' ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}>
                                                {event.type === 'practice' ? '練習' : event.type === 'race' ? '試合' : 'その他'}
                                            </Badge>
                                            {event.isCompleted && (
                                                <Badge className="bg-green-100 text-green-700 border-green-200 flex gap-1 items-center px-2 py-0.5">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> 完了
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-400 font-mono">
                                                {event.time}
                                            </span>
                                            <div className="flex gap-1">
                                                <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600" onClick={() => handleEditEvent(event)}>
                                                    <Pencil className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <CardTitle className={`text-base font-bold ${event.isCompleted ? 'text-gray-500 line-through decoration-gray-300' : 'text-gray-800'}`}>
                                        {event.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pb-3 px-4 text-sm text-gray-500 space-y-2">
                                    {event.location && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5 shrink-0" /> {event.location}
                                        </div>
                                    )}
                                    {event.description && (
                                        <div className="mt-2 p-3 bg-gray-50 rounded-lg whitespace-pre-wrap text-gray-700 leading-relaxed border border-gray-100">
                                            <div className="flex items-center gap-2 mb-1 text-xs text-gray-400 font-bold uppercase">
                                                <AlignLeft className="w-3 h-3" /> Menu / Note
                                            </div>
                                            {event.description}
                                        </div>
                                    )}
                                    {(event.targetTime || event.lapTime) && (
                                        <div className="mt-2 p-2 bg-pink-50 rounded-lg border border-pink-100 flex flex-wrap gap-4 text-sm">
                                            {event.targetTime && (
                                                <div className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-pink-600" />
                                                    <span className="font-bold text-gray-700">設定:</span>
                                                    <span className="font-mono text-pink-700">{event.targetTime}</span>
                                                </div>
                                            )}
                                            {event.lapTime && (
                                                <div className="flex items-center gap-2">
                                                    <Tag className="w-4 h-4 text-pink-600" />
                                                    <span className="font-bold text-gray-700">ラップ:</span>
                                                    <span className="font-mono text-pink-700">{event.lapTime}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-sm">予定はありません</p>
                            {isCoach && <p className="text-xs mt-1">「予定追加」ボタンから登録できます</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
