"use client";

import { useState, Suspense } from "react"; // Added Suspense
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, AlertCircle } from "lucide-react"; // Import AlertCircle
import Link from "next/link"; // Import Link

// Create a component that uses useSearchParams
function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get("registered");

    const [isLoading, setIsLoading] = useState(false);
    const [loginData, setLoginData] = useState({ id: "", password: "" }); // State for inputs
    const [error, setError] = useState("");

    const handleLogin = async (role: "player" | "coach") => {
        setError("");
        setIsLoading(true);
        // Mock login delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        if (role === "coach") {
            try {
                const existingUsersStr = localStorage.getItem("ekiden_users");
                const existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : [];

                const user = existingUsers.find((u: any) =>
                    u.studentId === loginData.id && u.password === loginData.password && u.role === "coach"
                );

                if (user) {
                    localStorage.setItem("currentUser", JSON.stringify(user));
                    router.push("/coach");
                } else {
                    // Backdoor for demo coach
                    if (loginData.id === "coach" && loginData.password === "password") {
                        router.push("/coach");
                    } else {
                        setError("IDまたはパスワードが間違っています");
                    }
                }
            } catch (e) {
                console.error(e);
                setError("ログイン処理に失敗しました");
            }
        } else {
            // Player Login
            try {
                const existingUsersStr = localStorage.getItem("ekiden_users");
                const existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : [];

                const user = existingUsers.find((u: any) =>
                    u.studentId === loginData.id && u.password === loginData.password
                );

                if (user) {
                    // Success
                    localStorage.setItem("currentUser", JSON.stringify(user));
                    router.push("/");
                } else {
                    // Fail (allow default login for demo if specific ID is entered, e.g. "demo")
                    if (loginData.id === "1234567" && loginData.password === "password") {
                        // Backdoor/Demo account
                        router.push("/");
                    } else {
                        setError("IDまたはパスワードが間違っています");
                    }
                }
            } catch (e) {
                console.error(e);
                setError("ログイン処理に失敗しました");
            }
        }
        setIsLoading(false);
    };

    return (
        <Card className="w-full max-w-md shadow-xl border-0">
            <CardHeader className="text-center space-y-2">
                <div className="mx-auto bg-pink-600 text-white p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2 shadow-lg">
                    <span className="text-2xl font-bold">H</span>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                    羽衣国際大学<br />女子駅伝部
                </CardTitle>
                <CardDescription>
                    総合管理システムへようこそ
                </CardDescription>
            </CardHeader>
            <CardContent>
                {registered && (
                    <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 flex items-center gap-2 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                        <CheckCircle2 className="w-5 h-5" />
                        アカウント登録が完了しました。
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 flex items-center gap-2 text-sm font-bold animate-in fade-in">
                        <AlertCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                <Tabs defaultValue="player" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="player">選手</TabsTrigger>
                        <TabsTrigger value="coach">コーチ・スタッフ</TabsTrigger>
                    </TabsList>

                    <TabsContent value="player" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="player-id">学籍番号</Label>
                            <Input
                                id="player-id"
                                placeholder="1234567"
                                value={loginData.id}
                                onChange={(e) => setLoginData({ ...loginData, id: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="player-pass">パスワード</Label>
                            <Input
                                id="player-pass"
                                type="password"
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            />
                        </div>
                        <Button
                            className="w-full bg-pink-600 hover:bg-pink-700"
                            onClick={() => handleLogin("player")}
                            disabled={isLoading}
                        >
                            {isLoading ? "ログイン中..." : "選手としてログイン"}
                        </Button>

                        <div className="mt-4 text-center">
                            <Link href="/register" className="text-sm text-blue-600 hover:underline">
                                アカウントをお持ちでない方はこちら
                            </Link>
                        </div>
                    </TabsContent>

                    <TabsContent value="coach" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="coach-id">ID</Label>
                            <Input id="coach-id" placeholder="coach_id" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="coach-pass">パスワード</Label>
                            <Input id="coach-pass" type="password" />
                        </div>
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            onClick={() => handleLogin("coach")}
                            disabled={isLoading}
                        >
                            {isLoading ? "ログイン中..." : "コーチとしてログイン"}
                        </Button>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-blue-50 p-4">
            <Suspense fallback={<div>Loading...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
