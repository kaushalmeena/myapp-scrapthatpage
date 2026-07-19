import { type ReactNode, useEffect } from "react";
import { selectTheme } from "@/features/settings/settingsSlice";
import { useAppSelector } from "@/hooks/useAppSelector";

// Applies the selected theme by toggling the `dark` class on <html>, which
// drives every Tailwind `dark:` variant and the shadcn CSS variables.
export default function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useAppSelector(selectTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return <>{children}</>;
}
