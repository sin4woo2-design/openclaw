import type { TabId } from "./BottomDock";

type TabHeroHeader = {
  eyebrow: string;
  title: string;
  desc: string;
  tone: string;
};

type TabHeroProps = {
  tab: TabId;
  header: TabHeroHeader;
  progress: number;
  totalDone: number;
  joinedCount: number;
  focusGoal: string;
  petEmoji: string;
  petLevel: number;
};

export function TabHero({ tab, header, progress, totalDone, joinedCount, focusGoal, petEmoji, petLevel }: TabHeroProps) {
  return (
    <section className={`card tabHero ${header.tone}`}>
      <p className="miniLabel">{header.eyebrow}</p>
      <h1>{header.title}</h1>
      <p className="sub">{header.desc}</p>
      {tab === "today" ? (
        <>
          <div className="heroProgress">
            <div className="heroProgressBar">
              <div className="heroProgressFill" style={{ width: `${progress}%` }} />
            </div>
            <span className="heroProgressText">
              진행률 <strong>{progress}%</strong>
            </span>
          </div>
          <div className="heroGrid">
            <article>
              <span>누적 완료</span>
              <strong>{totalDone}회</strong>
            </article>
            <article>
              <span>참여 챌린지</span>
              <strong>{joinedCount}개</strong>
            </article>
            <article>
              <span>집중 목표</span>
              <strong>{focusGoal || "없음"}</strong>
            </article>
            <article className="petMini">
              <span>펫 상태</span>
              <strong>
                {petEmoji} Lv.{petLevel}
              </strong>
            </article>
          </div>
        </>
      ) : null}
    </section>
  );
}
