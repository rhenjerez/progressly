/**
 * main.js - starts the app. Loaded last.
 */

// First paint.
render();
resetWheel();
// If the page stays open past Sunday midnight, switch to the new week automatically.
let cur = wkKey();
setInterval(() => {
  if (wkKey() !== cur) {
    cur = wkKey();
    render();
  }
}, 60000);
