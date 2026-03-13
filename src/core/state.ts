import type { AppState } from "../types";
import { STORAGE_KEY } from "./constants";
import { nowDate } from "./date";

export const initialState: AppState = {
  habits: [
    {
      id: "h1",
      name: "아침 물 1잔",
      category: "건강",
      difficulty: "easy",
      streak: 5,
      bestStreak: 8,
      totalDone: 19,
      todayDone: false,
      weeklyTarget: 6,
      activeDays: [1, 2, 3, 4, 5, 6],
      createdAt: new Date().toISOString(),
    },
    {
      id: "h2",
      name: "20분 걷기",
      category: "건강",
      difficulty: "normal",
      streak: 2,
      bestStreak: 6,
      totalDone: 13,
      todayDone: true,
      weeklyTarget: 5,
      activeDays: [1, 2, 3, 4, 5],
      createdAt: new Date().toISOString(),
    },
    {
      id: "h3",
      name: "오늘 할 일 3개 쓰기",
      category: "집중",
      difficulty: "easy",
      streak: 4,
      bestStreak: 9,
      totalDone: 21,
      todayDone: false,
      weeklyTarget: 7,
      activeDays: [0, 1, 2, 3, 4, 5, 6],
      createdAt: new Date().toISOString(),
    },
  ],
  challenges: [
    { id: "c1", title: "7일 물 루틴", description: "매일 한 칸, 몸이 먼저 달라져요.", days: 7, participants: 184, joined: false, tags: ["건강", "초보"] },
    { id: "c2", title: "퇴근 후 10분 정리", description: "작게 시작하면 공간이 바뀝니다.", days: 14, participants: 101, joined: true, tags: ["생활"] },
    { id: "c3", title: "스크린타임 줄이기", description: "하루 30분만 줄여도 충분해요.", days: 10, participants: 230, joined: false, tags: ["집중"] },
  ],
  motiveStyle: "친구같은 응원",
  freezeTokens: 1,
  levelPoint: 145,
  dayLogs: [],
  lastOpenedDate: nowDate(),
  momentumDays: 2,
  onboardingDone: false,
  userName: "",
  focusGoal: "",
  pet: {
    species: "golden-hamster",
    name: "반이",
    level: 1,
    xp: 0,
    mood: 80,
    coins: 50,
    failShield: 1,
    accessoriesOwned: ["basic-hat"],
    equippedAccessory: "basic-hat",
  },
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    return { ...initialState, ...(JSON.parse(raw) as AppState) };
  } catch {
    return initialState;
  }
}
