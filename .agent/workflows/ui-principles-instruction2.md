---
description:
---

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
