/*
 * Copyright (c) 2021, Sergio S.- sergi.ss4@gmail.com http://sergiosoriano.com
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 * 
 * 3. Neither the name of the copyright holder nor the names of its
 *    contributors may be used to endorse or promote products derived from
 *    this software without specific prior written permission.
 *    	
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 
 */
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
var doorImg = loadImage("./resources/data/images/door.png");
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
