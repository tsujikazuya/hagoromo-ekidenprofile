"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";  // Import Textarea
import { MapPin, Clock, Plus, Tag, AlignLeft, Pencil } from "lucide-react";
import { ja } from "date-fns/locale";

type EventType = "practice" | "race" | "other";

interface Event {
    id: number;
    date: Date;
    title: string;
    type: EventType;
    time: string;
    location: string;
    description?: string;
    targetTime?: string;
    lapTime?: string;
    isCompleted?: boolean;
}

export default function SchedulePage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [events, setEvents] = useState<Event[]>([
        { id: 1, date: new Date(), title: "ポイント練習", type: "practice", time: "16:30 - 19:00", location: "大学グラウンド", description: "400m x 10 (r: 200m/90s)\nラスト1本Free", targetTime: "76-78秒", lapTime: "38-39秒(200m)" },
        { id: 4, date: new Date(), title: "朝練習 (完了)", type: "practice", time: "06:00 - 07:00", location: "大学近辺", description: "Jog 60min (Ave 5:30/km)", isCompleted: true },
        { id: 2, date: new Date(new Date().setDate(new Date().getDate() + 2)), title: "記録会", type: "race", time: "10:00 start", location: "ヤンマーフィールド", description: "3000m 2組目\n1500m 4組目" },
        { id: 3, date: new Date(new Date().setDate(new Date().getDate() + 5)), title: "朝練習", type: "practice", time: "06:30 - 08:00", location: "大学近辺", description: "各自jog 40-60min\n流し x 3" },
    ]);

    // Form State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingEventId, setEditingEventId] = useState<number | null>(null);
    const [newTitle, setNewTitle] = useState("");
    const [newTime, setNewTime] = useState("");
    const [newLocation, setNewLocation] = useState("");
    const [newType, setNewType] = useState<EventType>("practice");
    const [newDescription, setNewDescription] = useState("");
    const [newTargetTime, setNewTargetTime] = useState("");
    const [newLapTime, setNewLapTime] = useState("");

    const handleAddEvent = () => {
        if (!date || !newTitle) return;

        if (editingEventId) {
            // Update existing event
            setEvents(events.map(event =>
                event.id === editingEventId
                    ? {
                        ...event,
                        title: newTitle,
                        time: newTime,
                        location: newLocation,
                        type: newType,
                        description: newDescription,
                        targetTime: newTargetTime,
                        lapTime: newLapTime
                    }
                    : event
            ));
        } else {
            // Add new event
            const newEvent: Event = {
                id: Date.now(),
                date: date,
                title: newTitle,
                type: newType,
                time: newTime,
                location: newLocation,
                description: newDescription,
                targetTime: newTargetTime,
                lapTime: newLapTime,
                isCompleted: false,
            };
            setEvents([...events, newEvent]);
        }

        setIsDialogOpen(false);
        resetForm();
    };

    const handleEditEvent = (event: Event) => {
        setEditingEventId(event.id);
        setNewTitle(event.title);
        setNewTime(event.time);
        setNewLocation(event.location);
        setNewType(event.type);
        setNewDescription(event.description || "");
        setNewTargetTime(event.targetTime || "");
        setNewLapTime(event.lapTime || "");
        setIsDialogOpen(true);
    };

    const resetForm = () => {
        setEditingEventId(null);
        setNewTitle("");
        setNewTime("");
        setNewLocation("");
        setNewType("practice");
        setNewDescription("");
        setNewTargetTime("");
        setNewLapTime("");
    };

    const getEventsForDate = (date: Date | undefined) => {
        if (!date) return [];
        return events.filter(event =>
            event.date.getDate() === date.getDate() &&
            event.date.getMonth() === date.getMonth() &&
            event.date.getFullYear() === date.getFullYear()
        );
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
                            <Plus className="w-4 h-4" /> 予定・練習追加
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{editingEventId ? "予定・練習内容を編集" : "予定・練習内容を追加"}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">タイトル</Label>
                                <Input
                                    id="title"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="例: ポイント練習、記録会"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="time">時間</Label>
                                    <Input
                                        id="time"
                                        type="time"
                                        value={newTime}
                                        onChange={(e) => setNewTime(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="type">種類</Label>
                                    <Select value={newType} onValueChange={(v: EventType) => setNewType(v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
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
                                <Input
                                    id="location"
                                    value={newLocation}
                                    onChange={(e) => setNewLocation(e.target.value)}
                                    placeholder="例: 大学グラウンド"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description">詳細・練習メニュー</Label>
                                <Textarea
                                    id="description"
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                    placeholder="例: 400m x 10 (r: 200m)&#13;&#10;ラスト1本Free"
                                    className="min-h-[100px]"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="targetTime">設定タイム</Label>
                                    <Input
                                        id="targetTime"
                                        value={newTargetTime}
                                        onChange={(e) => setNewTargetTime(e.target.value)}
                                        placeholder="例: 76秒"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="lapTime">ラップ設定</Label>
                                    <Input
                                        id="lapTime"
                                        value={newLapTime}
                                        onChange={(e) => setNewLapTime(e.target.value)}
                                        placeholder="例: 38秒(200m)"
                                    />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" onClick={handleAddEvent} disabled={!newTitle} className="bg-pink-600 hover:bg-pink-700 text-white w-full">
                                {editingEventId ? "更新する" : "追加する"}
                            </Button>
                        </DialogFooter>
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
                                            {!event.isCompleted && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 text-gray-400 hover:text-gray-600"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEditEvent(event);
                                                    }}
                                                >
                                                    <Pencil className="w-3 h-3" />
                                                </Button>
                                            )}
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
                            <p className="text-xs mt-1">「予定・練習追加」ボタンから登録できます</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
