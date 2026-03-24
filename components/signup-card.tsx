export function SignupCard({
  role,
  fields,
  helper
}: {
  role: "teacher" | "student";
  fields: string[];
  helper: string;
}) {
  return (
    <div className="rounded-[2rem] border border-line bg-white p-8 shadow-soft">
      <div className="text-sm font-semibold text-pickle-700">{role === "teacher" ? "Teacher account" : "Student account"}</div>
      <div className="mt-2 text-2xl font-semibold text-ink">Starter form UI</div>
      <div className="mt-2 text-sm leading-7 text-muted">{helper}</div>

      <form className="mt-6 space-y-4">
        {fields.map((label) => (
          <label key={label} className="block">
            <div className="mb-2 text-sm font-medium text-ink">{label}</div>
            <input
              className="w-full rounded-xl2 border border-line bg-background px-4 py-3 outline-none ring-0 transition focus:border-pickle-400"
              placeholder={label}
            />
          </label>
        ))}

        <button type="button" className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-pickle-600 px-5 py-3 font-semibold text-white">
          Create {role} account
        </button>
      </form>
    </div>
  );
}
