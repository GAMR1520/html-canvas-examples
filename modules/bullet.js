
export default class Bullet {
    constructor(location, target) {
        this.location = location;
        this.angle = Math.atan2(target.y - this.location.y, target.x - this.location.x)
        this.speed = 1000;
    }

    get xSpeed() {
        return Math.cos(this.angle) * this.speed;
    }
    get ySpeed() {
        return Math.sin(this.angle) * this.speed;
    }

    update(elapsed) {
        this.location.x += this.xSpeed * elapsed;
        this.location.y += this.ySpeed * elapsed;
    }

    draw(ctx) {
        ctx.save();
        ctx.lineWidth = 5;
        ctx.beginPath()
        ctx.translate(this.location.x, this.location.y);
        ctx.rotate(this.angle);
        ctx.moveTo(-10, 0);
        ctx.lineTo(0, 0);
        ctx.stroke();
        ctx.restore();
    }
}
