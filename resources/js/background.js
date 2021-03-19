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
function Background() {

    this.layers = {};

    this.addLayer = function(id, image, x, y, width, height, scale, ratioX, ratioY, offsetX, offsetY, paddingX, paddingY) {
        this.layers[id] = {
            image: image,
            x: x,
            y: y,
            width: width,
            height: height,
            scale: scale,
            ratioX: ratioX,
            ratioY: ratioY,
            offsetX: offsetX,
            offsetY: offsetY,
            paddingX: paddingX,
            paddingY: paddingY
        }
    }

    this.removeLayer = function(id) {
        let tmp = this.layers[id];
        delete this.layers[id];
        return tmp;
    }

    this.render = function(camera) {

        let viewport = camera.viewport;

        let vw = viewport.getWidth();
        let vh = viewport.getHeight();

        for (var key in this.layers) {
            let layer = this.layers[key];
            let width = layer.width * layer.scale;
            let height = layer.height * layer.scale;

            let lw = width + layer.paddingX * layer.scale;
            let lh = height + layer.paddingY * layer.scale;

            let currentX = -(camera.position.x * layer.ratioX + layer.offsetX) % lw;
            let y = -(camera.position.y * layer.ratioY - vh * 0.5 + layer.offsetY + height) % lh;

            do {
                let currentY = y;
                do {
                    camera.context.drawImage(layer.image, layer.x, layer.y, layer.width, layer.height, currentX + viewport.x1, currentY + viewport.y1, width, height);
                    currentY += lh;
                } while (currentY < vh);
                currentX += lw;
            } while (currentX < vw);

        }
    }

}