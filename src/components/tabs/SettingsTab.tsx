import type { MotiveStyle } from "../../types";

type SettingsTabProps = {
  motiveStyle: MotiveStyle;
  setMotiveStyle: (style: MotiveStyle) => void;
  onReset: () => void;
};

export function SettingsTab({ motiveStyle, setMotiveStyle, onReset }: SettingsTabProps) {
  return (
    <main className="stack">
      <section className="card">
        <h2>동기부여 톤</h2>
        <div className="chips">
          {(["따뜻한 코치", "냉정한 코치", "친구같은 응원"] as MotiveStyle[]).map((t) => (
            <button key={t} className={`chip ${motiveStyle === t ? "selected" : ""}`} onClick={() => setMotiveStyle(t)}>{t}</button>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>데이터 초기화</h2>
        <button onClick={onReset}>초기화</button>
      </section>
    </main>
  );
}
