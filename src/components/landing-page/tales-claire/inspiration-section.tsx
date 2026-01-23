"use client";

import React from "react";

export const InspirationSection = () => {
  return (
    <section id="inspiration" className="py-12 animate-fade-in-up delay-600">
      <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-8 border-b border-white/5">
          <h3 className="text-2xl font-bold text-white mb-2">
            Inspiration Source
          </h3>
          <p className="text-neutral-400 text-sm">
            VNSの思想に通じる、魂の演説
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Video Wrapper */}
          <div className="aspect-video bg-black relative">
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/q8_9ckoVV5M"
              title="Tales of Rebirth Speech"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Explanation */}
          <div className="p-8 flex flex-col justify-center space-y-6 bg-white/[0.02]">
            <div>
              <h4 className="text-lg font-bold text-white mb-2">
                『断頭台の演説』より
              </h4>
              <p className="text-xs text-neutral-400 uppercase tracking-wider">
                Tales of Rebirth (2004)
              </p>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-gray-300">
              <p>「種族って何ですか？ 私たちの心は同じだからです。」</p>
              <p>
                この動画は、種族間の対立と差別が渦巻く世界で、ヒロインが処刑の危機に瀕しながらも、分断された人々に「心のつながり」を訴えかけるシーンです。
              </p>
              <p>
                <span className="text-white font-medium">
                  「あなたが美味しいと感じる心に、種族はありますか？」
                </span>
              </p>
              <p>
                この問いかけこそが、VNS masakinihirotaの核心です。
                <br />
                社会的な属性、人種、立場。それらを取り払ったとき、最後に残るのは「何に感動するか」「何を愛するか」という
                <strong className="text-white">価値観</strong>
                だけです。
                VNSは、この演説が目指したような、お互いの「好き」を尊重し、争うことなく共存できる世界（オアシス）をテクノロジーで実現しようとしています。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
