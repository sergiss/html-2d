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
function AABB() {

    this.min = new Vec2();
    this.max = new Vec2();

    this.getArea = function() {
        return this.getWidth() * this.getHeight();
    }

    this.getPerimeter = function() {
        return (this.getWidth() + this.getHeight()) * 2.0;
    }

    this.getWidth = function() {
        return this.max.x - this.min.x;
    }

    this.getHeight = function() {
        return this.max.y - this.min.y;
    }

    this.overlap = function(aabb) {
        return this.min.x < aabb.max.x &&
            this.min.y < aabb.max.y &&
            this.max.x > aabb.min.x &&
            this.max.y > aabb.min.y;
    }

    this.contains = function(aabb) {
        return this.min.x < aabb.min.x &&
            this.min.y < aabb.min.y &&
            this.max.x > aabb.max.x &&
            this.max.y > aabb.max.y;
    }

    this.set = function(aabb) {
        this.min.set(aabb.min);
        this.max.set(aabb.max);
        return this;
    }

    this.combine = function(a, b) {
        this.min.x = a.min.x < b.min.x ? a.min.x : b.min.x;
        this.min.y = a.min.y < b.min.y ? a.min.y : b.min.y;
        this.max.x = a.max.x > b.max.x ? a.max.x : b.max.x;
        this.max.y = a.max.y > b.max.y ? a.max.y : b.max.y;
        return this;
    }

}