import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Step1RoleType } from "./steps/step-1-role-type";
import { Step2PurposeIdentity } from "./steps/step-2-purpose-identity";
import { Step3OwnWorks } from "./steps/step-3-own-works";
import { Step4FavoriteWorks } from "./steps/step-4-favorite-works";
import { Step5Values } from "./steps/step-5-values";
import { Step6Confirmation } from "./steps/step-6-confirmation";
import { RatingHelpModal } from "./ui/rating-help-modal";
import { StepIndicator } from "./ui/step-indicator";
import { UserProfileCreationContainerProps } from "./user-profile-creation.container";
import { Step } from "./user-profile-creation.types";

const STEPS: Step[] = [
  { id: 1, label: "Role & Type", desc: "役割とタイプの選択" },
  { id: 2, label: "Purpose & ID", desc: "目的と匿名IDの設定" },
  { id: 3, label: "My Portfolio", desc: "自分の作品 (任意)" },
  { id: 4, label: "Favorites", desc: "好きな作品 (任意)" },
  { id: 5, label: "Values", desc: "価値観の入力" },
  { id: 6, label: "Confirm", desc: "最終確認" },
];

export const UserProfileCreation = (
  props: UserProfileCreationContainerProps
) => {
  const { currentStep, setCurrentStep, showRatingHelp, setShowRatingHelp } =
    props;

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1RoleType
            formData={props.formData}
            updateForm={props.updateForm as (key: string, value: any) => void}
          />
        );
      case 2:
        return (
          <Step2PurposeIdentity
            formData={props.formData}
            togglePurpose={props.togglePurpose}
            updateForm={props.updateForm as (key: string, value: any) => void}
            handleUndoCandidates={props.handleUndoCandidates}
            historyIndex={props.historyIndex}
            handleGenerateCandidates={props.handleGenerateCandidates}
          />
        );
      case 3:
        return (
          <Step3OwnWorks
            formData={props.formData}
            addOwnWork={props.addOwnWork}
            updateOwnWork={props.updateOwnWork}
            removeOwnWork={props.removeOwnWork}
          />
        );
      case 4:
        return (
          <Step4FavoriteWorks
            formData={props.formData}
            activePeriod={props.activePeriod}
            setActivePeriod={props.setActivePeriod}
            ratingType={props.ratingType}
            setRatingType={props.setRatingType}
            setShowRatingHelp={props.setShowRatingHelp}
            toggleBestWork={props.toggleBestWork}
            setWorkTier={props.setWorkTier}
            removeFavWork={props.removeFavWork}
            handleRegisterNewWork={props.handleRegisterNewWork}
            masterSearch={props.masterSearch}
            setMasterSearch={props.setMasterSearch}
            filterCategories={props.filterCategories}
            setFilterCategories={props.setFilterCategories}
            filterEras={props.filterEras}
            setFilterEras={props.setFilterEras}
            searchedMasterWorks={props.searchedMasterWorks}
            addFavWorkFromMaster={props.addFavWorkFromMaster}
          />
        );
      case 5:
        return (
          <Step5Values
            formData={props.formData}
            togglePurpose={props.togglePurpose}
            ratingType={props.ratingType}
            setRatingType={props.setRatingType}
            setShowRatingHelp={props.setShowRatingHelp}
            valueSelections={props.valueSelections}
            valueTiers={props.valueTiers}
            addedQuestionIds={props.addedQuestionIds}
            removedQuestionIds={props.removedQuestionIds}
            setAddedQuestionIds={props.setAddedQuestionIds}
            setRemovedQuestionIds={props.setRemovedQuestionIds}
            handleValueSelection={props.handleValueSelection}
            toggleValueTier={props.toggleValueTier}
            openQuestionId={props.openQuestionId}
            setOpenQuestionId={props.setOpenQuestionId}
            currentPage={props.currentPage}
            setCurrentPage={props.setCurrentPage}
          />
        );
      case 6:
        return (
          <Step6Confirmation
            formData={props.formData}
            valueSelections={props.valueSelections}
            valueTiers={props.valueTiers}
            addedQuestionIds={props.addedQuestionIds}
            removedQuestionIds={props.removedQuestionIds}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      {/* Sidebar: Step Indicator */}
      <StepIndicator
        currentStep={currentStep}
        steps={STEPS}
        onStepClick={setCurrentStep}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative w-full">
        {/* Mobile Header (Visible only on small screens) */}
        <div className="md:hidden shrink-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between z-20">
          <span className="font-bold text-slate-700 dark:text-slate-200">
            Step {currentStep}: {STEPS[currentStep - 1].label}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 disabled:opacity-30"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              disabled={currentStep === STEPS.length}
              className="p-2 rounded-lg bg-indigo-600 text-white disabled:opacity-30"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="w-full p-4 md:p-12 pb-32">
          <div className="max-w-4xl mx-auto flex flex-col">
            {/* Disclaimer Banner */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-3 text-white shadow-md mb-8 flex items-start gap-3 shrink-0">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-bold mb-1">
                  これはVNS masakinihirotaのプロフィール作成画面です
                </p>
                <p className="opacity-90 leading-snug text-xs">
                  すべての項目は後から変更可能です。直感的に選んで進んでください。
                </p>
              </div>
            </div>

            {/* Dynamic Step Content */}
            <div className="w-full relative">{renderCurrentStep()}</div>
          </div>
        </div>

        {/* Floating Footer Navigation */}
        <div className="fixed bottom-0 left-0 right-0 md:left-64 p-4 md:p-8 bg-gradient-to-t from-white via-white to-transparent dark:from-slate-950 dark:via-slate-950 z-10 pointer-events-none">
          <div className="max-w-4xl mx-auto flex items-center justify-between pointer-events-auto">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold shadow-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all active:scale-95"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                戻る
              </button>
            ) : (
              <div className="flex gap-4">
                <Link
                  href="/"
                  className="group flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                >
                  はじまりの国へ戻る
                </Link>
              </div>
            )}

            {currentStep < STEPS.length ? (
              <button
                onClick={handleNext}
                disabled={props.isSubmitting}
                className="group flex items-center gap-2 px-8 py-3 rounded-full bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                次へ進む
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                onClick={() => {
                  if (props.onComplete) {
                    props.onComplete(props.formData);
                  } else {
                    // Fallback for demo/dev
                    alert("プロフィールを作成しました！（デモ）");
                    window.location.href = "/home";
                  }
                }}
                disabled={props.isSubmitting}
                className="group flex items-center gap-2 px-10 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-purple-200 dark:shadow-purple-900/30 hover:shadow-xl hover:-translate-y-0.5 hover:brightness-110 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {props.isSubmitting ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    保存中...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    プロフィール作成を完了
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Modals */}
        {showRatingHelp && (
          <RatingHelpModal
            onClose={() => setShowRatingHelp(false)}
            context={currentStep === 5 ? "VALUES" : "WORKS"}
          />
        )}
      </div>
    </div>
  );
};
