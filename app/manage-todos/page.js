'use client';
import Link from "next/link";
import { useState, useMemo } from "react";
import todoStore from "../data-store/todo-store";

export default function ManageTodosPage() {
  const { todos, toggleTodo, deleteTodo, clearCompleted } = todoStore();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all"); 
  const [sortBy, setSortBy] = useState("newest"); 

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = todos.slice();

    if (filter === "pending") list = list.filter((t) => !t.completed);
    if (filter === "completed") list = list.filter((t) => t.completed);

    if (q) {
      list = list.filter((t) => {
        return (
          (t.title && t.title.toLowerCase().includes(q)) ||
          (t.description && t.description.toLowerCase().includes(q))
        );
      });
    }

    if (sortBy === "newest") {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "due-soon") {

      list.sort((a, b) => {
        const ta = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const tb = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return ta - tb;
      });
    } else if (sortBy === "due-latest") {
      list.sort((a, b) => {
        const ta = a.dueDate ? new Date(a.dueDate).getTime() : -Infinity;
        const tb = b.dueDate ? new Date(b.dueDate).getTime() : -Infinity;
        return tb - ta;
      });
    }

    return list;
  }, [todos, query, filter, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[rgba(255,255,255,1)] to-[rgba(249,250,252,1)] p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">Manage Tasks</h1>
            <p className="text-sm text-slate-600">Search, filter and sort find what you need quickly..</p>
          </div>

          <div className="flex gap-2">
            <Link href="/add-todo" className="px-4 py-2 rounded-xl bg-[linear-gradient(90deg,#E6F5FF,#F6F9FF)] border">Add</Link>
            <Link href="/" className="px-4 py-2 rounded-xl bg-[linear-gradient(90deg,#FFF8F9,#FFFDF8)] border">Dashboard</Link>
          </div>
        </header>

        <div className="bg-white border rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title or description..."
            className="flex-1 p-2 border rounded-xl"
          />

          <div className="flex items-center gap-2">
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="p-2 border rounded-xl">
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-2 border rounded-xl">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="due-soon">Due soon</option>
              <option value="due-latest">Due latest</option>
            </select>
          </div>
        </div>

        <section className="bg-white border rounded-2xl p-4 shadow-sm">
          {visible.length === 0 ? (
            <div className="text-sm text-slate-500">No tasks match your query try a different filter or add a new one.</div>
          ) : (
            <ul className="space-y-3">
              {visible.map((t) => {
                const due = t.dueDate ? new Date(t.dueDate) : null;
                const dueLabel = due ? due.toLocaleString() : null;
                return (
                  <li key={t.id} className="flex items-start justify-between gap-3 border p-3 rounded-xl bg-[rgba(249,250,252,1)]">
                    <div className="flex gap-3">
                      <input
                        type="checkbox"
                        checked={!!t.completed}
                        onChange={() => toggleTodo(t.id)}
                        className="w-4 h-4 mt-1"
                      />

                      <div className="min-w-0">
                        <div className={`font-medium ${t.completed ? "line-through text-slate-400" : "text-slate-800"}`}>{t.title}</div>
                        {t.description && <div className="text-sm text-slate-500 mt-1 truncate">{t.description}</div>}
                        <div className="text-xs text-slate-400 mt-2">{t.createdAt ? new Date(t.createdAt).toLocaleString() : ""}{dueLabel ? ` • Due: ${dueLabel}` : ""}</div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => deleteTodo(t.id)}
                        className="text-sm px-3 py-1 rounded-lg bg-[rgba(255,235,235,1)] border text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <div className="flex justify-between items-center">
          <div className="text-sm text-slate-600">Showing {visible.length} of {todos.length} tasks</div>
          <div>
            <button onClick={() => clearCompleted()} className="px-3 py-2 rounded-xl bg-[rgba(255,245,235,1)] border">Clear completed</button>
          </div>
        </div>
      </div>
    </div>
  );
}
