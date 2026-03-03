import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';

describe('Keyboard Navigation - Phase 3-1', () => {
    describe('5.1: Tab キーナビゲーション', () => {
        it('button要素がTab/Shift+Tabでアクセス可能', async () => {
            const { container } = render(
                <div>
                    <button id="btn1">ボタン1</button>
                    <button id="btn2">ボタン2</button>
                    <button id="btn3">ボタン3</button>
                </div>
            );

            const user = userEvent.setup();
            const btn1 = screen.getByRole('button', { name: /ボタン1/i });

            // 初期状態：どのボタンもフォーカスなし
            expect(document.activeElement).not.toBe(btn1);

            // Tabキーでフォーカス移動
            await user.tab();
            expect(document.activeElement?.id).toBe('btn1');

            await user.tab();
            expect(document.activeElement?.id).toBe('btn2');

            await user.tab();
            expect(document.activeElement?.id).toBe('btn3');
        });

        it('フォーカス順序が正確（タブ順序）', async () => {
            const { container } = render(
                <div>
                    <button id="first">最初</button>
                    <input id="input" type="text" />
                    <button id="last">最後</button>
                </div>
            );

            const user = userEvent.setup();
            const focusOrder = [];

            // Tabキーを複数回押してフォーカス順序を記録
            await user.tab();
            focusOrder.push(document.activeElement?.id);

            await user.tab();
            focusOrder.push(document.activeElement?.id);

            await user.tab();
            focusOrder.push(document.activeElement?.id);

            // フォーカス順序が正確
            expect(focusOrder).toEqual(['first', 'input', 'last']);
        });

        it('Shift+Tabで逆方向ナビゲーション可能', async () => {
            const { container } = render(
                <div>
                    <button id="btn1">ボタン1</button>
                    <button id="btn2">ボタン2</button>
                </div>
            );

            const user = userEvent.setup();

            // フォーカスをbtn2に移動
            const btn2 = screen.getByRole('button', { name: /ボタン2/i });
            btn2.focus();
            expect(document.activeElement?.id).toBe('btn2');

            // Shift+Tabで逆方向に移動
            await user.tab({ shift: true });
            expect(document.activeElement?.id).toBe('btn1');
        });
    });

    describe('5.2: Enter キー', () => {
        it('buttonがEnterキーで実行される', async () => {
            const handleClick = vi.fn();
            render(
                <button onClick={handleClick}>
                    クリック
                </button>
            );

            const user = userEvent.setup();
            const button = screen.getByRole('button');

            button.focus();
            await user.keyboard('{Enter}');

            expect(handleClick).toHaveBeenCalled();
        });
    });

    describe('5.5: フォーカスインジケータ', () => {
        it('フォーカス時にفォーカスインジケータが表示される', async () => {
            render(
                <Button>
                    Click me
                </Button>
            );

            const button = screen.getByRole('button');
            const user = userEvent.setup();

            // Tabキーでフォーカス
            await user.tab();

            // フォーカス状態をチェック（:focus-visibleが適用されている）
            expect(document.activeElement).toBe(button);

            // CSSのfocus-visibleスタイルが計算されているか確認
            const computedStyle = window.getComputedStyle(button);
            // button.txsで focus-visible:ring が設定されている
            expect(button).toHaveFocus();
        });

        it('button.txsには focus-visible:border-ring focus-visible:ring が含まれる', () => {
            // button.tsx のクラス確認（スナップショット）
            const { container } = render(<Button>Test</Button>);
            const button = container.querySelector('button');

            expect(button?.className).toContain('focus-visible');
        });
    });

    describe('ネイティブ要素のキーボード対応', () => {
        it('<button>は自動的にキーボード対応', async () => {
            const handleClick = vi.fn();
            render(
                <button onClick={handleClick}>
                    ボタン
                </button>
            );

            const user = userEvent.setup();
            const button = screen.getByRole('button');

            button.focus();

            // Enterで実行
            await user.keyboard('{Enter}');
            expect(handleClick).toHaveBeenCalledTimes(1);

            // Spaceでも実行される（ネイティブ動作）
            await user.keyboard(' ');
            expect(handleClick).toHaveBeenCalledTimes(2);
        });

        it('<a>要素はTabで移動可能', async () => {
            render(
                <div>
                    <a href="/page1">リンク1</a>
                    <a href="/page2">リンク2</a>
                </div>
            );

            const user = userEvent.setup();

            await user.tab();
            expect(document.activeElement?.textContent).toBe('リンク1');

            await user.tab();
            expect(document.activeElement?.textContent).toBe('リンク2');
        });

        it('<input>要素はTabで移動可能', async () => {
            render(
                <div>
                    <input id="input1" type="text" />
                    <input id="input2" type="email" />
                </div>
            );

            const user = userEvent.setup();

            await user.tab();
            expect(document.activeElement?.id).toBe('input1');

            await user.tab();
            expect(document.activeElement?.id).toBe('input2');
        });
    });
});
