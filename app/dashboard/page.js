'use client';
import { auth } from "../core/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import todoStore from "../data-store/todo-store";

export default function Dashboard() {

        const router = useRouter();

      useEffect(() => {
        if (!auth.currentUser) {
          router.replace("/");
        }
      }, []);

  const { todos } = todoStore();

  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = total - completed;

  const upcoming = todos
    .filter((t) => !t.completed && t.dueDate)
    .map((t) => ({ ...t, dueTs: new Date(t.dueDate).getTime() }))
    .filter((t) => !Number.isNaN(t.dueTs))
    .sort((a, b) => a.dueTs - b.dueTs)[0] || null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[rgba(255,252,255,1)] to-[rgba(245,250,255,1)] p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="rounded-3xl p-6 bg-white/90 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-800">Todo Manager</h1>
              <p className="text-sm text-slate-600 mt-1">
                A little, friendly space to capture what matters add due dates, sort and find tasks quickly..
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                href="/add-todo"
                className="px-4 py-2 rounded-xl bg-[linear-gradient(90deg,#E6F5FF,#F6F9FF)] border text-slate-800"
              >
                + Add Todo
              </Link>

              <Link
                href="/manage-todos"
                className="px-4 py-2 rounded-xl bg-[linear-gradient(90deg,#FFF7F9,#FFFDF7)] border text-slate-800"
              >
                Manage Todos
              </Link>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl p-5 bg-white border shadow-sm">
            <div className="text-sm text-slate-500">Total tasks</div>
            <div className="text-3xl font-bold text-slate-800 mt-2">{total}</div>
            <div className="text-xs text-slate-400 mt-2">All tasks you’ve added</div>
          </div>

          <div className="rounded-2xl p-5 bg-[rgba(235,250,245,1)] border shadow-sm">
            <div className="text-sm text-slate-500">Completed</div>
            <div className="text-3xl font-bold text-green-700 mt-2">{completed}</div>
            <div className="text-xs text-slate-400 mt-2">Nice work keep going!!!</div>
          </div>

          <div className="rounded-2xl p-5 bg-[rgba(255,250,245,1)] border shadow-sm">
            <div className="text-sm text-slate-500">Pending</div>
            <div className="text-3xl font-bold text-amber-800 mt-2">{pending}</div>
            <div className="text-xs text-slate-400 mt-2">Things waiting for you</div>
          </div>
        </section>

        <section className="bg-white rounded-2xl border p-6 shadow-sm">
          <h2 className="text-lg font-medium text-slate-800">What’s next</h2>

          {upcoming ? (
            <div className="mt-4 p-4 rounded-lg bg-[rgba(255,250,245,1)] border">
              <div className="font-medium text-slate-800">{upcoming.title}</div>
              {upcoming.description && <div className="text-sm text-slate-600 mt-1">{upcoming.description}</div>}
              <div className="text-xs text-slate-500 mt-2">Due: {new Date(upcoming.dueDate).toLocaleString()}</div>
            </div>
          ) : (
            <div className="mt-4 text-sm text-slate-500">No upcoming due tasks. Add a due date when you create a task to get reminders here.</div>
          )}

          <div className="mt-6">
            <h3 className="text-sm font-medium text-slate-700">Recent</h3>
            {todos.length === 0 ? (
              <p className="text-sm text-slate-500 mt-3">You don’t have any tasks yet try adding one.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {todos.slice().reverse().slice(0, 6).map((t) => (
                  <li key={t.id} className="flex justify-between items-start gap-3 p-3 rounded-lg border bg-[rgba(249,250,252,1)]">
                    <div className="min-w-0">
                      <div className={`font-medium ${t.completed ? "line-through text-slate-400" : "text-slate-800"}`}>{t.title}</div>
                      <div className="text-xs text-slate-400 mt-1">{t.dueDate ? `Due ${new Date(t.dueDate).toLocaleDateString()}` : t.createdAt && new Date(t.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="text-sm text-slate-600">{t.completed ? "Done" : "Open"}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
