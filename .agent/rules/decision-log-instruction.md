# Decision Log Protocol (決定ログ運用ルール)

このプロジェクトでは、開発スピードを維持しつつ仕様変更を管理するため、**「決定ログ (Decision Log)」運用**を採用しています。

## 基本指針 (Core Principles)

1. **Single Source of Truth for Changes**: 会話によって決定された「設計書と異なる変更点」は、すべて `decision_log.md` に集約されます。
2. **優先順位 (Priority)**: 仕様に関する情報源の優先順位は以下の通りです。
   `decision_log.md` (最優先) > ユーザーとの直近の会話 > 各種要件定義書・設計書 (`.md`)
3. **ドキュメント更新のタイミング**: 各種設計書の更新は、機能実装の完了時やマイルストーン到達時にまとめて行います。それまでは `decision_log.md` を正とします。

## AIへの指示 (Instructions for AI)

- **仕様確認時**: 作業を開始する前に、必ず `decision_log.md` を確認し、設計書の内容が会話で上書きされていないかチェックしてください。
- **仕様変更時**: ユーザーとの会話で新たな仕様変更が決定した場合は、勝手に設計書を書き換えたり実装を進めたりせず、まず `decision_log.md` にその決定事項を追記・更新してください。
- **コンテキスト維持**: 長期的な記憶として、このファイルを参照し続けてください。

## 決定ログの場所

`C:\Users\hi\.gemini\antigravity\brain\437b14dd-f947-4f9a-a6b8-2b3ef071d3a4\decision_log.md`
