/**
 * カスタムHTMLカバレッジレポートテンプレート
 *
 * このスクリプトは、Vitestのカバレッジレポートをカスタマイズするためのテンプレートを提供します。
 *
 * 要件7.2, 7.3に基づいて実装
 */

module.exports = {
  getTemplate: (data) => {
    const {
      date,
      files,
      totals,
      thresholds
    } = data;

    // ファイルごとのカバレッジ行を生成
    cos = files.map(file => {
      const {
        path,
        statements,
        branches,
        functions,
        lines
      } = file;

      // カバレッジ状態に基づいてクラスを設定
      const getStatusClass = (value, threshold) => {
        if (value < threshold) return 'coverage-low';
        if (value === 100) return 'coverage-full';
        return 'coverage-ok';
      };

      return `
        <tr>
          <td class="file-path">${path}</td>
          <td class="${getStatusClass(statements.pct, thresholds.statements)}">${statements.pct.toFixed(2)}%</td>
          <td class="${getStatusClass(branches.pct, thresholds.branches)}">${branches.pct.toFixed(2)}%</td>
          <td class="${getStatusClass(functions.pct, thresholds.functions)}">${functions.pct.toFixed(2)}%</td>
          <td class="${getStatusClass(lines.pct, thresholds.lines)}">${lines.pct.toFixed(2)}%</td>
        </tr>
      `;
    }).join('');

    // 全体のカバレッジ状態に基づいてクラスを設定
    const getTotalStatusClass = (value, threshold) => {
      if (value < threshold) return 'total-coverage-low';
      if (value === 100) return 'total-coverage-full';
      return 'total-coverage-ok';
    };

    // HTMLテンプレートを返す
    return `
      <!DOCTYPE html>
      <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>テストカバレッジレポート</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }

          h1 {
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 10px;
          }

          .report-meta {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
          }

          .coverage-summary {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }

          .coverage-summary th {
            background-color: #3498db;
            color: white;
            text-align: left;
            padding: 12px;
          }

          .coverage-summary td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
          }

          .file-path {
            font-family: monospace;
            word-break: break-all;
          }

          .coverage-low {
            background-color: #ffcccc;
          }

          .coverage-ok {
            background-color: #ffffcc;
          }

          .coverage-full {
            background-color: #ccffcc;
          }

          .total-row {
            font-weight: bold;
            background-color: #f2f2f2;
          }

          .total-coverage-low {
            background-color: #ff9999;
            font-weight: bold;
          }

          .total-coverage-ok {
            background-color: #ffff99;
            font-weight: bold;
          }

          .total-coverage-full {
            background-color: #99ff99;
            font-weight: bold;
          }

          .threshold-info {
            margin-top: 20px;
            padding: 15px;
            background-color: #e8f4f8;
            border-radius: 5px;
          }

          .threshold-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
          }

          .threshold-table th, .threshold-table td {
            padding: 8px;
            border: 1px solid #ddd;
            text-align: left;
          }

          .threshold-table th {
            background-color: #f2f2f2;
          }

          @media (prefers-color-scheme: dark) {
            body {
              background-color: #1a1a1a;
              color: #f0f0f0;
            }

            h1 {
              color: #e0e0e0;
              border-bottom-color: #4dabf7;
            }

            .report-meta {
              background-color: #2c2c2c;
            }

            .coverage-summary th {
              background-color: #4dabf7;
            }

            .coverage-summary td {
              border-bottom-color: #444;
            }

            .coverage-low {
              background-color: #5c2b2b;
            }

            .coverage-ok {
              background-color: #5c5c2b;
            }

            .coverage-full {
              background-color: #2b5c2b;
            }

            .total-row {
              background-color: #333;
            }

            .total-coverage-low {
              background-color: #803333;
            }

            .total-coverage-ok {
              background-color: #808033;
            }

            .total-coverage-full {
              background-color: #338033;
            }

            .threshold-info {
              background-color: #2c3e50;
            }

            .threshold-table th {
              background-color: #333;
            }

            .threshold-table td, .threshold-table th {
              border-color: #444;
            }
          }
        </style>
      </head>
      <body>
        <h1>テストカバレッジレポート</h1>

        <div class="report-meta">
          <p><strong>生成日時:</strong> ${date}</p>
          <p><strong>ファイル数:</strong> ${files.length}</p>
        </div>

        <h2>カバレッジサマリー</h2>

        <table class="coverage-summary">
          <thead>
            <tr>
              <th>ファイルパス</th>
              <th>ステートメント</th>
              <th>分岐</th>
              <th>関数</th>
              <th>行</th>
            </tr>
          </thead>
          <tbody>
            ${fileRows}
            <tr class="total-row">
              <td>全体</td>
              <td class="${getTotalStatusClass(totals.statements.pct, thresholds.statements)}">${totals.statements.pct.toFixed(2)}%</td>
              <td class="${getTotalStatusClass(totals.branches.pct, thresholds.branches)}">${totals.branches.pct.toFixed(2)}%</td>
              <td class="${getTotalStatusClass(totals.functions.pct, thresholds.functions)}">${totals.functions.pct.toFixed(2)}%</td>
              <td class="${getTotalStatusClass(totals.lines.pct, thresholds.lines)}">${totals.lines.pct.toFixed(2)}%</td>
            </tr>
          </tbody>
        </table>

        <div class="threshold-info">
          <h3>カバレッジ閾値</h3>
          <p>以下の閾値を下回るとテストは失敗します：</p>
          <table class="threshold-table">
            <tr>
              <th>メトリック</th>
              <th>閾値</th>
            </tr>
            <tr>
              <td>ステートメント</td>
              <td>${thresholds.statements}%</td>
            </tr>
            <tr>
              <td>分岐</td>
              <td>${thresholds.branches}%</td>
            </tr>
            <tr>
              <td>関数</td>
              <td>${thresholds.functions}%</td>
            </tr>
            <tr>
              <td>行</td>
              <td>${thresholds.lines}%</td>
            </tr>
          </table>
        </div>
      </body>
      </html>
    `;
  }
};
