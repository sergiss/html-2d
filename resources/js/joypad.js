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
function Joypad(container) { // keyboard simulator

    let joyCanvas;
    if (!container.joyCanvas) {
        joyCanvas = document.createElement("canvas");
        joyCanvas.id = "joy_canvas";
        joyCanvas.style.position = "absolute";
        joyCanvas.style.width = '100%';
        joyCanvas.style.height = '100%';
        joyCanvas.style.top = 0;
        joyCanvas.style.left = 0;
        container.appendChild(joyCanvas);
        container.joyCanvas = joyCanvas;
    } else {
        joyCanvas = container.joyCanvas;
    }

    let context = joyCanvas.getContext("2d");

    this.control = { x: 0, y: 0, w: 0, h: 0 }
    this.action1 = { x: 0, y: 0, w: 0, h: 0 }

    this.color = 'rgba(128, 128, 128, 0.5)';

    this.touchMap = {};

    let self = this;
    joyCanvas.addEventListener('touchstart', function(e) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            let touch = e.changedTouches[i];
            self.handleTouch(touch, false);
        }
    }, false);

    joyCanvas.addEventListener('touchend', function(e) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            let touch = e.changedTouches[i];
            self.handleTouch(touch, true);
        }
    }, false);

    joyCanvas.addEventListener('touchmove', function(e) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            let touch = e.changedTouches[i];
            self.handleTouch(touch, false);
        }
    }, false);

    this.render = function() {
        joyCanvas.width = joyCanvas.clientWidth;
        joyCanvas.height = joyCanvas.clientHeight;
        // clear 
        let rw = joyCanvas.width;
        let rh = joyCanvas.height;
        context.clearRect(0, 0, rw, rh);

        let size = Math.min(rw, rh);

        this.control.w = size * 0.4;
        this.control.h = this.control.w;
        let offset = this.control.w * 0.2;
        this.control.x = offset;
        this.control.y = rh - (this.control.h + offset);

        context.fillStyle = this.color;
        context.beginPath();
        context.fillRect(this.control.x + this.control.w * 0.5 - this.control.w * 0.1, this.control.y, this.control.w * 0.2, this.control.h);
        context.stroke();

        context.beginPath();
        context.fillRect(this.control.x, this.control.y + this.control.h * 0.5 - this.control.h * 0.1, this.control.w, this.control.h * 0.2);
        context.stroke();

        this.action1.w = size * 0.2;
        this.action1.h = this.action1.w;
        offset = this.action1.w * 0.6;
        this.action1.x = rw - (this.action1.w + offset);
        this.action1.y = rh - (this.action1.h + offset);

        context.beginPath();
        context.arc(this.action1.x + this.action1.w * 0.5, this.action1.y + this.action1.h * 0.5, this.action1.w * 0.7, 0, Math.PI * 2);
        context.fill();

    };
    let id = 0;
    this.handleTouch = function(touch, end) {

        // console.log(touch);

        if (end) {
            let codes = this.touchMap[touch.identifier];
            if (codes) {
                delete this.touchMap[touch.identifier];
                for (let i = 0; i < codes.length; ++i) {
                    if (codes[i])
                        this.listener.onKeyUp({ keyCode: codes[i] });
                }
            }
            return;
        }

        let touchX = touch.clientX;
        let touchY = touch.clientY;

        let x1 = touchX - this.control.x;
        let y1 = touchY - this.control.y;

        if (x1 > 0 && x1 < this.control.w &&
            y1 > 0 && y1 < this.control.h) {
            let codes = this.touchMap[touch.identifier];
            if (codes == undefined) {
                codes = [];
                this.touchMap[touch.identifier] = codes;
            }
            let hw = this.control.w * 0.5;
            let hh = this.control.h * 0.5;

            if (x1 > hw + hw * 0.5) {
                if (!codes[0]) codes[0] = 39; // right
            } else if (x1 < hw * 0.5) {
                if (!codes[1]) codes[1] = 37; // left
            }

            if (y1 > hh + hh * 0.5) {
                if (!codes[2]) codes[2] = 40; // down
            } else if (y1 < hh * 0.5) {
                if (!codes[3]) codes[3] = 38; // up
            }

            for (let i = 0; i < codes.length; ++i) {
                this.listener.onKeyDown({ keyCode: codes[i] });

            }

        } else {

            let x1 = touchX - this.action1.x;
            let y1 = touchY - this.action1.y;

            if (x1 > 0 && x1 < this.action1.w &&
                y1 > 0 && y1 < this.action1.h) {
                let codes = [32];
                this.touchMap[touch.identifier] = codes;
                this.listener.onKeyDown({ keyCode: codes[0] });
            }

        }

    }
}