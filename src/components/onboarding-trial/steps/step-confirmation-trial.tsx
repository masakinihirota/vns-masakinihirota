import { Check, AlertCircle, MapPin, Star } from "lucide-react";
import { CULTURAL_SPHERES } from "@/components/onboarding-pc/onboarding.logic";
import { WeekScheduler } from "../../ui/week-scheduler";

interface StepConfirmationTrialProps {
  data: any;
  onBack: () => void;
  onSubmit: () => void;
}

export const StepConfirmationTrial: React.FC<StepConfirmationTrialProps> = ({
  data,
  onBack: _onBack,
  onSubmit: _onSubmit,
}) => {
  const {
    // Step 1
    agreed_oasis,
    // Step 2
    activity_area_id,
    moon_location,
    mars_location,
    activity_culture_code,
    selectedCountry,
    selectedRegion,
    // Step 3
    core_activity_start,
    core_activity_end,
    holidayActivityStart,
    holidayActivityEnd,
    week_schedule,
    // Step 4
    zodiac_sign,
    birth_generation,
    // Step 5
    nativeLanguages,
  } = data;

  // Validations
  const isAgreedOasisValid = agreed_oasis === true;

  const isResidenceValid = !!(
    activity_area_id ||
    moon_location ||
    mars_location
  );
  const isCultureValid = !!activity_culture_code;

  const isZodiacValid = !!zodiac_sign;
  const isGenerationValid = !!birth_generation;

  const isNativeLanguageValid = nativeLanguages && nativeLanguages.length > 0;

  const allValid =
    isAgreedOasisValid &&
    isResidenceValid &&
    isCultureValid &&
    isZodiacValid &&
    isGenerationValid &&
    isNativeLanguageValid;

  const getCultureLabel = (code: string) => {
    return CULTURAL_SPHERES.find((s) => s.id === code)?.label || code;
  };

  const ConfirmationSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="mb-6 last:mb-0">
      <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-100 dark:border-slate-800 pb-1">
        {title}
      </h3>
      <div className="space-y-0">{children}</div>
    </div>
  );

  const ConfirmationRow = ({
    label,
    value,
    isRequired = false,
    isValid = true,
  }: {
    label: string;
    value: React.ReactNode;
    isRequired?: boolean;
    isValid?: boolean;
  }) => (
    <div className="flex flex-col sm:flex-row sm:items-baseline py-2 border-b border-slate-50 dark:border-slate-800/50 last:border-0 text-sm">
      <div className="sm:w-1/3 flex-shrink-0 text-slate-500 dark:text-slate-400 font-medium flex items-center">
        {label}
        {isRequired && <span className="text-red-500 ml-1 font-bold">*</span>}
      </div>
      <div className="sm:w-2/3 flex-grow mt-1 sm:mt-0 font-medium text-slate-900 dark:text-slate-200 break-words">
        {value}
        {!isValid && isRequired && (
          <span className="block text-red-500 text-xs mt-1 flex items-center">
            <AlertCircle size={10} className="mr-1" /> 必須項目です
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          設定内容の確認（お試し版）
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          以下の内容で登録します。
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 max-h-[60vh] overflow-y-auto">
        {/* Step 1: Declarations */}
        <ConfirmationSection title="誓い">
          <ConfirmationRow
            label="オアシス宣言"
            isRequired
            isValid={isAgreedOasisValid}
            value={
              agreed_oasis ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center">
                  <Check size={14} className="mr-1" /> 同意済み
                </span>
              ) : (
                <span className="text-slate-400">未同意</span>
              )
            }
          />
        </ConfirmationSection>

        {/* Step 2: Residence & Culture */}
        <ConfirmationSection title="居住地・文化圏">
          <ConfirmationRow
            label="住居エリア"
            isRequired
            isValid={isResidenceValid}
            value={
              <div className="flex flex-col gap-1">
                {activity_area_id && (
                  <span>
                    <MapPin size={14} className="inline mr-1 text-indigo-500" />
                    Earth Area {activity_area_id}
                  </span>
                )}
                {moon_location && <span>🌑 Moon: {moon_location}</span>}
                {mars_location && <span>🔴 Mars: {mars_location}</span>}
                {!activity_area_id && !moon_location && !mars_location && (
                  <span className="text-slate-400">未選択</span>
                )}
              </div>
            }
          />
          <ConfirmationRow
            label="文化圏"
            isRequired
            isValid={isCultureValid}
            value={
              activity_culture_code ? (
                <div>
                  {getCultureLabel(activity_culture_code)}
                  {selectedCountry && (
                    <span className="text-slate-500 dark:text-slate-400 ml-2 text-xs">
                      ({selectedCountry}
                      {selectedRegion ? `, ${selectedRegion} ` : ""})
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-slate-400">未選択</span>
              )
            }
          />
        </ConfirmationSection>

        {/* Step 3: Hours */}
        <ConfirmationSection title="活動時間">
          <ConfirmationRow
            label="第一活動時間 (仕事)"
            isRequired
            value={`${core_activity_start || "09:00"} ～ ${core_activity_end || "18:00"} `}
          />
          <ConfirmationRow
            label="自由行動時間"
            value={`${holidayActivityStart || "09:00"} ～ ${holidayActivityEnd || "18:00"} `}
          />
          {week_schedule && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
                週間スケジュール
              </p>
              <div className="transform scale-90 origin-top-left sm:scale-100 sm:origin-top">
                <WeekScheduler
                  value={week_schedule}
                  onChange={() => {}}
                  readOnly
                  labels={{ MATCH: "自由行動時間" }}
                  labelClassName="text-[18px]"
                />
              </div>
            </div>
          )}
        </ConfirmationSection>

        {/* Step 4: Identity */}
        <ConfirmationSection title="アイデンティティ">
          <ConfirmationRow
            label="星座"
            isRequired
            isValid={isZodiacValid}
            value={
              zodiac_sign ? (
                <div className="flex items-center">
                  <Star size={14} className="text-amber-500 mr-1" />
                  <span className="capitalize">{zodiac_sign}</span>
                </div>
              ) : (
                <span className="text-slate-400">未選択</span>
              )
            }
          />
          <ConfirmationRow
            label="生誕世代"
            isRequired
            isValid={isGenerationValid}
            value={
              birth_generation || <span className="text-slate-400">未選択</span>
            }
          />
        </ConfirmationSection>

        {/* Step 5: Language */}
        <ConfirmationSection title="言語">
          <ConfirmationRow
            label="母語"
            isRequired
            isValid={isNativeLanguageValid}
            value={
              nativeLanguages && nativeLanguages.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {nativeLanguages.map((lang: string) => (
                    <span
                      key={lang}
                      className="text-xs bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-600"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-slate-400">未選択</span>
              )
            }
          />
        </ConfirmationSection>
      </div>

      <div className="flex flex-col gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        {!allValid ? (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm font-bold flex items-center justify-center animate-pulse">
            <AlertCircle size={18} className="mr-2" />
            必須項目（*）に未入力の内容があります
          </div>
        ) : (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-sm font-bold flex items-center justify-center">
            <Check size={18} className="mr-2" />
            入力内容に問題はありません (お試し版)
          </div>
        )}
      </div>
    </div>
  );
};
