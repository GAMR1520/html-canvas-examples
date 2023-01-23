export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.target = {x: x, y: 0};
    }

    get angle() {
        return Math.atan2(this.target.y - this.y, this.target.x - this.x);
    }

    get muzzle() {
        return {
            x: this.x + Math.cos(this.angle) * 40,
            y: this.y + Math.sin(this.angle) * 40
        }
    }

    draw(ctx) {
        ctx.save();

        // The target
        ctx.beginPath();
        ctx.arc(this.target.x, this.target.y, 10, 0, 2 * Math.PI);
        ctx.lineTo(this.target.x-10, this.target.y);
        ctx.moveTo(this.target.x, this.target.y-10);
        ctx.lineTo(this.target.x, this.target.y+10);
        ctx.stroke();

        // the turret
        ctx.fillStyle = "hsl(100, 50%, 50%)";
        ctx.strokeStyle = "hsl(50, 50%, 50%)";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.translate(this.x, this.y);
        ctx.arc(0, 0, 20, 0, Math.PI, true);
        ctx.fill();

        // the gun
        ctx.beginPath();
        ctx.rotate(this.angle);
        ctx.moveTo(20, 0);
        ctx.lineTo(40, 0);
        ctx.stroke();
        ctx.restore();
    }
}


export function updateTarget(ev) {
    this.target = {x: ev.offsetX, y: ev.offsetY};
}