import { useEffect, useMemo, useState } from "react";
import { HabitCard } from "./components/habits/HabitCard";
import { RecoveryGame } from "./components/habits/RecoveryGame";
import { AICoach } from "./components/habits/AICoach";
import { BottomDock, type TabId } from "./components/layout/BottomDock";
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

type PetSpecies = "golden-hamster" | "campbell" | "capybara";

type PetState = {
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

type AppState = {
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

const STORAGE_KEY = "start-is-half-v4";
const nowDate = () => new Date().toISOString().slice(0, 10);
const todayWeekday = () => new Date().getDay();
const uid = () => Math.random().toString(36).slice(2, 10);


const templates: Array<Pick<Habit, "name" | "category" | "difficulty">> = [
  { name: "아침 물 1잔", category: "건강", difficulty: "easy" },
  { name: "10분 산책", category: "건강", difficulty: "easy" },
  { name: "25분 집중", category: "집중", difficulty: "normal" },
  { name: "감사 3줄", category: "마음", difficulty: "easy" },
  { name: "5분 정리", category: "생활", difficulty: "easy" },
  { name: "야식 안 먹기", category: "건강", difficulty: "hard" },
];

const petSpeciesMeta: Record<PetSpecies, { label: string; emoji: string; ability: string }> = {
  "golden-hamster": { label: "골든 햄스터", emoji: "🐹", ability: "실패 1회 자동 방어" },
  campbell: { label: "캠벨 햄스터", emoji: "🐭", ability: "완료 시 경험치 +10%" },
  capybara: { label: "카피바라", emoji: "🦫", ability: "가끔 2회 달성으로 카운트" },
};

const accessoryShop = [
  { id: "basic-hat", name: "미니 모자", price: 30 },
  { id: "neon-glasses", name: "네온 안경", price: 60 },
  { id: "hero-cape", name: "히어로 망토", price: 120 },
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
  const [tab, setTab] = useState<TabId>("today");
  const [state, setState] = useState<AppState>(loadState);
  const [newHabitName, setNewHabitName] = useState("");
  const [newCategory, setNewCategory] = useState<HabitCategory>("건강");
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>("easy");
  const [mood, setMood] = useState<DayLog["mood"]>("보통");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("오늘도 한 칸, 시작하면 반은 했다.");
  const [game, setGame] = useState<RecoveryGame | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [onboardingName, setOnboardingName] = useState(state.userName || "");
  const [onboardingGoal, setOnboardingGoal] = useState(state.focusGoal || "");
  const [statsRange, setStatsRange] = useState<"7d" | "14d" | "30d">("14d");
  const [burst, setBurst] = useState(false);
  const [petMotion, setPetMotion] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 1400);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!burst) return;
    const t = window.setTimeout(() => setBurst(false), 700);
    return () => clearTimeout(t);
  }, [burst]);

  useEffect(() => {
    if (!petMotion) return;
    const t = window.setTimeout(() => setPetMotion(false), 520);
    return () => clearTimeout(t);
  }, [petMotion]);

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

    const rollover = window.setTimeout(() => {
      setState((prev) => ({
        ...prev,
        lastOpenedDate: today,
        dayLogs: [daily, ...prev.dayLogs].slice(0, 60),
        momentumDays: successfulDay ? prev.momentumDays + 1 : 0,
        freezeTokens: successfulDay && (prev.momentumDays + 1) % 7 === 0 ? prev.freezeTokens + 1 : prev.freezeTokens,
        habits: prev.habits.map((h) => ({ ...h, todayDone: false })),
        pet: {
          ...prev.pet,
          mood: Math.max(20, prev.pet.mood - 8),
          failShield: prev.pet.species === "golden-hamster" ? 1 : prev.pet.failShield,
        },
      }));

      setNote("");
      setMood("보통");
    }, 0);

    return () => clearTimeout(rollover);
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

  const weekBars = useMemo(() => {
    const take = statsRange === "7d" ? 7 : statsRange === "14d" ? 14 : 30;
    const logs = state.dayLogs.slice(0, take);
    return ["일", "월", "화", "수", "목", "금", "토"].map((day, idx) => {
      const arr = logs
        .filter((x) => new Date(x.date).getDay() === idx)
        .map((x) => (x.totalCount ? x.doneCount / x.totalCount : 0));
      const val = arr.length ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 100) : 0;
      return { day, val };
    });
  }, [state.dayLogs, statsRange]);

  const bestDay = [...weekBars].sort((a, b) => b.val - a.val)[0];
  const weakDay = [...weekBars].sort((a, b) => a.val - b.val)[0];

  const doHabit = (habitId: string) => {
    let gained = 0;
    let capyBonus = false;

    setState((prev) => {
      const isCapy = prev.pet.species === "capybara";
      capyBonus = isCapy && Math.random() < 0.22;

      const habits = prev.habits.map((h) => {
        if (h.id !== habitId) return h;
        if (h.todayDone) {
          return { ...h, todayDone: false, streak: Math.max(0, h.streak - 1), totalDone: Math.max(0, h.totalDone - 1) };
        }

        gained = h.difficulty === "hard" ? 12 : h.difficulty === "normal" ? 8 : 6;
        const totalInc = capyBonus ? 2 : 1;
        return {
          ...h,
          todayDone: true,
          streak: h.streak + totalInc,
          bestStreak: Math.max(h.bestStreak, h.streak + totalInc),
          totalDone: h.totalDone + totalInc,
          lastDoneAt: new Date().toISOString(),
        };
      });

      const petXpGain = Math.round(gained * (prev.pet.species === "campbell" ? 1.1 : 1));
      const nextXp = prev.pet.xp + petXpGain;
      const petLevelUp = nextXp >= 100;

      return {
        ...prev,
        habits,
        levelPoint: prev.levelPoint + gained,
        pet: {
          ...prev.pet,
          xp: petLevelUp ? nextXp - 100 : nextXp,
          level: petLevelUp ? prev.pet.level + 1 : prev.pet.level,
          coins: prev.pet.coins + 4 + (capyBonus ? 3 : 0),
          mood: Math.min(100, prev.pet.mood + 4),
        },
      };
    });

    setToast(capyBonus ? "체크 완료 + 카피바라 더블!" : "체크 완료 +XP");
    setBurst(true);
    setMessage(capyBonus ? "카피바라 버프 발동! 2회 달성으로 반영됐어." : "좋아. 한 칸 채웠다. 시작이 반!");
  };

  const failHabit = (habitId: string) => {
    let blocked = false;
    setState((prev) => {
      if (prev.pet.species === "golden-hamster" && prev.pet.failShield > 0) {
        blocked = true;
        return {
          ...prev,
          pet: { ...prev.pet, failShield: prev.pet.failShield - 1, mood: Math.min(100, prev.pet.mood + 2) },
        };
      }

      return {
        ...prev,
        habits: prev.habits.map((h) => (h.id === habitId ? { ...h, todayDone: false, streak: Math.max(0, h.streak - 1) } : h)),
        pet: { ...prev.pet, mood: Math.max(10, prev.pet.mood - 6) },
      };
    });

    if (blocked) {
      setToast("햄스터 보호막 발동!");
      setMessage("골든 햄스터가 실패 1회를 막아줬어 🛡️");
      return;
    }

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
  const petMeta = petSpeciesMeta[state.pet.species];

  const equipAccessory = (id: string) => {
    if (!state.pet.accessoriesOwned.includes(id)) return;
    setState((prev) => ({ ...prev, pet: { ...prev.pet, equippedAccessory: id } }));
  };

  const buyAccessory = (id: string, price: number) => {
    setState((prev) => {
      if (prev.pet.accessoriesOwned.includes(id) || prev.pet.coins < price) return prev;
      return {
        ...prev,
        pet: {
          ...prev.pet,
          coins: prev.pet.coins - price,
          accessoriesOwned: [...prev.pet.accessoriesOwned, id],
        },
      };
    });
  };

  const setSpecies = (species: PetSpecies) => {
    setState((prev) => ({
      ...prev,
      pet: {
        ...prev.pet,
        species,
        failShield: species === "golden-hamster" ? 1 : 0,
      },
    }));
    setToast(`${petSpeciesMeta[species].label} 선택 완료`);
  };

  const petInteract = (kind: "feed" | "pet" | "play") => {
    setState((prev) => {
      const moodGain = kind === "play" ? 8 : 5;
      const xpGain = kind === "feed" ? 6 : 4;
      const nextXp = prev.pet.xp + xpGain;
      return {
        ...prev,
        pet: {
          ...prev.pet,
          mood: Math.min(100, prev.pet.mood + moodGain),
          xp: nextXp >= 100 ? nextXp - 100 : nextXp,
          level: nextXp >= 100 ? prev.pet.level + 1 : prev.pet.level,
        },
      };
    });
    setToast(kind === "feed" ? "간식 주기 완료" : kind === "pet" ? "쓰다듬기 완료" : "놀이 완료");
  };

  const completeOnboarding = () => {
    if (!onboardingName.trim() || !onboardingGoal.trim()) {
      setMessage("이름과 목표를 입력하면 맞춤 동기부여가 시작돼요.");
      return;
    }
    setState((prev) => ({
      ...prev,
      onboardingDone: true,
      userName: onboardingName.trim(),
      focusGoal: onboardingGoal.trim(),
    }));
    setToast("온보딩 완료");
  };

  const tabHeader = {
    today: {
      eyebrow: "TODAY EXECUTION",
      title: state.userName ? `${state.userName}님의 오늘 실행` : "오늘 실행",
      desc: progress < 100 ? `${firstEasy}부터 시작하면 반은 끝입니다.` : "오늘 미션 완료! 유지 모드로 갑니다.",
      tone: "todayTone",
    },
    stats: {
      eyebrow: "WEEKLY INSIGHTS",
      title: "성과 분석",
      desc: `강점은 ${bestDay?.day ?? "-"}요일, 보완은 ${weakDay?.day ?? "-"}요일입니다.`,
      tone: "statsTone",
    },
    community: {
      eyebrow: "SOCIAL CHALLENGE",
      title: "같이 도전",
      desc: `${joinedCount}개 챌린지 참여 중 · 동료와 리듬을 맞춰보세요.`,
      tone: "communityTone",
    },
    pet: {
      eyebrow: "PIXEL PET STUDIO",
      title: `${petMeta.label} 키우기`,
      desc: `${petMeta.ability} · 레벨 ${state.pet.level} · 무드 ${state.pet.mood}%`,
      tone: "petTone",
    },
    lab: {
      eyebrow: "GROWTH LAB",
      title: "리텐션 랩",
      desc: "상용화 실험 기능과 전환 포인트를 점검합니다.",
      tone: "labTone",
    },
    settings: {
      eyebrow: "PERSONALIZATION",
      title: "개인 설정",
      desc: "코치 톤과 데이터 정책을 내 스타일에 맞게 조정하세요.",
      tone: "settingsTone",
    },
  }[tab];

  return (
    <div className="app">
      <header className="brandBar card">
        <div className="brandIdentity">
          <span className="brandCoin">半</span>
          <div>
            <p className="eyebrow">START IS HALF · 시작이 반</p>
            <small>"시작하는 순간 절반은 이미 끝났다"</small>
          </div>
        </div>
        <div className="brandBarRow">
          <strong>Lv.{level}</strong>
          <span>모멘텀 {state.momentumDays}일 · 토큰 {state.freezeTokens}개</span>
        </div>
      </header>

      <section className={`card tabHero ${tabHeader.tone}`}>
        <p className="miniLabel">{tabHeader.eyebrow}</p>
        <h1>{tabHeader.title}</h1>
        <p className="sub">{tabHeader.desc}</p>
        {tab === "today" ? (
          <>
            <div className="heroProgress">
              <div className="heroProgressBar">
                <div className="heroProgressFill" style={{ width: `${progress}%` }} />
              </div>
              <span className="heroProgressText">진행률 <strong>{progress}%</strong></span>
            </div>
            <div className="heroGrid">
              <article><span>누적 완료</span><strong>{totalDone}회</strong></article>
              <article><span>참여 챌린지</span><strong>{joinedCount}개</strong></article>
              <article><span>집중 목표</span><strong>{state.focusGoal || "없음"}</strong></article>
              <article className="petMini"><span>펫 상태</span><strong>{petMeta.emoji} Lv.{state.pet.level}</strong></article>
            </div>
          </>
        ) : null}
      </section>

      {tab === "today" ? (
        <section className="card missionCard">
          <div>
            <p className="miniLabel">TODAY MISSION</p>
            <strong>{progress < 100 ? `${firstEasy} 먼저 체크` : "오늘 미션 클리어 🎉"}</strong>
            <p>{motivation(state.motiveStyle, progress, state.momentumDays)}</p>
          </div>
          <button className="primary" onClick={() => setTab("today")}>지금 실행</button>
        </section>
      ) : null}

      {!state.onboardingDone ? (
        <section className="card onboardingCard">
          <h2>1분 온보딩</h2>
          <p>맞춤 동기부여를 위해 기본 정보만 입력해요.</p>
          <div className="formRow compact">
            <input value={onboardingName} onChange={(e) => setOnboardingName(e.target.value)} placeholder="이름 또는 닉네임" />
            <input value={onboardingGoal} onChange={(e) => setOnboardingGoal(e.target.value)} placeholder="이번 주 핵심 목표 (예: 체중 -1kg)" />
          </div>
          <div className="centerAction"><button className="primary" onClick={completeOnboarding}>시작하기</button></div>
        </section>
      ) : null}

      <div key={tab} className="tabStage">
      {tab === "today" && (
        <main className="stack">
          <section className="todayGrid">
            <section className="card">
              <div className="titleRow"><h2>오늘 해야 할 습관</h2><span>{doneToday}/{activeHabits.length}</span></div>
              <div className="habitList">
                {activeHabits.length === 0 ? (
                  <article className="emptyState">
                    <strong>오늘 활성 습관이 없어요</strong>
                    <p>아래에서 습관을 추가하거나 템플릿을 선택해 시작해보세요.</p>
                  </article>
                ) : null}
                {activeHabits.map((h, i) => {
                  const colors: ("mint" | "purple" | "orange" | "blue")[] = ["mint", "purple", "orange", "blue"];
                  const theme = colors[i % colors.length];
                  return (
                    <HabitCard 
                      key={h.id} 
                      habit={h} 
                      colorTheme={theme} 
                      onComplete={doHabit} 
                      onFail={failHabit} 
                      onRecover={recoverByToken} 
                    />
                  );
                })}
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
          </section>

          {game && (
            <RecoveryGame 
              game={game}
              onSuccess={() => {
                setState((prev) => ({
                  ...prev,
                  levelPoint: prev.levelPoint + 15,
                  habits: prev.habits.map((h) => (h.id === game.habitId ? { ...h, todayDone: true, streak: h.streak + 1, totalDone: h.totalDone + 1 } : h)),
                }));
                setGame(null);
                setToast("복구 성공! ❄️방어 완료 +15XP");
              }}
              onFail={() => {
                setGame(null);
                setMessage("복구 실패. 아쉽지만 꺾인 마음을 다시 잡아봐요.");
              }}
            />
          )}

          <AICoach 
            message={message}
            motiveStyle={state.motiveStyle}
            mood={mood}
            setMood={setMood}
            note={note}
            setNote={setNote}
          />
        </main>
      )}

      {tab === "stats" && (
        <main className="stack">
          <section className="kpiGrid">
            <article className="card statCard"><span>평균 스트릭</span><strong>{avgStreak}일</strong></article>
            <article className="card statCard"><span>누적 완료</span><strong>{totalDone}회</strong></article>
            <article className="card statCard"><span>최강 습관</span><strong>{topHabit ? topHabit.name : "-"}</strong></article>
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
      )}

      {tab === "community" && (
        <main className="stack">
          <section className="card">
            <h2>챌린지</h2>
            <div className="challengeList">
              {state.challenges.map((c) => (
                <article key={c.id} className="challengeItem premiumChallenge">
                  <div>
                    <div className="challengeTopRow">
                      <strong>{c.title}</strong>
                      <span>{c.days}D</span>
                    </div>
                    <p>{c.description}</p>
                    <small>{c.participants}명 참여 · 이번 주 완주율 예상 {Math.min(92, 48 + c.participants % 44)}%</small>
                    <div className="tagRow">{c.tags.map((t) => <em key={t}>#{t}</em>)}</div>
                  </div>
                  <button className={c.joined ? "active" : ""} onClick={() => setState((prev) => ({
                    ...prev,
                    challenges: prev.challenges.map((x) => x.id === c.id ? { ...x, joined: !x.joined, participants: x.joined ? x.participants - 1 : x.participants + 1 } : x),
                  }))}>{c.joined ? "참여중" : "같이 도전"}</button>
                </article>
              ))}
            </div>
          </section>

          <section className="card communityFeed">
            <h2>실시간 피드</h2>
            <div className="feedItem"><b>민지</b><p>아침 스트레칭 12일째 · "출근 전에 2분만!"</p></div>
            <div className="feedItem"><b>준호</b><p>독서 15분 9일째 · "점심 후가 가장 잘됨"</p></div>
            <div className="feedItem"><b>유나</b><p>물 8잔 20일째 · "컵을 눈에 보이게 두니까 성공"</p></div>
          </section>
        </main>
      )}

      {tab === "pet" && (
        <main className="stack">
          <section className="card petShowcase">
            <button className={`pixelPet petImageWrap ${petMotion ? "active" : ""}`} onClick={() => setPetMotion(true)}>
              <div className="petImageSprite" aria-label={`${petMeta.label} 캐릭터`} />
              <small>{petMeta.emoji}</small>
            </button>
            <h2>{state.pet.name}</h2>
            <p>Lv.{state.pet.level} · XP {state.pet.xp}/100 · 무드 {state.pet.mood}%</p>
            <div className="petActions">
              <button onClick={() => petInteract("feed")}>간식 주기</button>
              <button onClick={() => petInteract("pet")}>쓰다듬기</button>
              <button onClick={() => petInteract("play")}>놀아주기</button>
            </div>
            <small>특수 능력: {petMeta.ability}</small>
          </section>

          <section className="card">
            <h2>종류 선택</h2>
            <div className="speciesGrid">
              {(Object.keys(petSpeciesMeta) as PetSpecies[]).map((sp) => (
                <button key={sp} className={state.pet.species === sp ? "active" : ""} onClick={() => setSpecies(sp)}>
                  {petSpeciesMeta[sp].emoji} {petSpeciesMeta[sp].label}
                </button>
              ))}
            </div>
          </section>

          <section className="card">
            <h2>꾸미기 상점</h2>
            <p>코인: {state.pet.coins}</p>
            <div className="shopGrid">
              {accessoryShop.map((item) => {
                const owned = state.pet.accessoriesOwned.includes(item.id);
                const equipped = state.pet.equippedAccessory === item.id;
                return (
                  <article key={item.id}>
                    <strong>{item.name}</strong>
                    <small>{item.price} 코인</small>
                    {owned ? (
                      <button className={equipped ? "active" : ""} onClick={() => equipAccessory(item.id)}>{equipped ? "장착중" : "장착"}</button>
                    ) : (
                      <button onClick={() => buyAccessory(item.id, item.price)} disabled={state.pet.coins < item.price}>구매</button>
                    )}
                  </article>
                );
              })}
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
              <li>D21: 펫 성장/꾸미기 루프 강화</li>
            </ul>
          </section>

          <section className="card paywallMock">
            <h2>프리미엄 목업 (결제 연결 전)</h2>
            <div className="planGrid">
              <article>
                <small>무료</small>
                <strong>₩0</strong>
                <p>기본 햄스터 + 기본 코스튬</p>
              </article>
              <article className="featured">
                <small>Pro Pet Pass</small>
                <strong>₩3,900/월</strong>
                <p>희귀 펫/스킨/능력 슬롯 확장</p>
              </article>
              <article>
                <small>랜덤 뽑기</small>
                <strong>₩1,100</strong>
                <p>랜덤 캐릭터/악세서리 1회</p>
              </article>
            </div>
            <button className="primary">결제 연동 준비중</button>
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
      </div>

      {burst ? <div className="burst" aria-hidden><i /><i /><i /><i /><i /><i /></div> : null}

      <BottomDock tab={tab} onChangeTab={setTab} />

      {toast ? <div className="toast">{toast}</div> : null}
    </div>
  );
}
