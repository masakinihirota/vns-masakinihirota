/**
 * テスト実行時間の最適化を検証するスクリプト
 *
 * このスクリプトは、異なるテスト実行設定での実行時間を比較し、
 * 最適な設定を見つけるのに役立ちます。
 *
 * 要件6.1, 6.3に基づいて実装されています。
 */

const { execSync } = require('child_process');
const chalk = require('chalk');

// 実行時間を測定する関数
function measureExecutionTime(command) {
  console.log(chalk.blue(`実行コマンド: ${command}`));

  const startTime = Date.now();
  try {
    execSync(command, { stdio: 'inherit' });
    const endTime = Date.now();
    const executionTime = (endTime - startTime) / 1000;
    return executionTime;
  } catch (error) {
    const endTime = Date.now();
    const executionTime = (endTime - startTime) / 1000;
    console.error(chalk.red(`コマンド実行エラー: ${error.message}`));
    return executionTime;
  }
}

// 異なる設定での実行時間を比較
async function compareTestConfigurations() {
  console.log(chalk.green('=== テスト実行時間の最適化検証 ==='));

  // 単体テストの実行時間
  console.log(chalk.yellow('\n単体テストの実行時間:'));
  const unitTestTime = measureExecutionTime('npm run test:unit');
  console.log(chalk.green(`実行時間: ${unitTestTime.toFixed(2)}秒`));

  // 統合テストの実行時間
  console.log(chalk.yellow('\n統合テストの実行時間:'));
  const integrationTestTime = measureExecutionTime('npm run test:integration');
  console.log(chalk.green(`実行時間: ${integrationTestTime.toFixed(2)}秒`));

  // 並列実行の実行時間
  console.log(chalk.yellow('\n並列実行の実行時間:'));
  const parallelTestTime = measureExecutionTime('npm run test:parallel');
  console.log(chalk.green(`実行時間: ${parallelTestTime.toFixed(2)}秒`));

  // 通常実行の実行時間
  console.log(chalk.yellow('\n通常実行の実行時間:'));
  const normalTestTime = measureExecutionTime('npm run test');
  console.log(chalk.green(`実行時間: ${normalTestTime.toFixed(2)}秒`));

  // 結果の比較
  console.log(chalk.green('\n=== 実行時間の比較 ==='));
  console.log(`単体テスト: ${unitTestTime.toFixed(2)}秒`);
  console.log(`統合テスト: ${integrationTestTime.toFixed(2)}秒`);
  console.log(`並列実行: ${parallelTestTime.toFixed(2)}秒`);
  console.log(`通常実行: ${normalTestTime.toFixed(2)}秒`);

  // 最適な設定の提案
  const speedup = normalTestTime / parallelTestTime;
  console.log(chalk.green(`\n並列実行による高速化: ${speedup.toFixed(2)}倍`));

  if (speedup > 1.5) {
    console.log(chalk.green('推奨設定: 並列実行 (test:parallel)'));
  } else {
    console.log(chalk.yellow('推奨設定: 通常実行 (test)'));
  }
}

// スクリプトの実行
compareTestConfigurations().catch(error => {
  console.error(chalk.red(`エラーが発生しました: ${error.message}`));
  process.exit(1);
});
