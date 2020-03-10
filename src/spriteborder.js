export default class SpriteBorder {
  constructor(name, x, y) {
      this.name = name;
      this.x = x;
      this.y = y;
      this.w = 50;
      this.h = 50;
  }
  
  draw(ctx, selected) {
      let {name, x, y, w, h} = this;

      if (selected) ctx.strokeStyle = "yellow";
      else ctx.strokeStyle = "white"
      ctx.strokeRect(x, y, w, h);
      ctx.font = "14px sans-serif";
      ctx.fillStyle = "yellow";
      ctx.textBaseline = "top"
      ctx.fillText(name, x+2, y+2);

      //corner
      ctx.strokeStyle = "#DDD";
      ctx.beginPath();
      ctx.moveTo(x+w-4, y+h);
      ctx.lineTo(x+w, y+h-4);
      ctx.stroke();
      ctx.moveTo(x+w-8, y+h);
      ctx.lineTo(x+w, y+h-8);
      ctx.stroke();
  }

  contains(x, y) {
      if (x < this.x) return false;
      if (x > this.x+this.w) return false;
      if (y < this.y) return false;
      if (y > this.y+this.h) return false;
      return true;
  }

  cornerContains(x, y) {
      let right = this.x+this.w;
      let bottom = this.y+this.h;
      if (x < right-9) return false;
      if (x > right) return false;
      if (y < bottom-9) return false;
      if (y > bottom) return false;
      return true;
  }
}

