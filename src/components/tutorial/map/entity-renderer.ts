/**
 * エンティティスプライトレンダリング
 * MainScene から分離
 */

import { TILE_SIZE } from "@/components/ghost/constants";
import type { TutorialEvent } from "../events";

export interface EntityVisuals {
  position: { x: number; y: number };
  type: "sprite" | "text" | "shape";
  visualKey?: string;
  sprite?: Phaser.GameObjects.Sprite;
  text?: Phaser.GameObjects.Text;
  shape?: Phaser.GameObjects.Shape;
}

export class EntityRenderer {
  private scene!: Phaser.Scene;
  private entityVisuals: Map<string, EntityVisuals> = new Map();

  setScene(scene: Phaser.Scene): void {
    this.scene = scene;
  }

  /**
   * エンティティをレンダリング
   */
  renderEntity(event: TutorialEvent): EntityVisuals {
    if (!this.scene) {
      throw new Error("Scene not set");
    }

    const pixelX = event.position.x * TILE_SIZE + TILE_SIZE / 2;
    const pixelY = event.position.y * TILE_SIZE + TILE_SIZE / 2;

    let visual: EntityVisuals;

    switch (event.type) {
      case "item":
        visual = this.createItemVisual(pixelX, pixelY, event);
        break;
      case "npc":
        visual = this.createNPCVisual(pixelX, pixelY, event);
        break;
      case "landmark":
        visual = this.createLandmarkVisual(pixelX, pixelY, event);
        break;
      case "trigger-zone":
        visual = this.createTriggerZoneVisual(pixelX, pixelY, event);
        break;
      default:
        visual = this.createDefaultVisual(pixelX, pixelY, event);
    }

    this.entityVisuals.set(event.id, visual);
    return visual;
  }

  /**
   * アイテムビジュアルを作成
   */
  private createItemVisual(
    x: number,
    y: number,
    event: TutorialEvent
  ): EntityVisuals {
    const visual = event.metadata?.visual || "item-icon";
    const scale = event.metadata?.scale || 1;

    // シンプルなアイコン（円形）
    const shape = this.scene.add.circle(x, y, 16 * scale, 0xffd700);
    shape.setStrokeStyle(2, 0xffea00);

    // グロー エフェクト
    if (event.metadata?.particle === "glow") {
      this.addGlowEffect(shape);
    }

    return {
      position: { x, y },
      type: "shape",
      visualKey: visual,
      shape,
    };
  }

  /**
   * NPC ビジュアルを作成
   */
  private createNPCVisual(
    x: number,
    y: number,
    event: TutorialEvent
  ): EntityVisuals {
    // シンプルな NPC 表現（正方形 + ラベル）
    const shape = this.scene.add.rectangle(x, y, 32, 32, 0x6b5b95);
    shape.setStrokeStyle(2, 0x9b8bb5);

    const text = this.scene.add.text(x, y + 40, event.metadata?.name || "NPC", {
      fontSize: "12px",
      color: "#ffffff",
      align: "center",
    });
    text.setOrigin(0.5, 0);

    return {
      position: { x, y },
      type: "shape",
      visualKey: event.metadata?.visual || "npc-avatar",
      shape,
      text,
    };
  }

  /**
   * ランドマークビジュアルを作成
   */
  private createLandmarkVisual(
    x: number,
    y: number,
    event: TutorialEvent
  ): EntityVisuals {
    const scale = event.metadata?.scale || 1.5;

    // ランドマーク（複雑な形状）
    const shape = this.scene.add.star(
      x,
      y,
      5,
      20 * scale,
      10 * scale,
      0x4a7c59
    );
    shape.setStrokeStyle(2, 0x8ba888);

    const text = this.scene.add.text(
      x,
      y - 40,
      event.metadata?.name || "Landmark",
      {
        fontSize: "10px",
        color: "#aabbaa",
        align: "center",
      }
    );
    text.setOrigin(0.5, 1);

    if (event.metadata?.particle === "water-glow") {
      this.addWaterGlowEffect(shape);
    }

    return {
      position: { x, y },
      type: "shape",
      visualKey: event.metadata?.visual || "landmark",
      shape,
      text,
    };
  }

  /**
   * トリガーゾーン ビジュアルを作成
   */
  private createTriggerZoneVisual(
    x: number,
    y: number,
    event: TutorialEvent
  ): EntityVisuals {
    // トリガーゾーン（透明な円）
    const shape = this.scene.add.circle(
      x,
      y,
      (event.triggerDistance || 1) * TILE_SIZE,
      0x4488ff,
      0.1
    );
    shape.setStrokeStyle(2, 0x4488ff, 0.5);

    return {
      position: { x, y },
      type: "shape",
      visualKey: "trigger-zone",
      shape,
    };
  }

  /**
   * デフォルトビジュアルを作成
   */
  private createDefaultVisual(
    x: number,
    y: number,
    event: TutorialEvent
  ): EntityVisuals {
    const shape = this.scene.add.rectangle(x, y, 20, 20, 0xcccccc);
    shape.setStrokeStyle(1, 0x999999);

    return {
      position: { x, y },
      type: "shape",
      visualKey: "default",
      shape,
    };
  }

  /**
   * グロー エフェクトを追加
   */
  private addGlowEffect(shape: Phaser.GameObjects.Shape): void {
    if (this.scene.tweens) {
      this.scene.tweens.add({
        targets: shape,
        alpha: [1, 0.5],
        duration: 1000,
        yoyo: true,
        repeat: -1,
      });
    }
  }

  /**
   * 水の光エフェクトを追加
   */
  private addWaterGlowEffect(shape: Phaser.GameObjects.Shape): void {
    if (this.scene.tweens) {
      this.scene.tweens.add({
        targets: shape,
        scaleX: [1, 1.1],
        scaleY: [1, 1.1],
        duration: 2000,
        yoyo: true,
        repeat: -1,
      });
    }
  }

  /**
   * エンティティビジュアルを取得
   */
  getEntityVisual(entityId: string): EntityVisuals | undefined {
    return this.entityVisuals.get(entityId);
  }

  /**
   * エンティティを削除
   */
  removeEntity(entityId: string): void {
    const visual = this.entityVisuals.get(entityId);
    if (visual) {
      visual.sprite?.destroy();
      visual.text?.destroy();
      visual.shape?.destroy();
      this.entityVisuals.delete(entityId);
    }
  }

  /**
   * 全エンティティを削除
   */
  clear(): void {
    this.entityVisuals.forEach((visual) => {
      visual.sprite?.destroy();
      visual.text?.destroy();
      visual.shape?.destroy();
    });
    this.entityVisuals.clear();
  }
}
