type OnboardingCardProps = {
  name: string;
  goal: string;
  onChangeName: (value: string) => void;
  onChangeGoal: (value: string) => void;
  onComplete: () => void;
};

export function OnboardingCard({ name, goal, onChangeName, onChangeGoal, onComplete }: OnboardingCardProps) {
  return (
    <section className="card onboardingCard">
      <h2>1분 온보딩</h2>
      <p>맞춤 동기부여를 위해 기본 정보만 입력해요.</p>
      <div className="formRow compact">
        <input value={name} onChange={(e) => onChangeName(e.target.value)} placeholder="이름 또는 닉네임" />
        <input value={goal} onChange={(e) => onChangeGoal(e.target.value)} placeholder="이번 주 핵심 목표 (예: 체중 -1kg)" />
      </div>
      <div className="centerAction">
        <button className="primary" onClick={onComplete}>
          시작하기
        </button>
      </div>
    </section>
  );
}
