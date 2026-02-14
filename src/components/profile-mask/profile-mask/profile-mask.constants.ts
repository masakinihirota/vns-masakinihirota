import {
  Anchor,
  Aperture,
  Award,
  Bookmark,
  Briefcase,
  Cloud,
  Contact,
  Cpu,
  FileText,
  Flag,
  Gamepad2,
  Heart,
  Home,
  Layers,
  MessageSquare,
  Mic2,
  Moon,
  Share2,
  Shield,
  ShieldAlert,
  Smile,
  Sparkles,
  Star,
  Sun,
  Target,
  User,
  Zap,
  Zap as ZapIcon,
} from 'lucide-react';
import { Cassette, ObjectivePreset, ProfileType, Slot, ValueCategory } from './profile-mask.types';

export const MASK_ICONS = [
  { id: 'mask_default', icon: User, label: '標準' },
  { id: 'mask_zap', icon: ZapIcon, label: '電撃' },
  { id: 'mask_shield', icon: Shield, label: '守護' },
  { id: 'mask_star', icon: Star, label: '希望' },
  { id: 'mask_target', icon: Target, label: '目的' },
  { id: 'mask_anchor', icon: Anchor, label: '不変' },
  { id: 'mask_cloud', icon: Cloud, label: '幻想' },
  { id: 'mask_sun', icon: Sun, label: '情熱' },
  { id: 'mask_aperture', icon: Aperture, label: '視点' },
  { id: 'mask_smile', icon: Smile, label: '社交' },
] as const;

export const COLORS = ["赤い", "青い", "黄色い", "緑の", "紫の", "橙色の", "ピンクの", "茶色の", "灰色の", "黒い", "白い"] as const;
export const MATERIALS = ["マテリアル", "光", "幻想", "氷", "炎", "輝き", "熱狂", "闇", "風", "水", "土", "雷", "音", "光速", "宇宙"] as const;
export const USER_BASE_CONSTELLATION = "魚座" as const;

export const PROFILE_TYPES: readonly ProfileType[] = [
  { id: 'self', label: '本人 (SELF)', icon: User, description: '「自分自身の仮面」を作成します。標準的なプロフィールです。あなた自身の作品や性格等を登録し、あなたの「顔」を作成します。' },
  { id: 'interview', label: 'インタビュー (INTERVIEW)', icon: Mic2, description: '相手と対話して得た回答を元に作成します。直接本人から聞いてない場合は「心象プロフィール」を選択してください。' },
  { id: 'imagined', label: '心象プロフィール (IMAGINED)', icon: EyeIcon, description: '外部の断片的な情報とあなたの想像力で、あなたから見たその人の人物像を構築します。' }, // 後でEyeアイコンを確認
  { id: 'ideal', label: '理想像 (IDEAL)', icon: Sparkles, description: 'あなた自身が求めている人物像や理想をプロフィール化して「理想の仮面」を作成します。' },
  { id: 'politician', label: '議員 / POLITICIAN', icon: Award, description: '特別なプロフィールタイプ。政治家、または候補者としての情報を登録します。', isSpecial: true },
  { id: 'ai_dummy', label: 'AIダミー生成 (AI DUMMY)', icon: Cpu, description: 'テスト用にAIが架架空の設定を自動生成します。デザイン確認や動作テストのために使用します。', isSpecial: true },
] as const;

// 欠落していたEyeアイコンのインポートを補完するために修正が必要かもしれないが、一旦lucide-reactからインポート可能か確認
import { Eye as EyeIcon } from 'lucide-react';

export const ALL_SLOTS: readonly Slot[] = [
  { id: 'works', label: '自分の作品', icon: Layers },
  { id: 'favorites', label: '好きな作品', icon: Gamepad2 },
  { id: 'values', label: '自分の価値観', icon: MessageSquare },
  { id: 'skills', label: 'スキル', icon: Zap },
  { id: 'politics', label: '政治情報', icon: Flag },
  { id: 'partner_meta', label: 'パートナー情報', icon: Heart },
  { id: 'social', label: '連絡先', icon: Share2 },
] as const;

export const OBJECTIVE_PRESETS: readonly ObjectivePreset[] = [
  { id: 'business_card', label: '名刺', slots: ['works', 'skills'], icon: Contact },
  { id: 'resume', label: '履歴書', slots: ['works', 'favorites', 'values', 'skills'], icon: FileText },
  { id: 'build_work', label: '創る・働く', slots: ['works', 'favorites', 'values', 'skills'], icon: Briefcase },
  { id: 'play', label: '遊ぶ', slots: ['favorites', 'values', 'skills'], icon: Gamepad2 },
  { id: 'partner', label: 'パートナー活', slots: ['favorites', 'values', 'skills', 'partner_meta'], icon: Heart },
  { id: 'consult', label: '相談', slots: ['favorites', 'values', 'skills'], icon: MessageSquare },
  { id: 'politics', label: '政治', slots: ['values', 'politics'], icon: Flag },
  { id: 'other', label: 'その他', slots: ['favorites', 'values', 'skills'], icon: SettingsIcon }, // Settingsアイコンを確認
] as const;

import { Settings as SettingsIcon } from 'lucide-react';

export const VALUE_CATEGORIES: readonly ValueCategory[] = [
  { id: 'val_core', name: '基礎の基礎', total: 10, answered: 10, isRoot: true, icon: Bookmark },
  { id: 'val_basic', name: '基本', total: 30, answered: 12, icon: User },
  { id: 'val_work', name: '創る・働く', total: 40, answered: 25, icon: Briefcase },
  { id: 'val_play', name: '遊ぶ', total: 30, answered: 8, icon: Gamepad2 },
  { id: 'val_partner', name: 'パートナー探し', total: 35, answered: 5, icon: Heart },
  { id: 'val_life', name: '生活', total: 25, answered: 15, icon: Home },
  { id: 'val_ethic', name: '社会・倫理', total: 30, answered: 10, icon: ShieldAlert },
  { id: 'val_end', name: '終活', total: 20, answered: 2, icon: Moon },
  { id: 'val_politics', name: '政治', total: 25, answered: 18, icon: Flag },
] as const;

export const INITIAL_WORKS_CASSETTES: readonly Cassette[] = [
  { id: 'ws1', name: '一般公開用カセット', items: ['Next.js App', 'React Library'] },
  { id: 'ws2', name: 'R18作品カセット', items: ['秘密のイラスト集', '限定コンテンツ'] },
] as const;

export const INITIAL_SKILL_CASSETTES: readonly Cassette[] = [
  { id: 'ss1', name: 'エンジニア構成カセット', items: ['React', 'TypeScript', 'Tailwind'] },
  { id: 'ss2', name: 'デザイナー構成カセット', items: ['Figma', 'Photoshop', 'UI/UX'] },
] as const;
