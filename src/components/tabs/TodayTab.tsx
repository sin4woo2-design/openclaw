import { HabitCard } from "../habits/HabitCard";
import { RecoveryGame } from "../habits/RecoveryGame";
import { AICoach } from "../habits/AICoach";
import type { DayLog, Difficulty, Habit, HabitCategory, MotiveStyle, RecoveryGame as RecoveryGameState } from "../../types";

type Mood = DayLog["mood"];

type TodayTabProps = {
  doneToday: number;
  activeHabits: Habit[];
  newHabitName: string;
  setNewHabitName: (value: string) => void;
  newCategory: HabitCategory;
  setNewCategory: (value: HabitCategory) => void;
  newDifficulty: Difficulty;
  setNewDifficulty: (value: Difficulty) => void;
  addHabit: () => void;
  templates: Array<Pick<Habit, "name" | "category" | "difficulty">>;
  addTemplate: (template: Pick<Habit, "name" | "category" | "difficulty">) => void;
  doHabit: (habitId: string) => void;
  failHabit: (habitId: string) => void;
  recoverByToken: (habitId: string) => void;
  game: RecoveryGameState | null;
  onRecoverSuccess: () => void;
  onRecoverFail: () => void;
  message: string;
  motiveStyle: MotiveStyle;
  mood: Mood;
  setMood: (mood: Mood) => void;
  note: string;
  setNote: (note: string) => void;
};

export function TodayTab(props: TodayTabProps) {
  const {
    doneToday,
    activeHabits,
    newHabitName,
    setNewHabitName,
    newCategory,
    setNewCategory,
    newDifficulty,
    setNewDifficulty,
    addHabit,
    templates,
    addTemplate,
    doHabit,
    failHabit,
    recoverByToken,
    game,
    onRecoverSuccess,
    onRecoverFail,
    message,
    motiveStyle,
    mood,
    setMood,
    note,
    setNote,
  } = props;

  return (
    <main className="stack">
      <section className="todayGrid">
        <section className="card">
          <div className="titleRow">
            <h2>오늘 해야 할 습관</h2>
            <span>{doneToday}/{activeHabits.length}</span>
          </div>
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

      {game ? <RecoveryGame game={game} onSuccess={onRecoverSuccess} onFail={onRecoverFail} /> : null}

      <AICoach
        message={message}
        motiveStyle={motiveStyle}
        mood={mood}
        setMood={setMood}
        note={note}
        setNote={setNote}
      />
    </main>
  );
}
