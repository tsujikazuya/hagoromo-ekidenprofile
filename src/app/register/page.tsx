"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, UserPlus } from "lucide-react";
import Link from "next/link";
import { signUpAction } from "../auth/actions";
import { useFormStatus } from "react-dom";
import { Suspense } from "react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={pending}
        >
            {pending ? "登録処理中..." : "登録する"}
        </Button>
    );
}

function RegisterForm() {
    const searchParams = useSearchParams();
    const errorParam = searchParams.get('error');
    
    const [role, setRole] = useState<"player" | "coach">("player");

    return (
        <form action={signUpAction} className="space-y-4">
            {/* Hidden role input */}
            <input type="hidden" name="role" value={role} />
            
            <div className="flex gap-4 p-1 bg-gray-100 rounded-lg">
                <button
                    type="button"
                    onClick={() => setRole("player")}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === "player"
                            ? "bg-white text-pink-600 shadow-sm"
                            : "text-gray-500 hover:text-gray-900"
                        }`}
                >
                    選手
                </button>
                <button
                    type="button"
                    onClick={() => setRole("coach")}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${role === "coach"
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-gray-500 hover:text-gray-900"
                        }`}
                >
                    コーチ・スタッフ
                </button>
            </div>

            <div className="space-y-2">
                <Label htmlFor="name">Name：</Label>
                <Input id="name" name="name" placeholder="Name" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">password  :  </Label>
                <Input id="password" name="password" type="password" required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirmPassword">password（確認）：</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required />
            </div>

            {errorParam && (
                <div className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded text-center">
                    {errorParam}
                </div>
            )}

            <SubmitButton />
        </form>
    );
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-blue-50 p-4 pb-24">
            <Card className="w-full max-w-md shadow-xl border-0">
                <CardHeader className="text-center space-y-2">
                    <div className="flex justify-start mb-2">
                        <Button variant="ghost" size="icon" asChild className="-ml-2">
                            <Link href="/login">
                                <ArrowLeft className="w-5 h-5 text-gray-500" />
                            </Link>
                        </Button>
                    </div>
                    <div className="mx-auto bg-green-500 text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2 shadow-lg">
                        <UserPlus className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                        新規アカウント登録
                    </CardTitle>
                    <CardDescription>
                        アカウントを作成してシステムを利用開始します
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<div className="text-center text-sm text-gray-500">Loading...</div>}>
                        <RegisterForm />
                    </Suspense>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-500">すでにアカウントをお持ちの方は </span>
                        <Link href="/login" className="text-blue-600 font-bold hover:underline">
                            ログイン
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
