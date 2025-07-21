import { Page, expect } from "@playwright/test";

/**
 * E2Eテスト用ヘルパー関数
 *
 * テスト間で共通して使用される機能を提供します。
 */

/**
 * ページの基本的な要素が読み込まれているかチェック
 */
export async function waitForPageReady(page: Page): Promise<void> {
  // DOM の読み込み完了を待機
  await page.waitForLoadState("domcontentloaded");

  // ネットワークアクティビティの完了を待機
  await page.waitForLoadState("networkidle");

  // 基本的なHTML要素の存在確認
  await expect(page.locator("html")).toBeVisible();
  await expect(page.locator("body")).toBeVisible();
}

/**
 * コンソールエラーをキャプチャ
 */
export function captureConsoleErrors(page: Page): string[] {
  const errors: string[] = [];

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  });

  page.on("pageerror", (error) => {
    errors.push(error.message);
  });

  return errors;
}

/**
 * ネットワークリクエストをモニタリング
 */
export function monitorNetworkRequests(page: Page) {
  const requests: { url: string; method: string; status?: number }[] = [];

  page.on("request", (request) => {
    requests.push({
      url: request.url(),
      method: request.method(),
    });
  });

  page.on("response", (response) => {
    const request = requests.find((req) => req.url === response.url());
    if (request) {
      request.status = response.status();
    }
  });

  return requests;
}

/**
 * 認証状態をクリア
 */
export async function clearAuthState(page: Page): Promise<void> {
  await page.evaluate(() => {
    // ローカルストレージをクリア
    localStorage.clear();

    // セッションストレージをクリア
    sessionStorage.clear();
  });

  // クッキーをクリア
  await page.context().clearCookies();
}

/**
 * テスト用の認証状態を設定
 */
export async function setTestAuthState(page: Page): Promise<void> {
  await page.evaluate(() => {
    const mockAuthData = {
      access_token: "test-access-token",
      refresh_token: "test-refresh-token",
      user: {
        id: "test-user-id",
        email: "test@example.com",
        user_metadata: {
          name: "Test User",
        },
      },
    };

    localStorage.setItem(
      "sb-127.0.0.1:54321-auth-token",
      JSON.stringify(mockAuthData),
    );
  });

  // ページをリロードして認証状態を反映
  await page.reload();
  await page.waitForLoadState("networkidle");
}

/**
 * 特定のユーザーロールの認証状態を設定
 */
export async function setRoleAuthState(
  page: Page,
  role: string,
): Promise<void> {
  await page.evaluate((userRole) => {
    const mockAuthData = {
      access_token: `test-access-token-${userRole}`,
      refresh_token: `test-refresh-token-${userRole}`,
      user: {
        id: `test-user-id-${userRole}`,
        email: `test-${userRole}@example.com`,
        user_metadata: {
          name: `Test ${userRole} User`,
          role: userRole,
        },
      },
    };

    localStorage.setItem(
      "sb-127.0.0.1:54321-auth-token",
      JSON.stringify(mockAuthData),
    );
  }, role);

  // ページをリロードして認証状態を反映
  await page.reload();
  await page.waitForLoadState("networkidle");
}

/**
 * 認証状態を確認
 */
export async function checkAuthState(page: Page): Promise<boolean> {
  return await page.evaluate(() => {
    const authToken = localStorage.getItem("sb-127.0.0.1:54321-auth-token");
    return !!authToken;
  });
}

/**
 * 要素が完全に表示されるまで待機
 */
export async function waitForElementToBeFullyVisible(
  page: Page,
  selector: string,
  timeout = 5000,
): Promise<void> {
  const element = page.locator(selector);

  // 要素が存在することを確認
  await element.waitFor({ state: "attached", timeout });

  // 要素が表示されることを確認
  await element.waitFor({ state: "visible", timeout });

  // 要素が完全にビューポート内に表示されることを確認
  await element.scrollIntoViewIfNeeded();
}

/**
 * フォームの入力値をクリア
 */
export async function clearFormInputs(page: Page): Promise<void> {
  const inputs = page.locator(
    'input[type="text"], input[type="email"], input[type="password"], textarea',
  );
  const count = await inputs.count();

  for (let i = 0; i < count; i++) {
    await inputs.nth(i).clear();
  }
}

/**
 * ページのパフォーマンスメトリクスを取得
 */
export async function getPerformanceMetrics(page: Page) {
  return await page.evaluate(() => {
    const navigation = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming;

    return {
      domContentLoaded:
        navigation.domContentLoadedEventEnd -
        navigation.domContentLoadedEventStart,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      firstPaint:
        performance.getEntriesByName("first-paint")[0]?.startTime || 0,
      firstContentfulPaint:
        performance.getEntriesByName("first-contentful-paint")[0]?.startTime ||
        0,
    };
  });
}

/**
 * アクセシビリティ属性をチェック
 */
export async function checkAccessibilityAttributes(
  page: Page,
  selector: string,
) {
  const element = page.locator(selector);

  const attributes = await element.evaluate((el) => {
    return {
      hasAriaLabel: el.hasAttribute("aria-label"),
      hasAriaLabelledBy: el.hasAttribute("aria-labelledby"),
      hasAriaDescribedBy: el.hasAttribute("aria-describedby"),
      hasRole: el.hasAttribute("role"),
      hasTabIndex: el.hasAttribute("tabindex"),
      isKeyboardFocusable: el.tabIndex >= 0,
    };
  });

  return attributes;
}

/**
 * カスタムイベントを発火
 */
export async function triggerCustomEvent(
  page: Page,
  selector: string,
  eventName: string,
  eventData?: any,
): Promise<void> {
  await page.locator(selector).evaluate(
    (element, { eventName, eventData }) => {
      const event = new CustomEvent(eventName, { detail: eventData });
      element.dispatchEvent(event);
    },
    { eventName, eventData },
  );
}

/**
 * ローディング状態の完了を待機
 */
export async function waitForLoadingToComplete(page: Page): Promise<void> {
  // ローディングスピナーが消えるまで待機
  const loadingSpinner = page.locator(
    '[data-testid="loading"], .loading, .spinner',
  );

  try {
    await loadingSpinner.waitFor({ state: "hidden", timeout: 10000 });
  } catch {
    // ローディングスピナーが存在しない場合は無視
  }

  // ネットワークアクティビティの完了を待機
  await page.waitForLoadState("networkidle");
}
