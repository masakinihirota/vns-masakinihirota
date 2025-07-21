/**
 * カバレッジレポート分析スクリプト
 *
 * このスクリプトは、Vitestが生成したカバレッジデータを分析し、
 * カバレッジが不足している箇所を特定して詳細なレポートを生成します。
 *
 * 要件7.2, 7.3に基づいて実装
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

// カバレッジデータのパス
const COVERAGE_JSON_PATH = path.join(__dirname, '../coverage/coverage-final.json');

// 閾値設定（vitest.config.tsと同期）
const THRESHOLDS = {
  functions: 90,
  branches: 85,
  lines: 90,
  statements: 90
};

// カバレッジレポート生成
async function generateCoverageReport() {
  console.log(chalk.blue('=== カバレッジ詳細分析レポート ==='));

  try {
    // カバレッジJSONファイルの読み込み
    if (!fs.existsSync(COVERAGE_JSON_PATH)) {
      console.error(chalk.red('エラー: カバレッジデータが見つかりません。先にテストを実行してください。'));
s.exit(1);
    }

    const coverageData = JSON.parse(fs.readFileSync(COVERAGE_JSON_PATH, 'utf8'));

    // 全体の統計情報を計算
    const stats = calculateOverallStats(coverageData);

    // 全体の統計情報を表示
    console.log(chalk.yellow('\n全体のカバレッジ統計:'));
    console.log(`関数カバレッジ: ${formatPercentage(stats.functions)} (閾値: ${THRESHOLDS.functions}%)`);
    console.log(`分岐カバレッジ: ${formatPercentage(stats.branches)} (閾値: ${THRESHOLDS.branches}%)`);
    console.log(`行カバレッジ: ${formatPercentage(stats.lines)} (閾値: ${THRESHOLDS.lines}%)`);
    console.log(`ステートメントカバレッジ: ${formatPercentage(stats.statements)} (閾値: ${THRESHOLDS.statements}%)`);

    // カバレッジが不足しているファイルを特定
    const lowCoverageFiles = findLowCoverageFiles(coverageData);

    if (lowCoverageFiles.length > 0) {
      console.log(chalk.yellow('\nカバレッジが不足しているファイル:'));
      lowCoverageFiles.forEach(file => {
        console.log(chalk.red(`\n${file.path}`));
        console.log(`  関数カバレッジ: ${formatPercentage(file.functions)}`);
        console.log(`  分岐カバレッジ: ${formatPercentage(file.branches)}`);
        console.log(`  行カバレッジ: ${formatPercentage(file.lines)}`);
        console.log(`  ステートメントカバレッジ: ${formatPercentage(file.statements)}`);

        // 未カバーの関数を表示
        if (file.uncoveredFunctions.length > 0) {
          console.log(chalk.yellow('  未カバーの関数:'));
          file.uncoveredFunctions.forEach(fn => {
            console.log(`    - ${fn}`);
          });
        }

        // 未カバーの分岐を表示
        if (file.uncoveredBranches.length > 0) {
          console.log(chalk.yellow('  未カバーの分岐:'));
          file.uncoveredBranches.forEach(branch => {
            console.log(`    - 行 ${branch.line}, 列 ${branch.column}`);
          });
        }
      });

      // 改善提案
      console.log(chalk.yellow('\n改善提案:'));
      console.log('1. 未カバーの関数に対するテストケースを追加してください');
      console.log('2. 条件分岐のテストケースを追加して、すべての分岐パスをカバーしてください');
      console.log('3. エッジケースと例外処理のテストを追加してください');
    } else {
      console.log(chalk.green('\nすべてのファイルが閾値を満たしています！'));
    }

    // レポートの保存
    const reportPath = path.join(__dirname, '../coverage/detailed-analysis.txt');
    fs.writeFileSync(reportPath, generateTextReport(stats, lowCoverageFiles));
    console.log(chalk.blue(`\n詳細分析レポートが保存されました: ${reportPath}`));

  } catch (error) {
    console.error(chalk.red('エラー: カバレッジレポートの生成中にエラーが発生しました'));
    console.error(error);
    process.exit(1);
  }
}

// 全体の統計情報を計算
function calculateOverallStats(coverageData) {
  let totalStatements = 0;
  let coveredStatements = 0;
  let totalBranches = 0;
  let coveredBranches = 0;
  let totalFunctions = 0;
  let coveredFunctions = 0;
  let totalLines = 0;
  let coveredLines = 0;

  Object.values(coverageData).forEach(file => {
    // ステートメント
    Object.values(file.s).forEach(covered => {
      totalStatements++;
      if (covered > 0) coveredStatements++;
    });

    // 分岐
    if (file.b) {
      Object.values(file.b).forEach(branches => {
        branches.forEach(count => {
          totalBranches++;
          if (count > 0) coveredBranches++;
        });
      });
    }

    // 関数
    Object.values(file.f).forEach(count => {
      totalFunctions++;
      if (count > 0) coveredFunctions++;
    });

    // 行
    Object.values(file.l).forEach(count => {
      totalLines++;
      if (count > 0) coveredLines++;
    });
  });

  return {
    statements: totalStatements > 0 ? (coveredStatements / totalStatements) * 100 : 100,
    branches: totalBranches > 0 ? (coveredBranches / totalBranches) * 100 : 100,
    functions: totalFunctions > 0 ? (coveredFunctions / totalFunctions) * 100 : 100,
    lines: totalLines > 0 ? (coveredLines / totalLines) * 100 : 100
  };
}

// カバレッジが不足しているファイルを特定
function findLowCoverageFiles(coverageData) {
  const lowCoverageFiles = [];

  Object.entries(coverageData).forEach(([filePath, file]) => {
    // ファイルごとの統計を計算
    const totalStatements = Object.keys(file.s).length;
    const coveredStatements = Object.values(file.s).filter(v => v > 0).length;

    const totalBranches = file.b ? Object.values(file.b).flat().length : 0;
    const coveredBranches = file.b ? Object.values(file.b).flat().filter(v => v > 0).length : 0;

    const totalFunctions = Object.keys(file.f).length;
    const coveredFunctions = Object.values(file.f).filter(v => v > 0).length;

    const totalLines = Object.keys(file.l).length;
    const coveredLines = Object.values(file.l).filter(v => v > 0).length;

    // パーセンテージを計算
    const statementsPct = totalStatements > 0 ? (coveredStatements / totalStatements) * 100 : 100;
    const branchesPct = totalBranches > 0 ? (coveredBranches / totalBranches) * 100 : 100;
    const functionsPct = totalFunctions > 0 ? (coveredFunctions / totalFunctions) * 100 : 100;
    const linesPct = totalLines > 0 ? (coveredLines / totalLines) * 100 : 100;

    // 閾値を下回るかチェック
    if (
      statementsPct < THRESHOLDS.statements ||
      branchesPct < THRESHOLDS.branches ||
      functionsPct < THRESHOLDS.functions ||
      linesPct < THRESHOLDS.lines
    ) {
      // 未カバーの関数を特定
      const uncoveredFunctions = [];
      Object.entries(file.f).forEach(([fnId, count]) => {
        if (count === 0 && file.fnMap[fnId]) {
          uncoveredFunctions.push(file.fnMap[fnId].name || `匿名関数 (行 ${file.fnMap[fnId].loc.start.line})`);
        }
      });

      // 未カバーの分岐を特定
      const uncoveredBranches = [];
      if (file.b) {
        Object.entries(file.b).forEach(([brId, counts]) => {
          counts.forEach((count, idx) => {
            if (count === 0 && file.branchMap[brId]) {
              const loc = file.branchMap[brId].locations[idx];
              uncoveredBranches.push({
                line: loc.start.line,
                column: loc.start.column
              });
            }
          });
        });
      }

      lowCoverageFiles.push({
        path: filePath,
        statements: statementsPct,
        branches: branchesPct,
        functions: functionsPct,
        lines: linesPct,
        uncoveredFunctions,
        uncoveredBranches
      });
    }
  });

  // カバレッジが低い順にソート
  return lowCoverageFiles.sort((a, b) => {
    const aAvg = (a.statements + a.branches + a.functions + a.lines) / 4;
    const bAvg = (b.statements + b.branches + b.functions + b.lines) / 4;
    return aAvg - bAvg;
  });
}

// テキストレポートを生成
function generateTextReport(stats, lowCoverageFiles) {
  const now = new Date().toISOString();
  let report = `カバレッジ詳細分析レポート (${now})\n`;
  report += '='.repeat(50) + '\n\n';

  report += '全体のカバレッジ統計:\n';
  report += `関数カバレッジ: ${formatPercentage(stats.functions)} (閾値: ${THRESHOLDS.functions}%)\n`;
  report += `分岐カバレッジ: ${formatPercentage(stats.branches)} (閾値: ${THRESHOLDS.branches}%)\n`;
  report += `行カバレッジ: ${formatPercentage(stats.lines)} (閾値: ${THRESHOLDS.lines}%)\n`;
  report += `ステートメントカバレッジ: ${formatPercentage(stats.statements)} (閾値: ${THRESHOLDS.statements}%)\n\n`;

  if (lowCoverageFiles.length > 0) {
    report += 'カバレッジが不足しているファイル:\n';
    lowCoverageFiles.forEach(file => {
      report += `\n${file.path}\n`;
      report += `  関数カバレッジ: ${formatPercentage(file.functions)}\n`;
      report += `  分岐カバレッジ: ${formatPercentage(file.branches)}\n`;
      report += `  行カバレッジ: ${formatPercentage(file.lines)}\n`;
      report += `  ステートメントカバレッジ: ${formatPercentage(file.statements)}\n`;

      if (file.uncoveredFunctions.length > 0) {
        report += '  未カバーの関数:\n';
        file.uncoveredFunctions.forEach(fn => {
          report += `    - ${fn}\n`;
        });
      }

      if (file.uncoveredBranches.length > 0) {
        report += '  未カバーの分岐:\n';
        file.uncoveredBranches.forEach(branch => {
          report += `    - 行 ${branch.line}, 列 ${branch.column}\n`;
        });
      }
    });

    report += '\n改善提案:\n';
    report += '1. 未カバーの関数に対するテストケースを追加してください\n';
    report += '2. 条件分岐のテストケースを追加して、すべての分岐パスをカバーしてください\n';
    report += '3. エッジケースと例外処理のテストを追加してください\n';
  } else {
    report += 'すべてのファイルが閾値を満たしています！\n';
  }

  return report;
}

// パーセンテージのフォーマット
function formatPercentage(value) {
  const formatted = value.toFixed(2) + '%';
  if (value < 70) return formatted + ' ⚠️';
  if (value >= 100) return formatted + ' ✅';
  return formatted;
}

// スクリプト実行
generateCoverageReport().catch(err => {
  console.error('エラー:', err);
  process.exit(1);
});
