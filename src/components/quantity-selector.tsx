import { useMemo } from "react";

type QuantitySelectorProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
};

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
}: QuantitySelectorProps) {
  const sizeClasses = useMemo(() => {
    if (size === "sm") {
      return {
        button: "px-2 py-1 text-xs",
        input: "w-10 text-sm",
      };
    }
    return {
      button: "px-3 py-2 text-sm",
      input: "w-12 text-base",
    };
  }, [size]);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className={`rounded-lg border border-[var(--color-primary)]/30 bg-white text-[var(--color-foreground)] ${sizeClasses.button}`}
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="Decrease quantity"
      >
        -
      </button>
      <input
        type="number"
        min={min}
        max={max}
        value={value}
        onChange={(event) => {
          const nextValue = Number(event.target.value);
          if (Number.isNaN(nextValue)) {
            return;
          }
          onChange(
            Math.min(max, Math.max(min, nextValue)),
          );
        }}
        className={`rounded-lg border border-[var(--color-primary)]/30 bg-white text-center text-[var(--color-foreground)] ${sizeClasses.input}`}
      />
      <button
        type="button"
        className={`rounded-lg border border-[var(--color-primary)]/30 bg-white text-[var(--color-foreground)] ${sizeClasses.button}`}
        onClick={() => onChange(Math.min(max, value + 1))}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
