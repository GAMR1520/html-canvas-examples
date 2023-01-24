import Scene from './modules/scene.js';

canvas.width = 600;
canvas.height = 600;
const ctx = canvas.getContext("2d");

const gunSound = new Audio('./sounds/gun.mp3');
const explosionSound = new Audio('./sounds/explosion.wav');
explosionSound.load();
let scene;
gunSound.addEventListener('canplaythrough', ev1 => {
    explosionSound.addEventListener('canplaythrough', ev2 => {      
        scene = new Scene(canvas, gunSound, explosionSound);
        requestAnimationFrame(frame);
    });
});


let p;
function frame(ts) {
    const elapsed = ts - p || 0;
    scene.update(elapsed / 1000);
    scene.draw(ctx);
    p = ts;
    if(scene.game_over) {
        ctx.textAlign = "center";
        ctx.font = "2em monospace";
        ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2)
        ctx.font = "1em monospace";
        ctx.fillText("Press space to play again", canvas.width/2, canvas.height/2 + 50)
    } else {
        requestAnimationFrame(frame);
    }   
}
canvas.addEventListener('keydown', ev => {
    p = undefined;
    scene.restart();
    requestAnimationFrame(frame);
});