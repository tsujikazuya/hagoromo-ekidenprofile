import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Activity, Droplet, User, AlertCircle, Scale, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DeleteAthleteButton } from "@/components/staff/DeleteAthleteButton";
// 日付のフォーマットユーティリティ
const formatDate = (dateStr: Date) => {
    return new Intl.DateTimeFormat('ja-JP', { month: 'numeric', day: 'numeric', weekday: 'short' }).format(new Date(dateStr));
};

export default async function PlayerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    // URLの[id]パラメータから選手情報を取得
    const athlete = await prisma.athlete.findUnique({
        where: { id: id },
        include: {
            dailyConditions: {
                orderBy: { date: 'desc' },
                take: 7
            },
            trainingLoads: {
                orderBy: { date: 'desc' },
                take: 7
            },
            bloodTests: {
                orderBy: { date: 'desc' },
                take: 5
            },
            inBodyMeasurements: {
                orderBy: { date: 'desc' },
                take: 5
            }
        }
    });

    if (!athlete) {
        return notFound();
    }

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-6 max-w-4xl pb-24">
            {/* Header / Back Link */}
            <div className="flex items-center gap-4 mb-4">
                <Link href="/staff" className="text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-full text-sm font-medium">
                    <ArrowLeft className="w-4 h-4" /> 戻る
                </Link>
                <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex-1">
                    {athlete.role === 'coach' ? '指導者詳細記録' : '選手詳細記録'}
                </h1>
            </div>

            {/* Profile Section */}
            <Card className="shadow-sm border-0 bg-white">
                <CardContent className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <Avatar className="w-24 h-24 border-4 border-slate-50">
                            <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-indigo-100 to-blue-100 text-blue-700">
                                {athlete.name[0] || 'A'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-center md:text-left space-y-3">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{athlete.name}</h2>
                                <p className="text-slate-500 font-medium">羽衣国際大学 女子駅伝部</p>
                            </div>
                            <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-sm font-medium text-slate-700">
                                    <User className="w-4 h-4 text-slate-400" />
                                    ID: {athlete.loginId || '未設定'}
                                </span>
                                {athlete.historyAnemia && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-sm font-medium text-rose-700">
                                        <AlertCircle className="w-4 h-4 text-rose-500" />
                                        貧血既往歴あり
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {athlete.role !== 'coach' && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Conditions */}
                <Card className="shadow-sm border-0 h-full">
                    <CardHeader className="bg-slate-50/50 border-b pb-4">
                        <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                            <Activity className="w-5 h-5 text-indigo-500" />
                            最近のコンディション (直近7日間)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {athlete.dailyConditions.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {athlete.dailyConditions.map(cond => (
                                    <div key={cond.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 text-center">
                                                <p className="text-sm font-bold text-slate-700">{formatDate(cond.date)}</p>
                                            </div>
                                            <div className="pl-4 border-l-2 border-slate-200">
                                                <p className="text-sm font-medium text-slate-600">疲労度: <span className={`font-bold ${cond.subjectiveFatigue && cond.subjectiveFatigue > 60 ? 'text-orange-500' : 'text-slate-800'}`}>{cond.subjectiveFatigue ?? '-'}</span>/100</p>
                                                <p className="text-xs text-slate-400 mt-0.5">睡眠: {cond.sleepQuality ?? '-'} / 起床時心拍: {cond.restingHeartRate ?? '-'}bpm</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-400 text-sm">記録がありません</div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Training Loads */}
                <Card className="shadow-sm border-0 h-full">
                    <CardHeader className="bg-slate-50/50 border-b pb-4">
                        <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
                            <Calendar className="w-5 h-5 text-emerald-500" />
                            最近のトレーニング負荷 (直近7日間)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {athlete.trainingLoads.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {athlete.trainingLoads.map(load => (
                                    <div key={load.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 text-center">
                                                <p className="text-sm font-bold text-slate-700">{formatDate(load.date)}</p>
                                            </div>
                                            <div className="pl-4 border-l-2 border-slate-200">
                                                <p className="text-sm font-medium text-slate-600">走行距離: <span className="font-bold text-slate-800">{load.totalDistance ?? '-'}</span> km</p>
                                                {load.feedback && (
                                                    <p className="text-xs text-slate-500 mt-1 line-clamp-1 italic">「{load.feedback}」</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-medium">
                                                RPE: {load.rpeSession ?? '-'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-400 text-sm">記録がありません</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Blood Tests */}
            <Card className="shadow-sm border-0">
                <CardHeader className="bg-red-50/30 border-b border-red-100/50 pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2 text-red-800">
                            <Droplet className="w-5 h-5 text-red-500 fill-red-500/20" />
                            血液検査の記録 (直近5件)
                        </CardTitle>
                        <Button asChild size="sm" variant="outline" className="text-xs border-red-200 text-red-600 hover:bg-red-50">
                            <Link href="/staff/medical"><Plus className="w-3 h-3 mr-1" />入力</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {athlete.bloodTests.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 border-b">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">検査日</th>
                                        <th className="px-4 py-3 font-medium">Hb</th>
                                        <th className="px-4 py-3 font-medium">Ferritin</th>
                                        <th className="px-4 py-3 font-medium">Fe</th>
                                        <th className="px-4 py-3 font-medium">Ht</th>
                                        <th className="px-4 py-3 font-medium">CPK</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {athlete.bloodTests.map(test => (
                                        <tr key={test.id} className="hover:bg-slate-50/50">
                                            <td className="px-4 py-3 font-bold text-slate-700 whitespace-nowrap">{new Date(test.date).toLocaleDateString('ja-JP')}</td>
                                            <td className="px-4 py-3">
                                                <span className={test.hemoglobin < 12 ? 'text-red-600 font-bold' : 'text-slate-700'}>
                                                    {test.hemoglobin}
                                                    {test.hemoglobin < 12 && <AlertCircle className="inline w-3 h-3 ml-1 text-red-500" />}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={test.ferritin < 30 ? 'text-red-600 font-bold' : 'text-slate-700'}>
                                                    {test.ferritin}
                                                    {test.ferritin < 30 && <AlertCircle className="inline w-3 h-3 ml-1 text-red-500" />}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">{test.serumIron ?? <span className="text-slate-300">—</span>}</td>
                                            <td className="px-4 py-3 text-slate-600">{test.hematocrit ?? <span className="text-slate-300">—</span>}</td>
                                            <td className="px-4 py-3 text-slate-600">{test.cpk ?? <span className="text-slate-300">—</span>}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-8 text-center space-y-3">
                            <p className="text-slate-400 text-sm">記録がありません</p>
                            <Button asChild size="sm" variant="outline" className="text-xs">
                                <Link href="/staff/medical">血液検査データを入力する</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* InBody Measurements */}
            <Card className="shadow-sm border-0">
                <CardHeader className="bg-blue-50/30 border-b border-blue-100/50 pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
                            <Scale className="w-5 h-5 text-blue-500" />
                            インボディ測定記録 (直近5件)
                        </CardTitle>
                        <Button asChild size="sm" variant="outline" className="text-xs border-blue-200 text-blue-600 hover:bg-blue-50">
                            <Link href="/staff/medical?tab=inbody"><Plus className="w-3 h-3 mr-1" />入力</Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {athlete.inBodyMeasurements.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {athlete.inBodyMeasurements.map(m => (
                                <div key={m.id} className="p-4 hover:bg-slate-50/50">
                                    <p className="text-sm font-bold text-slate-600 mb-3">{new Date(m.date).toLocaleDateString('ja-JP')}</p>
                                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                                        {m.weight != null && (
                                            <div className="bg-white border border-slate-100 rounded-lg p-2 text-center shadow-sm">
                                                <p className="text-[9px] text-slate-400 font-bold">体重</p>
                                                <p className="text-sm font-black text-slate-800">{m.weight}<span className="text-[9px] font-normal text-slate-400">kg</span></p>
                                            </div>
                                        )}
                                        {m.skeletalMuscleMass != null && (
                                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 text-center shadow-sm">
                                                <p className="text-[9px] text-blue-500 font-bold">骨格筋量</p>
                                                <p className="text-sm font-black text-blue-700">{m.skeletalMuscleMass}<span className="text-[9px] font-normal text-blue-400">kg</span></p>
                                            </div>
                                        )}
                                        {m.bodyFatPercent != null && (
                                            <div className={`border rounded-lg p-2 text-center shadow-sm ${m.bodyFatPercent < 10 ? 'bg-orange-50 border-orange-100' : 'bg-white border-slate-100'}`}>
                                                <p className="text-[9px] text-slate-400 font-bold">体脂肪率</p>
                                                <p className={`text-sm font-black ${m.bodyFatPercent < 10 ? 'text-orange-600' : 'text-slate-800'}`}>
                                                    {m.bodyFatPercent}<span className="text-[9px] font-normal text-slate-400">%</span>
                                                </p>
                                            </div>
                                        )}
                                        {m.bodyFatMass != null && (
                                            <div className="bg-white border border-slate-100 rounded-lg p-2 text-center shadow-sm">
                                                <p className="text-[9px] text-slate-400 font-bold">体脂肪量</p>
                                                <p className="text-sm font-black text-slate-800">{m.bodyFatMass}<span className="text-[9px] font-normal text-slate-400">kg</span></p>
                                            </div>
                                        )}
                                        {m.bmi != null && (
                                            <div className="bg-white border border-slate-100 rounded-lg p-2 text-center shadow-sm">
                                                <p className="text-[9px] text-slate-400 font-bold">BMI</p>
                                                <p className="text-sm font-black text-slate-800">{m.bmi}</p>
                                            </div>
                                        )}
                                        {m.bmr != null && (
                                            <div className="bg-white border border-slate-100 rounded-lg p-2 text-center shadow-sm">
                                                <p className="text-[9px] text-slate-400 font-bold">基礎代謝</p>
                                                <p className="text-sm font-black text-slate-800">{m.bmr}<span className="text-[9px] font-normal text-slate-400">kcal</span></p>
                                            </div>
                                        )}
                                    </div>
                                    {m.notes && <p className="text-xs text-slate-400 mt-2 italic">「{m.notes}」</p>}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center space-y-3">
                            <p className="text-slate-400 text-sm">記録がありません</p>
                            <Button asChild size="sm" variant="outline" className="text-xs">
                                <Link href="/staff/medical">インボディデータを入力する</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
                </>
            )}

            {/* Danger Zone: Delete User */}
            <Card className="border-rose-200 bg-rose-50/50 shadow-sm mt-12">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-rose-800">メンバーの削除</h3>
                            <p className="text-sm text-rose-600 mt-1">この操作は取り消せません。このアカウントとすべての記録が永久に削除されます。</p>
                        </div>
                        <DeleteAthleteButton athleteId={athlete.id} athleteName={athlete.name} role={athlete.role} />
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
