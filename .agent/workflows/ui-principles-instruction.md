---
applyTo: "src/components/**,src/app/**"
---

# ヒューマンインターフェースデザイン（HID）24指針 UI実装指示書

このプロジェクトのUI設計・実装では、以下の24のヒューマンインターフェースデザイン指針を厳守してください。
Next.js App Router + Shadcn/UI + Tailwind CSS を使用し、静的なUIページを**モックデータ**で構築します。

## 適用優先順位（UI指示書の併用ルール）

- 最優先: `ui-dadsi-instruction.md`（DADS実装指示）のデザイントークン、アクセシビリティ実装（`aria-disabled`、フォーカスリング、コントラスト、タイポグラフィ）。
- 本書: 行動原則・UXルール（HID 24指針）。スタイルはDADSに従いつつ、本書の原則で画面構造やインタラクションを設計してください。
- 参考: `ui-shadcn-instruction.md` はプロンプト補助であり実装規約ではありません。DADS/HIDと矛盾する場合はDADS→本書の順で優先します。

DADSのスタイル要件を満たした上で、本書の指針で情報設計・操作性を整理し、Shadcn由来のサンプルを使う場合もDADSのトークン/アクセシビリティに上書きしてください。

## 概要

- **フレームワーク**: Next.js 15.5.x (App Router)
- **UIライブラリ**: Shadcn/UI (new-york スタイル)
- **スタイリング**: Tailwind CSS v4
- **データ**: モックデータ（Supabase接続前提のスキーマ互換形式）

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
  id: string           // UUID形式
  created_at: string   // ISO 8601形式 (例: "2024-01-15T09:00:00Z")
  updated_at: string   // ISO 8601形式
  display_name: string
  avatar_url: string | null
  bio: string | null
  // Supabaseのauth.usersとの外部キー想定
}

/**
 * コミュニティ型
 * @description Supabase communities テーブルと互換
 */
export type MockCommunity = {
  id: string           // UUID形式
  created_at: string
  updated_at: string
  name: string
  description: string | null
  owner_id: string     // MockUser.id への外部キー
  member_count: number
  is_public: boolean
}
```

```typescript
// src/lib/mock-data/users.ts
import type { MockUser } from './types'

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
]

/**
 * 現在のログインユーザー（モック）
 */
export const mockCurrentUser: MockUser = mockUsers[0]
```

### 3. コンポーネントでのモックデータ使用

```tsx
// src/app/(10-community)/community/page.tsx
import { mockCommunities } from '@/lib/mock-data'
import { CommunityCard } from './_components/community-card'

export default function CommunityPage() {
  // 将来: const { data: communities } = await supabase.from('communities').select('*')
  const communities = mockCommunities

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {communities.map((community) => (
        <CommunityCard key={community.id} community={community} />
      ))}
    </div>
  )
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
  <SheetContent>
    {/* メイン画面を見ながら編集できる */}
  </SheetContent>
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
  <p className="text-sm text-muted-foreground">
    8文字以上、英数字と記号を含めてください
  </p>
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

```tsx
// ✅ Good: エラー回避のためのリアルタイムバリデーション
<Input
  type="email"
  onChange={(e) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)
    setEmailError(!isValid)
  }}
  aria-invalid={emailError}
  aria-describedby="email-error"
/>
{emailError && (
  <p id="email-error" className="text-sm text-destructive">
    有効なメールアドレスを入力してください
  </p>
)}
```

---

### 【行動科学と効率性】

#### 16. フィッツの法則（Fitts's Law）

**指針**: 近くて大きいものほどポイントしやすい設計にする。

**実装ルール**:
- 主要なボタンは十分なサイズ（最小44x44px）
- 頻繁に使うアクションは画面の端やコーナーに配置
- モバイルではタップ領域を十分に確保

```tsx
// ✅ Good: 十分なサイズのボタン
<Button size="lg" className="w-full md:w-auto min-h-[44px]">
  新規作成
</Button>
```

#### 17. ヒックの法則（Hick's Law）

**指針**: 選択肢を適切に絞り込む。

**実装ルール**:
- 一度に表示するオプションは**5〜7個**まで
- 多い場合はカテゴリ分けやサブメニュー化
- 検索・フィルター機能を提供

```tsx
// ✅ Good: 選択肢の絞り込み
<Command>
  <CommandInput placeholder="検索..." />
  <CommandList>
    <CommandGroup heading="よく使う">
      <CommandItem>オプション1</CommandItem>
      <CommandItem>オプション2</CommandItem>
    </CommandGroup>
    <CommandGroup heading="その他">
      <CommandItem>オプション3</CommandItem>
      {/* ... */}
    </CommandGroup>
  </CommandList>
</Command>
```

#### 18. 複雑性保存の法則（Law of Conservation of Complexity）

**指針**: 複雑性をユーザー側からシステム側に移動する。

**実装ルール**:
- 複雑な計算や処理はサーバーサイドで実行
- ウィザード形式で複雑なフローを分割
- オートコンプリートで入力の手間を削減

```tsx
// ✅ Good: ステップ形式で複雑さを分割
<div className="space-y-4">
  <div className="flex justify-between text-sm text-muted-foreground">
    <span>ステップ {currentStep} / 3</span>
    <span>{stepLabels[currentStep - 1]}</span>
  </div>
  <Progress value={(currentStep / 3) * 100} />
  {/* 現在のステップのコンテンツ */}
</div>
```

#### 19. タスクコヒーレンス（Task Coherence）

**指針**: ユーザーが最後に行ったことを覚えているだけで正しく予測できる。

**実装ルール**:
- 最後に選択したフィルター条件を保持
- 最近使った項目を先頭に表示
- 入力中のデータを自動保存（下書き機能）

```tsx
// ✅ Good: 最近の選択を記憶
const [recentCommunities, setRecentCommunities] = useLocalStorage<string[]>(
  'recent-communities',
  []
)

<CommandGroup heading="最近アクセス">
  {recentCommunities.map((id) => (
    <CommandItem key={id}>{/* ... */}</CommandItem>
  ))}
</CommandGroup>
```

#### 20. メジャーなタスクに最適化する（Optimize for Major Tasks）

**指針**: 大多数のユーザーが行うタスクに合わせて必要な情報や機能を前面に出す。

**実装ルール**:
- 主要機能へのショートカットをヘッダーやサイドバーに配置
- 高度な設定は「詳細設定」に隠す
- ダッシュボードに最も使う情報を集約

```tsx
// ✅ Good: メジャータスクを前面に
<nav className="flex items-center gap-4">
  <Button variant="default">新規投稿</Button> {/* 最も使う機能 */}
  <Button variant="ghost">コミュニティ</Button>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost">その他</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      {/* 低頻度の機能 */}
    </DropdownMenuContent>
  </DropdownMenu>
</nav>
```

#### 21. パースエージョン（Persuasion）

**指針**: 説得的な仕掛けを用いてユーザーの行動を促す。

**実装ルール**:
- オンボーディングでの使い方ガイド
- 進捗バーやバッジによる達成感の演出
- 社会的証明（「〇人が参加中」）の表示

```tsx
// ✅ Good: 説得的な要素
<Card>
  <CardHeader>
    <CardTitle>プロフィールを完成させましょう</CardTitle>
  </CardHeader>
  <CardContent>
    <Progress value={60} />
    <p className="text-sm text-muted-foreground mt-2">
      完成度 60% - あと2項目で完了です
    </p>
  </CardContent>
</Card>
```

#### 22. ショートカットを用意する（Provide Shortcuts）

**指針**: 経験あるユーザーが頻繁に実行する操作を短縮する方法を提供する。

**実装ルール**:
- キーボードショートカットの実装（`Ctrl+K`で検索など）
- クイックアクションメニュー
- 最近使った項目へのアクセス

```tsx
// ✅ Good: コマンドパレット
<CommandDialog open={open} onOpenChange={setOpen}>
  <CommandInput placeholder="コマンドを検索..." />
  <CommandList>
    <CommandGroup heading="クイックアクション">
      <CommandItem>
        <Plus className="mr-2 h-4 w-4" />
        新規投稿
        <CommandShortcut>⌘N</CommandShortcut>
      </CommandItem>
      <CommandItem>
        <Search className="mr-2 h-4 w-4" />
        検索
        <CommandShortcut>⌘K</CommandShortcut>
      </CommandItem>
    </CommandGroup>
  </CommandList>
</CommandDialog>
```

---

### 【オブジェクト指向と構造】

#### 23. オブジェクトベースにする（Object-Based）

**指針**: ユーザーがオブジェクト（関心の対象）に直接働きかけながら目的を達成できる操作体系にする。

**実装ルール**:
- コミュニティ、ユーザー、投稿などをオブジェクトとして扱う
- オブジェクトに対するCRUD操作を一貫して提供
- コンテキストメニューでオブジェクトごとの操作を提供

```tsx
// ✅ Good: オブジェクトベースのUI
<ContextMenu>
  <ContextMenuTrigger asChild>
    <CommunityCard community={community} />
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem onClick={() => router.push(`/community/${community.id}`)}>
      詳細を見る
    </ContextMenuItem>
    <ContextMenuItem onClick={() => onEdit(community.id)}>
      編集
    </ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem className="text-destructive" onClick={() => onDelete(community.id)}>
      削除
    </ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

#### 24. ビューはオブジェクトを表象する（Views Represent Objects）

**指針**: インターフェースはオブジェクトを表象するビューの集まりによって構成する。

**実装ルール**:
- 一覧ビュー（リスト/グリッド）と詳細ビューを使い分け
- 同じオブジェクトを複数の表現で表示可能に（カード/テーブル切り替え）
- オブジェクトの状態変化を即座にビューに反映

```tsx
// ✅ Good: 複数のビュー表現
const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

<div className="flex justify-end gap-2 mb-4">
  <Button
    variant={viewMode === 'grid' ? 'default' : 'outline'}
    size="icon"
    onClick={() => setViewMode('grid')}
  >
    <Grid className="h-4 w-4" />
  </Button>
  <Button
    variant={viewMode === 'list' ? 'default' : 'outline'}
    size="icon"
    onClick={() => setViewMode('list')}
  >
    <List className="h-4 w-4" />
  </Button>
</div>

{viewMode === 'grid' ? (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {communities.map((c) => <CommunityCard key={c.id} community={c} />)}
  </div>
) : (
  <Table>
    {/* テーブル形式の表示 */}
  </Table>
)}
```

---

## 📋 チェックリスト（UIレビュー時）

新しいUIコンポーネントやページを作成したら、以下をチェックしてください：

### 基本原則
- [ ] 画面の要素数は最小限か（シンプル）
- [ ] タスク完了までのステップ数は適切か（簡単）
- [ ] 馴染みのあるUIパターンを使用しているか（メンタルモデル）
- [ ] クリック可能な要素は明確か（シグニファイア）
- [ ] 操作と結果の対応は明確か（マッピング）
- [ ] スタイルは一貫しているか（一貫性）

### インタラクション
- [ ] ユーザーが自由に操作できるか（主導権）
- [ ] 直接操作の感覚があるか
- [ ] 不要なモードはないか
- [ ] グルーピングは適切か（ゲシュタルト）
- [ ] 誤操作を防ぐ制約があるか

### 情報提示
- [ ] 専門用語を使っていないか
- [ ] 必要な情報はその場にあるか
- [ ] デフォルト値は適切か
- [ ] エラー回避の工夫はあるか

### 効率性
- [ ] ボタンサイズは十分か
- [ ] 選択肢の数は適切か
- [ ] 主要タスクが前面にあるか
- [ ] ショートカットはあるか

---

## 🔗 関連ドキュメント

- DADS実装指示書: `.github/instructions/ui-dadsi-instruction.md`
- Shadcn/UI指示書: `.github/instructions/ui-shadcn-instruction.md`
- ダミーデータ指示書: `.github/instructions/.dummydata-instructions.md`
