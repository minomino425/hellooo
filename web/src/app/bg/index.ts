import { Application } from "pixi.js";
import CardContainer from "./cardContainer";

export default class Bg {
  // Singleton
  static instance: Bg;
  static init() {
    if (!Bg.instance) Bg.instance = new Bg();
  }

  // Instance
  app: Application;
  cardContainer: CardContainer;

  constructor() {
    this.app = new Application();
    this.cardContainer = new CardContainer();
    this.app
      .init({
        background: "#f5f5f5",
        resizeTo: window,
        resolution: window.devicePixelRatio || 1,
      })
      .then(() => {
        this.app.canvas.classList.add("bg");
        document.body.appendChild(this.app.canvas);
        this.app.stage.addChild(this.cardContainer);
      });
  }
}
