---
trigger: always_on
description: VNS masakinihirotaアプリケーションの統一デザイン指針(ライト/ダークモード定義等)
---

# デザインシステム (Design System)

VNS masakinihirota アプリケーションの統一されたデザイン指針を定義します。

## 参考リポジトリ

デジタル庁のリポジトリを参考にします。

- `design-system-example-components-react/`

デジタル庁UIのアクセシビリティ・構造思想を取り入れつつ、視覚的な装飾（Look & Feel）は独自のデザインシステムを採用します。

---

## テーマ定義

### ライトモード（グラスモーフィズム）

```
目的: Next.js/ReactのUIにライトモードのグラスモーフィズムを適用したい。
※ デジタル庁UI のアクセシビリティ・構造思想を取り入れるが、**視覚的な装飾（Look & Feel）はグラスモーフィズムを採用**する。
※ ただし、アクセシビリティ基準（コントラスト比 4.5:1以上）を優先し、可読性を損なうガラス表現は避ける。

要件:
- 背景: 明るい柔らかいグラデーション（例: from-white via-blue-50 to-purple-50）/ うっすらパターンOK
- カード/モーダル: ガラス風（半透明+ぼかし）
  - Tailwind例: bg-white/10 backdrop-blur-md border border-white/20 shadow-lg
  - 角丸: rounded-2xl（モバイル rounded-xl）
  - 内側の境界線/ハイライト: ring-1 ring-white/20 optional
- テキスト: 基本 `text-gray-800`、サブ `text-gray-600`、リンク/アクション `text-blue-700`
- アクセント: 青/紫系（例: `#4F46E5` / `#7C3AED`）
- ボタン:
  - 主要: bg-white/20 hover:bg-white/25 text-blue-800 border-white/30
  - セカンダリ: bg-blue-600 hover:bg-blue-700 text-white
  - フォーカスリング: focus:ring-2 focus:ring-blue-400/50
- 視覚効果: 影は中程度（shadow-lg）、トランジションは短め（duration-200 ease-out）
- アクセシビリティ: コントラスト AA以上、フォーカス可視、キーボード操作OK

設計:
- グローバルCSS変数（:root）でテーマ用トークンを定義（--bg、--card、--text、--accent）
- `ThemeProvider` or `class="light"` をhtml/bodyに適用可能な構成
- `Card`, `Button`, `Panel`, `Toolbar` などの再利用可能コンポーネントを作成

対応範囲:
- 既存UIの主要画面（評価一覧/セッション設定/カードUI）に適用
- 直近のクラス置換候補:
  - bg-gradient-to-br → bg-linear-to-br（必要に応じてテーマグラデ）
  - 重い影/彩度の高い色はトークン経由に変更
  - テキスト/ボタン色はトークン利用へ

成果物:
- テーマ用CSS変数定義
- コンポーネント（Card/Button/SectionHeader）の実装
- 置換パッチ（既存クラス→新クラス）と影響範囲の説明
- 受け入れ基準を満たすこと

受け入れ基準:
- コントラストAA以上 / フォーカスリング可視
- ガラス表現（半透明+backdrop-blur）が一貫
- 主要ページでレイアウト崩れなし（スマホ/タブレット/デスクトップ）
- 既存のイベント/状態は不変、回帰なし
```

---

### ダークモード（エレガント）

```
目的: ダークモードをエレガント（上品・控えめ・タイポグラフィ重視）に統一し、ライトと切替可能にする。

要件:
- 背景: 深いニュートラル（例: bg-[#0B0F1A] or bg-neutral-950）
- カード/モーダル: 上品な暗色ガラス
  - Tailwind例: bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.4)]
- テキスト: 基本 `text-neutral-200`、サブ `text-neutral-400`
- アクセント: 1色主軸（例: サファイア/インディゴ）＋控えめなトーン
- ボタン:
  - 主要: bg-white/10 hover:bg-white/15 text-neutral-100 border-white/20
  - セカンダリ: bg-indigo-600 hover:bg-indigo-700 text-white
- タイポグラフィ: 行間や字間をやや広め、見出しはウェイト控えめ（font-semibold）
- アニメーション: 極小（duration-200/300, ease-in-out）、過度なモーション禁止
- アクセシビリティ: コントラストAA以上、ダークでの文字滲み対策（彩度/明度バランス調整）

設計:
- `.dark` クラスでCSS変数を上書き（--bg, --card, --text, --accent）
- ライト/ダークのトークンは同キーで値のみ変更
- サーフェス階層（surface-0～3）を用意し陰影/層表現を安定させる

対応範囲:
- 全ページで `html` に `.dark` を付けた時の配色が即時反映
- 既存の派手な彩度は抑え、上品なダーク配色に統一
- フォーカス/ホバーのリング・影は控えめに

成果物:
- ダーク用CSS変数の上書き
- 既存UIのクラス置換（dark適用クラス）一覧
- テーマトグル実装（localStorage保存・初期モード推定）

受け入れ基準:
- ダーク時のコントラストAA以上
- 主要ページで読みやすさ/階層性が高い
- トグルでライト/ダークが無破綻に切り替わる
- 既存の機能に影響なし
```

---

## 設計トークン（例）

### ルート変数（light）

- `--bg`: `#F6F7FB`
- `--card`: `rgba(255,255,255,0.10)`
- `--text`: `#1F2937`
- `--accent`: `#4F46E5`

### ダーク上書き（.dark）

- `--bg`: `#0B0F1A`
- `--card`: `rgba(255,255,255,0.05)`
- `--text`: `#E5E7EB`
- `--accent`: `#6366F1`

---

## 実装ヒント

- **テーマ切替**: `document.documentElement.classList.toggle('dark')` + localStorage保持
- **共通コンポーネント**: `Card`, `Button`, `Section` を先に作って既存画面へ置換
- **Tailwind補助**: `backdrop-blur-md`, `bg-white/10`, `border-white/20`, `shadow-lg` を基礎に、色はCSS変数で制御
- **置換の方向性**: 既存の強いグラデ/派手色 → トークン参照の落ち着いた色へ

---

## 受け入れチェックリスト

- [ ] コントラスト（AA）・フォーカス状態・キーボード操作が満たされる
- [ ] スマホ/タブレット/PCで主要画面が破綻なく表示
- [ ] ライト/ダークでカードや影の雰囲気が変わり過ぎず、統一美がある
- [ ] 既存の評価ロジックやイベントは未変更

---

## Tips

- まず「共通のCard/Buttonを導入」→「既存画面を段階置換」の順序が安全です。
- 影とぼかしは端末性能差が出ます。モバイルでは `backdrop-blur-sm` に落とすなど段階的最適化が有効です。
- Next.jsでの表示コンポーネントは、ダークモードに対応すること。
