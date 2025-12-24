"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, UserPlus, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState<"player" | "coach">("player");
    const [formData, setFormData] = useState({
        name: "",
        studentId: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError("パスワードが一致しません");
            setIsLoading(false);
            return;
        }

        if (formData.password.length < 4) {
            setError("パスワードは4文字以上で設定してください");
            setIsLoading(false);
            return;
        }

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        try {
            // Get existing users
            const existingUsersStr = localStorage.getItem("ekiden_users");
            const existingUsers = existingUsersStr ? JSON.parse(existingUsersStr) : [];

            // Check if ID already exists
            if (existingUsers.some((u: any) => u.studentId === formData.studentId)) {
                setError("この学籍番号は既に登録されています");
                setIsLoading(false);
                return;
            }

            // Save new user
            const newUser = {
                name: formData.name,
                studentId: formData.studentId,
                password: formData.password,
                role: role,
                createdAt: new Date().toISOString()
            };

            existingUsers.push(newUser);
            localStorage.setItem("ekiden_users", JSON.stringify(existingUsers));

            // Redirect to login
            router.push("/login?registered=true");
        } catch (err) {
            console.error(err);
            setError("エラーが発生しました");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-blue-50 p-4">
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
                        アカウントを作成して利用を開始します
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
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
                            <Label htmlFor="name">氏名</Label>
                            <Input
                                id="name"
                                placeholder="例: 羽衣 花子"
                                required
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="studentId">{role === "player" ? "学籍番号 (ログインID)" : "ID名 (ログインID)"}</Label>
                            <Input
                                id="studentId"
                                placeholder={role === "player" ? "例: 1234567" : "例: tanaka_coach"}
                                required
                                value={formData.studentId}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">パスワード</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="4文字以上"
                                required
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">パスワード (確認)</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="もう一度入力"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded text-center">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700"
                            disabled={isLoading}
                        >
                            {isLoading ? "登録中..." : "登録する"}
                        </Button>
                    </form>

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
