import { Check, AlertCircle, MapPin, Globe, User, Star } from "lucide-react";
import { CULTURAL_SPHERES } from "../onboarding.logic";

interface StepConfirmationPCProps {
  data: any;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const StepConfirmationPC: React.FC<StepConfirmationPCProps> = ({
  data,
  onBack,
  onSubmit,
  isSubmitting,
}) => {
  const {
    // Step 1
    activity_area_id,
    moon_location,
    mars_location,
    activity_culture_code,
    selectedCountry,
    selectedRegion,
    // Step 3
    is_minor,
    zodiac_sign,
    birth_generation,
    // Step 4
    nativeLanguages,
    // Step 2
    basic_values,
  } = data;

  // Validations
  const basicValuesCount = Object.keys(basic_values || {}).length;
  const isBasicValuesValid = basicValuesCount === 10;
  const isMinorValid = is_minor === false;
  const isLanguageValid = nativeLanguages && nativeLanguages.length > 0;
  const isResidenceValid = !!(
    activity_area_id ||
    moon_location ||
    mars_location
  );
  const isCultureValid = !!activity_culture_code;
  const isZodiacValid = !!zodiac_sign;

  const allValid =
    isBasicValuesValid &&
    isMinorValid &&
    isLanguageValid &&
    isResidenceValid &&
    isCultureValid &&
    isZodiacValid;

  const getCultureLabel = (code: string) => {
    return CULTURAL_SPHERES.find((s) => s.id === code)?.label || code;
  };

  const ValidationItem = ({
    isValid,
    label,
    value,
    errorMsg,
  }: {
    isValid: boolean;
    label: string;
    value: React.ReactNode;
    errorMsg: string;
  }) => (
    <div
      className={`p-4 rounded-lg border flex items-start justify-between gap-4 transition-colors ${
        isValid
          ? "bg-slate-50 dark:bg-slate-800/50 border-emerald-100 dark:border-emerald-900/30"
          : "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30"
      }`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {label}
          </span>
          {isValid ? (
            <div className="flex items-center text-xs text-emerald-600 dark:text-emerald-400 font-medium px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <Check size={12} className="mr-1" /> OK
            </div>
          ) : (
            <div className="flex items-center text-xs text-red-600 dark:text-red-400 font-medium px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertCircle size={12} className="mr-1" /> 必須
            </div>
          )}
        </div>
        <div className="text-slate-900 dark:text-white font-medium text-lg">
          {value || <span className="text-slate-400 text-sm">未設定</span>}
        </div>
        {!isValid && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
            {errorMsg}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          設定内容の確認
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          以下の内容で登録します。よろしいですか？
        </p>
      </div>

      <div className="grid gap-4">
        {/* 1. Basic Values */}
        <ValidationItem
          isValid={isBasicValuesValid}
          label="10の基本価値観"
          value={`${basicValuesCount} / 10 問 回答済み`}
          errorMsg="全ての質問に回答してください"
        />

        {/* 2. Age Verification */}
        <ValidationItem
          isValid={isMinorValid}
          label="年齢確認"
          value={
            is_minor === false
              ? "成人 (いいえ)"
              : is_minor === true
                ? "未成年 (はい)"
                : null
          }
          errorMsg={
            is_minor === true
              ? "未成年の方は利用できません"
              : "年齢確認を行ってください"
          }
        />

        {/* 3. Residence */}
        <ValidationItem
          isValid={isResidenceValid}
          label="住居エリア"
          value={
            <div className="flex flex-col gap-1 text-sm">
              {activity_area_id && (
                <div className="flex items-center gap-1">
                  <MapPin size={14} className="text-indigo-500" />
                  Earth Area {activity_area_id}
                </div>
              )}
              {moon_location && (
                <div className="flex items-center gap-1">
                  <span className="text-xs">🌑</span> Moon: {moon_location}
                </div>
              )}
              {mars_location && (
                <div className="flex items-center gap-1">
                  <span className="text-xs">🔴</span> Mars: {mars_location}
                </div>
              )}
            </div>
          }
          errorMsg="地球、月、火星のいずれかのエリアを選択してください"
        />

        {/* 4. Culture */}
        <ValidationItem
          isValid={isCultureValid}
          label="文化圏"
          value={
            activity_culture_code ? (
              <div>
                {getCultureLabel(activity_culture_code)}
                {selectedCountry && (
                  <span className="text-sm text-slate-500 ml-2">
                    ({selectedCountry}
                    {selectedRegion ? `, ${selectedRegion}` : ""})
                  </span>
                )}
              </div>
            ) : null
          }
          errorMsg="住んでいる文化圏を選択してください"
        />

        {/* 5. Identity */}
        <ValidationItem
          isValid={isZodiacValid}
          label="星座"
          value={
            zodiac_sign ? (
              <div className="flex items-center gap-2">
                <Star size={16} className="text-amber-500" />
                <span className="capitalize">{zodiac_sign}</span>
                {birth_generation && (
                  <span className="text-slate-500 text-sm">
                    ({birth_generation})
                  </span>
                )}
              </div>
            ) : null
          }
          errorMsg="星座を選択してください"
        />

        {/* 6. Language */}
        <ValidationItem
          isValid={isLanguageValid}
          label="母語"
          value={
            nativeLanguages && nativeLanguages.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {nativeLanguages.map((lang: string) => (
                  <span
                    key={lang}
                    className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded text-sm"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            ) : null
          }
          errorMsg="母語を少なくとも1つ選択してください"
        />
      </div>

      <div className="flex flex-col gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
        {!allValid ? (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-bold flex items-center justify-center">
            <AlertCircle size={18} className="mr-2" />
            全ての必須項目を入力してください
          </div>
        ) : (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm font-bold flex items-center justify-center">
            <Check size={18} className="mr-2" />
            入力完了です！設定を保存できます
          </div>
        )}
      </div>
    </div>
  );
};
