"use client"; // This is a Client Component

import { useState, useEffect } from "react";
import Image from "next/image";

// Define the main Landing Page component
export default function Home() {
  // State to manage the current theme ('light' or 'dark')
  // Initialize from local storage or default to 'light'
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as
        | "light"
        | "dark"
        | null;
      if (savedTheme) {
        return savedTheme;
      }
      // Check system preference if no theme is saved
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    return "light"; // Default theme
  });

  // State to manage the visibility of the Oasis Declaration
  const [isOasisDeclarationExpanded, setIsOasisDeclarationExpanded] =
    useState(false);

  // Effect to apply the 'dark' class to the html element and save theme preference
  useEffect(() => {
    const htmlElement = document.documentElement;
    if (theme === "dark") {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
    // Save theme preference to local storage
    localStorage.setItem("theme", theme);
  }, [theme]); // Rerun effect when theme changes

  // Function to toggle the visibility of the Oasis Declaration
  const toggleOasisDeclaration = () => {
    setIsOasisDeclarationExpanded(!isOasisDeclarationExpanded);
  };

  // Function to toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    // Apply background color classes with dark mode variants
    // Adjusted general text color for dark mode
    // 全体の文字色と背景色をTailwindで指定
    <div className="text-gray-800 bg-blue-50 dark:bg-gray-900 dark:text-gray-100">
      {/* Header */}
      {/* Apply background and shadow classes with dark mode variants */}
      <header className="py-4 bg-white shadow-md dark:bg-gray-800 dark:shadow-lg">
        <div className="container flex items-center justify-between px-6 mx-auto">
          {/* masakinihirotaロゴの色をTailwindで指定 */}
          <div className="text-2xl font-bold text-blue-800 dark:text-teal-400">
            masakinihirota
          </div>
          <nav>
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="px-4 py-2 text-gray-800 transition-colors duration-300 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-200"
            >
              {theme === "light" ? "ダークモード" : "ライトモード"}
            </button>
            {/* Navigation links can be added here */}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      {/* 背景グラデーションと文字色をTailwindで指定 */}
      <section className="px-6 py-20 text-center text-white bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-800 dark:to-indigo-900">
        <div className="container mx-auto">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            昨日僕が感動した作品を、今日の君はまだ知らない。
          </h1>
          {/* Catchphrase */}
          {/* Text color is white, which should be visible on dark background */}
          <p className="mb-8 text-1xl font-semibold md:text-1xl opacity-95">
            インターネットという情報の洪水の中からまっさきに価値ある情報を拾い上げるサービスです。
          </p>
          {/* Text color is white, which should be visible on dark background */}
          <p className="mb-8 text-xl md:text-2xl opacity-90">VNS</p>
          {/* Call to Action Button */}
          {/* ボタンの色とテキスト色をTailwindで指定 */}
          <a
            href="#about"
            className="px-8 py-3 font-bold text-blue-800 transition duration-300 bg-white rounded-full shadow-lg hover:bg-blue-50 dark:bg-teal-600 dark:text-white dark:hover:bg-teal-700"
          >
            masakinihirotaとは
          </a>
        </div>
      </section>

      {/* About Section */}
      {/* 背景色をTailwindで指定 */}
      <section
        id="about"
        className="px-6 py-20 bg-blue-100 dark:bg-gray-800"
      >
        <div className="container mx-auto">
          {/* セクションタイトルの色をTailwindで指定 */}
          <h2 className="mb-12 text-3xl font-bold text-center text-blue-800 md:text-4xl dark:text-teal-400">
            masakinihirotaとは
          </h2>

          {/* Tutorial and Document Links */}
          <div className="mb-8 text-lg text-center">
            {/* リンクのテキスト色をTailwindで指定 */}
            <a
              href="[チュートリアルへのリンクURL]"
              target="_blank"
              rel="noreferrer"
              className="mx-4 font-semibold text-indigo-600 hover:underline dark:text-teal-300 dark:hover:text-teal-400"
            >
              チュートリアル
            </a>
            {/* セパレータの色をTailwindで指定 */}
            <span className="text-gray-500 dark:text-gray-400">|</span>{" "}
            {/* Separator */}
            {/* リンクのテキスト色をTailwindで指定 */}
            <a
              href="[ドキュメントへのリンクURL]"
              target="_blank"
              rel="noreferrer"
              className="mx-4 font-semibold text-indigo-600 hover:underline dark:text-teal-300 dark:hover:text-teal-400"
            >
              ドキュメント
            </a>
            {/* Remember to replace the placeholder URLs above with actual links */}
          </div>

          {/* Overview of the concept and Name Origin */}
          {/* 段落テキストの色をTailwindで指定 */}
          <div className="max-w-3xl mx-auto mb-12 text-lg leading-relaxed text-center text-gray-700 dark:text-gray-200">
            <p className="mb-4">
              masakinihirotaは、インターネットという情報の洪水の中から、まっさきに価値ある情報を拾い上げ紹介するサービスです。名刺、履歴書のように自己紹介をして自分の価値観に合う人を探します。
            </p>
            {/* 名前の由来タイトルの色をTailwindで指定 */}
            <h3 className="mb-4 text-2xl font-semibold text-blue-800 dark:text-teal-400">
              名前の由来
            </h3>
            <p className="mb-4">
              インターネットという情報の洪水の中から、まっさきに価値ある情報を拾い上げるサービスであることに由来しています。
            </p>
            {/* Image placeholder for "洪水から物を拾い上げる画像" */}
            <Image
              src="https://placehold.co/500x300/bae6fd/1e3a8a?text=洪水から物を拾い上げるイメージ"
              alt="洪水から物を拾い上げるイメージ画像"
              width={500}
              height={300}
              className="concept-image"
            />
            <p className="mb-4">
              洪水の中から拾い上げた価値がある作品を、その作品を好きな人同士、そして価値観が合う人同士とマッチングさせます。
            </p>
            <p className="mb-4">
              インターネットの大量の情報の中から自分の好きなものを見つけるのは大変です。masakinihirotaは、その中から本当に価値のある物を拾い上げるサイトです。
            </p>

            {/* Oasis Declaration Section */}
            {/* 宣言セクションのテキスト色をTailwindで指定 */}
            <div className="text-gray-800 oasis-declaration dark:text-gray-100">
              {/* Toggle Header */}
              {/* 宣言タイトルの色をTailwindで指定 */}
              <button
                type="button"
                className={`text-2xl font-bold text-blue-800 dark:text-teal-400 toggle-header ${isOasisDeclarationExpanded ? "expanded" : ""}`}
                onClick={toggleOasisDeclaration}
                aria-expanded={isOasisDeclarationExpanded}
                aria-controls="oasis-declaration-content"
              >
                オアシス宣言
              </button>
              {/* Collapsible Content */}
              <div
                className="toggle-content"
                style={{
                  display: isOasisDeclarationExpanded ? "block" : "none",
                }}
              >
                <p className="mb-4">
                  インターネットという情報の洪水の中で、オアシスの場所であることを宣言します。
                </p>
                <p className="mb-4 font-semibold">
                  モットー：褒めるときは大きな声でみんなの前で、叱るときは二人きりで小さな声で。
                </p>
                <div
                  id="oasis-declaration-content"
                  className="toggle-content"
                  style={{
                    display: isOasisDeclarationExpanded ? "block" : "none",
                  }}
                >
                  {/* リストアイテムのテキスト色をTailwindで指定 */}
                  <ul className="max-w-md mx-auto text-left list-disc list-inside dark:text-gray-200">
                    <li>
                      インターネット上で翼を休める場所、砂漠の中で命の水を授かる場所を作ります。
                    </li>
                    <li>広告はユーザー側に主導権があります。</li>
                    <li>
                      共通の価値観を持った人々のオアシスという場所を作ります。
                    </li>
                    <li>
                      お互いの価値観を認めるのならば、誰もが参加できます。
                    </li>
                    <li>きれいな世界、優しい世界を守り、広めます。</li>
                    <li>
                      誰もが争うことなく休憩する場所であることを目指します。
                    </li>
                    <li>誰もが笑顔になれる場所です。</li>
                  </ul>
                </div>
                {/* End Collapsible Content */}
              </div>
              {/* End Oasis Declaration Section */}
            </div>
          </div>
          {/* Key Aspects in Grid */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
            {/* Concept Item 1 to 6 */}
            {/* カードの背景色とテキスト色をTailwindで指定 */}
            <div className="p-8 text-center rounded-lg shadow-md bg-cyan-100 dark:bg-zinc-700 dark:text-gray-200">
              {/* アイコンの色をTailwindで指定 */}
              <div className="mb-4 text-4xl text-blue-800 dark:text-teal-400">
                🧬
              </div>{" "}
              {/* Icon placeholder */}
              {/* タイトルの色をTailwindで指定 */}
              <h3 className="mb-4 text-xl font-semibold text-blue-800 dark:text-teal-400">
                価値観で繋がる
              </h3>{" "}
              {/* Accent color */}
              {/* 段落テキストの色をTailwindで指定 */}
              <p className="text-gray-700 dark:text-gray-400">
                年齢や肩書きといった属性情報ではなく、「何を大切にしているか」「何に興味があるか」といった価値観そのものでマッチングを行います。人間性ではなく、価値観の相性を重視した新しい繋がり方を提供します。
              </p>
            </div>
            <div className="p-8 text-center rounded-lg shadow-md bg-cyan-100 dark:bg-zinc-700 dark:text-gray-200">
              <div className="mb-4 text-4xl text-blue-800 dark:text-teal-400">
                👤
              </div>{" "}
              {/* Icon placeholder */}
              <h3 className="mb-4 text-xl font-semibold text-blue-800 dark:text-teal-400">
                あなたの価値観を表現
              </h3>{" "}
              {/* Accent color */}
              <p className="text-gray-700 dark:text-gray-400">
                自身の価値観を「ネット上の属性情報がない名刺、履歴書、自己紹介カード」のように作成できます。あなたがどんな人間で、何を大切にし、何に興味があるのかを表現し、共有するツールとなります。
              </p>
            </div>
            <div className="p-8 text-center rounded-lg shadow-md bg-cyan-100 dark:bg-zinc-700 dark:text-gray-200">
              <div className="mb-4 text-4xl text-blue-800 dark:text-teal-400">
                🎬
              </div>{" "}
              {/* Icon placeholder */}
              <h3 className="mb-4 text-xl font-semibold text-blue-800 dark:text-teal-400">
                好きな作品が絆に
              </h3>{" "}
              {/* Accent color */}
              <p className="text-gray-700 dark:text-gray-400">
                好きな作品を登録し、そのリストを基にマッチングを行います。同じ作品に感動した人、似た感性を持つ人同士が繋がり、友人になるきっかけが生まれます。
              </p>
            </div>
            <div className="p-8 text-center rounded-lg shadow-md bg-cyan-100 dark:bg-zinc-700 dark:text-gray-200">
              <div className="mb-4 text-4xl text-blue-800 dark:text-teal-400">
                🤝
              </div>{" "}
              {/* Icon placeholder */}
              <h3 className="mb-4 text-xl font-semibold text-blue-800 dark:text-teal-400">
                広がる交流の可能性
              </h3>{" "}
              {/* Accent color */}
              <p className="text-gray-700 dark:text-gray-400">
                価値観が合う人同士で繋がり、グループを作り、語り合い、遊び、学び、共に想像し、物を作り、交流を深めます。友人、仕事仲間、パートナーなど、多様な関係性を自然な形で築くことができます。
              </p>
            </div>
            <div className="p-8 text-center rounded-lg shadow-md bg-cyan-100 dark:bg-zinc-700 dark:text-gray-200">
              <div className="mb-4 text-4xl text-blue-800 dark:text-teal-400">
                🧘
              </div>{" "}
              {/* Icon placeholder */}
              <h3 className="mb-4 text-xl font-semibold text-blue-800 dark:text-teal-400">
                心満たされるオアシス
              </h3>{" "}
              {/* Accent color */}
              <p className="text-gray-700 dark:text-gray-400">
                情報過多な日常から離れ、厳選された作品を静かに、そしてじっくりと楽しむことができる場所です。まるでオアシスで心身を癒やすように、作品の世界に没入し、疲れを癒やすことができます。
              </p>
            </div>
            <div className="p-8 text-center rounded-lg shadow-md bg-cyan-100 dark:bg-zinc-700 dark:text-gray-200">
              <div className="mb-4 text-4xl text-blue-800 dark:text-teal-400">
                ✨
              </div>{" "}
              {/* Icon placeholder */}
              <h3 className="mb-4 text-xl font-semibold text-blue-800 dark:text-teal-400">
                創造し、共に歩む
              </h3>{" "}
              {/* Accent color */}
              <p className="text-gray-700 dark:text-gray-400">
                作品から得たインスピレーションを元に、仲間と共に新しい何かを生み出す活動を応援します。また、外部サービスの終了に左右されず、価値観で繋がった絆は継続し、共に新しい場所で活動を続けることが可能です。
              </p>
            </div>
          </div>
          {/* Additional text about avoiding incompatible relationships and carrying over environment */}
          {/* 段落テキストの色をTailwindで指定 */}
          <div className="max-w-3xl mx-auto mt-12 text-lg leading-relaxed text-center text-gray-700 dark:text-gray-200">
            <p className="mb-4">
              masakinihirotaでは、価値観が合わない人と無理して付き合う必要はありません。相手の価値観を知ってからコミュニケーションを図ることで、よりスムーズで心地よい人間関係を築けます。
            </p>
            <p className="mb-4">
              また、属性情報がないため、その人の能力やスキル、そして価値観そのもので判断されます。あなたが作り、育てた「価値観に基づく繋がり」は、特定のサービスに依存せず、他の場所でも共に活動を続けるための強固な基盤となります。例えば、あるゲームのサービスが終了しても、同じ価値観を持つ仲間と別のゲームで一緒に遊ぶ、といったことが自然に実現できます。
            </p>
            <p>
              これは、あなたが作成し、育てた環境を他のオンラインゲームでも持ち回りできるようになることを意味します。
            </p>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      {/* 背景色をTailwindで指定 */}
      <section
        id="videos"
        className="px-6 py-20 bg-white dark:bg-gray-900"
      >
        <div className="container max-w-3xl mx-auto">
          {/* タイトルテキストの色をTailwindで指定 */}
          <h2 className="mb-12 text-3xl font-bold text-center text-gray-800 md:text-4xl dark:text-gray-100">
            重要な動画
          </h2>
          <div className="flex justify-center">
            {/* Video Item 1 */}
            <div className="w-full">
              {/* 動画タイトルの色をTailwindで指定 */}
              <h3 className="mb-4 text-xl font-semibold text-center text-gray-800 dark:text-gray-100">
                [動画タイトル]
              </h3>
              <div className="video-container">
                {/* Replace with actual YouTube embed URL */}
                <iframe
                  src="https://www.youtube.com/embed/VIDEO_ID_1"
                  title="重要な動画1"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              {/* 動画説明文のテキスト色をTailwindで指定 */}
              <p className="mt-4 text-center text-gray-700 dark:text-gray-200">
                [ここに動画の説明文を記載してください。動画の内容やポイントなどを簡潔にまとめます。]
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Idea Origin Section - Moved to the bottom */}
      {/* 背景色とテキスト色をTailwindで指定 */}
      <section className="px-6 py-12 text-gray-700 bg-cyan-100 dark:bg-zinc-700 dark:text-gray-400">
        <div className="container mx-auto text-center">
          {/* タイトルの色をTailwindで指定 */}
          <h3 className="mb-4 text-2xl font-semibold text-blue-800 dark:text-teal-400">
            アイデアの出発点
          </h3>
          {/* 段落テキストの色をTailwindで指定 */}
          <p className="max-w-3xl mx-auto mb-4">
            このプロジェクトは、2016年に構想が始まりました。インターネット上の情報の海から価値あるものを見つけ出すというアイデアは、以下のQiita記事にその原点があります。
          </p>
          <p className="max-w-3xl mx-auto">
            {/* リンクのテキスト色をTailwindで指定 */}
            <a
              href="https://qiita.com/masakinihirota/items/017f9ea887788e015758"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-indigo-600 hover:underline dark:text-teal-500 dark:hover:text-teal-600"
            >
              masakinihirota 「真っ先に拾った」 #vns.blue - Qiita
            </a>
          </p>
        </div>
      </section>

      {/* Call to Action Section */}
      {/* 背景グラデーションとテキスト色をTailwindで指定 */}
      <section className="px-6 py-16 text-center text-white bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-800 dark:to-indigo-900">
        <div className="container mx-auto">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            あなたもmasakinihirotaで新しい発見と繋がりを。
          </h2>
          <p className="mb-8 text-xl opacity-90">
            価値観で繋がる心地よいコミュニティがあなたを待っています。
          </p>
          {/* Call to Action Button */}
          <div className="mt-8 text-lg">
            {/* ボタンの色とテキスト色をTailwindで指定 */}
            <a
              href="https://masakinihirota.com/"
              className="inline-block px-8 py-3 mt-4 font-bold text-blue-800 transition duration-300 bg-white rounded-full shadow-lg hover:bg-blue-50 dark:bg-teal-600 dark:text-white dark:hover:bg-teal-700"
            >
              サイトへアクセス
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* 背景色とテキスト色をTailwindで指定 */}
      <footer className="px-6 py-8 text-center text-white bg-blue-900 dark:bg-gray-950 dark:text-gray-400">
        <div className="container mx-auto">
          <p>© 2025 masakinihirota. All rights reserved.</p>
        </div>
      </footer>

      {/* Custom styles for this component using jsx */}
      {/* Tailwindで指定できない、またはカスタムが必要なスタイルのみを残す */}
      <style jsx>{`
        .concept-image {
            width: 100%;
            max-width: 500px; /* Limit max width */
            height: auto;
            margin: 20px auto; /* Center the image */
            display: block;
            border-radius: 8px; /* Rounded corners */
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Add shadow */
        }
        /* Image might need dark mode specific source or filter if it doesn't look good */
        /* .dark .concept-image { filter: invert(1); } */


        .oasis-declaration {
            margin-top: 3rem; /* Add space above the declaration */
            padding-top: 2rem;
            /* ボーダーの色はTailwindで指定 */
            border-top-width: 2px;
            border-top-style: dashed;
        }

        .oasis-declaration h3 {
            margin-bottom: 1rem;
        }
        .oasis-declaration ul {
            list-style: disc;
            margin-left: 1.5rem;
            text-align: left; /* Align list items to the left */
        }
        .oasis-declaration ul li {
            margin-bottom: 0.5rem;
            line-height: 1.6;
        }
        .toggle-header {
            cursor: pointer; /* Indicate it's clickable */
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 1rem;
        }
         .toggle-header::after {
            content: '+'; /* Plus sign when collapsed */
            margin-left: 0.5rem;
            font-size: 1.2em;
            transition: transform 0.3s ease;
          }
          .toggle-header.expanded::after {
             content: '-'; /* Minus sign when expanded */
             transform: rotate(0deg); /* Ensure no rotation */
           }
        .video-container {
            position: relative;
            padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
            height: 0;
            overflow: hidden;
            max-width: 800px; /* Limit max width for larger screens */
            background: #000;
            margin: 20px auto; /* Center the video */
            border-radius: 8px; /* Rounded corners */
        }
        .video-container iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }
        .idea-origin-section {
            padding-top: 3rem;
            padding-bottom: 3rem;
            /* 背景色はTailwindで指定 */
            text-align: center;
        }

        .idea-origin-section h3 {
            margin-bottom: 1rem;
        }
        .idea-origin-section p {
            max-width: 600px; /* Limit width for readability */
            margin: 0.5rem auto; /* Center paragraphs */
        }
      `}</style>
    </div>
  );
}
