export const config = {
  runtime: 'edge',
};

const spots = [
  {
    id: 1,
    name: "伏見稲荷大社",
    city: "京都",
    region: "関西",
    weekdayLevel: 2,
    weekendLevel: 4,
    peakMonths: [3, 4, 10, 11],
    bestTime: "早朝（6時前）または夕方以降",
  },
  {
    id: 2,
    name: "嵐山・竹林の道",
    city: "京都",
    region: "関西",
    weekdayLevel: 3,
    weekendLevel: 5,
    peakMonths: [3, 4, 10, 11],
    bestTime: "早朝（8時前）",
  },
  {
    id: 3,
    name: "金閣寺",
    city: "京都",
    region: "関西",
    weekdayLevel: 3,
    weekendLevel: 5,
    peakMonths: [3, 4, 10, 11, 12],
    bestTime: "開館直後（9時台）",
  },
  {
    id: 4,
    name: "浅草寺",
    city: "東京",
    region: "関東",
    weekdayLevel: 3,
    weekendLevel: 4,
    peakMonths: [1, 3, 4, 7, 10],
    bestTime: "早朝（8時前）",
  },
  {
    id: 5,
    name: "渋谷スクランブル交差点",
    city: "東京",
    region: "関東",
    weekdayLevel: 4,
    weekendLevel: 5,
    peakMonths: [3, 10, 11, 12],
    bestTime: "平日の昼間",
  },
  {
    id: 6,
    name: "道頓堀",
    city: "大阪",
    region: "関西",
    weekdayLevel: 3,
    weekendLevel: 5,
    peakMonths: [3, 4, 7, 8, 10, 11],
    bestTime: "午前中",
  },
  {
    id: 7,
    name: "富士山（五合目）",
    city: "富士河口湖",
    region: "中部",
    weekdayLevel: 2,
    weekendLevel: 5,
    peakMonths: [7, 8],
    bestTime: "平日・早朝",
  },
  {
    id: 8,
    name: "東大寺",
    city: "奈良",
    region: "関西",
    weekdayLevel: 2,
    weekendLevel: 4,
    peakMonths: [3, 4, 10, 11],
    bestTime: "早朝または夕方",
  },
  {
    id: 9,
    name: "厳島神社",
    city: "廿日市（広島）",
    region: "中国",
    weekdayLevel: 2,
    weekendLevel: 4,
    peakMonths: [3, 4, 10, 11],
    bestTime: "満潮時の早朝",
  },
  {
    id: 10,
    name: "新宿御苑",
    city: "東京",
    region: "関東",
    weekdayLevel: 2,
    weekendLevel: 4,
    peakMonths: [3, 4],
    bestTime: "平日・午前中",
  },
  {
    id: 11,
    name: "清水寺",
    city: "京都",
    region: "関西",
    weekdayLevel: 3,
    weekendLevel: 5,
    peakMonths: [3, 4, 10, 11],
    bestTime: "早朝拝観（6時〜）",
  },
  {
    id: 12,
    name: "ユニバーサル・スタジオ・ジャパン",
    city: "大阪",
    region: "関西",
    weekdayLevel: 3,
    weekendLevel: 5,
    peakMonths: [3, 4, 7, 8, 12],
    bestTime: "平日・開園直後",
  },
];

function getCrowdingLevel(spot, now) {
  const month = now.getMonth() + 1;
  const hour = now.getHours();
  const dayOfWeek = now.getDay(); // 0=Sun, 6=Sat
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  const isPeak = spot.peakMonths.includes(month);

  let level = isWeekend ? spot.weekendLevel : spot.weekdayLevel;
  if (isPeak) level = Math.min(5, level + 1);

  // Time-of-day adjustment
  if (hour >= 10 && hour <= 15) level = Math.min(5, level + 1);
  else if (hour < 8 || hour >= 18) level = Math.max(1, level - 1);

  return Math.max(1, Math.min(5, level));
}

const LEVEL_LABELS = ["", "空いています", "やや空き", "普通", "混雑", "大混雑"];
const LEVEL_EMOJI = ["", "🟢", "🟡", "🟠", "🔴", "🔴"];

export default async function handler(req) {
  if (req.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const now = new Date();

  const result = spots.map((spot) => {
    const level = getCrowdingLevel(spot, now);
    return {
      id: spot.id,
      name: spot.name,
      city: spot.city,
      region: spot.region,
      crowdingLevel: level,
      crowdingLabel: LEVEL_LABELS[level],
      crowdingEmoji: LEVEL_EMOJI[level],
      bestTime: spot.bestTime,
      peakMonths: spot.peakMonths.map((m) => `${m}月`),
    };
  });

  return new Response(JSON.stringify({ spots: result, updatedAt: now.toISOString() }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=1800',
    },
  });
}
