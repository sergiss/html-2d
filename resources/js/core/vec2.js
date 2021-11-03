class Vec2 {
  constructor(x = 0, y = 0) {

    if (x instanceof Vec2) {
        y = x.y;
        x = x.x;
    }

    this.x = x;
    this.y = y;
  }

  set(x, y) {
    if (x instanceof Vec2) {
        y = x.y;
        x = x.x;
    }
    this.x = x;
    this.y = y;
    return this;
  }

  add(x, y) {
    if (x instanceof Vec2) {
        y = x.y;
        x = x.x;
    }
    this.x += x;
    this.y += y;
    return this;
  }

  sub(x, y) {
    if (x instanceof Vec2) {
        y = x.y;
        x = x.x;
    }
    this.x -= x;
    this.y -= y;
    return this;
  }

  scl(x, y) {
    if (x instanceof Vec2) {
        y = x.y;
        x = x.x;
    }
    this.x *= x;
    this.y *= y;
    return this;
  }

  addScl(v, s) {
    this.x += v.x * s;
    this.y += v.y * s;
    return this;
  }

  rotate(sin, cos) {
    if (cos === undefined) {
      cos = Math.cos(sin);
      sin = Math.sin(sin);
    }
    let tmp = this.x;
    this.x = this.x * cos - this.y * sin;
    this.y = tmp * sin + this.y * cos;
    return this;
  }

  dst2(x, y) {
    if (x instanceof Vec2) {
        y = x.y;
        x = x.x;
    }
    let dx = x - this.x;
    let dy = y - this.y;
    return dx * dx + dy * dy;
  }

  dst(x, y) {
    if (x instanceof Vec2) {
        y = x.y;
        x = x.x;
    }
    return Math.sqrt(this.dst2(x, y));
  }

  len2() {
    return this.x * this.x + this.y * this.y;
  }

  len() {
    return Math.sqrt(this.len2());
  }

  nor() {
    let len = this.len2();
    if (len != 0) {
      len = Math.sqrt(len);
      this.x /= len;
      this.y /= len;
    }
    return this;
  }

  dot(x, y) {
    if (x instanceof Vec2) {
      y = x.y;
      x = x.x;
    }
    return this.x * x + this.y * y;
  }

  setZero() {
    this.x = this.y = 0;
    return this;
  }

  negate() {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }

  copy() {
    return new Vec2(this.x, this.y);
  }

}
