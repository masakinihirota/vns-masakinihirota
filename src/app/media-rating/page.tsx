import * as MediaRating from '@/components/media-rating';

export const metadata = {
  title: '登録済み作品一覧 | メディア評価管理システム',
  description: 'アニメ、漫画などのメディア作品をTier形式や「好き」評価で管理できます。',
};

export default function MediaRatingPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <MediaRating.MediaRating />
    </div>
  );
}
