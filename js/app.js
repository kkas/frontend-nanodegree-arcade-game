// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // Position of the enemy on the x-axis.
    this.x = 0;

    // Position of the enemy on the y-axis.
    this.y = 0;

    // How much pixel the enemy moves per frame.
    this.enemyMovePerFrame = 50;

    // True when the object is out of the canvas.
    this.isOutOfFrame = false;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Initialize the instance.
    this.init();
};

// Whatever the initialization functions are defined here.
Enemy.prototype.init = function() {
    // Assign this enemy's initial position.
    this.setInitialPosition();
};

// Sets the initial position of the enemy.
Enemy.prototype.setInitialPosition = function() {
    this.x = -200;
    this.y = 60; // on the first row.
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.enemyMovePerFrame * dt;
    if (this.isOutOfFrame) {
        // Reset the position of the enemy.
        this.setInitialPosition();

        // Reset the flag for the next.
        this.isOutOfFrame = false;
    }

    // Check to see if the enemy reaches out of the canvas or not.
    if (this.x > canvasSize.width) {
        console.log("Enemy is out of frame. Reset the position.");
        this.isOutOfFrame = true;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
    this.INCREMENT_VALUE_OF_X = 101;
    this.INCREMENT_VALUE_OF_Y = 83;
    // this.x = 205;
    // this.y = 406;
    this.x = 0;
    this.y = -10; // Seems the sprite image has some top margin.
    this.sprite = 'images/char-boy.png';
};
Player.prototype.update = function() {};

// TODO: Refactor with the enemy's one.
// Render the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//TODO: Refactor with the enemy's one.
Player.prototype.canMoveOnX = function(step) {
    console.log("this.x + step: " + (this.x + step));
    return this.x + step >= 0 && this.x + step <= canvasSize.width - SPRITE_WIDTH;
};

Player.prototype.canMoveOnY = function(step) {
    console.log("this.y + step: " + (this.y + step));
    return this.y + step >= -30 && this.y + step < canvasSize.height - SPRITE_HEIGHT;
};

Player.prototype.handleInput = function(key) {
    var step;

    switch(key) {
        case 'left':
            step = this.INCREMENT_VALUE_OF_X * -1;
            this.x += this.canMoveOnX(step) ? step : 0;
            break;

        case 'right':
            step = this.INCREMENT_VALUE_OF_X;
            this.x += this.canMoveOnX(step) ? step : 0;
            break;

        case 'up':
            step = this.INCREMENT_VALUE_OF_Y * -1;
            this.y += this.canMoveOnY(step) ? step : 0;
            break;

        case 'down':
            step = this.INCREMENT_VALUE_OF_Y;
            this.y += this.canMoveOnY(step) ? step : 0;
            break;

        default:
            console.log('key is not supported: ' + key);
            break;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var NUM_ENEMIES = 1,
    SPRITE_WIDTH = 101,
    SPRITE_HEIGHT = 171,
    allEnemies = [],
    player = new Player(),
    cnt;


// Instantiates all of the enemies.
for (cnt = 0; cnt < NUM_ENEMIES; cnt++) {
    allEnemies.push(new Enemy());
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
