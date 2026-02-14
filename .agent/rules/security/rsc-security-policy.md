---
trigger: always_on
description: React Server Components (RSC) とServer Actionsのセキュリティリスク回避およびAPI設計指針
---

# React Server Components (RSC) セキュリティ方針

本文書は、React Server Components (RSC) および "Flight" プロトコルの使用に伴うセキュリティリスクとアーキテクチャ上の制約を回避するための指示書である。
AIはこれを参照し、以下のガイドラインに従って設計・実装を行うこと。

## 1. 基本原則：安全なアーキテクチャの採用

### 🚫 「マジック」なデータフローの禁止

- **原則**: `use server` を用いた Server Actions によるデータフロー（RPC的な関数呼び出し）は、原則として**使用を控える**。
- **理由**: Reactの "Flight" プロトコルは、信頼できないクライアントデータをサーバーの実行コンテキストでデシリアライズするリスクがあるため（参考: CVE-2025-55182）。
- **代替案**: 伝統的かつ堅牢な **REST API** または **GraphQL** を採用し、単純な JSON フォーマットで通信を行うこと。

### 🛡️ 入力の明示的な検証

- サーバーはクライアントからの入力を**一切信頼してはならない**。
- 複雑なオブジェクトのデシリアライズ（コード実行コンテキストを含む可能性のあるもの）は避け、単純なデータ構造（JSON）のみを受け入れる。
- 受信したデータは、必ずスキーマバリデーション（Zod等）を行い、期待する形式であることを検証してから処理する。

## 2. API設計指針

### ✅ 標準的なプロトコルの使用

独自のフレームワーク専用プロトコル（Flight等）ではなく、広く標準化されたプロトコルを使用する。

- **通信形式**: JSON (JavaScript Object Notation)
- **インターフェース**: RESTful API
- **利点**:
  - **ドキュメント化**: OpenAPI (Swagger) 等で記述可能。
  - **互換性**: Web、Mobile、CLI、サードパーティなど、あらゆるクライアントから利用可能。
  - **監視・セキュリティ**: WAFや一般的なHTTP監視ツールで検査可能。

### ❌ 独自エンドポイント (Server Actions) の制限

以下のような `use server` による暗黙的なエンドポイント作成は、プロトタイプや極めて小規模な内部ツールを除き推奨しない。

```javascript
// ❌ 推奨されないパターン
"use server";
async function createPost(data) {
  return await db.posts.create(data); // 独自プロトコル、外部から叩けない、監視困難
}
```

外部連携や将来的な拡張性（Mobileアプリ対応等）が必要な場合は、必ず明示的な API ルート（例: Next.js の Route Handlers）を作成すること。

```javascript
// ✅ 推奨されるパターン (Route Handler)
export async function POST(request: Request) {
    const json = await request.json(); // 単純なJSONとして受け取る
    // バリデーション処理...
    return NextResponse.json(result);
}
```

## 3. 技術選定と疎結合

### 🔗 フロントエンドとバックエンドの分離

- **目的**: バックエンド言語の選択肢（Python, Go, Rust, Java等）を制限しないため。
- **指示**: React (Node.js) にバックエンドロジックを強制的に統合しない。データ処理、機械学習、高負荷な処理が必要な場合は、最適な言語で構築されたバックエンドサービスを利用し、Reactはあくまで「ビューレイヤー」として扱うこと。

## 4. 要約

1. **Serialization**: 実行コンテキストを含むシリアライズ/デシリアライズを行わない。JSONを使う。
2. **API**: `use server` のServer Actionsではなく、標準的なREST APIを構築する。
3. **Architecture**: フレームワークの「便利さ」のために、セキュリティと柔軟性（言語選定の自由）を犠牲にしない。

---

**注意**: この指示は、React/Next.jsの機能を全否定するものではないが、セキュリティと長期的な保守性を最優先する場合、フレームワーク固有の「魔法」への依存を最小限に留め、枯れた技術（HTTP/JSON/REST）を採用するという強い指針である。

**参考資料**:

- [Lessons from React2Shell - DEV Community](https://dev.to/cheetah100/lessons-from-react2shell-1m8b)
