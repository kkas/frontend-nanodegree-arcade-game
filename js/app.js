/**
 * I have created some classes with some inheritance. So, I will describe
 * the relationships between them to give the bird's eye of the program.
 *
 * <Class Relationship>
 * <Entity>
 *    |
 *    ----------------------------------------------------------
 *    |                   |                                    |
 * <Charactor>          <Item>                             <Obstacle>
 *      |                 |                                    |
 *      ---------         -------------------------            |
 *      |       |         |       |        |      |            |
 *   <Enemy> <Player>  <Heart>  <Gem>    <Key>  <Star>       <Rock>
 *
 * * <<other classes>>
 *   <Score>, <Message>, <Selector>
 *
 * Entity: Superclass of Charactor, Item, and Obstacle classes.
 *         This class contains common properties and methods to be used
 *         as entity in this game.
 *    - methods: setSprite(), setPosition(), isColliding()
 *
 * Charactor: Subclass of Entity class, and also a superclass of Enemy and
 *            Player classes.
 *    - methods: render()
 * Enemy: Subclass of Charactor class. The instances of this class represent
 *        the enemies on the board.
 *    - methods: getSpeed(), setSpeed(), update(), increaseSpeed()
 * Player: Subclass of Charactor class. The instance of this class represents
 *        the player. Only one instance should be created in the entire game.
 *    - methods: resetPosition(), update(), hasReachedGoal(), setDelta(),
 *               resetDelta(), canMoveOnX(), canMoveOnY(), setDeltaOrIgnore(),
 *               handleInput(), changePlayer(), collidingWithObstacles()
 *
 * Item: Subclass of Entity class. The instances of this class represent
 *       the items the player collects.
 *    - methods: update(), render()
 * Heart: Subclass of Item class. The instances of this class represent the
 *       Heart-shaped objects the player collects.
 *    - methods: <none>
 * Gem: Subclass of Item class. The instances of this class represent the
 *       Gem-shaped objects the player collects.
 *    - methods: changeColorRandomly(), setColor()
 * Key: Subclas of Item class. The instances of this class represent the
 *      Key-shaped objects the player collects.
 *    - methods: <none>
 * Star: Subclas of Item class. The instances of this class represent the
 *      Star-shaped objects the player collects.
 *    - methods: <none>
 *
 * Obstacle: Sublcass of Entity class. The instances of this class represent
 *           the obstacles. The player cannot move if there is an obstacle
 *           where the player wants to move.
 *    - methods: update(), render()
 * Rock: Subclass of Obstacle. The instances of this class represent the Rock-
 *       shaped obstacles in the game.
 *    - methods: <none>
 *
 * Score: The instance of this class holds and controls the score in this game.
 *        Only one instance of this class should be create in the entire game.
 *    - methods: getScore(), setScore(), addScore(), render()
 * Message: The instance of this class holds and controls the score in this
 *          game. Only one instance of this class should be create in the
 *          entire game.
 *    - methods: showGameOver, render()
 * Selector: The instance of this class controls the selection of the charactor.
 *           Only one instance of this class should be crated in the entire
 *           game.
 *    - methods: next(), update(), render(), handleInput()
 */

(function(global) {
    // Run the entire code of this file in 'strict' mode
    'use strict';

    /**
     * This class is the superclass of Charactor, Item, and Obstacle classes.
     * This class contains the common properties and methods to be used as
     * an entity in this game
     * @constructor
     * @return {Entity} instance of this class. (with constructor mode)
     */
    var Entity = function() {
        /**
         * Position of this instance on the x-axis.
         * This value always equals to the 'left'.
         * @type {Number}
         */
        this.x = 0;

        /**
         * Position of this instance on the y-axis.
         * This value always equals to the 'top'.
         * @type {Number}
         */
        this.y = 0;

        /**
         * Top coordinate of this instance.
         * This is used for collision detection.
         * @type {Number}
         */
        this.top = 0;

        /**
         * Bottom coordinate of this instance.
         * This is used for collision detection.
         * @type {Number}
         */
        this.bottom = 0;

        /**
         * Left coordinate of this instance.
         * This is used for collision detection.
         * @type {Number}
         */
        this.left = 0;

        /**
         * Right coordinate of this instance.
         * This is used for collision detection.
         * @type {Number}
         */
        this.right = 0;

        /**
         * The image/sprite for the instance, this uses
         * a helper we've provided to easily load images.
         *
         * You need to call setSprite() to set the image.
         * @type {String}
         */
        this.sprite = '';
    };

    /**
     * Sets the sprite of the instance
     * @param {String} sprite - The uri of the sprite in relative path format
     * @return {undefined}
     */
    Entity.prototype.setSprite = function(sprite) {
        this.sprite = sprite;
    };

    /**
     * Sets the position of the instance
     * @param {Object} position - Object representing its position of the
     * instance. It must contain 'x' and 'y' properties
     * @return {undefined}
     */
    Entity.prototype.setPosition = function(position) {
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
     * Checks if the 'this' instance is colliding into the parameter,
     * 'objInQuestion'.
     *
     * For example, it checks if the enemy is colliding into the player. In this
     * case, the argument will be the player object.
     *
     * I was looking for a way to detect collisions, and found this post below.
     * https://discussions.udacity.com/t/player-bug-collision-problem/15068/4?u=
     * u=kkas
     *
     * I watched the following video and came up with the code in this function.
     * HTML5 Game Development - Physics - AABB Collision
     * https://www.udacity.com/course/viewer#!/c-cs255/l-52265917/e-130215280/m-
     * 129941633
     *
     * @param  {Object} objInQuestion - The object being checked for collision.
     * Currently, this object is assumed to have 'bottom', 'right', 'top',
     * 'left' properties that represent the x and y coordinates of the imaginary
     * box for the object.
     * @return {Boolean} True if the 'this' instance is colliding into
     * 'objInQuestion'. False, otherwise.
     */
    Entity.prototype.isColliding = function(objInQuestion) {
        return (
            this.top < objInQuestion.bottom &&
            this.left < objInQuestion.right &&
            this.bottom > objInQuestion.top &&
            this.right > objInQuestion.left
        );
    };

    /**
     * Charactor class.
     *
     * This class is a subclass of Entity class and also a superclass of
     * Enemy and Player classes.
     * @constructor
     * @return {Charactor} instance of this class. (with constructor mode)
     */
    var Charactor = function() {
        // Initialize this instance using Superclass's constructor
        Entity.call(this);
    };
    Charactor.prototype = Object.create(Entity.prototype);
    Charactor.prototype.constructor = Charactor;

    /**
     * Renders the instance on the screen.
     * @return {undefined}
     */
    Charactor.prototype.render = function() {
        ctx.drawImage(
            Resources.get(this.sprite), this.x, this.y - SPRITE_TOP_PADDING);
    };

    /**
     * Enemy Class. The instances of this class are the enemies our player
     * must avoid.
     *
     * This class is a subclass of Charactor class.
     *
     * @constructor
     * @param {Object} position - The object representing the position
     * @param {Number} speed - The initial speed of this instance.
     * @return {Enemy} instance of this class. (with constructor mode)
     */
    var Enemy = function(position, speed) {
        // Variables applied to each of our instances go here,
        // we've provided one for you to get started

        // Initialize this instance using the superclass's constructor
        Charactor.call(this);

        /**
         * How much pixel this instance moves per frame.
         * @type {Number}
         */
        this.enemyMovePerFrame = 0;

        /**
         * Score that the player will loose when hit
         * @type {Number}
         */
        this.SCORE = -10;

        // Set the sprite of this instance.
        this.setSprite('images/enemy-bug.png');

        // Set the initial position of this instance.
        this.setPosition(position);

        // Set the initial speed of this instance.
        this.setSpeed(speed);
    };
    Enemy.prototype = Object.create(Charactor.prototype);
    Enemy.prototype.constructor = Enemy;

    /**
     * Gets the speed of this instance.
     * This value equals to the number of pixels this instance moves per frame.
     * @return {Number} - The curent speed of this instance.
     */
    Enemy.prototype.getSpeed = function() {
        return this.enemyMovePerFrame;
    };

    /**
     * Sets the speed of this instance.
     * This value equals to the number of pixels this instance moves per frame.
     * @param {Number} speed - The new speed of this instance.
     * @return {undefined}
     */
    Enemy.prototype.setSpeed = function(speed) {
        this.enemyMovePerFrame = speed;
    };

    /**
     * Updates the properties of this instance.
     *
     * If the this instance collides into the player, the player will
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

        // Check to see if this instance is colliding into the player.
        // I check to see if the player is not paused because there is no need
        // to check the collision if the the game is over.
        // (Currently, the player becomes paused when the game is over.)
        if (!player.isPaused && this.isColliding(player)) {
            console.log('Collision detected!');
            // Adding score in here means loosing this amount from the current
            // score, since the enemies have negative values in 'SCORE'.
            score.addScore(this.SCORE);

            // If the score reaches 0, the game is over.
            if (score.getScore() <= 0) {
                console.log('The game is over');
                gameOver();
            } else {
                player.resetPosition();
            }
        }

        // Check to see if this instance reaches out of the canvas.
        if (this.left > canvasSize.effectiveWidth) {
            // Reset the position of this instance by assigning a random
            // position.
            this.setPosition(generateRandomEnemyPosition());
        }
    };

    /**
     * Increases the speed of this instance. The value in 'speed' will be added
     * to the current speed.
     * @param  {Number} speed - Value of the speed to increase.
     * @return {undefined}
     */
    Enemy.prototype.increaseSpeed = function(speed) {
        this.setSpeed(this.getSpeed() + speed);
    };

    // Now write your own player class
    // This class requires an update(), render() and
    // a handleInput() method.

    /**
     * Player class. The instance of this class is the player we play.
     *
     * This is a subclass of Charactor class.
     * @constructor
     * @return {Player} instance of this class. (with constructor mode)
     */
    var Player = function() {
        // Initialize this instance using the superclass's constructor
        Charactor.call(this);

        /**
         * Value that represents one step on the x-axis
         * @type {Number}
         */
        this.INCREMENT_VALUE_OF_X = 101;

        /**
         * Value that represents one step on the y-axis
         * @type {Number}
         */
        this.INCREMENT_VALUE_OF_Y = 83;

        // Set the default sprite of the player.
        this.setSprite('images/char-boy.png');

        /**
         * Initial position of this instance on x-axis.
         * The number indicates the colum number of the matrix (game board).
         * The number starts from 0, so 2 will be the 3rd column.
         * @type {[type]}
         */
        this.INITIAL_POSITION_X = this.INCREMENT_VALUE_OF_X * 2;

        /**
         * Initial position of this instance on y-axis.
         * The number indicates the row number of the matrix (game board).
         * The number starts from 0, so 4 will be the 5th column.
         * @type {[type]}
         */
        this.INITIAL_POSITION_Y = this.INCREMENT_VALUE_OF_Y * 4;

        /**
         * This value is used to increment the position of this instance
         * on the x-xis.
         * When the player's position needs to be updated, for example,
         * when a arrow key is pressed, the value for increment/decrement
         * will be stored.
         *
         * This value is associated with yDelta.
         *
         * The reason for having these properties are to wait for this.update()
         * being called, so that these values are added to/subtracted from
         * the position of the player correctly.
         * @type {Number}
         */
        this.xDelta = 0;

        /**
         * This value is used to increment the position of this instance on the
         * y-axis. When the player's position needs to be updated, for example,
         * When the player's position needs to be updated, for example, when a
         * arrow key is pressed, the value for increment/decrement will be
         * stored.
         *
         * This value is associated with xDelta.
         *
         * The reason for having these properties are to wait
         * for update() being called so that these values are added to/subtrac
         * ted from the position of the player correctly.
         * @type {Number}
         */
        this.yDelta = 0;

        /**
         * Flag that indicates the player is allowed to move.
         * This value will be used to prevent the player moving, in situations
         * such as when some messages are displayed on the board, or
         * the game has been over.
         * @type {Boolean}
         */
        this.isPaused = false;

        // Set this player's initial position.
        this.resetPosition();

        // Set the initial value of deltas.
        this.resetDelta();
    };
    Player.prototype = Object.create(Charactor.prototype);
    Player.prototype.constructor = Player;

    /**
     * Resets the position of this instance to the initial postion.
     * @return {undefined}
     */
    Player.prototype.resetPosition = function() {
        this.setPosition({
            'x': this.INITIAL_POSITION_X,
            'y': this.INITIAL_POSITION_Y
        });
    };

    /**
     * Updates the properties of this instance.
     * Currently, this updates:
     * <ul>
     * <li>the position of this instance (if not colliding into obstacles)</li>
     * <li>the delta counter to 0</li>
     * </ul>
     *
     * Also, it checks whether the the player reaches to the water.
     * If so, the player goest to the next stage.
     * @return {undefined}
     */
    Player.prototype.update = function() {

        // Update the player's position only if it is not colliding into any
        // obstacles.
        if (!this.collidingWithObstacles()) {
            this.setPosition({
                'x': this.nextMoveOnX(),
                'y': this.nextMoveOnY()
            });
        }

        // Reset the delta counter.
        this.resetDelta();

        // Check to see if the player reaches the water.
        // If so, the player will go to the next stage.
        if (this.hasReachedGoal(waterArea)) {
            console.log('The player has reached the water!' +
                'Go to the next stage.');
            nextStage();
        }
    };

    /**
     * This function is 'isColliding()'.
     * I think this makes a little bit easier to read the source code.
     * For more details, see 'isColliding()'.
     * @type {Boolean} - True if the player reaches the goal. False, otherwise.
     */
    Player.prototype.hasReachedGoal = Player.prototype.isColliding;

    /**
     * Set the deltas for the 'x' and 'y'. When these values are set,
     * the position of the player will be updated in the next update().
     *
     * For example, if a negative value is set in xDelta, the player will move
     * to the left.
     *
     * If 'undefined' is passed for the argment, it will sets the
     * '0' as the default value.
     *
     * @param {Number} xDelta - The new delta for 'x'. Sets 0 if undefined is
     * passed.
     * @param {Number} yDelta - The new delta for 'y'. Sets 0 if undefined is
     * passed.
     * @return {undefined}
     */
    Player.prototype.setDelta = function(xDelta, yDelta) {
        this.xDelta = xDelta || 0;
        this.yDelta = yDelta || 0;
    };

    /**
     * Resets the deltas to the initial values.
     * @return {undefined}
     */
    Player.prototype.resetDelta = function() {
        this.setDelta();
    };

    /**
     * Checks if this instance can physically move to the left/right
     * (on x-axis).
     *
     * This checking is the same as what Player.canMoveOnY() does.
     *
     * It checks the new location by comparing the left and right boundaries of
     * the board with the new locations, which are calculated by summing the
     * 'step' and the current values of left and right.
     *
     * If the new location stays within the boundary, it returns true to
     * indicate that the player can move. Otherwise, it returns false.
     * @param  {Number} step - The number of pixels the player wants to move
     * @return {Boolean} True if the new location stays within the boundary.
     * False, otherwise.
     */
    Player.prototype.canMoveOnX = function(step) {
        // '0' means the left boundary of the board.
        return this.left + step >= 0 &&
            this.right + step <= canvasSize.effectiveWidth;
    };

    /**
     * Checks if this instance can physically move to the up/down (on y-axis).
     *
     * This checking is the same as what Player.canMoveOnX() does.
     *
     * It checks the new location by comparing the top and bottom boundaries of
     * the board with the new locations, which are calculated by summing the
     * 'step' and the current values of top and bottom.
     *
     * If the new location stays within the boundary, it returns true to
     * indicate that the player can move. Otherwise, it returns false.
     * @param  {Number} step - The number of pixels the player wants to move
     * @return {Boolean} True if the new location stays within the boundary.
     * False, otherwise.
     */
    Player.prototype.canMoveOnY = function(step) {
        // '0' means the top boundary of the board.
        // The bottom most areas are taken for the selector, so I subtract
        // one IMAGE_HEIGHT from the 'effectiveHeight'.
        return this.top + step >= 0 &&
            this.bottom + step <= canvasSize.effectiveHeight - IMAGE_HEIGHT;
    };

    /**
     * Sets deltas(next step) values for the 'x' and 'y' if the new location
     * is valid.
     *
     * @param {Number} dtX - A delta for 'x'
     * @param {Number} dtY - A delta for 'y'
     * @return {undifined}
     */
    Player.prototype.setDeltaOrIgnore = function(dtX, dtY) {
        var newDtX,
            newDtY;

        if (dtX !== undefined && this.canMoveOnX(dtX)) {
            newDtX = dtX;
        }

        if (dtY !== undefined && this.canMoveOnY(dtY)) {
            newDtY = dtY;
        }

        this.setDelta(newDtX, newDtY);
    };

    /**
     * Handles the inputs from the keyboard.
     *
     * When:
     *  - 'left': the player moves one step to left (if possible)
     *  - 'right': the player moves one step to right (if possible)
     *  - 'up': the player moves one step to up (if possible)
     *  - 'down': the player moves one step to down (if possible)
     *
     * When any other key is passed or when the player is supposed to be paused,
     * the key will be ignored to prevent the player moving.
     *
     * @param  {String} key - The string value of the input from keyboard
     * @return {undefined}
     */
    Player.prototype.handleInput = function(key) {
        var stepX,
            stepY;

        switch(key) {
            case 'left':
                stepX = this.INCREMENT_VALUE_OF_X * -1;
                break;

            case 'right':
                stepX = this.INCREMENT_VALUE_OF_X;
                break;

            case 'up':
                stepY = this.INCREMENT_VALUE_OF_Y * -1;
                break;

            case 'down':
                stepY = this.INCREMENT_VALUE_OF_Y;
                break;

            default:
                break;
        }

        // Set the deltas only when the player is not paused.
        if (!this.isPaused) {
            this.setDeltaOrIgnore(stepX, stepY);
        }
    };

    /**
     * Changes the player (only the sprite)
     * @param  {String} newSprite - The new sprite of the player
     * @return {undefined}
     */
    Player.prototype.changePlayer = function(newSprite) {
        this.setSprite(newSprite);
    };

    /**
     * Checks if this instance is colliding into any obstacles.
     * @return {Boolean} True if the player is colliding into any obstacles.
     * False, otherwise.
     */
    Player.prototype.collidingWithObstacles = function() {
        var i;

        for (i = 0; i < allItemsObstacles.length; i++) {

            // The array contains instances of Item and Obstacle classes.
            // I want to check only obstacles.
            if (allItemsObstacles[i] instanceof Obstacle &&
                allItemsObstacles[i].x == this.nextMoveOnX() &&
                allItemsObstacles[i].y == this.nextMoveOnY()) {

                console.log('player is colliding into an obstacle');
                // Prevent the player to move this location.
                return true;
            }
        }
        return false;
    };

    /**
     * Returns the next possible move on x-axis.
     * @return {Integer} Integer that represents the position of this instance
     * on x-axis.
     */
    Player.prototype.nextMoveOnX = function() {
        return this.x + this.xDelta;
    };

    /**
     * Returns the next possible move on y-axis.
     * @return {Integer} Integer that represents the position of this instance
     * on y-axis.
     */
    Player.prototype.nextMoveOnY = function() {
        return this.y + this.yDelta;
    };

    /**
     * Item class. This class is the superclass of all the items in this game.
     *
     * This class is also a subclass of Entity class.
     *
     * @constructor
     * @return {Item} instance of this class. (with constructor mode)
     */
    var Item = function(position) {
        // Initialize this instance using the superclass's constructor
        Entity.call(this);

        /**
         * Flag that indicates if this instance has been collected by the
         * player.
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
    Item.prototype = Object.create(Entity.prototype);
    Item.prototype.constructor = Item;

    /**
     * Updates the properties of this intance.
     * Currently, this function updates:
     * <ul>
     * <li>this.collected with the result returned from the collision checking
     *  with the player.</li>
     * <li>the scores of the player (when this instance has been collected)</li>
     * </ul>
     * @return {undefined}
     */
    Item.prototype.update = function() {
        // If the 'this' item has been collected, I don't need to check
        // the collision.
        if (!this.collected && this.isColliding(player)) {
            this.collected = true;
            score.addScore(this.SCORE);
        }
    };

    /**
     * Renders this instance on the screen as long as the 'collected' is false.
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
     * Heart class. The instances of this class will be the items the player
     * collects.
     *
     * This class is a subclass of Item class.
     *
     * @constructor
     * @param {Object} position - Object representing its position of the
     * instance. It must contain 'x' and 'y' properties.
     * @return {Heart} instance of this class. (with constructor mode)
     */
    var Heart = function(position) {
        // Initialize the heart using the superclass's constructor
        Item.call(this, position);

        // Override the default score.
        this.SCORE = 5;

        // Default sprite image of the heart.
        this.setSprite('images/Heart.png');
    };
    Heart.prototype = Object.create(Item.prototype);
    Heart.prototype.constructor = Heart;

    /**
     * Gem class. The instances of this class will be the items that the player
     * collects.
     *
     * This class is a subclass of Item class.
     *
     * @constructor
     * @param {Object} position - Object representing its position of the
     * instance. It must contain 'x' and 'y' properties.
     * @return {Gem} instance of this class. (with constructor mode)
     */
    var Gem = function(position) {
        // Initialize this instance using the superclass's constructor
        Item.call(this, position);

        /**
         * URI of the sprite for a blue gem.
         * @type {String}
         */
        this.SPRITE_BLUE = 'images/Gem Blue.png';

        /**
         * URI of the sprite for a green gem.
         * @type {String}
         */
        this.SPRITE_GREEN = 'images/Gem Green.png';

        /**
         URI of the sprite for a orange gem.
         * @type {String}
         */
        this.SPRITE_ORANGE = 'images/Gem Orange.png';

        /**
         * Integer value that indicates Blue Gem.
         * This is mostly used when choosing color of the gem randomly.
         * Do not change this. There is a dependency to the order.
         * @type {Number}
         */
        this.BLUE = 0;

        /**
         * Integer value that indicates Green Gem.
         * This is mostly used when choosing color of the gem randomly.
         * Do not change this. There is a dependency to the order.
         * @type {Number}
         */
        this.GREEN = 1;

        /**
         * Integer value that indicates Orange Gem.
         * This is mostly used when randomly choosing color of this instance.
         * Do not change this. There is a dependency to the order.
         * @type {Number}
         */
        this.ORANGE = 2;

        // Set the initial color randomly
        this.changeColorRandomly();
    };
    Gem.prototype = Object.create(Item.prototype);
    Gem.prototype.constructor = Gem;

    /**
     * Selects a color randomly and sets it for this instance.
     * @return {undefined}
     */
    Gem.prototype.changeColorRandomly = function() {
        // The values passed into getRandomIntInclusive() assues they are
        // integer values and Blue is the smallest value and the largest for
        // Orange.
        this.setColor(getRandomIntInclusive(this.BLUE, this.ORANGE));
    };

    /**
     * Sets the color of this instance.
     * @param {Number} newColor - Integer that represents the color of this
     * instance.
     * @return {undefined}
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
                console.log('Unexpected color value is selected.' +
                    'There is something wrong in Gem.prototype.setColor.');
                break;
        }
    };

    /**
     * Key class. The instances of this class will be the items the player
     * collects.
     *
     * This class is a subclass of Item class.
     *
     * @constructor
     * @param {Object} position - Object representing its position of the
     * instance. It must contain 'x' and 'y' properties.
     * @return {Key} instance of this class. (with constructor mode)
     */
    var Key = function(position) {
        // Initialize this instance using the superclass's constructor
        Item.call(this, position);

        // Override the default score.
        this.SCORE = 100;

        // Default sprite image of this instance.
        this.setSprite('images/Key.png');
    };
    Key.prototype = Object.create(Item.prototype);
    Key.prototype.constructor = Key;

    /**
     * Star class. The instances of this class will be the items the player
     * collects.
     *
     * This class is a subclass of Item class.
     *
     * @constructor
     * @param {Object} position - Object representing its position of the
     * instance. It must contain 'x' and 'y' properties.
     * @return {Star} instance of this class. (with constructor mode)
     */
    var Star = function(position) {
        // Initialize this instance using the superclass's constructor
        Item.call(this, position);

        // Override the default score.
        this.SCORE = 30;

        // Default sprite image of this instance.
        this.setSprite('images/Star.png');
    };
    Star.prototype = Object.create(Item.prototype);
    Star.prototype.constructor = Star;

    /**
     * Obstacle class. This class is the superclass of all the obstacles
     * in this game.
     *
     * This class is also a subclass of Entity class.
     *
     * @constructor
     * @return {Obstacle} instance of this class. (with constructor mode)
     */
    var Obstacle = function(position) {
        // Initialize this instance using the superclass's constructor
        Entity.call(this);

        // Set the initial position.
        this.setPosition(position);
    };
    Obstacle.prototype = Object.create(Entity.prototype);
    Obstacle.prototype.constructor = Obstacle;

    /**
     * Updates the properties of this intance.
     * Currently do anything. I created this function to avoid being error.
     * @return {undefined}
     */
    Obstacle.prototype.update = function() {
        // do nothing.
    };

    /**
     * Renders this instance on the screen.
     * @return {undefined}
     */
    Obstacle.prototype.render = function() {
        ctx.drawImage(
            Resources.get(this.sprite),
            this.x,
            this.y - SPRITE_TOP_PADDING);
    };

    /**
     * Rock class. This class is a subclass of Obstacle class.
     *
     * @constructor
     * @return {Rock} instance of this class. (with constructor mode)
     */
    var Rock = function(position) {
        // Initialize this instance using the superclass's constructor
        Obstacle.call(this, position);

        // Set the sprite of this instance.
        this.setSprite('images/Rock.png');

        // Set the initial position.
        this.setPosition(position);
    };
    Rock.prototype = Object.create(Obstacle.prototype);
    Rock.prototype.constructor = Rock;

    /**
     * Score class.
     *
     * Actually, I am not sure if this class should be a class since I need
     * only one instance. However, I think making it as a class is convinient
     * and easier to read the source code since I can use this exactly the
     * same way as I do for the other pseudo classical classes.
     * @constructor
     * @return {Score} instance of this class. (with constructor mode)
     */
    var Score = function(defaultScore) {
        /**
         * The scores
         * @type {Number}
         */
        this.score = 0;

        // Set the default score
        this.setScore(defaultScore);

        // Do this after score is set in order to set the initial score
        /**
         * The high score that the player has earned in the game.
         * @type {Number}
         */
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
     * Sets 'newScore' as the new current score.
     * @param {[type]} newScore [description]
     * @return {undefined}
     */
    Score.prototype.setScore = function(newScore) {
        this.score = newScore || 0;
    };

    /**
     * Adds 'scoreEarned' to the current score and make the result as
     * the new current score. When loosing points, the value passed as
     * the argument is a negative value.
     *
     * After the addition, it checks if the new current score becomes greater
     * than the current high score. If so, the high score will be the new
     * score.
     * @param {Number} score - Score that will be added to the current score
     * @return {undefined}
     */
    Score.prototype.addScore = function(score) {
        this.score += score;

        // Check to see if the score exceeds the current high score.
        if (this.highScore < this.score) {
            this.highScore = this.score;
        }
    };

    /**
     * Renders the score on the board.
     * This function is called in engine.js.
     * @return {undefined}
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

        // Draw the high score
        ctx.fillText('High Score: ' + this.highScore, 10, 140);
        ctx.strokeText('High Score: ' + this.highScore, 10, 140);

        // Restore the privious state.
        ctx.restore();
    };

    /**
     * Message class that controlls the messages on the board, except for the
     * score.
     *
     * Actually, I am not sure if this class should be a class since I need
     * only one instance. However, I think making it as a class is convinient
     * and easier to read the source code since I can use this exactly the
     * same way as I do for the other pseudo classical classes.
     *
     * @constructor
     * @return {Message} instance of this class. (with constructor mode)
     */
    var Message = function() {

        /**
         * Interger value that indicates there is no message to show.
         * @type {Number}
         */
        this.NO_MESSAGE = 0;

        /**
         * Interger value that indicates the message for the game is over needs
         * to be drawn.
         * @type {Number}
         */
        this.GAME_OVER = 1;

        /**
         * This variable is used with an integer value that
         * indicates whether the message needs to be shown or not.
         *
         * For example, '0' (NO_MESSAGE) indicates there is no message to
         * display. If set to '1' (GAME_OVER), the messages for 'game over'
         * need to be displayed.
         * @type {Number}
         */
        this.showMessage = this.NO_MESSAGE;
    };

    /**
     * Call this function when the game is over.
     * This function will turn on the flag to display the messages for
     * 'game over'.
     * @return {undefined}
     */
    Message.prototype.showGameOver = function() {
        this.showMessage = this.GAME_OVER;

        // Change the score to 0 because it might be a negative value and
        // I don't want to show the negative value as the score.
        score.setScore(0);
    };

    /**
     * Draws the message on the board. This function is called in engine.js.
     * @return {undefined}
     */
    Message.prototype.render = function() {
        if (this.showMessage) {

            // Save the states before changing them.
            ctx.save();

            switch (this.showMessage) {
                case this.GAME_OVER:
                        // Message displayed on the top
                    var messageTop = 'Game Over',
                        // Display the message in the middle of the canvas.
                        messageTopX = canvasSize.effectiveWidth / 2,
                        messageTopY = canvasSize.effectiveHeight - 200,
                        // Message displayed on the bottom
                        messageBottom1 = 'Reload this page',
                        messageBottom2 = 'to restart the game',
                        // Display the message in the middle of the canvas.
                        messageBottomX = messageTopX,
                        messageBottomY1 = canvasSize.effectiveHeight - 50,
                        messageBottomY2 = canvasSize.effectiveHeight;

                    // ----------------------
                    // Settings for messageTop
                    // ----------------------
                    ctx.font = '70pt Impact';
                    ctx.textAlign = 'center';
                    ctx.fillStyle = 'yellow';
                    ctx.strokeStyle = 'white';
                    ctx.lineWidth = 3;

                    // Draw the inner area of the text.
                    ctx.fillText(messageTop, messageTopX, messageTopY);

                    // Draw the outer line of the text.
                    ctx.strokeText(messageTop, messageTopX, messageTopY);

                    // ----------------------
                    // Settings for messageBottom
                    // ----------------------
                    ctx.font = '30pt Impact';
                    ctx.textAlign = 'center';
                    ctx.fillStyle = 'yellow';

                    // Draw the message bottom 1
                    ctx.fillText(
                        messageBottom1, messageBottomX, messageBottomY1
                    );

                    // Draw the message bottom 2
                    ctx.fillText(
                        messageBottom2, messageBottomX, messageBottomY2
                    );
                break;
                default:
                    //nothing
                    console.log('unexpected value is found in ' +
                        'Message.prototype.render()');
                break;
            }

            // Restore the privious state.
            ctx.restore();
        }
    };

    /**
     * Selector class that controlls the selection of the charactor. This class
     * holds the current selected charactor, and renders the list of charactors
     * with the selector highlighting the current selected charactor.
     *
     * Actually, I am not sure if this class should be a class since I need
     * only one instance. However, I think making it as a class is convinient
     * and easier to read the source code since I can use this exactly the
     * same way as I do for the other pseudo classical classes.
     *
     * @constructor
     * @return {Selector} instance of this class. (with constructor mode)
     */
    var Selector = function() {
        /**
         * The array that contains the URI of the sprites of all the charactors
         * that the player can select.
         * @type {Array}
         */
        this.charactorImages = [
            'images/char-boy.png',
            'images/char-cat-girl.png',
            'images/char-horn-girl.png',
            'images/char-pink-girl.png',
            'images/char-princess-girl.png'
        ];

        /**
         * The URI of the sprite image of the selector, that indicates which
         * charactor is currently selected.
         * @type {String}
         */
        this.selectorImage = 'images/Selector.png';

        /**
         * The index of currently selected charactor.
         * @type {Number}
         */
        this.curSelect = 0;

        /**
         * Number of characters The player can select.
         * @type {[type]}
         */
        this.NUM_CHARACTORS = this.charactorImages.length;
    };

    /**
     * Moves the selector to the next charactor. If the charactor selecting
     * is on the right most one, then the next will be the left most one.
     * @return {Number} The new index of currently selected charactor.
     */
    Selector.prototype.next = function() {
        this.curSelect =
            this.curSelect < this.NUM_CHARACTORS - 1 ? this.curSelect + 1 : 0;
        return this.curSelect;
    };

    /**
     * Updates the selector and its associated properties.
     * Currently, it changes the player's sprite.
     * @return {undefined}
     */
    Selector.prototype.update = function() {
        player.changePlayer(this.charactorImages[this.curSelect]);
    };

    /**
     * Renders the selector and all the charactors on the board.
     * @return {undefined}
     */
    Selector.prototype.render = function() {

        var i;

        // Draws the selector.
        ctx.drawImage(Resources.get(this.selectorImage),
            this.curSelect * IMAGE_WIDTH, 5 * IMAGE_HEIGHT);

        // Draws all the charactors. Drawing charactors after the selector
        // makes the drawing better.
        for (i = 0; i < this.charactorImages.length; i++) {
            ctx.drawImage(Resources.get(this.charactorImages[i]),
                i * IMAGE_WIDTH, 5 * IMAGE_HEIGHT - 10);
        }
    };

    /**
     * Handles the input from the keyboard. This function handles the keys
     * that affect the charactor selection.
     * @param  {String} key - The string value of the input from the keyboard
     * @return {undefined}
     */
    Selector.prototype.handleInput = function(key) {

        switch(key) {
            case 'space':
                console.log('Space input.');
                this.next();
                break;

            default:
                break;
        }
    };

    /**
     * Returns a random integer between min (included) and max (included)
     * Using Math.round() will give you a non-uniform distribution!
     *
     * This function was borrowed from the following document in MDN.
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
     * Call this function when the game is over.
     * This function currently turns on:
     * <ul>
     * <li>the flag for the player to be moved</li>
     * <li>the flag for the 'game over' message to show</li>
     * </ul>
     * @return {undefined}
     */
    var gameOver = function() {
        player.isPaused = true;
        message.showGameOver();
    };

    /**
     * Generates new enemies. The 'num' number of enemies will be created.
     * @param  {Array} arrayOfEnemies - Array that will store the newly created
     * enemy instances.
     * @param  {Number} num - The number of enemies you want to generate.
     * @return {undefined}
     */
    var generateEnemies = function(arrayOfEnemies, num) {
        var cnt;

        for (cnt = 0; cnt < num; cnt++) {
            arrayOfEnemies.push(
                new Enemy(
                    generateRandomEnemyPosition(),
                    generateRandomEnemySpeed()
                )
            );
        }
    };

    /**
     * Generates the random position for an enemy.
     *
     * This 'random' means that the index of the row will be randomly chosen
     * from a specific range.
     * I don't want to change the column number, so that the enemies always
     * run on the same row.
     * @return {Object} The newly generated position object
     */
    var generateRandomEnemyPosition = function() {
        // Set row number ranging from 1 to 3 because I want the enemies appear
        // only on the stone areas (row number from 1 to 3).
        return {
            'x': ENEMY_INITIAL_X,
            'y': SPRITE_HEIGHT * getRandomIntInclusive(1, 3)
        };
    };

    /**
     * Generates the possible speed of an enemy.
     * The range of the generated values is from MIN_POSSIBLE_ENEMY_SPEED
     * and MAX_POSSIBLE_ENEMY_SPEED inclusive.
     * @return {Number} - The new speed for an enemy.
     */
    var generateRandomEnemySpeed = function() {
        return getRandomIntInclusive(
            MIN_POSSIBLE_ENEMY_SPEED, MAX_POSSIBLE_ENEMY_SPEED);
    };

    /**
     * Generates the postion randomly.
     *
     * This 'random' means that the index of the row will be randomly chosen
     * from a specific range.
     *
     * @return {Ojbect} - The newly generated position object
     */
    var generateRandomPosition = function() {
        // Set a row number ranging from 1 to 3 because I want the instances to
        // appear only on the stone areas (row number from 1 to 3).
        // The same thought can be applied for 'x'.
        return {
            'x': SPRITE_WIDTH * getRandomIntInclusive(0, 4),
            'y': SPRITE_HEIGHT * getRandomIntInclusive(1, 3)
        };
    };

    /**
     * Generates a position only if the position is vacant.
     * This vacancy will be determined by the position objects in
     * 'arrayOfPositions' array.
     * @param  {Array} arrayOfPositions - Array that contains the position
     * objects to indicate the positions have already been taken.
     * @return {Object} New postion object
     */
    var generateEffectiveRandomPosition = function(arrayOfPositions) {
        var newPosition,
            needToRegenerate;

        // I don't want more than one item or obstacle to be shown at the
        // same position. Therefore, I checked the newly generated position
        // with the ones that have already generated. If they have the same
        // position, the position will be re-generate until it has the
        // different position.
        do {
            newPosition = generateRandomPosition();

            if (checkIfExists(arrayOfPositions, newPosition)) {
                // The position has been taken.
                needToRegenerate = true;
            } else {
                // The position is vacant.
                needToRegenerate = false;
            }

        // Repeat this loop until 'needToRegenerate' becomes false
        } while (needToRegenerate);

        return newPosition;
    };

    /**
     * Generates item and obstacles instances.
     * Currently, this creates the following:
     * <ul>
     * <li>items of Heart</li>
     * <li>items of Gem</li>
     * <li>items of Key</li>
     * <li>obstacles of Rock</li>
     * </ul>
     *
     * This function will store these instacens after generating them into the
     * 'allItemsObstacles' array, and sort them by their positions.
     *
     * If one has a smaller y-coordinate, it will have a smaller index of the
     * array. This sorting is necessary to show these objects on the board
     * correctly. (The ones that has larger indexes will be drawn later.)
     * @return {undefined}
     */
    var generateItemsObstacles = function() {
        var occupiedPositions = [],
            // Flag for generating the key object. If true, generate a key.
            // The probability to generate the key is 1/4.
            generateKeyThisTime =
                getRandomIntInclusive(0, 3) === 0 ? true :false,
            // Flag for generating the star object. If true, generate a star.
            // The probability to generate the key is 1/2.
            generateStarThisTime =
                getRandomIntInclusive(0, 1) === 0 ? true :false;

        // Delete all of the objects stored in the arrays before adding the
        // new ones.
        //
        // In order for this deletion, I set 0 to the length of the
        // 'allItemsObstacles' array. The reason for this is that merely
        // replacing the pointer to the array does not work since it is
        // assigned in the property of the global object.
        //
        // I searched for a way to delete all the elements in an array and
        // found the solusion at stackoverflow by assinging 0 to the length of
        // the array (the 2nd method in the post).
        // http://stackoverflow.com/questions/1232040/how-to-empty-an-array-in-
        // javascript
        allItemsObstacles.length = 0;

        createItemsObstacles(allItemsObstacles, occupiedPositions,
            NUM_HEARTS, Heart);
        createItemsObstacles(allItemsObstacles, occupiedPositions,
            NUM_GEMS, Gem);

        // Generate the key only this flag is true.
        if (generateKeyThisTime) {
            createItemsObstacles(allItemsObstacles, occupiedPositions,
                NUM_KEYS, Key);
        }

        // Generate the star only this flag is true.
        if (generateStarThisTime) {
            createItemsObstacles(allItemsObstacles, occupiedPositions,
                NUM_STARS, Star);
        }

        // Create Rock instances.
        createItemsObstacles(allItemsObstacles, occupiedPositions,
            NUM_ROCKS, Rock);

        // Sort the objects in 'allItemsObstacles' to drawing items correctly.
        //
        // I think I need this sorting in order to draw item and obstacle
        // instances correctly.
        // In engine.js, I call render() for each objects in this array,
        // in the order that they are stored (using forEach()).
        // Therefore, it is possible that the one that has a larger index
        // gets drawn underneath the one that has a smaller index.
        // When this hapens, the game does not look good anymore.
        // (I am grasping the game board as a matrix. Images that are
        // drawn bigger number on x and y coordinates have larger indexes.)
        //
        // Hence, I sort the objects in this array to make ones that have
        // greater y-coordinates will have the greater indexes.
        // I ignore x-coordinates because I don't think it matters
        // in terms of the problem that I am mentioning.
        //
        // For the Array.prototype.sort(), I read the following manual in MDN.
        // // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Glo
        // bal_Objects/Array/sort
        allItemsObstacles.sort(function(a, b) {
            return a.y <= b.y ? -1 : 1;
        });
    };

    /**
     * Creates the item and obstract instances using Klass (constructor).
     * Each objects will have the different position.
     *
     * If no objects in the 'arrayOfOccupiedPos' array have the same position
     * with the newly generated position, 'newPosition', the position
     * will be the position of the new instances.
     *
     * After the function call, the objects in the 'arrayOfOccupiedPos' array
     * will be updated with the newly created position objects.
     *
     * @param {Array} newItemsObstaclesArray - Array that will store
     * the newly generated instances.
     * @param {Array} arrayOfOccupiedPositions - Array that contains the
     * position objects which indicate the positions that have been taken.
     * The objects in this array will be updated with all of the newly
     * created position objects.
     * @param  {Number} num - How many instances you want to generate.
     * @param {Constructor} Klass - Constructor of the class you want to create.
     * @return {undefined}
     */
    var createItemsObstacles = function(newItemsObstaclesArray,
        arrayOfOccupiedPos, num, Klass) {
        var cnt,
            newPosition;

        for (cnt = 0; cnt < num; cnt++) {
            newPosition = generateEffectiveRandomPosition(
                arrayOfOccupiedPos);
            newItemsObstaclesArray.push(new Klass(newPosition));

            // Save the position to update.
            arrayOfOccupiedPos.push(newPosition);
        }
    };

    /**
     * Checks if the object in 'objArray' has the same posiotion(x and y)
     * with 'objInQuestion'.
     * Each object stored in 'objArray' is assumed that it has already existed
     * (created) and has 'x' and 'y' properties.
     * @param  {Array} objArray - Array that stores the existing objects.
     * @param  {Object} objInQuestion - Object to be checked
     * @return {Boolean} True if the posion of 'objInQuestion' matches the
     * position of any objects stored in 'objArray'. False, otherwise.
     */
    var checkIfExists = function(objArray, objInQuestion) {
        var cnt,
            objExists;

        // If any object that has the same position is found,
        // stop checking and return true.
        for (cnt = 0; cnt < objArray.length; cnt++) {
            objExists = objArray[cnt];

            if (objInQuestion.x === objExists.x &&
                objInQuestion.y === objExists.y) {
                return true;
            }
        }

        return false;
    };

    /**
     * Increases the speeds of all the ememies.
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
     * Call this function when you need to go to the next stage.
     * Currently, it does:
     * <ul>
     * <li>Increases the speeds of the enemies</li>
     * <li>Resets the player's position</li>
     * <li>Regenerates the all the items and obstacles</li>
     * </ul>
     * @return {undefined}
     */
    var nextStage = function() {

        increaseEnemiesSpeeds(ADDITIONAL_ENEMY_SPEED);

        player.resetPosition();

        generateItemsObstacles();
    };

    // Now instantiate your objects.
    // Place all enemy objects in an array called allEnemies
    // Place the player object in a variable called player

    /**
     * Number of enemies
     * @type {Number}
     */
    var NUM_ENEMIES = 5,
        /**
         * Width in pixels of the sprite image. Currently, all of the sprites
         * have the same width.
         * @type {Number}
         */
        SPRITE_WIDTH = 101,
        /**
         * Height in pixels of the sprite image. Currently, all of the sprites
         * have the same height.
         * @type {Number}
         */
        SPRITE_HEIGHT = 83,
        /**
         * The invisible top padding of the sprite. Adjusting this value does
         * not affect the position of the sprite. This is used only for drawing
         * the image.
         * @type {Number}
         */
        SPRITE_TOP_PADDING = 30,
        /**
         * Minimum possible speed of the enemy. Since the speed are selected
         * randomly, this value is used as the slowest.
         * @type {Number}
         */
        MIN_POSSIBLE_ENEMY_SPEED = 10,
        /**
         * Maximum possible speed of the enemy. Since the speed are selected
         * randomly, this value is used as the fastest initially.
         * @type {Number}
         */
        MAX_POSSIBLE_ENEMY_SPEED = 100,
        /**
         * Speed that will be added to increase the speed of a enemy.
         * @type {Number}
         */
        ADDITIONAL_ENEMY_SPEED = 20,
        /**
         * Array that stores Enemy instances..
         * @type {Array}
         */
        allEnemies = [],
        /**
         * Player instance.
         * @type {Player}
         */
        player = new Player(),
        /**
         * Default position of enemies on x-axis. Since the enemy comes in
         * from the left of the game board, the value must be a negative value.
         * @type {Number}
         */
        ENEMY_INITIAL_X = -200,
        /**
         * Array that stores all the items, such as Gems, Hearts, and obstacles.
         * @type {Array}
         */
        allItemsObstacles = [],
        /**
         * Number of Hearts instances that will be created.
         * @type {Number}
         */
        NUM_HEARTS = 2,
        /**
         * Number of Gems instances that will be created.
         * @type {Number}
         */
        NUM_GEMS = 2,
        /**
         * Number of Key instances that will be created.
         * @type {Number}
         */
        NUM_KEYS = 1,
        /**
         * Number of Star instances that will be created.
         * @type {Number}
         */
        NUM_STARS = 1,
        /**
         * Score instance that holds the score of the entire game.
         * Only one instance of this should be created.
         * @type {Score}
         */
        score = new Score(0),
        /**
         * Message instance.
         * Only one instance of this should be created.
         * @type {Message}
         */
        message = new Message(),
        /**
         * Selector instance.
         * Only one instance of this should be created.
         * @type {Selector}
         */
        selector = new Selector(),
        /**
         * Number of Rock instances that will be created.
         * @type {Number}
         */
        NUM_ROCKS = 2;

    // Instantiates all of the enemies.
    generateEnemies(allEnemies, NUM_ENEMIES);

    // Instantiates all the items and obstacles.
    generateItemsObstacles();

    // This listens for key presses and sends the keys to your
    // Player.handleInput() method. You don't need to modify this.
    document.addEventListener('keyup', function(e) {
        // I searched on the internet and found the website below that lists
        // the integer value of each keyboard input.
        // http://unixpapa.com/js/key.html
        var allowedKeys = {
            32: 'space',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        switch (e.keyCode) {
            case 37:
            case 38:
            case 39:
            case 40:
                player.handleInput(allowedKeys[e.keyCode]);
                break;
            case 32:
                selector.handleInput(allowedKeys[e.keyCode]);
                break;
            default:
                console.log('unsupported key is entered and will be ignored.',
                    'keyCode: ', e.keyCode);
                break;
        }
    });

    // Store these properties to the global object to make them accessible from
    // engine.js.
    //
    // I decided to put the entire code in this file into an anonymous function
    // to run all the code in 'strict mode'. I did not want to repeat inserting
    // the 'use strict' for all methods.
    //
    // As a result of this, I need to make them accessible in order to refer
    // them from engine.js. So, I set them into 'global' object, the parameter
    // of the big anonymous function.
    //
    // In addtion, I don't need to worry about tainting the global object.
    global.allEnemies = allEnemies;
    global.player = player;
    global.allItemsObstacles = allItemsObstacles;
    global.score = score;
    global.message = message;
    global.selector = selector;
})(this);
