import type { MotiveStyle } from "../types";

export function motivation(style: MotiveStyle, progress: number, momentumDays: number) {
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
