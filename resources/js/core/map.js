class Map {
    
    constructor(root, map) {    
        this.root = root;
        this.map = map;

        this.objects = {};
        this.layerMap = {};
        this.layerList = [];
    }

    async load() {
    
        let response = await fetch(this.root + this.map);
        let responseText = await response.text();
  
        let text = responseText.replace(".tsx", ".json");
        let json = JSON.parse(text);
        this.tileSize = json.tilewidth;
        this.width  = json.width;
        this.height = json.height;
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

        response = await fetch(this.root + tmp);
        responseText = await response.text();

        this.tileset = JSON.parse(responseText);
        this.img = document.createElement("img");
        this.img.src = this.root + this.tileset.image;

    }

    toObject(o) {
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

    render(camera) {
        const ts = this.tileset.tilewidth;
        for (let i = 0; i < this.layerList.length; ++i) {
            if (this.layerList[i].visible) {
                let data = this.layerList[i].data;
                for (let x, y = 0; y < this.height; ++y) {
                    let index = y * this.width;
                    for (x = 0; x < this.width; ++x) {
                        let v = data[index + x];
                        let wx = x * ts;
                        let wy = y * ts;
                        if (v > -1 &&
                            wx + ts > camera.viewport.x1 &&
                            wy + ts > camera.viewport.y1 &&
                            wx < camera.viewport.x2 &&
                            wy < camera.viewport.y2) {
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

    getTile(x, y, layer) {
        const index = y * this.width + x;
        if (layer === undefined) {
            for (let i = this.layerList.length - 1; i > -1; --i) {
                let value = this.layerList[i].data[index];
                if (value > 0) return value;
            }
            return -1;
        }
        return this.layerMap[layer].data[index];
    }

    setTile(tile, x, y, layer) {
        this.layers[layer].data[y * this.width + x] = tile;
    }

    getSize() {
 
        const ts = this.tileset.tilewidth;
        return {
            width : this.width * ts,
            height: this.height * ts
        };
    }

}