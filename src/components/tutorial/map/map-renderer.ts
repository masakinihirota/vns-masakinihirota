/**
 * マップレンダリングのみに特化した Phaser ユーティリティ
 * MainScene から分離
 */

import type { MapConfig } from "./map-config";

export class MapRenderer {
  private scene!: Phaser.Scene;
  private config: MapConfig;
  private tiles: Phaser.GameObjects.Rectangle[][] = [];

  constructor(config: MapConfig) {
    this.config = config;
  }

  /**
   * Phaser Scene を設定
   */
  setScene(scene: Phaser.Scene): void {
    this.scene = scene;
  }

  /**
   * マップをレンダリング
   */
  render(): void {
    if (!this.scene) {
      throw new Error("Scene not set");
    }

    this.createTiles();
    this.addGridLines();
  }

  /**
   * タイルの作成
   */
  private createTiles(): void {
    const { width, height, tileSize, theme } = this.config;
    const colors = theme.tileColor;

    for (let y = 0; y < height; y++) {
      const row: Phaser.GameObjects.Rectangle[] = [];
      for (let x = 0; x < width; x++) {
        // タイル種別を擬似ランダムに決定（シンプルなパターン）
        const tileType = (x + y) % Object.keys(colors).length;
        const color = Object.values(colors)[tileType];

        const tile = this.scene.add.rectangle(
          x * tileSize + tileSize / 2,
          y * tileSize + tileSize / 2,
          tileSize - 2,
          tileSize - 2,
          parseInt(color.replace("#", "0x"), 16)
        );

        tile.setStrokeStyle(1, 0x333333);
        row.push(tile);
      }
      this.tiles.push(row);
    }
  }

  /**
   * グリッド線を追加
   */
  private addGridLines(): void {
    const { width, height, tileSize, theme } = this.config;
    const gridColor = parseInt(theme.gridColor.replace("#", "0x"), 16);

    // 垂直線
    for (let x = 0; x <= width; x++) {
      this.scene.add.line(
        x * tileSize,
        0,
        0,
        0,
        0,
        height * tileSize,
        gridColor,
        0.5
      );
    }

    // 水平線
    for (let y = 0; y <= height; y++) {
      this.scene.add.line(
        0,
        y * tileSize,
        width * tileSize,
        0,
        0,
        0,
        gridColor,
        0.5
      );
    }
  }

  /**
   * マップサイズを取得
   */
  getSize(): {
    width: number;
    height: number;
    pixels: { w: number; h: number };
  } {
    return {
      width: this.config.width,
      height: this.config.height,
      pixels: {
        w: this.config.width * this.config.tileSize,
        h: this.config.height * this.config.tileSize,
      },
    };
  }

  /**
   * タイルを取得
   */
  getTile(x: number, y: number): Phaser.GameObjects.Rectangle | null {
    if (x < 0 || x >= this.tiles.length || y < 0 || y >= this.tiles[0].length) {
      return null;
    }
    return this.tiles[x][y];
  }

  /**
   * 強調表示
   */
  highlightTile(
    x: number,
    y: number,
    color: number,
    duration: number = 500
  ): void {
    const tile = this.getTile(x, y);
    if (tile) {
      const originalFill = tile.fillColor;
      tile.setFillStyle(color);

      setTimeout(() => {
        tile.setFillStyle(originalFill);
      }, duration);
    }
  }
}
