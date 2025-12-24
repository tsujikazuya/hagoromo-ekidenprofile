import { Calendar, AlertCircle, TrendingUp } from 'lucide-react';

export default function ManagerDashboard() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Upcoming Deadlines Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-pink-500/30 transition-all">
                <div className="absolute right-0 top-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                    <AlertCircle className="w-16 h-16 text-pink-500" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg text-pink-600 dark:text-pink-400">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100">提出期限</h3>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">関西学生駅伝</span>
                        <span className="font-bold text-pink-600">あと3日</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-1.5">
                        <div className="bg-pink-500 h-1.5 rounded-full w-3/4 animate-pulse"></div>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">エントリーシートの確認が必要です</p>
                </div>
            </div>

            {/* Today's Schedule Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-blue-500/30 transition-all">
                <div className="absolute right-0 top-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Calendar className="w-16 h-16 text-blue-500" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                        <Calendar className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100">今日の予定</h3>
                </div>
                <div className="space-y-1">
                    <p className="font-bold text-lg text-gray-800 dark:text-gray-100">16:30 メインG</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">ポイント練習 (400m x 10)</p>
                    <div className="mt-2 flex gap-2">
                        <span className="text-xs bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded text-gray-600 dark:text-gray-400">雨天決行</span>
                    </div>
                </div>
            </div>

            {/* Team Status Card */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800 shadow-sm relative overflow-hidden group hover:border-green-500/30 transition-all">
                <div className="absolute right-0 top-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                    <TrendingUp className="w-16 h-16 text-green-500" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                        <TrendingUp className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100">チーム状況</h3>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">体調報告</span>
                        <span className="font-bold text-gray-900 dark:text-gray-100">18/20 済</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">怪我・不調</span>
                        <span className="font-bold text-orange-500">2名</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1 font-medium">概ね良好です</p>
                </div>
            </div>
        </div>
    );
}
