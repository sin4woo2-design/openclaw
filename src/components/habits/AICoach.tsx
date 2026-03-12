import React from "react";
import type { DayLog, MotiveStyle } from "../../types";

type AICoachProps = {
  motiveStyle: MotiveStyle;
  message: string;
  mood: DayLog["mood"];
  setMood: (v: DayLog["mood"]) => void;
  note: string;
  setNote: (v: string) => void;
};

const MOOD_OPTIONS: { value: DayLog["mood"], icon: string, label: string }[] = [
  { value: "최고", icon: "🤩", label: "최고" },
  { value: "좋음", icon: "🙂", label: "좋음" },
  { value: "보통", icon: "😐", label: "보통" },
  { value: "저조", icon: "🫠", label: "저조" },
];

export const AICoach: React.FC<AICoachProps> = ({ motiveStyle, message, mood, setMood, note, setNote }) => {
  return (
    <section className="coachSection">
      <div className="coachBubble">
        <p>{message}</p>
        <div className="coachMeta">
          <span>{motiveStyle}</span>
          <strong>🦁</strong>
        </div>
      </div>
      
      <div className="reflectionCard stitchedCard purple">
        <h3>오늘 하루는 어땠나요?</h3>
        <div className="moodSelector">
          {MOOD_OPTIONS.map((opt) => (
            <button 
              key={opt.value}
              className={`moodBtn ${mood === opt.value ? "active" : ""}`}
              onClick={() => setMood(opt.value)}
              title={opt.label}
            >
              {opt.icon}
            </button>
          ))}
        </div>
        <div className="formRow">
          <input className="noteInput" value={note} onChange={(e) => setNote(e.target.value)} placeholder="내일의 다짐을 남겨주세요..." />
        </div>
      </div>
    </section>
  );
};
