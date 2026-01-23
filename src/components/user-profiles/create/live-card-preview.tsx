"use client";

import { motion } from "framer-motion";

interface LiveCardPreviewProps {
  data: any;
}

export const LiveCardPreview = ({ data }: LiveCardPreviewProps) => {
  return (
    <div className="relative w-full aspect-[1/0.6] max-w-md mx-auto perspective-1000 group">
      <motion.div
        layout
        className="relative w-full h-full bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 rounded-2xl shadow-2xl p-8 text-white overflow-hidden transform transition-all duration-500 group-hover:rotate-y-2 group-hover:scale-[1.02]"
      >
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium tracking-wider opacity-80 uppercase">
              {data.role || "Role"}
            </h3>
            <h1 className="text-4xl font-bold mt-2 tracking-tight">
              {data.displayName || "Name"}
            </h1>
          </div>

          <div className="backdrop-blur-md bg-white/10 rounded-xl p-4 border border-white/20">
            <p className="text-sm leading-relaxed opacity-90 line-clamp-3">
              {data.bio || "No bio yet..."}
            </p>
          </div>
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
      </motion.div>
    </div>
  );
};
