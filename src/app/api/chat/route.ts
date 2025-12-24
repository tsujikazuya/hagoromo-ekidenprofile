import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = streamText({
        model: google('gemini-1.5-flash'),
        system: `
      あなたは「羽衣国際大学女子駅伝部」の専属「主務支援AI」です。
      女子駅伝部員が競技と学業に集中できるよう、以下の3つの役割を切り替えて高度なサポートを行います。

      【役割1: 主務業務サポート (Daily Manager Support)】
      毎日の選手の体調、練習、学業状況を統合し、主務がその日に対応すべきことを「優先順位付き」で提示します。
      - **入力データ**: 選手別体調(5段階/RPE/睡眠/痛み)、練習内容(距離/強度)、学業予定(試験/レポート)、直近3日間の変化
      - **出力条件**:
        1. **要注意選手**: 理由を添えて提示（例：「A選手：RPEが高く睡眠不足、怪我のリスクあり」）
        2. **主務のアクション**: 声かけ、情報共有、調整など具体的な行動
        3. **監督への共有事項**: 3行以内で簡潔に
      - **表現**: 選手への配慮と、チーム運営の円滑化を最優先する。

      【役割2: 大会運営サポート (Tournament Operations)】
      大会要項を読み解き（または知識として持ち）、主務向けの実務リストを作成します。
      - **出力内容**:
        - エントリー締切と必要書類リスト
        - 選手資格の注意点（登録規定、標準記録など）
        - 宿泊・移動・食事の準備項目
        - 大会当日の主務チェックリスト
      - **条件**: 漏れ防止を最優先し、主務がそのままチェックリストとして使える形式で出力する。

      【役割3: 大学運営文書作成 (Admin Document Creation)】
      公欠申請や学業配慮依頼文など、大学教員や事務局向けの公的な文書を作成します。
      - **条件**:
        - 丁寧かつ簡潔なビジネス文書/公用文スタイル
        - 競技事情を知らない教職員にも伝わるよう、専門用語は補足するか平易にする
        - 感謝と誠意を含める

      【共通の振る舞い】
      - 常に「羽衣国際大学女子駅伝部」の一員としての誇りを持ち、冷静かつ温かみのある対応をする。
      - 曖昧な指示には、必要な情報を具体的に質問し返す。
      - 医療行為（診断・治療）は行わず、専門家への受診を促す。
    `,
        messages,
        tools: {
            // --- EXISTING TOOLS ---
            getSchedule: tool({
                description: 'Get the team schedule for a specific date range. Returns a list of events.',
                parameters: z.object({
                    startDate: z.string().describe('Start date in YYYY-MM-DD format'),
                    endDate: z.string().describe('End date in YYYY-MM-DD format'),
                }),
                // @ts-ignore
                execute: async ({ startDate, endDate }) => {
                    console.log(`Getting schedule from ${startDate} to ${endDate}`);
                    return [
                        { date: startDate, title: '朝練習 (6:30)' },
                        { date: startDate, title: 'ミーティング (18:00)' },
                        { date: endDate, title: 'ポイント練習 (16:30)' },
                    ];
                },
            }),
            addScheduleEvent: tool({
                description: 'Add a new event to the team schedule.',
                parameters: z.object({
                    date: z.string().describe('Date in YYYY-MM-DD format'),
                    title: z.string().describe('Title of the event'),
                    description: z.string().optional().describe('Description of the event'),
                }),
                // @ts-ignore
                execute: async ({ date, title, description }) => {
                    console.log(`Adding event: ${title} on ${date}`);
                    return { success: true, message: `Event "${title}" added to schedule on ${date}.` };
                },
            }),
            sendLineNotification: tool({
                description: 'Send a notification to the Ekiden Club LINE group.',
                parameters: z.object({
                    message: z.string().describe('The message content to send'),
                    urgent: z.boolean().optional().describe('Whether this is an urgent notification'),
                }),
                // @ts-ignore
                execute: async ({ message, urgent }) => {
                    console.log(`Sending LINE notification: ${message} (Urgent: ${urgent})`);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return { success: true, status: 'sent', timestamp: new Date().toISOString() };
                },
            }),
            checkEntryDeadlines: tool({
                description: 'Check for upcoming entry deadlines for matches from the database.',
                parameters: z.object({}),
                // @ts-ignore
                execute: async () => {
                    return [
                        { match: '関西学生対校女子駅伝', deadline: '2025-09-10', status: 'upcoming' },
                        { match: '全日本大学女子駅伝', deadline: '2025-10-05', status: 'upcoming' },
                    ];
                },
            }),
            searchDrive: tool({
                description: 'Search for documents in the team Google Drive. Useful for finding guidelines, entry forms, or past records.',
                parameters: z.object({
                    query: z.string().describe('Search keywords (e.g., "大会要項", "記録")'),
                }),
                // @ts-ignore
                execute: async ({ query }) => {
                    console.log(`Searching Google Drive for: ${query}`);
                    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API latency

                    if (query.includes('要項') || query.includes('guide') || query.includes('rule')) {
                        return [
                            { name: '2025_Kansai_Ekiden_Guidelines.pdf', type: 'PDF', link: 'https://drive.google.com/thumbnail?id=123', reliability: 'High' },
                            { name: 'Entry_Form_Template.docx', type: 'DOCX', link: 'https://docs.google.com/document/d/456', reliability: 'Medium' }
                        ];
                    }
                    if (query.includes('記録') || query.includes('record') || query.includes('result')) {
                        return [
                            { name: '2024_Season_Records.xlsx', type: 'Spreadsheet', link: 'https://docs.google.com/spreadsheets/d/789', reliability: 'High' },
                            { name: 'Personal_Bests_Summary.pdf', type: 'PDF', link: 'https://drive.google.com/thumbnail?id=101', reliability: 'Medium' }
                        ];
                    }

                    return { message: "No specific documents found matching criteria. Try searching for '要項' or '記録'." };
                },
            }),

            // --- NEW TOOLS FOR NUTRITION AND TRAINING ---
            getRecentTrainingLogs: tool({
                description: 'Get recent training logs to analyze load and intensity. Useful for providing nutrition or recovery advice.',
                parameters: z.object({
                    days: z.number().optional().default(3).describe('Number of past days to retrieve'),
                }),
                // @ts-ignore
                execute: async ({ days }) => {
                    console.log(`Fetching training logs for past ${days} days`);
                    return [
                        { date: '2025-12-16', type: 'Interval', distance: '12km', time: '58min', rpe: 8, comment: '足が少し重かったが設定タイムはクリア。' },
                        { date: '2025-12-15', type: 'Jog', distance: '10km', time: '60min', rpe: 3, comment: 'リラックスして走れた。' },
                        { date: '2025-12-14', type: 'LSD', distance: '20km', time: '120min', rpe: 5, comment: '後半バテた。エネルギー不足かも。' },
                    ].slice(0, days);
                },
            }),
            getRecentNutritionLogs: tool({
                description: 'Get recent nutrition entries. Useful for analyzing dietary balance.',
                parameters: z.object({
                    offset: z.number().optional().default(0),
                }),
                // @ts-ignore
                execute: async () => {
                    return [
                        { date: '2025-12-16', meal: 'Breakfast', content: 'トースト、コーヒー、ヨーグルト', score: 3 },
                        { date: '2025-12-16', meal: 'Lunch', content: '学食のうどん、おにぎり', score: 4 },
                        { date: '2025-12-16', meal: 'Dinner', content: '豚肉の生姜焼き、サラダ、ご飯、味噌汁', score: 5 },
                    ];
                },
            }),
            getFormAnalysisHistory: tool({
                description: 'Get the latest form analysis results from video uploads.',
                parameters: z.object({}),
                // @ts-ignore
                execute: async () => {
                    return {
                        date: '2025-12-10',
                        videoUrl: 'https://example.com/video123.mp4',
                        overallScore: 82,
                        goodPoints: ['前傾姿勢が15度で安定している', '腕振りのリズムが良い'],
                        improvements: ['着地がヒールストライク気味（ブレーキがかかっている）', '左足の蹴り出しが少し弱い'],
                        balance: { left: 48, right: 52 }
                    };
                },
            }),
        },
    });

    return result.toTextStreamResponse();
}
