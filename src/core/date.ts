export const nowDate = () => new Date().toISOString().slice(0, 10);
export const todayWeekday = () => new Date().getDay();
export const uid = () => Math.random().toString(36).slice(2, 10);
