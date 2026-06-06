import { Form } from "@/modules/auth/components/login/form";
import Link from "next/link";

const page = () => {
  const features = [
    "Resume work with projects, assignments, and updates ready.",
    "Review team activity and task progress from a focused dashboard.",
    "Keep access secure with account verification and session controls.",
  ];

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-slate-50 transition-colors duration-200">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-slate-950 px-10 py-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(14,165,233,0.28),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.18),transparent_28%),linear-gradient(145deg,#020617_0%,#0f172a_55%,#111827_100%)]" />
          <div className="absolute -right-28 top-24 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute bottom-20 left-12 h-40 w-40 rounded-full border border-cyan-300/20" />

          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-white text-lg font-black text-slate-950">
                W
              </span>
              <span className="text-xl font-semibold tracking-tight">
                WorkBridge
              </span>
            </Link>
          </div>

          <div className="relative z-10 max-w-xl">
            <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm text-cyan-100">
              Welcome back to clarity
            </p>
            <h1 className="text-5xl font-semibold leading-tight tracking-tight">
              Pick up every task exactly where your team left it.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
              Sign in to manage priorities, review progress, and keep projects
              moving without digging through scattered updates.
            </p>

            <div className="mt-10 grid gap-3">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-start gap-3 rounded-md border border-white/10 bg-white/[0.06] p-4"
                >
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300" />
                  <p className="text-sm leading-6 text-slate-200">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-6 text-sm text-slate-400">
            <span>Fast access</span>
            <span>Team visibility</span>
            <span>Secure sessions</span>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-12">
          <div className="w-full max-w-[520px]">
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <Link href="/" className="inline-flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-950 text-base font-black text-white">
                  W
                </span>
                <span className="text-lg font-semibold tracking-tight">
                  WorkBridge
                </span>
              </Link>
              <Link
                href="/register"
                className="text-sm font-medium text-cyan-700 dark:text-cyan-400 hover:text-cyan-900 dark:hover:text-cyan-300"
              >
                Create account
              </Link>
            </div>

            <div className="mb-7">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-400">
                Sign in
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">
                Welcome back
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
                Access your workspace and continue managing tasks with your
                team.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 py-6 shadow-sm sm:px-8 sm:py-8">
              <Form />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
              <Link href="#" className="hover:text-slate-800 dark:hover:text-slate-200">
                Privacy Policy
              </Link>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <Link href="#" className="hover:text-slate-800 dark:hover:text-slate-200">
                Terms
              </Link>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <Link href="#" className="hover:text-slate-800 dark:hover:text-slate-200">
                Security
              </Link>
            </div>

            <p className="mt-3 text-center text-xs text-slate-400 dark:text-slate-500">
              © {new Date().getFullYear()} WorkBridge. All rights reserved.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default page;
