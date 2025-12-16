import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown, Globe, Languages, MapPin, MessageCircle } from "lucide-react";

// 都道府県データ
const PREFECTURES = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
];

// 文化圏ごとの詳細設定データ
const DETAILED_REGIONS: Record<string, { countries: { name: string; regions?: string[] }[] }> = {
  japanese: {
    countries: [{ name: "日本 (Japan)", regions: PREFECTURES }],
  },
  english: {
    countries: [
      { name: "アメリカ合衆国 (USA)" },
      { name: "イギリス (UK)" },
      { name: "カナダ (Canada)" },
      { name: "オーストラリア (Australia)" },
      { name: "その他 (Others)" },
    ],
  },
};

const GENERATIONS = [
  "1940年代以前",
  "1950年代",
  "1960年代",
  "1970年代",
  "1980年代",
  "1990年代",
  "2000年代",
  "2010年代",
  "2020年代以降",
];

// 言語リスト（ジブリ多言語展開に基づく + 中国語分割）
const LANGUAGE_OPTIONS = [
  "日本語 (Japanese)",
  "英語 (English)",
  "フランス語 (French)",
  "ドイツ語 (German)",
  "韓国語 (Korean)",
  "中国語 (繁体字) (Chinese Traditional)",
  "中国語 (簡体字) (Chinese Simplified)",
  "スペイン語 (Spanish)",
  "イタリア語 (Italian)",
  "ポルトガル語 (Portuguese)",
  "ロシア語 (Russian)",
];

export default function App() {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [culturalSphere, setCulturalSphere] = useState("");
  const [birthGeneration, setBirthGeneration] = useState("");

  // 詳細設定用のState
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  // 言語設定用のState
  const [nativeLanguage, setNativeLanguage] = useState("");
  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);

  // 同意事項用のState
  const [isAdult, setIsAdult] = useState(false);
  const [agreements, setAgreements] = useState({
    oasis: false,
    human: false,
    honesty: false,
  });

  const handleCulturalSphereChange = (sphereId: string) => {
    setCulturalSphere(sphereId);
    setSelectedCountry("");
    setSelectedRegion("");
    if (sphereId === "japanese") {
      setSelectedCountry("日本 (Japan)");
    }
  };

  const culturalSpheres = [
    { id: "japanese", label: "日本語文化圏", en: "Japanese" },
    { id: "english", label: "英語文化圏", en: "English" },
    { id: "french", label: "フランス語文化圏", en: "French" },
    { id: "german", label: "ドイツ語文化圏", en: "German" },
    { id: "korean", label: "韓国語文化圏", en: "Korean" },
    { id: "chinese_traditional", label: "中国語文化圏 (繁体字)", en: "Chinese (Traditional)" },
    { id: "chinese_simplified", label: "中国語文化圏 (簡体字)", en: "Chinese (Simplified)" },
    { id: "spanish", label: "スペイン語文化圏", en: "Spanish" },
    { id: "italian", label: "イタリア語文化圏", en: "Italian" },
    { id: "portuguese", label: "ポルトガル語文化圏", en: "Portuguese" },
    { id: "russian", label: "ロシア語文化圏", en: "Russian" },
    { id: "other", label: "その他の文化圏", en: "Others" },
  ];

  const toggleAvailableLanguage = (lang: string) => {
    setAvailableLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang],
    );
  };

  const toggleAgreement = (key: keyof typeof agreements) => {
    setAgreements((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      selectedArea,
      culturalSphere,
      birthGeneration,
      selectedCountry,
      selectedRegion,
      nativeLanguage,
      availableLanguages,
      isAdult,
      agreements,
    });
    alert("アカウント作成リクエストを送信しました（デモ）");
  };

  const currentDetail = culturalSphere ? DETAILED_REGIONS[culturalSphere] : null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="font-bold text-xl">VNS Onboarding</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <div className="flex justify-center items-center min-h-[80vh]">
          <div className="w-full max-w-4xl bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-12 max-w-3xl mx-auto py-8">
              {/* Form Header */}
              <div className="space-y-4 text-center">
                <h1 className="text-3xl font-bold text-slate-900">ルートアカウント作成</h1>
                <p className="text-slate-500">
                  VNSプラットフォームへようこそ。アカウントの基本情報を登録してください。
                </p>
              </div>

              {/* Step 1: Earth Division Field */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-slate-800 leading-none font-medium text-lg">
                  <span className="bg-slate-900 text-white text-xs px-2 py-1 rounded-full">
                    Step 1
                  </span>
                  地球3 (Earth Division)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      id: "area1",
                      label: "エリア 1",
                      color: "bg-blue-50 text-blue-500",
                      image: "/world/area1.png",
                    },
                    {
                      id: "area2",
                      label: "エリア 2",
                      color: "bg-green-50 text-green-500",
                      image: "/world/area2.png",
                    },
                    {
                      id: "area3",
                      label: "エリア 3",
                      color: "bg-orange-50 text-orange-500",
                      image: "/world/area3.png",
                    },
                  ].map((area) => (
                    <div
                      key={area.id}
                      onClick={() => setSelectedArea(area.id)}
                      className={`
                        cursor-pointer rounded-xl border-2 p-4 transition-all relative group overflow-hidden
                        ${
                          selectedArea === area.id
                            ? "border-yellow-400 bg-yellow-50/50 shadow-md"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-1"
                        }
                      `}
                    >
                      <div className="aspect-[3/2] relative w-full mb-3">
                        <div className="absolute inset-0 rounded-md overflow-hidden">
                          <Image
                            src={area.image}
                            alt={area.label}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      </div>
                      <div className="text-center font-semibold text-slate-700">{area.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Cultural Sphere Field */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-slate-800 leading-none font-medium text-lg">
                  <span className="bg-slate-900 text-white text-xs px-2 py-1 rounded-full">
                    Step 2
                  </span>
                  文化圏 (Cultural Sphere)
                </label>
                <div className="mb-2">
                  <p className="text-sm text-slate-500">
                    主に活動する、または拠点とする文化圏を選択してください。
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    ※文化圏の分類はジブリのDVD販売文化圏に依拠しています。
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {culturalSpheres.map((sphere) => (
                    <div
                      key={sphere.id}
                      onClick={() => handleCulturalSphereChange(sphere.id)}
                      className={`
                        cursor-pointer rounded-lg border-2 p-3 transition-all relative group overflow-hidden flex flex-col items-center justify-center text-center h-full min-h-[100px]
                        ${
                          culturalSphere === sphere.id
                            ? "border-yellow-400 bg-yellow-50/50 shadow-md"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-1"
                        }
                      `}
                    >
                      <div className="mb-2 p-2 rounded-full bg-slate-100 text-slate-500">
                        <Languages className="w-5 h-5" />
                      </div>
                      <div className="font-semibold text-slate-700 text-sm">{sphere.label}</div>
                      <div className="text-xs text-slate-400 mt-1 text-balance">{sphere.en}</div>
                    </div>
                  ))}
                </div>

                {/* 詳細地域設定 */}
                {currentDetail && (
                  <div className="mt-6 p-5 bg-slate-50 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex items-start gap-3 mb-4">
                      <MapPin className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
                      <div>
                        <h3 className="font-semibold text-slate-800">詳細地域の設定</h3>
                        <p className="text-sm text-slate-600 mt-1">
                          ※利用者数の多い文化圏については、より詳細な地域設定が可能です。
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          国 / Country
                        </label>
                        <div className="relative">
                          <select
                            value={selectedCountry}
                            onChange={(e) => {
                              setSelectedCountry(e.target.value);
                              setSelectedRegion("");
                            }}
                            className="appearance-none w-full h-12 px-4 bg-white border border-slate-300 rounded-lg text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                          >
                            <option value="" disabled>
                              国を選択してください
                            </option>
                            {currentDetail.countries.map((c) => (
                              <option key={c.name} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      {selectedCountry &&
                        currentDetail.countries.find((c) => c.name === selectedCountry)
                          ?.regions && (
                          <div className="space-y-1 animate-in fade-in slide-in-from-left-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                              都道府県 / Prefecture
                            </label>
                            <div className="relative">
                              <select
                                value={selectedRegion}
                                onChange={(e) => setSelectedRegion(e.target.value)}
                                className="appearance-none w-full h-12 px-4 bg-white border border-slate-300 rounded-lg text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                              >
                                <option value="" disabled>
                                  都道府県を選択
                                </option>
                                {currentDetail.countries
                                  .find((c) => c.name === selectedCountry)
                                  ?.regions?.map((r) => (
                                    <option key={r} value={r}>
                                      {r}
                                    </option>
                                  ))}
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Birth Generation Field */}
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-slate-800 leading-none font-medium text-lg">
                  <span className="bg-slate-900 text-white text-xs px-2 py-1 rounded-full">
                    Step 3
                  </span>
                  生誕世代 (Birth Generation)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {GENERATIONS.map((gen) => (
                    <div
                      key={gen}
                      onClick={() => setBirthGeneration(gen)}
                      className={`
                        cursor-pointer rounded-lg border-2 p-3 transition-all relative group overflow-hidden flex items-center justify-center text-center h-14
                        ${
                          birthGeneration === gen
                            ? "border-yellow-400 bg-yellow-50/50 shadow-md font-semibold"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-1"
                        }
                      `}
                    >
                      <div className="text-slate-700 text-sm">{gen}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 4: Languages Field */}
              <div className="space-y-6">
                <label className="flex items-center gap-2 text-slate-800 leading-none font-medium text-lg">
                  <span className="bg-slate-900 text-white text-xs px-2 py-1 rounded-full">
                    Step 4
                  </span>
                  言語設定 (Languages)
                </label>

                {/* 母語 */}
                <div className="space-y-2 pl-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    母語 (Native Language)
                  </label>
                  <p className="text-xs text-slate-500 mb-2">
                    あなたの第一言語を選択してください。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[...LANGUAGE_OPTIONS, "その他 (Others)"].map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setNativeLanguage(lang)}
                        className={`
                          px-3 py-2 rounded-full text-sm border transition-all
                          ${
                            nativeLanguage === lang
                              ? "bg-slate-800 text-white border-slate-800 shadow-sm"
                              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                          }
                        `}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 使用可能言語 */}
                <div className="space-y-2 pl-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    使用可能言語 (Available Languages)
                  </label>
                  <p className="text-xs text-slate-500 mb-2">
                    母語以外にコミュニケーション可能な言語があれば複数選択してください。
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[...LANGUAGE_OPTIONS, "その他 (Others)"].map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleAvailableLanguage(lang)}
                        className={`
                          px-3 py-2 rounded-full text-sm border transition-all
                          ${
                            availableLanguages.includes(lang)
                              ? "bg-slate-800 text-white border-slate-800 shadow-sm"
                              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                          }
                        `}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 5: Agreements */}
              <div className="space-y-6 pt-4 border-t border-slate-200">
                <label className="flex items-center gap-2 text-slate-800 leading-none font-medium text-lg">
                  <span className="bg-slate-900 text-white text-xs px-2 py-1 rounded-full">
                    Step 5
                  </span>
                  確認事項 (Confirmation)
                </label>

                <div className="space-y-4 bg-yellow-50/50 p-6 rounded-xl border border-yellow-100">
                  {/* 成人確認 */}
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-100 shadow-sm">
                    <div className="flex h-6 items-center">
                      <input
                        id="is-adult"
                        type="checkbox"
                        checked={isAdult}
                        onChange={(e) => setIsAdult(e.target.checked)}
                        className="h-5 w-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                      />
                    </div>
                    <div className="ml-0">
                      <label
                        htmlFor="is-adult"
                        className="text-sm font-medium text-slate-900 cursor-pointer"
                      >
                        成人確認 (Adult Confirmation)
                      </label>
                      <p className="text-xs text-slate-500">
                        私は18歳以上であり、かつ、私の居住する国・地域における成人年齢（または本サービスの利用が許可される年齢）に達していることを確認します。
                      </p>
                    </div>
                  </div>

                  {/* 3つの宣言 */}
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-slate-800 px-1">
                      以下の方針に同意します：
                    </p>

                    {[
                      {
                        key: "oasis",
                        label: "オアシス宣言 (Oasis Declaration)",
                        desc: "他者の平穏を乱さず、心地よい空間維持に努めます。",
                      },
                      {
                        key: "human",
                        label: "人間宣言 (Human Declaration)",
                        desc: "AIやボットではなく、人間としての責任を持って行動します。",
                      },
                      {
                        key: "honesty",
                        label: "正直宣言 (Honesty Declaration)",
                        desc: "偽りのない情報を登録し、誠実なコミュニケーションを行います。",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-start gap-3 p-3 bg-white rounded-lg border border-slate-100 shadow-sm"
                      >
                        <div className="flex h-6 items-center">
                          <input
                            id={`agree-${item.key}`}
                            type="checkbox"
                            checked={agreements[item.key as keyof typeof agreements]}
                            onChange={() => toggleAgreement(item.key as keyof typeof agreements)}
                            className="h-5 w-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                          />
                        </div>
                        <div className="ml-0">
                          <label
                            htmlFor={`agree-${item.key}`}
                            className="text-sm font-medium text-slate-900 cursor-pointer"
                          >
                            {item.label}
                          </label>
                          <p className="text-xs text-slate-500">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={
                    !isAdult || !agreements.oasis || !agreements.human || !agreements.honesty
                  }
                  className={`
                    w-full min-h-14 px-4 py-3 rounded-lg font-medium transition-all shadow-sm text-lg
                    ${
                      !isAdult || !agreements.oasis || !agreements.human || !agreements.honesty
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-slate-900 hover:bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
                    }
                  `}
                >
                  アカウントを作成する
                </button>
                <p className="text-center text-xs text-slate-400 mt-4">
                  ※全ての必須項目と同意事項にチェックを入れるとボタンが有効になります。
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
