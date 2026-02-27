"use client";
import { signUp } from "@/lib/auth-client";

export default function Home() {

  // Better Auth のクライアントSDK signUp.email を実行する
  const handleSignUp = async () => {
    const { error } = await signUp.email({
      email: "test@example.com",
      password: "securePassword123",
      name: "Test User",
    });
    if (error) {
      console.error("Error signing up:", error.message);
    } else {
      console.log("Sign up successful!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <button
        onClick={handleSignUp}
        className="bg-slate-900 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-200 transform hover:scale-105 active:scale-95"
      >
        Sign Up
      </button>
    </div>
  );
}
