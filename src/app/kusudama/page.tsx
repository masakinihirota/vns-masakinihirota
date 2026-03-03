import * as KusudamaModule from '@/components/kusudama';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'お祝いくす玉 | Celebration Kusudama',
  description: '成功を祝うインタラクティブなくす玉の演出ページです。',
};

/**
 * お祝いくす玉ページ
 */
export default function KusudamaPage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950">
      <KusudamaModule.KusudamaContainer />
    </main>
  );
}
