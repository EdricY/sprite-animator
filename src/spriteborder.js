export default class SpriteBorder {
  //TODO: use point instaed of x,y everywhere here.
  constructor(name, x, y) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.w = 50;
    this.h = 50;
    this.ax = x;
    this.ay = y;
  }

  draw(ctx, selected) {
    let { name, x, y, w, h } = this;

    if (selected) ctx.strokeStyle = "yellow";
    else ctx.strokeStyle = "black"
    ctx.lineWidth = 1;
    ctx.strokeRect(x+.5, y+.5, w, h);
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "yellow";
    ctx.textBaseline = "top"
    ctx.fillText(name, x + 2, y + 2);

    //corner
    ctx.strokeStyle = "#DDD";
    ctx.beginPath();
    ctx.moveTo(x + w - 4, y + h);
    ctx.lineTo(x + w,     y + h - 4);
    ctx.stroke();
    ctx.moveTo(x + w - 8, y + h);
    ctx.lineTo(x + w,     y + h - 8);
    ctx.stroke();
    
    //anchor
    ctx.fillStyle = "red";
    ctx.fillRect(ax, ay, 1, 1);
  }

  contains(x, y) {
    if (x < this.x) return false;
    if (x > this.x + this.w) return false;
    if (y < this.y) return false;
    if (y > this.y + this.h) return false;
    return true;
  }

  cornerContains(x, y) {
    let right = this.x + this.w;
    let bottom = this.y + this.h;
    if (x < right - 9) return false;
    if (x > right) return false;
    if (y < bottom - 9) return false;
    if (y > bottom) return false;
    return true;
  }

  toString() {
    return JSON.stringify(this.toFlatObj());
  }

  toFlatObj() {
    return {
      x: this.x,
      y: this.y,
      w: this.w,
      h: this.h,
      ax: this.ax,
      ay: this.ay,
    }
  }
}

