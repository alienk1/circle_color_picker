//import 'style-loader!./style.css';
"use strict";
var Config = (function () {
    function Config(elem) {
        this.elem = elem;
        this.width = 300;
        this.height = 300;
        this.img = "../assets/img/rgb_circle_full_1000_1000.png";
    }
    return Config;
}());
var CoreColorPicker = (function () {
    function CoreColorPicker(elem) {
        this.config = new Config(elem);
        this._createParent(this.config.elem);
        this._createCursor();
        this._setCursor(this.config.width / 2 - 6, this.config.height / 2 - 6);
        this.context = this.canvas.getContext('2d');
        this.image = new Image();
        this._downValid = false;
        this.init();
    }
    CoreColorPicker.prototype.init = function () {
        var _this = this;
        this.image.onload = function () {
            _this.context.drawImage(_this.image, 0, 0, _this.canvas.width, _this.canvas.height);
        };
        this.image.src = this.config.img;
        this.canvas.onclick = function (e) {
            _this._func(e).then(function () {
                _this._start("colorClick");
            }, function () { });
            _this._downValid = false;
        };
        this.canvas.onmousedown = function (e) {
            _this._downValid = true;
        };
        document.onmouseup = function () {
            _this._downValid = false;
        };
        this.canvas.onmousemove = function (e) {
            if (_this._downValid) {
                _this._func(e).then(function () {
                    _this._start("colorMove");
                }, function () { });
            }
        };
    };
    CoreColorPicker.prototype.colorClick = function (func) {
        this.canvas.addEventListener("colorClick", func, false);
    };
    CoreColorPicker.prototype.colorMove = function (func) {
        this.canvas.addEventListener("colorMove", func, false);
    };
    CoreColorPicker.prototype._createParent = function (elem) {
        var superParent = document.getElementById(elem);
        this.parentCanvas = document.createElement('div');
        this.parentCanvas.style.width = this.config.width + 'px';
        this.parentCanvas.style.height = this.config.height + 'px';
        superParent.appendChild(this.parentCanvas);
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.config.width;
        this.canvas.height = this.config.height;
        this.parentCanvas.appendChild(this.canvas);
    };
    CoreColorPicker.prototype._createCursor = function () {
        this.cursor = document.createElement('div');
        this.cursor.style.position = 'absolute';
        this.cursor.style.width = '8px';
        this.cursor.style.height = '8px';
        this.cursor.style.backgroundColor = 'transparent';
        this.cursor.style.borderRadius = '50%';
        this.cursor.style.border = '2px solid white';
        this.parentCanvas.insertBefore(this.cursor, this.canvas);
    };
    CoreColorPicker.prototype._func = function (e) {
        var _this = this;
        var r = this.canvas.width / 2;
        return new Promise(function (resolve, reject) {
            if (Math.pow(r - e.offsetX, 2) + Math.pow(r - e.offsetY, 2) >= Math.pow(r, 2)) {
                reject(true);
            }
            else {
                var x = e.offsetX;
                var y = e.offsetY;
                var pix = _this.context.getImageData(x, y, 1, 1).data;
                _this.colorRgb = [pix[0], pix[1], pix[2]];
                _this.colorHex = '#' + _this.toHex(pix[0], pix[1], pix[2]);
                _this._setCursor(x - 6, y - 6);
                resolve(true);
            }
        });
    };
    CoreColorPicker.prototype._setCursor = function (x, y) {
        this.cursor.style.marginTop = y + 'px';
        this.cursor.style.marginLeft = x + 'px';
    };
    CoreColorPicker.prototype._start = function (even) {
        var event = new CustomEvent(even, {
            detail: { colorRbg: this.colorRgb, colorHex: this.colorHex }
        });
        this.canvas.dispatchEvent(event);
    };
    CoreColorPicker.prototype.toHex = function (r, g, b) {
        r = r.toString(16);
        g = g.toString(16);
        b = b.toString(16);
        if (r.length == 1)
            r = '0' + r;
        if (g.length == 1)
            g = '0' + g;
        if (b.length == 1)
            b = '0' + b;
        return (r + g + b).toUpperCase();
    };
    return CoreColorPicker;
}());
exports.CoreColorPicker = CoreColorPicker;
//# sourceMappingURL=index.js.map