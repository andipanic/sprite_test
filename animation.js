var canvas = document.getElementById('canvas'),
    c = canvas.getContext('2d');

canvas.width = document.documentElement.clientWidth - 150;
canvas.height = document.documentElement.clientHeight - 200;

function imageLoaded() {
    game.imagesLoaded ++;
}
 
function Tileset(image, tileWidth, tileHeight) {
    this.image = new Image();
    game.images ++;
    this.image.onload = imageLoaded;
    this.image.src = image;
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
}

function Animation(tileset, frames, frameDuration) {
    this.tileset = tileset;
    this.frames = frames;
    this.currentFrame = 0;
    this.frameTimer = Date.now();
    this.frameDuration = frameDuration;
}

function Sprite(stateAnimations, startingState, x, y, width, height, speed) {
    this.stateAnimations = stateAnimations;
    this.currentState = startingState;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
}

function drawSprite(sprite) {
    c.drawImage(
        sprite.stateAnimations[sprite.currentState].tileset.image, 
        sprite.stateAnimations[sprite.currentState].frames[sprite.stateAnimations[sprite.currentState].currentFrame].split(',')[0] * sprite.stateAnimations[sprite.currentState].tileset.tileWidth,
        sprite.stateAnimations[sprite.currentState].frames[sprite.stateAnimations[sprite.currentState].currentFrame].split(',')[1] * sprite.stateAnimations[sprite.currentState].tileset.tileHeight,
        sprite.stateAnimations[sprite.currentState].tileset.tileWidth,
        sprite.stateAnimations[sprite.currentState].tileset.tileHeight,
        Math.round(sprite.x),
        Math.round(sprite.y),
        sprite.width,
        sprite.height
    );
}

function updateAnimation(anim) {
    rtime = Math.random() * (100000 - 1000) + 1000;
    if (anim.frameDuration == 255 && anim.currentFrame == 0) {
	if (Date.now() - anim.frameTimer > rtime) {
	    if (anim.currentFrame < anim.frames.length -1) anim.currentFrame ++;
	    else anim.currentFrame = 0;
	    anim.frameTimer = Date.now();
	}	
    } else if (Date.now() - anim.frameTimer > anim.frameDuration) {
        if (anim.currentFrame < anim.frames.length - 1) anim.currentFrame ++;
        else anim.currentFrame = 0;
        anim.frameTimer = Date.now();
    }
}

var game = {
    images: 0,
    imagesLoaded: 0,
    backgroundColor: '#fff'
}

var spriteTiles = new Tileset('sprite.png', 64, 64);
var spriteStanding = new Animation(spriteTiles, ['1,2','4,2'], 255);
var spriteN = new Animation(spriteTiles, ['1,1', '4,1'], 200);
var spriteNE = new Animation(spriteTiles, ['2,1', '5,1'], 200);
var spriteE = new Animation(spriteTiles, ['2,2', '5,2'], 200);
var spriteSE = new Animation(spriteTiles, ['2,3', '5,3'], 200);
var spriteS = new Animation(spriteTiles, ['1,3', '4,3'], 200);
var spriteSW = new Animation(spriteTiles, ['0,3', '3,3'], 200);
var spriteW = new Animation(spriteTiles, ['0,2', '3,2'], 200);
var spriteNW = new Animation(spriteTiles, ['0,1', '3,1'], 200);
var player = new Sprite({'standing': spriteStanding, 'up': spriteN, 'ne': spriteNE, 'right': spriteE, 'se': spriteSE, 'down': spriteS, 'sw': spriteSW, 'left': spriteW, 'nw': spriteNW}, 'up', canvas.width / 2, canvas.height / 2, 64, 64, 100);

var keysDown = {};
window.addEventListener('keydown', function(e) {
    keysDown[e.keyCode] = true;
});
window.addEventListener('keyup', function(e) {
    delete keysDown[e.keyCode];
});
 
function update(mod) {
    var two_down;

    if (37 in keysDown) {
        player.currentState = 'left';
        player.x -= (player.speed * 2) * mod;
        updateAnimation(player.stateAnimations[player.currentState]);
    }
    if (38 in keysDown) {
        player.currentState = 'up';
        player.y -= (player.speed * 2) * mod;
        updateAnimation(player.stateAnimations[player.currentState]);
    }
    if (39 in keysDown) {
        player.currentState = 'right';
        player.x += (player.speed * 2) * mod;
        updateAnimation(player.stateAnimations[player.currentState]);
    }
    if (40 in keysDown) {
        player.currentState = 'down';
        player.y += (player.speed * 2) * mod;
        updateAnimation(player.stateAnimations[player.currentState]);
    }
    if (38 in keysDown && 39 in keysDown) {
        player.currentState = 'ne';
        player.x += (player.speed / 8) * mod;
        player.y -= (player.speed / 8) * mod;
        updateAnimation(player.stateAnimations[player.currentState]);
    }
    if (39 in keysDown && 40 in keysDown) {
        player.currentState = 'se';
        player.x += (player.speed / 8) * mod;
        player.y += (player.speed / 8) * mod;
        updateAnimation(player.stateAnimations[player.currentState]);
    }
    if (37 in keysDown && 40 in keysDown) {
        player.currentState = 'sw';
        player.x -= (player.speed / 8) * mod;
        player.y += (player.speed / 8) * mod;
        updateAnimation(player.stateAnimations[player.currentState]);
    }
    if (37 in keysDown && 38 in keysDown) {
        player.currentState = 'nw';
        player.x -= (player.speed / 8) * mod;
        player.y -= (player.speed / 8) * mod;
        updateAnimation(player.stateAnimations[player.currentState]);
    }

    if (!(37 in keysDown) && !(38 in keysDown) && !(39 in keysDown) && !(40 in keysDown)) {
        player.currentState = 'standing';
        updateAnimation(player.stateAnimations[player.currentState]);
    }
}

function render() {
    c.fillStyle = game.backgroundColor;
    c.fillRect(0, 0, canvas.width, canvas.height);
    drawSprite(player);
}

function main() {
    update((Date.now() - then) / 1000);
    if (game.images == game.imagesLoaded) {
        render();
    }
    then = Date.now();
}

var then = Date.now();
setInterval(main, 10);
