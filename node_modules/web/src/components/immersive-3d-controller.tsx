"use client";

import { useEffect } from "react";

export function Immersive3DController() {
  useEffect(() => {
    const shell = document.querySelector(".immersive-3d-shell");
    if (!shell) {
      return;
    }

    let rushTimeoutId: number | undefined;
    let rafId: number | undefined;

    const setActive = (isActive: boolean) => {
      document.body.classList.toggle("immersive-3d-active", isActive);
      document.documentElement.classList.toggle("immersive-3d-active", isActive);
    };

    const setRush = (isActive: boolean) => {
      document.body.classList.toggle("scroll-rushy-active", isActive);
      document.documentElement.classList.toggle("scroll-rushy-active", isActive);
    };

    const update = () => {
      const shellRect = shell.getBoundingClientRect();
      const viewport = window.innerHeight;

      // Hide navbar as soon as the 3D section is in focus on screen.
      const shellVisible = shellRect.top <= viewport * 0.85 && shellRect.bottom >= viewport * 0.15;
      setActive(shellVisible);
    };

    update();
    const onScroll = () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }

      rafId = window.requestAnimationFrame(update);
      setRush(true);

      if (rushTimeoutId) {
        window.clearTimeout(rushTimeoutId);
      }

      rushTimeoutId = window.setTimeout(() => {
        setRush(false);
      }, 160);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);

      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }

      if (rushTimeoutId) {
        window.clearTimeout(rushTimeoutId);
      }

      setActive(false);
      setRush(false);
    };
  }, []);

  return null;
}
