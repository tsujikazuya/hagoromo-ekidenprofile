
"use client";

import { useEffect, useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trash2, UserPlus, ArrowLeft, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { deleteAthlete } from "@/app/staff/actions";
import { useRouter } from "next/navigation";

interface Athlete {
    id: string;
    name: string;
    loginId: string | null;
    role: string;
    createdAt: string;
}

export default function MemberManagementPage() {
    const [members, setMembers] = useState<Athlete[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/athletes');
            const data = await res.json();
            setMembers(data);
        } catch (e) {
            console.error("Failed to fetch members:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (!window.confirm(`本当に「${name}」を削除しますか？\n関連するすべての記録も削除されます。`)) return;

        try {
            const res = await fetch(`/api/athletes/${id}`, { method: 'DELETE' });
            const result = await res.json();
            
            if (res.ok && result.success) {
                setMembers(prev => prev.filter(m => m.id !== id));
                router.refresh();
            } else {
                alert("削除に失敗しました: " + (result.error || "不明なエラー"));
            }
        } catch (e) {
            console.error("Delete error:", e);
            alert("通信エラーにより削除できませんでした");
        }
    };

    const filteredMembers = members.filter(m => 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.loginId && m.loginId.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="container mx-auto p-4 md:p-8 space-y-6 max-w-5xl pb-24">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/staff">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">メンバー管理</h1>
                        <p className="text-sm text-slate-500">選手・指導者の追加、編集、削除</p>
                    </div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm gap-2">
                    <UserPlus className="w-4 h-4" />
                    新規メンバー追加
                </Button>
            </header>

            <Card className="shadow-sm border-0 overflow-hidden">
                <CardHeader className="bg-slate-50 border-b pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="text-lg text-slate-700">登録済みメンバー一覧</CardTitle>
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input 
                                placeholder="名前・IDで検索..." 
                                className="pl-9 bg-white" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="p-12 text-center">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500 mb-2" />
                            <p className="text-slate-400 text-sm">データを読み込み中...</p>
                        </div>
                    ) : filteredMembers.length > 0 ? (
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow>
                                    <TableHead className="w-[80px]">アイコン</TableHead>
                                    <TableHead>名前</TableHead>
                                    <TableHead>ログインID</TableHead>
                                    <TableHead>ロール</TableHead>
                                    <TableHead>登録日</TableHead>
                                    <TableHead className="text-right">操作</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredMembers.map((member) => (
                                    <TableRow key={member.id} className="hover:bg-slate-50/50 transition-colors">
                                        <TableCell>
                                            <Avatar className="w-8 h-8">
                                                <AvatarFallback className={member.role === 'coach' ? "bg-blue-100 text-blue-700 font-bold" : "bg-slate-100 text-slate-600"}>
                                                    {member.name[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`/staff/player/${member.id}`} className="font-bold text-slate-800 hover:text-blue-600 transition-colors">
                                                {member.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-slate-500 font-mono text-xs">
                                            {member.loginId || "-"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={member.role === 'coach' ? "default" : "secondary"} className={member.role === 'coach' ? "bg-blue-500" : ""}>
                                                {member.role === 'coach' ? '指導者' : '選手'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-400 text-xs">
                                            {new Date(member.createdAt).toLocaleDateString('ja-JP')}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="text-rose-400 hover:text-rose-600 hover:bg-rose-50"
                                                onClick={() => handleDelete(member.id, member.name)}
                                                disabled={isPending}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="p-12 text-center text-slate-400">
                            メンバーが見つかりませんでした
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
