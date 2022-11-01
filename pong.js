"use strict";
// configure the canvas
// (these attributes could be set directly in the HTML)
canvas.width = 600;
canvas.height = 600;

// set up a context
const ctx = canvas.getContext('2d');
ctx.lineWidth = 1.5;
ctx.strokeStyle = "hsl(50, 60%, 10%)";
ctx.fillStyle = "hsl(50, 60%, 30%)";
ctx.font = "bold 48px monospace";
ctx.textBaseline = "top";

class rectangleHitBox {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    get topEdge()         { return this.y - this.height / 2; }
    get bottomEdge()      { return this.y + this.height / 2; }
    get leftEdge()        { return this.x - this.width  / 2; }
    get rightEdge()       { return this.x + this.width  / 2; }

    set topEdge(value)    { this.y = value + this.height / 2; }
    set bottomEdge(value) { this.y = value - this.height / 2; }
    set leftEdge(value)   { this.x = value + this.width  / 2; }
    set rightEdge(value)  { this.x = value - this.width  / 2; }

    yDist(y) {
        return (y - this.y) / (this.height / 2);
    }

}

// defining game object classes
// each class should have an update and a draw method
class Player extends rectangleHitBox {
    constructor(x, y, colour, upKey, downKey) {
        super(x, y, 20, 80);
        this.colour = colour;
        this.ySpeed = 350; // pixels per second
        this.upKey = upKey;
        this.downKey = downKey;
        this.up = false;
        this.down = false;
        document.addEventListener('keydown', this.keydown.bind(this));
        document.addEventListener('keyup', this.keyup.bind(this));
    }

    movement(key, value) {
        if (key == this.upKey) this.up = value;
        if (key == this.downKey) this.down = value;
    }
    keyup(ev) {
        if (ev.repeat) { return; }
        this.movement(ev.key, false);
    }
    keydown(ev) {
        if (ev.repeat) { return; }
        this.movement(ev.key, true);
    }
    update(elapsed) {
        this.y += elapsed * this.ySpeed * (this.down - this.up);
        if(this.bottomEdge > canvas.height) {
            this.bottomEdge = canvas.height;
        }
        if(this.topEdge < 0) {
            this.topEdge = 0;
        }
    }

    draw(cx) {
        cx.save();
        cx.beginPath();
        cx.fillStyle = this.colour;
        cx.fillRect(this.leftEdge, this.topEdge, this.width, this.height);
        cx.restore();
    }
}

class Ball extends rectangleHitBox {
    constructor(x, y, radius) {
        super(x, y, radius * 2, radius * 2);
        this.angle = Math.PI / 3;
        this.colour = "white";
        this.speed = 300;
    }

    inYHitZone(player) {
        return player.topEdge < this.y && this.y < player.bottomEdge;
    }
    hitToRight(player) {
        return this.rightEdge > player.leftEdge && this.inYHitZone(player);
    }
    hitToLeft(player) {
        return this.leftEdge < player.rightEdge && this.inYHitZone(player);
    }
    get xComponent() {
        return Math.cos(this.angle);
    }
    get yComponent() {
        return Math.sin(this.angle);
    }
    set xComponent(value) {
        value = Math.max(Math.min(value, 1), -1);
        this.angleMod = Math.atan2(this.yComponent, value);
    }
    set yComponent(value) {
        value = Math.max(Math.min(value, 1), -1);
        this.angleMod = Math.atan2(value, this.xComponent);
    }
    set angleMod(value) {
        this.angle = (value + Math.PI * 2) % (Math.PI * 2);
    }

    bounceX() {
        this.xComponent = -this.xComponent;
        this.speed += 2;
    }
    bounceY() {
        this.yComponent = -this.yComponent;
    }
    update(elapsed) {
        const dist = this.speed * elapsed;
        this.x += this.xComponent * dist;
        this.y += this.yComponent * dist;
    }
    draw(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = this.colour;
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
}



class Pong {
    constructor() {
        this.player1 = new Player(30, 300, "hsl(100, 70%, 30%)", "a", "z");
        this.player2 = new Player(570, 300, "hsl(0, 70%, 30%)", "ArrowUp", "ArrowDown");
        this.score1 = 0;
        this.score2 = 0;
        this.ball = new Ball(this.player1.rightEdge + 115, this.player1.y, 10);
        this.scene = [this.player1, this.player2, this.ball];
    }

    player1Point() {
        this.score1 += 1;
        this.ball.leftEdge = this.player1.rightEdge;
        this.ball.y = this.player1.y;
    }
    player2Point() {
        this.score2 += 1;
        this.ball.rightEdge = this.player2.leftEdge;
        this.ball.y = this.player2.y;
    }

    update(elapsed) {
        for (const obj of this.scene) {
            obj.update(elapsed);
        }
        //bounce off top and bottom
        if(this.ball.bottomEdge > canvas.height) {            
            this.ball.bottomEdge = canvas.height;
            this.ball.bounceY();
        } else if(this.ball.topEdge < 0) {
            this.ball.topEdge = 0;
            this.ball.bounceY();
        }
        // Pass through left and right edges
        if(this.ball.rightEdge < 0) {
            this.player2Point();
            // return;
        } else if(this.ball.leftEdge > canvas.width) {
            this.player1Point();
            // return;
        }
        // Hitting player1
        if(this.ball.hitToLeft(this.player1)) {
            this.ball.leftEdge = this.player1.rightEdge;
            this.ball.yComponent = this.player1.yDist(this.ball.y);
            this.ball.bounceX();
        }
        // Hitting player2        
        if(this.ball.hitToRight(this.player2)) {
            this.ball.rightEdge = this.player2.leftEdge;
            this.ball.yComponent = this.player2.yDist(this.ball.y);
            this.ball.bounceX();
        }
    }

    // The function that draws the scene does something similar
    draw(ctx) {
        ctx.clearRect(0, 0, 600, 600);
        ctx.fillText(this.score1, 20, 20);
        ctx.fillText(this.score2, 540, 20);
        for (const obj of this.scene) {
            obj.draw(ctx);
        }
    }

}

const game = new Pong();

// This is the same function as before
let prev;
function frame(timestamp) {
    const elapsed = timestamp - (prev || timestamp);
    game.update(elapsed / 1000);
    game.draw(ctx);
    prev = timestamp;
    window.requestAnimationFrame(frame);
}

// This triggers the first call to our frame function
window.requestAnimationFrame(frame);