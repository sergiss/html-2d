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
const VIRTUAL_WIDTH  = 640;
const VIRTUAL_HEIGHT = 640;

class Camera {

    constructor(canvas, x, y) {

        this.canvas = canvas;

        this.position = new Vec2(x, y);
        this.zoom = 1.0;
        this.rotation = 0.0;

        this.onresize();
        window.addEventListener("resize", this.onresize.bind(this));
    }

    update() {

        this.context.restore();
        this.context.save();

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        let hw = this.canvas.width * 0.5;
        let hh = this.canvas.height * 0.5;
        // hw = Math.round(hw);
        // hh = Math.round(hh);

        this.context.translate(hw, hh);
        this.context.rotate(this.rotation);
        this.context.translate(-hw, -hh);

        this.context.scale(this.zoom, this.zoom);
        let x = hw / this.zoom - this.position.x;
        let y = hh / this.zoom - this.position.y;
        x = Math.round(x * 10.0) / 10.0;
        y = Math.round(y * 10.0) / 10.0;

        this.context.translate(x, y);

        this.viewport = this.computeViewport();
    }

    onresize() {
      
        let w = this.canvas.clientWidth;
        let h = this.canvas.clientHeight;
        if (w > h) {
            this.canvas.width = VIRTUAL_WIDTH;
            this.canvas.height = VIRTUAL_HEIGHT * (h / w);
        } else {
            this.canvas.width = VIRTUAL_WIDTH * (w / h);
            this.canvas.height = VIRTUAL_HEIGHT;
        }
        this.context = this.canvas.getContext('2d');
        this.context.imageSmoothingEnabled = false;
    }

    computeViewport() {

        let w = this.canvas.width / this.zoom;
        let h = this.canvas.height / this.zoom;

        let hw = w * 0.5;
        let hh = h * 0.5;

        let x, y, r = this.rotation;
        if (r != 0) {
            let cos = Math.abs(Math.cos(r));
            let sin = Math.abs(Math.sin(r));
            x = cos * hw + sin * hh;
            y = cos * hh + sin * hw;
        } else {
            x = hw;
            y = hh;
        }

        let x1 = this.position.x - x;
        let y1 = this.position.y - y;
        let x2 = this.position.x + x;
        let y2 = this.position.y + y;
        return {
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            getWidth: function() {
                return x2 - x1;
            },
            getHeight: function() {
                return y2 - y1;
            }
        };
    }

    drawViewport() {
        let viewport = this.computeViewport();
        this.context.beginPath();
        this.context.rect(viewport.x1, viewport.y1, viewport.getWidth(), viewport.getHeight());
        this.context.stroke();
    }

    follow(position, mapSize, dt) {
        let hw = this.canvas.width  * 0.5;
        let hh = this.canvas.height * 0.5;
        if (dt == undefined) {
            dt = 1;
        }
        this.position.x = Math.max(interpolate(this.position.x, position.x, dt), hw / this.zoom);
        this.position.x = Math.min(this.position.x, mapSize.width - hw / this.zoom);
        this.position.y = Math.max(interpolate(this.position.y, position.y, dt), hh / this.zoom);
        this.position.y = Math.min(this.position.y, mapSize.height - hh / this.zoom);
    }

}
