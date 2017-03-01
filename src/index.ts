
//import 'style-loader!./style.css';

class Config {
    public  width: number = 300;
    public height: number = 300;
    public img: string = "../assets/img/rgb_circle_full_1000_1000.png";
    constructor(
        public elem: any
    ) {}
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

    constructor(elem) {
        this.config = new Config(elem);

        this._createParent(this.config.elem);
        this._createCursor();
        this._setCursor(this.config.width / 2 - 6, this.config.height / 2 - 6);

        this.context = this.canvas.getContext('2d');
        this.image = new Image();
        this.init();
    }
    
    private init() {
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
        this.parentCanvas = document.createElement('div');
        this.parentCanvas.style.width = this.config.width + 'px';
        this.parentCanvas.style.height = this.config.height + 'px';
        superParent.appendChild(this.parentCanvas);
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.config.width;
        this.canvas.height = this.config.height;
        this.parentCanvas.appendChild(this.canvas);
    }

    private _createCursor() {
        this.cursor = document.createElement('div');
        this.cursor.style.position = 'absolute';
        this.cursor.style.width = '8px';
        this.cursor.style.height = '8px';
        this.cursor.style.backgroundColor = 'transparent';
        this.cursor.style.borderRadius = '50%';
        this.cursor.style.border = '2px solid white';

        this.parentCanvas.insertBefore(this.cursor, this.canvas);
    }
    
    private _func(e) : Promise {
        let r = this.canvas.width / 2;
        return new Promise((resolve, reject) => {
            if(Math.pow(r - e.offsetX, 2) + Math.pow(r - e.offsetY, 2) >= Math.pow(r, 2)) {
                reject(true);
            }
            else {

                let x = e.offsetX;
                let y = e.offsetY;
                let pix = this.context.getImageData(x, y, 1, 1).data;
                this.colorRgb = [pix[0], pix[1], pix[2]];
                this.colorHex = '#' + this.toHex(pix[0], pix[1], pix[2]);

                this._setCursor(x - 6, y - 6);
                resolve(true);
            }
        });
    }

    private _setCursor(x: number, y: number) {
        this.cursor.style.marginTop = y + 'px';
        this.cursor.style.marginLeft = x + 'px';
    }

    private _start(even: string) {
        let event = new CustomEvent(even, {
            detail: { colorRbg: this.colorRgb, colorHex: this.colorHex }
        });
        this.canvas.dispatchEvent(event);
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