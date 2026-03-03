import { expect } from 'vitest';
import { axe as axeCore } from 'axe-core';

// vitest では axe-core の axe を直接使うのではなく、カスタムラッパーを作成
const axe = async (element: HTMLElement | Document) => {
  return axeCore(element);
};

// グローバル axe 関数をテストで利用可能にする
declare global {
  function axe(element: HTMLElement | Document): Promise<any>;
  namespace Vi {
    interface Matchers<R> {
      toHaveNoViolations(): R;
    }
  }
}

// カスタムマッチャーを定義
expect.extend({
  toHaveNoViolations(results: any) {
    const violations = results.violations || [];
    const pass = violations.length === 0;

    return {
      pass,
      message: () =>
        pass
          ? `expected to have violations`
          : `expected no violations but found ${violations.length}:\n${violations
              .map((v: any) => `- ${v.id}: ${v.description}`)
              .join('\n')}`,
    };
  },
});

// globalThis に axe を割り当てる（モジュールスコープじゃなくて グローバル
(globalThis as any).axe = axe;
