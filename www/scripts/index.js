/**
 * Uncomment the scene you want to run. (default three.js)
 */

// start three.js scene (with enable3d physics)

// start standalone enable3d scene
// import './standalone'

import "../style.css";
import { initBuild } from "./build.js";
import { initArchitect } from "./architect.js";
let buildButton;
let architectButton;
buildButton = document.getElementById("build");
architectButton = document.getElementById("architect");
buildButton.onclick = function buildStart() {
  buildButton.remove();
  architectButton.remove();
  initBuild();
};
architectButton.onclick = function architectStart() {
  buildButton.remove();
  architectButton.remove();
  initArchitect();
};
