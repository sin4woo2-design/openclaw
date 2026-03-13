export function LabTab() {
  return (
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
  );
}
