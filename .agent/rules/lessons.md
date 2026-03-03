# AIの自己改善録 (Lessons)

## ターミナル出力とログ保存のルール
- **ログの標準出力**: `pnpm build` やその他のコマンドを実行する際、`> build-output.log 2>&1` のようにファイルへ出力をリダイレクトして隠蔽しないこと。
- **理由**: ビルドの進捗やエラー内容がターミナル上に表示されなくなり、ユーザー側で状況が全く見えなくなってパニックになるため。また、ゴミファイルが残ってしまうのを防ぐため。
- **解決策**: 単純に `pnpm build` または `npm run build` などを実行し、AIエージェントの `command_status` ツールを使ってその標準出力を直接読み取って解析すること。
- **Windows特有のcmd /c の禁止**: PowerShell環境で `cmd /c` を使ってコマンドを実行しないこと。ポータビリティが下がり、PATHの問題なども引き起こしやすいため、そのまま `pnpm build` などを実行する。

## React 状態管理: 永続的コンポーネントの状態リセット

### 問題の概要 (2026-03-03)
**症状**: ヘッダーのログアウトボタンで「ログイン → ログアウト → ログイン → ログアウト中...」となり、2回目のログイン後にボタンの状態が「ログアウト中...」のまま固定される。

**根本原因**:
- ヘッダーコンポーネント（`AuthButton`）は、ルート変更後もアンマウントされない「永続的コンポーネント」
- ログアウト時に `isLoggingOut = true` にセットされる
- ログアウト成功後、ページ遷移が発生するが、ヘッダーはアンマウントされないため `isLoggingOut` がリセットされない
- 再度ログインすると、`isLoggingOut = true` のまま「ログアウト中...」と表示される

**対比**:
- **ページ内のボタン**: ページ遷移時にコンポーネントがアンマウント → 状態が自動的にクリア
- **ヘッダーのボタン**: ページ遷移してもアンマウントされない → 状態が保持される

### 解決策
永続的コンポーネントでは、**依存する外部状態（認証状態など）が変化したときに、内部状態を明示的にリセットする**:

```typescript
// ❌ Bad: 状態が残り続ける
const [isLoggingOut, setIsLoggingOut] = useState(false);

// ✅ Good: 認証状態が変わったらリセット
const [isLoggingOut, setIsLoggingOut] = useState(false);

useEffect(() => {
  if (isAuthenticated) {
    setIsLoggingOut(false);  // ログイン成功時にリセット
  }
}, [isAuthenticated]);
```

### チェックポイント
- [ ] ヘッダー、サイドバー、フッターなど**永続的コンポーネント**で `useState` を使う場合、必ず依存状態の変化で内部状態をリセットする `useEffect` を追加
- [ ] ログイン/ログアウト機能を実装したら、必ず「**ログイン → ログアウト → ログイン**」の連続操作をテストケースに追加
- [ ] ローディング状態（`isLoading`, `isPending` など）は、成功/失敗時に必ずリセットされることを確認

### テストケース例
```typescript
it('ログイン→ログアウト→ログインを繰り返しても状態が正常', async () => {
  // 1. 初期状態: 未認証
  const { rerender } = render(<AuthButton />);

  // 2. ログイン
  vi.mocked(useAppAuth).mockReturnValue({ isAuthenticated: true, ... });
  rerender(<AuthButton />);
  expect(screen.getByText('ログアウト')).toBeInTheDocument();

  // 3. ログアウト
  fireEvent.click(screen.getByRole('button', { name: 'ログアウト' }));
  await waitFor(() => expect(signOut).toHaveBeenCalled());

  // 4. 再ログイン（ここで状態がリセットされるべき）
  vi.mocked(useAppAuth).mockReturnValue({ isAuthenticated: true, ... });
  rerender(<AuthButton />);

  // 5. 「ログアウト中...」ではなく「ログアウト」が表示される
  expect(screen.getByText('ログアウト')).toBeInTheDocument();
  expect(screen.queryByText('ログアウト中...')).not.toBeInTheDocument();
});
```

### 参考資料
- 修正コミット: `src/components/layout/header/auth-button.tsx` (2026-03-03)
- 関連ファイル: `src/hooks/use-app-auth.ts`
