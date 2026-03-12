import React, { useState, useEffect } from "react";
import type { RecoveryGame as GameType } from "../../types";

type RecoveryGameProps = {
  game: GameType;
  onSuccess: () => void;
  onFail: () => void;
};

export const RecoveryGame: React.FC<RecoveryGameProps> = ({ game, onSuccess, onFail }) => {
  const [gauge, setGauge] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10); // 10 seconds for quick testing
  const targetClicks = Math.max(15, game.target * 3); // Dynamic target

  useEffect(() => {
    if (timeLeft <= 0) {
      if (gauge >= targetClicks) {
        onSuccess();
      } else {
        onFail();
      }
      return;
    }

    if (gauge >= targetClicks) {
      onSuccess();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gauge, onSuccess, onFail, targetClicks]);

  const handleTap = () => {
    if (timeLeft > 0 && gauge < targetClicks) {
      setGauge((prev) => prev + 1);
    }
  };

  const progress = Math.min(100, Math.round((gauge / targetClicks) * 100));

  return (
    <section className="card game">
      <h2>🔥 스트릭 구조 작전!</h2>
      <p>빠르게 탭해서 {timeLeft}초 안에 게이지를 채우세요!</p>
      
      <div className="gaugeContainer">
        <div className="gaugeBar">
          <div className="gaugeFill" style={{ width: `${progress}%` }} />
        </div>
        <div className="gaugeIcon">{progress >= 100 ? "❄️" : "🏃"}</div>
      </div>

      <button className="tapBtn" onClick={handleTap}>TAP TAP!</button>
      <small>필요 탭: {targetClicks - gauge > 0 ? targetClicks - gauge : 0}회</small>
    </section>
  );
};
