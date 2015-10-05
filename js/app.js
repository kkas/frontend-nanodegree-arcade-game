// Superclass
var Charactor = function() {
    // Position of the enemy on the x-axis.
    this.x = 0;

    // Position of the enemy on the y-axis.
    this.y = 0;

    // Coordinates of the enemy object on the canvas.
    // Used for collision detection.
    this.top = 0;
    this.bottom = 0;
    this.left = 0;
    this.right = 0;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    // You need to call setSprite() to set the image.
    this.sprite = '';
};
// Set the sprite image.
Charactor.prototype.setSprite = function(sprite) {
    this.sprite = sprite;
};

// Set the position of the charactor.
Charactor.prototype.setPosition = function(position) {
    this.x = position.x;
    this.y = position.y;

    // Calcurate and updates the top, bottom, right, and
    // left coordinates based on the assigned x and y values.
    this.top = this.y;
    this.bottom = this.y + SPRITE_HEIGHT;
    this.left = this.x;
    this.right = this.x + SPRITE_WIDTH;
};

// Render the charactor on the screen, required method for game
Charactor.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y - SPRITE_TOP_MARGIN);
};

// Enemies our player must avoid
// Subclass of 'Charactor'
var Enemy = function(position, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // Initialize the enemy using Superclass's constructor
    Charactor.call(this);

    // How much pixel the enemy moves per frame.
    this.enemyMovePerFrame = 0;

    // Set the enemy's sprite.
    this.setSprite('images/enemy-bug.png');

    // Set the initial position of the enemy.
    this.setPosition(position);

    // Set the initial speed of the enemy.
    this.setSpeed(speed);
};
Enemy.prototype = Object.create(Charactor.prototype);
Enemy.prototype.constructor = Enemy;

// Set the speed of the enemy.
Enemy.prototype.setSpeed = function(speed) {
    this.enemyMovePerFrame = speed;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.setPosition({
        "x": this.x + this.enemyMovePerFrame * dt,
        "y": this.y
    });

    // Check to see if the enemy is colliding with the player.
    if (this.isColliding(player)) {
        console.log("Collision detected!");
        resetGame();
    }

    // Check to see if the enemy reaches out of the canvas or not.
    if (this.left > canvasSize.effectiveWidth) {
        // Reset the position of the enemy by assigning random
        // position.
        this.setPosition(generateRandomEnemyPosition());
    }
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
// Subclass of 'Charactor'
var Player = function() {
    // Initialize the enemy using Superclass's constructor
    Charactor.call(this);

    // Value of one step on the x-axis
    this.INCREMENT_VALUE_OF_X = 101;

    // Value of one step on the y-axis
    this.INCREMENT_VALUE_OF_Y = 83;

    // Default sprite image of the player.
    this.setSprite('images/char-boy.png');

    // Player's initial position.
    // The numbers 2 and 5 indicate colum num and row num respectively.
    // The number starts from 0, so 2 will be the 3rd column.
    this.INITIAL_POSITION_X = this.INCREMENT_VALUE_OF_X * 2;
    this.INITIAL_POSITION_Y = this.INCREMENT_VALUE_OF_Y * 5;

    // These values are used to increment the player's position.
    // When the position of the player needs to be updated, for
    // example, when a key is pressed by the user,
    // the incremental/decremental value will be stored.
    this.xDelta = 0;
    this.yDelta = 0;

    // Initialize the instance.
    this.init();
};
Player.prototype = Object.create(Charactor.prototype);
Player.prototype.constructor = Player;

// Whatever the initialization functions are defined here.
Player.prototype.init = function() {
    // Set this player's initial position.
    this.resetPosition();

    // Set the initial value.
    this.resetDelta();
};

// Reset the position of the player to the initial postion.
Player.prototype.resetPosition = function() {
    this.setPosition(
        {
            "x": this.INITIAL_POSITION_X,
            "y": this.INITIAL_POSITION_Y
        }
    );
};

// Update the player's position, required method for game
Player.prototype.update = function() {
    this.setPosition(
        {
            "x": this.x + this.xDelta,
            "y": this.y + this.yDelta
        }
    );

    // Reset the delta counter.
    this.resetDelta();
};

// Set deltas of x and y. When values are set to this property
// the position of the player will be changed acording to this
// value. It will be reset after the update of the position.
Player.prototype.setDelta = function(xDelta, yDelta) {
    this.xDelta = xDelta || 0;
    this.yDelta = yDelta || 0;
};

// Reset the delta.
Player.prototype.resetDelta = function() {
    this.setDelta();
};

//TODO: Refactor with the enemy's one.
Player.prototype.canMoveOnX = function(step) {
    return (
        ((this.left + step) >= 0) &&
        ((this.right + step) <= canvasSize.effectiveWidth)
    );
};

//
Player.prototype.canMoveOnY = function(step) {
    return (
        (this.top + step) >= 0) &&
        ((this.bottom + step) <= canvasSize.effectiveHeight
    );
};

// Set Delta(next step) of x and y if the player is allowed
// to move to the position.
Player.prototype.setDeltaOrIgnore = function(dt_x, dt_y) {
    var new_dt_x,
        new_dt_y;

    if (dt_x !== undefined && this.canMoveOnX(dt_x)) {
        new_dt_x = dt_x;
    }

    if (dt_y !== undefined && this.canMoveOnY(dt_y)) {
        new_dt_y = dt_y;
    }

    this.setDelta(new_dt_x, new_dt_y);
};

Player.prototype.handleInput = function(key) {
    var step_x,
        step_y;

    switch(key) {
        case 'left':
            step_x = this.INCREMENT_VALUE_OF_X * -1;
            break;

        case 'right':
            step_x = this.INCREMENT_VALUE_OF_X;
            break;

        case 'up':
            step_y = this.INCREMENT_VALUE_OF_Y * -1;
            break;

        case 'down':
            step_y = this.INCREMENT_VALUE_OF_Y;
            break;

        default:
            break;
    }

    this.setDeltaOrIgnore(step_x, step_y);
};

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
// This function was borrowed from the following document.
// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Math/random
var getRandomIntInclusive = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Generates the random position for the enemy.
// This "random" means that choosing the position randomly from
// the specific rows since the enemy's y coordinate should be somewhere
// on the rows of the field.
// I don't want to change the row number, so that it makes the enemues stay
//  on the same row.
var generateRandomEnemyPosition = function() {
    // Set row number ranging from 1 to 3 because I want the enemies appear
    // only on the stone fields. (row 1 to 3).
    return {
        "x": ENEMY_INITIAL_X,
        "y": SPRITE_HEIGHT * getRandomIntInclusive(1, 3)
    };
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var NUM_ENEMIES = 5,
    SPRITE_WIDTH = 101,
    SPRITE_HEIGHT = 83,
    SPRITE_TOP_MARGIN = 20,
    MIN_ENEMY_SPEED = 50,
    MAX_ENEMY_SPEED = 200,
    allEnemies = [],
    player = new Player(),
    cnt,
    ENEMY_INITIAL_X = -200;

// Instantiates all of the enemies.
for (cnt = 0; cnt < NUM_ENEMIES; cnt++) {
    // Set the enemy on the first row.
    allEnemies.push(
        new Enemy(
            generateRandomEnemyPosition(),
            getRandomIntInclusive(MIN_ENEMY_SPEED, MAX_ENEMY_SPEED)
        )
    );
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
        enemy.setPosition(
            generateRandomEnemyPosition()
        );
    });

    player.resetPosition();
};
