'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, createAccount } from "./core/auth";

export default function LoginPage() {
  const router = useRouter();

  const [name, setName] = useState("");      
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false); 
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email || !password || (isSignup && !name)) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    let result;
    if (isSignup) {
      result = await createAccount(name, email, password); 
    } else {
      result = await login(email, password);
    }

    if (result) {
      router.push("/profile");
    } else {
      alert("Authentication failed");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[rgba(255,252,255,1)] to-[rgba(245,250,255,1)] p-6">
      <div className="bg-white border shadow-sm rounded-3xl p-8 w-full max-w-sm space-y-4">

        <h1 className="text-2xl font-semibold text-center text-slate-800">
          {isSignup ? "Create Account" : "Login"}
        </h1>

        <p className="text-sm text-center text-slate-500">
          {isSignup ? "Create your account to continue" : "Welcome back"}
        </p>

        {isSignup && (
          <input
            className="w-full p-3 border rounded-xl"
            placeholder="Your Name"
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          className="w-full p-3 border rounded-xl"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 border rounded-xl"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-[linear-gradient(90deg,#E6F5FF,#F6F9FF)] border"
        >
          {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
        </button>

        <button
          onClick={() => setIsSignup(!isSignup)}
          className="w-full text-sm text-slate-600 underline mt-2"
        >
          {isSignup ? "Already have an account? Login" : "New here? Create an account"}
        </button>

      </div>
    </div>
  );
}
