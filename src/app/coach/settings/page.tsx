"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function CoachSettingsPage() {
    const [name, setName] = useState("田中コーチ");
    const [email, setEmail] = useState("tanaka@hagoromo.ac.jp");
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">設定</h2>

            <Card>
                <CardHeader>
                    <CardTitle>アカウント設定</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>表示名</Label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>メールアドレス</Label>
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            変更を保存
                        </Button>
                        {showSuccess && (
                            <span className="text-green-600 text-sm flex items-center gap-1 animate-in fade-in">
                                <CheckCircle2 className="w-4 h-4" /> 保存しました
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
