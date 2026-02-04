"use client";

// アイコンとしてlucide-reactのBookOpenを使用
import { ChevronRight, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export const dynamic = "force-static";

// --- 利用規約コンテンツデータ (第1条〜第10条) ---
const TERMS_CONTENT = [
  {
    article: "第1条",
    title: "総則",
    content: [
      "1. この利用規約（以下「本規約」）は、VNS masakinihirota（以下「当サービス」）が提供するすべてのサービスの利用条件を定めるものです。",
      "2. ユーザーは、本規約に同意の上、当サービスを利用するものとします。",
      "3. 本規約に同意しない場合、当サービスを利用することはできません。",
    ],
  },
  {
    article: "第2条",
    title: "アカウント",
    content: [
      "1. ユーザーは、当サービスの利用にあたり、アカウントを作成する必要があります。",
      "2. アカウント情報は正確かつ最新の状態に保つ責任があります。",
      "3. アカウントの管理は、ユーザーの責任において行われるものとします。",
      "4. アカウント情報の不正使用が判明した場合、速やかに当サービスに報告してください。",
    ],
  },
  {
    article: "第3条",
    title: "コンテンツの投稿",
    content: [
      "1. ユーザーは、自己の責任において、作品情報、レビュー、コメントなどのコンテンツを投稿できます。",
      "2. 投稿するコンテンツは、以下の内容を含んではなりません。",
      [
        "- 違法または有害な内容",
        "- 他者の権利を侵害する内容",
        "- 差別的または攻撃的な内容",
        "- 虚偽の情報",
      ],
      "3. 当サービスは、規約に違反するコンテンツを削除または編集する権利を有します。",
    ],
  },
  {
    article: "第4条",
    title: "知的財産権",
    content: [
      "1. 当サービスに関するすべての知的財産権は、当サービスまたは権利者に帰属します。",
      "2. ユーザーが投稿したコンテンツの知的財産権は、ユーザーに帰属しますが、当サービスはサービス提供のために必要な範囲で使用できます。",
      "3. ユーザーは、第三者の知的財産権を侵害しないことに同意します。",
    ],
  },
  {
    article: "第5条",
    title: "プライバシー",
    content: [
      "1. 当サービスは、ユーザーの個人情報をプライバシーポリシーに従って取り扱います。",
      "2. 詳細は、プライバシーポリシーをご確認ください。",
      <a
        key="privacy-link"
        href="/privacy"
        className="text-primary hover:underline font-bold flex items-center mt-4 transition-colors"
      >
        <Lock className="w-5 h-5 mr-1" />
        プライバシーポリシーを見る
      </a>,
    ],
  },
  {
    article: "第6条",
    title: "禁止事項",
    content: [
      "ユーザーは、以下の行為を行ってはなりません。",
      [
        "1. 法令または公序良俗に反する行為",
        "2. 犯罪行為に関連する行為",
        "3. 他者の権利を侵害する行為",
        "4. 当サービスの運営を妨げる行為",
        "5. 不正アクセスまたはそれに類する行為",
        "6. 虚偽の情報を登録する行為",
        "7. スパムまたは迷惑行為",
        "8. その他、当サービスが不適切と判断する行為",
      ],
    ],
  },
  {
    article: "第7条",
    title: "サービスの変更・停止",
    content: [
      "1. 当サービスは、事前の通知なく、サービスの内容を変更または停止することがあります。",
      "2. サービスの変更・停止により生じた損害について、当サービスは一切の責任を負いません。",
    ],
  },
  {
    article: "第8条",
    title: "免責事項",
    content: [
      "1. 当サービスは、サービスの正確性、完全性、有用性について保証しません。",
      "2. 当サービスは、ユーザー間のトラブルについて一切の責任を負いません。",
      "3. 当サービスの利用により生じた損害について、当サービスは一切の責任を負いません。",
    ],
  },
  {
    article: "第9条",
    title: "規約の変更",
    content: [
      "1. 当サービスは、必要に応じて本規約を変更することがあります。",
      "2. 変更後の規約は、当サービスのウェブサイトに掲載した時点で効力を生じます。",
      "3. 変更後もサービスを利用した場合、変更後の規約に同意したものとみなします。",
    ],
  },
  {
    article: "第10条",
    title: "準拠法・管轄裁判所",
    content: [
      "1. 本規約の準拠法は日本法とします。",
      "2. 本規約に関する紛争については、当サービスの所在地を管轄する裁判所を専属的合意管轄裁判所とします。",
    ],
  },
];

const TermsOfServicePage = () => {
  const router = useRouter();

  // 登録画面への遷移をシミュレートする関数
  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground pb-20">
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto bg-card p-8 sm:p-10 lg:p-12 shadow-2xl rounded-xl border">
          {/* メインタイトルエリア */}
          <header className="mb-10 sm:mb-12 border-b-2 border-primary/20 pb-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-primary leading-tight">
              利用規約
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground font-light mt-1 mb-4">
              Terms of Service
            </p>
            <p className="text-lg sm:text-lg text-muted-foreground italic">
              最終更新日: 2024年12月31日
            </p>
          </header>

          {/* 利用規約本文 */}
          <div className="space-y-8 sm:space-y-10">
            {TERMS_CONTENT.map((section, index) => (
              <section key={index} className="space-y-4 md:space-y-5">
                {/* 記事タイトル (太字、プライマリーカラー) */}
                <h2 className="text-xl sm:text-2xl font-bold border-b-4 border-primary/30 pb-2 text-primary">
                  【{section.article}】{section.title}
                </h2>

                {/* 記事内容 (可読性を考慮したフォントと行間) */}
                <div className="text-lg sm:text-lg leading-relaxed text-foreground space-y-3">
                  {section.content.map((item, itemIndex) => {
                    if (React.isValidElement(item)) {
                      // リンク要素（第5条のプライバシーポリシーリンクなど）
                      return React.cloneElement(
                        item as React.ReactElement<any>,
                        {
                          key: `${index}-${itemIndex}`,
                          className:
                            "text-primary hover:underline font-bold flex items-center mt-4 transition-colors",
                        }
                      );
                    }
                    if (Array.isArray(item)) {
                      // 禁止事項などのリスト
                      return (
                        <ul
                          key={itemIndex}
                          className="list-disc pl-5 space-y-1 mt-2"
                        >
                          {item.map((listItem, listIndex) => (
                            <li key={listIndex} className="text-foreground">
                              {listItem}
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    // 通常の段落テキスト
                    return <p key={itemIndex}>{item}</p>;
                  })}
                </div>
              </section>
            ))}
          </div>

          {/* ボタンエリア */}
          <div className="mt-16 pt-8 border-t">
            {/* 認証が必須な場合はこのボタンを表示 */}
            <button
              onClick={handleRegister}
              className="w-full sm:w-auto px-10 py-4 bg-primary text-primary-foreground text-lg font-bold rounded-xl shadow-lg hover:opacity-90 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-primary/30 flex items-center justify-center mx-auto"
            >
              同意して新規会員登録へ進む
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsOfServicePage;
