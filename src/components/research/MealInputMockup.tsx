
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Image as ImageIcon } from "lucide-react";

export function MealInputMockup() {
    return (
        <Card className="w-full max-w-md mx-auto border-t-4 border-rose-500 shadow-lg">
            <CardHeader className="bg-rose-50/50">
                <CardTitle className="text-xl text-rose-700 flex items-center gap-2">
                    食事記録AI
                    <span className="text-xs font-normal text-rose-500 bg-white px-2 py-0.5 rounded-full border border-rose-200">Beta</span>
                </CardTitle>
                <CardDescription>
                    写真をアップロードするとAIが栄養バランス（鉄分・糖質）を自動解析します。
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">

                {/* 1. Meal Type & Time */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>食事区分</Label>
                        <Select defaultValue="dinner">
                            <SelectTrigger>
                                <SelectValue placeholder="選択" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="breakfast">朝食</SelectItem>
                                <SelectItem value="lunch">昼食</SelectItem>
                                <SelectItem value="dinner">夕食</SelectItem>
                                <SelectItem value="snack">補食・間食</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>時間</Label>
                        <Input type="time" defaultValue="19:30" />
                    </div>
                </div>

                {/* 2. Image Upload Area */}
                <div className="space-y-2">
                    <Label className="flex justify-between">
                        食事画像 <span className="text-xs text-muted-foreground font-normal">1〜3枚 (必須)</span>
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                        {/* Added Image 1 */}
                        <div className="aspect-square bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center relative overflow-hidden group cursor-pointer hover:bg-slate-50 transition-colors">
                            <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200&h=200" alt="Main dish" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1.5 rounded">1</div>
                        </div>

                        {/* Added Image 2 */}
                        <div className="aspect-square bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center relative overflow-hidden group cursor-pointer hover:bg-slate-50 transition-colors">
                            <img src="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=200&h=200" alt="Side dish" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1.5 rounded">2</div>
                        </div>

                        {/* Empty Slot */}
                        <div className="aspect-square bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-rose-50 hover:text-rose-500 hover:border-rose-300 transition-all">
                            <Camera className="w-6 h-6 mb-1" />
                            <span className="text-[10px]">追加</span>
                        </div>
                    </div>
                </div>

                {/* 3. Meal Content Description */}
                <div className="space-y-2">
                    <Label>食事内容 (必須)</Label>
                    <Textarea placeholder="例: 牛丼、サラダ、味噌汁" className="h-20 resize-none" />
                </div>

                {/* 4. Supplementary Text */}
                <div className="space-y-2">
                    <Label>補足メモ (任意)</Label>
                    <Textarea placeholder="例: 「練習後」「外食」「食欲なし」「半分残した」など" className="h-20 resize-none" />
                </div>

                {/* Action Button */}
                <Button className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold h-12 rounded-xl shadow-md transition-all active:scale-95">
                    <ImageIcon className="w-4 h-4 mr-2" />
                    AI解析を実行する
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                    画像を解析し、鉄分スコアとEA状態を推定します。
                </p>

            </CardContent>
        </Card>
    );
}
