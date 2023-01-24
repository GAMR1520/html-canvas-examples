export default class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.tilt = 0;
        this.xSpeed = 0;
        this.attacking = false;
        this.hitbox = 30;
    }

    update(elapsed) {
        this.tilt += (Math.random() - 0.5) * elapsed;
        this.tilt = Math.max(this.tilt, -25);
        this.tilt = Math.min(this.tilt, 25);
        this.xSpeed += this.tilt * 100;
        this.xSpeed = Math.max(this.xSpeed, -500);
        this.xSpeed = Math.min(this.xSpeed, 500);
        this.x += this.xSpeed * elapsed;
        this.y += 0.2;
        if(this.attacking) {
            this.attacking = Math.random() > 0.01;
        } else {
            this.attacking = this.y > 200 && Math.random() > 0.99;
        }
        console.log(this.attacking);
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = "hsla(250, 50%, 30%, 0.5)";
        ctx.translate(this.x, this.y);
        ctx.beginPath();
        ctx.ellipse(0, 0, 40, 20, this.tilt, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "hsl(250, 50%, 30%)";
        ctx.translate(0, -15);
        ctx.ellipse(0, 0, 20, 10, this.tilt, 0, 2 * Math.PI);
        ctx.fill();
        if(this.attacking) {
            ctx.save();
            ctx.translate(0, 40);
            ctx.fillStyle = "hsla(60, 50%, 50%, 0.3)";
            ctx.beginPath();
            ctx.moveTo(10, 0);
            ctx.lineTo(30, 500 - this.y);
            ctx.bezierCurveTo(20, 550 - this.y, -20, 550 - this.y, -30, 500 - this.y);
            ctx.lineTo(-10, 0);
            ctx.fill();
            ctx.restore();
        }
        ctx.restore();
    }
}