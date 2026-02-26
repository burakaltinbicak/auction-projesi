"use client";

import { useState, useEffect } from "react";

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft("SÜRE DOLDU");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}g ${hours}s ${minutes}d ${seconds}sn`);
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

return (
  <div className="text-sm font-mono font-bold text-red-600 flex items-center gap-1">
    <span className="animate-pulse">⏱</span> {timeLeft}
  </div>
);
}