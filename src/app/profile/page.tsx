import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, Settings, User } from "lucide-react";
import { WeeklyDistanceChart } from "@/components/charts/WeeklyDistanceChart";
import { ConditionTrendChart } from "@/components/charts/ConditionTrendChart";
import { logoutAction } from "@/app/auth/actions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const cookieStore = await cookies();
    const sessionData = cookieStore.get("auth_session")?.value;
    
    if (!sessionData) {
        redirect("/login");
    }

    const user = JSON.parse(sessionData);
    const isCoach = user.role === 'coach' || user.role === 'staff';

    return (
        <div className="p-4 space-y-6 pb-24">
            <h1 className="text-xl font-bold">マイページ</h1>

            <Card>
                <CardContent className="p-6 flex flex-col items-center space-y-4">
                    <Avatar className="w-24 h-24 border-4 border-slate-50">
                        <AvatarFallback className={`text-3xl font-bold ${isCoach ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                            {user.name ? user.name[0] : <User className="w-8 h-8" />}
                        </AvatarFallback>
                    </Avatar>

                    <div className="text-center w-full space-y-2">
                        <h2 className="text-2xl font-black text-slate-800">{user.name}</h2>
                        <p className="text-slate-500 font-medium">{isCoach ? "専門スタッフ・指導者" : "羽衣国際大学 女子駅伝部"}</p>
                        <p className="text-sm text-slate-400 mt-1">ログインID: {user.loginId || "未設定"}</p>
                    </div>
                </CardContent>
            </Card>

            {!isCoach && (
                <div className="space-y-4">
                    <h3 className="font-bold text-gray-900">データ分析</h3>
                    <WeeklyDistanceChart />
                    <ConditionTrendChart />
                </div>
            )}

            <div className="space-y-4">
                <h3 className="font-bold text-gray-900">設定・その他</h3>
                <Card>
                    <CardContent className="p-0 divide-y">
                        <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 text-left">
                            <div className="flex items-center gap-3">
                                <Settings className="w-5 h-5 text-gray-500" />
                                <span>アプリ設定</span>
                            </div>
                        </button>
                        <form action={logoutAction} className="w-full">
                            <button type="submit" className="w-full p-4 flex items-center justify-between hover:bg-gray-50 text-left text-red-600">
                                <div className="flex items-center gap-3">
                                    <LogOut className="w-5 h-5" />
                                    <span>ログアウト</span>
                                </div>
                            </button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
