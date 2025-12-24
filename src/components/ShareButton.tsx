"use client";

import { Share2, Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ShareButton() {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const shareData = {
            title: "羽衣国際大学女子駅伝部",
            text: "羽衣国際大学女子駅伝部 コンディション管理アプリ",
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error("Error sharing:", err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error("Failed to copy:", err);
            }
        }
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleShare}
            className="rounded-full hover:bg-gray-100"
            aria-label="シェア"
        >
            {copied ? (
                <Check className="w-5 h-5 text-green-600" />
            ) : (
                <Share2 className="w-5 h-5 text-gray-600" />
            )}
        </Button>
    );
}
