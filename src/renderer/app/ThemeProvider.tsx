import { ReactNode, useEffect } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectTheme } from "@/features/settings/settingsSlice";

// Applies the selected theme by toggling the `dark` class on <html>, which
// drives every Tailwind `dark:` variant and the shadcn CSS variables.
function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useAppSelector(selectTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return <>{children}</>;
}

export default ThemeProvider;
