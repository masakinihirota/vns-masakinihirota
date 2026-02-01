import { createClient } from "@/lib/supabase/client";

interface PlayerPosition {
  userId: string;
  x: number;
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

export interface GhostMainScene extends Phaser.Scene {
  myPlayer: Phaser.GameObjects.Container;
  hasMap: boolean;
  /**
   * プレイヤーを指定したピクセル座標にテレポートさせる
   * @param pixelX - ピクセル座標X
   * @param pixelY - ピクセル座標Y
   */
  teleportToPixel: (pixelX: number, pixelY: number) => void;
  setInputEnabled: (enabled: boolean) => void;
  setUpdateCallback: (
    fn: (state: {
      x: number;
      y: number;
      hasMap?: boolean;
      dialog?: { show: boolean; title: string; message: string };
    }) => void
  ) => void;
}

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
          dialog?: { show: boolean; title: string; message: string };
        }) => void)
      | null = null;
    hasMap: boolean = false;
    entitySprites: Map<
      string,
      | Phaser.GameObjects.Sprite
      | Phaser.GameObjects.Container
      | Phaser.GameObjects.Text
    > = new Map();
    contactedEntities: Set<string> = new Set(); // 接触済みエンティティ（離れるまで再トリガーしない）

    // Movement & State
    targetPosition: { x: number; y: number } | null = null;
    isGhostMode: boolean = false;
    isInputEnabled: boolean = true;
    ghostModeKey!: Phaser.Input.Keyboard.Key;

    constructor() {
      super({ key: "MainScene" });
      this.myId = Math.random().toString(36).substring(7);
    }

    setUpdateCallback(
      fn: (state: {
        x: number;
        y: number;
        hasMap?: boolean;
        dialog?: { show: boolean; title: string; message: string };
      }) => void
    ) {
      this.onUpdateState = fn;
    }

    setInputEnabled(enabled: boolean) {
      this.isInputEnabled = enabled;
      // 無効化された場合、全ての移動状態をクリア
      if (!enabled) {
        this.targetPosition = null;
        if (this.myPlayer?.body) {
          (this.myPlayer.body as Phaser.Physics.Arcade.Body).setVelocity(0, 0);
        }
      }
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
      // Reset position every time (Disable saved position loading)
      const startX = SPAWN_POINT.x;
      const startY = SPAWN_POINT.y;

      /*
      try {
        const savedPos = localStorage.getItem("ghost_map_position");
        if (savedPos) {
          const parsed = JSON.parse(savedPos);
          // Simple validation
          if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
             startX = parsed.x;
             startY = parsed.y;
          }
          if (parsed.hasMap) {
            this.hasMap = true;
          }
        }
      } catch (e) {
        console.error("Failed to load position", e);
      }
      */

      this.myPlayer = this.createGhostAvatar(startX, startY, 0xffffff);

      // 4. Camera Control
      // Smooth follow
      this.cameras.main.startFollow(this.myPlayer, true, 0.09, 0.09);
      this.cameras.main.setZoom(1);

      // Zoom with mouse wheel
      this.input.on(
        "wheel",
        (
          _pointer: unknown,
          _gameObjects: unknown,
          _deltaX: number,
          deltaY: number,
          _deltaZ: number
        ) => {
          const zoom = this.cameras.main.zoom;
          const newZoom = PhaserLib.Math.Clamp(zoom - deltaY * 0.001, 0.5, 2.0);
          this.cameras.main.setZoom(newZoom);
        }
      );

      this.physics.world.setBounds(
        0,
        0,
        MAP_WIDTH * TILE_SIZE,
        MAP_HEIGHT * TILE_SIZE
      );

      // 5. Setup Controls
      if (this.input.keyboard) {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.ghostModeKey = this.input.keyboard.addKey(
          PhaserLib.Input.Keyboard.KeyCodes.G
        );

        this.input.keyboard.addCapture([
          PhaserLib.Input.Keyboard.KeyCodes.UP,
          PhaserLib.Input.Keyboard.KeyCodes.DOWN,
          PhaserLib.Input.Keyboard.KeyCodes.LEFT,
          PhaserLib.Input.Keyboard.KeyCodes.RIGHT,
          PhaserLib.Input.Keyboard.KeyCodes.SPACE,
        ]);
        this.input.keyboard.enabled = true;
      }

      // Click to move & Focus
      this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
        // 入力が無効な場合は完全に無視
        if (!this.isInputEnabled) {
          return;
        }

        // DOM要素のクリックを検出（React UIなど）
        // pointer.event が存在し、target が canvas でない場合は無視
        const event = pointer.event;
        if (event && event.target instanceof HTMLElement) {
          const tagName = event.target.tagName.toLowerCase();
          // canvas以外の要素がクリックされた場合は移動しない
          if (tagName !== "canvas") {
            return;
          }
        }

        if (this.input.keyboard) {
          this.input.keyboard.enabled = true;
        }

        // ワールド座標を移動先として設定
        this.targetPosition = { x: pointer.worldX, y: pointer.worldY };
      });

      // 6. Setup Supabase Realtime
      this.setupRealtime();

      // 7. UI Text
      this.add
        .text(
          16,
          16,
          "Arrow keys / Click to move\nShift: Dash | G: Toggle Ghost Mode\nWheel: Zoom",
          {
            fontSize: "14px",
            color: "#ffffff",
            backgroundColor: "#00000088",
            padding: { x: 4, y: 4 },
          }
        )
        .setScrollFactor(0)
        .setDepth(100);
    }

    createEntitySprites() {
      MAP_ENTITIES.forEach((entity) => {
        // Skip map item if already have map
        if (entity.id === "map_item" && this.hasMap) return;

        const x = entity.position.x * TILE_SIZE;
        const y = entity.position.y * TILE_SIZE;

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
        const sprite = this.add
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

    pendingDialog: { title: string; message: string } | null = null;

    handleEntityContact(entity: (typeof MAP_ENTITIES)[0]) {
      // Stop auto-movement and physics velocity
      this.targetPosition = null;
      if (this.myPlayer?.body) {
        (this.myPlayer.body as Phaser.Physics.Arcade.Body).setVelocity(0);
      }
      if (entity.type === "item" && entity.id === "map_item") {
        if (!this.hasMap) {
          // Pickup map item
          this.hasMap = true;
          const sprite = this.entitySprites.get(entity.id);
          if (sprite) sprite.destroy();
          this.entitySprites.delete(entity.id);

          const dialog = {
            title: "🧭 コンパス機能が解放されました！",
            message:
              "「古びた地図」から魔力を感じます...\n\n画面右上に【コンパスUI】が出現しました。\n行き先を選択すると、針がその方向を指し示します。\n\n広大なゴーストタウンの探索に役立てましょう！",
          };

          // Notify React
          if (this.onUpdateState) {
            this.onUpdateState({
              x: this.myPlayer.x,
              y: this.myPlayer.y,
              hasMap: true,
              dialog: {
                show: true,
                ...dialog,
              },
            });
          } else {
            this.pendingDialog = dialog;
          }
        }
        return;
      }

      // Trigger dialog for other entities
      const dialogMessages: Record<string, { title: string; message: string }> =
        {
          king: {
            title: "女王",
            message: "おお、迷える幽霊よ。そなたはまだ顔を持たぬようだな。",
          },
          market: {
            title: "商人",
            message: "いらっしゃい！何をお探しかな？（幽霊には売れないが...）",
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

      if (this.onUpdateState) {
        this.onUpdateState({
          x: this.myPlayer.x,
          y: this.myPlayer.y,
          dialog: { show: true, ...dialog },
        });
      } else {
        this.pendingDialog = dialog;
      }
    }

    /**
     * プレイヤーを指定したピクセル座標にテレポートさせる
     * @param pixelX - ピクセル座標X
     * @param pixelY - ピクセル座標Y
     */
    teleportToPixel(pixelX: number, pixelY: number) {
      if (!this.myPlayer) return;

      // 移動状態を完全にリセット
      this.targetPosition = null;
      const body = this.myPlayer.body as Phaser.Physics.Arcade.Body;
      if (body) {
        body.setVelocity(0, 0);
        body.stop();
      }

      // プレイヤーを移動
      this.myPlayer.setPosition(pixelX, pixelY);

      // 位置を即座にブロードキャスト
      this.broadcastPosition();
    }

    toggleGhostMode() {
      this.isGhostMode = !this.isGhostMode;
      const body = this.myPlayer.body as Phaser.Physics.Arcade.Body;

      if (this.isGhostMode) {
        this.myPlayer.setAlpha(0.5); // Visual indication
        body.checkCollision.none = true; // Disable world bounds/collision
      } else {
        this.myPlayer.setAlpha(1);
        body.checkCollision.none = false;
      }

      // Notify (optional toast)
      // console.log(`Ghost Mode: ${this.isGhostMode ? "ON" : "OFF"}`);
    }

    update() {
      if (!this.cursors || !this.myPlayer) return;

      const body = this.myPlayer.body as Phaser.Physics.Arcade.Body;

      // Input Lock Check - 移動処理のみをスキップ
      if (this.isInputEnabled && body) {
        // Toggle Ghost Mode
        if (PhaserLib.Input.Keyboard.JustDown(this.ghostModeKey)) {
          this.toggleGhostMode();
        }

        const baseSpeed = 200;
        const runSpeed = 400;
        const isRunning = this.cursors.shift?.isDown;
        const speed = isRunning ? runSpeed : baseSpeed;

        body.setVelocity(0);
        let movedByKey = false;

        // Keyboard Movement
        if (this.cursors.left.isDown) {
          body.setVelocityX(-speed);
          movedByKey = true;
        } else if (this.cursors.right.isDown) {
          body.setVelocityX(speed);
          movedByKey = true;
        }

        if (this.cursors.up.isDown) {
          body.setVelocityY(-speed);
          movedByKey = true;
        } else if (this.cursors.down.isDown) {
          body.setVelocityY(speed);
          movedByKey = true;
        }

        // If keys are pressed, cancel click movement
        if (movedByKey) {
          this.targetPosition = null;
        }
        // Click Movement
        else if (this.targetPosition) {
          const dx = this.targetPosition.x - this.myPlayer.x;
          const dy = this.targetPosition.y - this.myPlayer.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const arrivalThreshold = 5;

          if (distance > arrivalThreshold) {
            this.physics.moveToObject(
              this.myPlayer,
              this.targetPosition,
              speed
            );
          } else {
            // Arrived
            body.setVelocity(0);
            this.targetPosition = null;
          }
        }

        // Send updates if moved significantly
        if (body.velocity.x !== 0 || body.velocity.y !== 0) {
          this.broadcastPosition();
        }
      }

      // 入力ロックに関係なく、状態更新と接触判定は常に行う
      if (this.onUpdateState) {
        const updatePayload: {
          x: number;
          y: number;
          hasMap?: boolean;
          dialog?: { show: boolean; title: string; message: string };
        } = {
          x: this.myPlayer.x,
          y: this.myPlayer.y,
          hasMap: this.hasMap,
        };

        if (this.pendingDialog) {
          updatePayload.dialog = { show: true, ...this.pendingDialog };
          this.pendingDialog = null;
        }

        this.onUpdateState(updatePayload);
      }

      // Check for entity contact - 常に実行
      this.checkEntityContact();
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
