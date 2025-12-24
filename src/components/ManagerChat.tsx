'use client';

import { useChat } from '@ai-sdk/react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function ManagerChat() {
    // @ts-ignore - useChat types might be mismatched in v5
    // @ts-ignore - types mismatch with installed SDK version
    const { messages, append, status } = useChat();
    const isLoading = status === 'submitted' || status === 'streaming';
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const currentInput = input;
        setInput('');

        await append({
            role: 'user',
            content: currentInput,
        });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] bg-white dark:bg-zinc-900 rounded-3xl shadow-xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                    <Bot className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="font-bold text-lg">AI主務</h2>
                    <p className="text-xs text-white/90">羽衣国際大学女子駅伝部 運営サポート</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50 dark:bg-zinc-900/50">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-zinc-400 space-y-4">
                        <Bot className="w-12 h-12 opacity-20" />
                        <p className="text-sm font-medium">連盟からの連絡や、作成したい文書について教えてください</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs w-full max-w-lg">
                            <button
                                onClick={() => {
                                    setInput('次の大会のエントリー締切はいつですか？また、必要な書類は何がありますか？チェックリストを作成してください。');
                                }}
                                className="p-3 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-pink-500 transition-colors text-left"
                            >
                                📅 エントリー締切と必要書類
                            </button>
                            <button
                                onClick={() => {
                                    setInput('選手資格（登録規定、標準記録突破など）に関する注意点を教えてください。');
                                }}
                                className="p-3 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-pink-500 transition-colors text-left"
                            >
                                ⚠️ 選手資格の注意点
                            </button>
                            <button
                                onClick={() => {
                                    setInput('遠征時の宿泊・移動・食事の手配について、確認すべき事項とスケジュール案を作成してください。');
                                }}
                                className="p-3 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-pink-500 transition-colors text-left"
                            >
                                🏨 宿泊・移動・食事
                            </button>
                            <button
                                onClick={() => {
                                    setInput('大会当日の主務の動きと、持ち物・確認事項のチェックリストを作成してください。漏れがないように詳細にお願いします。');
                                }}
                                className="p-3 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-pink-500 transition-colors text-left"
                            >
                                📋 大会当日の主務チェックリスト
                            </button>
                        </div>
                    </div>
                )}

                {messages.map((m) => (
                    <div
                        key={m.id}
                        className={`flex w-full ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`flex max-w-[85%] md:max-w-[75%] rounded-2xl p-4 shadow-sm ${m.role === 'user'
                                ? 'bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-tr-sm'
                                : 'bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 text-zinc-800 dark:text-zinc-100 rounded-tl-sm'
                                }`}
                        >
                            <div className="flex gap-3">
                                <div className={`mt-1 min-w-[24px] ${m.role === 'user' ? 'order-2' : 'order-1'}`}>
                                    {m.role === 'user' ? <User className="w-5 h-5 opacity-80" /> : <Bot className="w-5 h-5 text-pink-500" />}
                                </div>
                                <div className={`space-y-1 text-sm leading-relaxed overflow-x-auto ${m.role === 'user' ? 'order-1' : 'order-2'}`}>
                                    <div className="whitespace-pre-wrap font-sans">
                                        {(m as any).content}
                                    </div>
                                    {/* Render Tool Invocations */}
                                    {!!(m as any).toolInvocations?.length && (
                                        <div className="mt-2 space-y-2">
                                            {(m as any).toolInvocations.map((toolInvocation: any) => {
                                                const toolCallId = toolInvocation.toolCallId;
                                                const addResult = ('result' in toolInvocation);

                                                return (
                                                    <div key={toolCallId} className="text-xs bg-zinc-100 dark:bg-zinc-700/50 p-2 rounded-lg border border-zinc-200 dark:border-zinc-700">
                                                        <div className="flex items-center gap-2 font-medium text-zinc-600 dark:text-zinc-300">
                                                            {addResult ? (
                                                                <span className="text-green-500">✓</span>
                                                            ) : (
                                                                <Loader2 className="w-3 h-3 animate-spin" />
                                                            )}
                                                            <span>{toolInvocation.toolName}</span>
                                                        </div>
                                                        {addResult && (
                                                            <div className="mt-1 text-zinc-500 dark:text-zinc-400 pl-4 font-mono">
                                                                Result: {JSON.stringify(toolInvocation.result).slice(0, 50)}...
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start w-full">
                        <div className="bg-white dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-3">
                            <Bot className="w-5 h-5 text-pink-500" />
                            <div className="flex gap-1">
                                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800">
                <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
                    <input
                        className="flex-1 p-4 pr-12 rounded-xl bg-zinc-50 dark:bg-zinc-950 border-2 border-zinc-100 dark:border-zinc-800 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all placeholder:text-zinc-400 text-sm"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="AI主務に指示を入力してください..."
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 p-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:hover:bg-pink-500 transition-colors shadow-lg shadow-pink-500/20"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </form>
            </div>
        </div>
    );
}
