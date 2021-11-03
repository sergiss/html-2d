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
function Door() {
    Entity.call(this);

    this.open = false;

    this.keyId = "";

    this.setMass(0);

    this.collisionGroup = PLATFORM_GROUP;
    this.collisionMask = PLAYER_GROUP | ENEMY_GROUP | ITEM_GROUP | PLATFORM_GROUP | BULLET_GROUP;

    this.render = function(camera) {
        if (!this.open && this.isVisible(camera)) {
            camera.context.drawImage(doorImg, this.position.x - this.hw, this.position.y - this.hh, this.hw * 2, this.hh * 2);
        }
    }

    this.onCollision = function(pair) {
        if (!this.open && pair.b.inventory) {
            // test if entity has the key
            let key = removeKey(pair.b, this.keyId);
            this.open = key != undefined;
        }
        if (!this.open) {
            this.collisionMask |= BULLET_GROUP;
            this.world.solveCollision(pair);
        } else {
            this.collisionMask &= ~BULLET_GROUP;
        }
    }

}

function removeKey(e, id) {
    for (let i = 0; i < e.inventory.length; ++i) {
        let obj = e.inventory[i];

        if (obj instanceof Key) {
            if (obj.id == id) {
                e.inventory.splice(i, 1);
                return obj;
            }
        }
    }
    return null;
}