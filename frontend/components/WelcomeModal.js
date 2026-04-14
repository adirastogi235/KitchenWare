"use client";
import { useEffect, useState } from "react";
import { useApp } from "@/lib/context";

export default function WelcomeModal() {
  const { welcome, dismissWelcome } = useApp();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!welcome) {
      setVisible(false);
      return;
    }
    const tEnter = setTimeout(() => setVisible(true), 50);
    const tExit = setTimeout(() => setVisible(false), 3200);
    const tClear = setTimeout(() => dismissWelcome(), 3600);
    return () => {
      clearTimeout(tEnter);
      clearTimeout(tExit);
      clearTimeout(tClear);
    };
  }, [welcome, dismissWelcome]);

  if (!welcome) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center px-4 transition-all duration-500 ${
        visible ? "opacity-100 backdrop-blur-md bg-black/40" : "opacity-0 pointer-events-none"
      }`}
      onClick={() => dismissWelcome()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-md bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 rounded-3xl p-10 shadow-2xl shadow-emerald-500/40 text-center text-white overflow-hidden transition-all duration-500 ${
          visible ? "scale-100 translate-y-0" : "scale-75 translate-y-8"
        }`}
      >
        <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-16 -left-8 w-48 h-48 rounded-full bg-teal-300/20 blur-3xl" />

        <div className="relative">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center ring-4 ring-white/20">
            <svg className="w-11 h-11 text-white drop-shadow" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 1a.75.75 0 01.686.446l1.983 4.444 4.812.44a.75.75 0 01.426 1.303l-3.633 3.214 1.078 4.737a.75.75 0 01-1.118.811L10 13.903l-4.234 2.492a.75.75 0 01-1.118-.811l1.078-4.737L2.093 7.633a.75.75 0 01.426-1.303l4.812-.44 1.983-4.444A.75.75 0 0110 1z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-3 tracking-tight drop-shadow">
            {welcome.title}
          </h2>
          {welcome.subtitle && (
            <p className="text-emerald-50/95 text-base md:text-lg font-medium leading-relaxed">
              {welcome.subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
