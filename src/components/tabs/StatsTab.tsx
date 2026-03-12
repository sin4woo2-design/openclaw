type StatsRange = "7d" | "14d" | "30d";

type DayBar = { day: string; val: number };

type StatsTabProps = {
  avgStreak: number;
  totalDone: number;
  topHabitName?: string;
  statsRange: StatsRange;
  setStatsRange: (range: StatsRange) => void;
  weekBars: DayBar[];
  bestDay?: DayBar;
  weakDay?: DayBar;
};

export function StatsTab({ avgStreak, totalDone, topHabitName, statsRange, setStatsRange, weekBars, bestDay, weakDay }: StatsTabProps) {
  return (
    <main className="stack">
      <section className="kpiGrid">
        <article className="card statCard"><span>평균 스트릭</span><strong>{avgStreak}일</strong></article>
        <article className="card statCard"><span>누적 완료</span><strong>{totalDone}회</strong></article>
        <article className="card statCard"><span>최강 습관</span><strong>{topHabitName ?? "-"}</strong></article>
      </section>

      <section className="card">
        <div className="sectionTop">
          <h2>요일별 성공률</h2>
          <div className="rangeChips">
            {(["7d", "14d", "30d"] as const).map((r) => (
              <button key={r} className={statsRange === r ? "active" : ""} onClick={() => setStatsRange(r)}>{r}</button>
            ))}
          </div>
        </div>
        <div className="chart">
          {weekBars.map((b) => (
            <div key={b.day} className="barWrap"><i style={{ height: `${Math.max(14, b.val * 1.4)}px` }} /><strong>{b.val}%</strong><span>{b.day}</span></div>
          ))}
        </div>
      </section>

      <section className="card trendRail">
        <article><small>리듬 안정도</small><strong>{Math.max(0, Math.min(100, Math.round((bestDay?.val ?? 0) - (weakDay?.val ?? 0) + 55)))}점</strong></article>
        <article><small>성장 여지</small><strong>{Math.max(0, 100 - (bestDay?.val ?? 0))}%</strong></article>
        <article><small>추천 루틴</small><strong>{(weakDay?.val ?? 0) < 40 ? "2분 습관" : "난이도 상향"}</strong></article>
      </section>

      <section className="card insightGrid">
        <article>
          <small>강점 요일</small>
          <strong>{bestDay?.day ?? "-"}요일</strong>
          <p>{bestDay?.val ?? 0}%로 가장 높아요. 이 날엔 hard 습관을 배치하세요.</p>
        </article>
        <article>
          <small>보완 요일</small>
          <strong>{weakDay?.day ?? "-"}요일</strong>
          <p>{weakDay?.val ?? 0}%로 낮아요. 2분 습관부터 시작해 실패를 줄이세요.</p>
        </article>
      </section>
    </main>
  );
}
