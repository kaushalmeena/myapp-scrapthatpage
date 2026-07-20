import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";

type SettingsState = {
  // Show the scraper window while a script runs (false = headless run).
  showWindow: boolean;
  theme: Theme;
  // Pause inserted between steps, for politeness towards scraped sites.
  stepDelayMs: number;
};

type SettingsActions = {
  setShowWindow: (showWindow: boolean) => void;
  setTheme: (theme: Theme) => void;
  setStepDelayMs: (stepDelayMs: number) => void;
};

// Persisted to localStorage by zustand's `persist` middleware (replaces the
// hand-rolled load/save + store subscription).
export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      showWindow: true,
      theme: "light",
      stepDelayMs: 0,
      setShowWindow: (showWindow) => set({ showWindow }),
      setTheme: (theme) => set({ theme }),
      setStepDelayMs: (stepDelayMs) =>
        set({ stepDelayMs: Math.max(0, stepDelayMs) })
    }),
    {
      name: "settings",
      version: 1,
      // Persist only the data (actions are recreated on load).
      partialize: ({ showWindow, theme, stepDelayMs }) => ({
        showWindow,
        theme,
        stepDelayMs
      })
    }
  )
);
