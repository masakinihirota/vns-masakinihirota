import { UserProfileContainer } from "@/components/user-profile";

export const metadata = {
  title: "Profile | Schrödinger's Cat",
  description: "A profile of uncertainty.",
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black p-4 relative overflow-hidden">
      {/* Ambient background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/20 via-black to-fuchsia-950/20 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 contrast-150 pointer-events-none mix-blend-overlay" />

      <div className="z-10 w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-2 tracking-tighter">
            QUANTUM PROFILE
          </h1>
          <p className="text-slate-500 font-mono text-xs tracking-widest uppercase">
            Observation Required to Collapse Wave Function
          </p>
        </div>

        <UserProfileContainer />
      </div>
    </main>
  );
}
