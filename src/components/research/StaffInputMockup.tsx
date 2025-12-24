
"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have this or standard textarea
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Stethoscope, Apple, Activity } from "lucide-react";

export function StaffInputMockup() {
    return (
        <Card className="w-full shadow-md border border-slate-200">
            <CardHeader className="bg-slate-100 pb-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-xl text-slate-800">専門スタッフ入力ポータル</CardTitle>
                        <CardDescription>管理栄養士・監督・トレーナー用</CardDescription>
                    </div>
                    <div className="bg-white p-2 rounded-full text-slate-600 shadow-sm">
                        <Stethoscope className="h-5 w-5" />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <Tabs defaultValue="nutrition" className="w-full">
                    <TabsList className="w-full justify-start rounded-none h-12 bg-white border-b px-4">
                        <TabsTrigger value="nutrition" className="data-[state=active]:border-b-2 data-[state=active]:border-green-500 data-[state=active]:text-green-700 rounded-none bg-transparent px-6">
                            <Apple className="w-4 h-4 mr-2" />
                            月次栄養評価
                        </TabsTrigger>
                        <TabsTrigger value="blood" className="data-[state=active]:border-b-2 data-[state=active]:border-rose-500 data-[state=active]:text-rose-700 rounded-none bg-transparent px-6">
                            <Stethoscope className="w-4 h-4 mr-2" />
                            血液データ
                        </TabsTrigger>
                        <TabsTrigger value="treadmill" className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-700 rounded-none bg-transparent px-6">
                            <Activity className="w-4 h-4 mr-2" />
                            トレッドミル試験
                        </TabsTrigger>
                    </TabsList>

                    {/* Common Selector */}
                    <div className="p-4 bg-slate-50 border-b flex gap-4 items-center">
                        <div className="w-48">
                            <Label className="text-xs text-slate-500">対象選手</Label>
                            <Select>
                                <SelectTrigger className="h-8 bg-white">
                                    <SelectValue placeholder="選手を選択" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="a001">A001: 佐藤 花子</SelectItem>
                                    <SelectItem value="a002">A002: 鈴木 愛</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-40">
                            <Label className="text-xs text-slate-500">評価対象年月</Label>
                            <Input type="month" className="h-8 bg-white" />
                        </div>
                    </div>

                    <TabsContent value="nutrition" className="p-6 space-y-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-green-800 border-b pb-2">栄養摂取状況スコア (-2 ~ +2)</h3>

                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>評価項目</TableHead>
                                        <TableHead className="w-[200px]">スコア (選択)</TableHead>
                                        <TableHead>備考</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-medium">エネルギーバランス</TableCell>
                                        <TableCell>
                                            <Select>
                                                <SelectTrigger><SelectValue placeholder="0 (適正)" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="2">+2 (過剰)</SelectItem>
                                                    <SelectItem value="1">+1 (やや多い)</SelectItem>
                                                    <SelectItem value="0">0 (適正)</SelectItem>
                                                    <SelectItem value="-1">-1 (やや不足)</SelectItem>
                                                    <SelectItem value="-2">-2 (不足)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-500">体重減少傾向なし</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">鉄分食品摂取頻度</TableCell>
                                        <TableCell>
                                            <Select>
                                                <SelectTrigger><SelectValue placeholder="-1 (やや不足)" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="2">+2 (非常に良い)</SelectItem>
                                                    <SelectItem value="1">+1 (良い)</SelectItem>
                                                    <SelectItem value="0">0 (普通)</SelectItem>
                                                    <SelectItem value="-1">-1 (やや不足)</SelectItem>
                                                    <SelectItem value="-2">-2 (不足)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell className="text-sm text-slate-500">ヘム鉄摂取が少ない</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell className="font-medium">糖質摂取量</TableCell>
                                        <TableCell>
                                            <Select>
                                                <SelectTrigger><SelectValue placeholder="0 (適正)" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="0">0 (適正)</SelectItem>
                                                    {/* ... others */}
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>

                            <div className="mt-4">
                                <Label>管理栄養士コメント (Short Text)</Label>
                                <Textarea placeholder="選手へのフィードバックや特記事項..." className="mt-1 h-20" />
                            </div>

                            <div className="flex justify-end">
                                <Button className="bg-green-600 hover:bg-green-700">保存 (栄養評価)</Button>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="blood" className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-rose-800 border-b pb-2">主要項目 (必須)</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Ferritin (ng/mL)</Label>
                                        <Input type="number" placeholder="30.0" className="border-rose-200 focus:ring-rose-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Hb (g/dL)</Label>
                                        <Input type="number" placeholder="12.5" className="border-rose-200 focus:ring-rose-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold text-slate-800 border-b pb-2">詳細項目 (任意)</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Serum Iron (μg/dL)</Label>
                                        <Input type="number" placeholder="" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>TSAT (%)</Label>
                                        <Input type="number" placeholder="" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>CRP (mg/dL)</Label>
                                        <Input type="number" placeholder="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <Button className="bg-rose-600 hover:bg-rose-700">保存 (血液データ)</Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="treadmill" className="p-6 space-y-6">
                        <div className="grid grid-cols-3 gap-6">
                            <div className="col-span-1 space-y-4 border-r pr-6">
                                <Label>プロトコル設定 (速度)</Label>
                                <div className="flex items-center gap-2">
                                    <Input type="number" placeholder="12.0" />
                                    <span>km/h</span>
                                </div>
                                <Label className="mt-4 block">自覚的強度 (全体)</Label>
                                <Select>
                                    <SelectTrigger><SelectValue placeholder="RPE 13" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="11">11 (楽である)</SelectItem>
                                        <SelectItem value="13">13 (ややきつい)</SelectItem>
                                        <SelectItem value="15">15 (きつい)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="col-span-2 space-y-4">
                                <Label>心拍応答 (HR Response)</Label>
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <span className="text-xs font-bold text-slate-500 block">前半平均 HR</span>
                                        <Input type="number" placeholder="145" />
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-xs font-bold text-slate-500 block">後半平均 HR</span>
                                        <Input type="number" placeholder="152" />
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-xs font-bold text-blue-600 block">HR Drift (Auto)</span>
                                        <div className="flex items-center h-10 px-3 bg-blue-50 border border-blue-100 rounded text-blue-800 font-mono">
                                            +7 bpm
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <Button className="bg-blue-600 hover:bg-blue-700">保存 (試験結果)</Button>
                        </div>
                    </TabsContent>

                </Tabs>
            </CardContent>
        </Card>
    );
}
