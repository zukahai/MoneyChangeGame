class money {
    constructor(game, value, x, y) {
        this.game = game;
        this.value = value;
        this.ts = 0;
        this.x = x;
        this.y = y
    }

    draw() {
        let t = game_H / 40;
        let X = this.x + t
        let Y = this.y + t;
        let w = game_H / 5 - 2 * t;
        let h = game_H / 5 - 2 * t;
        this.game.context.drawImage(mnIm, X, Y, w, h);


        this.game.context.font = game_H / 10 + 'px Arial Black';
        this.game.context.fillStyle = "#FFD700";
        this.game.context.fillText(this.value + "$", this.x + game_H / 5, this.y + game_H / 7);

        this.game.context.fillStyle = "#ffffff";
        this.game.context.fillText("X", this.x + game_H / 5.5 + game_W / 5, this.y + game_H / 7);

        this.game.context.fillStyle = "#FFD700";
        this.game.context.fillText(this.ts + "", this.x + game_H / 7.5 + game_W / 5.5 + game_W / 5, this.y + game_H / 7);
    }
}