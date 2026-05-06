"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Heart, Moon, Activity } from "lucide-react";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import { useEffect } from "react";
import { Stethoscope, Sparkles, Bot, Loader2 } from "lucide-react";

export default function ConditionPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 日付と時間のステート
    const [recordDate, setRecordDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [recordTime, setRecordTime] = useState("");

    // State for Vitals
    const [hr, setHr] = useState("");
    const [temp, setTemp] = useState("");
    const [weight, setWeight] = useState("");
    const [bodyFat, setBodyFat] = useState("");
    const [leanMass, setLeanMass] = useState("");

    // State for Sleep
    const [sleepHours, setSleepHours] = useState("7");
    const [sleepQuality, setSleepQuality] = useState("good");
    const [sleepEfficiency, setSleepEfficiency] = useState("");
    const [remSleep, setRemSleep] = useState("");
    const [lightSleep, setLightSleep] = useState("");
    const [deepSleep, setDeepSleep] = useState("");

    // State for Condition (Fatigue & Pain)
    const [fatigue, setFatigue] = useState([3]);
    const [painParts, setPainParts] = useState<string[]>([]);

    // State for Other Conditions
    const [bowelMovement, setBowelMovement] = useState("");
    const [sweatVolume, setSweatVolume] = useState("");
    const [hydration, setHydration] = useState("");

    // State for AI Analysis
    const [aiAdvice, setAiAdvice] = useState("");

    // @ts-ignore - SDK type mismatch
    const { messages, append, isLoading: isAiLoading } = useChat({
        onFinish: (message: any) => {
            setAiAdvice(message.content);
        },
    });

    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === 'assistant') {
                // @ts-ignore - SDK type mismatch
                setAiAdvice(lastMessage.content);
            }
        }
    }, [messages]);

    const handleGetAdvice = async () => {
        const prompt = `【体調分析依頼】
今日の体調記録:
- 起床時心拍数: ${hr || "未入力"} bpm
- 体温: ${temp || "未入力"} ℃
- 睡眠時間: ${sleepHours} 時間 (質: ${sleepQuality})
- 疲労度: ${fatigue[0]}/5
- 気になる部位: ${painParts.join(", ") || "なし"}

これらを総合的に分析し、今日の練習へのアドバイス、注意点、推奨されるケア方法を教えてください。
トレーナーとして、怪我の予防を第一に考えつつ、ポジティブに励ましてください。`;

        await append({
            role: 'user',
            content: prompt,
        });
    };

    const togglePainPart = (part: string) => {
        setPainParts(prev =>
            prev.includes(part) ? prev.filter(p => p !== part) : [...prev, part]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push("/");
    };

    return (
        <div className="p-4 space-y-6 pb-24">
            <header className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                </Button>
                <h1 className="text-xl font-bold">体調チェック</h1>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 期日と時間の入力 */}
                <Card>
                    <CardContent className="p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">期日</Label>
                                <Input 
                                    id="date" 
                                    type="date" 
                                    value={recordDate} 
                                    onChange={(e) => setRecordDate(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time">時間</Label>
                                <Input 
                                    id="time" 
                                    type="time" 
                                    value={recordTime} 
                                    onChange={(e) => setRecordTime(e.target.value)} 
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Vital Signs */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Heart className="w-5 h-5 text-red-500" /> バイタル
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="hr">起床時心拍数</Label>
                                <div className="relative">
                                    <Input
                                        id="hr"
                                        type="number"
                                        placeholder="50"
                                        required
                                        value={hr}
                                        onChange={(e) => setHr(e.target.value)}
                                    />
                                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">bpm</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="temp">体温</Label>
                                <div className="relative">
                                    <Input
                                        id="temp"
                                        type="number"
                                        step="0.1"
                                        placeholder="36.5"
                                        value={temp}
                                        onChange={(e) => setTemp(e.target.value)}
                                    />
                                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">℃</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="weight">体重</Label>
                                <div className="relative">
                                    <Input id="weight" type="number" step="0.1" placeholder="50.0" value={weight} onChange={(e) => setWeight(e.target.value)} />
                                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">kg</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bodyFat">体脂肪率</Label>
                                <div className="relative">
                                    <Input id="bodyFat" type="number" step="0.1" placeholder="15.0" value={bodyFat} onChange={(e) => setBodyFat(e.target.value)} />
                                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">%</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="leanMass">除脂肪体重</Label>
                                <div className="relative">
                                    <Input id="leanMass" type="number" step="0.1" placeholder="42.5" value={leanMass} onChange={(e) => setLeanMass(e.target.value)} />
                                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">kg</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Sleep */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Moon className="w-5 h-5 text-indigo-500" /> 睡眠
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="sleep-hours">睡眠時間</Label>
                            <Select value={sleepHours} onValueChange={setSleepHours}>
                                <SelectTrigger>
                                    <SelectValue placeholder="時間" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">5時間未満</SelectItem>
                                    <SelectItem value="6">6時間</SelectItem>
                                    <SelectItem value="7">7時間</SelectItem>
                                    <SelectItem value="8">8時間</SelectItem>
                                    <SelectItem value="9">9時間以上</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="sleep-efficiency">睡眠効率</Label>
                                <div className="relative">
                                    <Input id="sleep-efficiency" type="number" placeholder="85" value={sleepEfficiency} onChange={(e) => setSleepEfficiency(e.target.value)} />
                                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">%</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="rem-sleep">レム睡眠</Label>
                                <div className="relative">
                                    <Input id="rem-sleep" type="number" step="0.1" placeholder="1.5" value={remSleep} onChange={(e) => setRemSleep(e.target.value)} />
                                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">h</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="light-sleep">浅い睡眠</Label>
                                <div className="relative">
                                    <Input id="light-sleep" type="number" step="0.1" placeholder="4.0" value={lightSleep} onChange={(e) => setLightSleep(e.target.value)} />
                                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">h</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="deep-sleep">深い睡眠</Label>
                                <div className="relative">
                                    <Input id="deep-sleep" type="number" step="0.1" placeholder="1.5" value={deepSleep} onChange={(e) => setDeepSleep(e.target.value)} />
                                    <span className="absolute right-3 top-2.5 text-sm text-gray-500">h</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>睡眠の質</Label>
                            <Select value={sleepQuality} onValueChange={setSleepQuality}>
                                <SelectTrigger>
                                    <SelectValue placeholder="質" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="very_good">とても良い</SelectItem>
                                    <SelectItem value="good">良い</SelectItem>
                                    <SelectItem value="normal">普通</SelectItem>
                                    <SelectItem value="bad">悪い</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Fatigue & Pain */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Activity className="w-5 h-5 text-orange-500" /> コンディション
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label>疲労度</Label>
                                <span className="font-bold text-orange-600 text-lg">{fatigue[0]}</span>
                            </div>
                            <Slider
                                value={fatigue}
                                onValueChange={setFatigue}
                                max={5}
                                min={1}
                                step={1}
                                className="py-4"
                            />
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>元気</span>
                                <span>普通</span>
                                <span>疲れている</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label>気になる部位（痛み・張り）</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {["腰", "膝(右)", "膝(左)", "足首(右)", "足首(左)", "ふくらはぎ", "ハムストリングス", "その他"].map((part) => (
                                    <div key={part} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`part-${part}`}
                                            checked={painParts.includes(part)}
                                            onCheckedChange={() => togglePainPart(part)}
                                        />
                                        <Label htmlFor={`part-${part}`} className="font-normal cursor-pointer">
                                            {part}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Menstruation */}
                <Card>
                    <CardContent className="p-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>月経の状態</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="選択してください" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">なし</SelectItem>
                                        <SelectItem value="pre">月経前</SelectItem>
                                        <SelectItem value="during">月経中</SelectItem>
                                        <SelectItem value="post">終了直後</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="lastPeriod">前回の開始日</Label>
                                    <Input id="lastPeriod" type="date" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cycleLength">周期</Label>
                                    <div className="relative">
                                        <Input id="cycleLength" type="number" placeholder="28" />
                                        <span className="absolute right-3 top-2.5 text-sm text-gray-500">日</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                                <div className="space-y-2">
                                    <Label>便通状態</Label>
                                    <Select value={bowelMovement} onValueChange={setBowelMovement}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="選択" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">無</SelectItem>
                                            <SelectItem value="hard">硬</SelectItem>
                                            <SelectItem value="normal">普</SelectItem>
                                            <SelectItem value="soft">軟</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>発汗量</Label>
                                    <Select value={sweatVolume} onValueChange={setSweatVolume}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="選択" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="high">多</SelectItem>
                                            <SelectItem value="normal">普</SelectItem>
                                            <SelectItem value="low">少</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 col-span-2">
                                    <Label>練習時の水分補給</Label>
                                    <Select value={hydration} onValueChange={setHydration}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="選択に含まれる値" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="high">多</SelectItem>
                                            <SelectItem value="normal">普</SelectItem>
                                            <SelectItem value="low">少</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="bg-pink-50 p-3 rounded text-xs text-pink-700">
                                <p className="font-bold mb-1">💡 アドバイス</p>
                                <p>鉄分を多めに摂取しましょう。無理のない範囲で体を動かすと血行が良くなります。</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* AI Advice Section */}
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                            <Stethoscope className="w-5 h-5 text-green-600" /> AIトレーナーのアドバイス
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-green-700">
                            入力された体調データを元に、今日のアドバイスを行います。
                        </p>

                        {!aiAdvice ? (
                            <Button
                                variant="outline"
                                className="w-full border-green-200 text-green-700 hover:bg-green-100"
                                onClick={handleGetAdvice}
                                disabled={isAiLoading}
                                type="button"
                            >
                                {isAiLoading ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> 分析中...</>
                                ) : (
                                    <><Sparkles className="w-4 h-4 mr-2" /> コンディション分析を開始</>
                                )}
                            </Button>
                        ) : (
                            <div className="bg-white/80 p-4 rounded-xl border border-green-100 shadow-sm text-sm text-gray-800 whitespace-pre-wrap leading-relaxed animate-in fade-in">
                                <div className="flex items-center gap-2 mb-2 font-bold text-green-800">
                                    <Bot className="w-4 h-4" /> AIトレーナーより
                                </div>
                                {aiAdvice}

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full mt-2 text-green-500 hover:text-green-700 hover:bg-green-50"
                                    onClick={handleGetAdvice}
                                    disabled={isAiLoading}
                                    type="button"
                                >
                                    <span className="text-xs">最新情報で再分析</span>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg font-bold shadow-lg"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "保存中..." : "体調を記録する"}
                </Button>
            </form>
        </div >
    );
}
