/**
 * ユーザーイベント関連のテストヘルパー
 *
 * このモジュールは、ユーザーイベント（クリック、入力など）をシミュレートするための
 * ヘルパー関数を提供します。
 */

import { act } from "@testing-library/react";

/**
 * 非同期コンポーネント用のヘルパー
 * コンポーネントの状態更新を待機します
 */
export const waitForLoadingToFinish = () =>
  new Promise((resolve) => setTimeout(resolve, 0));

/**
 * フォーム送信のヘルパー
 *
 * @param form 送信するフォーム要素
 */
export const submitForm = async (form: HTMLFormElement) => {
  const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
  form.dispatchEvent(submitEvent);
  await waitForLoadingToFinish();
};

/**
 * ユーザーイベントをシミュレートするヘルパー関数群
 */
export const userEvent = {
  /**
   * 要素のクリックをシミュレート
   *
   * @param element クリックする要素
   */
  click: async (element: Element) => {
    await act(async () => {
      const clickEvent = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(clickEvent);
    });
    await waitForLoadingToFinish();
  },

  /**
   * 入力フィールドへのテキスト入力をシミュレート
   *
   * @param element 入力要素（input または textarea）
   * @param text 入力するテキスト
   */
  type: async (element: Element, text: string) => {
    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement
    ) {
      await act(async () => {
        element.focus();
        element.value = text;
        const inputEvent = new Event("input", { bubbles: true });
        const changeEvent = new Event("change", { bubbles: true });
        element.dispatchEvent(inputEvent);
        element.dispatchEvent(changeEvent);
      });
      await waitForLoadingToFinish();
    }
  },

  /**
   * 入力フィールドのクリアをシミュレート
   *
   * @param element クリアする入力要素（input または textarea）
   */
  clear: async (element: Element) => {
    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLTextAreaElement
    ) {
      await act(async () => {
        element.focus();
        element.value = "";
        const inputEvent = new Event("input", { bubbles: true });
        const changeEvent = new Event("change", { bubbles: true });
        element.dispatchEvent(inputEvent);
        element.dispatchEvent(changeEvent);
      });
      await waitForLoadingToFinish();
    }
  },

  /**
   * キーボードイベントをシミュレート
   *
   * @param element 対象要素
   * @param key キーコード（例: "Enter", "Escape"）
   */
  keyPress: async (element: Element, key: string) => {
    await act(async () => {
      const keyboardEvent = new KeyboardEvent("keydown", {
        key,
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(keyboardEvent);
    });
    await waitForLoadingToFinish();
  },

  /**
   * フォーカスイベントをシミュレート
   *
   * @param element フォーカスする要素
   */
  focus: async (element: Element) => {
    await act(async () => {
      element.focus();
      const focusEvent = new FocusEvent("focus", {
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(focusEvent);
    });
    await waitForLoadingToFinish();
  },

  /**
   * ブラーイベントをシミュレート
   *
   * @param element ブラーする要素
   */
  blur: async (element: Element) => {
    await act(async () => {
      element.blur();
      const blurEvent = new FocusEvent("blur", {
        bubbles: true,
        cancelable: true,
      });
      element.dispatchEvent(blurEvent);
    });
    await waitForLoadingToFinish();
  },
};
