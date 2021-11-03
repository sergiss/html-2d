function load(src, callback) {
  // helper for load content
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    if (xhr.status == 200) {
      callback(this.responseText);
    }
  };
  xhr.open("GET", src, true);
  xhr.send();
}

function map(value, fromMin, fromMax, toMin, toMax) {
    if (value < fromMin) value = fromMin;
    else if (value > fromMin) value = fromMax;
    return (value - fromMin) * (toMax - toMin) / (fromMax - fromMin) + toMin;
}

function computeRadians(x1, y1, x2, y2) {
    return Math.atan2(x2 - x1, y1 - y2);
}

function interpolate(a, b, step) {
    return a + (b - a) * step;
}

function rndHexColor() {
    let r = Math.random() * 256.0;
    let g = Math.random() * 256.0;
    let b = Math.random() * 256.0;
    return rgbToHex(r, g, b);
}

function rgbToHex(r, g, b) {
    r = Math.floor(r).toString(16).padStart(2, '0');
    g = Math.floor(g).toString(16).padStart(2, '0');
    b = Math.floor(b).toString(16).padStart(2, '0');
    return "#" + r + g + b;
}

function brightColor(color, factor) {

    if (color.startsWith("#")) {
        color = color.substring(1, color.length);
    }

    let value = color.match(/.{1,2}/g);

    let r = parseInt(value[0], 16);
    r = Math.min(r * factor, 255);
    let g = parseInt(value[1], 16);
    g = Math.min(g * factor, 255);
    let b = parseInt(value[2], 16);
    b = Math.min(b * factor, 255);

    return rgbToHex(r, g, b);
}

if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength, padString) {
        targetLength = targetLength >> 0; //truncate if number or convert non-number to 0;
        padString = String(typeof padString !== 'undefined' ? padString : ' ');
        if (this.length > targetLength) {
            return String(this);
        } else {
            targetLength = targetLength - this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0, targetLength) + String(this);
        }
    };
}

if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        value: function(search, rawPos) {
            var pos = rawPos > 0 ? rawPos | 0 : 0;
            return this.substring(pos, pos + search.length) === search;
        }
    });
}
