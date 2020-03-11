export default class Point {
  constructor(x, y) {
    this.a = [];
    this.a[0] = x;
    this.a[1] = y;
  }

  get x() {
    return this.a[0];
  }
  set x(x) {
    this.a[0] = x;
  }
  get y() {
    return this.a[1];
  }
  set y(y) {
    this.a[1] = y;
  }

  makeCopy() {
    return new Point(this.x, this.y);
  }
}