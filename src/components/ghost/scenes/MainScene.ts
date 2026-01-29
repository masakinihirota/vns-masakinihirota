// @ts-nocheck
import { createClient } from "@/lib/supabase/client";

interface PlayerPosition {
  userId: string;
  x: number;
  y: number;
}

export const createMainSceneClass = async () => {
  const PhaserLib = (await import("phaser")).default;

  return class MainScene extends PhaserLib.Scene {
    supabase = createClient();
    myPlayer!: Phaser.GameObjects.Container;
    otherPlayers: Map<string, Phaser.GameObjects.Container> = new Map();
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys; // Use global Phaser type
    myId: string;
    channel: ReturnType<typeof this.supabase.channel> | null = null;
    lastSentPosition: { x: number; y: number } | null = null;

    constructor() {
      super({ key: "MainScene" });
      this.myId = Math.random().toString(36).substring(7); // Temporary ID
    }

    preload() {
      // Determine base URL for assets
      // this.load.setBaseURL(window.location.origin);
    }

    create() {
      // 1. Create Map (Placeholder for now: simple grid)
      this.add
        .grid(400, 300, 800, 600, 32, 32, 0x000000)
        .setAltFillStyle(0x010101)
        .setOutlineStyle(0x222222);

      // 2. Create My Player (Ghost representation)
      this.myPlayer = this.createGhostAvatar(400, 300, 0xffffff);

      // Camera follow
      this.cameras.main.startFollow(this.myPlayer);
      this.cameras.main.setZoom(1);

      // 3. Setup Controls
      if (this.input.keyboard) {
        this.cursors = this.input.keyboard.createCursorKeys();
      }

      // 4. Setup Supabase Realtime
      this.setupRealtime();

      this.add
        .text(16, 16, "Arrow keys to move", {
          fontSize: "18px",
          color: "#ffffff",
        })
        .setScrollFactor(0);
    }

    update() {
      if (!this.cursors || !this.myPlayer) return;

      const speed = 200;
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
  };
};
