import snapshot from "./leetcode-snapshot.json";

export const LEETCODE_USER = "suraj_jaybhaye";
export const LEETCODE_URL = `https://leetcode.com/u/${LEETCODE_USER}/`;

type Raw = {
  streak: number;
  totalActiveDays: number;
  calendar: Record<string, number>;
};

const QUERY = `query u($username:String!){matchedUser(username:$username){userCalendar{streak totalActiveDays submissionCalendar}}}`;

// LeetCode has no official public API. This uses its public GraphQL endpoint,
// refreshed hourly, and falls back to lib/leetcode-snapshot.json if it fails.
async function fetchRaw(): Promise<Raw> {
  try {
    const res = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", Referer: "https://leetcode.com" },
      body: JSON.stringify({ query: QUERY, variables: { username: LEETCODE_USER } }),
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(String(res.status));
    const json = await res.json();
    const c = json.data.matchedUser.userCalendar;
    return {
      streak: c.streak,
      totalActiveDays: c.totalActiveDays,
      calendar: JSON.parse(c.submissionCalendar),
    };
  } catch {
    return snapshot as Raw;
  }
}

export type Day = { date: Date; count: number };

export async function getActivity() {
  const raw = await fetchRaw();
  const DAY = 86400;

  // Last 53 weekly columns, Sunday-first, ending with the current week (UTC).
  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 1000;
  const weekday = new Date(today * 1000).getUTCDay();
  const start = today - (weekday + 52 * 7) * DAY;

  const weeks: (Day | null)[][] = [];
  let total = 0;
  let activeDays = 0;
  for (let w = 0; w < 53; w++) {
    const col: (Day | null)[] = [];
    for (let d = 0; d < 7; d++) {
      const ts = start + (w * 7 + d) * DAY;
      if (ts > today) {
        col.push(null);
        continue;
      }
      const count = raw.calendar[String(ts)] ?? 0;
      total += count;
      if (count) activeDays++;
      col.push({ date: new Date(ts * 1000), count });
    }
    weeks.push(col);
  }

  return { weeks, total, activeDays, streak: raw.streak };
}
