game_W = 0, game_H = 0;

let bg = new Image();
bg.src = "images/bg.png";
let mnIm = new Image();
mnIm.src = "images/money.png";
let tsIm = new Image();
tsIm.src = "images/ts.png";

let btIm = new Image();
btIm.src = "images/button.png";
N = 5;
v = [];
level = 1

class game {
    constructor() {
        this.canvas = null;
        this.context = null;
        this.init();
    }

    init() {
        this.canvas = document.createElement("canvas");
        this.context = this.canvas.getContext("2d");
        document.body.appendChild(this.canvas);
        this.render();

        this.newGame();

        this.resetImageMoney();

        this.loop();
        this.listenMouse();
    }

    loop() {
        this.update();
        this.draw();
        this.render();
        setTimeout(() => this.loop(), 30);
    }

    update() {

    }

    draw() {
        this.context.drawImage(bg, 0, 0, game_W, game_H);
        this.drawMoney();
        this.drawpanel();
    }

    newGame() {
        this.randomValues();
    }

    drawpanel() {
        this.context.font = game_H / 10 + 'px Arial Black';
        this.context.fillStyle = "#FFD700";
        this.context.fillText("Taget: " + this.taget + "$", game_H / 10, game_H / 10);

        let t = game_H / 40;
        let X = game_H / 10 + t
        let Y = game_W / 10 + t;
        let w = game_H / 5 - 2 * t;
        let h = game_H / 5 - 2 * t;
        this.context.fillStyle = "#00FFFF";
        this.context.drawImage(mnIm, X, Y, w, h);
        this.context.fillText(this.sumMoney() + "", game_H / 10 + game_H / 5, Y + 4 * t);

        this.context.drawImage(tsIm, X, Y + game_H / 5, w, h);
        this.context.fillText(this.sumTS() + "", game_H / 10 + game_H / 5, Y + 4 * t + game_H / 5);

        this.context.drawImage(btIm, X, Y + 3 * game_H / 5, game_W / 3.5, h);

        this.context.fillStyle = "red";
        this.context.fillText("Check", X + 4 * t, Y + 3 * game_H / 5 + 4 * t);

        this.context.drawImage(btIm, X, Y + 2 * game_H / 5, game_W / 3.5, h);

        this.context.fillStyle = "red";
        this.context.fillText("Result", X + 4 * t, Y + 2 * game_H / 5 + 4 * t);
    }

    drawMoney() {
        for (let i = 0; i < N; i++)
            this.mn[i].draw();
    }

    result() {
        let x = [];
        for (let i = 0; i < N; i++)
            x[i] = 0;
        let pre = [];
        let t = [];
        t[0] = 0;
        for (let i = 1; i <= this.taget; i++)
            t[i] = 99999999;
        for (let i = 1; i <= this.taget; i++) {
            for (let j = 0; j < N; j++)
                if (i >= v[j]) {
                    // console.log(i - v[j])
                    if (t[i] > t[i - v[j]] + 1) {
                        t[i] = t[i - v[j]] + 1;
                        pre[i] = j;
                    }
                }
        }
        let k = this.taget;
        while (k > 0) {
            let index = pre[k];
            x[index]++;
            k -= v[index];
        }
        return { ts: t[this.taget], arr: x };
    }

    check() {
        let result = this.result();
        // console.log(this.vetCan(), ' ', result.ts, ' ', result.arr);
        if (this.sumMoney() == this.taget && this.sumTS() == result.ts) {
            window.alert("Level " + level++);
            this.newGame();
        } else {
            level = 1;
            window.alert("Lost: Level" + level);
        }
    }

    listenMouse() {
        document.addEventListener("mousedown", evt => {
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;

            if (y > 4 * game_H / 5 && x < game_W / 3) {
                this.check();
                return;
            }

            if (y > 3 * game_H / 5 && x < game_W / 3) {
                level = 1;
                let result = this.result();
                for (let i = 0; i < N; i++)
                    this.mn[i].ts = result.arr[i];
                return;
            }
            // console.log(x, ' ', y);
            let row = Math.floor(y / (game_H / 5));
            // console.log(row);
            this.mn[row].ts = this.mn[row].ts + 1;
            if (x > 2 * game_W / 3)
                this.mn[row].ts = this.mn[row].ts - 2;
            if (this.mn[row].ts < 0)
                this.mn[row].ts = 0;
        })

        document.addEventListener("mousemove", evt => {
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;

        })

        document.addEventListener("mouseup", evt => {
            var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
            var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;

        })
    }

    render() {
        if (this.canvas.width != document.documentElement.clientWidth || this.canvas.height != document.documentElement.clientHeight) {
            this.canvas.width = document.documentElement.clientWidth;
            this.canvas.height = document.documentElement.clientHeight;
            game_W = this.canvas.width;
            game_H = this.canvas.height;

            this.resetImageMoney();
        }
    }

    vetCan() {
        let t = 0;
        let k = this.taget;
        for (let i = N - 1; i >= 0; i--) {
            let x = Math.floor(k / v[i])
            t += x;
            k -= x * v[i];
        }
        return t;
    }

    randomValues() {
        let result = 0;
        do {
            this.createTagerMoney();
            for (let i = 0; i < N; i++)
                v[i] = Math.floor(Math.random() * 100);
            v[0] = 1;
            v.sort(function(a, b) {
                return Math.floor(a) - Math.floor(b);
            });
            result = this.result().ts;
        } while (result == this.vetCan());

        for (let i = 0; i < N; i++)
            this.mn[i].ts = 0;

        // v = [1, 2, 5, 8, 10];
        // this.taget = 24;
    }

    createX() {
        for (let i = 0; i < N; i++)
            x[i] = 0;
    }

    createTagerMoney() {
        this.taget = Math.floor(Math.random() * 1000) + 1;
    }

    resetImageMoney() {
        this.mn = [];
        for (let i = 0; i < N; i++) {
            this.mn[i] = new money(this, v[i], game_W / 2.5, i * game_H / 5);
        }
    }

    sumTS() {
        let sum = 0;
        for (let i = 0; i < N; i++)
            sum += Number(this.mn[i].ts);
        return sum;
    }

    sumMoney() {
        let sum = 0;
        for (let i = 0; i < N; i++)
            sum += Number(this.mn[i].ts) * v[i];
        return sum;
    }
}

var g = new game();