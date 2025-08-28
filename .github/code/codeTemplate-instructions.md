
### 2.4. ファイル・ディレクトリ構成
-   **コロケーションの採用:**
    -   Next.jsのApp Routerを使用し、コンポーネントのコロケーション（関連ファイルを同一ディレクトリに配置する戦略）を実践します。これにより、プロジェクトの保守性と可読性を向上させます。
    -   具体的には、1つのページとそのページで使用する複数のコンポーネント、およびそれらのテストファイルを同一のフォルダにまとめます。
-   **ディレクトリ名:** ケバブケース (例: `components/personal-information`) を使用します。
-   **ページ固有のデータフェッチ:**
    -   **場所:** `page.tsx` または `layout.tsx`
    -   **理由:** ページ全体で必要なデータを取得する場合、`page.tsx` または `layout.tsx` にフェッチ処理を記述します。これにより、ページ全体のデータ依存性が明確になります。
-   **コンポーネント固有のデータフェッチ:**
    -   **場所:** `ComponentA.logic.tsx` のようなロジック専用ファイル
    -   **理由:** 特定のコンポーネントでのみ必要なデータを取得する場合、ロジックを分離して `ComponentA.logic.tsx` に記述します。これにより、コンポーネントの責務が明確になります。


#### 2.4.1具体的な構成例

Next.jsのApp Routerを使用したプロジェクトのディレクトリ構成例は以下の通りです。

```
src/
	app/
		[page-name]/		// ルーティング用のフォルダ
			layout.tsx         // ページのレイアウトコンポーネント(無くても良い)
			page.tsx           // ページコンポーネント
		page.tsx			 //rootのページファイル
		layout.tsx			// rootのレイアウトファイル
	components/        // ページ固有のコンポーネントを格納するフォルダ
		common/            // 共通コンポーネントを格納するフォルダ
			CommonComponent.tsx       // 共通コンポーネント
			CommonComponent.logic.tsx // 共通コンポーネントのロジックを分離したファイル
			CommonComponent.test.tsx  // 共通コンポーネントのテストファイル
		[Feature1]						// サイトのページ単位でコンポーネント群をまとめます。
			index.ts  Feature1ページで使用されるコンポーネントをまとめてエクスポートします。
			[ComponentA]/					// ページを構成するコンポーネント
				component-a.tsx
				component-a.fetch.tsx		//component-aで使うデータ取得用のファイル
				component-a.logic.tsx      // component-aのロジックを分離したファイル
				component-a.test.tsx       // component-aのテストファイル
			[ComponentB]/					// ページを構成するコンポーネント
				component-b.tsx
				component-b.fetch.tsx		//component-bで使うデータ取得用のファイル
				component-b.logic.tsx      // component-bのロジックを分離したファイル
				component-b.test.tsx       // component-bのテストファイル
	utils/            // (必要に応じてユーティリティ関数などを格納)
	hooks/            // (必要に応じてカスタムフックを格納)
	lib/              // (必要に応じてライブラリやヘルパー関数を格納)
	types/            // (必要に応じて型定義を格納)
	constants/        // (必要に応じて定数を格納)

```

```src/app/route1/page.tsx
import * as Route1Components from '@/components/[Feature1]';

/**
 * Route1Pageコンポーネント
 * /route1 のページを表示します。
 */
const Route1Page = () => {
  return (
    <div>
      <h1>Route 1 Page</h1>
      <Route1Components.ComponentA />
      <Route1Components.ComponentB />
    </div>
  );
};

export default Route1Page;

```

```src/components/[Feature1]/index.ts
/**
 * [Feature1]ページで使用されるコンポーネントをまとめてエクスポートします。
 */
export * from './[ComponentA]/component-a';
export * from './[ComponentB]/component-b';

```

### 2.4.2 データフェッチに関して

Next.jsでは、ページやコンポーネントでデータを取得する方法がいくつかあります。以下に、データフェッチの基本的な方針と具体例を示します。

#### 直接使う方法
	クライアント側からデータフェッチをする。
	Supabaseクライアントをインポートして使う

#### APIを経由する方法
	サーバー側からデータフェッチをする。

[page-name]の下にapi/route.tsを作る
これはNext.jsのAPIルートとして機能します。
Next.jsの規約ではroute.tsは必ずappフォルダの下に置きます。

```
app
├── [page-name]
│   ├── api
│   │   └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── layout.tsx
└── page.tsx

```

### 2.4.3 データに関して

#### props
- **型安全なProps:** コンポーネント間のデータ受け渡しには、TypeScriptのインターフェースを使用します。
- **必須/オプションの区別:** 必須のpropsは`?`なし、オプションのpropsは`?`を付けて明示的にします。
- **デフォルト値:** オプションのpropsには適切なデフォルト値を設定します。

```typescript
interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  showEmail?: boolean; // オプション
  onEdit?: (userId: string) => void; // オプション
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  showEmail = false,
  onEdit
}) => {
  // コンポーネントの実装
};
```

#### 内部、外部からのデータ取得と、その選択基準



2.4.2 で説明した通り、以下の方法でデータを取得します：

- **Server Actions:** フォーム処理やデータ更新に適したNext.jsの機能
- **API Routes:** 複雑なビジネスロジックや外部API連携に使用
- **Supabase Client:** クライアント側での直接クエリ（認証が必要な場合）

**推奨パターン:**
1. ページ全体のデータ → `page.tsx` または `layout.tsx` でServer Actionsを使用
2. コンポーネント固有のデータ → `Component.logic.tsx` でSupabase Clientを使用
3. 複雑なAPI連携 → API Routes (`app/[page-name]/api/route.ts`) を使用

選択基準

* 冪等/副作用なし→Server Component内 fetch
* 複雑ロジック/外部API集約→API Route

### 実際のファイル・ディレクトリ構成のテンプレート

Next.jsのApp routerを使った場合のコンポーネントを作成する場合
このtemplateを参考にして作ります。

コロケーションの単位は1ページとそのページで使うコンポーネント群です。

```
/src/app/template       :templateルーティング
/src/components/common  :共通コンポーネント
/src/components/template :templateのページ用コンポーネント

```


