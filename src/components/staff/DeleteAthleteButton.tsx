"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteAthlete } from "@/app/staff/actions";

export function DeleteAthleteButton({ athleteId, athleteName }: { athleteId: string, athleteName: string }) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (window.confirm(`本当に「${athleteName}」を削除しますか？\nこの操作は元に戻せず、関連するすべての記録も削除されます。`)) {
            startTransition(async () => {
                const res = await deleteAthlete(athleteId);
                if (res?.success) {
                    router.push('/staff');
                    router.refresh();
                } else {
                    alert("削除に失敗しました: " + (res?.error || "不明なエラー"));
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
            {isPending ? "削除中..." : "この選手を削除する"}
        </Button>
    );
}
