
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Moon, Activity, CalendarDays, Save, Dumbbell } from "lucide-react";

export function AthleteInputMockup() {
    return (
        <Card className="w-full max-w-md mx-auto shadow-lg border-2 border-rose-100">
            <CardHeader className="bg-rose-50/50 pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl text-rose-950">今日の記録</CardTitle>
                        <CardDescription>1日1回・3分で完了</CardDescription>
                    </div>
                    <div className="bg-white p-2 rounded-full text-rose-500 shadow-sm">
                        <Activity className="h-5 w-5" />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <Tabs defaultValue="training" className="w-full">
                    <TabsList className="w-full rounded-none h-12 bg-white border-b grid grid-cols-3">
                        <TabsTrigger value="daily" className="data-[state=active]:border-b-2 data-[state=active]:border-rose-500 data-[state=active]:text-rose-600 rounded-none bg-transparent">
                            <CalendarDays className="w-4 h-4 mr-2" />
                            日常
                        </TabsTrigger>
                        <TabsTrigger value="training" className="data-[state=active]:border-b-2 data-[state=active]:border-rose-500 data-[state=active]:text-rose-600 rounded-none bg-transparent">
                            <Dumbbell className="w-4 h-4 mr-2" />
                            練習
                        </TabsTrigger>
                        <TabsTrigger value="condition" className="data-[state=active]:border-b-2 data-[state=active]:border-rose-500 data-[state=active]:text-rose-600 rounded-none bg-transparent">
                            <Moon className="w-4 h-4 mr-2" />
                            体調
                        </TabsTrigger>
                    </TabsList>

                    {/* Tab 1: 日常 (Daily) */}
                    <TabsContent value="daily" className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>体重 (kg)</Label>
                                <div className="flex items-center gap-2">
                                    <Input type="number" placeholder="50.0" className="text-lg" />
                                    <span className="text-slate-500">kg</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label>月経の状態</Label>
                                <RadioGroup defaultValue="none" className="grid grid-cols-3 gap-2">
                                    <div>
                                        <RadioGroupItem value="none" id="m-none" className="peer sr-only" />
                                        <Label
                                            htmlFor="m-none"
                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-rose-500 peer-data-[state=checked]:text-rose-600 cursor-pointer"
                                        >
                                            なし
                                        </Label>
                                    </div>
                                    <div>
                                        <RadioGroupItem value="present" id="m-present" className="peer sr-only" />
                                        <Label
                                            htmlFor="m-present"
                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-rose-500 peer-data-[state=checked]:text-rose-600 cursor-pointer"
                                        >
                                            あり
                                        </Label>
                                    </div>
                                    <div>
                                        <RadioGroupItem value="irregular" id="m-irr" className="peer sr-only" />
                                        <Label
                                            htmlFor="m-irr"
                                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-rose-500 peer-data-[state=checked]:text-rose-600 cursor-pointer"
                                        >
                                            不正出血
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                        <div className="text-right">
                            <Button variant="outline" size="sm" onClick={() => (document.querySelector('[value="training"]') as HTMLElement)?.click()}>
                                次へ (練習)
                            </Button>
                        </div>
                    </TabsContent>

                    {/* Tab 2: トレーニング (Training) */}
                    <TabsContent value="training" className="p-6 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>走行距離</Label>
                                <div className="relative">
                                    <Input type="number" placeholder="0" className="pr-8" />
                                    <span className="absolute right-3 top-2.5 text-sm text-slate-500">km</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>走行時間</Label>
                                <div className="relative">
                                    <Input type="number" placeholder="0" className="pr-10" />
                                    <span className="absolute right-3 top-2.5 text-sm text-slate-500">min</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label>RPE (自覚的運動強度)</Label>
                                <span className="text-2xl font-bold text-rose-600">3</span>
                            </div>
                            <Slider defaultValue={[3]} max={5} min={1} step={1} className="w-full" />
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>1 (楽)</span>
                                <span>5 (きつい)</span>
                            </div>
                        </div>

                        <div className="text-right">
                            <Button variant="outline" size="sm" onClick={() => (document.querySelector('[value="condition"]') as HTMLElement)?.click()}>
                                次へ (体調)
                            </Button>
                        </div>
                    </TabsContent>

                    {/* Tab 3: 睡眠・体調 (Sleep/Condition) */}
                    <TabsContent value="condition" className="p-6 space-y-6">
                        <div className="space-y-4">
                            <Label>昨晩の睡眠</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <span className="text-xs text-slate-500">時間</span>
                                    <Input type="number" placeholder="7.0" />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-slate-500">質 (1-5)</span>
                                    <Input type="number" max={5} min={1} placeholder="3" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label>疲労感・症状 (Check)</Label>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex items-center space-x-2 border p-3 rounded-md">
                                    <Checkbox id="sym-dizzy" />
                                    <label htmlFor="sym-dizzy" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">めまい・立ちくらみ</label>
                                </div>
                                <div className="flex items-center space-x-2 border p-3 rounded-md">
                                    <Checkbox id="sym-breath" />
                                    <label htmlFor="sym-breath" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">息切れしやすい</label>
                                </div>
                                <div className="flex items-center space-x-2 border p-3 rounded-md">
                                    <Checkbox id="sym-legs" />
                                    <label htmlFor="sym-legs" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">脚が重い</label>
                                </div>
                                <div className="flex items-center space-x-2 border p-3 rounded-md">
                                    <Checkbox id="sym-palp" />
                                    <label htmlFor="sym-palp" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">動悸がする</label>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full bg-rose-600 hover:bg-rose-700 mt-4">
                            <Save className="w-4 h-4 mr-2" />
                            記録を保存
                        </Button>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
