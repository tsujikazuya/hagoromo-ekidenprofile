import ManagerChat from '@/components/ManagerChat';
import ManagerDashboard from '@/components/ManagerDashboard';

export default function ManagerPage() {
    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black p-4 pb-24">
            <div className="max-w-4xl mx-auto space-y-6">
                <header className="mb-0">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-600">
                        Manager Assistant
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                        事務作業・連絡調整サポート
                    </p>
                </header>

                <ManagerDashboard />
                <ManagerChat />
            </div>
        </div>
    );
}
