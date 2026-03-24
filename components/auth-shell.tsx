export function AuthShell({
  eyebrow,
  title,
  description,
  children
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[.95fr_1.05fr] lg:px-8 lg:py-16">
      <section className="rounded-[2rem] border border-line bg-ink p-8 text-white shadow-soft">
        <div className="text-sm font-semibold text-pickle-200">{eyebrow}</div>
        <h1 className="mt-3 text-4xl font-semibold">{title}</h1>
        <p className="mt-4 max-w-xl text-white/80">{description}</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {[
            "Simple onboarding",
            "Class code support",
            "Puzzle assignments",
            "Future progress analytics"
          ].map((item) => (
            <div key={item} className="rounded-xl2 border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80">
              {item}
            </div>
          ))}
        </div>
      </section>
      <section>{children}</section>
    </main>
  );
}
