// @ts-nocheck
import { createClient } from "@/lib/supabase/client";

interface PlayerPosition {
  y: number;
}

import {
  INITIAL_MAP_LAYOUT,
  MAP_ENTITIES,
  MAP_HEIGHT,
  MAP_WIDTH,
  SPAWN_POINT,
  TILE_COLORS,
  TILE_SIZE,
} from "../constants";

export const createMainSceneClass = async () => {
  const PhaserLib = (await import("phaser")).default;

  return class MainScene extends PhaserLib.Scene {
    supabase = createClient();
    myPlayer!: Phaser.GameObjects.Container;
    otherPlayers: Map<string, Phaser.GameObjects.Container> = new Map();
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    myId: string;
    channel: ReturnType<typeof this.supabase.channel> | null = null;
    lastSentPosition: { x: number; y: number } | null = null;
    onUpdateState:
      | ((state: {
          x: number;
          y: number;
          hasMap?: boolean;
          dialog?: any;
        }) => void)
      | null = null;
    hasMap: boolean = false;
    entitySprites: Map<
      string,
      Phaser.GameObjects.Sprite | Phaser.GameObjects.Container
    > = new Map();
    contactedEntities: Set<string> = new Set(); // 接触済みエンティティ（離れるまで再トリガーしない）

    constructor() {
      super({ key: "MainScene" });
      this.myId = Math.random().toString(36).substring(7);
    }

    setUpdateCallback(
      fn: (state: {
        x: number;
        y: number;
        hasMap?: boolean;
        dialog?: any;
      }) => void
    ) {
      this.onUpdateState = fn;
    }

    preload() {
      // No assets to preload for now
    }

    create() {
      // 1. Create Tile Map
      this.createMap();

      // 2. Create Entity Sprites
      this.createEntitySprites();

      // 3. Create My Player (Ghost representation)
      this.myPlayer = this.createGhostAvatar(
        SPAWN_POINT.x,
        SPAWN_POINT.y,
        0xffffff
      );

      // 4. Fixed Camera (No follow)
      this.cameras.main.setZoom(1);
      // No startFollow - camera is fixed
      this.physics.world.setBounds(
        0,
        0,
        MAP_WIDTH * TILE_SIZE,
        MAP_HEIGHT * TILE_SIZE
      );

      // 5. Setup Controls
      if (this.input.keyboard) {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.addCapture([
          PhaserLib.Input.Keyboard.KeyCodes.UP,
          PhaserLib.Input.Keyboard.KeyCodes.DOWN,
          PhaserLib.Input.Keyboard.KeyCodes.LEFT,
          PhaserLib.Input.Keyboard.KeyCodes.RIGHT,
        ]);
        this.input.keyboard.enabled = true;
      }

      // Focus on canvas when clicked
      this.input.on("pointerdown", () => {
        if (this.input.keyboard) {
          this.input.keyboard.enabled = true;
        }
      });

      // 6. Setup Supabase Realtime
      this.setupRealtime();

      // 7. UI Text
      this.add
        .text(16, 16, "Arrow keys to move\nHold SHIFT to Run", {
          fontSize: "14px",
          color: "#ffffff",
          backgroundColor: "#00000088",
          padding: { x: 4, y: 4 },
        })
        .setScrollFactor(0)
        .setDepth(100);
    }

    createEntitySprites() {
      MAP_ENTITIES.forEach((entity) => {
        const x = entity.position.x * TILE_SIZE;
        const y = entity.position.y * TILE_SIZE;

        let sprite: Phaser.GameObjects.Text;

        // Use emoji/text for entities
        const emojiMap: Record<string, string> = {
          king: "👑",
          market: "🏪",
          tavern: "🍺",
          bbs: "📋",
          npc: "👤",
          item: "🗺️",
          door: "🚪",
        };

        const emoji = emojiMap[entity.type] || "❓";
        sprite = this.add
          .text(x, y, emoji, {
            fontSize: "24px",
          })
          .setOrigin(0.5);
        sprite.setDepth(50);

        // Store reference
        this.entitySprites.set(entity.id, sprite);

        // Add physics body for overlap detection
        this.physics.add.existing(sprite, true); // static body
      });
    }

    checkEntityContact() {
      const playerX = this.myPlayer.x;
      const playerY = this.myPlayer.y;
      const contactRadius = TILE_SIZE * 0.75;

      // 現在接触中のエンティティを追跡
      const currentlyTouching = new Set<string>();

      for (const entity of MAP_ENTITIES) {
        const entityX = entity.position.x * TILE_SIZE;
        const entityY = entity.position.y * TILE_SIZE;

        const dx = playerX - entityX;
        const dy = playerY - entityY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < contactRadius) {
          currentlyTouching.add(entity.id);

          // まだ接触処理していなければ実行
          if (!this.contactedEntities.has(entity.id)) {
            this.contactedEntities.add(entity.id);
            this.handleEntityContact(entity);
          }
        }
      }

      // 離れたエンティティはセットから削除（再接触可能に）
      for (const id of this.contactedEntities) {
        if (!currentlyTouching.has(id)) {
          this.contactedEntities.delete(id);
        }
      }
    }

    handleEntityContact(entity: (typeof MAP_ENTITIES)[0]) {
      if (entity.type === "item" && entity.id === "map_item" && !this.hasMap) {
        // Pickup map item
        this.hasMap = true;
        const sprite = this.entitySprites.get(entity.id);
        if (sprite) sprite.destroy();
        this.entitySprites.delete(entity.id);

        // Notify React
        if (this.onUpdateState) {
          this.onUpdateState({
            x: this.myPlayer.x,
            y: this.myPlayer.y,
            hasMap: true,
            dialog: {
              show: true,
              title: "アイテム取得",
              message:
                "「古びた地図」を手に入れた！\nコンパス機能が使えるようになりました。",
            },
          });
        }
      } else {
        // Trigger dialog for other entities
        if (this.onUpdateState) {
          const dialogMessages: Record<
            string,
            { title: string; message: string }
          > = {
            king: {
              title: "女王",
              message: "おお、迷える幽霊よ。そなたはまだ顔を持たぬようだな。",
            },
            market: {
              title: "商人",
              message:
                "いらっしゃい！何をお探しかな？（幽霊には売れないが...）",
            },
            tavern: {
              title: "酒場のマスター",
              message: "やあ、ゆっくりしていきな。",
            },
            bbs: {
              title: "掲示板",
              message: "『冒険者求む！』『迷子の猫探してます』",
            },
            npc: { title: entity.name, message: "（話しかけてきた...）" },
            door: { title: entity.name, message: "ここから中に入れそうだ。" },
          };

          const dialog = dialogMessages[entity.type] || {
            title: entity.name,
            message: "...",
          };
          this.onUpdateState({
            x: this.myPlayer.x,
            y: this.myPlayer.y,
            dialog: { show: true, ...dialog },
          });
        }
      }
    }

    update() {
      if (!this.cursors || !this.myPlayer) return;

      const baseSpeed = 200;
      const runSpeed = 400;
      const isRunning = this.cursors.shift?.isDown;
      const speed = isRunning ? runSpeed : baseSpeed;

      const body = this.myPlayer.body as Phaser.Physics.Arcade.Body;

      // Reset velocity
      if (body) {
        body.setVelocity(0);

        if (this.cursors.left.isDown) {
          body.setVelocityX(-speed);
        } else if (this.cursors.right.isDown) {
          body.setVelocityX(speed);
        }

        if (this.cursors.up.isDown) {
          body.setVelocityY(-speed);
        } else if (this.cursors.down.isDown) {
          body.setVelocityY(speed);
        }

        // Send updates if moved significantly
        if (body.velocity.x !== 0 || body.velocity.y !== 0) {
          this.broadcastPosition();
        }

        // Sync to React
        if (this.onUpdateState) {
          this.onUpdateState({ x: this.myPlayer.x, y: this.myPlayer.y });
        }

        // Check for entity contact
        this.checkEntityContact();
      }
    }

    setupRealtime() {
      this.channel = this.supabase.channel("room_ghost_town");

      this.channel
        .on("broadcast", { event: "player-move" }, (payload) => {
          const { userId, x, y } = payload.payload as PlayerPosition;
          if (userId !== this.myId) {
            this.updateOtherPlayer(userId, x, y);
          }
        })
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            // console.log("Connected to Supabase Realtime");
          }
        });
    }

    broadcastPosition() {
      if (!this.channel) return;

      const x = this.myPlayer.x;
      const y = this.myPlayer.y;

      // Throttle
      if (
        this.lastSentPosition &&
        Math.abs(this.lastSentPosition.x - x) < 2 &&
        Math.abs(this.lastSentPosition.y - y) < 2
      ) {
        return;
      }

      void this.channel.send({
        type: "broadcast",
        event: "player-move",
        payload: { userId: this.myId, x, y },
      });

      this.lastSentPosition = { x, y };
    }

    updateOtherPlayer(userId: string, x: number, y: number) {
      let other = this.otherPlayers.get(userId);

      if (!other) {
        other = this.createGhostAvatar(x, y, 0xaaaaaa);
        this.otherPlayers.set(userId, other);
      }

      this.tweens.add({
        targets: other,
        x: x,
        y: y,
        duration: 100,
        ease: "Linear",
      });
    }

    createGhostAvatar(x: number, y: number, color: number) {
      const container = this.add.container(x, y);

      // Body (Circle top)
      const head = this.add.circle(0, -10, 15, color);

      // Body (Rect bottom)
      const body = this.add.rectangle(0, 5, 30, 20, color);

      // Eyes
      const leftEye = this.add.circle(-6, -12, 2, 0x000000);
      const rightEye = this.add.circle(6, -12, 2, 0x000000);

      container.add([head, body, leftEye, rightEye]);
      container.setSize(30, 40);

      this.physics.add.existing(
        container as unknown as Phaser.GameObjects.GameObject
      );

      // Collision bounds
      const pBody = container.body as Phaser.Physics.Arcade.Body;
      pBody.setCollideWorldBounds(true);

      return container;
    }

    createMap() {
      INITIAL_MAP_LAYOUT.forEach((row, y) => {
        row.forEach((tileType, x) => {
          const color = TILE_COLORS[tileType];
          this.add
            .rectangle(
              x * TILE_SIZE + TILE_SIZE / 2,
              y * TILE_SIZE + TILE_SIZE / 2,
              TILE_SIZE,
              TILE_SIZE,
              color
            )
            .setStrokeStyle(1, 0x000000, 0.1); // Subtle border
        });
      });

      // Add Zone Labels
      this.addZoneLabel(4, 4, "Summoning\nRoom");
      this.addZoneLabel(8.5, 4, "Shrine");
      this.addZoneLabel(4, 9, "Mask\nMaker");
      this.addZoneLabel(23.5, 5.5, "Market");
      this.addZoneLabel(23.5, 14.5, "Tavern");
      this.addZoneLabel(6.5, 15, "BBS Plaza");
    }

    addZoneLabel(x: number, y: number, text: string) {
      this.add
        .text(x * TILE_SIZE, y * TILE_SIZE, text, {
          fontSize: "14px",
          color: "#ffffff",
          align: "center",
          stroke: "#000000",
          strokeThickness: 3,
        })
        .setOrigin(0.5);
    }
  };
};
