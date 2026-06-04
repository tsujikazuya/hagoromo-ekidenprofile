import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

export const maxDuration = 60;

const analysisSchema = z.object({
  iron_food_score: z.number().min(-2).max(2).describe('鉄関連食品スコア (-2:欠乏, -1:不足, 0:普通, 1:まずまず, 2:十分)'),
  carbohydrate_score: z.number().min(-2).max(2).describe('炭水化物スコア (-2:欠乏, -1:不足, 0:普通, 1:適量, 2:十分)'),
  energy_balance_score: z.number().min(-2).max(2).describe('エネルギーバランススコア (-2:明らかに不足, -1:不足, 0:均衡, 1:適量, 2:十分)'),
  detected_food_groups: z.string().describe('検出された食品群（例: "肉(牛), 野菜(緑黄色)"）'),
  ai_comment: z.string().describe('選手へのアドバイス（200文字以内）'),
  raw_analysis: z.object({
    hem_iron_score: z.number().min(0).max(3),
    non_hem_iron_score: z.number().min(0).max(3),
    absorption_enhancer_score: z.number().min(0).max(2),
    carb_intake_score: z.number().min(0).max(3),
  }).describe('中間解析スコア (Step 2)'),
});

export async function POST(req: Request) {
  try {
    const { image, text, mealType, athleteId } = await req.json();

    if (!image) {
      return new Response('Image is required', { status: 400 });
    }

    // 1. 選手の取得（デモ用ロジック）
    let targetAthleteId = athleteId;
    if (!targetAthleteId) {
      let athlete = await prisma.athlete.findFirst();
      if (!athlete) {
        athlete = await prisma.athlete.create({
          data: {
            name: "Demo Athlete",
            birthDate: new Date("2000-01-01"),
          }
        });
      }
      targetAthleteId = athlete.id;
    }

    // Base64から画像データを抽出
    const base64Data = image.split(',')[1];
    const mimeType = image.split(';')[0].split(':')[1];

    // 2. AIによる解析
    const { object } = await generateObject({
      model: google('gemini-1.5-flash'),
      schema: analysisSchema,
      system: `あなたは女子長距離選手専門の管理栄養士AIです。
食事画像と補足テキストから、鉄欠乏性貧血およびEnergy Availability (EA) 低下のリスクを判定します。

以下のロジックに従って解析してください：

### Step 1: 画像認識
- 食品群（主食、肉、魚、卵、大豆、野菜、乳製品、果物）を検出
- 各アイテムの量（Small, Medium, Large）を推定

### Step 2: 中間スコアリング (0-3)
1. ヘム鉄 (0-3): 赤身肉、血合い魚の充実度
2. 非ヘム鉄 (0-3): 大豆、緑黄色野菜、卵
3. 吸収促進 (0-2): ビタミンC、果物、生野菜
4. 糖質 (0-3): 主食量

### Step 3: 研究用最終グレード (-2 ~ +2)
- iron_food_score: ヘム鉄と非ヘム鉄の組み合わせで判定
- carbohydrate_score: 主食量と有無で判定
- energy_balance_score: 全体量と練習負荷（テキストに記載があれば）のバランスで判定

※ 数値推定（kcal, mg）は絶対に行わないでください。
※ サプリメントはスコアに含めないでください。`,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: `食事区分: ${mealType}\n補足テキスト: ${text || 'なし'}` },
            {
              type: 'image',
              image: base64Data,
            },
          ],
        },
      ],
    });

    // 3. データベースへの保存
    const nutritionLog = await prisma.nutritionLog.create({
      data: {
        athleteId: targetAthleteId,
        date: new Date(), // 現在の日付。過去分入力なら調整が必要。
        mealType: mealType,
        ironFoodScore: object.iron_food_score,
        carbohydrateScore: object.carbohydrate_score,
        energyBalanceScore: object.energy_balance_score,
        detectedFoodGroups: object.detected_food_groups,
        notes: `${text ? text + '\n---\n' : ''}${object.ai_comment}`,
      },
    });

    return Response.json({ ...object, id: nutritionLog.id });
  } catch (error) {
    console.error('Meal analysis error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
