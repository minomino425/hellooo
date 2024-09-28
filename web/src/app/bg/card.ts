import { Container, Graphics, Text } from "pixi.js";
import CardBg from "./cardBg";
import CardSprite from "./cardSprite";
import CardLabelText from "./cardLabelText";
import CardText from "./cardText";

export default class Card extends Container {
  bg: CardBg = new CardBg();
  icon: CardSprite = new CardSprite();
  qr: CardSprite = new CardSprite();
  accountLabel: CardLabelText = new CardLabelText("X(Twitter):", 115, 23);
  account: CardText = new CardText(115, 36);
  companyLabel: CardLabelText = new CardLabelText("Company:", 115, 23 + 55);
  nameLabel: CardLabelText = new CardLabelText("Name:", 115, 23 + 55 * 2);

  /**
   * コンストラクタ
   */
  constructor() {
    super();
    this.addChild(this.bg);
    this.addChild(this.icon);
    this.addChild(this.qr);
    this.addChild(this.accountLabel);
    this.addChild(this.account);
    this.addChild(this.companyLabel);
    this.addChild(this.nameLabel);
  }
}
