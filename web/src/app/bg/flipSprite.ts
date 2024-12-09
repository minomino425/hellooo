import {
  Container,
  Texture,
  Renderer,
  FederatedPointerEvent,
  Sprite,
  Rectangle,
} from "pixi.js";
import gsap from "gsap";
import { FlipMask } from "./flipMask";
import { FlipBackSide } from "./flipBackSide";

/**
 * めくれるエフェクトのコンテナ
 */
export default class FlipSprite extends Container {
  container: Container = new Container();
  sprite: Sprite;
  backSide: FlipBackSide;
  containerMask: FlipMask;

  protected _flipPosition: number = 0.75;
  protected _flipAngle: number = Math.PI * -0.75;

  /**
   * コンストラクタ
   */
  constructor(texture: Texture, resolution: number = 2) {
    super();
    this.sprite = new Sprite(texture);
    this.sprite.scale.set(1 / resolution, 1 / resolution);
    this.sprite.tint = 0x000000;
    const backsideSprite = new Sprite(texture);
    backsideSprite.scale.set(1 / resolution, 1 / resolution);
    backsideSprite.tint = 0xfd5100;
    this.backSide = new FlipBackSide(backsideSprite);
    this.containerMask = new FlipMask(this.sprite.width, this.sprite.height);
    this.container.addChild(this.sprite);
    this.container.addChild(this.containerMask);
    this.container.mask = this.containerMask;
    this.addChild(this.container);
    this.addChild(this.backSide);
    this.visible = false;
    this.flipAngle = this._flipAngle;
    this.flipPosition = this._flipPosition;
    this.interactive = true;
    this.hitArea = new Rectangle(0, 0, this.sprite.width, this.sprite.height);
    this.on("mouseover", this.onMouseOver);
    this.on("mouseout", this.onMouseOut);
  }

  get flipPosition() {
    return this._flipPosition;
  }

  set flipPosition(position: number) {
    this._flipPosition = position;
    this.backSide.flipPosition = position;
    this.containerMask.flipPosition = position;
  }

  get flipAngle() {
    return this._flipAngle;
  }

  set flipAngle(angle: number) {
    this._flipAngle = angle;
    this.backSide.flipAngle = angle;
    this.containerMask.flipAngle = angle;
  }

  /**
   * マウスイベント
   * @param e
   */
  onMouseOver = (e: FederatedPointerEvent) => {
    const mouse = e.getLocalPosition(this);
    // if (mouse.x < this.sprite.width * 0.5) return;
    this.on("mousemove", this.onMouseMove);
    this.parent.addChild(this);
    this.hitArea = new Rectangle(
      0,
      -this.sprite.width * 0.5,
      this.sprite.width,
      this.sprite.width * 0.5 + this.sprite.height * 1.5,
    );
  };

  onMouseMove = (e: FederatedPointerEvent) => {
    const mouse = e.getLocalPosition(this);
    const cx = this.sprite.width;
    const cy = this.sprite.height;
    const d = Math.sqrt((cx - mouse.x) ** 2 + (cy - mouse.y) ** 2);
    let a = Math.atan2(mouse.y - cy, mouse.x - cx) + Math.PI * 0;
    if (a > 0) a -= Math.PI * 2;
    const p = 1 - Math.max(0, Math.min(1, d / this.sprite.width));
    const minFlip = 0.5;
    gsap.to(this, {
      flipPosition: minFlip + p * (1 - minFlip),
      duration: 1.75,
      ease: "expo.out",
    });
    gsap.to(this, {
      flipAngle: Math.max(Math.min(a, Math.PI * -0.55), Math.PI * -0.9999),
      duration: 0.5,
      ease: "expo.out",
    });
  };

  onMouseOut = (e: FederatedPointerEvent) => {
    this.off("mousemove", this.onMouseMove);
    gsap.to(this, {
      flipPosition: 1,
      flipAngle: Math.PI * -0.75,
      duration: 1.5,
      ease: "expo.out",
      overwrite: true,
    });
    this.hitArea = new Rectangle(0, 0, this.sprite.width, this.sprite.height);
  };

  /**
   * 表示演出
   * @param delay
   */
  show(delay: number, duration: number = 1.25) {
    return new Promise((resolve) => {
      // this.visible = true;
      this.flipPosition = 0.001;
      this.flipAngle = Math.PI * -0.9999;
      gsap.to(this, {
        visible: true,
        flipPosition: 1,
        flipAngle: Math.PI * -0.75,
        duration: duration,
        delay: delay,
        ease: "cubic.inOut",
        overwrite: true,
        onComplete: resolve,
      });
      // gsap.to(this, {
      //   flipAngle: Math.PI * -0.75,
      //   duration: 1.5,
      //   delay: delay,
      //   ease: "expo.inOut",
      // });
    });
  }
}
