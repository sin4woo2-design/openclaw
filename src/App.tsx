import { useEffect, useMemo, useState } from "react";

type HabitCategory = "건강" | "집중" | "마음" | "생활";
type MotiveStyle = "따뜻한 코치" | "냉정한 코치" | "친구같은 응원";
type Difficulty = "easy" | "normal" | "hard";

type Habit = {
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

type Challenge = {
  id: string;
  title: string;
  description: string;
  days: number;
  participants: number;
  joined: boolean;
  tags: string[];
};

type DayLog = {
  date: string;
  doneCount: number;
  totalCount: number;
  mood: "최고" | "좋음" | "보통" | "저조";
  note: string;
};

type RecoveryGame = {
  habitId: string;
  target: number;
  triesLeft: number;
};

type AppState = {
  habits: Habit[];
  challenges: Challenge[];
  motiveStyle: MotiveStyle;
  freezeTokens: number;
  levelPoint: number;
  dayLogs: DayLog[];
  lastOpenedDate: string;
  momentumDays: number;
};

const STORAGE_KEY = "start-is-half-v4";
const nowDate = () => new Date().toISOString().slice(0, 10);
const todayWeekday = () => new Date().getDay();
const uid = () => Math.random().toString(36).slice(2, 10);

const difficultyLabel: Record<Difficulty, string> = {
  easy: "가벼움",
  normal: "표준",
  hard: "집중",
};

const templates: Array<Pick<Habit, "name" | "category" | "difficulty">> = [
  { name: "아침 물 1잔", category: "건강", difficulty: "easy" },
  { name: "10분 산책", category: "건강", difficulty: "easy" },
  { name: "25분 집중", category: "집중", difficulty: "normal" },
  { name: "감사 3줄", category: "마음", difficulty: "easy" },
  { name: "5분 정리", category: "생활", difficulty: "easy" },
  { name: "야식 안 먹기", category: "건강", difficulty: "hard" },
];

const initialState: AppState = {
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
};

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    return { ...initialState, ...(JSON.parse(raw) as AppState) };
  } catch {
    return initialState;
  }
}

function motivation(style: MotiveStyle, progress: number, momentumDays: number) {
  if (style === "냉정한 코치") {
    if (progress >= 80) return `좋다. ${momentumDays}일 흐름 끊지 마.`;
    if (progress >= 40) return "반 왔다. 여기서 한 칸 더가 승부다.";
    return "지금 2분짜리부터 시작. 행동이 먼저다.";
  }

  if (style === "따뜻한 코치") {
    if (progress >= 80) return `${momentumDays}일 흐름 너무 좋아요. 오늘은 유지가 목표예요.`;
    if (progress >= 40) return "좋은 흐름이에요. 작은 체크 하나만 더 해봐요.";
    return "괜찮아요. 지금 시작하면 이미 절반 성공이에요.";
  }

  if (progress >= 80) return `${momentumDays}일 연속 유지 중! 오늘 폼 좋아🔥`;
  if (progress >= 40) return "나이스. 리듬 탔어. 한 칸만 더!";
  return "딱 하나만 체크하자. 시작이 반 💪";
}

export default function App() {
  const [tab, setTab] = useState<"today" | "stats" | "community" | "lab" | "settings">("today");
  const [state, setState] = useState<AppState>(loadState);
  const [newHabitName, setNewHabitName] = useState("");
  const [newCategory, setNewCategory] = useState<HabitCategory>("건강");
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>("easy");
  const [mood, setMood] = useState<DayLog["mood"]>("보통");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("오늘도 한 칸, 시작하면 반은 했다.");
  const [game, setGame] = useState<RecoveryGame | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 1400);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const today = nowDate();
    if (state.lastOpenedDate === today) return;

    const completed = state.habits.filter((h) => h.todayDone).length;
    const total = state.habits.length;
    const daily: DayLog = {
      date: state.lastOpenedDate,
      doneCount: completed,
      totalCount: total,
      mood,
      note: note.trim(),
    };

    const successfulDay = total > 0 && completed / total >= 0.5;

    setState((prev) => ({
      ...prev,
      lastOpenedDate: today,
      dayLogs: [daily, ...prev.dayLogs].slice(0, 60),
      momentumDays: successfulDay ? prev.momentumDays + 1 : 0,
      freezeTokens: successfulDay && (prev.momentumDays + 1) % 7 === 0 ? prev.freezeTokens + 1 : prev.freezeTokens,
      habits: prev.habits.map((h) => ({ ...h, todayDone: false })),
    }));

    setNote("");
    setMood("보통");
  }, [state.lastOpenedDate, state.habits, mood, note]);

  const activeHabits = useMemo(
    () => state.habits.filter((h) => h.activeDays.includes(todayWeekday())),
    [state.habits],
  );

  const doneToday = activeHabits.filter((h) => h.todayDone).length;
  const progress = activeHabits.length ? Math.round((doneToday / activeHabits.length) * 100) : 0;
  const totalDone = state.habits.reduce((s, h) => s + h.totalDone, 0);
  const avgStreak = state.habits.length ? Math.round(state.habits.reduce((s, h) => s + h.streak, 0) / state.habits.length) : 0;
  const topHabit = [...state.habits].sort((a, b) => b.streak - a.streak)[0];
  const firstEasy = activeHabits.find((h) => !h.todayDone)?.name ?? "가벼운 습관 1개";

  const level = Math.floor(state.levelPoint / 100) + 1;
  const levelProgress = state.levelPoint % 100;

  const weekBars = useMemo(() => {
    const logs = state.dayLogs.slice(0, 21);
    return ["일", "월", "화", "수", "목", "금", "토"].map((day, idx) => {
      const arr = logs
        .filter((x) => new Date(x.date).getDay() === idx)
        .map((x) => (x.totalCount ? x.doneCount / x.totalCount : 0));
      const val = arr.length ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 100) : 0;
      return { day, val };
    });
  }, [state.dayLogs]);

  const doHabit = (habitId: string) => {
    let gained = 0;
    setState((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => {
        if (h.id !== habitId) return h;
        if (h.todayDone) {
          return { ...h, todayDone: false, streak: Math.max(0, h.streak - 1), totalDone: Math.max(0, h.totalDone - 1) };
        }

        gained = h.difficulty === "hard" ? 12 : h.difficulty === "normal" ? 8 : 6;
        return {
          ...h,
          todayDone: true,
          streak: h.streak + 1,
          bestStreak: Math.max(h.bestStreak, h.streak + 1),
          totalDone: h.totalDone + 1,
          lastDoneAt: new Date().toISOString(),
        };
      }),
      levelPoint: prev.levelPoint + gained,
    }));

    setToast("체크 완료 +XP");
    setMessage("좋아. 한 칸 채웠다. 시작이 반!");
  };

  const failHabit = (habitId: string) => {
    setState((prev) => ({
      ...prev,
      habits: prev.habits.map((h) => (h.id === habitId ? { ...h, todayDone: false, streak: Math.max(0, h.streak - 1) } : h)),
    }));

    setGame({ habitId, target: Math.floor(Math.random() * 10) + 1, triesLeft: 2 });
    setMessage("괜찮아. 복구 미니게임으로 이어가자.");
  };

  const recoverByToken = (habitId: string) => {
    if (state.freezeTokens <= 0) {
      setMessage("토큰이 없어. 이번엔 미니게임으로 복구해보자.");
      return;
    }

    setState((prev) => ({
      ...prev,
      freezeTokens: prev.freezeTokens - 1,
      habits: prev.habits.map((h) => (h.id === habitId ? { ...h, todayDone: true } : h)),
    }));

    setToast("방어 성공");
  };

  const playGame = (n: number) => {
    if (!game) return;
    if (n === game.target) {
      setState((prev) => ({
        ...prev,
        levelPoint: prev.levelPoint + 10,
        habits: prev.habits.map((h) => (h.id === game.habitId ? { ...h, todayDone: true, streak: h.streak + 1 } : h)),
      }));
      setGame(null);
      setToast("복구 성공 +10XP");
      return;
    }

    if (game.triesLeft <= 1) {
      setGame(null);
      setMessage("이번엔 실패. 내일 다시 시작하면 된다.");
      return;
    }

    setGame({ ...game, triesLeft: game.triesLeft - 1 });
  };

  const addHabit = () => {
    const name = newHabitName.trim();
    if (!name) return;

    setState((prev) => ({
      ...prev,
      habits: [
        ...prev.habits,
        {
          id: uid(),
          name,
          category: newCategory,
          difficulty: newDifficulty,
          streak: 0,
          bestStreak: 0,
          totalDone: 0,
          todayDone: false,
          weeklyTarget: 5,
          activeDays: [1, 2, 3, 4, 5],
          createdAt: new Date().toISOString(),
        },
      ],
    }));

    setNewHabitName("");
    setToast("새 습관 추가");
  };

  const addTemplate = (template: Pick<Habit, "name" | "category" | "difficulty">) => {
    if (state.habits.some((h) => h.name === template.name)) return;

    setState((prev) => ({
      ...prev,
      habits: [
        ...prev.habits,
        {
          id: uid(),
          name: template.name,
          category: template.category,
          difficulty: template.difficulty,
          streak: 0,
          bestStreak: 0,
          totalDone: 0,
          todayDone: false,
          weeklyTarget: 5,
          activeDays: [1, 2, 3, 4, 5],
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  };

  const joinedCount = state.challenges.filter((c) => c.joined).length;

  return (
    <div className="app">
      <header className="hero card">
        <div>
          <p className="eyebrow">START IS HALF · 시작이 반</p>
          <h1>시작하면 이미 절반 성공</h1>
          <p className="sub">습관을 계속하게 만드는 동기부여 루프</p>
        </div>

        <div className="heroGrid">
          <article>
            <span>오늘 진행률</span>
            <strong>{progress}%</strong>
          </article>
          <article>
            <span>모멘텀</span>
            <strong>{state.momentumDays}일</strong>
          </article>
          <article>
            <span>프리즈 토큰</span>
            <strong>{state.freezeTokens}개</strong>
          </article>
          <article>
            <span>참여 챌린지</span>
            <strong>{joinedCount}개</strong>
          </article>
        </div>

        <div className="levelTrack">
          <div className="levelHead">
            <b>Lv.{level}</b>
            <small>{levelProgress}/100 XP</small>
          </div>
          <div className="meter"><i style={{ width: `${levelProgress}%` }} /></div>
        </div>
      </header>

      <section className="card missionCard">
        <div>
          <p className="miniLabel">TODAY MISSION</p>
          <strong>{progress < 100 ? `${firstEasy} 먼저 체크` : "오늘 미션 클리어 🎉"}</strong>
          <p>{motivation(state.motiveStyle, progress, state.momentumDays)}</p>
        </div>
        <button className="primary" onClick={() => setTab("today")}>지금 실행</button>
      </section>

      {tab === "today" && (
        <main className="stack">
          <section className="card">
            <div className="titleRow"><h2>오늘 해야 할 습관</h2><span>{doneToday}/{activeHabits.length}</span></div>
            <div className="habitList">
              {activeHabits.map((h) => (
                <article key={h.id} className={`habitItem ${h.todayDone ? "done" : ""}`}>
                  <div>
                    <div className="habitTitleRow">
                      <strong>{h.name}</strong>
                      <span className="difficultyPill">{difficultyLabel[h.difficulty]}</span>
                    </div>
                    <p>{h.category} · 연속 {h.streak}일 · 최고 {h.bestStreak}일</p>
                  </div>
                  <div className="actions">
                    <button className="primary" onClick={() => doHabit(h.id)}>{h.todayDone ? "체크 취소" : "완료 체크"}</button>
                    <button onClick={() => failHabit(h.id)}>실패</button>
                    <button className="soft" onClick={() => recoverByToken(h.id)}>토큰 방어</button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="card">
            <h2>습관 빠르게 추가</h2>
            <div className="formRow">
              <input placeholder="예: 10분 스트레칭" value={newHabitName} onChange={(e) => setNewHabitName(e.target.value)} />
              <select value={newCategory} onChange={(e) => setNewCategory(e.target.value as HabitCategory)}>
                <option>건강</option><option>집중</option><option>마음</option><option>생활</option>
              </select>
              <select value={newDifficulty} onChange={(e) => setNewDifficulty(e.target.value as Difficulty)}>
                <option value="easy">easy</option><option value="normal">normal</option><option value="hard">hard</option>
              </select>
              <button className="primary" onClick={addHabit}>추가</button>
            </div>
            <div className="chips">
              {templates.map((t) => <button key={t.name} className="chip" onClick={() => addTemplate(t)}>{t.name}</button>)}
            </div>
          </section>

          {game && (
            <section className="card game">
              <h2>복구 미니게임</h2>
              <p>1~10 숫자를 맞추면 스트릭 복구</p>
              <div className="grid10">
                {Array.from({ length: 10 }).map((_, i) => <button key={i} onClick={() => playGame(i + 1)}>{i + 1}</button>)}
              </div>
              <small>남은 기회 {game.triesLeft}회</small>
            </section>
          )}

          <section className="card">
            <h2>오늘 회고</h2>
            <div className="formRow compact">
              <select value={mood} onChange={(e) => setMood(e.target.value as DayLog["mood"])}>
                <option>최고</option><option>좋음</option><option>보통</option><option>저조</option>
              </select>
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="오늘 잘 된 한 가지" />
            </div>
          </section>
          <p className="message">{message}</p>
        </main>
      )}

      {tab === "stats" && (
        <main className="stack">
          <section className="kpiGrid">
            <article className="card"><span>평균 스트릭</span><strong>{avgStreak}일</strong></article>
            <article className="card"><span>누적 완료</span><strong>{totalDone}회</strong></article>
            <article className="card"><span>최강 습관</span><strong>{topHabit ? topHabit.name : "-"}</strong></article>
          </section>

          <section className="card">
            <h2>요일별 성공률</h2>
            <div className="chart">
              {weekBars.map((b) => (
                <div key={b.day} className="barWrap"><i style={{ height: `${Math.max(14, b.val * 1.4)}px` }} /><strong>{b.val}%</strong><span>{b.day}</span></div>
              ))}
            </div>
          </section>
        </main>
      )}

      {tab === "community" && (
        <main className="stack">
          <section className="card">
            <h2>챌린지</h2>
            <div className="challengeList">
              {state.challenges.map((c) => (
                <article key={c.id} className="challengeItem">
                  <div>
                    <strong>{c.title}</strong>
                    <p>{c.description}</p>
                    <small>{c.days}일 · {c.participants}명 참여</small>
                  </div>
                  <button className={c.joined ? "active" : ""} onClick={() => setState((prev) => ({
                    ...prev,
                    challenges: prev.challenges.map((x) => x.id === c.id ? { ...x, joined: !x.joined, participants: x.joined ? x.participants - 1 : x.participants + 1 } : x),
                  }))}>{c.joined ? "참여중" : "참여"}</button>
                </article>
              ))}
            </div>
          </section>
        </main>
      )}

      {tab === "lab" && (
        <main className="stack">
          <section className="card">
            <h2>리텐션 설계</h2>
            <ul>
              <li>D1: 첫 체크 3분 이내</li>
              <li>D3: 실패 직후 복구 미니게임 노출</li>
              <li>D7: 모멘텀 보상(토큰 지급)</li>
              <li>D14: 자동 루틴 추천</li>
            </ul>
          </section>
        </main>
      )}

      {tab === "settings" && (
        <main className="stack">
          <section className="card">
            <h2>동기부여 톤</h2>
            <div className="chips">
              {(["따뜻한 코치", "냉정한 코치", "친구같은 응원"] as MotiveStyle[]).map((t) => (
                <button key={t} className={`chip ${state.motiveStyle === t ? "selected" : ""}`} onClick={() => setState((prev) => ({ ...prev, motiveStyle: t }))}>{t}</button>
              ))}
            </div>
          </section>

          <section className="card">
            <h2>데이터 초기화</h2>
            <button onClick={() => {
              if (!confirm("전체 데이터를 초기화할까요?")) return;
              setState(initialState);
            }}>초기화</button>
          </section>
        </main>
      )}

      <nav className="bottomDock">
        {[
          ["today", "오늘", "✓"],
          ["stats", "통계", "▥"],
          ["community", "도전", "⚑"],
          ["lab", "랩", "✦"],
          ["settings", "설정", "⚙"],
        ].map(([id, label, icon]) => (
          <button key={id} className={`dockBtn ${tab === id ? "active" : ""}`} onClick={() => setTab(id as typeof tab)}>
            <span>{icon}</span>
            <small>{label}</small>
          </button>
        ))}
      </nav>

      {toast ? <div className="toast">{toast}</div> : null}
    </div>
  );
}
