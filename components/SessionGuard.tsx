"use client";

import { useEffect, useRef } from "react";
import { signOut } from "next-auth/react";

const INACTIVITY_MS = 15 * 60 * 1000; // 15 minutos

export default function SessionGuard() {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function resetTimer() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      signOut({ callbackUrl: "/login" });
    }, INACTIVITY_MS);
  }

  useEffect(() => {
    async function validateSession() {
      try {
        const res = await fetch("/api/auth/validate");
        if (!res.ok) return; // error del servidor → no deslogear
        const data = await res.json();
        if (data.valid === false) signOut({ callbackUrl: "/login" });
      } catch {
        // si falla la red, no deslogear
      }
    }

    // Inactividad
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();

    // Sesión única: validar al cargar y al volver a la pestaña
    validateSession();
    function onVisibility() {
      if (document.visibilityState === "visible") validateSession();
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      if (timer.current) clearTimeout(timer.current);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      document.removeEventListener("visibilitychange", onVisibility);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
