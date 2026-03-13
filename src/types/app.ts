import type { Challenge, DayLog, Habit } from "./habit";
import type { PetState } from "./pet";

export type MotiveStyle = "따뜻한 코치" | "냉정한 코치" | "친구같은 응원";

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
