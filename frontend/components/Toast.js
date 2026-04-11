"use client";
import { useEffect, useState } from "react";
import { useApp } from "@/lib/context";

export default function Toast() {
  const { toast, dismissToast } = useApp();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!toast) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const t1 = setTimeout(() => setVisible(false), 1400);
    const t2 = setTimeout(() => dismissToast(), 1700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [toast, dismissToast]);

  if (!toast) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border transition-all duration-300 ${
          visible ? "scale-100 translate-y-0" : "scale-95 -translate-y-2"
        } bg-white/90 dark:bg-zinc-900/90 border-[var(--color-border)]`}
      >
        <span className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white text-lg shadow-lg shadow-amber-500/30">
          ✓
        </span>
        <span className="font-semibold text-[var(--color-text)]">{toast.message}</span>
      </div>
    </div>
  );
}
