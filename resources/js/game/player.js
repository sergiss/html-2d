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
function Player(color) {
    Mob.call(this);

    this.static = false;
    this.color = color ? color : '#00FF00';
    this.hh = 10;
    this.hw = 4.5;

    this.standAnimation = createAnimation(characterImg, 3, 3, 2, 2, 0, -2);
    this.walkAnimation = createAnimation(characterImg, 3, 3, 3, 4, 0, -2);
    this.jumpAnimation = createAnimation(characterImg, 3, 3, 5, 5, 0, -2);
    this.climb1Animation = createAnimation(characterImg, 3, 3, 6, 7, 0, -2);
    this.climb2Animation = createAnimation(characterImg, 3, 3, 6, 6, 0, -2);

    this.clockAnimation = createAnimation(clockImg, 3, 3, 0, 7, 0, 0);
    this.clockAnimation.frameTime = 1;
    this.heartAnim = createAnimation(heartImg, 2, 2, 0, 3, 2, 2);
    //this.heartAnim.scale.set(0.75, 0.75);

    this.collisionGroup = PLAYER_GROUP;
    this.collisionMask = PLAYER_GROUP | ENEMY_GROUP | BULLET_GROUP | PLATFORM_GROUP | STAIRS_GROUP | ITEM_GROUP | EVENT_GROUP;

    this.xDir = 1;
    this.speed = 2.35;
    this.jumpForce = 250;

    this.maxHealth = 3;
    this.health = this.maxHealth;

    this.score = 0;

    let self = this;
    this.timer = new Timer({
        onTimeout: function() {
            console.log("Player Position: ")
            console.log(self.position);
        }
    });
    this.timer.setTimeout(2);

    this.clockTime = new Date().getTime();

    this.renderUi = function(camera) {

        let viewport = camera.viewport;
        let x = viewport.x1;
        let y = viewport.y1;

        // clock
        this.clockAnimation.render(x + this.clockAnimation.tw, y + 16, camera.context);

        let timeDiff = new Date().getTime() - this.clockTime;

        let div = timeDiff / 1000;
        let minutes = ("" + Math.min(99, (div / 60) << 0)).padStart(2, "0");
        let seconds = ("" + ((div % 60) << 0)).padStart(2, "0");
        //let millis = ("" + ((((timeDiff - (div << 0) * 1000)) / 10) << 0)).padStart(2, "0");
        let text = minutes + ":" + seconds /* + ":" + millis*/ ;
        camera.context.font = "7px Verdana";

        camera.context.fillStyle = "#FFF";
        camera.context.fillText(text, x + 25, y + 19);

        // health
        for (let i = 0; i < this.health; ++i)
            this.heartAnim.render(x + this.heartAnim.tw + (this.heartAnim.tw + 2) * i, viewport.y2 - 16, camera.context);

        // lives

        // inventory
        for (let i = 0; i < this.inventory.length; ++i)
            this.inventory[i].renderUi(x + 12 + (16 + 2) * i, viewport.y2 - 36, camera.context);
    }

    this.render = function(camera) {
        this.currentAnimation.render(this.position.x, this.position.y, camera.context);
    }

    this.update = function(dt) {

        this.clockAnimation.update(dt);

        // this.timer.step(dt);

        let minX = this.getMinX();
        if (minX < 0) {
            this.position.x -= minX;
        }

        if (this.health <= 0 ||
            this.position.y > 512) {
            this.health = 0;
            this.gameOver = true;
            this.world.remove(this);
            return;
        }

        if (this.left) {
            this.xDir = -1;
            this.currentAnimation = this.walkAnimation;
            this.force.x -= this.speed;
            /*let tgtForce = -this.speed - this.velocity.x;
            let force = tgtForce / dt;
            this.force.x += force;*/
        } else if (this.right) {
            this.xDir = 1;
            this.currentAnimation = this.walkAnimation;
            this.force.x += this.speed;
        } else {
            this.currentAnimation = this.standAnimation;
            if (this.onFloor) {
                this.velocity.x *= 0.75;
            }
        }

        if (this.climb) {
            if (this.up || this.down) {
                this.currentAnimation = this.climb1Animation;
            } else {
                this.currentAnimation = this.climb2Animation;
            }
        } else if (!this.onFloor) {
            this.currentAnimation = this.jumpAnimation;
        }

        this.currentAnimation.flipHorizontal = this.xDir == -1;

        if (this.jump) {
            this.jump = false;

            if (this.onFloor || (this.climb && !this.up)) {
                this.climb = false;
                jumpSound.play();
                this.force.y -= this.jumpForce;
            }
        }
        this.onFloor = false;
        this.currentAnimation.update(dt);

    }

    this.hurt = function(fx, fy) {
        this.health--;
        this.force.x = fx;
        this.force.y = fy
        this.climb = false;
    }

    this.onCollision = function(pair) {

        let entity = pair.b;
        if (entity.enemy) {
            if (pair.normal.y > 0) {
                this.world.remove(entity);
                let f = this.jumpForce;
                this.explosion(25, entity.position, new Vec2().set(this.velocity).nor().scl(-f, -f));
                this.createText(entity.points, entity.position);
                this.score += entity.points;
                this.force.y = -f;
            } else {
                this.world.solveCollision(pair);
                this.hurt(-pair.normal.x * this.jumpForce * 0.5, -this.jumpForce * 0.5);
            }
        } else if (entity instanceof Spikes) {
            if (pair.normal.y > 0) {
                this.world.solveCollision(pair);
                this.health--;
                this.force.x = -pair.normal.x * this.jumpForce * 0.5;
                this.force.y = -this.jumpForce * 0.5;
                this.climb = false;
            }
        }
    }

    this.increaseHealth = function(value) {
        this.health = Math.min(this.maxHealth, this.health + value);
        heartSound.play();
    }

}