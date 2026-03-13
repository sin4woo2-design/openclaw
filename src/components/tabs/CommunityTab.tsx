import type { Challenge } from "../../types";

type CommunityTabProps = {
  challenges: Challenge[];
  onToggleChallenge: (challengeId: string) => void;
};

export function CommunityTab({ challenges, onToggleChallenge }: CommunityTabProps) {
  return (
    <main className="stack">
      <section className="card">
        <h2>챌린지</h2>
        <div className="challengeList">
          {challenges.map((c) => (
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
              <button className={c.joined ? "active" : ""} onClick={() => onToggleChallenge(c.id)}>{c.joined ? "참여중" : "같이 도전"}</button>
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
  );
}
