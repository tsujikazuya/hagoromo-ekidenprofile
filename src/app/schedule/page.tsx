import { prisma } from "@/lib/prisma";
import { ScheduleClient } from "./ScheduleClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Next.js App Routerでは、Pageコンポーネントで直接DBからデータを取得できます
export default async function SchedulePage() {
    // 1. ユーザーのセッション（ログイン情報）を確認
    const cookieStore = await cookies();
    const sessionStr = cookieStore.get("auth_session")?.value;
    
    if (!sessionStr) {
        redirect("/login");
    }

    const user = JSON.parse(sessionStr);
    // 権限チェック: 指導者・スタッフは編集可能、選手は閲覧のみ
    const isCoach = user.role === "coach" || user.role === "staff";

    // 2. データベースからすべてのスケジュールを取得
    const schedules = await prisma.schedule.findMany({
        orderBy: { date: "asc" }
    });

    return (
        <ScheduleClient 
            initialEvents={schedules} 
            isCoach={isCoach} 
        />
    );
}
