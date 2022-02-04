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
class Game {

  constructor(listener) {
    this.listener = listener;          // game listener
    this.sTime = new Date().getTime(); // start time
    this.eTime = this.sTime;           // end time

    if (listener.onKeyDown !== "undefined") {
      window.addEventListener("keydown", (e) => {
        e.preventDefault();
        listener.onKeyDown(e);
      });
    }

    if (listener.onKeyUp !== "undefined") {
      window.addEventListener("keyup", (e) => {
        e.preventDefault();
        listener.onKeyUp(e);
      });
    }

    this.fps = 60;
    this.tick = this.tick.bind(this);
  }

  tick() {
    if (this.running) {
      requestAnimationFrame(this.tick); 
      const now = Date.now();
      const diff = now - this.startTime;
      if (diff > this.tickTime) {
        this.startTime = now - (diff % this.tickTime);
        this.listener.update(this.tickTime / 1000.0);  
      }   
    }
  }

   start() {
    if(!this.running) {
      this.running = true;
      this.listener.create();    
      this.startTime = Date.now();
      this.tickTime = 1000 / this.fps;
      requestAnimationFrame(this.tick); 
    }   
  }

  stop() {
    this.running = false;
    console.log("Game loop stopped.");
  }

}
