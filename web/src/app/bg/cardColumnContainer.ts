import { Container, Graphics, Text, Texture } from "pixi.js";
import CardBg from "./cardBg";
import Card from "./card";

export default class CardColumnContainer extends Container {
  cards: Card[] = [];
  direction: number = 1;
  scroll: number = 0;
  scrollSpeed: number = 0.003;
  requestAnimationFrameId: number = 0;
  iconTexture: Texture;
  qrTexture: Texture;

  /**
   * コンストラクタ
   */
  constructor(direction: number = 1, iconTexture: Texture, qrTexture: Texture) {
    super();
    this.direction = direction;
    this.iconTexture = iconTexture;
    this.qrTexture = qrTexture;
    this.update();
  }

  /**
   * 更新
   */
  update = () => {
    this.scroll += this.scrollSpeed * this.direction;
    const margin = 10;
    const maxScroll = (CardBg.HEIGHT + margin) * this.cards.length;
    this.cards.forEach((card, y) => {
      if (this.scroll > 0) {
        card.y =
          (((y + this.scroll) % this.cards.length) - 2) *
          (CardBg.HEIGHT + margin);
      } else {
        let y_ = y + this.scroll;
        while (y_ < 0) y_ += this.cards.length;
        y_ -= 2;
        card.y = y_ * (CardBg.HEIGHT + margin);
      }
    });
    this.requestAnimationFrameId = window.requestAnimationFrame(this.update);
  };

  /**
   * 破棄
   */
  destroy() {
    window.cancelAnimationFrame(this.requestAnimationFrameId);
    super.destroy();
  }

  /**
   * カードを再生成
   */
  reset = () => {
    const wh = window.innerHeight;

    // いったん全てのカードを削除
    this.cards.forEach((card) => this.removeChild(card));
    this.cards = [];

    // カードを再生成
    const margin = 10;
    const numRows = wh / (CardBg.HEIGHT + margin) + 2;
    for (let y = 0; y < numRows; y++) {
      const card = new Card(this.iconTexture, this.qrTexture);
      const delay = (this.direction > 0 ? y : numRows - y) * 0.035;
      card.show(delay);
      this.addChild(card);
      this.cards.push(card);
    }
    window.cancelAnimationFrame(this.requestAnimationFrameId);
    this.update();
  };
}
