"use client";

import {
    createContext,
    useContext,
    useId,
    useRef,
    useState,
    type KeyboardEvent,
    type ReactNode,
} from "react";

/**
 * True when the panel this subtree lives in is the visible one.
 *
 * Inactive panels stay in the DOM (hidden) rather than being unmounted, so the
 * server-rendered HTML still contains every project — a crawler that never runs
 * the tab script sees all of them. The cost is that anything measuring the DOM
 * gets zero dimensions while hidden, which is why the carousel needs to know
 * when its panel is revealed.
 */
const PanelVisibility = createContext(true);

export const usePanelVisible = () => useContext(PanelVisibility);

export interface ProjectTab {
    id: string;
    label: string;
    count: number;
}

export default function ProjectsTabs({
    tabs,
    panels,
}: {
    tabs: ProjectTab[];
    /** Server-rendered section per tab, in the same order as `tabs`. */
    panels: ReactNode[];
}) {
    const [activeId, setActiveId] = useState(tabs[0]?.id);
    const base = useId();
    const buttons = useRef<(HTMLButtonElement | null)[]>([]);

    const tabId = (id: string) => `${base}-tab-${id}`;
    const panelId = (id: string) => `${base}-panel-${id}`;

    // Arrow / Home / End move between tabs, per the ARIA tabs pattern — with
    // roving tabindex, so Tab itself jumps past the tablist into the panel.
    const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
        const step =
            event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;

        let next = -1;
        if (step !== 0) next = (index + step + tabs.length) % tabs.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = tabs.length - 1;
        if (next === -1) return;

        event.preventDefault();
        setActiveId(tabs[next].id);
        buttons.current[next]?.focus();
    };

    return (
        <>
            <div
                role="tablist"
                aria-label="Project type"
                className="inline-flex gap-1 border border-[#E8B84B]/15 p-1 mb-8"
            >
                {tabs.map((tab, index) => {
                    const selected = tab.id === activeId;
                    return (
                        <button
                            key={tab.id}
                            ref={(el) => {
                                buttons.current[index] = el;
                            }}
                            id={tabId(tab.id)}
                            role="tab"
                            type="button"
                            aria-selected={selected}
                            aria-controls={panelId(tab.id)}
                            tabIndex={selected ? 0 : -1}
                            onClick={() => setActiveId(tab.id)}
                            onKeyDown={(event) => onKeyDown(event, index)}
                            className={`flex items-baseline gap-2 px-4 sm:px-6 py-2.5 text-[11px] tracking-widest uppercase transition-colors cursor-pointer ${
                                selected
                                    ? "bg-[#E8B84B]/10 text-[#E8B84B]"
                                    : "text-white/35 hover:text-white/70"
                            }`}
                        >
                            {tab.label}
                            <span
                                className={`text-[10px] tabular-nums ${
                                    selected ? "text-[#E8B84B]/60" : "text-white/20"
                                }`}
                            >
                                {tab.count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {tabs.map((tab, index) => (
                <div
                    key={tab.id}
                    id={panelId(tab.id)}
                    role="tabpanel"
                    aria-labelledby={tabId(tab.id)}
                    hidden={tab.id !== activeId}
                    tabIndex={0}
                >
                    <PanelVisibility.Provider value={tab.id === activeId}>
                        {panels[index]}
                    </PanelVisibility.Provider>
                </div>
            ))}
        </>
    );
}
