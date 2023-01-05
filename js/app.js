// I need three entities: a savior, a monster, and a person-in-need.
// the savior needs to be able to move with up and down arrow keys
// the monster needs to know where the player is to collide and make something happen
// When monster collides with player, player should lose health/or die if no health left
// I need obsticles in the game to make it more challenging for player to get to perosn-in-need.
// If player collides with obsticles, player gets slowed down
// When player collides with person-in-need, game ends and you win
////////////////////////////////////////////////////////


// html elements to refer to later
const game = document.getElementById('canvas')
const timer = document.getElementById('timer')
const startGame = document.getElementById('button')
const menu = document.getElementById('button2')
const health = document.getElementById('health')

// timer.innerText = 'hhhh'

const ctx = game.getContext('2d')

//console.log('game before setting v and h')

game.setAttribute('width', getComputedStyle(game)['width'])
game.setAttribute('height', getComputedStyle(game)['height'])
game.height = 480

///// Person-in-need Class /////
class Friend {
    constructor(x, y, width, height, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.alive = true
        this.render = function () {
            ctx.fillStyle = this
        }
    }
}

//////// Savior Class /////////
class Savior {
    constructor(x, y, width, health, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = health
        this.color = color
        this.alive = true
        // players speed and direction
        this.speed = 20
        this.direction = {
            up: false,
            down: false,
            right: false,
            left: false
        }
        // the keys that sets the hero in that direction
        this.setDirection = function (key) {
            console.log('this is the key in setDirection', key)
            if (key.toLowerCase() == 'w') { this.direction.up = true }
            if (key.toLowerCase() == 'a') { this.direction.left = true }
            if (key.toLowerCase() == 's') { this.direction.down = true }
            if (key.toLowerCase() == 'd') { this.direction.right = true }
        }
        // when you let go it unsets player in the direction
        this.unsetDirection = function (key) {
            console.log('this is the key in unsetDirection', key)
            if (key.toLowerCase() == 'w') { this.direction.up = false }
            if (key.toLowerCase() == 'a') { this.direction.left = false }
            if (key.toLowerCase() == 's') { this.direction.down = false }
            if (key.toLowerCase() == 'd') { this.direction.right = false }
        }

        // I will need to set the direction property on savior object
        this.moveSavior = function () {
            if (this.direction.up) {
                this.y -= this.speed
                // this is to wall off savior
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

/*const getRandomCoordinates = (max) => {
    // we'll use math.random to produce a random number
    return Math.floor(Math.random() * max)
} */

///////// Monster Class ////////
// monster will have similar coordinates to player but after a certain time
class Monster {
    constructor(x, y, width, height, color) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.color = color
        this.alive = true
        this.speed = 15
        this.render = function (follow) {
            ctx.fillStyle = this.color
            ctx.fillRect(this.x, this.y, this,width, this.height)
            // monster needs to know players coordinates at all times
            
        }
    }
}

const player = new Savior(10, 10, 16, 16, 'lightsteelblue')
const monster = new Monster (200, 50, 32, 48, '#bada55')
const friend = new Friend (getRandomCoordinates(game.width), getRandomCoordinates(game.height), 64, 96, 'red')

Savior.render()
