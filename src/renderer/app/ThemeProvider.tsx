import { type ReactNode, useEffect } from "react";
import { useSettingsStore } from "@/features/settings/store/settingsStore";

// Applies the selected theme by toggling the `dark` class on <html>, which
// drives every Tailwind `dark:` variant and the shadcn CSS variables.
export default function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSettingsStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return <>{children}</>;
}
