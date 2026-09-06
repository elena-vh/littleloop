import { db } from './db';

const nowIso = () => new Date().toISOString();

export type ProjectSession = {
  id: string;
  projectId: string;
  startedAt: string;
  endedAt: string | null;
  durationSeconds: number;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type LastSession = {
  endedAt: string;
  durationSeconds: number;
};

/* ------------------------- time zone helpers ------------------------- */

type YMD = { y: number; m: number; d: number };

// Returns YYYY-MM-DD in the given tz
function formatYMD(date: Date, timeZone: string): string {
  // en-CA produces 2026-01-31 style output
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

function parseYMD(ymd: string): YMD {
  // ymd: "YYYY-MM-DD"
  const [y, m, d] = ymd.split('-').map((x) => parseInt(x, 10));
  return { y, m, d };
}

function addDaysToYMD({ y, m, d }: YMD, days: number): YMD {
  // Use UTC date-only arithmetic (safe for date math)
  const ms = Date.UTC(y, m - 1, d) + days * 86400000;
  const dt = new Date(ms);
  return {
    y: dt.getUTCFullYear(),
    m: dt.getUTCMonth() + 1,
    d: dt.getUTCDate(),
  };
}

function getTzOffsetMinutes(at: Date, timeZone: string): number {
  // Try to parse "GMT+02:00" (or similar) from Intl
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone,
      timeZoneName: 'shortOffset',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(at);

    const tzName = parts.find((p) => p.type === 'timeZoneName')?.value ?? '';
    // Examples: "GMT+2", "GMT+02:00", "GMT-05:00"
    const match = tzName.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/);
    if (!match) throw new Error('No GMT offset in timeZoneName');

    const sign = match[1] === '-' ? -1 : 1;
    const hours = parseInt(match[2], 10);
    const minutes = match[3] ? parseInt(match[3], 10) : 0;
    return sign * (hours * 60 + minutes);
  } catch {
    // Fallback: local device offset
    return -at.getTimezoneOffset();
  }
}

// Convert a YMD (in tz) at 00:00 local into a UTC ISO boundary
function startOfDayIsoFromYMD(ymd: YMD, timeZone: string): string {
  // First guess: interpret as UTC midnight; then adjust by tz offset at that instant
  const guessUtc = new Date(Date.UTC(ymd.y, ymd.m - 1, ymd.d, 0, 0, 0));
  const offsetMin = getTzOffsetMinutes(guessUtc, timeZone);
  const utcMs =
    Date.UTC(ymd.y, ymd.m - 1, ymd.d, 0, 0, 0) - offsetMin * 60 * 1000;
  return new Date(utcMs).toISOString();
}

function dayRangeIso(
  date: Date,
  timeZone: string
): { startIso: string; endIso: string } {
  const ymd = parseYMD(formatYMD(date, timeZone));
  const startIso = startOfDayIsoFromYMD(ymd, timeZone);
  const next = addDaysToYMD(ymd, 1);
  const endIso = startOfDayIsoFromYMD(next, timeZone);
  return { startIso, endIso };
}

function getWeekStartYMD(date: Date, timeZone: string): YMD {
  // Week starts Monday
  // Get weekday in tz using Intl, map Mon..Sun -> 0..6
  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
  }).format(date);
  const map: Record<string, number> = {
    Mon: 0,
    Tue: 1,
    Wed: 2,
    Thu: 3,
    Fri: 4,
    Sat: 5,
    Sun: 6,
  };
  const delta = map[weekday] ?? 0;

  const todayYMD = parseYMD(formatYMD(date, timeZone));
  return addDaysToYMD(todayYMD, -delta);
}

function weekRangeIso(
  date: Date,
  timeZone: string
): { startIso: string; endIso: string } {
  const weekStart = getWeekStartYMD(date, timeZone);
  const startIso = startOfDayIsoFromYMD(weekStart, timeZone);
  const weekEnd = addDaysToYMD(weekStart, 7);
  const endIso = startOfDayIsoFromYMD(weekEnd, timeZone);
  return { startIso, endIso };
}

/* ------------------------------ queries ------------------------------ */

export function getProjectLastSession(projectId: string): LastSession | null {
  const row = db.getFirstSync<{ ended_at: string; duration_seconds: number }>(
    `SELECT ended_at, duration_seconds
     FROM project_sessions
     WHERE project_id = ?
       AND deleted_at IS NULL
       AND ended_at IS NOT NULL
     ORDER BY ended_at DESC
     LIMIT 1`,
    [projectId]
  );

  if (!row) return null;
  return { endedAt: row.ended_at, durationSeconds: row.duration_seconds };
}

export function getProjectTotalSeconds(projectId: string): number {
  const row = db.getFirstSync<{ total: number }>(
    `SELECT COALESCE(SUM(duration_seconds), 0) AS total
     FROM project_sessions
     WHERE project_id = ?
       AND deleted_at IS NULL
       AND ended_at IS NOT NULL`,
    [projectId]
  );
  return row?.total ?? 0;
}

export function getProjectSecondsToday(
  projectId: string,
  timeZone: string
): number {
  const { startIso, endIso } = dayRangeIso(new Date(), timeZone);

  const row = db.getFirstSync<{ total: number }>(
    `SELECT COALESCE(SUM(duration_seconds), 0) AS total
     FROM project_sessions
     WHERE project_id = ?
       AND deleted_at IS NULL
       AND ended_at IS NOT NULL
       AND ended_at >= ?
       AND ended_at < ?`,
    [projectId, startIso, endIso]
  );

  return row?.total ?? 0;
}

export function getProjectSecondsThisWeek(
  projectId: string,
  timeZone: string
): number {
  const { startIso, endIso } = weekRangeIso(new Date(), timeZone);

  const row = db.getFirstSync<{ total: number }>(
    `SELECT COALESCE(SUM(duration_seconds), 0) AS total
     FROM project_sessions
     WHERE project_id = ?
       AND deleted_at IS NULL
       AND ended_at IS NOT NULL
       AND ended_at >= ?
       AND ended_at < ?`,
    [projectId, startIso, endIso]
  );

  return row?.total ?? 0;
}

export function getProjectStreakDays(
  projectId: string,
  timeZone: string
): number {
  // Pull recent ended sessions (we only need dates). Limit keeps it fast.
  const rows = db.getAllSync<{ ended_at: string }>(
    `SELECT ended_at
     FROM project_sessions
     WHERE project_id = ?
       AND deleted_at IS NULL
       AND ended_at IS NOT NULL
       AND duration_seconds > 0
     ORDER BY ended_at DESC
     LIMIT 300`,
    [projectId]
  );

  if (!rows?.length) return 0;

  // Build a set of active days in tz, like "2026-01-31"
  const activeDays = new Set<string>();
  for (const r of rows) {
    activeDays.add(formatYMD(new Date(r.ended_at), timeZone));
  }

  // Count consecutive days from today backwards
  let streak = 0;
  let cursor = parseYMD(formatYMD(new Date(), timeZone));

  while (true) {
    const key = `${cursor.y}-${String(cursor.m).padStart(2, '0')}-${String(
      cursor.d
    ).padStart(2, '0')}`;
    if (!activeDays.has(key)) break;
    streak += 1;
    cursor = addDaysToYMD(cursor, -1);
  }

  return streak;
}

/* -------------------- (optional) session writing API -------------------- */

export function startSession(input: {
  id: string;
  projectId: string;
  startedAt?: string;
  note?: string | null;
}) {
  const t = nowIso();
  const startedAt = input.startedAt ?? t;

  db.runSync(
    `INSERT INTO project_sessions (
      id, project_id, started_at, ended_at, duration_seconds,
      note, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [input.id, input.projectId, startedAt, null, 0, input.note ?? null, t, t]
  );
}

export function finishSession(input: {
  id: string;
  durationSeconds: number;
  endedAt?: string;
}) {
  const t = nowIso();
  const endedAt = input.endedAt ?? t;

  db.runSync(
    `UPDATE project_sessions SET
      ended_at = ?,
      duration_seconds = ?,
      updated_at = ?
     WHERE id = ?`,
    [endedAt, input.durationSeconds, t, input.id]
  );
}

export function softDeleteSession(sessionId: string) {
  const t = nowIso();
  db.runSync(
    `UPDATE project_sessions SET deleted_at = ?, updated_at = ? WHERE id = ?`,
    [t, t, sessionId]
  );
}
