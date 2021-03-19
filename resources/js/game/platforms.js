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
function Platform() {
    Entity.call(this);

    this.speed = 1.0;
    this.dir = 1;
    this.direction = false;

    this.type = 0; // type 0 = platform, type 1 = elevator

    this.setMass(0);
    this.static = false;

    this.collisionGroup = PLATFORM_GROUP;
    this.collisionMask = PLAYER_GROUP | ENEMY_GROUP | ITEM_GROUP | PLATFORM_GROUP | LIMIT_GROUP | BULLET_GROUP;

    this.render = function(camera) {
        if (this.isVisible(camera)) {
            camera.context.drawImage(platformImg, this.position.x - this.hw, this.position.y - this.hh, this.hw * 2, this.hh * 2);
        }
    }

    this.update = function(dt) {

        switch (this.type) {
            case 1:
                {
                    if (this.direction) {
                        if (this.dir == 1) this.velocity.y = 0;
                        this.dir = -1;
                        this.force.y -= this.speed;
                    } else {
                        if (this.dir == -1) this.velocity.y = 0;
                        this.dir = 1;
                        this.force.y += this.speed;
                    }
                    break;
                }
            default:
                {
                    if (this.direction) {
                        if (this.dir == 1) this.velocity.x = 0;
                        this.dir = -1;
                        this.force.x -= this.speed;
                    } else {
                        if (this.dir == -1) this.velocity.x = 0;
                        this.dir = 1;
                        this.force.x += this.speed;
                    }
                    break;
                }
        }

    }

    this.onCollision = function(pair) {
        let entity = pair.b;
        if (entity instanceof Limit) return;
        this.world.solveCollision(pair);
        if (pair.normal.y < 0) {
            entity.linearVelocity.x += this.velocity.x;
            entity.force.y += 2;
            entity.onFloor = true;
        }
    }

}

function Spring() {
    Entity.call(this);

    this.hw = 8;
    this.hh = 8;

    this.dir = 1;
    this.direction = false;

    this.static = false;
    this.setMass(1.0);

    this.springAnimation = createAnimation(springImg, 2, 1, 0, 1, 0, -8);

    this.animate = false;
    this.time = 0;

    this.collisionGroup = PLATFORM_GROUP;
    this.collisionMask = PLAYER_GROUP | ENEMY_GROUP | ITEM_GROUP | PLATFORM_GROUP;

    this.render = function(camera) {
        if (this.isVisible(camera)) {
            this.springAnimation.render(this.position.x, this.position.y, camera.context);
        }
    }

    this.update = function(dt) {
        this.velocity.x *= 0.95;
        if (this.animate) {
            this.time += dt;
            this.springAnimation.update(dt);
            if (this.time > 0.5) {
                this.time = 0;
                this.animate = false;
                this.springAnimation.restart();
            }
        }
    }

    this.onCollision = function(pair) {
        let entity = pair.b;
        if (entity instanceof Limit ||
            entity instanceof Stairs ||
            (entity instanceof Coin && entity.static)) return;
        this.world.solveCollision(pair);
        if (pair.normal.y < 0) {
            entity.force.y -= 500;
            entity.onFloor = false;
            this.animate = true;
            this.time = 0;
            if (pair.b instanceof Player) {
                springSound.stop();
                springSound.play();
            }
        }
    }

}

function Spikes() {
    Entity.call(this);

    this.static = true;
    this.setMass(0.0);

    this.spikesAnimation = createAnimation(spikesImg, 2, 1, 0, 1, 0, 0);
    this.spikesAnimation.scale.x = 0.5;

    let w = this.spikesAnimation.getWidth();

    this.collisionGroup = BULLET_GROUP;
    this.collisionMask = PLAYER_GROUP | ENEMY_GROUP;

    this.render = function(camera) {
        if (this.isVisible(camera)) {

            let th = (this.hh * 2.0);
            this.spikesAnimation.scale.y = th / this.spikesAnimation.th;

            let tmp = this.hw * 2.0;
            let n = tmp / w;

            let offX = ((n * 0.5) >> 0) * w - w;
            let offY = (this.spikesAnimation.th - th) * 0.5;

            for (let i = 0; i < n; ++i) {
                this.spikesAnimation.render(this.position.x + i * w - offX, this.position.y + offY, camera.context);
            }
        }
    }

    this.update = function(dt) {
        this.spikesAnimation.update(dt);
    }

    this.onCollision = function(pair) {
        //this.world.solveCollision(pair);
    }

}