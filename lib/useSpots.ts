"use client";

import { useEffect, useState } from "react";

export interface SpotsInfo {
  total: number;
  approved: number;
  remaining: number;
  soldOut: boolean;
  loading: boolean;
}

export function useSpots(): SpotsInfo {
  const [info, setInfo] = useState<SpotsInfo>({
    total: 15,
    approved: 0,
    remaining: 15,
    soldOut: false,
    loading: true,
  });

  useEffect(() => {
    let isMounted = true;

    async function fetchSpots() {
      try {
        const res = await fetch("/api/spots", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && typeof data.remaining === "number") {
            setInfo({
              total: data.total || 15,
              approved: data.approved || 0,
              remaining: data.remaining,
              soldOut: data.soldOut || data.remaining <= 0,
              loading: false,
            });
          }
        }
      } catch (err) {
        console.error("[useSpots] Erro ao buscar vagas:", err);
      }
    }

    fetchSpots();

    return () => {
      isMounted = false;
    };
  }, []);

  return info;
}
