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
var includeJs = function(src) {
    let script = document.createElement("script");
    script.src = src;
    script.type = "text/javascript";
    script.async = false;
    document.head.appendChild(script);
}

includeJs("./resources/js/sound.js");
includeJs("./resources/js/vec2.js");
includeJs("./resources/js/camera.js");
includeJs("./resources/js/map.js");
includeJs("./resources/js/world.js");
includeJs("./resources/js/background.js");
includeJs("./resources/js/game.js");
includeJs("./resources/js/entity.js");
includeJs("./resources/js/animation.js");
includeJs("./resources/js/particle.js");
includeJs("./resources/js/text.js");
includeJs("./resources/js/utils.js");
includeJs("./resources/js/timer.js");
includeJs("./resources/js/joypad.js");

includeJs("./resources/js/game/player.js");
includeJs("./resources/js/game/enemies.js");
includeJs("./resources/js/game/platforms.js");
includeJs("./resources/js/game/stairs.js");
includeJs("./resources/js/game/limit.js");
includeJs("./resources/js/game/events.js");
includeJs("./resources/js/game/door.js");
includeJs("./resources/js/game/items.js");
