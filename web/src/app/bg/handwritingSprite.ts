import { Sprite, Texture } from "pixi.js";
import CardBg from "./cardBg";

/**
 * カード全体を覆う手書き画像のスプライト
 */
export default class HandwritingSprite extends Sprite {
  /**
   * コンストラクタ
   * @param texture 手書き画像のテクスチャ
   */
  constructor(texture: Texture) {
    super(texture);
    // カード全体のサイズに合わせる
    this.width = CardBg.WIDTH;  // 350
    this.height = CardBg.HEIGHT; // 197
    // 位置は左上（0, 0）
    this.x = 0;
    this.y = 0;
    // 必要に応じて透明度を調整可能
    // this.alpha = 0.9;
  }
}