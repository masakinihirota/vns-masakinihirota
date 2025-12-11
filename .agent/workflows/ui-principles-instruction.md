---
trigger: model_decision
---

# ヒューマンインターフェースデザイン（HID）指針 UI実装指示書

**要約**: Next.js/Shadcn/UIでHID 24指針を3層優先度（必須5項目/推奨10項目/任意9項目）で段階的に適用

## 実行フレームワーク（KERNEL準拠）

### 新規画面実装時

```
Input:
  - 画面要件定義（Figmaデザイン、ユーザーストーリー）
  - 対象ユーザーセグメント（新規/既存/管理者）
  - 対象デバイス（デスクトップ優先）

Task: HID 24指針に基づくUI実装

Constraints:
  - Tier 1必須5項目を100%遵守（シンプル、一貫性、コンストレイント、認知負荷、フィッツの法則）
  - Tier 2推奨10項目を主要機能で適用
  - DADS準拠（ui-dadsi-instruction.md: aria-disabled、ring-yellow-400、Tailwind標準クラス）
  - モックデータはSupabaseスキーマ互換形式（src/lib/mock-data/）
  - レスポンス時間0.4秒以内（Lighthouseスコア90+）

Output:
  - TSXコンポーネント（型安全、テスト可能）
  - Storybookストーリー
  - HID Tier 1チェックリスト（通過証明）
```

### 既存画面改善時

```
Input: 改善対象画面、現在の問題点（アクセシビリティ、パフォーマンス）
Task: Tier 1違反の解消 → Tier 2の段階的適用
Constraints: リグレッション防止（既存テスト100%維持）
Output: Before/After比較レポート、Lighthouseスコア改善証明
```

---

## 優先度階層（3層構造）

### 🔴 Tier 1: 必須（Critical - 全画面で遵守）

**対象**: 新規実装、既存改修、全コードレビュー

| #          | 指針                 | 検証方法                                                         | 理由             | 違反例                          |
| ---------- | -------------------- | ---------------------------------------------------------------- | ---------------- | ------------------------------- |
| **HID-1**  | **シンプルにする**   | 画面要素数≤9個                                                   | 認知負荷軽減     | 1画面に10個以上のボタン         |
| **HID-6**  | **一貫性**           | プライマリ=`variant="default"`<br>破壊的=`variant="destructive"` | 学習コスト削減   | 削除ボタンが`variant="default"` |
| **HID-11** | **コンストレイント** | 全フォームにバリデーション                                       | エラー防止       | `required`なし                  |
| **HID-16** | **フィッツの法則**   | プライマリボタン最小44×44px                                      | タップ成功率向上 | 小さすぎるボタン                |
| **HID-13** | **記憶に頼らない**   | ヘルプテキスト必須                                               | 完了率向上       | 説明なしのフォーム              |

**自動検証コマンド**:

```bash
# Tier 1チェックスクリプト
grep -rn 'variant="default"' src/app/ | wc -l  # 一貫性
grep -rn 'required' src/app/ | wc -l           # コンストレイント
npm run lighthouse -- --only-categories=accessibility,performance
```

---

### 🟡 Tier 2: 推奨（High - 主要機能で適用）

**対象**: コア機能、課金フロー、オンボーディング、ダッシュボード

| #      | 指針                   | 適用シーン                   | 実装例                       |
| ------ | ---------------------- | ---------------------------- | ---------------------------- |
| HID-2  | 簡単にする             | タスク完了≤3クリック         | ワンクリック作成ボタン       |
| HID-3  | メンタルモデル         | 馴染みのあるパターン         | タブ、ハンバーガーメニュー   |
| HID-4  | シグニファイア         | クリック可能要素を明確に     | `<Button>`コンポーネント必須 |
| HID-5  | マッピング             | 編集ボタンは対象の近く       | カード内にアクションボタン   |
| HID-7  | ユーザー主導権         | 自動リダイレクト回避         | モーダルのEscキー対応        |
| HID-10 | 視覚ゲシュタルト       | グループ化（gap-2 vs gap-6） | Cardでセクション分離         |
| HID-12 | ユーザーの言葉         | 技術用語回避                 | "Submit"→"送信する"          |
| HID-14 | プリコンピュテーション | スマートデフォルト           | `defaultValue="public"`      |
| HID-17 | ヒックの法則           | 選択肢5〜7個                 | サブメニュー化               |
| HID-20 | メジャータスク最適化   | 主要機能を前面に             | ダッシュボード配置           |

---

### 🟢 Tier 3: 任意（Medium - 余裕があれば）

**対象**: 詳細設定画面、管理者機能、エンゲージメント向上施策

（残り9項目: HID-8直接操作、HID-9モードレス、HID-15エラー回避、HID-18複雑性保存、HID-19タスクコヒーレンス、HID-21パースエージョン、HID-22ショートカット、HID-23オブジェクトベース、HID-24ビュー表象）

---

## 適用優先順位（UI指示書の併用ルール）

- 最優先: `ui-dadsi-instruction.md`（DADS実装指示）のデザイントークン、アクセシビリティ実装（`aria-disabled`、フォーカスリング、コントラスト、タイポグラフィ）。
- 本書: 行動原則・UXルール（HID 24指針）。スタイルはDADSに従いつつ、本書の原則で画面構造やインタラクションを設計してください。
- 参考: `ui-shadcn-instruction.md` はプロンプト補助であり実装規約ではありません。DADS/HIDと矛盾する場合はDADS→本書の順で優先します。

DADSのスタイル要件を満たした上で、本書の指針で情報設計・操作性を整理し、Shadcn由来のサンプルを使う場合もDADSのトークン/アクセシビリティに上書きしてください。

## 概要

- **フレームワーク**: Next.js 16 (App Router)
- **UIライブラリ**: Shadcn/UI (new-york スタイル)
- **スタイリング**: Tailwind CSS v4
- **データ**: モックデータ（Supabase接続前提のスキーマ互換形式）

---

## 🎯 シーン別クイックガイド（実装パターン集）

### 🆕 新規ユーザーオンボーディング

**適用原則**: HID-1シンプル、HID-13記憶に頼らない、HID-14プリコンピュテーション

**実装例**:

```tsx
// ✅ Tier 1準拠: 1画面1質問、ヘルプテキスト、スマートデフォルト
export default function OnboardingStep1() {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>プロフィール設定 (1/3)</CardTitle>
        <CardDescription>あなたの表示名を教えてください</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="displayName">
            表示名<span className="text-red-600">*</span>
          </Label>
          <Input id="displayName" required placeholder="例: 田中太郎" maxLength={50} />
          <p className="text-sm text-muted-foreground">
            他のユーザーに表示される名前です。後から変更できます。
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" disabled aria-disabled="true">
          戻る
        </Button>
        <Button type="submit">次へ</Button>
      </CardFooter>
    </Card>
  );
}
```

**チェックリスト**:

- [x] HID-1: 画面要素数≤9個（タイトル、説明、ラベル、入力、ヘルプ、ボタン×2 = 7個）
- [x] HID-6: 一貫性（次へ=`variant="default"`、戻る=`variant="outline"`）
- [x] HID-11: コンストレイント（`required`、`maxLength`）
- [x] HID-13: 記憶に頼らない（ヘルプテキスト、placeholder）

---

### 💰 課金フロー（料金プラン選択）

**適用原則**: HID-1シンプル、HID-6一貫性、HID-14プリコンピュテーション

**実装例**:

```tsx
// ✅ Tier 1準拠: 3プラン表示、推奨プランをデフォルト選択
export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "standard" | "premium">("standard");

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <PricingCard
        plan="premium"
        price="¥2,980/月"
        features={["全機能", "優先サポート", "API無制限"]}
        badge="人気"
        isSelected={selectedPlan === "premium"}
        onClick={() => setSelectedPlan("premium")}
      />
      <PricingCard
        plan="standard"
        price="¥1,480/月"
        features={["基本機能", "標準サポート", "API 10,000回/月"]}
        badge="推奨"
        isSelected={selectedPlan === "standard"}
        onClick={() => setSelectedPlan("standard")}
      />
      <PricingCard
        plan="basic"
        price="¥480/月"
        features={["限定機能", "コミュニティサポート", "API 1,000回/月"]}
        isSelected={selectedPlan === "basic"}
        onClick={() => setSelectedPlan("basic")}
      />
    </div>
  );
}
```

**チェックリスト**:

- [x] HID-1: シンプル（3プランのみ）
- [x] HID-6: 一貫性（全カード同じレイアウト）
- [x] HID-14: プリコンピュテーション（standardをデフォルト選択）
- [x] HID-16: フィッツの法則（カード全体がクリック可能）

---

### 📝 データ入力フォーム（コミュニティ作成）

**適用原則**: HID-1シンプル、HID-11コンストレイント、HID-13記憶に頼らない

**実装例**:

```tsx
// ✅ Tier 1準拠: 必須項目のみ、バリデーション、ヘルプテキスト
export default function CreateCommunityForm() {
  return (
    <form className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">
          コミュニティ名<span className="text-red-600">*</span>
        </Label>
        <Input id="name" required minLength={3} maxLength={50} placeholder="例: Next.js勉強会" />
        <p className="text-sm text-muted-foreground">3〜50文字で入力してください</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">説明（任意）</Label>
        <Textarea id="description" placeholder="コミュニティの目的や活動内容" maxLength={500} />
        <p className="text-sm text-muted-foreground">最大500文字</p>
      </div>

      <div className="space-y-2">
        <Label>公開設定</Label>
        <Select defaultValue="public">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">公開（推奨）</SelectItem>
            <SelectItem value="members">メンバーのみ</SelectItem>
            <SelectItem value="private">非公開</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">公開設定は後から変更できます</p>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">
          キャンセル
        </Button>
        <Button type="submit">作成</Button>
      </div>
    </form>
  );
}
```

**チェックリスト**:

- [x] HID-1: シンプル（必須項目は名前のみ）
- [x] HID-6: 一貫性（作成=`variant="default"`、キャンセル=`variant="outline"`）
- [x] HID-11: コンストレイント（`required`, `minLength`, `maxLength`）
- [x] HID-13: 記憶に頼らない（各フィールドにヘルプテキスト）
- [x] HID-14: プリコンピュテーション（公開設定のデフォルト）

---

### 🗑️ 破壊的アクション（削除確認）

**適用原則**: HID-6一貫性、HID-11コンストレイント

**実装例**:

```tsx
// ✅ Tier 1準拠: 破壊的アクションは必ず確認ダイアログ
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive" size="sm">
      <Trash2 className="mr-2 h-4 w-4" />
      削除
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>コミュニティを削除しますか?</AlertDialogTitle>
      <AlertDialogDescription>
        この操作は取り消せません。すべてのデータが完全に削除されます。
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>キャンセル</AlertDialogCancel>
      <AlertDialogAction
        onClick={handleDelete}
        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
      >
        削除する
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

**チェックリスト**:

- [x] HID-6: 一貫性（削除=`variant="destructive"`固定）
- [x] HID-11: コンストレイント（確認ダイアログ必須）
- [x] HID-12: ユーザーの言葉（"Delete"ではなく"削除"）

---

## 自動検証ツール

### Tier 1チェックスクリプト

```bash
#!/bin/bash
# scripts/hid-tier1-check.sh

echo "=== HID Tier 1 必須項目チェック ==="

# HID-6: 一貫性（ボタンvariant）
echo "\n[HID-6] ボタンスタイル一貫性チェック..."
grep -rn 'variant="default"' src/app/ | wc -l
if grep -rn 'className=".*bg-blue' src/app/; then
  echo "❌ カスタムボタン色検出（DADS違反）"
else
  echo "✅ Tailwind標準クラスのみ使用"
fi

# HID-11: コンストレイント（フォームバリデーション）
echo "\n[HID-11] フォームバリデーションチェック..."
INPUT_COUNT=$(grep -rn '<Input' src/app/ | wc -l)
REQUIRED_COUNT=$(grep -rn 'required' src/app/ | wc -l)
echo "Input要素: $INPUT_COUNT, required属性: $REQUIRED_COUNT"

# HID-16: フィッツの法則（ボタンサイズ）
echo "\n[HID-16] プライマリボタンサイズチェック..."
if grep -rn 'size="sm".*variant="default"' src/app/; then
  echo "⚠️  プライマリボタンに size=\"sm\" 使用"
fi

# Lighthouse実行
echo "\n[Performance] Lighthouseスコア..."
npm run lighthouse -- --only-categories=accessibility,performance

echo "\n=== Tier 1チェック完了 ==="
```

### Storybook統合

```typescript
// .storybook/hid-checker.ts
export function checkHIDTier1Compliance(story: any) {
  const violations: string[] = [];

  // HID-1: シンプルさ（要素数チェック）
  const elementCount = story.querySelectorAll("button, input, select").length;
  if (elementCount > 9) {
    violations.push(`HID-1違反: 画面要素数${elementCount}個（9個以下推奨）`);
  }

  // HID-6: 一貫性（破壊的アクションチェック）
  const deleteButtons = story.querySelectorAll('button:contains("削除")');
  deleteButtons.forEach((btn: HTMLButtonElement) => {
    if (!btn.className.includes("destructive")) {
      violations.push('HID-6違反: 削除ボタンが variant="destructive" ではない');
    }
  });

  return violations;
}
```

---

## 🎯 モックデータ運用ルール

### 1. モックデータの配置

```
src/
├── lib/
│   └── mock-data/
│       ├── index.ts          # エクスポート集約
│       ├── users.ts          # ユーザー関連モックデータ
│       ├── communities.ts    # コミュニティ関連モックデータ
│       ├── contents.ts       # コンテンツ関連モックデータ
│       └── types.ts          # 型定義（Supabase互換）
```

### 2. モックデータの形式（Supabase互換）

モックデータは将来のSupabase接続を前提として、以下の形式で定義してください。

```typescript
// src/lib/mock-data/types.ts
// Supabaseのテーブルスキーマと互換性のある型定義

/**
 * ユーザープロファイル型
 * @description Supabase profiles テーブルと互換
 */
export type MockUser = {
  id: string; // UUID形式
  created_at: string; // ISO 8601形式 (例: "2024-01-15T09:00:00Z")
  updated_at: string; // ISO 8601形式
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  // Supabaseのauth.usersとの外部キー想定
};

/**
 * コミュニティ型
 * @description Supabase communities テーブルと互換
 */
export type MockCommunity = {
  id: string; // UUID形式
  created_at: string;
  updated_at: string;
  name: string;
  description: string | null;
  owner_id: string; // MockUser.id への外部キー
  member_count: number;
  is_public: boolean;
};
```

```typescript
// src/lib/mock-data/users.ts
import type { MockUser } from "./types";

/**
 * ユーザーモックデータ
 * @description 静的UIプレビュー用。Supabaseスキーマ互換形式。
 */
export const mockUsers: MockUser[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    created_at: "2024-01-15T09:00:00Z",
    updated_at: "2024-06-20T14:30:00Z",
    display_name: "田中太郎",
    avatar_url: "/avatars/user-01.png",
    bio: "VNSコミュニティの創設メンバーです。",
  },
  // ... 他のユーザー
];

/**
 * 現在のログインユーザー（モック）
 */
export const mockCurrentUser: MockUser = mockUsers[0];
```

### 3. コンポーネントでのモックデータ使用

```tsx
// src/app/(10-community)/community/page.tsx
import { mockCommunities } from "@/lib/mock-data";
import { CommunityCard } from "./_components/community-card";

export default function CommunityPage() {
  // 将来: const { data: communities } = await supabase.from('communities').select('*')
  const communities = mockCommunities;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {communities.map((community) => (
        <CommunityCard key={community.id} community={community} />
      ))}
    </div>
  );
}
```

---

## 📐 HID 24指針の実装ガイド

### 【デザインの基本原則と構成】

#### 1. シンプルにする（Simple）

**指針**: 機能や情報を厳選し、インターフェースの要素をできるだけ少なくする。

**実装ルール**:

- 1画面に表示する情報は**最大7±2項目**に制限
- 装飾的な要素は最小限に抑える
- Shadcn/UIのコンポーネントを素のまま使用し、過度なカスタマイズを避ける

```tsx
// ✅ Good: シンプルなカード
<Card>
  <CardHeader>
    <CardTitle>コミュニティ名</CardTitle>
  </CardHeader>
  <CardContent>
    <p>説明文</p>
  </CardContent>
</Card>

// ❌ Bad: 過度に装飾されたカード
<Card className="border-4 border-gradient-to-r shadow-2xl animate-pulse">
  <div className="absolute top-0 right-0 badge badge-new">NEW</div>
  ...
</Card>
```

#### 2. 簡単にする（Easy）

**指針**: ユーザーが目的達成までに必要な手順と労力を最大限に減らす。

**実装ルール**:

- タスク完了までの**クリック数を3回以内**に
- フォームのフィールド数は**必要最小限**に
- デフォルト値を積極的に設定

```tsx
// ✅ Good: 必要最小限のフォーム
<form>
  <Input placeholder="コミュニティ名" required />
  <Textarea placeholder="説明（任意）" />
  <Button type="submit">作成</Button>
</form>
```

#### 3. メンタルモデル（Mental Model）

**指針**: ユーザーが想像する利用モデルに合った構成と動作を採用する。

**実装ルール**:

- 馴染みのあるUIパターンを使用（ハンバーガーメニュー、タブ、パンくずなど）
- SNSライクな操作感（いいね、フォローなど）を参考に

```tsx
// ✅ Good: 馴染みのあるパターン
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">概要</TabsTrigger>
    <TabsTrigger value="members">メンバー</TabsTrigger>
    <TabsTrigger value="settings">設定</TabsTrigger>
  </TabsList>
</Tabs>
```

#### 4. シグニファイア（Signifier）

**指針**: 操作対象となる要素を見えるようにし、その意味が一目でわかるようにする。

**実装ルール**:

- ボタンは`<Button>`コンポーネントを使用し、明確なスタイルを適用
- クリック可能な要素には`cursor-pointer`を付与
- アイコンには必ずラベルまたは`aria-label`を付ける

```tsx
// ✅ Good: 明確なシグニファイア
<Button variant="default">
  <Plus className="mr-2 h-4 w-4" />
  新規作成
</Button>

// ❌ Bad: 曖昧な表示
<div onClick={handleClick}>+</div>
```

#### 5. マッピング（Mapping）

**指針**: 操作する箇所と結果が反映される箇所との対応関係を把握できるようにする。

**実装ルール**:

- 編集ボタンは編集対象の近くに配置
- フォームエラーは該当フィールドの直下に表示
- トグルスイッチは即座に状態を反映

```tsx
// ✅ Good: 明確なマッピング
<div className="flex items-center justify-between">
  <Label htmlFor="notifications">通知を受け取る</Label>
  <Switch id="notifications" />
</div>
```

#### 6. 一貫性（Consistency）

**指針**: 配色、形状、配置、振る舞いなどに一貫したルールを適用する。

**実装ルール**:

- プライマリアクションは常に`variant="default"`
- 破壊的アクションは常に`variant="destructive"`
- キャンセルは常に`variant="outline"`または`variant="ghost"`

```tsx
// ✅ Good: 一貫したボタンスタイル
<DialogFooter>
  <Button variant="outline" onClick={onCancel}>キャンセル</Button>
  <Button variant="default" onClick={onSubmit}>保存</Button>
</DialogFooter>

// 削除確認ダイアログの場合
<DialogFooter>
  <Button variant="outline" onClick={onCancel}>キャンセル</Button>
  <Button variant="destructive" onClick={onDelete}>削除</Button>
</DialogFooter>
```

---

### 【インタラクションと制御】

#### 7. ユーザーの主導権（User Control）

**指針**: ユーザーがシステムをコントロールできるように設計する。

**実装ルール**:

- 自動リダイレクトや自動送信を避ける
- いつでも前の画面に戻れるナビゲーションを提供
- モーダルは`Escape`キーまたは外側クリックで閉じられるように

```tsx
// ✅ Good: ユーザー主導の操作
<Dialog>
  <DialogContent onEscapeKeyDown={onClose} onPointerDownOutside={onClose}>
    {/* コンテンツ */}
  </DialogContent>
</Dialog>
```

#### 8. 直接操作（Direct Manipulation）

**指針**: 画面上のオブジェクトに直接触れて操作しているような感覚を与える。

**実装ルール**:

- ドラッグ＆ドロップでの並び替え（将来実装）
- インライン編集の採用
- リアルタイムプレビュー

```tsx
// ✅ Good: インライン編集
<div
  contentEditable
  onBlur={(e) => handleUpdate(e.target.textContent)}
  className="focus:outline-none focus:ring-2 focus:ring-ring"
>
  {title}
</div>
```

#### 9. モードレス（Modeless）

**指針**: できるだけモード（操作の意味が状況依存で変化する状態）をなくす。

**実装ルール**:

- 「編集モード」と「表示モード」を分けず、その場で編集可能に
- モーダルダイアログは最小限に（重要な確認のみ）
- サイドパネルやドロワーを活用してコンテキストを維持

```tsx
// ✅ Good: モードレスな編集
<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">詳細を編集</Button>
  </SheetTrigger>
  <SheetContent>{/* メイン画面を見ながら編集できる */}</SheetContent>
</Sheet>
```

#### 10. 視覚ゲシュタルト（Visual Gestalt）

**指針**: 近接、類似、閉鎖といったパターンを用いてレイアウトする。

**実装ルール**:

- 関連する要素は近くに配置（`gap-2`）、グループ間は離す（`gap-6`以上）
- 同じ機能のボタンは同じスタイル
- カードや枠線でグループを視覚的に区切る

```tsx
// ✅ Good: 視覚的なグルーピング
<div className="space-y-6">
  {/* グループ1: ユーザー情報 */}
  <Card>
    <CardHeader>
      <CardTitle>プロフィール</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      <Input placeholder="名前" />
      <Input placeholder="メール" />
    </CardContent>
  </Card>

  {/* グループ2: セキュリティ設定（離れた位置に配置） */}
  <Card>
    <CardHeader>
      <CardTitle>セキュリティ</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      <Input type="password" placeholder="現在のパスワード" />
      <Input type="password" placeholder="新しいパスワード" />
    </CardContent>
  </Card>
</div>
```

#### 11. コンストレイント（Constraint）

**指針**: ユーザーの行動を意図的に制限することにより、誤操作を減らす。

**実装ルール**:

- 入力フォームにバリデーションを設定
- 危険な操作には確認ダイアログを表示
- 入力値の範囲を`min`/`max`で制限

```tsx
// ✅ Good: 制約による誤操作防止
<Input
  type="number"
  min={1}
  max={100}
  placeholder="1〜100の値"
/>

// 削除前の確認
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">削除</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
      <AlertDialogDescription>
        この操作は取り消せません。
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>キャンセル</AlertDialogCancel>
      <AlertDialogAction onClick={onDelete}>削除</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

### 【情報提示と認知的負荷の軽減】

#### 12. ユーザーの言葉を使う（User's Language）

**指針**: システム内部の技術用語ではなく、ユーザーが普段使っている表現を用いる。

**実装ルール**:

- 「Submit」→「送信する」「保存する」
- 「Error」→「問題が発生しました」
- 「Invalid input」→「入力内容を確認してください」

```tsx
// ✅ Good: ユーザーフレンドリーな表現
<Button type="submit">プロフィールを保存</Button>
<p className="text-destructive">メールアドレスの形式が正しくありません</p>

// ❌ Bad: 技術用語
<Button type="submit">Submit</Button>
<p className="text-destructive">Invalid email format</p>
```

#### 13. ユーザーの記憶に頼らない（Minimize Memory Load）

**指針**: 参照すべき情報は、それが必要となるその場で参照できるようにする。

**実装ルール**:

- 選択肢はドロップダウンやラジオボタンで提示
- ヘルプテキストをフォームフィールドの近くに配置
- 前のステップの入力値をサマリーで表示

```tsx
// ✅ Good: その場で参照可能な情報
<div className="space-y-2">
  <Label htmlFor="password">パスワード</Label>
  <Input id="password" type="password" />
  <p className="text-sm text-muted-foreground">8文字以上、英数字と記号を含めてください</p>
</div>
```

#### 14. プリコンピュテーション（Precomputation）

**指針**: 先人がすでに見つけている最適値をプリセットにする。

**実装ルール**:

- よく使う選択肢をデフォルト選択状態に
- テンプレートやプリセットを用意
- スマートデフォルトの採用

```tsx
// ✅ Good: スマートデフォルト
<Select defaultValue="public">
  <SelectTrigger>
    <SelectValue placeholder="公開設定" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="public">公開（推奨）</SelectItem>
    <SelectItem value="members">メンバーのみ</SelectItem>
    <SelectItem value="private">非公開</SelectItem>
  </SelectContent>
</Select>
```

#### 15. エラーを回避する（Error Prevention）

**指針**: 操作ミスを起こしにくくする工夫を施す。

**実装ルール**:

- リアルタイムバリデーション
- 意味のない操作は無効化（`aria-disabled`使用）
- 自動補完や入力候補の提示

---

### 【行動科学と効率性】

#### 16. フィッツの法則（Fitts's Law）

**指針**: 近くて大きいものほどポイントしやすい設計にする。

**実装ルール**:

- 主要なボタンは十分なサイズ（最小44x44px）
- 頻繁に使うアクションは画面の端やコーナーに配置

```tsx
// ✅ Good: 十分なサイズのボタン
<Button size="lg" className="w-full md:w-auto min-h-11">
  新規作成
</Button>
```

#### 17. ヒックの法則（Hick's Law）

**指針**: 選択肢を適切に絞り込む。

**実装ルール**:

- 一度に表示するオプションは**5〜7個**まで
- 多い場合はカテゴリ分けやサブメニュー化
- 検索・フィルター機能を提供

#### 18. 複雑性保存の法則（Law of Conservation of Complexity）

**指針**: 複雑性をユーザー側からシステム側に移動する。

**実装ルール**:

- 複雑な計算や処理はサーバーサイドで実行
- ウィザード形式で複雑なフローを分割
- オートコンプリートで入力の手間を削減

#### 19. タスクコヒーレンス（Task Coherence）

**指針**: ユーザーが最後に行ったことを覚えているだけで正しく予測できる。

**実装ルール**:

- 最後に選択したフィルター条件を保持
- 最近使った項目を先頭に表示
- 入力中のデータを自動保存（下書き機能）

#### 20. メジャーなタスクに最適化する（Optimize for Major Tasks）

**指針**: 大多数のユーザーが行うタスクに合わせて必要な情報や機能を前面に出す。

**実装ルール**:

- 主要機能へのショートカットをヘッダーやサイドバーに配置
- 高度な設定は「詳細設定」に隠す
- ダッシュボードに最も使う情報を集約

#### 21. パースエージョン（Persuasion）

**指針**: 説得的な仕掛けを用いてユーザーの行動を促す。

**実装ルール**:

- オンボーディングでの使い方ガイド
- 進捗バーやバッジによる達成感の演出
- 社会的証明（「〇人が参加中」）の表示

#### 22. ショートカットを用意する（Provide Shortcuts）

**指針**: 経験あるユーザーが頻繁に実行する操作を短縮する方法を提供する。

**実装ルール**:

- キーボードショートカットの実装（`Ctrl+K`で検索など）
- クイックアクションメニュー
- 最近使った項目へのアクセス

---

### 【オブジェクト指向と構造】

#### 23. オブジェクトベースにする（Object-Based）

**指針**: ユーザーがオブジェクト（関心の対象）に直接働きかけながら目的を達成できる操作体系にする。

**実装ルール**:

- コミュニティ、ユーザー、投稿などをオブジェクトとして扱う
- オブジェクトに対するCRUD操作を一貫して提供
- コンテキストメニューでオブジェクトごとの操作を提供

#### 24. ビューはオブジェクトを表象する（Views Represent Objects）

**指針**: インターフェースはオブジェクトを表象するビューの集まりによって構成する。

**実装ルール**:

- 一覧ビュー（リスト/グリッド）と詳細ビューを使い分け
- 同じオブジェクトを複数の表現で表示可能に（カード/テーブル切り替え）
- オブジェクトの状態変化を即座にビューに反映

---

## 📋 チェックリスト（UIレビュー時）

### 🔴 Tier 1: 必須（全画面で確認）

新しいUIコンポーネントやページを作成したら、**必ず**以下をチェック：

- [ ] **HID-1 シンプル**: 画面要素数≤9個（ボタン、入力、ラベル等を数える）
- [ ] **HID-6 一貫性**: プライマリ=`variant="default"`、破壊的=`variant="destructive"`、キャンセル=`variant="outline"`
- [ ] **HID-11 コンストレイント**: 全入力に`required`/`minLength`/`maxLength`等のバリデーション
- [ ] **HID-13 記憶に頼らない**: 全フォームフィールドにヘルプテキストまたはplaceholder
- [ ] **HID-16 フィッツの法則**: プライマリボタン最小44×44px（`size="lg"` or `min-h-11`）

**不合格時の対応**: Tier 1違反は**実装前に必ず修正**。コードレビューでブロック対象。

---

### 🟡 Tier 2: 推奨（主要機能で確認）

**対象**: ダッシュボード、課金フロー、オンボーディング、コア機能

- [ ] **HID-2 簡単**: タスク完了までのクリック数≤3回
- [ ] **HID-3 メンタルモデル**: 馴染みのあるUIパターン（タブ、ドロップダウン等）
- [ ] **HID-4 シグニファイア**: クリック可能要素が明確（`<Button>`コンポーネント使用）
- [ ] **HID-5 マッピング**: 編集ボタンは編集対象の直近に配置
- [ ] **HID-7 ユーザー主導権**: 自動リダイレクト回避、モーダルのEscキー対応
- [ ] **HID-10 ゲシュタルト**: 関連要素は近く（gap-2）、グループ間は離す（gap-6）
- [ ] **HID-12 ユーザーの言葉**: 「Submit」→「送信」、技術用語回避
- [ ] **HID-14 プリコンピュテーション**: スマートデフォルト値設定
- [ ] **HID-17 ヒックの法則**: 選択肢5〜7個（多い場合はカテゴリ分け）
- [ ] **HID-20 メジャータスク最適化**: 主要機能をヘッダー/サイドバーに配置

---

### 🟢 Tier 3: 任意（余裕があれば）

**対象**: 詳細設定、管理者機能、エンゲージメント向上施策

- [ ] 直接操作の感覚（インライン編集、ドラッグ＆ドロップ）
- [ ] モードレス設計（編集モード/表示モードの分離回避）
- [ ] キーボードショートカット（`Ctrl+K`検索等）
- [ ] オブジェクトベース設計（CRUD操作の一貫性）

---

### 自動チェック実行

```bash
# Tier 1自動検証
bash scripts/hid-tier1-check.sh

# Lighthouse実行
npm run lighthouse

# Storybook visual regression test
npm run test-storybook
```

---

## 🔗 関連ドキュメント

- DADS実装指示書: `.github/instructions/ui-dadsi-instruction.md`
- Shadcn/UI指示書: `.github/instructions/ui-shadcn-instruction.md`
- ダミーデータ指示書: `.github/instructions/.dummydata-instructions.md`
