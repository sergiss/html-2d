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
var PLAYER_GROUP = 1;
var ENEMY_GROUP = 2;
var BULLET_GROUP = 4;
var PLATFORM_GROUP = 8;
var STAIRS_GROUP = 16;
var ITEM_GROUP = 32;
var LIMIT_GROUP = 64;
var EVENT_GROUP = 128;

class World {

    constructor() {
        this.clear();
    }

    handlePromises() {
        const promises = [];
        promises.push(this.map.load());
        return promises;
    }

    clear() {
        this.clearVelocity = true;
        this.gravity = new Vec2(0, 9.80665);

        this.texts = [];
        this.entities = [];

        this.background = null;
        this.map = null;
        this.collisionListener = null;
    }

    step(dt) {

        let j, i, entity;

        // update entities
        for (i = 0; i < this.entities.length; ++i) {
            entity = this.entities[i];
            entity.update(dt);
            if (entity.invMass != 0) {
                entity.velocity.addScl(this.gravity, dt);
            }
            entity.velocity.addScl(entity.force, dt);
            entity.force.setZero();
        }

        // test entity collision
        for (i = 0; i < this.entities.length; ++i) {
            entity = this.entities[i];
            for (j = i + 1; j < this.entities.length; ++j) {
                let b = this.entities[j];
                if ((entity.collisionMask & b.collisionGroup) == b.collisionGroup) {
                    if (!entity.static || !b.static) {
                        let pair = {
                            normal: new Vec2(),
                            penetration: 0,
                            dt: dt
                        };
                        if (entity.hit(b, pair)) {
                            pair.a = entity;
                            pair.b = b;
                            entity.onCollision(pair);

                            pair.a = b;
                            pair.b = entity;
                            pair.normal.negate();
                            b.onCollision(pair);
                        }
                    }
                }
            }
        }

        // test world collision
        for (i = 0; i < this.entities.length; ++i) {
            entity = this.entities[i];
            if (!entity.static) {
                entity.velocity.addScl(entity.force, dt);
                entity.linearVelocity.add(entity.velocity);
                this.tryToMove(entity, entity.linearVelocity.x, entity.linearVelocity.y);
                if (this.clearVelocity)
                    entity.velocity.scl(0.98, 0.98);
            } else {
                entity.velocity.setZero();
            }
            entity.force.setZero();
            entity.linearVelocity.setZero();
        }

        this.updateTexts(dt);
    }

    tryToMove(entity, dx, dy) {

        let tmp, collisionInfo;
        if (dx != 0.0) {
            collisionInfo = this.getCollisionInfo(entity, dx, 0);
            if (collisionInfo == null) {
                entity.position.x += dx;
            } else {

                if (dx > 0) {
                    tmp = entity.position.x + entity.hw;
                    let t = Math.ceil(tmp / this.map.tileSize) * this.map.tileSize;
                    collisionInfo.nx = -1.0;
                    collisionInfo.ny = 0;
                    collisionInfo.penetration = tmp - t;
                } else {
                    tmp = entity.position.x - entity.hw;
                    let t = Math.floor(tmp / this.map.tileSize) * this.map.tileSize;
                    collisionInfo.nx = 1.0;
                    collisionInfo.ny = 0;
                    collisionInfo.penetration = t - tmp;
                }

                if (entity.onWorldCollision(collisionInfo) || this.collisionListener.onCollision(entity, collisionInfo)) {
                    tmp = collisionInfo.penetration * collisionInfo.nx;
                    // if(this.getCollisionInfo(entity, tmp, 0) == null) {
                    entity.position.x += collisionInfo.penetration * collisionInfo.nx;
                    entity.velocity.x = -entity.velocity.x * entity.restitution;
                    // }
                } else {
                    entity.position.x += dx;
                }

            }
        }

        if (dy != 0.0) {
            collisionInfo = this.getCollisionInfo(entity, 0, dy);
            if (collisionInfo == null) {
                entity.position.y += dy;
            } else {

                if (dy > 0) {
                    tmp = entity.position.y + entity.hh;
                    let t = Math.ceil(tmp / this.map.tileSize) * this.map.tileSize;
                    collisionInfo.nx = 0;
                    collisionInfo.ny = -1.0;
                    collisionInfo.penetration = tmp - t;
                } else {
                    tmp = entity.position.y - entity.hh;
                    let t = Math.floor(tmp / this.map.tileSize) * this.map.tileSize;
                    collisionInfo.nx = 0;
                    collisionInfo.ny = 1.0;
                    collisionInfo.penetration = t - tmp;
                }

                if (entity.onWorldCollision(collisionInfo) || this.collisionListener.onCollision(entity, collisionInfo)) {
                    tmp = collisionInfo.penetration * collisionInfo.ny;
                    // if(this.getCollisionInfo(entity, 0, tmp) == null) {
                    entity.position.y += collisionInfo.penetration * collisionInfo.ny;
                    entity.velocity.y = -entity.velocity.y * entity.restitution;
                    // }
                } else {
                    entity.position.y += dy;
                }

            }
        }
    }

    solveCollision(pair) {

        let a = pair.a;
        let b = pair.b;

        let invMass = a.invMass + b.invMass;
        if (invMass > 0.0) {
            let normal = pair.normal;
            // Velocity Correction
            let velocityDiff = new Vec2();
            velocityDiff.set(b.velocity).sub(a.velocity);
            let normalVelocity = velocityDiff.dot(normal);
            if (normalVelocity < 0) {
                let j = -normalVelocity / invMass;
                a.velocity.addScl(normal, -j * a.invMass);
                b.velocity.addScl(normal, j * b.invMass);
                // Position Correction
                let correction = pair.penetration / invMass;
                let x = normal.x * correction;
                let y = normal.y * correction;
                this.tryToMove(a, -x * a.invMass, -y * a.invMass);
                this.tryToMove(b, x * b.invMass, y * b.invMass);
            }

        }
    }

    render(camera) {
        this.background.render(camera);
        if(this.map)
        this.map.render(camera);
        let i, entity;
        for (i = 0; i < this.entities.length; ++i) {
            entity = this.entities[i];
            entity.render(camera);
        }
        this.renderTexts(camera);
    }

    getCollisionInfo(entity, dx, dy) { // dx or dy must be zero
        let tileSize = this.map.tileSize;
        let x1 = Math.max(0, Math.floor((entity.position.x + dx - entity.hw) / tileSize));
        let y1 = Math.max(0, Math.floor((entity.position.y + dy - entity.hh) / tileSize));

        let x2 = Math.min(this.map.width, Math.ceil((entity.position.x + dx + entity.hw) / tileSize));
        let y2 = Math.min(this.map.height, Math.ceil((entity.position.y + dy + entity.hh) / tileSize));

        let collisionLayer = this.collisionListener.collisionLayer;
        for (let i = x1; i < x2; ++i) {
            for (let j = y1; j < y2; ++j) {
                let tile = this.map.getTile(i, j, collisionLayer);
                if (this.collisionListener.hasCollision(entity, tile)) {
                    return {
                        tile: tile,
                        x: i,
                        y: j,
                        getTileBounds: function() {
                            return {
                                x1: i * tileSize,
                                y1: j * tileSize,
                                x2: x1 + tileSize,
                                y2: y1 + tileSize
                            }
                        }
                    };
                }
            }
        }
        return null;
    }

    overlapsTile(entity, layer, tile) {
        return this.overlapsTiles(entity, layer, [tile]);
    }

    overlapsTiles(entity, layer, tiles) {
        let x1 = Math.max(0, Math.floor((entity.position.x - entity.hw) / this.map.tileSize));
        let y1 = Math.max(0, Math.floor((entity.position.y - entity.hh) / this.map.tileSize));

        let x2 = Math.min(this.map.width, Math.ceil((entity.position.x + entity.hw) / this.map.tileSize));
        let y2 = Math.min(this.map.height, Math.ceil((entity.position.y + entity.hh) / this.map.tileSize));

        for (let i = x1; i < x2; ++i) {
            for (let j = y1; j < y2; ++j) {
                let tile = this.map.getTile(i, j, layer);
                for (let index = 0; index < tiles.length; ++index) {
                    if (tile == tiles[index]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    debug(ctx) {
        ctx.lineWidth = "2";
        ctx.strokeStyle = "#FF0000";
        for (let i = 0; i < this.entities.length; ++i) {
            let entity = this.entities[i];
            ctx.beginPath();
            ctx.rect(entity.position.x - entity.hw,
                entity.position.y - entity.hh,
                entity.hw * 2.0,
                entity.hh * 2.0);
            ctx.stroke();
        }
    }

    setMap(map, collisionListener) {
        this.map = map;
        this.collisionListener = collisionListener;
    }

    add(e) {
        e.world = this;
        this.entities.push(e);
        return this;
    }

    remove(e) {
        let index = this.entities.indexOf(e);
        if (index > -1) {
            this.entities.splice(index, 1);
            e.removed = true;
            if (e.inventory) {
                for (let i = 0; i < e.inventory.length; ++i) {
                    e.inventory[i].position.set(e.position);
                    e.inventory[i].force.set(e.force);
                    this.add(e.inventory[i]);
                }
            }
            return true;
        }
        return false;
    }

    removeText(e) {
        let index = this.texts.indexOf(e);
        if (index > -1) {
            this.texts.splice(index, 1);
            return true;
        }
        return false;
    }

    addText(e) {
        e.world = this;
        this.texts.push(e);
    }

    renderTexts(camera) {
        for (let i = 0; i < this.texts.length; ++i) {
            this.texts[i].render(camera);
        }
    }

    updateTexts(dt) {
        for (let i = 0; i < this.texts.length; ++i) {
            this.texts[i].update(dt);
        }
    }

}
