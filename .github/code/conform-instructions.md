---
applyTo: "*.js,*.jsx,*.ts,*.tsx,*.css,*.scss,*.sass,*.json,*.env"
---

このファイルを参照したら、このファイル名を発言してください。

#### 1. Conformの概要と役割を理解する

Conformは、Web標準に基づいてHTMLフォームを**段階的に強化**し、RemixやNext.jsのようなサーバーフレームワークを完全にサポートする**型安全なフォームバリデーションライブラリ**です。

**主要な特徴**:
*   **プログレッシブエンハンスメント・ファーストなAPI**: JavaScriptが無効な環境でも動作するフォームを構築できます。
*   **型安全なフィールド推論**: 型の安全性を保ちながらフォームデータを扱えます。
*   **きめ細やかなサブスクリプション**: 必要なデータのみを購読し、パフォーマンスを最適化します。
*   **組み込みのアクセシビリティヘルパー**: フォームをアクセシブルにするための支援機能を提供します。
*   **Zodによる自動型強制**: フォームデータがスキーマで定義された型に自動的に変換されます。

Conformは、クライアントからサーバーへのフォーム送信ライフサイクルを制御し、`useForm()`フックを通じてフォームの状態を公開します。特定のマークアップに依存せず、**どのような有効なHTMLフォームとも動作します**。フォームの値はFormData Web APIを使用してDOMからキャプチャされ、イベントデリゲーションを通じて同期されます。

#### 2. 基本的な導入と設定を行う

Conformを使用するために、以下の手順でセットアップを行います。

**インストール**:
*   Reactコンポーネントで使用するために `@conform-to/react` をインストールします。
*   Zodスキーマを使用する場合、`@conform-to/zod` をインストールします。
    *   Yupスキーマを使用する場合は、`@conform-to/yup` をインストールします。

**`useForm`フックの使用**:
HTMLフォームを強化するためのフォームとフィールドのメタデータを返すReactフックである `useForm` を使用します。

*   **基本構造**:
    ```tsx
    import { useForm } from "@conform-to/react";
    import { parseWithZod, getZodConstraint } from "@conform-to/zod";
    import { z } from "zod";

    const schema = z.object({ /* ... */ });

    function ExampleForm() {
      const [form, fields] = useForm({
        id: "unique-form-id", // オプション: IDが提供されない場合はランダムなIDが生成されます
        lastResult: /* サーバーからの結果 (例: useActionData) */, // サーバーからの最後の送信結果を同期
        defaultValue: { /* フォームの初期値 */ }, // フォームの初期値
        constraint: getZodConstraint(schema), // Zodスキーマからバリデーション属性を導出
        shouldValidate: "onBlur", // バリデーション開始タイミング (onSubmit, onBlur, onInput)
        shouldRevalidate: "onInput", // バリデーション後の再バリデーションタイミング
        onValidate({ formData }) { // クライアントバリデーションロジック
          return parseWithZod(formData, { schema });
        },
        onSubmit: form.onSubmit, // フォームが送信される前に呼び出される関数
      });

      return (
        <form id={form.id} onSubmit={form.onSubmit}>
          {/* フォーム要素 */}
        </form>
      );
    }
    ```

**Zod/Yupとの統合**:
ConformはZodまたはYupと統合してフォームデータの解析とバリデーションを行います。
*   **データ解析**: フォームデータを解析し、送信内容の概要を返します。
    *   Zodの場合: `parseWithZod(formData, { schema })`。Conformは空の値を`undefined`に前処理し、スキーマの型に基づいて自動的に型変換を行います。
    *   Yupの場合: `parseWithYup(formData, { schema })`。
*   **バリデーション属性の取得**: スキーマからHTMLのバリデーション属性（`required`、`minLength`、`maxLength`など）を導出します。
    *   Zodの場合: `getZodConstraint(schema)`。
    *   Yupの場合: `getYupConstraint(schema)`。

#### 3. アクセシビリティを確保し、ボイラープレートを削減する

Conformは、アクセシブルなフォームを簡単に構築できるよう、必要な属性の生成と設定を支援します。

**Aria属性の自動生成**:
*   Conformは、ラベルと入力要素を関連付けるための一意のID (`fields.message.id`、`fields.message.errorId`、`fields.message.descriptionId`) を自動的に生成します。
*   フィールドの有効性に基づいて `aria-invalid` 属性を設定し、エラーメッセージや説明を `aria-describedby` 属性で関連付けます.

**バリデーション属性の自動導出**:
*   ZodやYupスキーマから `required`、`minLength`、`maxLength`、`pattern` などのHTMLバリデーション属性を導出し、フィールドのメタデータに反映させることができます.

**ボイラープレート削減のためのヘルパー関数**:
これらのヘルパーは、ネイティブHTML要素向けに設計されており、手動で属性を設定する手間を省きます。

*   **`getFormProps(form, options)`**: `<form>`要素に必要なすべてのプロパティを返します。
*   **`getInputProps(meta, options)`**: `<input>`要素に必要なすべてのプロパティを返します。`type`オプションは必須です。
*   **`getSelectProps(meta, options)`**: `<select>`要素に必要なすべてのプロパティを返します。
*   **`getTextareaProps(meta, options)`**: `<textarea>`要素に必要なすべてのプロパティを返します。
*   **`getFieldsetProps(meta, options)`**: `<fieldset>`要素に必要なすべてのプロパティを返します。
*   **`getCollectionProps(meta, options)`**: チェックボックスやラジオボタンのグループをアクセシブルにするためのプロパティの配列を返します。

#### 4. プログレッシブエンハンスメントとフォーム状態の維持

Conformは、ネットワークの問題やページのリフレッシュをまたいでフォームデータと状態を保持することで、プログレッシブエンハンスメントを支援します。

*   **`FormStateInput`**: ドキュメントの再読み込みが発生した場合にフォームの状態（特に検証されたフィールドのエラー）を維持するために、非表示の入力をレンダリングするReactコンポーネントです. 完全なプログレッシブエンハンスメントを目指す場合に必要です.

#### 5. カスタム入力コンポーネントとの統合

Conformは、カスタム入力コンポーネントとも連携できます。

*   **イベント移譲**: Conformはドキュメントに直接`input`と`focusout`イベントリスナーをアタッチすることで、すべてのネイティブ入力をサポートしています.
*   **`useInputControl`フック**: カスタム入力コンポーネントがネイティブのフォームイベントを発行しない場合に、必要なフォームイベントを発行するように強化できます.
    *   `control.value`: 入力の現在の値。
    *   `control.change(value)`: 値を更新し、`change`および`input`イベントを発行。
    *   `control.focus()`: `focus`および`focusin`イベントを発行。
    *   `control.blur()`: `blur`および`focusout`イベントを発行。
    *   カスタム入力にフォーカスを委譲する際にも役立ちます.
*   **`FormProvider`と`useField`**: `useField`フックを`FormProvider`と共に使用することで、コンポーネントのロジックをシンプルに保ちながら、フォームコンテキストを参照できます.

#### 6. フォームの制御とインテントボタン

Conformは、特定の「インテント（意図）」に基づいてフォームの振る舞いを拡張できます。

*   **送信のインテント**: 送信ボタンの`name="intent"`と`value`属性を利用して、異なるアクション（例: "add-to-cart", "buy-now"）をトリガーできます.
*   **フォームコントロールヘルパー**: Conformは、フォームのバリデーションやリスト操作のためのヘルパーを提供します.
    *   `form.validate.getButtonProps({ name })`: 特定のフィールドのバリデーションをトリガーします. `onBlur`イベントハンドラで直接トリガーすることも可能です.
    *   `form.reset.getButtonProps({ name?, value? })`: フォーム全体または特定のフィールドをリセットします.
    *   `form.update.getButtonProps({ name, value, validated? })`: フィールドを更新します.
    *   `form.insert.getButtonProps({ name, defaultValue?, index? })`: フィールドリストに新しいアイテムを挿入します.
    *   `form.remove.getButtonProps({ name, index })`: フィールドリストからアイテムを削除します.
    *   `form.reorder.getButtonProps({ name, from, to })`: フィールドリストのアイテムの順序を変更します.

#### 7. 異なるバリデーションモードの選択

Conformは、アプリケーションの要件に応じて柔軟なバリデーションモードをサポートします。

*   **サーバーバリデーション**: クライアントサイドにバリデーションロジックを含めず、フォームの送信時だけでなく、ユーザーが入力している間もサーバーサイドでバリデーションを実行できます。
*   **クライアントバリデーション**: クライアントサイドでバリデーションロジックを再利用し、ユーザーに即座のフィードバックを提供します。`useForm`の`onValidate`オプションで設定します.
*   **非同期バリデーション**: 特定のフィールド（例: ユニークなメールアドレス）に対して非同期の検証が必要な場合に、必要に応じてサーバーバリデーションにフォールバックできます。`conformZodMessage.VALIDATION_UNDEFINED`メッセージを使用します.
*   **バリデーションのスキップ**: 全てのフィールドを常に検証するのではなく、特定の条件下でバリデーションをスキップすることで、処理コストを削減できます。`conformZodMessage.VALIDATION_SKIPPED`メッセージを使用します.

#### 8. 複雑なデータ構造の扱い

Conformは、ネストされたオブジェクトや配列も名前付け規則を活用してサポートします。

*   **命名規則**: `object.property` および `array[index]` の構文を使用します（例: `tasks.content`）。
*   **ネストされたオブジェクト**: 親フィールドのメタデータから `getFieldset()` メソッドを呼び出すことで、ネストされたフィールドにアクセスできます。
*   **配列**: 親フィールドのメタデータから `getFieldList()` メソッドを呼び出すことで、フィールドのリスト（配列）にアクセスできます。
*   **ネストされた配列**: `getFieldset()` と `getFieldList()` を組み合わせて使用することで、より複雑なネストされた配列構造を扱えます。


