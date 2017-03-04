
//import 'style-loader!./style.css';

class Config {
    public width: string;
    public height: string;
    public img: string;
    public ring: boolean;
    constructor(
        public elem: any
    ) {}
    setData(data : any) {
        if(data) {
            this.ring = false;
            this.width = data.width || '100%';
            this.height = data.height || '100%';
            this.img = this.setImg(data.img) || this.setImg('default');
        }
    }
    setImg(img: string) {
        switch(img) {
            case 'circle_white':
                return "../assets/img/rgb_circle_white_1000_1000.png";
            case 'ring_full':
                this.ring = true;
                return "../assets/img/rgb_ring_full_1000_1000.png";
            case 'ring_transparent':
                this.ring = true;
                return "../assets/img/rgb_ring_transparent_1000_1000.png";
            case 'circle_full': default:
                return "../assets/img/rgb_circle_full_1000_1000.png";
        }
    }
}

export class CoreColorPicker {

    parentCanvas: any;
    canvas: any;
    context: any;
    image: any;
    cursor: any;
    colorHex: string;
    colorRgb: number[];
    config: Config;
    cursorX: number;
    cursorY: number;

    constructor(elem, config?: any) {
        this.config = new Config(elem);
        this.config.setData(config);

        this.init();
        this._resize();
    }

    private init() {
        this._createParent(this.config.elem);
        this._createCursor();
        this._setCursor(this.canvas.width / 2 - (this.canvas.width < 300 ? 6 : 10), this.canvas.height / 2 - (this.canvas.width < 300 ? 6 : 10));

        this.context = this.canvas.getContext('2d');
        this.image = new Image();

        this.image.onload = () => {
            this.context.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);
        };
        this.image.src = this.config.img;


        this.canvas.onclick = e => {
            this._func(e).then(() => { this._start("colorClick") }, () => {});
        };

        this.canvas.onmousedown = () => {
            this.canvas.onmousemove = e => {
                this._func(e).then(() => { this._start("colorMove") }, () => {});
            };
            document.onmouseup = () => {
                document.onmouseup = this.canvas.onmousemove = null;
            };
        };

        this.cursor.onmousedown = () => {
            this.canvas.onmousemove = e => {
                this._func(e).then(() => { this._start("colorMove") }, () => {});
            };
            document.onmouseup = () => {
                document.onmouseup = this.canvas.onmousemove = null;
            };
        };

    }

    colorClick(func) {
        this.canvas.addEventListener("colorClick", func, false);
    }

    colorMove(func) {
        this.canvas.addEventListener("colorMove", func, false);
    }

    private _createParent(elem) {
        let superParent = document.getElementById(elem);
        this.parentCanvas ? superParent.removeChild(this.parentCanvas) : null;
        this.parentCanvas = document.createElement('div');
        this.parentCanvas.style.width = this.config.width;
        this.parentCanvas.style.height = this.config.height;
        superParent.appendChild(this.parentCanvas);
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.canvas.height = this.parentCanvas.offsetWidth;
        //this.canvas.height = this.parentCanvas.width;
        this.parentCanvas.appendChild(this.canvas);
    }

    private _createCursor() {
        this.cursor = document.createElement('div');
        this.cursor.style.position = 'absolute';
        this.cursor.style.width = (this.canvas.width < 300 ? 8 : 14) + 'px';
        this.cursor.style.height = (this.canvas.width < 300 ? 8 : 14) + 'px';
        this.cursor.style.backgroundColor = 'transparent';
        this.cursor.style.borderRadius = '50%';
        this.cursor.style.border = (this.canvas.width < 300 ? 2 : 4) + 'px solid white';

        this.parentCanvas.insertBefore(this.cursor, this.canvas);
    }

    private _func(e) : Promise {
        let r = this.canvas.width / 2;
        return new Promise((resolve, reject) => {
            if(Math.pow(r - e.offsetX, 2) + Math.pow(r - e.offsetY, 2) >= Math.pow(r, 2)) {
                reject(true);
            }
            else {

                let xy = this.config.ring ? this._ring(e) : [e.offsetX, e.offsetY];
                let pix = this.context.getImageData(xy[0], xy[1], 1, 1).data;
                this.colorRgb = [pix[0], pix[1], pix[2]];
                this.colorHex = '#' + this.toHex(pix[0], pix[1], pix[2]);

                this._setCursor(xy[0] - (this.canvas.width < 300 ? 6 : 10), xy[1] - (this.canvas.width < 300 ? 6 : 10));
                resolve(true);
            }
        });
    }

    private _ring(e) : number[] {
        let r = this.canvas.width / 2,
            vector1: number[] = [this.canvas.width - this.canvas.width / 2, 0],
            vector2: number[] = [e.offsetX - this.canvas.width / 2, e.offsetY - this.canvas.height / 2],
            cos = (vector1[0] * vector2[0] + vector1[1] * vector2[1]) /
            (Math.sqrt(Math.pow(vector1[0], 2) + Math.pow(vector1[1], 2)) * Math.sqrt(Math.pow(vector2[0], 2) + Math.pow(vector2[1], 2))),
            orX = .88 * r * cos + r,
            orY = Math.sqrt(Math.pow(.88 * r, 2) - Math.pow(orX - this.canvas.width / 2, 2)) * (e.offsetY > this.canvas.height / 2 ? 1 : -1) + this.canvas.height / 2;
        return [orX, orY];
    }

    private _setCursor(x: number, y: number) {
        this.cursorX = x;
        this.cursorY = y;
        this.cursor.style.marginTop = y + 'px';
        this.cursor.style.marginLeft = x + 'px';
    }

    private _start(even: string) {
        let event = new CustomEvent(even, {
            detail: { colorRbg: this.colorRgb, colorHex: this.colorHex }
        });
        this.canvas.dispatchEvent(event);
    }

    protected _resize() {
        if(this.config.width.indexOf('%') != -1)
            window.onresize = () => { this.init() };
    }

    private toHex(r, g, b) {
        r = r.toString(16);
        g = g.toString(16);
        b = b.toString(16);

        if(r.length == 1) r = '0' + r;
        if(g.length == 1) g = '0' + g;
        if(b.length == 1) b = '0' + b;

        return (r + g + b).toUpperCase();
    }
}