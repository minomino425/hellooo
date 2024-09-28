import { Text } from "pixi.js";

export default class CardText extends Text {
  /**
   * コンストラクタ
   */
  constructor(x: number, y: number) {
    super({
      style: {
        fontFamily: "sans-serif",
        fontSize: 22,
      },
    });
    this.x = x;
    this.y = y;
    this.text = "Hello";
  }
}
