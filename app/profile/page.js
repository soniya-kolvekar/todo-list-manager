'use client';
import { auth } from "../core/firebase";
import { logout } from "../core/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      router.replace("/");
    } else {
      setUser(currentUser);
    }
  }, []);

  async function handleLogout() {
    const success = await logout();
    if (success) {
      router.push("/");
    }
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[rgba(255,255,255,1)] to-[rgba(245,250,255,1)] p-8">
      <div className="bg-white border rounded-3xl p-8 shadow-sm w-full max-w-md text-center space-y-4">
        <h1 className="text-2xl font-semibold text-slate-800">
          Welcome {user.displayName || "User"}
        </h1>

        <div className="text-slate-700">
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>Name:</strong> {user.displayName || "Not Set"}</div>
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="py-3 rounded-xl bg-[linear-gradient(90deg,#E6FFF7,#F0FFF8)] border"
          >
            Go to Dashboard
          </button>

          <button
            onClick={handleLogout}
            className="py-3 rounded-xl bg-[linear-gradient(90deg,#FFE6E6,#FFF0F0)] border"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
