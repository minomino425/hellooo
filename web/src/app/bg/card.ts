import { Container, Graphics, Text, Texture } from "pixi.js";
import CardBg from "./cardBg";
import CardSprite from "./cardSprite";
import CardLabelText from "./cardLabelText";
import CardText from "./cardText";
import { Icon } from "../../../../common/_interface";

export default class Card extends Container {
  bg: CardBg = new CardBg();
  icon: CardSprite;
  qr: CardSprite;
  accountLabel: CardLabelText = new CardLabelText("X(Twitter):", 110, 25);
  account: CardText = new CardText(110, 40);
  companyLabel: CardLabelText = new CardLabelText("Company:", 110, 25 + 53);
  nameLabel: CardLabelText = new CardLabelText("Name:", 110, 25 + 53 * 2);

  /**
   * コンストラクタ
   */
  constructor(icon: Icon | null, iconTexture: Texture, qrTexture: Texture) {
    super();
    this.icon = new CardSprite(25, 20, iconTexture);
    this.qr = new CardSprite(25, 105, qrTexture);
    this.addChild(this.bg);
    this.addChild(this.icon);
    this.addChild(this.qr);
    this.addChild(this.accountLabel);
    this.addChild(this.account);
    this.addChild(this.companyLabel);
    this.addChild(this.nameLabel);
    if (icon) {
      this.account.setText(`@${icon.account}`);
    }
    this.visible = false;
  }

  /**
   * 表示演出
   * @param delay
   */
  show(delay: number) {
    setTimeout(() => {
      this.bg.color = "orange";
      this.visible = true;
      this.accountLabel.show();
      this.account.show();
      this.companyLabel.show();
      this.nameLabel.show();
      setTimeout(() => {
        this.bg.color = "white";
      }, 50);
    }, delay * 1000);
  }
}
