import { Player, updateTarget } from './player.js';
import Bullet from './bullet.js';
import Enemy from './enemy.js';

function distance(ob1, ob2) {
    return ((ob1.x - ob2.x)**2 + (ob1.y - ob2.y)**2)**0.5;
}
function collision(ob1, ob2) {
    return distance(ob1, ob2) < 40;
}

export default class Scene {

    constructor(canvas) {
        this.width = canvas.width;
        this.height = canvas.height;
        this.player = new Player(this.width / 2, this.height);
        this.bullets = [];
        this.enemies = [];
        this.level = 0;
        this.score = 0;
        canvas.addEventListener('mousemove', updateTarget.bind(this.player));
        canvas.addEventListener('mousedown', ev => {
            this.bullets.push(new Bullet(this.player.muzzle, this.player.target));
        });
    }

    update(elapsed) {
        this.bullets.forEach(bullet => {
            bullet.update(elapsed);
            if (bullet.location.y < 0) {
                this.bullets.splice(this.bullets.indexOf(bullet), 1);
            }
        });
        this.enemies.forEach(enemy => {
            enemy.update(elapsed);
            if (enemy.x < -40) {enemy.x = this.width + 40}
            if (enemy.x > this.width + 40) {enemy.x = -40}
        });

        // collision detection
        this.bullets.forEach(bullet => {
            this.enemies.forEach(enemy => {
                if(collision(bullet.location, {x: enemy.x, y: enemy.y})) {
                    this.enemies.splice(this.enemies.indexOf(enemy), 1);
                    this.score += 1;
                }
            })
        })

        if(this.enemies.length == 0) {
            this.level += 1;
            while(this.enemies.length < this.level) {
                this.enemies.push(new Enemy(this.width * Math.random(), this.height * 0.1))
            }    
        }
    }

    draw(ctx) {
        ctx.clearRect(0, 0, this.width, this.height);

        // draw the sky
        ctx.fillStyle = "hsl(200, 50%, 70%)";
        ctx.fillRect(0, 0, this.width, this.height * 0.8);
        // Draw the horizon
        ctx.fillStyle = "hsl(100, 50%, 30%)";
        ctx.fillRect(0, this.height * 0.8, this.width, this.height * 0.2);

        ctx.textBaseline = "top";
        ctx.font = "1.3em monospace";
        ctx.textAlign = "left";
        ctx.fillText(`score: ${this.score}`, 0, 0);
        ctx.textAlign = "right";
        ctx.fillText(`level: ${this.level}`, this.width, 0);
        // Draw the player
        this.player.draw(ctx);
        this.enemies.forEach(enemy => {
            enemy.draw(ctx);
        });
        this.bullets.forEach(bullet => {
            bullet.draw(ctx);
        });
    }
}
