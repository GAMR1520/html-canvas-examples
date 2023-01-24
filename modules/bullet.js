export default class Bullet {
    constructor(location, target) {
        this.x = location.x;
        this.y = location.y;
        this.angle = Math.atan2(target.y - this.y, target.x - this.x)
        this.speed = 500;
        this.hitbox = 5;
    }

    get xSpeed() {
        return Math.cos(this.angle) * this.speed;
    }
    get ySpeed() {
        return Math.sin(this.angle) * this.speed;
    }

    update(elapsed) {
        this.x += this.xSpeed * elapsed;
        this.y += this.ySpeed * elapsed;
    }

    draw(ctx) {
        ctx.save();
        ctx.lineWidth = 5;
        ctx.beginPath()
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.moveTo(-5, 0);
        ctx.lineTo(5, 0);
        ctx.stroke();
        ctx.restore();
    }
}
