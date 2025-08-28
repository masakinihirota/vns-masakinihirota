---
applyTo: "*.js,*.jsx,*.ts,*.tsx,*.css,*.scss,*.sass,*.json,*.env"
---

このファイルを参照したら、このファイル名を発言してください。

---

## 主要原則

* テストは、最初にテストを書き、そのテストが動くコンポーネントを作成します。
* **単一責任**: 各テストは、コンポーネントの単一の特定の動作を検証します。
* **分離されたテスト**: テストは互いに独立しており、実行順序に依存しません。
* **Vitestの使用**: テストフレームワークとしてVitestを使用します。
* **Reactの使用**: コンポーネントはReactで記述します。
* テストはコンポーネントのファイルと同じ場所に配置します。
* テストファイルの拡張子は`*.test.tsx`とします。
* コンポーネントファイルの拡張子は`*.tsx`とします。
* **React Testing Libraryの使用**: コンポーネントのテストにはReact Testing Libraryを使用します。

## ワークフロー手順

1.  **要件の理解**:
    開発するReactコンポーネントの機能要件と期待される動作を詳細に分析します。
    例: 「ボタンをクリックするとテキストが変更される」「リストにアイテムが表示される」など。

2.  **テストの作成**:
    * コンポーネントの特定の機能に対する新しいテストファイル（例: `ComponentName.test.tsx`）を作成します。
    - `ComponentName`のpropsに型を付ける場合は、`interface`や`type`を使いましょう。
    - テストファイルの拡張子は`.test.tsx`にしてください。
    - `@testing-library/jest-dom`のマッチャーを使うと、より直感的なアサーションが書けます。

    * テストは、コンポーネントの期待される動作を検証するためのものです。例: 「ボタンが正しくレンダリングされる」「クリックイベントが発火する」など。

    ```tsx
    // ComponentName.test.tsx の例
    import { render, screen, fireEvent } from '@testing-library/react';
    import ComponentName from './ComponentName';
    import '@testing-library/jest-dom';
    import { describe, it, expect } from 'vitest';

    describe('ComponentName', () => {
      it('should render the component with initial text', () => {
        render(<ComponentName />);
        expect(screen.getByText('Hello')).toBeInTheDocument();
      });

      it('should change text on button click', () => {
        render(<ComponentName />);
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByText('Clicked!')).toBeInTheDocument();
      });
    });

    ```

3.  **テストをパスするための最小限のコードの記述**:
    * 対応するReactコンポーネントファイル（例: `ComponentName.tsx`）を作成または修正します。
    * 現在、必要な最小限のコードのみを記述します。将来の機能や複雑なロジックは、このフェーズでは追加しません。

    ```tsx
    // ComponentName.tsx の例
    import React, { useState } from 'react';

    const ComponentName: React.FC = () => {
    const [text, setText] = useState('Hello');

    const handleClick = () => {
        setText('Clicked!');
    };

    return (
        <div>
        {text}
        <button onClick={handleClick}>Click Me</button>
        </div>
    );
    };

    export default ComponentName;

    ```

    * テストがパスしたことを確認します。

    * **重要**: リファクタリングによって既存のテストが壊れないことを確認します。つまり、外部から見たコンポーネントの動作は変更しません。
    例: 関数抽出、ロジックの簡素化、変数名の改善、重複コードの削除など。
    * 全てのテストがパスすることを確認します。


---

## VitestとReact Testing Libraryの具体的な使用法

* コンポーネントのレンダリングには`@testing-library/react`の**`render`関数**を使用します。
* DOM要素のクエリには**`screen`オブジェクトのメソッド**（例: `getByText`, `getByRole`, `findBy*`, `queryBy*`など）を使用します。
* アサーションには**Vitestの`expect`**と`@testing-library/jest-dom`の**マッチャー**（例: `toBeInTheDocument`, `toHaveTextContent`など）を組み合わせます。
* 非同期処理（データフェッチなど）を伴う場合は、`async/await`と`findBy*`クエリ、または`waitFor`を使用することを考慮します。
* 外部依存関係がある場合は、Vitestの**モック機能（`vi.mock`）**を適切に使用して、テストの独立性と速度を確保します。

---

# テスト駆動開発のガイドライン

基本的に、テスト駆動開発で進めます。
期待される入出力に基づき、まずテストを作成します。
テストが正しいことを確認できた段階でコミットします。
その後、テストをパスさせる実装を進めます。
実装中はテストを変更せず、コードを修正し続けます。
すべてのテストが通過するまで繰り返します。


# AIへのテストの指示。

AIへは、基本的に許可をする
AIへの禁止命令をしてはいけない。
AIの構造上の問題で、禁止よりも許可のほうが指示が通りやすい。

全テストをパスするコードを書いてください。

テストコードは、開発者本人の許可を得てからコメントアウトをしてください。
テストコードは、開発者本人の許可を得てから削除をしてください。

テストファイルは、読み込みを許可しています。
テストファイルは、許可が出てから編集をしてください。


# 期待する動作をテストで定義

テストは継続的フィードバックやガードレールの役割として活用します。





# 契約による設計に基づくプロンプト実装

```プロンプトのフォーマット
# 役割
あなたは以下の専門家である
- テストコード
- 契約による設計(事前条件、事後条件、不変条件)
#目的
テストコード実装
#制約
- メソッドの事前条件、事後条件、不変条件を検証するテストであること
- Given-When-Thenパターンに基づいて実装すること
# テスト対象
(ここにテスト対象のメソッドを指定する)

```

## 8. テスト戦略

### 8.1 単体テスト
- コンポーネントの動作テスト
- カスタムフックのテスト
- ユーティリティ関数のテスト

### 8.2 統合テスト
- ユーザーフローのテスト
- データストアの連携テスト
- localStorage操作のテスト

### 8.3 E2Eテスト
- 主要機能のエンドツーエンドテスト
- 複数ブラウザでの動作確認
- パフォーマンステスト
