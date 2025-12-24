"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, Video, Play, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

export default function VideoAnalysisPage() {
    const [isUploading, setIsUploading] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setVideoUrl(url);
            setIsUploading(true);

            // Start analysis sequence
            startAnalysisSequence();
        }
        // Reset input value to allow selecting the same file again
        e.target.value = "";
    };

    const startAnalysisSequence = async () => {
        // Simulate upload
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsUploading(false);

        setIsProcessing(true);
        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 2500));

        setIsProcessing(false);
        setAnalysisComplete(true);
    };

    return (
        <div className="p-4 space-y-6 pb-24">
            <header className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                </Button>
                <h1 className="text-xl font-bold">フォーム分析</h1>
            </header>

            {!videoUrl ? (
                <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
                    <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                        <div className="bg-white p-4 rounded-full shadow-sm">
                            <Video className="w-10 h-10 text-blue-500" />
                        </div>
                        <div className="text-center">
                            <p className="font-medium text-gray-900">ランニング動画をアップロード</p>
                            <p className="text-xs text-gray-500">MP4, MOV 形式に対応</p>
                        </div>
                        <Button onClick={() => fileInputRef.current?.click()}>
                            <Upload className="w-4 h-4 mr-2" /> 動画を選択
                        </Button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="video/*"
                            onChange={handleFileChange}
                        />
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {/* Video Preview Area */}
                    <div className="relative rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center">
                        <video
                            src={videoUrl}
                            className="w-full h-full object-contain opacity-80"
                            controls={analysisComplete}
                            playsInline
                            muted
                            autoPlay
                        />

                        {/* Overlay for Processing */}
                        {(isUploading || isProcessing) && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white z-10">
                                <Loader2 className="w-10 h-10 animate-spin mb-2" />
                                <p className="font-bold">{isUploading ? "アップロード中..." : "AIがフォームを分析中..."}</p>
                                <p className="text-xs text-gray-300 mt-1">骨格検知・着地判定を行っています</p>
                            </div>
                        )}

                        {/* Mock Skeleton Overlay (Visible after analysis) */}
                        {analysisComplete && (
                            <div className="absolute inset-0 pointer-events-none z-0 opacity-60">
                                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    {/* Simple Stick Figure Mock */}
                                    <line x1="50" y1="20" x2="50" y2="50" stroke="#00ff00" strokeWidth="2" /> {/* Body */}
                                    <line x1="50" y1="50" x2="30" y2="80" stroke="#00ff00" strokeWidth="2" /> {/* Left Leg */}
                                    <line x1="50" y1="50" x2="70" y2="70" stroke="#00ff00" strokeWidth="2" /> {/* Right Leg */}
                                    <line x1="30" y1="80" x2="35" y2="95" stroke="#00ff00" strokeWidth="2" /> {/* Left Shin */}
                                    <line x1="70" y1="70" x2="65" y2="90" stroke="#00ff00" strokeWidth="2" /> {/* Right Shin */}
                                    <line x1="50" y1="30" x2="30" y2="40" stroke="#00ff00" strokeWidth="2" /> {/* Left Arm */}
                                    <line x1="50" y1="30" x2="70" y2="40" stroke="#00ff00" strokeWidth="2" /> {/* Right Arm */}
                                    <circle cx="50" cy="15" r="5" stroke="#00ff00" strokeWidth="2" fill="none" /> {/* Head */}
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Analysis Results */}
                    {analysisComplete && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-600" /> 分析結果
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                                        <div className="bg-green-100 p-2 rounded-full">
                                            <CheckCircle className="w-4 h-4 text-green-700" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-green-900">前傾姿勢: 良好</p>
                                            <p className="text-sm text-green-700">15度の適切な前傾が保たれています。推進力が効率よく伝わっています。</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                                        <div className="bg-yellow-100 p-2 rounded-full">
                                            <AlertTriangle className="w-4 h-4 text-yellow-700" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-yellow-900">着地: ヒールストライク気味</p>
                                            <p className="text-sm text-yellow-700">かかとからの着地が目立ちます。ブレーキ要素が強くなるため、フラット着地を意識しましょう。</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>左右バランス</span>
                                            <span className="font-bold">左 48% : 右 52%</span>
                                        </div>
                                        <Progress value={52} className="h-2" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Button className="w-full" variant="outline" onClick={() => {
                                setVideoUrl(null);
                                setAnalysisComplete(false);
                            }}>
                                別の動画を分析する
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
