import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { useAppSelector } from "@/hooks/useAppSelector";
import { selectTheme } from "@/features/settings/settingsSlice";
import CommandPalette from "./CommandPalette";
import Sidebar from "./Sidebar";

function MainLayout() {
  const theme = useAppSelector(selectTheme);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
      <CommandPalette />
      <Toaster
        theme={theme}
        position="bottom-right"
        // Validation toasts can contain multiple lines.
        toastOptions={{ style: { whiteSpace: "pre-line" } }}
      />
    </div>
  );
}

export default MainLayout;
