// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // Position of the enemy on the x-axis.
    this.x = 0;

    // Position of the enemy on the y-axis.
    this.y = 0;

    this.top = this.y;
    this.bottom = this.y + SPRITE_HEIGHT;
    this.left = this.x;
    this.right = this.x + SPRITE_WIDTH;

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

// Set the enemy's postion.
Enemy.prototype.setPosition = function(x, y) {
    this.x = x;
    this.y = y;

    // Calcurate and updates the top, bottom, right, and
    // left coordinates based on the assigned x and y values.
    this.top = this.y;
    this.bottom = this.y + SPRITE_HEIGHT;
    this.left = this.x;
    this.right = this.x + SPRITE_WIDTH;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.setPosition(
        this.x + this.enemyMovePerFrame * dt, this.y);

    // Check to see if the enemy is colliding with the player.
    if (this.isColliding(player)) {
        console.log("Collision detected!");
        resetGame();
    }

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

Enemy.prototype.isColliding = function(player) {
    return (
        this.top < player.bottom &&
        this.left < player.right &&
        this.bottom > player.top &&
        this.right > player.left
    );
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
    // Value of one step on the x-axis
    this.INCREMENT_VALUE_OF_X = 101;

    // Value of one step on the y-axis
    this.INCREMENT_VALUE_OF_Y = 83;

    // Default sprite image of the player.
    this.sprite = 'images/char-boy.png';

    this.top = this.y;
    this.bottom = this.y + SPRITE_HEIGHT;
    this.left = this.x;
    this.right = this.x + SPRITE_WIDTH;

    // These values are used to increment the player's position.
    // When the position of the player needs to be updated, for
    // example, when a key is pressed by the user,
    // the incremental/decremental value will be stored.
    // TODO: Check if this is allowed (there is a warning that
    // assignment or function call is expected. But I wanted to
    // have any initialization in init() and variables declaration
    // is here for readability.)
    this.xDelta;
    this.yDelta;

    // Initialize the instance.
    this.init();
};

// Whatever the initialization functions are defined here.
Player.prototype.init = function() {
    // Set this player's initial position.
    this.resetPosition();

    // Set the initial value.
    this.setDelta(0, 0);
};

// Reset the position of the player to the initial postion.
Player.prototype.resetPosition = function() {
    // The numbers 2 and 5 indicate colum num and row num respectively.
    // The number starts from 0, so 2 will be the 3rd column, for example.
    this.x = this.INCREMENT_VALUE_OF_X * 2;
    this.y = this.INCREMENT_VALUE_OF_Y * 5 - SPRITE_TOP_MARGIN;
};

// Set the poistion of the player.
// TODO: Refactor with enemy's one.
Player.prototype.setPosition = function(x, y) {
    this.x = x;
    this.y = y;

    // Calcurate and updates the top, bottom, right, and
    // left coordinates based on the assigned x and y values.
    this.top = this.y;
    this.bottom = this.y + SPRITE_HEIGHT;
    this.left = this.x;
    this.right = this.x + SPRITE_WIDTH;
};

// Update the player's position, required method for game
Player.prototype.update = function() {
    // this.x += this.xDelta;
    // this.y += this.yDelta;
    this.setPosition(this.x + this.xDelta, this.y + this.yDelta);

    // Reset the delta counter.
    this.setDelta(0, 0);
};

// Set deltas of x and y. When values are set to this property
// the position of the player will be changed acording to this
// value. It will be reset after the update of the position.
Player.prototype.setDelta = function(xDelta, yDelta) {
    this.xDelta = xDelta;
    this.yDelta = yDelta;
};

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
            if (this.canMoveOnX(step)) {
                this.setDelta(step, 0);
            }
            break;

        case 'right':
            step = this.INCREMENT_VALUE_OF_X;
            if (this.canMoveOnX(step)) {
                this.setDelta(step, 0);
            }
            break;

        case 'up':
            step = this.INCREMENT_VALUE_OF_Y * -1;
            if (this.canMoveOnY(step)) {
                this.setDelta(0, step);
            }
            break;

        case 'down':
            step = this.INCREMENT_VALUE_OF_Y;
            if (this.canMoveOnY(step)) {
                this.setDelta(0, step);
            }
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
    SPRITE_TOP_MARGIN = 10,
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

// Reset the game by resetting the positions of the player and the enemies.
var resetGame = function() {
    allEnemies.forEach(function(enemy){
        enemy.setInitialPosition();
    });

    player.resetPosition();
};
