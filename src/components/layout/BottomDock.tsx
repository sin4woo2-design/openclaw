export type TabId = "today" | "stats" | "community" | "pet" | "lab" | "settings";

type BottomDockProps = {
  tab: TabId;
  onChangeTab: (tab: TabId) => void;
};

const tabs: Array<{ id: TabId; label: string }> = [
  { id: "today", label: "오늘" },
  { id: "stats", label: "통계" },
  { id: "community", label: "도전" },
  { id: "pet", label: "펫" },
  { id: "lab", label: "랩" },
  { id: "settings", label: "설정" },
];

export function BottomDock({ tab, onChangeTab }: BottomDockProps) {
  return (
    <nav className="bottomDock">
      {tabs.map(({ id, label }) => (
        <button key={id} className={`dockBtn ${tab === id ? "active" : ""}`} onClick={() => onChangeTab(id)}>
          <span className="dockIcon" aria-hidden>
            {id === "today" ? <svg viewBox="0 0 24 24"><path d="M4 12.5 12 5l8 7.5" /><path d="M7 11.5V19h10v-7.5" /></svg> : null}
            {id === "stats" ? <svg viewBox="0 0 24 24"><path d="M5 19V10" /><path d="M12 19V6" /><path d="M19 19v-4" /></svg> : null}
            {id === "community" ? <svg viewBox="0 0 24 24"><path d="M7.5 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" /><path d="M16.5 11a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" /><path d="M3.8 18.5c.8-2 2.2-3 3.7-3s2.9 1 3.7 3" /><path d="M12.8 18.5c.8-2 2.2-3 3.7-3s2.9 1 3.7 3" /></svg> : null}
            {id === "pet" ? <svg viewBox="0 0 24 24"><path d="M9 12c-2.2 0-4 1.8-4 4s1.8 4 7 4 7-1.8 7-4-1.8-4-4-4" /><path d="M9 8a1.8 1.8 0 1 0 0-3.6A1.8 1.8 0 0 0 9 8Z" /><path d="M15 8a1.8 1.8 0 1 0 0-3.6A1.8 1.8 0 0 0 15 8Z" /><path d="M12 13.2c.6 0 1 .5 1 1.1 0 .7-.6 1.2-1.3 1.2-.8 0-1.3-.5-1.3-1.2 0-.6.4-1.1 1-1.1Z" /></svg> : null}
            {id === "lab" ? <svg viewBox="0 0 24 24"><path d="M9 4h6" /><path d="M10 4v4l-4.5 7.8a3 3 0 0 0 2.6 4.5h8a3 3 0 0 0 2.6-4.5L14 8V4" /><path d="M8.5 14h7" /></svg> : null}
            {id === "settings" ? <svg viewBox="0 0 24 24"><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" /><path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1 1 0 0 1 0 1.4l-1 1a1 1 0 0 1-1.4 0l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-.1a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a1 1 0 0 1-1.4 0l-1-1a1 1 0 0 1 0-1.4l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h.1a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a1 1 0 0 1 0-1.4l1-1a1 1 0 0 1 1.4 0l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v.1a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a1 1 0 0 1 1.4 0l1 1a1 1 0 0 1 0 1.4l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6H20a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-.1a1 1 0 0 0-.9.6Z" /></svg> : null}
          </span>
          <small>{label}</small>
        </button>
      ))}
    </nav>
  );
}
