"use client";

import { useSearchParams } from "next/navigation";
import { loginAction, demoLoginAction } from '../auth/actions';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Suspense, useState } from "react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button formAction={loginAction} disabled={pending} className="w-full">
            {pending ? "ログイン中..." : "ログイン"}
        </Button>
    );
}

function LoginForm() {
    const searchParams = useSearchParams();
    const errorParam = searchParams.get('error');
    const messageParam = searchParams.get('message');
    
    // Add role state to toggle between player and staff
    const [role, setRole] = useState<"player" | "coach">("player");

    return (
        <form className="space-y-4">
            {/* Same role toggle as register page */}
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
                <Label htmlFor="loginId">Name：</Label>
                <Input 
                    id="loginId" 
                    name="loginId" 
                    type="text" 
                    placeholder="Name" 
                    required 
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">password  :  </Label>
                <Input id="password" name="password" type="password" required />
            </div>
            
            {errorParam && (
                <div className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded text-center">
                    {errorParam}
                </div>
            )}
            {messageParam && (
                <div className="text-green-600 text-sm font-medium bg-green-50 p-2 rounded text-center">
                    {messageParam}
                </div>
            )}

            <div className="flex flex-col gap-2 pt-4">
                <SubmitButton />
                <Button variant="outline" type="button" asChild>
                    <Link href="/register">新規アカウントを作成する</Link>
                </Button>
            </div>
            
            <div className="relative my-4 pt-2">
                <div className="absolute inset-0 flex items-center pt-2">
                    <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase pt-2">
                    <span className="bg-white px-2 text-gray-500 font-bold tracking-widest rounded-full">TEST LOGIN</span>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
                <Button 
                    variant="secondary" 
                    type="submit"
                    formAction={demoLoginAction.bind(null, 'player')}
                    className="w-full text-xs bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold border border-pink-200 shadow-sm"
                >
                    選手としてテストログイン
                </Button>
                <Button 
                    variant="secondary" 
                    type="submit"
                    formAction={demoLoginAction.bind(null, 'coach')}
                    className="w-full text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 shadow-sm"
                >
                    監督としてテストログイン
                </Button>
            </div>
        </form>
    );
}

export default function LoginPage() {
    return (
        <div className="flex h-screen items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-sm shadow-xl border-0">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-2xl font-bold text-gray-900">ログイン</CardTitle>
                    <CardDescription>
                        ログイン情報を入力してください
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense fallback={<div className="text-center text-sm text-gray-500">Loading...</div>}>
                        <LoginForm />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}
