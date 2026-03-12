export type HabitCategory = "건강" | "집중" | "마음" | "생활";
export type MotiveStyle = "따뜻한 코치" | "냉정한 코치" | "친구같은 응원";
export type Difficulty = "easy" | "normal" | "hard";

export type Habit = {
  id: string;
  name: string;
  category: HabitCategory;
  difficulty: Difficulty;
  streak: number;
  bestStreak: number;
  totalDone: number;
  todayDone: boolean;
  weeklyTarget: number;
  activeDays: number[];
  createdAt: string;
  lastDoneAt?: string;
};

export type Challenge = {
  id: string;
  title: string;
  description: string;
  days: number;
  participants: number;
  joined: boolean;
  tags: string[];
};

export type DayLog = {
  date: string;
  doneCount: number;
  totalCount: number;
  mood: "최고" | "좋음" | "보통" | "저조";
  note: string;
};

export type RecoveryGame = {
  habitId: string;
  target: number;
  triesLeft: number;
};

export type PetSpecies = "golden-hamster" | "campbell" | "capybara";

export type PetState = {
  species: PetSpecies;
  name: string;
  level: number;
  xp: number;
  mood: number;
  coins: number;
  failShield: number;
  accessoriesOwned: string[];
  equippedAccessory: string;
};

export type AppState = {
  habits: Habit[];
  challenges: Challenge[];
  motiveStyle: MotiveStyle;
  freezeTokens: number;
  levelPoint: number;
  dayLogs: DayLog[];
  lastOpenedDate: string;
  momentumDays: number;
  onboardingDone: boolean;
  userName: string;
  focusGoal: string;
  pet: PetState;
};
