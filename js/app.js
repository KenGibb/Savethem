// This is an extension/refactoring of the fruitcakes branch of this repo.
// more notes and comments are in the code on that branch.
// this version incorporates smoother movement, and a more open ended collision detection
// this also has a second enemy to face, which creates a new win condition(kill two ogres)

// requirements and goals 
// make a simple crawler game using canvas that we manipulate in js

// ///////// RULES FOR THE GAME ////////////
// we need two entities, a savior and an monster
// the savior should move with the WASD or ARROW keys(display savior coords)
// the monster(for now) will be stationary
// the savior and the first monster should be able to collide to make something happen
// when the savior collides with the first monster, monster 1 is removed from the screen, and monster 2 appears
// after hitting monster 2, the game stops, and sends a message to the user that they have won.
// ////////////// END RULES /////////////////

//////////// INITIAL SETUP /////////////////////

// first we grab our HTML elements for easy reference later
const game = document.getElementById('canvas')
const movement = document.getElementById('movement')
const message = document.getElementById('status')
const startGame = document.getElementById('button')
const menu = document.getElementById('button2')
// const life = document.getElementById('canvas2')

// if we want to test if we got the right elements, you can do this:
menu.innerText = 'It works'

// we need to SET the game's context to be 2d
// we also want to save that context to a variable for reference later
// this is how we tell code to work within the context of the canvas
const ctx = game.getContext('2d')

// console.log('game before setting w and H', game)

// one thing we need to do, is get the computed size of our canvas
// then we save that attribute to our canvas so we can refer to it later
// once we have the exact size of our canvas, we can use those dimensions to simulate movement in interesting ways.
// these two lines will set the width and height attributes according to the way they look in your browser at the time the code runs
game.setAttribute('width', getComputedStyle(game)['width'])
game.setAttribute('height', getComputedStyle(game)['height'])
game.height = 320
game.width = 480
//////////////// How to play button /////////////////////


///////// Wall Collision Class /////////
// I need an object that stops the player from moving in that direction..
// only allowing the player to go around it and not through
class Wall {
    constructor(x, y, width, height, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
       // this.alive = true
        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}



//////////// MONSTER CLASS /////////////////////
// The monster class needs to be able to know player coordinates and
// have a set speed in which it persues the player.
class Monster  {
    constructor(x, y, width, height, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.alive = true
        this.speed = 5
        // Monster needs to be able to move towards player's direction at a certain speed
        this.speed = function moveMonster() {
            if (Savior.x > Monster.x) {
                Monster.x += Monster.speed
                monster.direction = "right"
            }
            if (Savior.x < Monster.x) {
                Monster.x -= Monster.speed
                monster.direction = "left"
            }
            if (Savior.y > Monster.y) {
                Monster.y += Monster.speed
                monster.direction = "down"
            }
            if (Savior.y < Monster.y) {
                Monster.y -= Monster.speed
                monster.direction = "up"
            }
        }
        // moveMonster()

        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}

class Savior  {
    constructor(x, y, width, height, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.alive = true
        //this.maxHealth = maxHealth
        //this.health = maxHealth
        // we need additional props on our savior class to make movement smoother
        this.speed = 20
        // now we'll add direction, which will be set with our move handler
        this.direction = {
            up: false,
            down: false,
            left: false,
            right: false
        }
        // two other methods, tied to key events
        // one sets the direction, which sends our savior flying in that direction
        this.setDirection = function (key) {
            console.log('this is the key in setDirection', key)
            if (key.toLowerCase() == 'w') { this.direction.up = true }
            if (key.toLowerCase() == 'a') { this.direction.left = true }
            if (key.toLowerCase() == 's') { this.direction.down = true }
            if (key.toLowerCase() == 'd') { this.direction.right = true }
        }
        // the other unsets a direction, which stops our savior from moving in that dir
        this.unsetDirection = function (key) {
            console.log('this is the key in unsetDirection', key)
            if (key.toLowerCase() == 'w') { this.direction.up = false }
            if (key.toLowerCase() == 'a') { this.direction.left = false }
            if (key.toLowerCase() == 's') { this.direction.down = false }
            if (key.toLowerCase() == 'd') { this.direction.right = false }
        }
        // this is our new movementHandler, we'll get rid of the old one
        // this will allow us to use the direction property on our savior object
        this.movePlayer = function () {
            // send our guy flyin in whatever direction is true
            if (this.direction.up) {
                this.y -= this.speed
                // while we're tracking movement, lets wall off the sides of the canvas
                if (this.y <= 0) {
                    this.y = 0
                }
            }
            if (this.direction.left) {
                this.x -= this.speed
                if (this.x <= 0) {
                    this.x = 0
                }
            }
            if (this.direction.down) {
                this.y += this.speed
                // to stop down and right directions, we again need to account for the size of our player
                if (this.y + this.height >= game.height) {
                    this.y = game.height - this.height
                }
            }
            if (this.direction.right) {
                this.x += this.speed
                if (this.x + this.width >= game.width) {
                    this.x = game.width - this.width
                }
            }
        }

        this.render = function () {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this.width, this.height)
        }
    }
}

const getRandomCoordinates = (max) => {
    // we'll use math.random to produce a random number
    return Math.floor(Math.random() * max)
}

const block = new Wall(200, 50, 2, 50, 'white')
const player = new Savior (220, 150, 10, 20, 'green')
const monster = new Monster (10, 120, 40, 70, 'red')
// const block = new Wall (300, 300, 10, 55, 'brown')
const ogre2 = new Monster (getRandomCoordinates(game.width), getRandomCoordinates(game.height), 64, 96, 'red')
const ogre3 = new Monster (getRandomCoordinates(game.width), getRandomCoordinates(game.height), 64, 96, 'red')



//////////////////////////////////////////

// player.render()
// monster.render()
// block.render()

// MOVEMENT HANDLING KEY EVENTS

//////////// COLLISION DETECTION /////////////////////
// here, we'll detect a hit between entities
// to accurately do this, we need to account for the entire space that one entity takes up.
// this means using the player x, y, width and height
// this also means using the monster x, y, w, h
// switch around so if player collides with monster they will be alive.false
const detectHit = (thing) => {
    // we'll basically use a big if statement, to be able to tell if any of the sides
    // of our savior interact with any of the sides of our monster
    if (player.x < thing.x + thing.width
        && player.x + player.width > thing.x
        && player.y < thing.y + thing.height
        && player.y + player.height > thing.y) {
            console.log('HIT!')
            thing.alive = false
        }
}
//// Collide with wall detection ///////
const detectWall = (wall) => {
    if (player.x < wall.x + wall.width
        && player.x + player.width > wall.x
        && player.y < wall.y + wall.height
        && player.y + player.height > wall.y) {
            console.log("BLOCKED!")
            render.wall()
        }

}

////////// Health Bar ///////////
const canvas = document.getElementById("canvas2");
const context = canvas.getContext("2d");
const width = canvas.width = 270;
const height = canvas.height = 100;

canvas.style.marginTop = window.innerHeight / 22 - height / 2 + "px";

let health = 100;
const healthBarWidth = 200;
const healthBarHeight = 30;
const x = width / 2 - healthBarWidth / 2;
const y = height / 2 - healthBarHeight / 2;

const healthBar = new HealthBar(x, y, healthBarWidth, healthBarHeight, health, "green");

const framed = function() {
  context.clearRect(0, 0, width, height);
  healthBar.show(context);
  requestAnimationFrame(framed);
}

canvas.onclick = function() {
  health -= 50;
  healthBar.updateHealth(health);
};

framed();

/////////////////////////////////////////////////////////////////////////////////////////


//////////// GAME LOOP /////////////////////
// we're going to set up a gameLoop function
// this will be attached to an interval
// this function will run every interval(amount of ms)
// this is how we will animate our game

const gameLoop = () => {
    // no console logs in here if you can avoid it
    // console.log('the game loop is running')
    // for testing, it's ok to add them, but final should not have any
    // putting our hit detection at the top so it takes precedence

    // to resemble movement, we should clear the old canvas every loop
    // then, instead of drawing a snake because it's maintaining all the old positions of our character
    // we'll just see our player square moving around
    ctx.clearRect(0, 0, game.width, game.height)

    if (monster.alive) {
        monster.render()
        detectHit(monster)
    } else if (ogre2.alive) {
        message.textContent = 'Now Kill Shrek 2!'
        ogre2.render()
        detectHit(ogre2)
    } else if (ogre3.alive) {
        message.textContent = 'Now Kill Shrek 3!'
        ogre3.render()
        detectHit(ogre3)
    } else {
        message.textContent = 'You win!'
        stopGameLoop()
    }

    player.render()
    player.movePlayer()
    block.render()

    //movement.textContent = `${player.x}, ${player.y}`
}

//////////// EVENT LISTENERS /////////////////////

// one key event for a keydown
// keydown will set a player's direction
document.addEventListener('keydown', (e) => {
    // when a key is pressed, set the appropriate direction
    player.setDirection(e.key)
})
// one key event for a keyup
// keyup, will unset a player's direction
document.addEventListener('keyup', (e) => {
    // when a key is released, call unsetDirection
    // this needs to be handled in a slightly different way
    if(['w', 'a', 's', 'd'].includes(e.key)) {
        player.unsetDirection(e.key)
    }
})

// we're going to save our game interval to a variable so we can stop it when we want to
// this interval runs the game loop every 60ms until we tell it to stop
const gameInterval = setInterval(gameLoop, 60)
// fn that stops the game loop
const stopGameLoop = () => { clearInterval(gameInterval) }

// here we'll add an event listener, when the DOMcontent loads, run the game on an interval
// eventually this event will have more in it.
document.addEventListener('DOMContentLoaded', function () {
    // here is our gameloop interval
    gameInterval
})