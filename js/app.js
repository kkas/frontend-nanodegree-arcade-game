(function(global) {
    // Run the entire code of this file in 'strict' mode
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
     * Renders the charactor on the screen, required method for game, shared
     * method.
     * @return {undefined}
     */
    Charactor.prototype.render = function() {
        ctx.drawImage(
            Resources.get(this.sprite), this.x, this.y - SPRITE_TOP_PADDING);
    };

    /**
     * Checks if the 'this'(Charactor object) is colliding into the
     * objInQuestion. This function is used in the subclass of Charactor class.
     * For example, it checks if the enemy is colliding into the player.
     *
     * I was looking for a way to detect collisions, and found this post below.
     * https://discussions.udacity.com/t/player-bug-collision-problem/15068/4?u=
     * u=kkas
     *
     * I watched the following video and came up with the code in this function.
     * HTML5 Game Development - Physics - AABB Collision
     * https://www.udacity.com/course/viewer#!/c-cs255/l-52265917/e-130215280/m-
     * 129941633
     * @param  {Object} objInQuestion - The object being checked for collision.
     * Currently, this object is assumed that it has 'bottom', 'right', 'top',
     * 'left' properties that represent the x and y coordinates of the imaginary
     * box for the object.
     * @return {Boolean} True if the 'this' (charactor object) is colliding into
     * 'objInQuestion'.
     */
    Charactor.prototype.isColliding = function(objInQuestion) {
        //TODO: check the type of 'objInQuestion' to ensure it has the bottom,
        //right, top, and left properties.
        return (
            this.top < player.bottom &&
            this.left < player.right &&
            this.bottom > player.top &&
            this.right > player.left
        );
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

        // Score that the player will loose when hit
        this.SCORE = -10;

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
     * Gets the speed of the enemy.
     * This value equals to the number of pixels the enemy moves
     * per frame.
     * @return {Number} - The curent speed of the enemy.
     */
    Enemy.prototype.getSpeed = function() {
        return this.enemyMovePerFrame;
    };

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
     * If the enemy collides into the player, the player will
     * loose some scores.
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
        // If the game is over, there is no need to check the collision.
        if (!player.isPaused && this.isColliding(player)) {
            console.log('Collision detected!');
            // Adding score here means loosing the score.
            score.addScore(this.SCORE);

            // IF the score reaches 0, the game is over.
            if (score.getScore() <= 0) {
                console.log('The game is over');
                gameOver();
            } else {
                // Reset the stage
                resetStage();
            }
        }

        // Check to see if the enemy reaches out of the canvas or not.
        if (this.left > canvasSize.effectiveWidth) {
            // Reset the position of the enemy by assigning random
            // position.
            this.setPosition(generateRandomEnemyPosition());
        }
    };

    /**
     * Increases the speed of the enemy. The value in 'speed' will be added
     * to the current speed.
     * @param  {Number} speed - Value of the speed to increase.
     * @return {undefined}
     */
    Enemy.prototype.increaseSpeed = function(speed) {
        this.setSpeed(this.getSpeed() + speed);
    };

    /**
     * Call this function when the game is over.
     * This function turns on the flags:
     * <ul>
     * <li>for the player to be moved</li>
     * <li>for the 'game over' message to show</li>
     * </ul>
     * @return {undefined}
     */
    var gameOver = function() {
        player.isPaused = true;
        message.showGameOver();
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
        // for update() being called, in which these values are added to/subtrac
        // ted from the position of the player.
        this.xDelta = 0;
        this.yDelta = 0;

        /**
         * Flag that indicates the player can move.
         * This value will be used to prevent moving the player in situations
         * such as when some messages are displayed on the board, or
         * the game has been over.
         * @type {Boolean}
         */
        this.isPaused = false;

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
            console.log('The player has reached the water!' +
                'Go to the next stage.');
            nextStage();
        }
    };

    /**
     * Checks if the player reaches the goal (the water areas).
     * The logic here is the same as detecting collision.
     * If the player collides into the water area, that means the player reaches
     * the goal.
     * @return {Boolean} True when the player reached the goal.
     * Otherwise, false.
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
     * @param {Number} xDelta - The new delta for x. Sets 0 if undefined is
     * passed.
     * @param {Number} yDelta - The new delta for y. Sets 0 if undefined is
     * passed.
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
     * It checks the new location by comparing the left and right boundaries of
     * the field with the new locations, that are calculated by summing the
     * 'step' and the current values of left and right.
     * If the new value stays within the boundary, it returns true to indicate
     * the player can move. Otherwise, returns false.
     * @param  {Number} step - The number of pixels the player moves
     * @return {Boolean} True if the player's new position stays within the
     * field boundary. False, otherwise.
     */
    Player.prototype.canMoveOnX = function(step) {
        return this.left + step >= 0 &&
            this.right + step <= canvasSize.effectiveWidth;
    };

    /**
     * Checks if the player can move to the left/right (on y-axis).
     * This is similar to Player.canMoveOnX().
     * It checks the new location by comparing the top and bottom boundaries of
     * the field with the new locations, that are calculated by summing the
     * 'step' and the current values of top and bottom.
     * If the new value stays within the boundary, it returns true to indicate
     * the player can move. Otherwise, returns false.
     * @param  {Number} step - The number of pixels the player moves
     * @return {Boolean} True if the player's new position stays within the
     * field boundary. False, otherwise.
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

        // Set the deltas only when the player is not paused.
        if (!this.isPaused) {
            this.setDeltaOrIgnore(step_x, step_y);
        }
    };

    /**
     * Item class that is a super class of all the items in this gamee, such as
     *  Heart, and Gems.
     * This class is also a subclass of Charactor.
     * @constructor
     * @param {[type]} position [description]
     */
    var Item = function(position) {
        // Initialize the enemy using Superclass's constructor
        Charactor.call(this);

        /**
         * Flag that indicates if this instance is collected by the player.
         * The default value is false (has not collected yet).
         * @type {Boolean}
         */
        this.collected = false;

        /**
         * The score the player will earn when collected.
         * This value will be the default value. If you want to change it,
         *  you just simply overrides it in the subclass.
         * @type {Number}
         */
        this.SCORE = 10;

        // Set the initial position.
        this.setPosition(position);
    };
    Item.prototype = Object.create(Charactor.prototype);
    Item.prototype.constructor = Item;

    /**
     * Updates the Item object's properties.
     * Currently, this function updates:
     * <ul>
     * <li>this.collected with the result from the collision checking
     *  with the player.</li>
     * <li>scores of the player</li>
     * </ul>
     * @return {undefined}
     */
    Item.prototype.update = function() {
        // If the 'this' item has been collected, I don't need to
        // check the collision.
        if (!this.collected && this.isColliding(player)) {
            this.collected = true;
            score.addScore(this.SCORE);
        }
    };

    /**
     * Renders the Item object on the screen as long as the 'collected' is
     * false
     * @override
     * @return {undefined}
     */
    Item.prototype.render = function() {
        if (!this.collected) {
            ctx.drawImage(
                Resources.get(this.sprite),
                this.x,
                this.y - SPRITE_TOP_PADDING
            );
        }
    };

    /**
     * Heart that the player collects.
     * This class is a subclass of Item
     * @constructor
     * @param {Object} position - Position object that has x and y coordinates.
     * This will be used for the position of the newly generated heart object
     * @return {undefined}
     */
    var Heart = function(position) {
        // Initialize the heart using Superclass's constructor
        Item.call(this, position);

        // Default sprite image of the heart.
        this.setSprite('images/Heart.png');
    };
    Heart.prototype = Object.create(Item.prototype);
    Heart.prototype.constructor = Heart;

    /**
     * Gem that the player collects.
     * This class is a subclass of Item
     * @constructor
     * @param {Object} position - Position object that has x and y coordinates.
     * This will be used for the position of the newly generated object
     * @return {undefined}
     */
    var Gem = function(position) {
        // Initialize the object using Superclass's constructor
        Item.call(this, position);

        /**
         * sprite image URI of a blue gem.
         * @type {String}
         */
        this.SPRITE_BLUE = 'images/Gem Blue.png';

        /**
         * sprite image URI of a green gem.
         * @type {String}
         */
        this.SPRITE_GREEN = 'images/Gem Green.png';

        /**
         * sprite image URI of a orange gem.
         * @type {String}
         */
        this.SPRITE_ORANGE = 'images/Gem Orange.png';

        /**
         * Constant integer value that indicates Blue Gem.
         * This is mostly used when choosing color of the gem randomly.
         * Do not change the value. There is a dependency to the order.
         * @type {Number}
         */
        this.BLUE = 0;

        /**
         * Constant integer value that indicates Green Gem.
         * This is mostly used when choosing color of the gem randomly.
         * Do not change the value. There is a dependency to the order.
         * @type {Number}
         */
        this.GREEN = 1;

        /**
         * Constant integer value that indicates Orange Gem.
         * This is mostly used when choosing color of the gem randomly.
         * Do not change the value. There is a dependency to the order.
         * @type {Number}
         */
        this.ORANGE = 2;

        // Set the initial color randomly
        this.changeColorRandomly();
    };
    Gem.prototype = Object.create(Item.prototype);
    Gem.prototype.constructor = Gem;

    /**
     * Selects a color randomly and sets it for the gem.
     * @return {undefined}
     */
    Gem.prototype.changeColorRandomly = function() {
        // The values passed into getRandomIntInclusive() assues they are
        // integer values and Blue is the smallest value and the largest for
        // Orange.
        this.setColor(getRandomIntInclusive(this.BLUE, this.ORANGE));
    };

    /**
     * Sets the color of the gem.
     * @param {Number} newColor - Integer that represents the color of a gem.
     */
    Gem.prototype.setColor = function(newColor) {
        switch(newColor) {
            case this.BLUE:
                this.setSprite(this.SPRITE_BLUE);
            break;
            case this.GREEN:
                this.setSprite(this.SPRITE_GREEN);
            break;
            case this.ORANGE:
                this.setSprite(this.SPRITE_ORANGE);
            break;
            default:
                console.log('Unexpected value for the color is selected.' +
                    'There is something wrong in Gem.prototype.setColor.');
                break;
        }
    };

    /**
     * Score class. Actually, I am not sure if the score should be a
     * class since I need only one instance. However, I think making it
     * as a class is convinient since it can hold many relating functions like
     * the other pseudo classical classes do.
     * @constructor
     * @return {Score} Newly created Score object (with constructor mode)
     */
    var Score = function(defaultScore) {
        // The score
        this.score = 0;

        // Set the default score
        this.setScore(defaultScore);

        /**
         * The highest score that the player has gotten in the game.
         * @type {Number}
         */
        // Do this after score is set in order to set the initial score
        this.highScore = this.getScore();
    };

    /**
     * Gets the current score.
     * @return {Number} Current score
     */
    Score.prototype.getScore = function() {
        return this.score;
    };

    /**
     * Sets newScore as the current score.
     * @param {[type]} newScore [description]
     * @return {undefined}
     */
    Score.prototype.setScore = function(newScore) {
        this.score = newScore || 0;
    };

    /**
     * Adds scoreEarned to the current score and make the result as
     * the new current score. When loosing points, the value passed as
     * the argument is a minus value. So, adding a minus number equals to
     * subtracting the number.
     * @param {Number} score - Score to be added
     * @return {undefined}
     */
    Score.prototype.addScore = function(score) {
        this.score += score;

        // Check to see if the score exceeds the current highest score.
        if (this.highScore < this.score) {
            this.highScore = this.score;
        }
    };

    /**
     * Renders the score on the board. This function is called from
     * engine.js.
     * @return {[type]} [description]
     */
    Score.prototype.render = function() {
        // Save the states before changing them.
        ctx.save();

        ctx.font = '36pt Impact';
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;

        // Draw the current score
        ctx.fillText('Score: ' + this.score, 10, 100);
        ctx.strokeText('Score: ' + this.score, 10, 100);

        // Draw the highest score
        ctx.fillText('Highest Score: ' + this.highScore, 10, 140);
        ctx.strokeText('Highest Score: ' + this.highScore, 10, 140);

        // Restore the privious setting.
        ctx.restore();
    };

    /**
     * Message class. The parameter to the constructor is the message that will
     * be displayed on the screen. If you want to remove the message, simply
     * set the message to an empty string by setMessage().
     *
     * Actually, I am not sure if the Message should be a
     * class since I need only one instance. However, I think making it
     * as a class is convinient since it can hold many relating functions like
     * the other pseudo classical classes do.
     *
     * @constructor
     * @return {Message} Newly created Message instance (with constructor mode)
     */
    var Message = function() {

        /**
         * Interger value that indicates there is no message to be shown.
         * This value will be set to 'showMessage'.
         * @type {Number}
         */
        this.NO_MESSAGE = 0;

        /**
         * Interger value that indicates the game is over.
         * This value will be set to 'showMessage'.
         * @type {Number}
         */
        this.GAME_OVER = 1;

        /**
         * This variable is used like a flag with an integer value that
         * indicates whether the message needs to be shown or not.
         * For example, 0 indicates there should be no message to display.
         * 1 is for displaying the messages for 'game over'.
         * Default is 0 (no message).
         * @type {Number}
         */
        this.showMessage = this.NO_MESSAGE;
    };

    /**
     * Call this when the game is over. This function will turn the flag on to
     * display the messages for 'game over'.
     * @return {undefined}
     */
    Message.prototype.showGameOver = function() {
        this.showMessage = this.GAME_OVER;
    };

    /**
     * Renders the message on the board. This function is called from
     * engine.js.
     * @return {undefined}
     */
    Message.prototype.render = function() {
        var message_top = '',
            message_bottom = '';

        // If the 'show' flag is true, it means there's some messages I want
        // to show.
        if (this.showMessage) {

            // Save the states before changing them.
            ctx.save();

            switch (this.showMessage) {
                case this.GAME_OVER:
                    message_top = 'Game Over';

                    ctx.font = '70pt Impact';
                    ctx.textAlign = "center";
                    ctx.fillStyle = 'yellow';
                    ctx.strokeStyle = 'white';
                    ctx.lineWidth = 3;

                    // Display the message in the middle of the canvas.
                    // Draw the inner area of the text.
                    ctx.fillText(
                        message_top,
                        canvasSize.effectiveWidth / 2,
                        canvasSize.effectiveHeight / 2
                    );

                    // Draw the outer line of the text.
                    ctx.strokeText(
                        message_top,
                        canvasSize.effectiveWidth / 2,
                        canvasSize.effectiveHeight / 2
                    );
                break;
                default:
                    //nothing
                    console.log('unexpected value is found in ' +
                        'Message.prototype.render()');
                break;
            }

            // Restore the privious setting.
            ctx.restore();
        }
    };

    /**
     * Returns a random integer between min (included) and max (included)
     * Using Math.round() will give you a non-uniform distribution!
     *
     * This function was borrowed from the following document.
     * I needed to have a function to randomly generates an int number and the
     * sample function in MDN worked well.
     *
     * https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Obj
     * ects/Math/random
     * @param  {Number} min - Minimum possible value
     * @param  {Number} max - Maximum possible value
     * @return {Number} A random int number ranging from 'min' to 'max'
     * inclusive.
     */
    var getRandomIntInclusive = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    /**
     * Generates new enemies. The 'num' number of enemies will be created.
     * @param  {Array} arrayOfEnemies - Array that will store the newly created
     * enemy objects.
     * @param  {Number} num - The number of enemies you want to generate.
     * @return {undefined}
     */
    var generateEnemies = function(arrayOfEnemies, num) {
        var cnt;

        for (cnt = 0; cnt < num; cnt++) {
            // Set the enemy on the first row.
            arrayOfEnemies.push(
                new Enemy(
                    generateRandomEnemyPosition(),
                    generateRandomEnemySpeed()
                )
            );
        }
    };

    /**
     * Generates the random position for the enemy, global function.
     * This 'random' means that choosing the position randomly from
     * the specific rows since the enemy's y coordinate should be somewhere
     * on the rows of the field.
     * I don't change the row number, so that it makes the enemues stay
     * on the same row.
     * @return {Object} The new, generated position (with properties of 'x' and
     * 'y')
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
     * The range of the new generated values is from MIN_POSSIBLE_ENEMY_SPEED
     * and MAX_POSSIBLE_ENEMY_SPEED inclusive.
     * @return {Number} - The new speed for an enemy.
     */
    var generateRandomEnemySpeed = function() {
        return getRandomIntInclusive(
            MIN_POSSIBLE_ENEMY_SPEED, MAX_POSSIBLE_ENEMY_SPEED);
    };

    /**
     * Generates the item's postion randomly.
     * @return {Ojbect} - Object that has x and y properties for its position.
     */
    var generateRandomItemPosition = function() {
        // Set a row number ranging from 1 to 3 because I want the items to
        // appear only on the stone fields. (row 1 to 3).
        // The same thought is applied to the column, 'x', I want the item to
        // appear on somewhere between row 0 to 4.
        return {
            'x': SPRITE_WIDTH * getRandomIntInclusive(0, 4),
            'y': SPRITE_HEIGHT * getRandomIntInclusive(1, 3)
        };
    };

    /**
     * Generates the item's position only if the position is vacant.
     * This vacancy will be determined by the position objects in
     * 'arrayOfItemPositions' array.
     * @param  {Array} arrayOfItemPositions - Array that contains the position
     * objects to indicate the positions have already been taken.
     * @return {Object} New postion object
     */
    var generateEffectiveRandomPosition = function(arrayOfItemPositions) {
        var newItemPosition,
            needToRegenerate;

        // For items, I don't want more than one item to be shown at the
        // same position. Therefore, I checked the newly generated position
        // with the ones that have already generated. If it has the same
        // position, the position will be re-generate until it has the
        // different position.
        do {
            newItemPosition = generateRandomItemPosition();

            if (checkIfExists(arrayOfItemPositions, newItemPosition)) {
                needToRegenerate = true;
            } else {
                needToRegenerate = false;
            }

        // Repeat this loop until needToRegenerate becomes false
        } while (needToRegenerate);

        return newItemPosition;
    };

    /**
     * Generates Items that will be used in the game.
     * Currently, this creates item objects of:
     * <ul>
     * <li>Hearts</li>
     * <li>Gems</li>
     * </ul>
     * @return {undefined}
     */
    var generateItems = function() {
        var occupiedPositions = [];

        // Delete all of the objects stored in the arrays before adding the
        // new ones.
        //
        // In order for this deletion, I reset all the hearts and gems by
        // inserting 0 to the length of the 'allItem' array. The reason for this
        // is that replacing the pointer to the array does not work
        // since it is assigned in the property of the global object.
        //
        // I searched for a way to delete all the elements in an array and
        // found the solusion at stackoverflow by assinging 0 to the length of
        // the array (the 2nd method).
        // http://stackoverflow.com/questions/1232040/how-to-empty-an-array-in-
        // javascript
        allItems.length = 0;

        createItems(allItems, occupiedPositions, NUM_GEMS, Heart);
        createItems(allItems, occupiedPositions, NUM_GEMS, Gem);
    };

    /**
     * Creates Item objects of Klass (constructor) referes to. Since all of the
     * classes that are the derived from the Item class have the same data
     * structure, passing the constructor of the class I want to create works
     * well.
     *
     * Each items that are created will have the different position by looking
     * at the position objects in 'arrayOfOccupiedPos' array.
     *
     * The new position will be created only if the position is vacant.
     *
     * If no objects in 'arrayOfOccupiedPos' array have the same position
     * with the newly generated position, 'newItemPosition', the position
     * will be the position of the new objects.
     *
     * The objects in 'arrayOfOccupiedPos' array will be updated with all of
     * the newly created position objects.
     *
     * @param {Array} newItemsArray - Array that will be used to store the newly
     * generated objects.
     * @param {Array} arrayOfOccupiedPositions - Array that contains the
     * position objects which indicate the positions that have been taken.
     * The objects in this array will be updated with all of the newly
     * created position objects.
     * @param  {Number} num - How many gems you want to generate.
     * @param {Constructor} Klass - Constructor of the class you want to create.
     * @return {undefined}
     */
    var createItems = function(newItemsArray, arrayOfOccupiedPos, num, Klass) {
        var cnt,
            newItemPosition;

        for (cnt = 0; cnt < num; cnt++) {
            newItemPosition = generateEffectiveRandomPosition(
                arrayOfOccupiedPos);
            newItemsArray.push(new Klass(newItemPosition));

            // Save the position to update.
            arrayOfOccupiedPos.push(newItemPosition);
        }
    };

    /**
     * Checks if the items in itemArray has the same posiotion(x and y)
     * with the itemInQuestion.
     * Each object stored in itemArray is assumed that it has already existed
     * (created) and have x and y properties for its position.
     * @param  {Array} itemArray - Array that stores the existing items.
     * @param  {Object} itemInQuestion - Item being checked
     * @return {Boolean} True if the posion of the itemInQuestion matches the
     * position of any items stored in itemArray. False, otherwise.
     */
    var checkIfExists = function(itemArray, itemInQuestion) {
        var cnt,
            itemExists;

        // If any item is found on the same position,
        // stop checking and return true.
        for (cnt = 0; cnt < itemArray.length; cnt++) {
            itemExists = itemArray[cnt];

            if (itemInQuestion.x === itemExists.x &&
                itemInQuestion.y === itemExists.y) {
                return true;
            }
        }

        return false;
    };

    /**
     * Reset the stage by resetting the positions of the player and the enemies.
     * @return {undefined}
     */
    var resetStage = function() {
        resetEnemiesPositions();

        player.resetPosition();

        // generateItems(); // bug.
    };

    /**
     * Resets the positions of all of the enemies.
     * @return {undefined}
     */
    var resetEnemiesPositions = function() {
        allEnemies.forEach(function(enemy){
            enemy.setPosition(
                generateRandomEnemyPosition()
            );
        });
    };

    /**
     * Increases the speeds of all the existing ememies.
     * @param  {Number} speed - The value that will be added to the current
     * enemies' speeds.
     * @return {undefined}
     */
    var increaseEnemiesSpeeds = function(speed) {
        allEnemies.forEach(function(enemy){
            enemy.increaseSpeed(speed);
        });
    };

    /**
     * Called when you need to go to the next stage.
     * Currently, it does:
     * <ul>
     * <li>Increasing the speeds of the enemies</li>
     * <li>Resetting the player's position</li>
     * <li>Regenerating the hearts</li>
     * </ul>
     * @return {undefined}
     */
    var nextStage = function() {

        increaseEnemiesSpeeds(ADDITIONAL_ENEMY_SPEED);

        player.resetPosition();

        generateItems();
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
        // The invisible top padding of the sprite. Adjusting this value does
        // not affect the position of the sprite. This is used only for drawing
        // the image.
        SPRITE_TOP_PADDING = 30,
        // Minimum possible speed of the enemy. Since the speed are selected
        // randomly, this value is used for the slowest value in the range.
        MIN_POSSIBLE_ENEMY_SPEED = 50,
        // Maximum possible speed of the enemy. Since the speed are selected
        // randomly, this value is used for the fastest value in the range
        // as the initial value.
        MAX_POSSIBLE_ENEMY_SPEED = 200,
        // Speed that will be added to increase the speed of the enemies.
        ADDITIONAL_ENEMY_SPEED = 50,
        // Array that stores the Enemy objects.
        allEnemies = [],
        // Player object
        player = new Player(),
        // Default position of the enemy on x-axis. Since the enemy comes in
        // from the left side of the game board, the value is a negative value.
        ENEMY_INITIAL_X = -200,
        /**
         * Array that holds all the items, such as Gems, Hearts, in the game
         * @type {Array}
         */
        allItems = [],
        // Number of Hearts
        NUM_HEARTS = 2,
        // Number of Gems
        NUM_GEMS = 2,
        // Score object that holds the score of the entire game.
        score = new Score(10),
        // Message object. Only one instance of this should be created.
        message = new Message();

    // Instantiates all of the enemies.
    generateEnemies(allEnemies, NUM_ENEMIES);

    // Instantiates all the items.
    generateItems();

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

    // Store these properties to the global object.
    // Since engine.js refers to these objects.
    // I put the entire code in this file into an anonymous function
    // with the global object as the parameter, so that I need to think only
    // about this js file to run in the 'strict mode'.
    global.allEnemies = allEnemies;
    global.player = player;
    global.allItems = allItems;
    global.score = score;
    global.message = message;
})(this);
