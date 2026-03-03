import { CheckCircle2, ChevronDown, ChevronUp, Heart, Layers, Settings, User, Users } from 'lucide-react';
import { PROFILES, RATINGS } from '../media-rating.constants';
import { Profile, RatingKey, RatingMode, Work } from '../media-rating.types';

interface ProfilePanelProps {
  readonly activeProfile: Profile;
  readonly onProfileChange: (profile: Profile) => void;
  readonly isProfileOpen: boolean;
  readonly onProfileToggle: () => void;
  readonly ratingMode: RatingMode;
  readonly onRatingModeToggle: (mode: RatingMode) => void;
  readonly selectedWork: Work | null;
  readonly onRatingChange: (rating: RatingKey) => void;
}

export function ProfilePanel({
  activeProfile,
  onProfileChange,
  isProfileOpen,
  onProfileToggle,
  ratingMode,
  onRatingModeToggle,
  selectedWork,
  onRatingChange,
}: ProfilePanelProps) {
  return (
    <aside className="w-[400px] bg-white border-r shadow-lg flex flex-col z-30 shrink-0">
      {/* プロフィール選択アコーディオン */}
      <div className="border-b bg-slate-50 relative">
        <button
          onClick={onProfileToggle}
          className="w-full p-8 flex items-center justify-between hover:bg-slate-100 transition-colors group"
          aria-expanded={isProfileOpen}
        >
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 ${activeProfile.color} rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105`}>
              <User size={32} />
            </div>
            <div className="text-left">
              <span className="text-[0.75rem] font-bold text-blue-500 uppercase tracking-widest block mb-1">Active Profile</span>
              <h2 className="font-bold text-2xl text-slate-800 truncate max-w-[200px]">{activeProfile.name}</h2>
            </div>
          </div>
          {isProfileOpen ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400 group-hover:text-blue-500" />}
        </button>

        {isProfileOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="p-3 border-t border-slate-200 bg-slate-50">
              <p className="px-4 py-3 text-[0.85rem] font-bold text-slate-400 uppercase flex items-center gap-2">
                <Users size={16} /> Switch User Profile
              </p>
              <div className="space-y-1">
                {PROFILES.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => onProfileChange(profile)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all text-[1rem] ${activeProfile.id === profile.id
                        ? 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-100 font-bold'
                        : 'hover:bg-slate-100 text-slate-600'
                      }`}
                  >
                    <div className={`w-10 h-10 ${profile.color} rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                    <span>{profile.name}</span>
                    {activeProfile.id === profile.id && <CheckCircle2 size={20} className="ml-auto" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200 shadow-inner">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold flex items-center gap-3 text-slate-700 text-[1.1rem]">
              <Settings size={22} className="text-slate-400" /> 評価設定
            </h3>
            <div className="flex bg-slate-200 p-1.5 rounded-xl">
              <button
                onClick={() => onRatingModeToggle('tier')}
                className={`p-2 rounded-lg transition-all ${ratingMode === 'tier' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
                title="Tier方式"
                aria-label="Tier方式に切り替え"
              >
                <Layers size={20} />
              </button>
              <button
                onClick={() => onRatingModeToggle('like')}
                className={`p-2 rounded-lg transition-all ${ratingMode === 'like' ? 'bg-white shadow-md text-pink-500' : 'text-slate-400 hover:text-slate-600'}`}
                title="好き方式"
                aria-label="好き方式に切り替え"
              >
                <Heart size={20} />
              </button>
            </div>
          </div>

          {selectedWork ? (
            <div className="space-y-6">
              <div className="p-5 bg-white rounded-xl border-2 shadow-sm border-blue-100">
                <span className="text-[0.75rem] text-blue-500 font-bold uppercase tracking-wider block mb-2">Editing Work</span>
                <p className="font-bold text-slate-800 leading-tight text-[1.2rem]">{selectedWork.title}</p>
                <div className="mt-3 text-[1rem] flex items-center gap-2">
                  <span className="text-slate-400">Current:</span>
                  <span className={`font-bold ${RATINGS[selectedWork.userRating]?.color}`}>
                    {RATINGS[selectedWork.userRating]?.label}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {ratingMode === 'tier' ? (
                  <div className="grid grid-cols-3 gap-3">
                    {(['TIER1', 'TIER2', 'TIER3'] as const).map(r => (
                      <button
                        key={r}
                        onClick={() => onRatingChange(r)}
                        className={`py-4 rounded-xl font-bold border-2 transition-all text-[1rem] ${selectedWork.userRating === r
                            ? 'bg-blue-600 text-white border-blue-700 shadow-lg transform scale-[1.05]'
                            : 'bg-white hover:bg-blue-50 text-slate-700 border-slate-200 active:bg-blue-100'
                          }`}
                      >
                        {RATINGS[r].label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <button
                    onClick={() => onRatingChange('LIKE1')}
                    className={`w-full py-5 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-3 text-[1.1rem] ${selectedWork.userRating === 'LIKE1'
                        ? 'bg-pink-500 text-white border-pink-600 shadow-lg transform scale-[1.02]'
                        : 'bg-white hover:bg-pink-50 text-pink-500 border-slate-200 active:bg-pink-100'
                      }`}
                  >
                    <Heart size={24} fill={selectedWork.userRating === 'LIKE1' ? 'white' : 'none'} />
                    好き (1)
                  </button>
                )}
              </div>

              <div className="space-y-3 pt-6 border-t border-slate-200">
                <p className="text-[0.75rem] font-bold text-slate-400 uppercase tracking-widest mb-2">Basic Status</p>
                {(['NORMAL_OR_NOT', 'UNRATED', 'NO_INTEREST'] as const).map(r => (
                  <button
                    key={r}
                    onClick={() => onRatingChange(r)}
                    className={`w-full py-4 text-left px-5 rounded-xl border-2 flex items-center justify-between transition-all text-[1rem] ${selectedWork.userRating === r
                        ? 'bg-slate-800 text-white border-slate-900 shadow-md'
                        : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200 active:bg-slate-100'
                      }`}
                  >
                    <span className="font-bold">{RATINGS[r].label}</span>
                    {selectedWork.userRating === r && <CheckCircle2 size={22} />}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 px-6 border-4 border-dashed border-slate-200 rounded-2xl">
              <p className="text-slate-400 leading-relaxed italic text-[1rem]">
                作品を選択して評価を<br />入力してください
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 bg-slate-900 border-t border-slate-800 text-slate-500 text-[0.8rem] text-center font-mono uppercase tracking-[0.2em]">
        VNS:{activeProfile.id}:CORE
      </div>
    </aside>
  );
}
