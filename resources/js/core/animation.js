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
function Animation(img, coords, tw, th, frameStart, frameEnd, offX, offY) {

    this.img = img;
    this.coords = coords;
    this.tw = tw;
    this.th = th;
    this.frameStart = frameStart == undefined ? 0 : frameStart;
    this.frameIndex = this.frameStart;
    this.frameEnd = frameEnd == undefined ? coords.length : frameEnd;
    this.offX = offX == undefined ? 0 : offX;
    this.offY = offY == undefined ? 0 : offY;

    this.currentTime = 0;
    this.frameTime = 0.1;
    this.scale = new Vec2(1, 1);

    this.render = function(x, y, ctx) {
        if (this.coords) {
            let coord = this.coords[this.frameIndex];
            ctx.save();
            if (this.flipHorizontal) {
                ctx.translate(this.tw * 0.5 - this.offX, 0);
                ctx.scale(-1, 1);
                x = -x;
            } else {
                x -= this.tw * 0.5 - this.offX;
            }
            if (this.flipVertical) {
                ctx.translate(0, this.th * 0.5 - this.offY);
                ctx.scale(1, -1);
                y = -y;
            } else {
                y -= this.th * 0.5 - this.offY;
            }
            ctx.drawImage(this.img, coord.x, coord.y, this.tw, this.th, x, y, this.tw * this.scale.x, this.th * this.scale.y);
            ctx.restore();
        }
    }

    this.update = function(dt) {
        this.currentTime += dt;
        if (this.currentTime >= this.frameTime) {
            this.currentTime -= this.frameTime;
            this.frameIndex++;
            if (this.frameIndex > this.frameEnd) {
                this.frameIndex = this.frameStart;
            }
        }
    }

    this.restart = function() {
        this.frameIndex = this.frameStart;
        this.currentTime = 0;
    }

    this.getWidth = function() {
        return this.tw * this.scale.x;
    }

    this.getHeight = function() {
        return this.th * this.scale.y;
    }

}

var createAnimation = function(img, cols, rows, frameStart, frameEnd, offX, offY) {
    let coords = [];
    let tw = img.width / cols;
    let th = img.height / rows;
    for (let j, i = 0; i < cols; ++i) {
        for (j = 0; j < rows; ++j) {
            coords[j * cols + i] = new Vec2(i * tw, j * th);
        }
    }
    return new Animation(img, coords, tw, th, frameStart, frameEnd, offX, offY);
}