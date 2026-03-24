import { LucideIcon } from "lucide-react";

export function SectionCard({
  title,
  description,
  icon: Icon
}: {
  title: string;
  description: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-[2rem] border border-line bg-white p-6 shadow-soft">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pickle-50 text-pickle-700">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-muted">{description}</p>
    </div>
  );
}
