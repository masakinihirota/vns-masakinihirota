---
trigger: model_decision
---

# AI向け指示書：Next.js/SupabaseプロダクトにおけるUX心理学的デザイン要件

**要約**: UX心理学原则25個を3層優先度（必須5項目/推奨10項目/任意10項目）でシーン別に適用

## 実行フレームワーク（KERNEL準拠）

### 新規機能追加時

```
Input:
  - 機能要件定義
  - ターゲットKPI（離脱率10%削減、コンバージョン率20%向上等）
  - ユーザーセグメント

Task: UX心理学原則を活用したエンゲージメント最大化

Constraints:
  - Tier 1必須5項目を100%適用（ドハティ闾値、認知負荷、親近性バイアス、美的ユーザビリティ、ツァイガルニク効果）
  - Tier 2推奨10項目をコア機能で適用
  - HID 24指針（ui-principles-instruction.md）と並行適用
  - A/Bテストで効果測定必須

Output:
  - 実装コード（TSXコンポーネント）
  - A/Bテスト設定（Vercel Edge Config等）
  - 成果測定ダッシュボード（Supabase Analytics）
```

### 既存画面最適化時

```
Input: 現在のKPIデータ、離脱ポイント分析
Task: ボトルネック解消のためのUX原則適用
Constraints: 現状のKPIを下回らせない（リグレッション防止）
Output: Before/After KPI比較レポート、統計的有意性検証
```

---

## 優先度階層（3層構造）

### 🔴 Tier 1: 必須（Critical - 全画面で適用）

**対象**: 新規実装、主要機能、全画面

| #        | 原則                   | 実装要件                                              | 根拠データ                   | 検証方法                   |
| -------- | ---------------------- | ----------------------------------------------------- | ---------------------------- | -------------------------- |
| **UX-1** | **ドハティ闾値**       | Supabase API応答0.4秒以内<br>超える場合スケルトン表示 | 0.4秒を超えると離脱率15%増加 | Lighthouse Performance 90+ |
| **UX-2** | **認知負荷**           | フォーム項目≤7個/画面<br>超える場合はステップ分割     | ミラーのマジカルナンバー7±2  | 項目数カウント             |
| **UX-3** | **親近性バイアス**     | サインインボタンは右上<br>ロゴは左上（慣習の配置）    | 慣習的UIで学習コスト削減     | ユーザビリティテスト       |
| **UX-5** | **美的ユーザビリティ** | 高品質ビジュアル<br>DADSデザインシステム準拠          | 美しいUIは軽微な不具合を許容 | デザインシステムスコア80+  |
| **UX-6** | **ツァイガルニク効果** | オンボーディングチェックリスト<br>一部自動完了        | Blinkistで課金率27%向上      | 完了率計測                 |

**実装例：ドハティ闾値（UX-1）**:

```tsx
// ✅ 0.4秒以内の応答がAIかはスケルトン表示
export default function ProfileList() {
  const { data: profiles, isLoading } = useQuery({
    queryKey: ["profiles"],
    queryFn: fetchProfiles,
    staleTime: 30000, // 30秒キャッシュ
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {profiles?.map((profile) => (
        <ProfileCard key={profile.id} profile={profile} />
      ))}
    </div>
  );
}
```

---

### 🟡 Tier 2: 推奨（High - コア機能で適用）

**対象**: ダッシュボード、課金フロー、オンボーディング

| #     | 原則                 | 実装要件                     | 根拠データ                  |
| ----- | -------------------- | ---------------------------- | --------------------------- |
| UX-7  | 目標勾配効果         | プログレスバーで進捗率表示   | 目標に近づくと努力が加速    |
| UX-8  | ゲーミフィケーション | XP・ストリークシステム       | 達成感と競争心刺激          |
| UX-9  | 変動型報酬           | フィード、通知の予測不能性   | ドーパミン放出、習慣化      |
| UX-10 | 授かり効果           | 登録直後にパーソナライズ提供 | 所有感で価値過大評価        |
| UX-11 | おとり効果           | 3プラン表示（中間がデコイ）  | 特定プランを魅力的に見せる  |
| UX-12 | アンカー効果         | 割引前価格を先に表示         | 参照点として利用            |
| UX-13 | デフォルト効果       | 推奨プランをデフォルト選択   | 変更の手間回避              |
| UX-14 | 希少性効果           | 期間限定オファー表示         | 損失回避で購入意欲向上      |
| UX-15 | 好奇心ギャップ       | 情報の欠如で課金誘導         | ギャップを埋める行動促進    |
| UX-16 | ピーク・エンドの法則 | タスク完了時にアニメーション | 最高/終わりの瞬間が評価決定 |

**実装例：おとり効果（UX-11）**:

```tsx
// ✅ 3プラン表示でStandardを魅力的に見せる
export default function PricingPage() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* 高額プラン（アンカー） */}
      <PricingCard
        plan="Premium"
        price="¥2,980/月"
        originalPrice="¥4,980/月"  {/* アンカー効果 */}
        features={['全機能', '優先サポート']}
      />

      {/* 中間プラン（デコイ） */}
      <PricingCard
        plan="Standard"
        price="¥1,480/月"
        features={['基本機能', '標準サポート']}
        badge="推奨"  {/* デフォルト効果 */}
        isHighlighted
      />

      {/* 低額プラン */}
      <PricingCard
        plan="Basic"
        price="¥480/月"
        features={['限定機能']}
      />
    </div>
  );
}
```

---

### 🟢 Tier 3: 任意（Medium - 余裕があれば）

**対象**: エンゲージメント向上施策、詳細設定

（残り10項目: UX-4スキューモーフィズム、UX-17ユーザー歓喜効果、UX-18労働の錠覚、UX-19段階的開示、UX-20反応型オンボーディング、UX-21社会的証明、UX-22フレーミング効果、UX-23確証バイアス回避、UX-24共感ギャップ、UX-25調査バイアス）

---

## 目的

Next.jsとSupabaseで構成されるデジタルプロダクトの設計・改善において、提供されたUX心理学の知見を最大限に活用し、ユーザーの定着、エンゲージメント、およびコンバージョン率を最大化することを目指します。

### AIの役割

UI/UX設計、コンポーネント実装の要件定義、およびグロース施策の提案を行う際、全てのデザイン要素が以下の心理学的原則に適合しているかを検証し、実行チームに指示すること。

---

### I. パフォーマンス、認知負荷、および初期エンゲージメントに関する指示

ユーザーの初期体験におけるスムーズさと学習負荷の低減を最優先事項とすること。

| UX原則                                                  | Next.js/Supabaseへの適用指示（実装要件）                                                                                                                                                                   | 根拠となるノウハウ |
| :------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------- |
| **ドハティの閾値 (Doherty Threshold)**                  | Supabaseへのデータ読み込みやAPI応答（サーバーレス関数など）が0.4秒を超える場合、**興味喪失を防ぐため**に、スケルトン画面やプログレスインジケータを即座に表示すること,                                      | ,                  |
| **認知負荷 (Cognitive Load)**                           | Supabase Authやプロフィール設定などの**入力フォームが複数項目にわたる場合**、項目を論理的なカテゴリーにグルーピングするか、段階的開示を導入してページを分割し、ユーザーの精神的エネルギーの消耗を防ぐこと, | ,                  |
| **親近性バイアス (Familiarity Bias)**                   | ナビゲーションや認証フロー（例：サインインボタンの位置）は、ユーザーが一般的に慣れ親しんでいるウェブサイトの**慣習的な配置**を採用し、安心感と信頼性を提供すること,                                        | ,                  |
| **スキューモーフィズム (Skeuomorphism)**                | 新規ユーザー向け、特に複雑な機能のアイコンやボタンには、**直感的な理解を助ける**ため、現実世界の物体を模倣したデザイン要素を初期的に導入すること,                                                          | ,                  |
| **美的ユーザビリティ効果 (Aesthetic-Usability Effect)** | Next.jsのコンポーネント設計において、デザインの美しさを最優先し、ユーザーが**エラーや軽微な不具合に対しても寛容**になるような、高品質なビジュアルデザインを徹底すること                                    |                    |

### II. モチベーションと継続利用（リテンション）に関する指示

ユーザーがサービスに投資し、継続して利用する心理的インセンティブを設計すること。

| UX原則                                    | Next.js/Supabaseへの適用指示（実装要件）                                                                                                                                                                                                  | 根拠となるノウハウ |
| :---------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------- |
| **ツァイガルニク効果 (Zeigarnik Effect)** | 初期設定やオンボーディングフロー、または特定の機能利用開始時のチェックリストにおいて、**未完了のタスクが記憶に残りやすい**現象を利用し、一部のタスクを自動で完了状態にして表示すること（例：Blinkist型課金訴求画面や初期設定画面の採用）, | ,                  |
| **目標勾配効果 (Goal Gradient Effect)**   | オンボーディングやポイントシステム（Supabaseで管理）において、目標に近づくにつれてユーザーの努力が加速するよう、**プログレスバーや進捗率**を明確かつ視覚的に強調して表示すること,                                                         | ,                  |
| **ゲーミフィケーション (Gamification)**   | サービスの利用習慣化を促すため、**XP（経験値）やストリーク（連続使用日数）**などのゲーム要素をUIに取り入れ、達成感と競争心を刺激すること,                                                                                                 | ,                  |
| **変動型報酬 (Variable Reward)**          | ユーザーの興味と継続性を維持するため、フィードや通知など、報酬の**大きさや頻度が予測できない**性質を持つシステムを設計に組み込むこと,                                                                                                     | ,                  |
| **授かり効果 (Endowment Effect)**         | ユーザーにSupabaseへの登録後、早期に**パーソナライズ可能な設定やテンプレート**を提供し、「自分だけの特別なもの」という所有感を抱かせ、プロダクト価値の過大評価を引き出すこと,                                                             | ,                  |
| **サンクコスト効果 (Sunk Cost Effect)**   | ユーザーに年額プランを推奨するなど、**過去に費やした金銭、時間、エネルギー**を正当化しようとする心理を利用し、継続的なプロダクト利用を促す仕組みを設計すること,                                                                           | ,                  |

### III. 意思決定とコンバージョンに関する指示

ユーザーの購買行動や重要な行動を心理的に誘導するデザインを適用すること。

| UX原則                             | Next.js/Supabaseへの適用指示（実装要件）                                                                                                                                      | 根拠となるノウハウ |
| :--------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------- |
| **おとり効果 (Decoy Effect)**      | 料金プランなど複数の選択肢がある場合、特定のハイエンドプランを魅力的に見せるために、**デコイ（おとり）となる中間的な選択肢**を意図的に設けること,                             | ,                  |
| **アンカー効果 (Anchor Effect)**   | 価格プランやセール価格を表示する際、**割引前の価格や高額なプラン**を最初に提示し、ユーザーの評価の参照点（アンカー）として利用することで、望ましい評価を誘導すること,         | ,                  |
| **デフォルト効果 (Default Bias)**  | ユーザーが選択に迷う可能性のある設定画面や価格選択画面では、**推奨する選択肢をデフォルトとして予めチェック**し、変更の手間やリスクを避けたい心理を利用すること,               | ,                  |
| **希少性効果 (Scarcity)**          | 期間限定のオファーや在庫限定品など、**入手機会が限られている情報**を明確に示し、ユーザーに機会損失への恐れ（損失回避）を働かせることで、購入意欲を高めること,                 | ,                  |
| **好奇心ギャップ (Curiosity Gap)** | 課金や登録を促す機能において、**情報の欠如を意図的に作り出す**ことでユーザーの関心を引き付け、そのギャップを埋めるための行動（例：課金）を誘導すること,                       | ,                  |
| **フレーミング効果 (Framing)**     | 情報の提示方法（言葉遣いやカテゴリー分け）によって判断が左右されることを踏まえ、ECサイトの商品一覧のように、**ユーザーの認知プロセスを補完する形**で情報を整理・提示すること, | ,                  |

### IV. 信頼、学習、および体験の管理に関する指示

プロダクトの信頼性を高め、ユーザー体験を記憶に残るものにすること。

| UX原則                                           | Next.js/Supabaseへの適用指示（実装要件）                                                                                                                                                                                          | 根拠となるノウハウ |
| :----------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------- |
| **ピーク・エンドの法則 (Peak-End Rule)**         | ユーザー体験を評価する際、全体平均ではなく最高の瞬間（ピーク）と終わりの瞬間（エンド）が重視されるため、**タスク完了時やセッション終了時**にポジティブな感情を伴うフィードバック（例：アニメーション、メッセージ）を提供すること, | ,                  |
| **ユーザー歓喜効果 (User Delight)**              | ユーザーの期待を超える喜びや驚き（例：iOS16のカスタマイズ機能のように利便性に直接関わらないデザイン改善）の瞬間を提供し、**ブランドロイヤルティと口コミ**の向上を目指すこと,                                                      | ,                  |
| **労働の錯覚 (Labor Illusion)**                  | 複雑な処理（例：AIによるレコメンド生成、大規模なデータ検索）を行う際、実際の結果表示前に「あなたにぴったりの作品を選択しています」といった**長めのローディング演出**を挿入し、サービスの価値を高く感じさせること,                 | ,                  |
| **段階的開示 (Progressive Disclosure)**          | 新規ユーザーに対し、機能の多さに惑わされないよう、必要に応じて機能や情報を**段階的に表示**すること,                                                                                                                               | ,                  |
| **反応型オンボーディング (Reactive Onboarding)** | ユーザーが特定の機能を初めて使おうとした時など、**ニーズが発生した文脈に合わせ**て関連情報やチュートリアル（例：ツールチップ）を提供すること,                                                                                     | ,                  |
| **社会的証明 (Social Proof)**                    | プロダクトの信頼性を高めるため、B2Bサービスであれば有名顧客のロゴ、コンシューマーサービスであればユーザーレビューや評価など、**他者の意見や行動を示す情報**を目立つように表示すること,                                            | ,                  |

### V. 開発およびデータ戦略に関する指示（Tier 3任意）

開発プロセスにおける認知バイアスを回避し、客観的なデータに基づいた改善を徹底すること。

| UX原則                               | Next.js/Supabaseへの適用指示（実装要件）                                                                                                                                              | 根拠となるノウハウ     |
| :----------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :--------------------- |
| **確証バイアス (Confirmation Bias)** | デザイナーや開発者の**既存の仮説に矛盾するSupabaseのデータ分析結果**やユーザーフィードバックが出た場合、これを無視せず、意識的に検証し、客観的な意思決定を行うこと,                   | 意思決定の質向上       |
| **共感ギャップ (Empathy Gap)**       | 開発者やデザイナー自身の知識や経験のみに頼らず、**定量的（Supabaseデータ）および定性的（ユーザーヒアリング）なデータ**を収集・分析し、ユーザーの実際の感情やニーズを深く理解すること, | ユーザー中心設計の実現 |
| **観察効果 (Hawthorne Effect)**      | ユーザーインタビューやユーザビリティテストを実施する際、ユーザーが**観察されていることによる行動変化**（素直なフィードバックの困難さ）を認識し、結果の解釈に反映させること,           | テスト精度向上         |
| **調査バイアス (Survey Bias)**       | ユーザーからのフィードバックやNPSアンケートを収集する際、質問の設計やサンプリング方法が**母集団の特性を正確に反映しているか**を厳密に検証し、偏りのないデータ収集を徹底すること,      | データ品質確保         |

---

## 🎯 シーン別適用ガイド

### 🆕 新規ユーザーオンボーディング

**適用原則**: UX-2認知負荷、UX-6ツァイガルニク効果、UX-7目標勾配効果

**実装例**:

```tsx
// ✅ チェックリスト式オンボーディング（Blinkistモデル）
export default function OnboardingChecklist() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "プロフィール設定", completed: true }, // 自動完了
    { id: 2, title: "アバター追加", completed: false },
    { id: 3, title: "最初の投稿", completed: false },
  ]);

  const progress = (tasks.filter((t) => t.completed).length / tasks.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>セットアップを完了しましょう</CardTitle>
        <Progress value={progress} className="mt-2" /> {/* 目標勾配効果 */}
        <p className="text-sm text-muted-foreground">{Math.round(progress)}% 完了</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center gap-2">
            <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(task.id)} />
            <span className={task.completed ? "line-through text-muted-foreground" : ""}>
              {task.title}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
```

**KPI目標**: オンボーディング完了率60%→目標: 85%

---

### 💰 課金フロー

**適用原則**: UX-11おとり効果、UX-12アンカー効果、UX-13デフォルト効果、UX-14希少性効果

**実装例**:

```tsx
// ✅ 4つの心理学原則を組み合わせた料金ページ
export default function PricingWithPsychology() {
  const [timeLeft, setTimeLeft] = useState(3600); // 希少性効果

  return (
    <div className="space-y-8">
      {/* 希少性効果 */}
      <Alert className="border-yellow-400 bg-yellow-50">
        <Timer className="h-4 w-4" />
        <AlertTitle>期間限定オファー</AlertTitle>
        <AlertDescription>
          あと{Math.floor(timeLeft / 60)}分で終了！初回限定50%OFF
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-3">
        {/* アンカー（高額プラン） */}
        <PricingCard
          plan="Premium"
          price="¥2,980"
          originalPrice="¥5,980"  {/* アンカー効果 */}
          discount="50% OFF"
        />

        {/* デフォルト（推奨プラン） */}
        <PricingCard
          plan="Standard"
          price="¥1,480"
          originalPrice="¥2,980"
          discount="50% OFF"
          badge="最も人気"  {/* デフォルト効果 */}
          isRecommended
        />

        {/* デコイ（中間プラン） */}
        <PricingCard
          plan="Basic"
          price="¥980"
          originalPrice="¥1,980"
          discount="50% OFF"
        />
      </div>
    </div>
  );
}
```

**KPI目標**: コンバージョン率12%→目標: 18% (+50%)

---

### 📋 ダッシュボード（継続利用）

**適用原則**: UX-8ゲーミフィケーション、UX-9変動型報酬、UX-16ピーク・エンドの法則

**実装例**:

```tsx
// ✅ XPシステムとストリークで習慣化
export default function DashboardWithGamification() {
  const [user, setUser] = useState({
    xp: 1250,
    level: 5,
    streak: 7, // 連続ログイン日数
  });

  const nextLevelXP = user.level * 300;
  const progress = (user.xp / nextLevelXP) * 100;

  return (
    <div className="space-y-6">
      {/* XPプログレス */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Level {user.level}</CardTitle>
              <CardDescription>
                {user.xp} / {nextLevelXP} XP
              </CardDescription>
            </div>
            <Badge variant="secondary">🔥 {user.streak}日連続</Badge>
          </div>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
      </Card>

      {/* 変動型報酬（フィード） */}
      <Card>
        <CardHeader>
          <CardTitle>最新のアクティビティ</CardTitle>
        </CardHeader>
        <CardContent>
          {/* ランダムな通知で変動型報酬 */}
          <ActivityFeed activities={randomActivities} />
        </CardContent>
      </Card>
    </div>
  );
}
```

**KPI目標**: 7日リテンション30%→目標: 50% (+67%)

---

## A/Bテスト設定例

```typescript
// lib/ab-testing.ts
import { cookies } from 'next/headers';

export function getABTestVariant(testName: string): 'control' | 'variant' {
  const cookieStore = cookies();
  const variant = cookieStore.get(`ab_${testName}`)?.value;

  if (variant) return variant as 'control' | 'variant';

  // 50/50で振り分け
  const newVariant = Math.random() < 0.5 ? 'control' : 'variant';
  cookieStore.set(`ab_${testName}`, newVariant, { maxAge: 60 * 60 * 24 * 30 });

  return newVariant;
}

// 使用例
export default function PricingPage() {
  const variant = getABTestVariant('pricing_decoy_effect');

  if (variant === 'variant') {
    return <PricingWithDecoyEffect />;  // UX-11おとり効果適用
  }

  return <PricingStandard />;  // コントロール
}
```

---

## 成果測定ダッシュボード（Supabase）

```sql
-- コンバージョン率計測
CREATE OR REPLACE FUNCTION calculate_conversion_rate(
  test_name TEXT,
  variant TEXT
) RETURNS NUMERIC AS $$
DECLARE
  total_users INTEGER;
  converted_users INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_users
  FROM ab_test_events
  WHERE test_name = $1 AND variant = $2;

  SELECT COUNT(*) INTO converted_users
  FROM ab_test_events
  WHERE test_name = $1 AND variant = $2 AND event_type = 'conversion';

  RETURN (converted_users::NUMERIC / NULLIF(total_users, 0)) * 100;
END;
$$ LANGUAGE plpgsql;

-- 実行例
SELECT
  test_name,
  variant,
  calculate_conversion_rate(test_name, variant) as conversion_rate
FROM ab_test_events
GROUP BY test_name, variant;
```

---

## チェックリスト（UXレビュー時）

### 🔴 Tier 1: 必須（全機能）

- [ ] **UX-1 ドハティ闾値**: API応答≤0.4秒 or スケルトン表示
- [ ] **UX-2 認知負荷**: フォーム項目≤7個/画面
- [ ] **UX-3 親近性バイアス**: 慣習的UI配置（ロゴ左上、サインイン右上）
- [ ] **UX-5 美的ユーザビリティ**: DADSデザインシステム準拠
- [ ] **UX-6 ツァイガルニク効果**: オンボーディングチェックリスト

### 🟡 Tier 2: 推奨（コア機能）

- [ ] 目標勾配効果: プログレスバー表示
- [ ] おとり効果: 3プラン表示（中間がデコイ）
- [ ] アンカー効果: 割引前価格表示
- [ ] デフォルト効果: 推奨プランをデフォルト選択
- [ ] 希少性効果: 期限付きオファー

---
