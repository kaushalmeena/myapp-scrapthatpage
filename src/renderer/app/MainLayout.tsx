import { motion } from "motion/react";
import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { useSettingsStore } from "@/features/settings/settingsStore";
import CommandPalette from "./CommandPalette";
import Sidebar from "./Sidebar";

export default function MainLayout() {
  const theme = useSettingsStore((s) => s.theme);
  const { pathname } = useLocation();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="relative flex-1 overflow-y-auto">
        {/* Thin draggable strip so the frameless window can be moved from the
            content area's top edge too. */}
        <div className="app-region-drag absolute inset-x-0 top-0 z-10 h-4" />
        {/* Keyed by route so every screen change fades/rises in gently. */}
        <motion.div
          key={pathname}
          className="mx-auto w-full max-w-4xl p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
        >
          <Outlet />
        </motion.div>
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
