import * as Mandala from '@/components/mandala-chart';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'マンダラチャート | 目標達成支援ツール',
  description: '大目標を8つの要素に分解し、さらに具体的な行動へと展開するマンダラチャート作成ツールです。',
};

/**
 * マンダラチャートページ
 */
export default function MandalaChartPage() {
  return <Mandala.MandalaChart />;
}
