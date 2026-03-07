import * as Sanctuary from '@/components/sanctuary';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sanctuary | Trust Dashboard',
  description: 'Community stability system and trust rank dashboard.',
};

/**
 * サンクチュアリ（信頼システム） ページ
 */
export default function SanctuaryPage() {
  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white">
      <div className="bg-linear-to-b from-indigo-900/20 via-transparent to-transparent pt-16">
        <Sanctuary.SanctuaryDashboard />
      </div>
    </div>
  );
}
