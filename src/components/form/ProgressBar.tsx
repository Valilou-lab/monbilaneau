type Props = { current: number; total: number };

export function ProgressBar({ current, total }: Props) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="mx-auto w-full max-w-[22rem]">
      <p className="mb-1.5 text-center text-[0.85rem] font-semibold text-zinc-500">
        Question {current} sur {total}
      </p>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-brand-soft"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-label={`Question ${current} sur ${total}`}
      >
        <div className="h-full rounded-full bg-brand transition-[width] duration-300 ease-out" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
