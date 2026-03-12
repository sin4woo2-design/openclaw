type TodayMissionCardProps = {
  progress: number;
  firstEasy: string;
  motivationText: string;
  onRunNow: () => void;
};

export function TodayMissionCard({ progress, firstEasy, motivationText, onRunNow }: TodayMissionCardProps) {
  return (
    <section className="card missionCard">
      <div>
        <p className="miniLabel">TODAY MISSION</p>
        <strong>{progress < 100 ? `${firstEasy} 먼저 체크` : "오늘 미션 클리어 🎉"}</strong>
        <p>{motivationText}</p>
      </div>
      <button className="primary" onClick={onRunNow}>
        지금 실행
      </button>
    </section>
  );
}
