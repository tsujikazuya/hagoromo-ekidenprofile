"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Activity, Loader2, Check, Video, Upload, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import { Bot, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function RecordPage() {
    const router = useRouter();
    const [rpe, setRpe] = useState([5]);
    const [trainingType, setTrainingType] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formAdvice, setFormAdvice] = useState<string>("");

    // Video Analysis State
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
            startAnalysisSequence();
        }
        e.target.value = "";
    };

    const startAnalysisSequence = async () => {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsUploading(false);
        setIsProcessing(true);
        await new Promise(resolve => setTimeout(resolve, 2500));
        setIsProcessing(false);
        setAnalysisComplete(true);
    };

    // @ts-ignore - SDK type mismatch
    const { messages, append, isLoading: isAiLoading } = useChat({
        onFinish: (message: any) => {
            setFormAdvice(message.content);
        },
    });

    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === 'assistant') {
                // @ts-ignore - SDK type mismatch
                setFormAdvice(lastMessage.content);
            }
        }
    }, [messages]);

    const handleGetFormAdvice = async () => {
        let prompt = `【フォーム分析依頼】
最近のフォーム分析データ（ツールで取得）をもとに、改善点と具体的なドリル、意識すべきポイントを教えてください。
ランナーとしてモチベーションが上がるように、良い点も必ず褒めてください。`;

        if (analysisComplete) {
            prompt += `
            
【今回アップロードされた動画の分析結果】
- 前傾姿勢: 良好 (15度)
- 着地: ヒールストライク気味 (要改善)
- 左右バランス: 左48% : 右52%`;
        }

        await append({
            role: 'user',
            content: prompt
        });
    };

    // Polar Sync State
    const [isSyncing, setIsSyncing] = useState(false);
    const [isSynced, setIsSynced] = useState(false);
    const [hrData, setHrData] = useState({ avg: "", max: "" });

    const handleSync = async () => {
        setIsSyncing(true);
        // Simulate API call to Polar
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock Data
        setHrData({ avg: "152", max: "178" });
        setIsSynced(true);
        setIsSyncing(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push("/schedule");
    };

    return (
        <div className="p-4 space-y-6 pb-24">
            <header className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                </Button>
                <h1 className="text-xl font-bold">練習記録の入力</h1>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Training Menu Input */}
                <Card className="bg-white border-gray-200">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-bold">トレーニング内容</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="trainingType">トレーニング種別</Label>
                            <Select onValueChange={setTrainingType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="種別を選択" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="lsd">LSD</SelectItem>
                                    <SelectItem value="jog">ジョグ</SelectItem>
                                    <SelectItem value="pace">ペース走</SelectItem>
                                    <SelectItem value="tempo">テンポ走（LT走）</SelectItem>
                                    <SelectItem value="interval">インターバル</SelectItem>
                                    <SelectItem value="buildup">ビルドアップ走</SelectItem>
                                    <SelectItem value="repetition">レペティション（レースペース走）</SelectItem>
                                    <SelectItem value="hill">坂道トレーニング</SelectItem>
                                    <SelectItem value="weight_all">ウェイトトレーニング（全体）</SelectItem>
                                    <SelectItem value="weight_ind">ウェイトトレーニング（個別）</SelectItem>
                                    <SelectItem value="drill">技術・ドリル</SelectItem>
                                    <SelectItem value="sprint">スプリント／流し</SelectItem>
                                    <SelectItem value="cross">クロストレーニング</SelectItem>
                                    <SelectItem value="trail">トレイルランニング</SelectItem>
                                    <SelectItem value="recovery">回復系セッション</SelectItem>
                                    <SelectItem value="mental">メンタル・戦術トレーニング</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Dynamic Form Fields based on trainingType */}
                        {(trainingType === 'interval' || trainingType === 'repetition' || trainingType === 'hill' || trainingType === 'sprint') ? (
                            // Interval / Repetition Mode
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="menuDistance">疾走距離</Label>
                                        <Input id="menuDistance" placeholder="例: 400m, 1000m" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="targetTime">疾走設定タイム</Label>
                                        <Input id="targetTime" placeholder="例: 72秒, 3:20/km" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="recovery">リカバリー</Label>
                                    <div className="flex gap-2">
                                        <Input id="recoveryDist" placeholder="距離 (Example: 200m)" />
                                        <Input id="recoveryTime" placeholder="時間 (Example: 90秒)" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="reps">回数</Label>
                                        <div className="relative">
                                            <Input id="reps" type="number" placeholder="10" />
                                            <span className="absolute right-3 top-2.5 text-sm text-gray-500">本</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="sets">セット数</Label>
                                        <div className="relative">
                                            <Input id="sets" type="number" placeholder="1" />
                                            <span className="absolute right-3 top-2.5 text-sm text-gray-500">セット</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (trainingType === 'weight_all' || trainingType === 'weight_ind' || trainingType === 'drill' || trainingType === 'mental') ? (
                            // Weight / Drill / Other Mode
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                <p className="text-sm text-gray-500">
                                    詳細な内容は下の「その他・詳細」欄に記入してください。
                                </p>
                            </div>
                        ) : (
                            // Distance / Pace Mode (Default)
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="menuDistance">設定距離</Label>
                                        <Input id="menuDistance" placeholder="例: 10km, 60分" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="targetTime">設定ペース</Label>
                                        <Input id="targetTime" placeholder="例: 4:30/km" />
                                    </div>
                                </div>
                                {trainingType === 'buildup' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="endPace">終了設定ペース</Label>
                                        <Input id="endPace" placeholder="例: 3:45/km" />
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="otherMenu">その他・詳細</Label>
                            <Input id="otherMenu" placeholder="例: r: 200m jog, 傾斜3%, 後半ビルドアップ" />
                        </div>
                    </CardContent>
                </Card>

                {/* Results */}
                <div className="space-y-4">
                    <h2 className="font-bold text-lg">実施結果</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="distance">総距離 (km)</Label>
                            <Input id="distance" type="number" step="0.1" placeholder="12.0" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="time">総時間 (分)</Label>
                            <Input id="time" type="number" placeholder="60" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="weather">天候・気温</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <Select defaultValue="sunny">
                                <SelectTrigger>
                                    <SelectValue placeholder="天気" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sunny">晴れ</SelectItem>
                                    <SelectItem value="cloudy">曇り</SelectItem>
                                    <SelectItem value="rain">雨</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="relative">
                                <Input type="number" placeholder="15" className="pr-8" />
                                <span className="absolute right-3 top-2.5 text-sm text-gray-500">℃</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Heart Rate */}
                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <Activity className="w-4 h-4" /> 心拍数データ
                    </Label>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="avgHr" className="text-xs text-gray-500">平均心拍数</Label>
                            <div className="relative">
                                <Input
                                    id="avgHr"
                                    type="number"
                                    placeholder="145"
                                    value={hrData.avg}
                                    onChange={(e) => setHrData({ ...hrData, avg: e.target.value })}
                                />
                                <span className="absolute right-3 top-2.5 text-sm text-gray-500">bpm</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="maxHr" className="text-xs text-gray-500">最大心拍数</Label>
                            <div className="relative">
                                <Input
                                    id="maxHr"
                                    type="number"
                                    placeholder="170"
                                    value={hrData.max}
                                    onChange={(e) => setHrData({ ...hrData, max: e.target.value })}
                                />
                                <span className="absolute right-3 top-2.5 text-sm text-gray-500">bpm</span>
                            </div>
                        </div>
                    </div>

                    {!isSynced ? (
                        <Button
                            variant="outline"
                            type="button"
                            className="w-full text-xs flex items-center gap-2 text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100"
                            onClick={handleSync}
                            disabled={isSyncing}
                        >
                            {isSyncing ? (
                                <>
                                    <Loader2 className="w-3 h-3 animate-spin" /> 同期中...
                                </>
                            ) : (
                                <>
                                    <Activity className="w-3 h-3" /> Garmin / Polar と同期
                                </>
                            )}
                        </Button>
                    ) : (
                        <div className="flex items-center justify-center gap-2 p-2 bg-green-50 text-green-700 rounded text-xs font-bold border border-green-200">
                            <Check className="w-3 h-3" /> Polarのデータと同期しました
                        </div>
                    )}
                </div>

                {/* RPE */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Label>主観的運動強度 (RPE)</Label>
                        <span className="font-bold text-pink-600 text-lg">{rpe[0]}</span>
                    </div>
                    <Slider
                        value={rpe}
                        onValueChange={setRpe}
                        max={10}
                        min={1}
                        step={1}
                        className="py-4"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>楽</span>
                        <span>きつい</span>
                        <span>限界</span>
                    </div>
                </div>

                {/* Video Analysis Section */}
                <div className="space-y-4">
                    <h2 className="font-bold text-lg flex items-center gap-2">
                        <Video className="w-5 h-5 text-purple-600" /> フォーム動画分析
                    </h2>

                    {!videoUrl ? (
                        <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
                            <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
                                <div className="bg-white p-3 rounded-full shadow-sm">
                                    <Upload className="w-6 h-6 text-purple-500" />
                                </div>
                                <div className="text-center">
                                    <p className="font-medium text-sm text-gray-900">練習動画をアップロード</p>
                                    <p className="text-xs text-gray-500">AIがフォームを自動分析します</p>
                                </div>
                                <Button type="button" size="sm" onClick={() => fileInputRef.current?.click()} className="bg-purple-600 hover:bg-purple-700">
                                    動画を選択
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
                        <div className="space-y-4">
                            <div className="relative rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center border border-zinc-200">
                                <video
                                    src={videoUrl}
                                    className="w-full h-full object-contain opacity-80"
                                    controls={analysisComplete}
                                    playsInline
                                    muted
                                    autoPlay
                                />

                                {(isUploading || isProcessing) && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white z-10">
                                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                                        <p className="font-bold text-sm">{isUploading ? "アップロード中..." : "AI分析中..."}</p>
                                    </div>
                                )}

                                {analysisComplete && (
                                    <div className="absolute inset-0 pointer-events-none z-0 opacity-60">
                                        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                                            <line x1="50" y1="20" x2="50" y2="50" stroke="#00ff00" strokeWidth="2" />
                                            <line x1="50" y1="50" x2="30" y2="80" stroke="#00ff00" strokeWidth="2" />
                                            <line x1="50" y1="50" x2="70" y2="70" stroke="#00ff00" strokeWidth="2" />
                                            <line x1="30" y1="80" x2="35" y2="95" stroke="#00ff00" strokeWidth="2" />
                                            <line x1="70" y1="70" x2="65" y2="90" stroke="#00ff00" strokeWidth="2" />
                                            <line x1="50" y1="30" x2="30" y2="40" stroke="#00ff00" strokeWidth="2" />
                                            <line x1="50" y1="30" x2="70" y2="40" stroke="#00ff00" strokeWidth="2" />
                                            <circle cx="50" cy="15" r="5" stroke="#00ff00" strokeWidth="2" fill="none" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {analysisComplete && (
                                <Card className="border-purple-100 bg-purple-50/50">
                                    <CardContent className="p-4 space-y-3">
                                        <div className="flex items-start gap-3 p-2 bg-white rounded-lg border border-purple-100">
                                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                                            <div>
                                                <p className="font-bold text-xs text-green-800">前傾姿勢: 良好</p>
                                                <p className="text-[10px] text-green-700">15度の適切な前傾。推進力が効率的。</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-2 bg-white rounded-lg border border-purple-100">
                                            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                                            <div>
                                                <p className="font-bold text-xs text-yellow-800">着地: ヒールストライク気味</p>
                                                <p className="text-[10px] text-yellow-700">ブレーキ要素あり。フラット着地を意識。</p>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[10px] text-gray-500">
                                                <span>左右バランス</span>
                                                <span className="font-bold">左48 : 右52</span>
                                            </div>
                                            <Progress value={52} className="h-1.5" />
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-full text-xs"
                                            type="button" // Important to prevent form submission
                                            onClick={() => {
                                                setVideoUrl(null);
                                                setAnalysisComplete(false);
                                            }}>
                                            別の動画を分析
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </div>

                {/* Comment */}
                <div className="space-y-2">
                    <Label htmlFor="comment">振り返り・コメント</Label>
                    <Textarea
                        id="comment"
                        placeholder="設定タイム通り走れた。後半少し動きが硬くなった。"
                        className="h-32"
                    />
                </div>

                <Button
                    type="submit"
                    className="w-full bg-pink-600 hover:bg-pink-700 h-12 text-lg font-bold shadow-lg"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        "保存中..."
                    ) : (
                        <span className="flex items-center gap-2">
                            <Save className="w-5 h-5" /> 記録を保存
                        </span>
                    )}
                </Button>
            </form>

            {/* Form Improvement Advice Section */}
            <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold flex items-center gap-2 text-indigo-900">
                        <Sparkles className="w-5 h-5 text-indigo-600" /> フォーム改善のヒント
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-indigo-700">
                        動画分析結果や日頃のデータを元に、AIコーチからアドバイスをもらえます。
                    </p>

                    {!formAdvice ? (
                        <Button
                            variant="outline"
                            className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                            onClick={handleGetFormAdvice}
                            disabled={isAiLoading}
                            type="button"
                        >
                            {isAiLoading ? (
                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> 分析中...</>
                            ) : (
                                <><Bot className="w-4 h-4 mr-2" /> AIコーチに聞く</>
                            )}
                        </Button>
                    ) : (
                        <div className="bg-white/80 p-4 rounded-xl border border-indigo-100 shadow-sm text-sm text-gray-800 whitespace-pre-wrap leading-relaxed animate-in fade-in">
                            <div className="flex items-center gap-2 mb-2 font-bold text-indigo-800">
                                <Bot className="w-4 h-4" /> AIコーチからのアドバイス
                            </div>
                            {formAdvice}

                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full mt-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50"
                                onClick={handleGetFormAdvice}
                                disabled={isAiLoading}
                                type="button"
                            >
                                <span className="text-xs">最新のアドバイスを取得</span>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
