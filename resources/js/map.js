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
function Map(root, map) {

    this.objects = {};

    this.toObject = function(o) {
        if (o.type == "") {
            o.getProperty = function(key) {
                if (o.properties == undefined) return null;
                for (let i = 0; i < o.properties.length; ++i) {
                    let property = o.properties[i];
                    if (key == property.name) {
                        return property.value;
                    }
                }
            };
            return o;
        } else {
            console.log("Warning!!!, unmaped object: " + o);
            return null;
        }
    }

    var request = new XMLHttpRequest();
    request.open('GET', root + map, false);
    request.send();

    if (request.status == 200) {
        let text = request.responseText.replace(".tsx", ".json");
        let json = JSON.parse(text);
        this.tileSize = json.tilewidth;
        this.width = json.width;
        this.height = json.height;
        this.layerMap = {};
        this.layerList = [];
        let n = json.layers.length;
        for (let index = 0, i = 0; i < n; ++i) {
            let tmp = json.layers[i];
            if (tmp.type == "tilelayer") {
                let layer = {
                    id: tmp.id,
                    name: tmp.name,
                    visible: tmp.visible,
                    data: tmp.data
                };
                for (let j = 0; j < layer.data.length; ++j) {
                    layer.data[j]--;
                }
                this.layerList[index++] = this.layerMap[layer.name] = layer;
            } else if (tmp.type == "objectgroup") {
                let objs = tmp.objects;
                for (let i = 0; i < objs.length; ++i) {
                    let tmp = objs[i];
                    let list = this.objects[tmp.name];
                    if (list == undefined) {
                        list = [];
                        this.objects[tmp.name] = list;
                    }
                    let object = this.toObject(tmp);
                    list.push(object);
                }
            }
        }

        let tmp = json.tilesets[0].source;
        request = new XMLHttpRequest();
        request.open('GET', root + tmp, false);
        request.send();

        if (request.status == 200) {
            this.tileset = JSON.parse(request.responseText);
            this.img = document.createElement("img");
            this.img.src = root + this.tileset.image;
        }
    }

    this.render = function(camera) {
        let viewport = camera.viewport;
        let ts = this.tileset.tilewidth;
        for (let i = 0; i < this.layerList.length; ++i) {
            if (this.layerList[i].visible) {
                let data = this.layerList[i].data;
                for (let y = 0; y < this.height; ++y) {
                    let index = y * this.width;
                    for (let x = 0; x < this.width; ++x) {
                        let v = data[index + x];
                        let wx = x * ts;
                        let wy = y * ts;
                        if (v > -1 &&
                            wx + ts > viewport.x1 &&
                            wy + ts > viewport.y1 &&
                            wx < viewport.x2 &&
                            wy < viewport.y2) {
                            let c = v % this.tileset.columns;
                            let r = Math.floor(v / this.tileset.columns);
                            let sx = this.tileset.margin + c * (ts + this.tileset.spacing);
                            let sy = this.tileset.margin + r * (ts + this.tileset.spacing);
                            camera.context.drawImage(this.img,
                                sx, sy,
                                ts, ts,
                                wx, wy,
                                ts + 0.4, ts + 0.4); // + 0.4 Fix firefox float point error
                        }
                    }
                }
            }
        }
    }

    this.getTile = function(x, y, layer) {
        let index = y * this.width + x;
        if (layer === undefined) {
            for (let i = this.layerList.length - 1; i > -1; --i) {
                let value = this.layerList[i].data[index];
                if (value > 0) return value;
            }
            return -1;
        }
        return this.layerMap[layer].data[index];
    }

    this.setTile = function(tile, x, y, layer) {
        this.layers[layer].data[y * this.width + x] = tile;
    }

    this.getSize = function() {
        let ts = this.tileset.tilewidth;
        return {
            width: this.width * ts,
            height: this.height * ts
        };
    }

}