var Config = (function () {
    function Config(elem) {
        this.elem = elem;
    }
    Config.prototype.setData = function (data) {
        if (data) {
            this.ring = false;
            this.width = data.width || '100%';
            this.height = data.height || '100%';
            this.img = this.setImg(data.img) || this.setImg('default');
        }
    };
    Config.prototype.setImg = function (img) {
        switch (img) {
            case 'circle_white':
                return "../assets/img/rgb_circle_white_1000_1000.png";
            case 'ring_full':
                this.ring = true;
                return "../assets/img/rgb_ring_full_1000_1000.png";
            case 'ring_transparent':
                this.ring = true;
                return "../assets/img/rgb_ring_transparent_1000_1000.png";
            case 'circle_full':
            default:
                return "../assets/img/rgb_circle_full_1000_1000.png";
        }
    };
    return Config;
}());
var CoreColorPicker = (function () {
    function CoreColorPicker(elem, config) {
        this.config = new Config(elem);
        this.config.setData(config);
        this.init();
        this._resize();
    }
    CoreColorPicker.prototype.init = function () {
        var _this = this;
        this._createParent(this.config.elem);
        this._createCursor();
        this._setCursor(this.canvas.width / 2 - (this.canvas.width < 300 ? 6 : 10), this.canvas.height / 2 - (this.canvas.width < 300 ? 6 : 10));
        this.context = this.canvas.getContext('2d');
        this.image = new Image();
        this.image.onload = function () {
            _this.context.drawImage(_this.image, 0, 0, _this.canvas.width, _this.canvas.height);
        };
        this.image.src = this.config.img;
        this.canvas.onclick = function (e) {
            _this._func(e).then(function () { _this._start("colorClick"); }, function () { });
        };
        this.canvas.onmousedown = function () {
            _this.canvas.onmousemove = function (e) {
                _this._func(e).then(function () { _this._start("colorMove"); }, function () { });
            };
            document.onmouseup = function () {
                document.onmouseup = _this.canvas.onmousemove = null;
            };
        };
        this.cursor.onmousedown = function () {
            _this.canvas.onmousemove = function (e) {
                _this._func(e).then(function () { _this._start("colorMove"); }, function () { });
            };
            document.onmouseup = function () {
                document.onmouseup = _this.canvas.onmousemove = null;
            };
        };
    };
    CoreColorPicker.prototype.colorClick = function (func) {
        this.canvas.addEventListener("colorClick", func, false);
    };
    CoreColorPicker.prototype.colorMove = function (func) {
        this.canvas.addEventListener("colorMove", func, false);
    };
    CoreColorPicker.prototype._createParent = function (elem) {
        var _this = this;
        var superParent = document.getElementById(elem);
        this.parentCanvas ? superParent.removeChild(this.parentCanvas) : null;
        this.parentCanvas = document.createElement('div');
        this.parentCanvas.style.width = this.config.width;
        this.parentCanvas.style.height = this.config.height;
        superParent.appendChild(this.parentCanvas);
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.canvas.height = this.parentCanvas.offsetWidth;
        this.canvas.onmousemove = function (e) {
            var r = _this.canvas.width / 2;
            if (Math.pow(r - e.offsetX, 2) + Math.pow(r - e.offsetY, 2) < Math.pow(r, 2))
                _this.canvas.style.cursor = 'move';
            else
                _this.canvas.style.cursor = 'default';
        };
        this.parentCanvas.appendChild(this.canvas);
    };
    CoreColorPicker.prototype._createCursor = function () {
        var _this = this;
        this.cursor = document.createElement('div');
        this.cursor.style.position = 'absolute';
        this.cursor.onmouseover = function () {
            _this.cursor.style.cursor = 'pointer';
        };
        this.cursor.style.width = (this.canvas.width < 300 ? 8 : 14) + 'px';
        this.cursor.style.height = (this.canvas.width < 300 ? 8 : 14) + 'px';
        this.cursor.style.backgroundColor = 'transparent';
        this.cursor.style.borderRadius = '50%';
        this.cursor.style.border = (this.canvas.width < 300 ? 2 : 4) + 'px solid white';
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
                var xy = _this.config.ring ? _this._ring(e) : [e.offsetX, e.offsetY];
                var pix = _this.context.getImageData(xy[0], xy[1], 1, 1).data;
                _this.colorRgb = [pix[0], pix[1], pix[2]];
                _this.colorHex = '#' + _this.toHex(pix[0], pix[1], pix[2]);
                _this._setCursor(xy[0] - (_this.canvas.width < 300 ? 6 : 10), xy[1] - (_this.canvas.width < 300 ? 6 : 10));
                resolve(true);
            }
        });
    };
    CoreColorPicker.prototype._ring = function (e) {
        var r = this.canvas.width / 2, vector1 = [this.canvas.width - this.canvas.width / 2, 0], vector2 = [e.offsetX - this.canvas.width / 2, e.offsetY - this.canvas.height / 2], cos = (vector1[0] * vector2[0] + vector1[1] * vector2[1]) /
            (Math.sqrt(Math.pow(vector1[0], 2) + Math.pow(vector1[1], 2)) * Math.sqrt(Math.pow(vector2[0], 2) + Math.pow(vector2[1], 2))), orX = .88 * r * cos + r, orY = Math.sqrt(Math.pow(.88 * r, 2) - Math.pow(orX - this.canvas.width / 2, 2)) * (e.offsetY > this.canvas.height / 2 ? 1 : -1) + this.canvas.height / 2;
        return [orX, orY];
    };
    CoreColorPicker.prototype._setCursor = function (x, y) {
        this.cursorX = x;
        this.cursorY = y;
        this.cursor.style.marginTop = y + 'px';
        this.cursor.style.marginLeft = x + 'px';
    };
    CoreColorPicker.prototype._start = function (even) {
        var event = new CustomEvent(even, {
            detail: { colorRbg: this.colorRgb, colorHex: this.colorHex }
        });
        this.canvas.dispatchEvent(event);
    };
    CoreColorPicker.prototype._resize = function () {
        var _this = this;
        if (this.config.width.indexOf('%') != -1)
            window.onresize = function () { _this.init(); };
    };
    CoreColorPicker.prototype.toHex = function (r, g, b) {
        var R = r.toString(16), G = g.toString(16), B = b.toString(16);
        if (R.length == 1)
            R = '0' + R;
        if (G.length == 1)
            G = '0' + G;
        if (B.length == 1)
            B = '0' + B;
        return (R + G + B).toUpperCase();
    };
    return CoreColorPicker;
}());
//# sourceMappingURL=index.js.map