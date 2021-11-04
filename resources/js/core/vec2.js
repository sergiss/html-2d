/*
 * Copyright (c) 2021, Sergio S.- sergi.ss4@gmail.com http://sergiosoriano.com
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 * 
 * 3. Neither the name of the copyright holder nor the names of its
 *    contributors may be used to endorse or promote products derived from
 *    this software without specific prior written permission.
 *    	
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 
 */
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
