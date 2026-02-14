---
name: web-design-guidelines
description: Web Interface Guidelinesへの準拠を確認するためにUIコードをレビューします。「UIのレビュー」、「アクセシビリティのチェック」、「デザインの監査」、「UXのレビュー」、「ベストプラクティスに対するサイトのチェック」を求められたときに使用します。
argument-hint: <file-or-pattern>
---

# Web Interface Guidelines

Web Interface Guidelines に準拠しているか、ファイルをレビューします。

## 仕組み (How It Works)

1. 以下のソースURLから最新のガイドラインを取得します
2. 指定されたファイル（またはユーザーにファイル/パターンを尋ねる）を読み取ります
3. 取得したガイドラインのすべてのルールと照らし合わせてチェックします
4. `file:line` 形式で簡潔に結果を出力します

## ガイドラインソース (Guidelines Source)

レビューのたびに最新のガイドラインを取得してください：

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

WebFetch を使用して最新のルールを取得します。取得したコンテンツには、すべてのルールと出力形式の指示が含まれています。

## 使用方法 (Usage)

ユーザーがファイルまたはパターン引数を指定した場合：

1. 上記のソースURLからガイドラインを取得する
2. 指定されたファイルを読み取る
3. 取得したガイドラインのすべてのルールを適用する
4. ガイドラインで指定された形式を使用して結果を出力する

ファイルが指定されていない場合は、どのファイルをレビューするかユーザーに尋ねてください。
