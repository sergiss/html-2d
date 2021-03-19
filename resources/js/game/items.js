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

function Item() {
    Entity.call(this);
    this.collisionGroup = ITEM_GROUP;
}

function Key() {
    Item.call(this);

    this.hw = 8;
    this.hh = 4;

    this.update = function(dt) {
        this.velocity.x *= 0.95;
    }

    this.render = function(camera) {
        if (this.isVisible(camera)) {
            camera.context.drawImage(keyImg, this.position.x - this.hw, this.position.y - this.hh, this.hw * 2, this.hh * 2);
        }
    }

    this.renderUi = function(x, y, context) {
        context.drawImage(keyImg, x, y, this.hw * 2, this.hh * 2);
    }

    this.onCollision = function(pair) {
        if (!pair.b.removed && pair.b.inventory) {
            pair.b.inventory.push(this);
            this.world.remove(this);
            if (pair.b instanceof Player)
                keySound.play();
        }
    }

}

function Heart() {
    Item.call(this);

    this.hw = 6;
    this.hh = 6;

    this.heartAnim = createAnimation(heartImg, 2, 2, 0, 3, 2, 2);
    this.heartAnim.scale.set(0.75, 0.75);

    this.update = function(dt) {
        this.heartAnim.update(dt);
    }

    this.render = function(camera) {
        if (this.isVisible(camera)) {
            this.heartAnim.render(this.position.x, this.position.y, camera.context);
        }
    }

    this.onCollision = function(pair) {
        if (!pair.b.removed) {
            if (pair.b instanceof Player) {
                pair.b.increaseHealth(1);
                this.world.remove(this);
            } else if (pair.b.inventory) {
                pair.b.inventory.push(this);
                this.world.remove(this);
            }
        }
    }

}

function Coin() {
    Item.call(this);

    this.hw = 6;
    this.hh = 6;

    this.points = 25;

    this.coinAnim = createAnimation(coinImg, 3, 3, 0, 6, 0, 0);
    this.coinAnim.scale.set(0.75, 0.75);

    this.update = function(dt) {
        this.coinAnim.update(dt);
    }

    this.render = function(camera) {
        if (this.isVisible(camera)) {
            this.coinAnim.render(this.position.x, this.position.y, camera.context);
        }
    }

    this.onCollision = function(pair) {
        if (!pair.b.removed) {
            if (pair.b instanceof Player) {
                pair.b.createText(10, this.position);
                pair.b.score += this.points;
                coinSound.stop();
                coinSound.play();
                this.world.remove(this);
            } else if (pair.b.inventory) {
                pair.b.inventory.push(this);
                this.world.remove(this);
            }
        }
    }

}