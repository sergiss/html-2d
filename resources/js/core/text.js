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
function Text() {

    this.position = new Vec2();
    this.text = "empty";
    this.color = "#FFF";

    this.font = "Verdana";
    this.size = 5;

    this.offX = 0;
    this.offY = 0;

    this.render = function(camera) {
        camera.context.font = this.size + "px " + this.font;
        if (this.isVisible(camera)) {
            camera.context.fillStyle = this.color;
            let measure = camera.context.measureText(this.text);
            let hw = measure.width * 0.5;
            camera.context.fillText(this.text, this.position.x + this.offX - hw, this.position.y + this.offY);
        }
    }

    this.isVisible = function(camera) {
        let viewport = camera.viewport;
        let measure = camera.context.measureText(this.text);
        let hw = measure.width * 0.5;
        return viewport.x1 < this.position.x + hw &&
            viewport.y1 < this.position.y &&
            viewport.x2 > this.position.x - hw &&
            viewport.y2 > this.position.y;
    }

    this.update = function(dt) {

    }

}

function ScoreText() {
    Text.call(this);
    this.timer = 0;
    this.velocity = 0.25;
    this.update = function(dt) {
        this.timer += dt;
        this.color = brightColor(rndHexColor(), 1.25);
        this.offX = Math.sin(this.timer * 8) * 4;
        this.velocity -= dt * 1.25;
        this.position.y += Math.max(-1.5, this.velocity);
        if (this.timer > 5.0) {
            this.world.removeText(this);
        }
    }
}