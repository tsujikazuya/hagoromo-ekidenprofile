import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BottomNav } from "@/components/BottomNav";
import { SideNav } from "@/components/SideNav";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  weight: ["400", "500", "700"]
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "羽衣国際大学女子駅伝部アプリ",
  description: "羽衣国際大学女子駅伝部 コンディション管理・フォーム分析アプリ",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "羽衣駅伝アプリ",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "羽衣国際大学女子駅伝部アプリ",
    description: "羽衣国際大学女子駅伝部 コンディション管理・フォーム分析アプリ",
    url: "https://ekiden-ps20082g5-kazuyas-projects-6d1a24a0.vercel.app",
    siteName: "羽衣国際大学女子駅伝部",
    images: [
      {
        url: "/icons/icon-512x512.png",
        width: 512,
        height: 512,
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "羽衣国際大学女子駅伝部",
    description: "羽衣国際大学女子駅伝部 コンディション管理アプリ",
    images: ["/icons/icon-512x512.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("auth_session");
  let role = "player";
  if (sessionCookie) {
    try {
      const session = JSON.parse(sessionCookie.value);
      role = session.role || "player";
    } catch (e) {}
  }

  return (
    <html lang="ja">
      <body className={`${inter.variable} ${notoSansJP.variable} font-sans antialiased`}>
        <SideNav role={role} />
        <main className="pb-20 md:pb-0 md:pl-64 min-h-screen bg-gray-50 dark:bg-black transition-all">
          {children}
        </main>
        <div className="md:hidden">
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
