import { useEffect, useMemo, useRef, useState } from 'react';

type DayPeriod = 'morning' | 'afternoon' | 'evening' | 'night';

const periodFromHour = (h: number): DayPeriod => {
  if (h < 5) return 'night';
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  if (h < 22) return 'evening';
  return 'night';
};

export const greetingFor = (date = new Date(), name?: string) => {
  const p = periodFromHour(date.getHours());
  const base =
    p === 'morning'
      ? 'Good morning'
      : p === 'afternoon'
      ? 'Good afternoon'
      : p === 'evening'
      ? 'Good evening'
      : 'Good night';
  return name ? `${base}, ${name}.` : `${base}`;
};
const msUntilNextBoundary = (now = new Date()) => {
  const boundaries = [5, 12, 18, 22];
  const d = new Date(now);
  for (const h of boundaries) {
    const t = new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, 0, 0, 0);
    if (t.getTime() > now.getTime()) return t.getTime() - now.getTime();
  }
  const tomorrow5 = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate() + 1,
    5,
    0,
    0,
    0
  );
  return tomorrow5.getTime() - now.getTime();
};

export const greetingParts = (date = new Date(), name?: string) => {
  const p = periodFromHour(date.getHours());
  const base =
    p === 'morning'
      ? 'Good morning'
      : p === 'afternoon'
      ? 'Good afternoon'
      : p === 'evening'
      ? 'Good evening'
      : 'Good night';
  return { line1: name ? `${base},` : base, line2: name ?? '' };
};

export const useGreetingParts = (name?: string) => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setTimeout(
      () => setNow(new Date()),
      msUntilNextBoundary(new Date())
    );
    return () => clearTimeout(id);
  });
  return useMemo(() => greetingParts(now, name), [now, name]);
};

export const useGreeting = (name?: string) => {
  const [now, setNow] = useState(() => new Date());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const schedule = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setNow(new Date());
        schedule();
      }, msUntilNextBoundary(new Date()));
    };
    schedule();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  });
  return useMemo(() => greetingFor(now, name), [now, name]);
};
