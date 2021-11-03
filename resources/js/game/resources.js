var loadImage = function(src) {
    let result = document.createElement("img");
    result.src = src;
    return result;
}

var skeletonImg = loadImage("./resources/data/images/skeleton.png");
var batImg = loadImage("./resources/data/images/bat.png");
var characterImg = loadImage("./resources/data/images/character.png");
var platformImg = loadImage("./resources/data/images/platform.png");
var spikesImg = loadImage("./resources/data/images/spikes.png");
var springImg = loadImage("./resources/data/images/spring.png")
var snakeImg = loadImage("./resources/data/images/snake.png");
var doorImg = loadImage("./resources/data/images/platform.png");
var keyImg = loadImage("./resources/data/images/key.png");
var heartImg = loadImage("./resources/data/images/heart.png");
var coinImg = loadImage("./resources/data/images/coin.png");
var clockImg = loadImage("./resources/data/images/clock.png");
var canonImg = loadImage("./resources/data/images/canon.png");

var parallax1 = loadImage("./resources/data/parallax/layer_01_1920 x 1080.png");
var parallax2 = loadImage("./resources/data/parallax/layer_02_1920 x 1080.png");
var parallax3 = loadImage("./resources/data/parallax/layer_03_1920 x 1080.png");
var parallax4 = loadImage("./resources/data/parallax/layer_04_1920 x 1080.png");
var parallax5 = loadImage("./resources/data/parallax/layer_05_1920 x 1080.png");
var parallax6 = loadImage("./resources/data/parallax/layer_06_1920 x 1080.png");
var parallax7 = loadImage("./resources/data/parallax/layer_07_1920 x 1080.png");
var parallax8 = loadImage("./resources/data/parallax/layer_08_1920 x 1080.png");

var jumpSound;
var musicSound;
var keySound;
var springSound;
window.addEventListener("load", function() {
    jumpSound = new Sound("./resources/data/sounds/jump.mp3");
    jumpSound.sound.volume = 0.5;

    heartSound = new Sound("./resources/data/sounds/heart.mp3");
    heartSound.sound.volume = 1;

    keySound = new Sound("./resources/data/sounds/key.mp3");
    keySound.sound.volume = 1;

    coinSound = new Sound("./resources/data/sounds/coin.mp3");
    coinSound.sound.volume = 1;

    explosionSound = new Sound("./resources/data/sounds/explosion.mp3");
    explosionSound.sound.volume = 0.5;

    springSound = new Sound("./resources/data/sounds/spring.mp3");
    springSound.sound.volume = 0.5;

    musicSound = new Sound("./resources/data/music/music3.mp3");
    musicSound.sound.volume = 0.5;
});