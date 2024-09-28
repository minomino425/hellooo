import { Text } from "pixi.js";

export default class CardLabelText extends Text {
  /**
   * コンストラクタ
   */
  constructor(text: string, x: number, y: number) {
    super({
      style: {
        fontFamily: "sans-serif",
        letterSpacing: 0.5,
        fontSize: 7,
      },
    });
    this.text = text;
    this.x = x;
    this.y = y;
  }
}
