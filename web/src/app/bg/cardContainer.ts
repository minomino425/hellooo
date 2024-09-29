import { Container, Graphics } from "pixi.js";
import CardBg from "./cardBg";
import CardColumnContainer from "./cardColumnContainer";

export default class CardContainer extends Container {
  resizeTimer: number = 0;
  container: Container = new Container();
  columns: CardColumnContainer[] = [];

  /**
   * コンストラクタ
   */
  constructor() {
    super();
    this._onResize();
    window.addEventListener("resize", this.onResize);
    this.addChild(this.container);
    this.rotation = 15 * (Math.PI / 180);
  }

  /**
   * リサイズイベント
   */
  onResize = () => {
    if (this.resizeTimer) clearTimeout(this.resizeTimer);
    this.resizeTimer = window.setTimeout(this._onResize, 200);
  };

  /**
   * 実際のリサイズ処理
   */
  protected _onResize = () => {
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    const margin = 10;
    const numColumns = Math.ceil(ww / 2 / (CardBg.WIDTH + margin));

    while (this.columns.length != numColumns) {
      if (this.columns.length < numColumns) {
        const column = new CardColumnContainer(
          this.columns.length % 2 == 0 ? 1 : -1,
        );
        column.x = this.columns.length * (CardBg.WIDTH + margin);
        this.container.addChild(column);
        this.columns.push(column);
      } else if (this.columns.length > numColumns) {
        const column = this.columns.pop()!;
        column.destroy();
        this.container.removeChild(column);
      } else {
        break;
      }
    }

    this.columns.forEach((column) => column.reset());
    this.x = window.innerWidth / 2 + 60;
    this.y = window.innerHeight / 2;
    this.container.y = -this.y;
  };
}
