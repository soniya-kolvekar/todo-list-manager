'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import todoStore from "../data-store/todo-store";

export default function AddTodoPage() {
  const router = useRouter();
  const { addTodo } = todoStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(""); 
  const [dueTime, setDueTime] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      alert("Please give the todo a short title — something you’ll recognise.");
      return;
    }

    let dueIso = null;
    if (dueDate) {
      if (dueTime) {
        dueIso = new Date(`${dueDate}T${dueTime}`).toISOString();
      } else {
        dueIso = new Date(`${dueDate}T23:59:00`).toISOString();
      }
    }

    addTodo({
      id: Date.now().toString(),
      title: trimmed,
      description: description.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: dueIso,
    });

    setTitle("");
    setDescription("");
    setDueDate("");
    setDueTime("");
    router.push("/manage-todos");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[rgba(255,255,255,1)] to-[rgba(250,250,255,1)] p-8">
      <div className="max-w-md mx-auto bg-white border rounded-3xl p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-800">Add a task</h1>
        <p className="text-sm text-slate-600 mt-1">Give it a short title and, optionally, a due date so you can sort by urgency later..</p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-sm text-slate-700 block mb-1">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border rounded-xl"
              placeholder="e.g., Finish project README"
            />
          </div>

          <div>
            <label className="text-sm text-slate-700 block mb-1">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border rounded-xl"
              placeholder="Small notes that will help later..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-700 block mb-1">Due date (optional)</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 border rounded-xl"
              />
            </div>

            <div>
              <label className="text-sm text-slate-700 block mb-1">Time (optional)</label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full p-2 border rounded-xl"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="flex-1 py-3 rounded-xl bg-[linear-gradient(90deg,#E6FFF7,#F0FFF8)] border text-slate-800">Add task</button>
            <button type="button" onClick={() => router.push("/")} className="px-4 py-3 rounded-xl bg-[linear-gradient(90deg,#FFF8F9,#FFFDF8)] border">Back</button>
          </div>
        </form>
      </div>
    </div>
  );
}
