(function() {
    'use strict';

    /**
     * Creates a new charactor.
     * This class is also a superclass of Enemy and Player classes
     * @constructor
     * @return {undefined}
     */
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

    /**
     * Sets the sprite of the charactor, shared method
     * @param {String} sprite - The uri of the sprite with in relative format
     * @return {undefined}
     */
    Charactor.prototype.setSprite = function(sprite) {
        this.sprite = sprite;
    };

    /**
     * Sets the position of the charactor, shared method
     * @param {Object} position - The object representing the position
     * of the charactor. It must contain 'x' and 'y' properties
     * @return {undefined}
     */
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

    /**
     * Renders the charactor on the screen, required method for game, shared method.
     * @return {undefined}
     */
    Charactor.prototype.render = function() {
        ctx.drawImage(
            Resources.get(this.sprite), this.x, this.y - SPRITE_TOP_PADDING);
    };

    /**
     * Enemies our player must avoid.
     * This class is a subclass of Charactor
     * @constructor
     * @param {Object} position - The object representing the position
     * @param {Number} speed - The speed of the enemy.
     * @return {undefined}
     */
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

    /**
     * Sets the speed of the enemy.
     * This value equals to the number of pixels the enemy moves
     * per frame.
     * @param {Number} speed - The enemy's speed.
     * @return {undefined}
     */
    Enemy.prototype.setSpeed = function(speed) {
        this.enemyMovePerFrame = speed;
    };

    /**
     * Updates the enemy's position, required method for game
     * @param  {Number} dt - A time delta between ticks
     * @return {undefined}
     */
    Enemy.prototype.update = function(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        this.setPosition({
            'x': this.x + this.enemyMovePerFrame * dt,
            'y': this.y
        });

        // Check to see if the enemy is colliding with the player.
        if (this.isColliding(player)) {
            console.log('Collision detected!');
            resetGame();
        }

        // Check to see if the enemy reaches out of the canvas or not.
        if (this.left > canvasSize.effectiveWidth) {
            // Reset the position of the enemy by assigning random
            // position.
            this.setPosition(generateRandomEnemyPosition());
        }
    };

    /**
     * Checks if the enemy is colliding into the player
     * I was looking for a way to detect collisions, and found this post below.
     * https://discussions.udacity.com/t/player-bug-collision-problem/15068/4?u=kkas
     *
     * I watched the following video and came up with the code in this function.
     * HTML5 Game Development - Physics - AABB Collision
     * https://www.udacity.com/course/viewer#!/c-cs255/l-52265917/e-130215280/m-129941633
     * @param  {Player}  player - The player object to check for collision.
     * @return {Boolean} True if the enemy is collided.
     */
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

    /**
     * Player we play.
     * This class is a subclass of Charactor
     * @constructor
     * @return {undefined}
     */
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
        // The reason for having these properties are to wait
        // for update() being called, in which these values are added to/subtracted
        // from the position of the player.
        this.xDelta = 0;
        this.yDelta = 0;

        // Initialize the instance by setting default values.
        this.init();
    };
    Player.prototype = Object.create(Charactor.prototype);
    Player.prototype.constructor = Player;

    /**
     * Initializes the player.
     * Whatever the initialization functions are defined here
     * @return {undefined}
     */
    Player.prototype.init = function() {
        // Set this player's initial position.
        this.resetPosition();

        // Set the initial value.
        this.resetDelta();
    };

    /**
     * Resets the position of the player to the initial postion.
     * @return {undefined}
     */
    Player.prototype.resetPosition = function() {
        this.setPosition(
            {
                'x': this.INITIAL_POSITION_X,
                'y': this.INITIAL_POSITION_Y
            }
        );
    };

    /**
     * Updates the player's position, required method for game.
     * It also resets the delta values.
     * When the player reaches to the water, the game will be reset.
     * @return {undefined}
     */
    Player.prototype.update = function() {
        this.setPosition(
            {
                'x': this.x + this.xDelta,
                'y': this.y + this.yDelta
            }
        );

        // Reset the delta counter.
        this.resetDelta();

        // Check to see if the player reaches the water.
        // If so, reset the game by moving the player to the initial location.
        if (this.hasReachedGoal()) {
            console.log('The player has reached the water! Reset the game.');
            // I didn't call resetGame() here because I wanted only the player
            // to go back to the initial location.
            this.resetPosition();
        }
    };

    /**
     * Checks if the player reaches the goal (the water areas).
     * The logic here is the same as detecting collision.
     * If the player collides into the water area, that means the player reaches
     * the goal.
     * @return {Boolean} True when the player reached the goal. Otherwise, false.
     */
    Player.prototype.hasReachedGoal = function() {
        return (
            this.top < waterArea.bottom &&
            this.left < waterArea.right &&
            this.bottom > waterArea.top &&
            this.right > waterArea.left
        );
    };

    /**
     * Set deltas of x and y. When values are set to this property the position
     * of the player will be changed acording to this value on the next update().
     * They will be reset after the update of the position.
     * Sets the default value of '0' if undefined is passed for the argment.
     * @param {Number} xDelta - The new delta for x. Sets 0 if undefined is passed.
     * @param {Number} yDelta - The new delta for y. Sets 0 if undefined is passed.
     * @return {undefined}
     */
    Player.prototype.setDelta = function(xDelta, yDelta) {
        this.xDelta = xDelta || 0;
        this.yDelta = yDelta || 0;
    };

    /**
     * Resets the delta to the initial values by calling setDelta() without
     * parameters.
     * @return {undefined}
     */
    Player.prototype.resetDelta = function() {
        this.setDelta();
    };

    /**
     * Checks if the player can move to the left/right (on x-axis).
     * This is similar to Player.canMoveOnY().
     * It checks the new location by comparing the left and right boundaries of the
     * field with the new locations, that are calculated by summing the 'step' and
     * the current values of left and right.
     * If the new value stays within the boundary, it returns true to indicate the
     * player can move. Otherwise, returns false.
     * @param  {Number} step - The number of pixels the player moves
     * @return {Boolean} True if the player's new position stays within the field
     * boundary. False, otherwise.
     */
    Player.prototype.canMoveOnX = function(step) {
        return this.left + step >= 0 &&
            this.right + step <= canvasSize.effectiveWidth;
    };

    /**
     * Checks if the player can move to the left/right (on y-axis).
     * This is similar to Player.canMoveOnX().
     * It checks the new location by comparing the top and bottom boundaries of the
     * field with the new locations, that are calculated by summing the 'step' and
     * the current values of top and bottom.
     * If the new value stays within the boundary, it returns true to indicate the
     * player can move. Otherwise, returns false.
     * @param  {Number} step - The number of pixels the player moves
     * @return {Boolean} True if the player's new position stays within the field
     * boundary. False, otherwise.
     */
    Player.prototype.canMoveOnY = function(step) {
        return this.top + step >= 0 &&
            this.bottom + step <= canvasSize.effectiveHeight;
    };

    /**
     * Sets delta(next step) values of x and y if the player's new location is
     * valid.
     * @param {Number} dt_x - A delta value on x-axis.
     * @param {Number} dt_y - A delta value on y-axis.
     * @return {undifined}
     */
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

    /**
     * Handles the inputs from the keyboard.
     * When pressed a key of:
     *  - 'left': the player moves one step to the west (if possible)
     *  - 'right': the player moves one step to the east (if possible)
     *  - 'up': the player moves one step to the north (if possible)
     *  - 'down': the player moves one step to the south (if possible)
     * When pressed anything else:
     *  - Just ignore
     * @param  {String} key - The string value of the input from keyboard
     * @return {undefined}
     */
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

    /**
     * Returns a random integer between min (included) and max (included)
     * Using Math.round() will give you a non-uniform distribution!
     *
     * This function was borrowed from the following document.
     * I needed to have a function to randomly generates an int number and the
     * sample function in MDN worked well.
     *
     * https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects
     * /Math/random
     * @param  {Number} min - Minimum possible value
     * @param  {Number} max - Maximum possible value
     * @return {Number} A random int number ranging from 'min' to 'max' inclusive.
     */
    var getRandomIntInclusive = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    /**
     * Generates the random position for the enemy, global function.
     * This 'random' means that choosing the position randomly from
     * the specific rows since the enemy's y coordinate should be somewhere
     * on the rows of the field.
     * I don't change the row number, so that it makes the enemues stay
     * on the same row.
     * @return {Object} The new, generated position (with properties of 'x' and 'y')
     */
    var generateRandomEnemyPosition = function() {
        // Set row number ranging from 1 to 3 because I want the enemies appear
        // only on the stone fields. (row 1 to 3).
        return {
            'x': ENEMY_INITIAL_X,
            'y': SPRITE_HEIGHT * getRandomIntInclusive(1, 3)
        };
    };

    /**
     * Generates the possible enemies speed, global function.
     * The range of the new generated values is from MIN_POSSIBLE_ENEMY_SPEED and
     * MAX_POSSIBLE_ENEMY_SPEED inclusive.
     * @return {Number} - The new speed for an enemy.
     */
    var generateRandomEnemySpeed = function() {
        return getRandomIntInclusive(
            MIN_POSSIBLE_ENEMY_SPEED, MAX_POSSIBLE_ENEMY_SPEED);
    };

    /**
     * Reset the game by resetting the positions of the player and the enemies,
     * global function.
     * @return {undefined}
     */
    var resetGame = function() {
        allEnemies.forEach(function(enemy){
            enemy.setPosition(
                generateRandomEnemyPosition()
            );
        });

        player.resetPosition();
    };

    // Now instantiate your objects.
    // Place all enemy objects in an array called allEnemies
    // Place the player object in a variable called player

    // Number of enemies
    var NUM_ENEMIES = 5,
        // Width in pixels of the sprite image. Currently, all of the sprites
        // have the same width.
        SPRITE_WIDTH = 101,
        // Height in pixels of the sprite image. Currently, all of the sprites
        // have the same height.
        SPRITE_HEIGHT = 83,
        // The invisible top padding of the sprite. Adjusting this value does not
        // affect the position of the sprite. This is used only for drawing the
        // image.
        SPRITE_TOP_PADDING = 30,
        // Minimum possible speed of the enemy. Since the speed are selected
        // randomly, this value is used for the slowest value in the range.
        MIN_POSSIBLE_ENEMY_SPEED = 50,
        // Maximum possible speed of the enemy. Since the speed are selected
        // randomly, this value is used for the fastest value in the range.
        MAX_POSSIBLE_ENEMY_SPEED = 200,
        // Array that stores the Enemy objects.
        allEnemies = [],
        // Player object
        player = new Player(),
        // counter used in iteration.
        cnt,
        // Default position of the enemy on x-axis. Since the enemy comes in from
        // the left side of the game board, the value is a negative value.
        ENEMY_INITIAL_X = -200;

    // Instantiates all of the enemies.
    for (cnt = 0; cnt < NUM_ENEMIES; cnt++) {
        // Set the enemy on the first row.
        allEnemies.push(
            new Enemy(
                generateRandomEnemyPosition(),
                generateRandomEnemySpeed()
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
})();