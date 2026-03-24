export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-white/60">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 text-sm text-muted lg:grid-cols-3 lg:px-8">
        <div>
          <div className="font-semibold text-ink">MathPickle</div>
          <p className="mt-2 max-w-sm leading-7">
            A practical home for beautiful mathematical puzzles, games, unsolved problems, and classroom-ready discovery.
          </p>
        </div>
        <div>
          <div className="font-semibold text-ink">Starter areas</div>
          <div className="mt-2 space-y-2">
            <div>Public discovery</div>
            <div>Teacher onboarding</div>
            <div>Student join flow</div>
          </div>
        </div>
        <div>
          <div className="font-semibold text-ink">Future add-ons</div>
          <div className="mt-2 space-y-2">
            <div>Interactive puzzle library</div>
            <div>Assignment analytics</div>
            <div>Memberships and featured collections</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
