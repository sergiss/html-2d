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
function Entity() {

    this.hw = 0;
    this.hh = 0;

    this.velocity = new Vec2();
    this.linearVelocity = new Vec2();
    this.force = new Vec2();
    this.position = new Vec2();

    this.static = false;

    this.restitution = 0;
    this.invMass = 1.0;

    this.collisionGroup = 0;
    this.collisionMask = 0;

    this.render = function(camera) {}

    this.update = function(dt) {}

    this.isVisible = function(camera) {
        let viewport = camera.viewport;
        return viewport.x1 < this.position.x + this.hw &&
            viewport.y1 < this.position.y + this.hh &&
            viewport.x2 > this.position.x - this.hw &&
            viewport.y2 > this.position.y - this.hh;
    }

    this.hit = function(e, hitInfo) {
        let nx = e.getPositionX() - this.getPositionX();
        let xOverlap = (this.hw + e.hw) - Math.abs(nx);
        if (xOverlap >= 0.0) {
            let ny = e.getPositionY() - this.getPositionY();
            let yOverlap = (this.hh + e.hh) - Math.abs(ny);
            if (yOverlap >= 0.0) {
                if (hitInfo) {
                    if (yOverlap > xOverlap) {
                        hitInfo.normal.x = nx > 0 ? 1 : -1;
                        hitInfo.normal.y = 0;
                        hitInfo.penetration = xOverlap;
                    } else {
                        hitInfo.normal.y = ny > 0 ? 1 : -1;
                        hitInfo.normal.x = 0;
                        hitInfo.penetration = yOverlap;
                    }
                }
                return true;
            }
        }
        return false;
    }

    this.contains = function(e) {
        return this.getMinX() < e.getMinX() &&
            this.getMinY() < e.getMinY() &&
            this.getMaxX() > e.getMaxX() &&
            this.getMaxY() > e.getMaxY();
    }

    this.getPositionX = function() {
        return this.position.x;
    }

    this.getPositionY = function() {
        return this.position.y;
    }

    this.getMinX = function() {
        return this.position.x - this.hw;
    }

    this.getMaxX = function() {
        return this.position.x + this.hw;
    }

    this.getMinY = function() {
        return this.position.y - this.hh;
    }

    this.getMaxY = function() {
        return this.position.y + this.hh;
    }

    this.setMass = function(mass) {
        if (mass <= 0) {
            this.invMass = 0;
            this.static = true;
        } else {
            this.invMass = 1.0 / mass;
        }
    }

    this.onCollision = function(pair) {

    }

    this.explosion = function(particles, position, force, color) {
        explosionSound.stop();
        explosionSound.play();

        for (let i = 0; i < particles; ++i) {
            let particle = new Particle(color == undefined ? rndHexColor() : color);
            // particle.collisionGroup = 2;
            // particle.collisionMask = 2;
            particle.position.set(position);
            particle.force.x = -force.x + (Math.random() - Math.random()) * 200;
            particle.force.y = force.y + (Math.random() - Math.random()) * 200;
            // particle.velocity.rotate(Math.random() * Math.PI * 0.5 + Math.PI * 0.25);
            particle.restitution = Math.random();
            this.world.add(particle);
        }
    }

    this.createText = function(text, position) {
        let t = new ScoreText();
        // t.color = "#FF2222";
        t.position.set(position);
        t.text = text;
        this.world.addText(t);
    }

    this.onWorldCollision = function(collisionInfo) {
        return false;
    }

}

function Mob() {
    Entity.call(this);
    this.inventory = [];
}