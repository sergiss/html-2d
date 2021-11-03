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
function Stairs() {
    Entity.call(this);

    this.hh = 8;
    this.hw = 8;

    this.speed = 1;

    this.setMass(0);

    this.collisionGroup = STAIRS_GROUP;
    this.collisionMask = PLAYER_GROUP | ENEMY_GROUP;

    this.onCollision = function(pair) {

        let entity = pair.b;

        if (!entity.down && !entity.climb && pair.normal.y < 0) { // check onFloor
            this.world.solveCollision(pair);
            entity.onFloor = true;
        } else if (entity.climb) {

            if (entity.down && this.getMaxY() - entity.getMaxY() <= this.speed) { // lower exit
                entity.climb = false;
            } else if (entity.up && entity.getMaxY() - this.getMinY() <= this.speed) { // upper exit
                entity.climb = false;
            } else { // climb
                this.fixPosition(entity);
                entity.velocity.y = 0;
                entity.force.y = 0;
                if (entity.up) {
                    entity.position.y -= this.speed;
                } else if (entity.down) {
                    entity.position.y += this.speed;
                }
            }

        } else if (entity.down && pair.normal.y < 0) { // upper enter
            entity.climb = true;
        } else if (entity.up) { // lower enter
            if (pair.penetration > this.hw * 0.5) {
                entity.climb = true;
            }
        }

    }

    this.fixPosition = function(e) {
        e.position.x = interpolate(e.position.x, this.position.x, 0.2);
        e.velocity.x = 0;
        e.force.x = 0;
    }

    this.getPositionY = function() {
        return this.position.y - 0.01; // fix stairs upper position
    }

}