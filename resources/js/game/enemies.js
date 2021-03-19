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
function Enemy() {
    Mob.call(this);

    this.enemy = true;
    this.points = 0;

    this.collisionGroup = ENEMY_GROUP;
    this.collisionMask = LIMIT_GROUP | PLAYER_GROUP | BULLET_GROUP | ITEM_GROUP | PLATFORM_GROUP | STAIRS_GROUP;

}

function Snake() {
    Enemy.call(this);

    this.hh = 4;
    this.hw = 12;

    this.walkAnimation = createAnimation(snakeImg, 3, 1, 0, 2, 0, -4);
    this.walkAnimation.frameTime = 0.25;
    this.walkAnimation.currentTime = Math.random() * this.walkAnimation.frameTime;

    this.speed = 0.5 + Math.random() * 0.3;
    this.dir = 1;
    this.direction = false;

    this.points = 50;

    this.render = function(camera) {
        if (this.isVisible(camera)) {
            this.currentAnimation.render(this.position.x, this.position.y, camera.context);
        }
    }

    this.update = function(dt) {

        if (this.direction) {
            if (this.dir == 1) this.velocity.x = 0;
            this.dir = -1;
            this.currentAnimation = this.walkAnimation;
            this.force.x -= this.speed;
        } else {
            if (this.dir == -1) this.velocity.x = 0;
            this.dir = 1;
            this.currentAnimation = this.walkAnimation;
            this.force.x += this.speed;
        }

        if (this.world.getCollisionInfo(this, this.force.x, 0) != null) {
            this.direction = !this.direction;
        }

        this.currentAnimation.flipHorizontal = this.dir == 1;
        this.currentAnimation.update(dt);
        if (this.currentAnimation.frameIndex == 0) {
            this.velocity.x = 0;
        }

    }

    this.onCollision = function(pair) {
        // this.world.solveCollision(pair);
    }

}

function Bat() {
    Enemy.call(this);

    this.hh = 8;
    this.hw = 8;

    this.flyAnimation = createAnimation(batImg, 2, 1, 0, 1, 0, 0);
    this.flyAnimation.frameTime = 0.2;
    this.flyAnimation.currentTime = Math.random() * this.flyAnimation.frameTime;

    this.speed = 1.0 + Math.random() * 0.3;
    this.dir = 1;
    this.direction = false;

    this.points = 75;

    this.setMass(0);
    this.static = false;

    this.time = 0;

    this.render = function(camera) {
        if (this.isVisible(camera)) {
            let offY = Math.sin(this.time) * 3;
            this.currentAnimation.render(this.position.x, this.position.y + offY, camera.context);
        }
    }

    this.update = function(dt) {

        this.time += dt * 17;

        if (this.direction) {
            if (this.dir == 1) this.velocity.x = 0;
            this.dir = -1;
            this.currentAnimation = this.flyAnimation;
            this.force.x -= this.speed;
        } else {
            if (this.dir == -1) this.velocity.x = 0;
            this.dir = 1;
            this.currentAnimation = this.flyAnimation;
            this.force.x += this.speed;
        }

        if (this.world.getCollisionInfo(this, this.force.x, 0) != null) {
            this.direction = !this.direction;
        }

        this.currentAnimation.flipHorizontal = this.dir == 1;
        this.currentAnimation.update(dt);

    }

    this.onCollision = function(pair) {
        // this.world.solveCollision(pair);
    }

}

function Skull() {
    Enemy.call(this);

    this.hh = 10;
    this.hw = 4.5;

    this.walkAnimation = createAnimation(skeletonImg, 4, 9, 4, 7, 0, 0);

    this.speed = 1.0 + Math.random() * 0.15;
    this.dir = 1;
    this.direction = false;

    this.points = 100;

    this.render = function(camera) {
        if (this.isVisible(camera)) {
            this.currentAnimation.render(this.position.x, this.position.y, camera.context);
        }
    }

    this.update = function(dt) {

        if (this.direction) {
            if (this.dir == 1) this.velocity.x = 0;
            this.dir = -1;
            this.currentAnimation = this.walkAnimation;
            this.force.x -= this.speed;
        } else {
            if (this.dir == -1) this.velocity.x = 0;
            this.dir = 1;
            this.currentAnimation = this.walkAnimation;
            this.force.x += this.speed;
        }

        if (this.world.getCollisionInfo(this, this.force.x, 0) != null) {
            this.direction = !this.direction;
        }

        this.currentAnimation.flipHorizontal = this.dir == -1;
        this.currentAnimation.update(dt);

    }

    this.onCollision = function(pair) {
        // this.world.solveCollision(pair);
    }

}

function Tank() {
    Enemy.call(this);

    this.hh = 14;
    this.hw = 13;

    this.moveAnimation = createAnimation(canonImg, 2, 2, 0, 1, 0, 0);

    this.speed = 0.65 + Math.random() * 0.15;
    this.dir = 1;
    this.direction = false;

    this.points = 150;
    this.rotation = 0;

    this.time = 0;

    this.render = function(camera) {
        this.visible = this.isVisible(camera);
        if (this.visible) {
            camera.context.save();

            let y = this.position.y - 4;
            let x = this.position.x;

            camera.context.translate(x, y)
            camera.context.rotate(this.rotation);
            camera.context.drawImage(canonImg, 3, 45, 20, 10, -2, -5, 20, 10);
            camera.context.restore();

            this.currentAnimation.render(this.position.x, this.position.y, camera.context);
        }
    }

    this.update = function(dt) {

        if (!this.remove && this.visible) {
            let rotation = computeRadians(this.position.x, this.position.y, this.player.position.x, this.player.position.y) - Math.PI / 2;
            this.rotation = interpolate(this.rotation, Math.min(0, Math.max(-Math.PI, rotation)), dt * 4.0);
            this.time += dt;
            if (this.time > 1.0) {
                this.time = 0;
                let bullet = new Bullet();
                bullet.direction.set(1, 0).rotate(this.rotation);
                bullet.position.set(this.position.x + bullet.direction.x * 20, this.position.y - 4.9 + bullet.direction.y * 20);
                this.world.add(bullet);
            }
        }

        if (this.direction) {
            if (this.dir == 1) this.velocity.x = 0;
            this.dir = -1;
            this.currentAnimation = this.moveAnimation;
            this.force.x -= this.speed;
        } else {
            if (this.dir == -1) this.velocity.x = 0;
            this.dir = 1;
            this.currentAnimation = this.moveAnimation;
            this.force.x += this.speed;
        }

        if (this.world.getCollisionInfo(this, this.force.x, 0) != null) {
            this.direction = !this.direction;
        }

        this.currentAnimation.flipHorizontal = this.dir == -1;
        this.currentAnimation.update(dt);

    }

    this.onCollision = function(pair) {
        // this.world.solveCollision(pair);
    }

}

function Bullet() {
    Entity.call(this);

    this.hh = 2;
    this.hw = 2;

    this.speed = 0.65 + Math.random() * 0.15;
    this.direction = new Vec2();

    this.setMass(0);
    this.static = false;

    this.speed = 2;

    this.collisionGroup = BULLET_GROUP;
    this.collisionMask = PLAYER_GROUP | ENEMY_GROUP | PLATFORM_GROUP;

    this.color = "#fffa4c";
    this.time = 0;

    this.render = function(camera) {
        this.visible = this.isVisible(camera);
        if (this.visible) {
            camera.context.beginPath();
            camera.context.fillStyle = this.color;
            camera.context.arc(this.position.x, this.position.y, this.hw, 0, Math.PI * 2.0);
            camera.context.fill();
        }
    }

    this.update = function(dt) {

        if (this.time > 10) {
            this.world.remove(this);
        } else {
            this.time += dt;
            let tgtForce = this.direction.x * this.speed - this.velocity.x;
            let force = tgtForce / dt;
            this.force.x += force;

            tgtForce = this.direction.y * this.speed - this.velocity.y;
            force = tgtForce / dt;
            this.force.y += force;
        }

    }

    this.onCollision = function(pair) {
        this.world.remove(this);
        if (pair.b instanceof Player) {
            this.velocity.nor();
            pair.b.hurt(this.velocity.x * pair.b.jumpForce * 0.5, -pair.b.jumpForce * 0.5);
        } else if (pair.b.enemy) {
            this.world.remove(pair.b);
            this.explosion(25, pair.b.position, this.force);
        }
    }

    this.onWorldCollision = function(collisionInfo) {
        this.explosion(10, this.position, this.force, this.color);
        this.world.remove(this);
        return true;
    }

}