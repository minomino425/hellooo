import { gsap } from "gsap";
import { Container, Point } from "pixi.js";
import CardBg from "./cardBg";
import { FlipMask } from "./flipMask";
import Card from "./card";

/**
 * 線文p1p2上に点p3から垂線を下ろしたときの交点を求める
 * @param p1
 * @param p2
 * @param p3
 * @returns
 */
function findPerpendicularPoint(p1: Point, p2: Point, p3: Point): Point {
  // A, B, P はそれぞれ { x: 数値, y: 数値 } の形式
  const { x: x1, y: y1 } = p1;
  const { x: x2, y: y2 } = p2;
  const { x: px, y: py } = p3;

  // 線分ABの方向ベクトル
  const dx = x2 - x1;
  const dy = y2 - y1;

  // 線分ABの長さの2乗
  const lengthSquared = dx * dx + dy * dy;

  // 線分AB上に点Pを射影した比率tを計算
  const t = ((px - x1) * dx + (py - y1) * dy) / lengthSquared;

  // tが[0, 1]の範囲内なら交点は線分AB上にある
  const tClamped = Math.max(0, Math.min(1, t));

  // 射影点（交点p）の座標を計算
  const pxProjection = x1 + tClamped * dx;
  const pyProjection = y1 + tClamped * dy;

  return new Point(pxProjection, pyProjection);
}

export class FlipBackSide extends Container {
  static readonly DISTANCE = Math.sqrt(CardBg.WIDTH ** 2 + CardBg.HEIGHT ** 2);
  static readonly DIAGONAL_ANGLE = Math.atan2(CardBg.HEIGHT, CardBg.WIDTH); // 対角線の角度
  content: Container;
  flipMask: FlipMask = new FlipMask(CardBg.WIDTH, CardBg.HEIGHT);

  protected _flipAngle: number = Math.PI * -0.5;
  protected _flipPosition: number = 0;
  protected _moveVector: Point = new Point();

  // Debug
  // gp = new Graphics();
  // grb = new Graphics();
  // gwh = new Graphics();
  // End Debug

  /**
   * コンストラクタ
   */
  constructor(content: Container) {
    super();
    this.content = content;
    this.addChild(this.content);
    this.addChild(this.flipMask);
    this.mask = this.flipMask;
    this.flipAngle = this._flipAngle;
    this.flipPosition = this._flipPosition;
    // Debug
    // this.gp.circle(0, 0, 3);
    // this.gp.fill(0xff0000);
    // this.addChild(this.gp);
    // this.grb.circle(0, 0, 3);
    // this.grb.fill(0x00ff00);
    // this.addChild(this.grb);
    // this.gwh.circle(0, 0, 3);
    // this.gwh.fill(0x0000ff);
    // this.addChild(this.gwh);
    // End Debug
  }

  get flipAngle() {
    return this._flipAngle;
  }

  set flipAngle(angle: number) {
    this.flipMask.flipAngle = this._flipAngle = angle;
    this.reset();
  }

  get flipPosition() {
    return this._flipPosition;
  }

  set flipPosition(position: number) {
    this._flipPosition = this.flipMask.flipPosition = position;
    this.reset();
  }

  reset() {
    const w = CardBg.WIDTH;
    const h = CardBg.HEIGHT;
    const maskPoint = new Point(w * this.flipPosition, h * this.flipPosition);
    // maskPointにmaskAngleの角度の線を引いたときに矩形の上辺と交わる点
    const rightTop = new Point(
      maskPoint.x + Math.tan(this._flipAngle + Math.PI) * maskPoint.y,
      0,
    );
    // maskPointにmaskAngleの角度の線を引いたときに矩形の下辺と交わる点
    const rightBottom = new Point(
      maskPoint.x - Math.tan(this._flipAngle + Math.PI) * (h - maskPoint.y),
      h,
    );

    const intersection = findPerpendicularPoint(
      rightBottom,
      rightTop,
      new Point(w, h),
    );
    const a = Math.atan2(intersection.y - h, intersection.x - w);
    const l =
      Math.sqrt((intersection.x - w) ** 2 + (intersection.y - h) ** 2) * 2;
    const p = new Point(w + Math.cos(a) * l, h + Math.sin(a) * l);
    const a2 = Math.atan2(p.y - rightBottom.y, p.x - rightBottom.x);

    // Debug
    // console.log(
    //   `a:${a / Math.PI} l:${l} p.x:${p.x} p.y:${p.y} a2:${a2 / Math.PI}`,
    // );
    // this.gp.position.set(p.x, p.y);
    // this.grb.position.set(rightBottom.x, rightBottom.y);
    // this.gwh.position.set(w, h);
    // End Debug

    this.content.rotation = a2;
    this.content.scale.set(1, -1);
    this.content.pivot.set(w, h);
    this.content.position.set(p.x, p.y);
    // 移動距離と角度を計算
    // this._moveVector.x =
    //   Math.cos(this._flipAngle - FlipBackSide.DIAGONAL_ANGLE) *
    //     -FlipBackSide.DISTANCE +
    //   CardBg.WIDTH;
    // this._moveVector.y =
    //   Math.sin(this._flipAngle - FlipBackSide.DIAGONAL_ANGLE) *
    //     -FlipBackSide.DISTANCE +
    //   CardBg.HEIGHT;
    // const offsetX = Math.cos(this._flipAngle + Math.PI * 0.5) * -CardBg.HEIGHT;
    // const offsetY = Math.sin(this._flipAngle + Math.PI * 0.5) * -CardBg.HEIGHT;
    // this.bg.position.set(
    //   offsetX + this._moveVector.x * this._flipPosition,
    //   offsetY + this._moveVector.y * this._flipPosition,
    // );
  }
}
