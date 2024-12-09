import { Container, Assets } from "pixi.js";
import gsap from "gsap";
import { FlipMask } from "./flipMask";
import { FlipBackSide } from "./flipBackSide";
import FlipSprite from "./flipSprite";

/**
 * コピーのコンテナ
 */
export class Copy extends Container {
  line1?: FlipSprite;
  line2?: FlipSprite;
  line3?: FlipSprite;
  line4?: FlipSprite;

  async load() {
    const l1 = await Assets.load("/images/copy-connect.png");
    const l2 = await Assets.load("/images/copy-everyone.png");
    const l3 = await Assets.load("/images/copy-icon.png");
    const l4 = await Assets.load("/images/copy-small.png");
    this.line1 = new FlipSprite(l1);
    this.line2 = new FlipSprite(l2);
    this.line3 = new FlipSprite(l3);
    this.line4 = new FlipSprite(l4);
    this.line2.position.y = 110;
    this.line3.position.y = 220;
    this.line4.position.y = 350;
    this.addChild(this.line1);
    this.addChild(this.line2);
    this.addChild(this.line3);
    this.addChild(this.line4);
    this.x = 40;
    window.addEventListener("resize", this.onResize);
    this.onResize();
  }

  async show() {
    if (!this.line1 || !this.line2 || !this.line3 || !this.line4) return;
    const delay = 0.25;
    await Promise.all([
      this.line1.show(delay),
      this.line2.show(delay + 0.225),
      this.line3.show(delay + 0.45),
      this.line4.show(delay + 1.2),
    ]);
  }

  onResize = () => {
    this.y = window.innerHeight * 0.5 - 235;
  };
}
