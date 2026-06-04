"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteAthlete } from "@/app/staff/actions";

export function DeleteAthleteButton({ athleteId, athleteName, role = "player" }: { athleteId: string, athleteName: string, role?: string }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        
        const targetName = role === "coach" ? "指導者" : "選手";
        if (window.confirm(`本当に「${athleteName}」を削除しますか？\nこの操作は元に戻せず、関連するすべての記録も削除されます。`)) {
            startTransition(async () => {
                try {
                    const res = await fetch(`/api/athletes/${athleteId}`, { method: 'DELETE' });
                    const result = await res.json();
                    
                    if (res.ok && result.success) {
                        router.push('/staff');
                        router.refresh();
                    } else {
                        alert("削除に失敗しました: " + (result.error || "不明なエラー"));
                    }
                } catch (e) {
                    alert("通信エラーにより削除できませんでした");
                }
            });
        }
    };

    return (
        <Button 
            type="button"
            variant="destructive" 
            onClick={handleDelete} 
            disabled={isPending}
            className="w-full sm:w-auto"
        >
            <Trash2 className="w-4 h-4 mr-2" />
            {isPending ? "削除中..." : `この${role === 'coach' ? '指導者' : '選手'}を削除する`}
        </Button>
    );
}
