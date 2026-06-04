"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft, Droplet, Scale, Save, Loader2, Trash2,
    CheckCircle2, AlertCircle, ChevronDown, ChevronUp
} from "lucide-react";
import Link from "next/link";

interface Athlete {
    id: string;
    name: string;
    loginId: string | null;
}

interface BloodTest {
    id: string;
    date: string;
    hemoglobin: number;
    ferritin: number;
    serumIron: number | null;
    tibc: number | null;
    rbc: number | null;
    hematocrit: number | null;
    cpk: number | null;
}

interface InBodyMeasurement {
    id: string;
    date: string;
    weight: number | null;
    skeletalMuscleMass: number | null;
    bodyFatMass: number | null;
    bodyFatPercent: number | null;
    bmi: number | null;
    totalBodyWater: number | null;
    proteinMass: number | null;
    mineralMass: number | null;
    bmr: number | null;
    muscleRightArm: number | null;
    muscleLeftArm: number | null;
    muscleTrunk: number | null;
    muscleRightLeg: number | null;
    muscleLeftLeg: number | null;
    notes: string | null;
}

const today = () => new Date().toISOString().split("T")[0];
const fmtDate = (d: string) => new Date(d).toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" });

function StatusBadge({ value, low, high, unit }: { value: number; low: number; high: number; unit: string }) {
    const isLow = value < low;
    const isHigh = value > high;
    return (
        <span className={`text-sm font-bold ${isLow ? "text-red-600" : isHigh ? "text-orange-500" : "text-emerald-600"}`}>
            {value} <span className="font-normal text-xs text-slate-400">{unit}</span>
            {isLow && <AlertCircle className="inline w-3 h-3 ml-1 text-red-500" />}
        </span>
    );
}

export default function MedicalDataPage() {
    const [athletes, setAthletes] = useState<Athlete[]>([]);
    const [selectedAthleteId, setSelectedAthleteId] = useState<string>("");
    const [tab, setTab] = useState("blood");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    // Blood test history
    const [bloodTests, setBloodTests] = useState<BloodTest[]>([]);
    const [loadingBlood, setLoadingBlood] = useState(false);

    // InBody history
    const [inBodyList, setInBodyList] = useState<InBodyMeasurement[]>([]);
    const [loadingInBody, setLoadingInBody] = useState(false);

    // Blood test form
    const [bDate, setBDate] = useState(today());
    const [bHb, setBHb] = useState("");
    const [bFerritin, setBFerritin] = useState("");
    const [bFe, setBFe] = useState("");
    const [bTibc, setBTibc] = useState("");
    const [bRbc, setBRbc] = useState("");
    const [bHct, setBHct] = useState("");
    const [bCpk, setBCpk] = useState("");

    // InBody form
    const [ibDate, setIbDate] = useState(today());
    const [ibWeight, setIbWeight] = useState("");
    const [ibSMM, setIbSMM] = useState("");
    const [ibBFM, setIbBFM] = useState("");
    const [ibBFP, setIbBFP] = useState("");
    const [ibBMI, setIbBMI] = useState("");
    const [ibTBW, setIbTBW] = useState("");
    const [ibProtein, setIbProtein] = useState("");
    const [ibMineral, setIbMineral] = useState("");
    const [ibBMR, setIbBMR] = useState("");
    const [ibRA, setIbRA] = useState("");
    const [ibLA, setIbLA] = useState("");
    const [ibTrunk, setIbTrunk] = useState("");
    const [ibRL, setIbRL] = useState("");
    const [ibLL, setIbLL] = useState("");
    const [ibNotes, setIbNotes] = useState("");
    const [showSegment, setShowSegment] = useState(false);

    useEffect(() => {
        fetch("/api/athletes")
            .then(r => r.json())
            .then(d => setAthletes(d.filter((a: any) => a.role === "player")));
    }, []);

    useEffect(() => {
        if (!selectedAthleteId) return;
        setLoadingBlood(true);
        fetch(`/api/blood-tests?athleteId=${selectedAthleteId}`)
            .then(r => r.json())
            .then(d => { setBloodTests(d); setLoadingBlood(false); });
        setLoadingInBody(true);
        fetch(`/api/inbody?athleteId=${selectedAthleteId}`)
            .then(r => r.json())
            .then(d => { setInBodyList(d); setLoadingInBody(false); });
    }, [selectedAthleteId]);

    const flash = (ok: boolean) => {
        if (ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
    };

    const saveBlood = async () => {
        if (!selectedAthleteId || !bDate || !bHb || !bFerritin) {
            setError("選手・日付・Hb・Ferritinは必須です");
            return;
        }
        setError(""); setSaving(true);
        const res = await fetch("/api/blood-tests", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                athleteId: selectedAthleteId, date: bDate,
                hemoglobin: bHb, ferritin: bFerritin,
                serumIron: bFe, tibc: bTibc, rbc: bRbc, hematocrit: bHct, cpk: bCpk,
            }),
        });
        setSaving(false);
        if (res.ok) {
            const created = await res.json();
            setBloodTests(prev => [created, ...prev]);
            setBHb(""); setBFerritin(""); setBFe(""); setBTibc(""); setBRbc(""); setBHct(""); setBCpk("");
            flash(true);
        }
    };

    const saveInBody = async () => {
        if (!selectedAthleteId || !ibDate) {
            setError("選手と日付は必須です");
            return;
        }
        setError(""); setSaving(true);
        const res = await fetch("/api/inbody", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                athleteId: selectedAthleteId, date: ibDate,
                weight: ibWeight, skeletalMuscleMass: ibSMM, bodyFatMass: ibBFM,
                bodyFatPercent: ibBFP, bmi: ibBMI, totalBodyWater: ibTBW,
                proteinMass: ibProtein, mineralMass: ibMineral, bmr: ibBMR,
                muscleRightArm: ibRA, muscleLeftArm: ibLA, muscleTrunk: ibTrunk,
                muscleRightLeg: ibRL, muscleLeftLeg: ibLL, notes: ibNotes,
            }),
        });
        setSaving(false);
        if (res.ok) {
            const created = await res.json();
            setInBodyList(prev => [created, ...prev]);
            setIbWeight(""); setIbSMM(""); setIbBFM(""); setIbBFP(""); setIbBMI(""); setIbTBW("");
            setIbProtein(""); setIbMineral(""); setIbBMR(""); setIbRA(""); setIbLA(""); setIbTrunk(""); setIbRL(""); setIbLL(""); setIbNotes("");
            flash(true);
        }
    };

    const deleteBlood = async (id: string) => {
        if (!confirm("この血液検査データを削除しますか？")) return;
        const res = await fetch(`/api/blood-tests?id=${id}`, { method: "DELETE" });
        if (res.ok) setBloodTests(prev => prev.filter(t => t.id !== id));
    };

    const deleteInBody = async (id: string) => {
        if (!confirm("このインボディデータを削除しますか？")) return;
        const res = await fetch(`/api/inbody?id=${id}`, { method: "DELETE" });
        if (res.ok) setInBodyList(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/staff" className="flex items-center gap-1 text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-full text-sm font-medium shadow-sm">
                        <ArrowLeft className="w-4 h-4" /> 戻る
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800">医療データ入力</h1>
                        <p className="text-sm text-slate-500">血液検査・インボディ測定結果の記録</p>
                    </div>
                </div>

                {/* Athlete Selector */}
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-5">
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            <div className="flex-1 space-y-1.5 w-full">
                                <Label className="text-xs font-bold text-slate-500 tracking-wide">対象選手</Label>
                                <Select value={selectedAthleteId} onValueChange={setSelectedAthleteId}>
                                    <SelectTrigger className="bg-white h-11 text-sm">
                                        <SelectValue placeholder="選手を選択してください" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {athletes.map(a => (
                                            <SelectItem key={a.id} value={a.id}>
                                                {a.name}
                                                {a.loginId && <span className="text-slate-400 ml-2 text-xs">({a.loginId})</span>}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            {selectedAthleteId && (
                                <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-4 py-2 rounded-lg">
                                    <span className="font-bold text-slate-700">{athletes.find(a => a.id === selectedAthleteId)?.name}</span>
                                    <span>を選択中</span>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Feedback */}
                {saved && (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm font-bold">
                        <CheckCircle2 className="w-4 h-4" /> 保存しました
                    </div>
                )}
                {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-bold">
                        <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                )}

                <Tabs value={tab} onValueChange={setTab}>
                    <TabsList className="w-full grid grid-cols-2 h-12 bg-white border border-slate-200 shadow-sm rounded-xl p-1">
                        <TabsTrigger value="blood" className="rounded-lg font-bold data-[state=active]:bg-red-50 data-[state=active]:text-red-700">
                            <Droplet className="w-4 h-4 mr-2" />
                            血液検査
                        </TabsTrigger>
                        <TabsTrigger value="inbody" className="rounded-lg font-bold data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                            <Scale className="w-4 h-4 mr-2" />
                            インボディ
                        </TabsTrigger>
                    </TabsList>

                    {/* ───────────── 血液検査タブ ───────────── */}
                    <TabsContent value="blood" className="space-y-6 mt-6">
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="bg-red-50/60 border-b border-red-100 pb-4 rounded-t-xl">
                                <CardTitle className="text-red-800 flex items-center gap-2">
                                    <Droplet className="w-5 h-5 text-red-500" />
                                    血液検査データ入力
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-slate-500">採血日 <span className="text-red-500">*</span></Label>
                                    <Input type="date" value={bDate} onChange={e => setBDate(e.target.value)} className="max-w-xs" />
                                </div>

                                {/* 必須項目 */}
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-red-700 tracking-wide uppercase flex items-center gap-1.5">
                                        <span className="inline-block w-2 h-2 rounded-full bg-red-400" />
                                        主要項目（必須）
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-bold">Hb（ヘモグロビン）</Label>
                                            <div className="relative">
                                                <Input type="number" step="0.1" placeholder="12.5" value={bHb} onChange={e => setBHb(e.target.value)} className="pr-14" />
                                                <span className="absolute right-3 top-2.5 text-xs text-slate-400">g/dL</span>
                                            </div>
                                            <p className="text-[10px] text-slate-400">基準: 12.0以上</p>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-bold">Ferritin（フェリチン）</Label>
                                            <div className="relative">
                                                <Input type="number" step="0.1" placeholder="30.0" value={bFerritin} onChange={e => setBFerritin(e.target.value)} className="pr-16" />
                                                <span className="absolute right-3 top-2.5 text-xs text-slate-400">ng/mL</span>
                                            </div>
                                            <p className="text-[10px] text-slate-400">基準: 30以上（要注意: 20以下）</p>
                                        </div>
                                    </div>
                                </div>

                                {/* 任意項目 */}
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-slate-500 tracking-wide uppercase flex items-center gap-1.5">
                                        <span className="inline-block w-2 h-2 rounded-full bg-slate-300" />
                                        詳細項目（任意）
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-sm">血清鉄（Fe）</Label>
                                            <div className="relative">
                                                <Input type="number" step="0.1" placeholder="80" value={bFe} onChange={e => setBFe(e.target.value)} className="pr-16" />
                                                <span className="absolute right-3 top-2.5 text-xs text-slate-400">μg/dL</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-sm">TIBC（総鉄結合能）</Label>
                                            <div className="relative">
                                                <Input type="number" step="0.1" placeholder="300" value={bTibc} onChange={e => setBTibc(e.target.value)} className="pr-16" />
                                                <span className="absolute right-3 top-2.5 text-xs text-slate-400">μg/dL</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-sm">RBC（赤血球数）</Label>
                                            <div className="relative">
                                                <Input type="number" step="0.01" placeholder="4.5" value={bRbc} onChange={e => setBRbc(e.target.value)} className="pr-20" />
                                                <span className="absolute right-3 top-2.5 text-xs text-slate-400">10⁴/μL</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-sm">Ht（ヘマトクリット）</Label>
                                            <div className="relative">
                                                <Input type="number" step="0.1" placeholder="38.0" value={bHct} onChange={e => setBHct(e.target.value)} className="pr-8" />
                                                <span className="absolute right-3 top-2.5 text-xs text-slate-400">%</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-sm">CPK</Label>
                                            <div className="relative">
                                                <Input type="number" placeholder="150" value={bCpk} onChange={e => setBCpk(e.target.value)} className="pr-10" />
                                                <span className="absolute right-3 top-2.5 text-xs text-slate-400">U/L</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={saveBlood}
                                    disabled={saving || !selectedAthleteId}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-11"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    血液検査データを保存
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Blood Test History */}
                        {selectedAthleteId && (
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="pb-4 border-b">
                                    <CardTitle className="text-base text-slate-700">過去の検査記録</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {loadingBlood ? (
                                        <div className="p-8 text-center text-slate-400 text-sm">読み込み中...</div>
                                    ) : bloodTests.length === 0 ? (
                                        <div className="p-8 text-center text-slate-400 text-sm">記録がありません</div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead className="bg-slate-50 text-slate-500 border-b">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left font-medium">採血日</th>
                                                        <th className="px-4 py-3 text-left font-medium">Hb</th>
                                                        <th className="px-4 py-3 text-left font-medium">Ferritin</th>
                                                        <th className="px-4 py-3 text-left font-medium">Fe</th>
                                                        <th className="px-4 py-3 text-left font-medium">Ht</th>
                                                        <th className="px-4 py-3 text-left font-medium">CPK</th>
                                                        <th className="px-4 py-3"></th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {bloodTests.map(t => (
                                                        <tr key={t.id} className="hover:bg-slate-50">
                                                            <td className="px-4 py-3 font-bold text-slate-700 whitespace-nowrap">{fmtDate(t.date)}</td>
                                                            <td className="px-4 py-3">
                                                                <StatusBadge value={t.hemoglobin} low={12} high={16} unit="g/dL" />
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <StatusBadge value={t.ferritin} low={30} high={200} unit="ng/mL" />
                                                            </td>
                                                            <td className="px-4 py-3 text-slate-600">{t.serumIron ?? <span className="text-slate-300">—</span>}</td>
                                                            <td className="px-4 py-3 text-slate-600">{t.hematocrit ?? <span className="text-slate-300">—</span>}</td>
                                                            <td className="px-4 py-3 text-slate-600">{t.cpk ?? <span className="text-slate-300">—</span>}</td>
                                                            <td className="px-4 py-3">
                                                                <button onClick={() => deleteBlood(t.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* ───────────── インボディタブ ───────────── */}
                    <TabsContent value="inbody" className="space-y-6 mt-6">
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="bg-blue-50/60 border-b border-blue-100 pb-4 rounded-t-xl">
                                <CardTitle className="text-blue-800 flex items-center gap-2">
                                    <Scale className="w-5 h-5 text-blue-500" />
                                    インボディ測定結果入力
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-slate-500">測定日 <span className="text-red-500">*</span></Label>
                                    <Input type="date" value={ibDate} onChange={e => setIbDate(e.target.value)} className="max-w-xs" />
                                </div>

                                {/* 基本体組成 */}
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-blue-700 tracking-wide uppercase flex items-center gap-1.5">
                                        <span className="inline-block w-2 h-2 rounded-full bg-blue-400" />
                                        基本体組成
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-bold">体重</Label>
                                            <div className="relative">
                                                <Input type="number" step="0.1" placeholder="52.0" value={ibWeight} onChange={e => setIbWeight(e.target.value)} className="pr-8" />
                                                <span className="absolute right-3 top-2.5 text-xs text-slate-400">kg</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-bold">骨格筋量</Label>
                                            <div className="relative">
                                                <Input type="number" step="0.1" placeholder="23.5" value={ibSMM} onChange={e => setIbSMM(e.target.value)} className="pr-8" />
                                                <span className="absolute right-3 top-2.5 text-xs text-slate-400">kg</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-bold">体脂肪量</Label>
                                            <div className="relative">
                                                <Input type="number" step="0.1" placeholder="9.0" value={ibBFM} onChange={e => setIbBFM(e.target.value)} className="pr-8" />
                                                <span className="absolute right-3 top-2.5 text-xs text-slate-400">kg</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-bold">体脂肪率</Label>
                                            <div className="relative">
                                                <Input type="number" step="0.1" placeholder="17.5" value={ibBFP} onChange={e => setIbBFP(e.target.value)} className="pr-8" />
                                                <span className="absolute right-3 top-2.5 text-xs text-slate-400">%</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-bold">BMI</Label>
                                            <div className="relative">
                                                <Input type="number" step="0.1" placeholder="19.5" value={ibBMI} onChange={e => setIbBMI(e.target.value)} className="pr-12" />
                                                <span className="absolute right-3 top-2.5 text-xs text-slate-400">kg/m²</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-sm font-bold">基礎代謝</Label>
                                            <div className="relative">
                                                <Input type="number" placeholder="1250" value={ibBMR} onChange={e => setIbBMR(e.target.value)} className="pr-12" />
                                                <span className="absolute right-3 top-2.5 text-xs text-slate-400">kcal</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 体水分・栄養成分 */}
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-slate-500 tracking-wide uppercase flex items-center gap-1.5">
                                        <span className="inline-block w-2 h-2 rounded-full bg-slate-300" />
                                        体水分・栄養成分（任意）
                                    </p>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-sm">体水分量</Label>
                                            <div className="relative">
                                                <Input type="number" step="0.1" placeholder="28.0" value={ibTBW} onChange={e => setIbTBW(e.target.value)} className="pr-6" />
                                                <span className="absolute right-3 top-2.5 text-xs text-slate-400">L</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-sm">タンパク質</Label>
                                            <div className="relative">
                                                <Input type="number" step="0.1" placeholder="7.5" value={ibProtein} onChange={e => setIbProtein(e.target.value)} className="pr-8" />
                                                <span className="absolute right-3 top-2.5 text-xs text-slate-400">kg</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-sm">無機塩</Label>
                                            <div className="relative">
                                                <Input type="number" step="0.01" placeholder="2.5" value={ibMineral} onChange={e => setIbMineral(e.target.value)} className="pr-8" />
                                                <span className="absolute right-3 top-2.5 text-xs text-slate-400">kg</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* セグメント別筋肉量 */}
                                <div className="space-y-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowSegment(!showSegment)}
                                        className="flex items-center gap-2 text-xs font-bold text-slate-500 tracking-wide uppercase hover:text-slate-700 transition-colors"
                                    >
                                        {showSegment ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        <span className="inline-block w-2 h-2 rounded-full bg-slate-300" />
                                        セグメント別筋肉量（任意）
                                    </button>
                                    {showSegment && (
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 p-4 bg-slate-50 rounded-xl">
                                            {[
                                                { label: "右腕", val: ibRA, set: setIbRA },
                                                { label: "左腕", val: ibLA, set: setIbLA },
                                                { label: "体幹", val: ibTrunk, set: setIbTrunk },
                                                { label: "右脚", val: ibRL, set: setIbRL },
                                                { label: "左脚", val: ibLL, set: setIbLL },
                                            ].map(({ label, val, set }) => (
                                                <div key={label} className="space-y-1.5">
                                                    <Label className="text-xs text-slate-500">{label}</Label>
                                                    <div className="relative">
                                                        <Input type="number" step="0.01" placeholder="0.00" value={val} onChange={e => set(e.target.value)} className="pr-8 text-sm" />
                                                        <span className="absolute right-2 top-2.5 text-xs text-slate-400">kg</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <Label className="text-sm">メモ</Label>
                                    <Textarea placeholder="特記事項があれば..." value={ibNotes} onChange={e => setIbNotes(e.target.value)} className="h-20 resize-none" />
                                </div>

                                <Button
                                    onClick={saveInBody}
                                    disabled={saving || !selectedAthleteId}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    インボディデータを保存
                                </Button>
                            </CardContent>
                        </Card>

                        {/* InBody History */}
                        {selectedAthleteId && (
                            <Card className="border-0 shadow-sm">
                                <CardHeader className="pb-4 border-b">
                                    <CardTitle className="text-base text-slate-700">過去の測定記録</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    {loadingInBody ? (
                                        <div className="p-8 text-center text-slate-400 text-sm">読み込み中...</div>
                                    ) : inBodyList.length === 0 ? (
                                        <div className="p-8 text-center text-slate-400 text-sm">記録がありません</div>
                                    ) : (
                                        <div className="divide-y divide-slate-100">
                                            {inBodyList.map(m => (
                                                <div key={m.id} className="p-4 hover:bg-slate-50 transition-colors">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <span className="font-bold text-slate-700">{fmtDate(m.date)}</span>
                                                        <button onClick={() => deleteInBody(m.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                                                        {m.weight != null && (
                                                            <div className="bg-white border border-slate-100 rounded-lg p-2.5 text-center">
                                                                <p className="text-[10px] text-slate-400 font-bold mb-1">体重</p>
                                                                <p className="text-sm font-black text-slate-800">{m.weight}<span className="text-xs font-normal text-slate-400 ml-0.5">kg</span></p>
                                                            </div>
                                                        )}
                                                        {m.skeletalMuscleMass != null && (
                                                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-2.5 text-center">
                                                                <p className="text-[10px] text-blue-500 font-bold mb-1">骨格筋量</p>
                                                                <p className="text-sm font-black text-blue-700">{m.skeletalMuscleMass}<span className="text-xs font-normal text-blue-400 ml-0.5">kg</span></p>
                                                            </div>
                                                        )}
                                                        {m.bodyFatPercent != null && (
                                                            <div className={`border rounded-lg p-2.5 text-center ${m.bodyFatPercent < 10 ? "bg-orange-50 border-orange-100" : "bg-white border-slate-100"}`}>
                                                                <p className="text-[10px] text-slate-400 font-bold mb-1">体脂肪率</p>
                                                                <p className={`text-sm font-black ${m.bodyFatPercent < 10 ? "text-orange-600" : "text-slate-800"}`}>
                                                                    {m.bodyFatPercent}<span className="text-xs font-normal text-slate-400 ml-0.5">%</span>
                                                                    {m.bodyFatPercent < 10 && <AlertCircle className="inline w-3 h-3 ml-1 text-orange-500" />}
                                                                </p>
                                                            </div>
                                                        )}
                                                        {m.bodyFatMass != null && (
                                                            <div className="bg-white border border-slate-100 rounded-lg p-2.5 text-center">
                                                                <p className="text-[10px] text-slate-400 font-bold mb-1">体脂肪量</p>
                                                                <p className="text-sm font-black text-slate-800">{m.bodyFatMass}<span className="text-xs font-normal text-slate-400 ml-0.5">kg</span></p>
                                                            </div>
                                                        )}
                                                        {m.bmi != null && (
                                                            <div className="bg-white border border-slate-100 rounded-lg p-2.5 text-center">
                                                                <p className="text-[10px] text-slate-400 font-bold mb-1">BMI</p>
                                                                <p className="text-sm font-black text-slate-800">{m.bmi}</p>
                                                            </div>
                                                        )}
                                                        {m.bmr != null && (
                                                            <div className="bg-white border border-slate-100 rounded-lg p-2.5 text-center">
                                                                <p className="text-[10px] text-slate-400 font-bold mb-1">基礎代謝</p>
                                                                <p className="text-sm font-black text-slate-800">{m.bmr}<span className="text-xs font-normal text-slate-400 ml-0.5">kcal</span></p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {m.notes && (
                                                        <p className="text-xs text-slate-500 mt-2 italic">「{m.notes}」</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
