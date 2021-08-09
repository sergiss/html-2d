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
window.addEventListener("load", function() {

    var container = document.getElementById("game-container");

    var debug = false;

    var player;
    var joypad;

    let keyMap = [];
    let game = new Game({

        create: function() {
            this.world = new World();
            this.world.background.addLayer("parallax8", parallax8, 0, 0, parallax8.width, parallax8.height, 0.5, 0.03, 0.3, 0, 80, 0, -100);
            this.world.background.addLayer("parallax7", parallax7, 0, 0, parallax7.width, parallax7.height, 0.5, 0.04, 0.4, 0, 80, 0, -50);
            this.world.background.addLayer("parallax6", parallax6, 0, 0, parallax6.width, parallax6.height, 0.5, 0.05, 0.5, 0, 80, 0, -100);
            this.world.background.addLayer("parallax5", parallax5, 0, 0, parallax5.width, parallax5.height, 0.5, 0.1, 0.6, 0, 80, 0, -90);
            this.world.background.addLayer("parallax4", parallax4, 0, 0, parallax4.width, parallax4.height, 0.5, 0.2, 0.7, 0, 80, 0, -80);
            this.world.background.addLayer("parallax3", parallax3, 0, 0, parallax3.width, parallax3.height, 0.5, 0.3, 0.8, 0, 80, 0, -70);
            this.world.background.addLayer("parallax2", parallax2, 0, 0, parallax2.width, parallax2.height, 0.5, 0.4, 0.9, 0, 0, 0, -60);
            this.world.background.addLayer("parallax1", parallax1, 0, 0, parallax1.width, parallax1.height, 0.5, 0.5, 1.0, 0, 0, 0, -50);

            this.map = new Map("./resources/data/", "level1.json");

            this.camera = new Camera(container);
            this.camera.zoom = 2.0;

            this.world.setMap(this.map, {
                collisionLayer: "Collisions",
                hasCollision: function(entity, tile) {
                    return tile > -1;
                },
                onCollision: function(entity, collisionInfo) {
                    if (collisionInfo.ny < 0) {
                        entity.onFloor = true;
                    }
                    return true;
                }
            });

            // Create Player
            player = new Player();
            this.world.add(player);

            // Load Objects
            for (let key in this.map.objects) {
                let list = this.map.objects[key];
                let obj;
                switch (key) {
                    case "player": // set player position
                        obj = list[0];
                        player.position.set(obj.x, obj.y);
                        this.camera.position.set(player.position);
                        break;
                    case "skull":
                        for (let i = 0; i < list.length; ++i) {
                            obj = list[i];
                            let skull = new Skull();
                            skull.position.set(obj.x, obj.y);
                            skull.right = true;
                            addRndItem(skull, this.world);
                            this.world.add(skull);
                        }
                        break;
                    case "bat":
                        for (let i = 0; i < list.length; ++i) {
                            obj = list[i];
                            let bat = new Bat();
                            bat.position.set(obj.x, obj.y);
                            bat.right = true;
                            addRndItem(bat, this.world);
                            this.world.add(bat);
                        }
                        break;
                    case "snake":
                        for (let i = 0; i < list.length; ++i) {
                            obj = list[i];
                            let snake = new Snake();
                            snake.position.set(obj.x, obj.y);
                            snake.right = true;
                            addRndItem(snake, this.world);
                            this.world.add(snake);
                        }
                        break;
                    case "tank":
                        for (let i = 0; i < list.length; ++i) {
                            obj = list[i];
                            let tank = new Tank();
                            tank.position.set(obj.x, obj.y);
                            tank.right = true;
                            addRndItem(tank, this.world);
                            this.world.add(tank);
                            tank.player = player;
                        }
                        break;
                    case "limit":
                        for (let i = 0; i < list.length; ++i) {
                            obj = list[i];
                            let limit = new Limit();
                            let hw = obj.width * 0.5;
                            let hh = obj.height * 0.5;
                            limit.hw = hw;
                            limit.hh = hh;
                            limit.position.set(obj.x + hw, obj.y + hh);
                            this.world.add(limit);
                        }
                        break;
                    case "stairs":
                        for (let i = 0; i < list.length; ++i) {
                            obj = list[i];
                            let stairs = new Stairs();
                            let hw = obj.width * 0.5;
                            let hh = obj.height * 0.5;
                            stairs.hw = hw;
                            stairs.hh = hh;
                            stairs.position.set(obj.x + hw, obj.y + hh);
                            this.world.add(stairs);
                        }
                        break;
                    case "platform":
                        for (let i = 0; i < list.length; ++i) {
                            obj = list[i];
                            let platform = new Platform();
                            let hw = obj.width * 0.5;
                            let hh = obj.height * 0.5;
                            platform.hw = hw;
                            platform.hh = hh;
                            platform.position.set(obj.x + hw, obj.y + hh);
                            platform.type = obj.getProperty("type");
                            this.world.add(platform);
                        }
                        break;
                    case "spring":
                        for (let i = 0; i < list.length; ++i) {
                            obj = list[i];
                            let spring = new Spring();
                            spring.position.set(obj.x, obj.y);
                            this.world.add(spring);
                        }
                        break;
                    case "door":
                        for (let i = 0; i < list.length; ++i) {
                            obj = list[i];
                            let door = new Door();
                            let hw = obj.width * 0.5;
                            let hh = obj.height * 0.5;
                            door.hw = hw;
                            door.hh = hh;
                            door.position.set(obj.x + hw, obj.y + hh);
                            door.keyId = obj.getProperty('keyId');
                            this.world.add(door);
                        }
                        break;
                    case "key":
                        for (let i = 0; i < list.length; ++i) {
                            obj = list[i];
                            let key = new Key();
                            key.position.set(obj.x, obj.y);
                            key.id = obj.id;
                            this.world.add(key);
                        }
                        break;
                    case "coin":
                        for (let i = 0; i < list.length; ++i) {
                            obj = list[i];
                            let coin = new Coin();
                            coin.setMass(0);
                            coin.position.set(obj.x, obj.y);
                            this.world.add(coin);
                        }
                        break;
                    case "heart":
                        for (let i = 0; i < list.length; ++i) {
                            obj = list[i];
                            let heart = new Heart();
                            heart.setMass(0);
                            heart.position.set(obj.x, obj.y);
                            this.world.add(heart);
                        }
                        break;
                    case "spikes":
                        for (let i = 0; i < list.length; ++i) {
                            obj = list[i];
                            let spikes = new Spikes();
                            let hw = obj.width * 0.5;
                            let hh = obj.height * 0.5;
                            spikes.hw = hw;
                            spikes.hh = hh;
                            spikes.position.set(obj.x + hw, obj.y + hh);
                            this.world.add(spikes);
                        }
                        break;
                    case "end":
                        for (let i = 0; i < list.length; ++i) {
                            obj = list[i];
                            let end = new End();
                            let hw = obj.width * 0.5;
                            let hh = obj.height * 0.5;
                            end.hw = hw;
                            end.hh = hh;
                            end.position.set(obj.x + hw, obj.y + hh);
                            this.world.add(end);
                        }
                        break;
                }

            }
            
            if ( window.location === window.parent.location ) { // Disable music in iframe
                musicSound.play();
            }

        },
        update: function(dt) {

            if (player.gameOver) {
                musicSound.stop();

                if (this.gameOver == undefined) {
                    this.gameOver = new GameOver();
                    this.world.addText(this.gameOver);
                }

                this.gameOver.position.set(this.camera.position);
                this.gameOver.ticks++;
                if (this.gameOver.ticks % 4 < 2) return;
                if (this.gameOver.ticks > this.gameOver.tgtTicks) {
                    this.world.clear();
                    this.gameOver = null;
                    this.create();
                }

            }

            // Update Camera
            let tmp1 = new Vec2();
            let tmp2 = new Vec2();
            let len = player.velocity.len() * 25.0;
            tmp2.set(player.velocity).nor().scl(len, 0);
            tmp1.set(player.position).add(tmp2);
            this.camera.follow(tmp1, this.map.getSize(), dt * 5);
            this.camera.update();

            // Update & Render
            this.world.step(dt);
            this.world.render(this.camera);

            if (debug) {
                this.world.debug(this.camera.context);
                this.camera.drawViewport();
            }
            player.renderUi(this.camera);

            if (joypad) {
                joypad.render();
            }

        },
        onKeyDown: function(e) {
            
            if (!keyMap[e.keyCode]) {
                keyMap[e.keyCode] = true;
                switch (e.keyCode) {
                    case 37:
                    case 79:
                        player.left = true;
                        player.right = false;
                        break;
                    case 39:
                    case 80:
                        player.right = true;
                        player.len = false;
                        break;
                    case 32:
                    case 88:
                        player.jump = true;
                        break;
                    case 38:
                        player.up = true;
                        player.down = false;
                        break;
                    case 40:
                        player.down = true;
                        player.up = false;
                        break;
                }
            }
        },
        onKeyUp: function(e) {
            
            keyMap[e.keyCode] = false;
            switch (e.keyCode) {
                case 37:
                case 79:
                    player.left = false;
                    break;
                case 39:
                case 80:
                    player.right = false;
                    break;
                case 32:
                case 88:
                    player.jump = false;
                    break;
                case 38:
                    player.up = false;
                    break;
                case 40:
                    player.down = false;
                    break;
            }
        }

    });
    game.start();

    if ("ontouchstart" in document.documentElement) {
        joypad = new Joypad(container);
        joypad.listener = game.listener;
    }

});

function GameOver() {
    Text.call(this);
    this.text = "GAME OVER";
    this.size = 40;
    this.ticks = 0;
    this.tgtTicks = 200;
}

function addRndItem(e) {
    let rnd = Math.random();
    if (rnd < 0.25) {
        let heart = new Heart();
        e.inventory.push(heart);
    }

    rnd = Math.random();
    if (rnd < 0.5) {
        let coin = new Coin();
        e.inventory.push(coin);
    }
}
