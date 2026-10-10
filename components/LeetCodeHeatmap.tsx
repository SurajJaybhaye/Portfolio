import { getActivity, LEETCODE_URL } from "@/lib/leetcode";
import ScrollEnd from "./ScrollEnd";

const level = (n: number) =>
  n === 0 ? 0 : n === 1 ? 1 : n <= 3 ? 2 : n <= 6 ? 3 : 4;
const cell = [
  "bg-on-surface/[0.06]",
  "bg-heat-1",
  "bg-heat-2",
  "bg-heat-3",
  "bg-heat-4",
];

const fmt = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
const month = new Intl.DateTimeFormat("en", {
  month: "short",
  timeZone: "UTC",
});

export default async function LeetCodeHeatmap() {
  const { weeks, total, activeDays, streak } = await getActivity();

  // Label a column when its first day starts a new month.
  const raw = weeks.map((col, i) => {
    const first = col.find(Boolean);
    if (!first) return "";
    const m = first.date.getUTCMonth();
    const prev = i > 0 ? weeks[i - 1].find(Boolean) : null;
    return !prev || prev.date.getUTCMonth() !== m
      ? month.format(first.date)
      : "";
  });
  // Drop a label if the next one follows within 2 columns, so text never overlaps.
  const labels = raw.map((l, i) => {
    if (!l) return "";
    const next = raw.findIndex((x, j) => j > i && x);
    return next !== -1 && next - i < 3 ? "" : l;
  });

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <p className="text-sm text-mid">
          <span className="font-serif text-3xl text-on-surface">{total}</span>{" "}
          submissions in the past year
        </p>
        <p className="text-xs uppercase tracking-wider text-faint">
          Active days <span className="text-on-surface/80">{activeDays}</span>
          <span className="mx-2">·</span>
          Max streak <span className="text-on-surface/80">{streak}</span>
        </p>
      </div>

      <ScrollEnd label="LeetCode submissions over the past year">
        <div className="min-w-[560px]">
          <div
            className="grid gap-[3px]"
            style={{ gridTemplateColumns: "repeat(53, minmax(0, 1fr))" }}
            aria-hidden
          >
            {labels.map((l, i) => (
              <span
                key={i}
                className="overflow-visible whitespace-nowrap text-[10px] text-faint"
              >
                {l}
              </span>
            ))}
          </div>
          <div
            role="img"
            aria-label={`${total} LeetCode submissions in the past year across ${activeDays} active days`}
            className="mt-1.5 grid grid-flow-col grid-rows-7 gap-[3px]"
            style={{ gridTemplateColumns: "repeat(53, minmax(0, 1fr))" }}
          >
            {weeks.flatMap((col, w) =>
              col.map((d, r) =>
                d ? (
                  <span
                    key={`${w}-${r}`}
                    title={`${d.count} submission${d.count === 1 ? "" : "s"} on ${fmt.format(d.date)}`}
                    className={`aspect-square rounded-[2px] ${cell[level(d.count)]}`}
                  />
                ) : (
                  <span key={`${w}-${r}`} />
                ),
              ),
            )}
          </div>
        </div>
      </ScrollEnd>

      <div className="mt-3 flex items-center justify-between text-xs text-faint">
        <a
          href={LEETCODE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-primary"
        >
          View LeetCode profile →
        </a>
        <div className="flex items-center gap-1.5" aria-hidden>
          Less
          {cell.map((c) => (
            <span key={c} className={`h-2.5 w-2.5 rounded-[2px] ${c}`} />
          ))}
          More
        </div>
      </div>
    </div>
  );
}
