export default class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.tilt = 0;
        this.xSpeed = 0;
    }

    update(elapsed) {
        this.tilt += (Math.random() - 0.5) * elapsed;
        this.tilt = Math.max(this.tilt, -15);
        this.tilt = Math.min(this.tilt, 15);
        this.xSpeed += this.tilt * 100;
        this.xSpeed = Math.max(this.xSpeed, -500);
        this.xSpeed = Math.min(this.xSpeed, 500);
        this.x += this.xSpeed * elapsed;
        this.y += 0.2;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = "hsla(250, 50%, 30%, 0.5)";
        ctx.beginPath();
        ctx.ellipse(this.x, this.y, 40, 20, this.tilt, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "hsl(250, 50%, 30%)";
        ctx.ellipse(this.x, this.y-15, 20, 10, this.tilt, 0, 2 * Math.PI);
        ctx.fill();
        ctx.restore();
    }
}