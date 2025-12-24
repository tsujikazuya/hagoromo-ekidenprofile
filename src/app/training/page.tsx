export default function TrainingPage() {
    return (
        <div className="container mx-auto p-6 space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">トレーニング内容</h1>
                    <p className="text-gray-500 mt-2">日々のトレーニングメニューを確認・管理します</p>
                </div>
            </header>

            <div className="grid gap-6">
                <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/40 dark:border-zinc-800 shadow-sm">
                    <p className="text-center text-gray-500">トレーニング内容のコンテンツはここに表示されます</p>
                </div>
            </div>
        </div>
    );
}
