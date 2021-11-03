class Background {

    constructor() {
        this.layers = {};
    }

    addLayer(id, image, x, y, width, height, scale, ratioX, ratioY, offsetX, offsetY, paddingX, paddingY) {
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

    removeLayer(id) {
        let tmp = this.layers[id];
        delete this.layers[id];
        return tmp;
    }

    render(camera) {
     
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