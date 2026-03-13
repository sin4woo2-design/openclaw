import type { Habit, PetSpecies } from "../types";

export const STORAGE_KEY = "start-is-half-v4";

export const templates: Array<Pick<Habit, "name" | "category" | "difficulty">> = [
  { name: "아침 물 1잔", category: "건강", difficulty: "easy" },
  { name: "10분 산책", category: "건강", difficulty: "easy" },
  { name: "25분 집중", category: "집중", difficulty: "normal" },
  { name: "감사 3줄", category: "마음", difficulty: "easy" },
  { name: "5분 정리", category: "생활", difficulty: "easy" },
  { name: "야식 안 먹기", category: "건강", difficulty: "hard" },
];

export const petSpeciesMeta: Record<PetSpecies, { label: string; emoji: string; ability: string }> = {
  "golden-hamster": { label: "골든 햄스터", emoji: "🐹", ability: "실패 1회 자동 방어" },
  campbell: { label: "캠벨 햄스터", emoji: "🐭", ability: "완료 시 경험치 +10%" },
  capybara: { label: "카피바라", emoji: "🦫", ability: "가끔 2회 달성으로 카운트" },
};

export const accessoryShop = [
  { id: "basic-hat", name: "미니 모자", price: 30 },
  { id: "neon-glasses", name: "네온 안경", price: 60 },
  { id: "hero-cape", name: "히어로 망토", price: 120 },
];
