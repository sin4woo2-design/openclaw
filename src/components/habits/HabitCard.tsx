import React, { useState } from "react";
import type { Habit, Difficulty } from "../../types";

type HabitCardProps = {
  habit: Habit;
  colorTheme: "mint" | "purple" | "orange" | "blue";
  onComplete: (id: string) => void;
  onFail: (id: string) => void;
  onRecover: (id: string) => void;
};

const difficultyLabel: Record<Difficulty, string> = {
  easy: "가벼움",
  normal: "표준",
  hard: "파이어 집중 챌린지 🔥",
};

export const HabitCard: React.FC<HabitCardProps> = ({ habit, colorTheme, onComplete, onFail, onRecover }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  const handleComplete = () => {
    if (!habit.todayDone) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 800);
    }
    onComplete(habit.id);
  };
  return (
    <article className={`habitCard stitchedCard ${colorTheme} ${habit.todayDone ? "done" : ""}`}>
      <div className="habitMain">
        <div className="habitTitleRow">
          <strong>{habit.name}</strong>
          <span className="difficultyPill">{difficultyLabel[habit.difficulty]}</span>
        </div>
        <p className="habitMeta">
          {habit.category} · 불꽃 연속 {habit.streak}일 · 최고 기록 {habit.bestStreak}일
        </p>
      </div>
      <div className="habitActions">
        <button className="primary bouncyBtn" onClick={handleComplete}>
          {habit.todayDone ? "완료됨 💫" : "✨ 체크인"}
        </button>
        {!habit.todayDone && (
          <>
            <button className="failBtn" onClick={() => onFail(habit.id)}>실패</button>
            <button className="tokenBtn" onClick={() => onRecover(habit.id)}>❄️ 토큰방어</button>
          </>
        )}
      </div>
      {showConfetti && (
        <div className="burst">
          <i></i><i></i><i></i><i></i><i></i><i></i>
        </div>
      )}
    </article>
  );
};
