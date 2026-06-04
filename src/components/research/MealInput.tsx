
"use client";

import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Image as ImageIcon, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function MealInput() {
    const [image, setImage] = useState<string | null>(null);
    const [mealType, setMealType] = useState("dinner");
    const [text, setText] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setResult(null);
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!image) return;

        setIsAnalyzing(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch('/api/nutrition/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image, text, mealType }),
            });

            if (!response.ok) throw new Error('解析に失敗しました');

            const data = await response.json();
            setResult(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 1) return "text-emerald-600 bg-emerald-50 border-emerald-200";
        if (score === 0) return "text-blue-600 bg-blue-50 border-blue-200";
        return "text-rose-600 bg-rose-50 border-rose-200";
    };

    const getScoreLabel = (score: number) => {
        if (score === 2) return "十分";
        if (score === 1) return "良好";
        if (score === 0) return "普通";
        if (score === -1) return "不足";
        return "欠乏";
    };

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
                        <Select value={mealType} onValueChange={setMealType}>
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
                        食事画像 <span className="text-xs text-muted-foreground font-normal">必須</span>
                    </Label>
                    <div 
                        className="aspect-video bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-rose-50 hover:text-rose-50 hover:border-rose-300 transition-all overflow-hidden relative"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {image ? (
                            <img src={image} alt="Meal" className="w-full h-full object-cover" />
                        ) : (
                            <>
                                <Camera className="w-8 h-8 mb-2" />
                                <span className="text-sm">写真を撮影または選択</span>
                            </>
                        )}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleImageChange} 
                        />
                    </div>
                </div>

                {/* 3. Supplementary Text */}
                <div className="space-y-2">
                    <Label>補足メモ (任意)</Label>
                    <Textarea 
                        placeholder="例: 「練習後」「外食」「食欲なし」など" 
                        className="h-20 resize-none" 
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>

                {/* Action Button */}
                <Button 
                    className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold h-12 rounded-xl shadow-md transition-all active:scale-95"
                    disabled={!image || isAnalyzing}
                    onClick={handleAnalyze}
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            AI解析中...
                        </>
                    ) : (
                        <>
                            <ImageIcon className="w-4 h-4 mr-2" />
                            AI解析を実行する
                        </>
                    )}
                </Button>

                {/* Results Section */}
                {result && (
                    <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                            <CheckCircle2 className="w-4 h-4" />
                            解析完了
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                            <ScoreBadge label="鉄分" score={result.iron_food_score} color={getScoreColor(result.iron_food_score)} />
                            <ScoreBadge label="糖質" score={result.carbohydrate_score} color={getScoreColor(result.carbohydrate_score)} />
                            <ScoreBadge label="Eバランス" score={result.energy_balance_score} color={getScoreColor(result.energy_balance_score)} />
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Detected Foods</p>
                            <p className="text-sm text-slate-700">{result.detected_food_groups}</p>
                        </div>

                        <div className="bg-rose-50 p-4 rounded-lg border border-rose-100">
                            <p className="text-xs font-bold text-rose-700 mb-1 uppercase tracking-wider">AI Advice</p>
                            <p className="text-sm text-slate-700 leading-relaxed">{result.ai_comment}</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <p className="text-xs text-center text-muted-foreground">
                    画像を解析し、鉄分スコアとEA状態を推定します。
                </p>

            </CardContent>
        </Card>
    );
}

function ScoreBadge({ label, score, color }: { label: string, score: number, color: string }) {
    const getLabel = (s: number) => {
        if (s === 2) return "十分";
        if (s === 1) return "良好";
        if (s === 0) return "普通";
        if (s === -1) return "不足";
        return "欠乏";
    };

    return (
        <div className={`flex flex-col items-center justify-center p-2 rounded-lg border ${color} transition-all`}>
            <span className="text-[10px] font-bold opacity-70 mb-1">{label}</span>
            <span className="text-sm font-black">{getLabel(score)}</span>
        </div>
    );
}
