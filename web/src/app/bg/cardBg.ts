import { Container, Graphics, Text } from "pixi.js";

export default class CardBg extends Graphics {
  static readonly WIDTH = 350;
  static readonly HEIGHT = 197;
  /**
   * コンストラクタ
   */
  constructor() {
    super();
    this.draw();
  }

  draw(orange: boolean = false) {
    this.clear();
    this.roundRect(0, 0, CardBg.WIDTH, CardBg.HEIGHT, 20);
    this.fill({ color: 0xffffff, alpha: 1 });
  }
}
