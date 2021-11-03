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
  }

  tick() {
    if (this.running) {
      // compute delta time
      let dt = (this.sTime - this.eTime) / 1000.0;
      this.eTime = this.sTime;
      this.sTime = new Date().getTime();
      this.listener.update(Math.min(dt, 0.017)); // update
      requestAnimationFrame(this.tick.bind(this));
    }
  }

   start() {
    if(!this.running) {
      this.running = true;
      this.listener.create();     
      this.tick();
      console.log("Game loop started.");
    }   
  }

  stop() {
    this.running = false;
    console.log("Game loop stopped.");
  }

}
