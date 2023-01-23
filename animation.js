// The canvas element has an id set so we can talk to it easily
canvas.width = 600;
canvas.height = 600;

// We get a canvas 'context' object to draw on the canvas
const ctx = canvas.getContext('2d');

// Sometimes you want to prepare the canvas context a bit
// Here we set some basic stuff
ctx.lineWidth = 5;
ctx.strokeStyle = "hsl(50, 60%, 90%)";
ctx.fillStyle = "hsl(50, 60%, 30%)";


// It provides an API which allows us to draw things like this
ctx.save();
ctx.beginPath();
ctx.rect(10, 10, 10, 10);
ctx.rect(30, 10, 10, 10);
ctx.stroke();
ctx.fill();
ctx.beginPath();
ctx.rect(50, 10, 10, 10);
ctx.stroke();
ctx.fillStyle = "hsl(50, 60%, 70%)";
ctx.fill();
ctx.restore();

// Your scene should have some data which enables you to draw it
let angle = 0;
let speed = Math.PI / 2; // one quarter rotation per second


// It's good to have a function that updates the scene data
// This would be an entry point for updating all your game objects
function update(elapsed) {
    angle += elapsed * speed;
    angle %= 2 * Math.PI;
}

// And a function that draws the scene
function draw() {
    ctx.clearRect(0, 30, 600, 570);         // Clear the animated area

    ctx.save();                             // Save the context 

    // Canvas transformations are very handy when your scene is complex
    ctx.translate(300, 300);                // Move the origin to the middle
    ctx.rotate(angle);                      // Rotate the canvas
    ctx.translate(100, 0);                  // Move the origin to the right

    // Drawing is pretty easy

    // The head
    ctx.beginPath();                        // Begin a new path
    ctx.arc(0, 0, 40, 0, 2 * Math.PI);      // Add a circle at the origin
    ctx.fill();                             // Fill the path
    ctx.stroke();                           // Stroke the path

    // The mouth
    ctx.beginPath();                        // Begin a new path
    ctx.arc(0, 0, 25, 0, Math.PI);
    ctx.stroke();                           // Stroke the path

    // The eyes
    ctx.beginPath();                        // Begin a new path
    ctx.fillStyle = "hsl(50, 60%, 95%)";
    ctx.arc(-15, -20, 5, 0, 2 * Math.PI);
    ctx.arc(15, -20, 5, 0, 2 * Math.PI);
    ctx.fill();                           // Stroke the path

    // This moves the origin and rotation back to normal
    ctx.restore();                          // Restore the saved context
}



// To animate, you will need to run a function every frame like this
// This function basically just calls the two above functions
let prev;   // we will store the previous timestamp here 
function frame(timestamp) {
    elapsed = timestamp - (prev || timestamp);
    // Notice I'm calculating the number of seconds
    update(elapsed / 1000);
    draw(ctx);
    prev = timestamp;
    window.requestAnimationFrame(frame);
}

// This triggers the first call to our frame function
window.requestAnimationFrame(frame);