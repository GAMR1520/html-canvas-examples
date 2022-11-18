"use strict";
canvas.width = 800;
canvas.height = 800;

const gravity = 30;
const terminalVelocity = 15;

class Player {
    constructor(x, y, w, h, phantomCtx) {
        this.x = x;
        this.y = y;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.width = w;
        this.height = h;
        this.jump = 8;
        this.phantomCtx = phantomCtx;
    }
    pixels(x, y, w, h) {
        const pixels = this.phantomCtx.getImageData(x, y, w, h).data;
        return Array.from({length: pixels.length / 4},(_, index) => {
            return pixels.slice(index * 4, (index + 1) * 4);
        })
    }
    pixelsIncludeRed(x, y, w, h) {
        return this.pixels(x, y, w, h).some(px => {return px[0] > 0});
    }
    contact() {
        return this.pixelsIncludeRed(
            this.x - this.width / 2, 
            this.y - this.height / 2, 
            this.width, this.height
        )
    }
    contactBottom() {
        return this.pixelsIncludeRed(
            this.x - this.width / 2, 
            this.y + this.height / 2, 
            this.width, 1
        )
    }
    contactTop() {
        return this.pixelsIncludeRed(
            this.x - this.width / 2, 
            this.y - this.height / 2, 
            this.width, 1
        )
    }
    contactBeneath() {
        return this.pixelsIncludeRed(
            this.x - this.width / 2, 
            this.y + this.height / 2 + 1, 
            this.width, 1
        )
    }
    contactAbove() {
        return this.pixelsIncludeRed(
            this.x - this.width / 2, 
            this.y - this.height / 2 - 1, 
            this.width, 1
        )
    }
    contactToLeft() {
        return this.pixelsIncludeRed(
            this.x - this.width / 2 - 1, 
            this.y - this.height / 2, 
            1, this.height
        )
    }
    contactToRight() {
        return this.pixelsIncludeRed(
            this.x + this.width / 2 + 1, 
            this.y - this.height / 2, 
            1, this.height
        )
    }
    contactOnLeft() {
        return this.pixelsIncludeRed(
            this.x - this.width / 2, 
            this.y - this.height / 2, 
            1, this.height
        )
    }
    contactOnRight() {
        return this.pixelsIncludeRed(
            this.x + this.width / 2, 
            this.y - this.height / 2, 
            1, this.height
        )
    }

    update(elapsed, keys) {
        // left/right
        this.xSpeed = (keys.ArrowRight - keys.ArrowLeft) * 200 * elapsed;

        this.handleContact();

        if (this.contactToLeft()) {
            this.xSpeed = Math.max(0, this.xSpeed);
        }
        if (this.contactToRight()) {
            this.xSpeed = Math.min(0, this.xSpeed);
        }
        this.x += this.xSpeed;

        // up/down
        if(keys.ArrowUp && this.contactBeneath()) {
            this.ySpeed -= this.jump;
            keys.ArrowUp = false;
        }
        if (this.contactAbove()) {
            this.ySpeed = Math.max(0, this.ySpeed);
        }
        if (this.contactBeneath()) {
            this.ySpeed = Math.min(0, this.ySpeed);
        } else {
            // Apply gravity only if we can fall
            this.ySpeed += gravity * elapsed;
            this.ySpeed = Math.min(this.ySpeed, terminalVelocity);
        }
        this.y += this.ySpeed;
    }

    handleContact() {
        while (this.contact()) {
            if (this.contactBottom()) {
                this.y -= 1;
            }
            if (this.contactTop()) {
                this.y += 1;
            }
            if (this.contactOnLeft()) {
                this.x += 1;
            }
            if (this.contactOnRight()) {
                this.x -= 1;
            }
        }

    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = "hsl(200, 50%, 20%)";
        ctx.translate(this.x, this.y);
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.beginPath();
        ctx.moveTo(-this.width / 3, this.height / 4);
        ctx.quadraticCurveTo(0, this.height / 2, this.width / 3, this.height / 4);
        ctx.stroke();
        ctx.fillStyle = "hsl(200, 50%, 50%)";
        ctx.fillRect(-this.width / 3, -this.height / 4, this.width/10, this.height/10);
        ctx.fillRect(this.width / 3, -this.height / 4, this.width/10, this.height/10);
        ctx.restore();
    }

}

class Game {
    constructor(c) {
        this.canvas = c;
        this.ctx = c.getContext('2d');
        this.phantomCanvas = document.createElement('canvas');
        this.phantomCanvas.width = this.canvas.width;
        this.phantomCanvas.height = this.canvas.height;
        this.phantomCtx = this.phantomCanvas.getContext('2d');
        this.phantomCtx.strokeStyle = "red";
        this.ctx.strokeStyle = "hsl(200, 50%, 50%)";
        this.drawPlatforms(this.phantomCtx);
        this.gravity = 30;
        this.player = new Player(500, 300, 30, 30, this.phantomCtx);
        this.keys = {ArrowLeft: false, ArrowRight: false, ArrowUp: false};
        window.addEventListener('keydown', this.keydown.bind(this));
        window.addEventListener('keyup', this.keyup.bind(this));
        window.requestAnimationFrame(this.frame.bind(this));
    }

    keydown(ev) {
        if(ev.repeat) return;
        this.keys[ev.key] = true;
    }
    keyup(ev) {
        if(ev.repeat) return;
        this.keys[ev.key] = false;
    }
    update(timestamp) {
        const elapsed = (timestamp - (this.prev || timestamp)) / 1000;
        this.player.update(elapsed, this.keys);
        this.prev = timestamp;
    }

    draw() {        
        this.ctx.clearRect(0, 0, canvas.width, canvas.height)        
        this.player.draw(this.ctx);
        this.drawPlatforms(this.ctx);
    }

    drawPlatforms(ctx) {
        ctx.save();
        ctx.lineWidth = 30;
        ctx.beginPath();
        ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.stroke();

        let x = 50;
        for(let y = ctx.canvas.height - ctx.lineWidth / 2; y > 0; y-=ctx.lineWidth * 2) {
            x = (x > 75) ? 50 : 100;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 50, y);
            ctx.stroke();
        }
        for(let d = ctx.canvas.width / 3; d < ctx.canvas.width; d+=70) {
            ctx.beginPath();
            ctx.moveTo(d, d);
            ctx.lineTo(d, ctx.canvas.height);
            ctx.stroke();
        }
        ctx.restore();
    }

    frame(timestamp) {
        this.update(timestamp);
        this.draw(this.ctx);
        window.requestAnimationFrame(this.frame.bind(this));
    }
}


const g = new Game(canvas);


