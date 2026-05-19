/**
 * Gaslessio brand — twin hexagon mark + wide-tracked wordmark.
 */

export function GaslessioMark({ className = "h-8 w-auto", ...props }) {
  return (
    <svg
      viewBox="0 0 56 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...props}
    >
      {/* Left hexagon */}
      <path
        d="M18 2H28L33 10L28 18H18L13 10L18 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Right hexagon — shares center edge with left */}
      <path
        d="M28 2H38L43 10L38 18H28L33 10L28 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function GaslessioWordmark({ className = "", ...props }) {
  return (
    <span
      className={`font-sans font-medium uppercase text-white tracking-[0.28em] text-[11px] sm:text-[12px] ${className}`}
      {...props}
    >
      Gaslessio
    </span>
  );
}

/**
 * @param {'horizontal' | 'stacked'} layout
 * @param {'full' | 'mark' | 'wordmark'} variant
 */
export default function GaslessioLogo({
  layout = "horizontal",
  variant = "full",
  className = "",
  markClassName = "h-7 w-auto text-white shrink-0",
}) {
  if (variant === "mark") {
    return <GaslessioMark className={`${markClassName} ${className}`} />;
  }

  if (variant === "wordmark") {
    return <GaslessioWordmark className={className} />;
  }

  if (layout === "stacked") {
    return (
      <div className={`flex flex-col items-center gap-3 ${className}`}>
        <GaslessioMark className={markClassName} />
        <GaslessioWordmark />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <GaslessioMark className={markClassName} />
      <GaslessioWordmark className="hidden sm:inline" />
    </div>
  );
}
