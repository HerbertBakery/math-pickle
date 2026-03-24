import { LucideIcon } from "lucide-react";

export function DashboardStat({
  label,
  value,
  icon: Icon
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-[2rem] border border-line bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted">{label}</div>
        <div className="rounded-xl bg-pickle-50 p-2 text-pickle-700">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 text-3xl font-semibold text-ink">{value}</div>
    </div>
  );
}
