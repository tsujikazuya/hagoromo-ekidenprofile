"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LogOut, Settings, User, Check, Edit2, Save, X } from "lucide-react";
import Link from "next/link";
import { WeeklyDistanceChart } from "@/components/charts/WeeklyDistanceChart";
import { ConditionTrendChart } from "@/components/charts/ConditionTrendChart";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState({
        name: "選手 A",
        team: "羽衣国際大学 女子駅伝部",
        studentId: "1234567",
        pb5000: "16:30.00",
        pb3000: "9:45.00",
        pb10000: "34:00.00",
        pbHalf: "1:15:00"
    });

    const handleSave = () => {
        setIsEditing(false);
        // Save logic here (API call)
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset logic could go here if needed
    };

    return (
        <div className="p-4 space-y-6 pb-24">
            <h1 className="text-xl font-bold">マイページ</h1>

            <Card>
                <CardContent className="p-6 flex flex-col items-center space-y-4">
                    <Avatar className="w-24 h-24">
                        <AvatarFallback className="text-2xl font-bold bg-pink-100 text-pink-600">
                            {profile.name[0]}
                        </AvatarFallback>
                    </Avatar>

                    <div className="text-center w-full space-y-2">
                        {isEditing ? (
                            <div className="space-y-3 p-2 bg-gray-50 rounded-lg">
                                <div>
                                    <Label className="text-left block mb-1">名前</Label>
                                    <Input
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className="text-center"
                                    />
                                </div>
                                <div>
                                    <Label className="text-left block mb-1">所属</Label>
                                    <Input
                                        value={profile.team}
                                        onChange={(e) => setProfile({ ...profile, team: e.target.value })}
                                        className="text-center"
                                    />
                                </div>
                                <div>
                                    <Label className="text-left block mb-1">学籍番号</Label>
                                    <Input
                                        value={profile.studentId}
                                        onChange={(e) => setProfile({ ...profile, studentId: e.target.value })}
                                        className="text-center"
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold">{profile.name}</h2>
                                <p className="text-gray-500">{profile.team}</p>
                                <p className="text-sm text-gray-400 mt-1">学籍番号: {profile.studentId}</p>
                            </>
                        )}
                    </div>

                    {isEditing ? (
                        <div className="flex gap-2 w-full">
                            <Button variant="outline" className="flex-1" onClick={handleCancel}>
                                <X className="w-4 h-4 mr-2" /> キャンセル
                            </Button>
                            <Button className="flex-1" onClick={handleSave}>
                                <Save className="w-4 h-4 mr-2" /> 保存
                            </Button>
                        </div>
                    ) : (
                        <Button variant="outline" className="w-full" onClick={() => setIsEditing(true)}>
                            <Edit2 className="w-4 h-4 mr-2" /> プロフィール編集
                        </Button>
                    )}
                </CardContent>
            </Card>

            <div className="space-y-4">
                <h3 className="font-bold text-gray-900">データ分析</h3>
                <WeeklyDistanceChart />
                <ConditionTrendChart />
            </div>

            <div className="space-y-4">
                <h3 className="font-bold text-gray-900">個人記録</h3>
                <Card>
                    <CardContent className="p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="text-xs text-gray-500">5000m PB</Label>
                                {isEditing ? (
                                    <Input
                                        value={profile.pb5000}
                                        onChange={(e) => setProfile({ ...profile, pb5000: e.target.value })}
                                        className="h-8 font-mono"
                                    />
                                ) : (
                                    <p className="text-lg font-bold font-mono">{profile.pb5000}</p>
                                )}
                            </div>
                            <div>
                                <Label className="text-xs text-gray-500">3000m PB</Label>
                                {isEditing ? (
                                    <Input
                                        value={profile.pb3000}
                                        onChange={(e) => setProfile({ ...profile, pb3000: e.target.value })}
                                        className="h-8 font-mono"
                                    />
                                ) : (
                                    <p className="text-lg font-bold font-mono">{profile.pb3000}</p>
                                )}
                            </div>
                            <div>
                                <Label className="text-xs text-gray-500">10000m PB</Label>
                                {isEditing ? (
                                    <Input
                                        value={profile.pb10000}
                                        onChange={(e) => setProfile({ ...profile, pb10000: e.target.value })}
                                        className="h-8 font-mono"
                                    />
                                ) : (
                                    <p className="text-lg font-bold font-mono">{profile.pb10000}</p>
                                )}
                            </div>
                            <div>
                                <Label className="text-xs text-gray-500">ハーフ PB</Label>
                                {isEditing ? (
                                    <Input
                                        value={profile.pbHalf}
                                        onChange={(e) => setProfile({ ...profile, pbHalf: e.target.value })}
                                        className="h-8 font-mono"
                                    />
                                ) : (
                                    <p className="text-lg font-bold font-mono">{profile.pbHalf}</p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h3 className="font-bold text-gray-900">設定・その他</h3>
                <Card>
                    <CardContent className="p-0 divide-y">
                        <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 text-left">
                            <div className="flex items-center gap-3">
                                <Settings className="w-5 h-5 text-gray-500" />
                                <span>アプリ設定</span>
                            </div>
                        </button>
                        <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 text-left text-red-600">
                            <div className="flex items-center gap-3">
                                <LogOut className="w-5 h-5" />
                                <span>ログアウト</span>
                            </div>
                        </button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
