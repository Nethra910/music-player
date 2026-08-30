export default function EqualizerBars({ color = "#22c55e" }) {
  return (
    <div className="flex h-4 items-end gap-[2px]">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="w-[3px] rounded-sm animate-eq"
          style={{
            backgroundColor: color,
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}
