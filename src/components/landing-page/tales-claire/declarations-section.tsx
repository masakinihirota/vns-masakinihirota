"use client";

import React from "react";

export const DeclarationsSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up delay-200">
      {/* Oasis Declaration */}
      <div className="bg-white/5 backdrop-blur-md border border-white/5 p-8 rounded-xl hover:bg-white/10 transition-colors duration-300">
        <div className="text-3xl mb-4 opacity-80">🏝️</div>
        <h3 className="text-xl font-bold mb-3 text-white">オアシス宣言</h3>
        <p className="text-sm text-neutral-400 leading-relaxed">
          インターネットという情報の洪水の中での休息地。
          「褒めるときは大きな声で、叱るときは二人きりで」をモットーに、
          争うことなく翼を休められる場所を作ります。
        </p>
      </div>

      {/* Human Declaration */}
      <div className="bg-white/5 backdrop-blur-md border border-white/5 p-8 rounded-xl hover:bg-white/10 transition-colors duration-300">
        <div className="text-3xl mb-4 opacity-80">🧬</div>
        <h3 className="text-xl font-bold mb-3 text-white">人間宣言</h3>
        <p className="text-sm text-neutral-400 leading-relaxed">
          人は間違いを犯し、再挑戦できる生き物です。
          過去の発言は過去の自分。変わることを恐れず、失敗から学ぶ成長を、
          包容力を持って見守る世界です。
        </p>
      </div>

      {/* Honesty Declaration */}
      <div className="bg-white/5 backdrop-blur-md border border-white/5 p-8 rounded-xl hover:bg-white/10 transition-colors duration-300">
        <div className="text-3xl mb-4 opacity-80">💎</div>
        <h3 className="text-xl font-bold mb-3 text-white">正直宣言</h3>
        <p className="text-sm text-neutral-400 leading-relaxed">
          できるだけ正直に行動すること。
          自身の価値観に嘘をつかず、好きなものを好きと言える環境を大切にします。
        </p>
      </div>
    </div>
  );
};
