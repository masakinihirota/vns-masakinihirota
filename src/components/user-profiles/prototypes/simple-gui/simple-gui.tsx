import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import React from "react";
import { useSimpleGui } from "./simple-gui.logic";
import { Step1RoleType } from "./steps/step-1-role-type";
import { Step2PurposeIdentity } from "./steps/step-2-purpose-identity";
import { Step3OwnWorks } from "./steps/step-3-own-works";
import { Step4FavoriteWorks } from "./steps/step-4-favorite-works";
import { Step5Values } from "./steps/step-5-values";
import { Step6Confirmation } from "./steps/step-6-confirmation";
import { RatingHelpModal } from "./ui/rating-help-modal";
import { StepIndicator } from "./ui/step-indicator";

type SimpleGuiViewProps = ReturnType<typeof useSimpleGui>;

export const SimpleGuiView = (props: SimpleGuiViewProps) => {
  const {
    currentStep,
    setCurrentStep,
    formData,
    showRatingHelp,
    setShowRatingHelp,
  } = props;

  return (
    <div className="flex h-full bg-white dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 overflow-hidden text-left">
      {/* Sidebar Navigation */}
      <StepIndicator
        currentStep={currentStep}
        steps={[
          { id: 1, label: "Role & Type", desc: "役割とタイプ" },
          { id: 2, label: "Purpose & Identity", desc: "目的と匿名" },
          { id: 3, label: "Own Works", desc: "自分の作品" },
          { id: 4, label: "Favorite Works", desc: "私の好きな作品" },
          { id: 5, label: "Values", desc: "価値観" },
          { id: 6, label: "Confirm", desc: "最終確認" },
        ]}
        onStepClick={setCurrentStep}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative">
        {/* Top Right Navigation */}
        <div className="absolute top-6 right-6 md:right-12 z-10">
          {currentStep < 6 ? (
            <button
              onClick={() => setCurrentStep((prev) => Math.min(6, prev + 1))}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 shadow-md transition-all hover:scale-105 active:scale-95 text-sm"
            >
              次へ進む
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold shadow-md transition-all text-sm ${
                formData.purposes.length === 0
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                  : "bg-green-600 text-white hover:bg-green-700 hover:scale-105 active:scale-95"
              }`}
              disabled={formData.purposes.length === 0}
              onClick={() => alert("Profile Created!")}
            >
              プロフィール作成
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 md:px-12 py-12 scroll-smooth">
          <div
            className={`mx-auto pb-24 ${currentStep === 4 ? "w-full max-w-full" : "max-w-5xl"}`}
          >
            {currentStep === 1 && (
              <Step1RoleType
                formData={formData}
                updateForm={props.updateForm}
              />
            )}
            {currentStep === 2 && (
              <Step2PurposeIdentity
                formData={formData}
                togglePurpose={props.togglePurpose}
                updateForm={props.updateForm}
                handleUndoCandidates={props.handleUndoCandidates}
                historyIndex={props.historyIndex}
                handleGenerateCandidates={props.handleGenerateCandidates}
              />
            )}
            {currentStep === 3 && (
              <Step3OwnWorks
                formData={formData}
                addOwnWork={props.addOwnWork}
                updateOwnWork={props.updateOwnWork}
                removeOwnWork={props.removeOwnWork}
              />
            )}
            {currentStep === 4 && (
              <Step4FavoriteWorks
                formData={formData}
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
            )}
            {currentStep === 5 && (
              <Step5Values
                formData={formData}
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
            )}
            {currentStep === 6 && (
              <Step6Confirmation
                formData={formData}
                valueSelections={props.valueSelections}
                valueTiers={props.valueTiers}
                addedQuestionIds={props.addedQuestionIds}
                removedQuestionIds={props.removedQuestionIds}
              />
            )}
          </div>
        </div>

        {/* Floating Footer Navigation */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-6 md:px-12 py-4 z-20">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-bold transition-all
                ${
                  currentStep === 1
                    ? "text-slate-300 dark:text-slate-700 cursor-not-allowed"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                }
              `}
            >
              <ArrowLeft className="w-5 h-5" />
              戻る
            </button>

            {currentStep < 6 ? (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(6, prev + 1))}
                className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
              >
                次へ進む
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold shadow-lg transition-all ${
                  formData.purposes.length === 0
                    ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                    : "bg-green-600 text-white hover:bg-green-700 shadow-green-200 hover:scale-105 active:scale-95"
                }`}
                disabled={formData.purposes.length === 0}
                onClick={() => alert("Profile Created!")}
              >
                プロフィール作成
                <CheckCircle2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      {showRatingHelp && (
        <RatingHelpModal onClose={() => setShowRatingHelp(false)} />
      )}
    </div>
  );
};
