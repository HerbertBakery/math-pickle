const tiles = [
  ["Patterns", "Grade 2-5"],
  ["Mondrian", "Multiplication"],
  ["Logic", "High ceiling"],
  ["Unsolved", "Feature stream"]
];

export function PuzzleStrip() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {tiles.map(([name, meta], i) => (
          <div key={name} className={`rounded-xl2 p-4 ${i % 2 === 0 ? "bg-pickle-50" : "bg-background"}`}>
            <div className="text-sm font-semibold text-ink">{name}</div>
            <div className="mt-1 text-xs text-muted">{meta}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl2 border border-line p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-ink">Classrooms</div>
            <div className="text-xs text-muted">Teacher A · 3 live classes</div>
          </div>
          <div className="rounded-full bg-pickle-600 px-3 py-1 text-xs font-semibold text-white">Active</div>
        </div>
        <div className="mt-4 h-2 rounded-full bg-background">
          <div className="h-2 w-2/3 rounded-full bg-pickle-500" />
        </div>
      </div>
    </div>
  );
}
