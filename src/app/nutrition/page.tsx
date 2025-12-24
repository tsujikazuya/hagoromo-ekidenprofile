"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Camera, Utensils, Droplets, Plus, Minus, MessageSquare, Sparkles, X, Loader2, Bot } from "lucide-react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@ai-sdk/react";
import { useEffect } from "react";

export default function NutritionPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);


    // State for per-meal checks


    const [mealComments, setMealComments] = useState<Record<string, string>>({});
    const [aiAdvice, setAiAdvice] = useState<Record<string, string>>({});
    const [activeMealId, setActiveMealId] = useState<string | null>(null);

    // @ts-ignore - SDK type mismatch
    const { messages, append, isLoading: isAiLoading } = useChat({
        onFinish: (message: any) => {
            if (activeMealId) {
                setAiAdvice(prev => ({ ...prev, [activeMealId]: message.content }));
                setActiveMealId(null);
            }
        },
    });

    // Update advice in real-time while streaming
    useEffect(() => {
        if (activeMealId && messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage.role === 'assistant') {
                // @ts-ignore - SDK type mismatch
                setAiAdvice(prev => ({ ...prev, [activeMealId]: lastMessage.content }));
            }
        }
    }, [messages, activeMealId]);



    const handleCommentChange = (mealId: string, value: string) => {
        setMealComments(prev => ({ ...prev, [mealId]: value }));
    };

    const [mealImages, setMealImages] = useState<Record<string, string | null>>({});

    const handleImageSelect = (mealId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setMealImages(prev => ({ ...prev, [mealId]: imageUrl }));
        }
    };

    const handleRemoveImage = (mealId: string) => {
        setMealImages(prev => ({ ...prev, [mealId]: null }));
    };

    const handleAnalyze = async (mealId: string) => {
        setActiveMealId(mealId);
        const comment = mealComments[mealId];

        // Construct the prompt
        const prompt = `【食事記録分析依頼】
日時: 2025-12-17 ${mealId}
食事内容: ${comment}

最近の練習内容（ツールを使って取得してください）と照らし合わせて、この食事の評価と、不足している栄養素、次の練習に向けたアドバイスをください。
出力はMarkdownで見やすく整形してください。`;

        await append({
            role: 'user',
            content: prompt,
        });
    };



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push("/");
    };

    const meals = [
        { id: "breakfast", label: "朝食" },
        { id: "lunch", label: "昼食" },
        { id: "dinner", label: "夕食" },
        { id: "snack", label: "補食" },
    ];

    return (
        <div className="p-4 space-y-6 pb-24">
            <header className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/">
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                </Button>
                <h1 className="text-xl font-bold">食事記録</h1>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">


                <Tabs defaultValue="breakfast" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-4">
                        {meals.map(meal => (
                            <TabsTrigger key={meal.id} value={meal.id} className="text-xs px-1">
                                {meal.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {meals.map(meal => {


                        return (
                            <TabsContent key={meal.id} value={meal.id} className="space-y-6">
                                {/* Photo Upload Section */}
                                <Card className={`border-2 ${mealImages[meal.id] ? 'border-solid border-gray-200' : 'border-dashed border-gray-200 bg-gray-50'}`}>
                                    <CardContent className="p-4 flex flex-col items-center justify-center min-h-[200px] space-y-4 relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            className="hidden"
                                            id={`photo-upload-${meal.id}`}
                                            onChange={(e) => handleImageSelect(meal.id, e)}
                                        />

                                        {mealImages[meal.id] ? (
                                            <div className="relative w-full rounded-lg overflow-hidden">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={mealImages[meal.id]!}
                                                    alt={`${meal.label}の写真`}
                                                    className="object-cover w-full h-auto max-h-[300px] rounded-lg"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-2 right-2 rounded-full w-8 h-8 shadow-md"
                                                    onClick={() => handleRemoveImage(meal.id)}
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="bg-white p-4 rounded-full shadow-sm">
                                                    <Camera className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="font-medium text-gray-900">{meal.label}の写真を撮影</p>
                                                    <p className="text-xs text-gray-500">またはライブラリから選択</p>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    type="button"
                                                    onClick={() => document.getElementById(`photo-upload-${meal.id}`)?.click()}
                                                >
                                                    写真を追加
                                                </Button>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Meal Content & AI Analysis */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <MessageSquare className="w-5 h-5 text-purple-600" /> 食事内容・AI分析
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`comment-${meal.id}`}>食事内容</Label>
                                            <Textarea
                                                id={`comment-${meal.id}`}
                                                placeholder="例: ご飯、味噌汁、唐揚げ、サラダ"
                                                value={mealComments[meal.id] || ""}
                                                onChange={(e) => handleCommentChange(meal.id, e.target.value)}
                                                className="min-h-[80px]"
                                            />
                                        </div>

                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                                            onClick={() => handleAnalyze(meal.id)}
                                            disabled={!mealComments[meal.id] || (isAiLoading && activeMealId !== meal.id)}
                                        >
                                            {isAiLoading && activeMealId === meal.id ? (
                                                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> 分析中...</>
                                            ) : (
                                                <><Sparkles className="w-4 h-4 mr-2" /> AIアドバイスをもらう</>
                                            )}
                                        </Button>

                                        {aiAdvice[meal.id] && (
                                            <div className="mt-4 p-4 bg-purple-50 rounded-lg text-sm text-gray-800 whitespace-pre-wrap leading-relaxed animate-in fade-in">
                                                <div className="flex items-center gap-2 mb-2 font-bold text-purple-800">
                                                    <Bot className="w-4 h-4" /> AI主務アドバイス
                                                </div>
                                                {aiAdvice[meal.id]}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>




                            </TabsContent>
                        );
                    })}
                </Tabs>


            </form >
        </div >
    );
}
