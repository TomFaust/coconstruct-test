// three.js
import * as THREE from "three";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// physics
import { AmmoPhysics, PhysicsLoader } from "@enable3d/ammo-physics";

let controls;
const objects = [];

const MainScene = () => {
  // sizes
  const width = window.innerWidth;
  const height = window.innerHeight;

  // scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x202020);

  // camera
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
  camera.position.set(10, 10, 20);
  camera.lookAt(0, 0, 0);

  // 2d camera/2d scene
  const scene2d = new THREE.Scene();
  const camera2d = new THREE.OrthographicCamera(0, width, height, 0, 1, 1000);
  camera2d.position.setZ(10);

  // renderer
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height);
  renderer.autoClear = false;
  document.body.appendChild(renderer.domElement);

  // dpr
  const DPR = window.devicePixelRatio;
  renderer.setPixelRatio(Math.min(2, DPR));

  // orbit controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.dampingFactor = 0.3;
  controls.minDistance = 10;
  controls.maxDistance = 500;

  //drag controls
  document.addEventListener("click", onClick);

  function onClick(event) {
    event.preventDefault();
    const dragCont = new DragControls(
      [...objects],
      camera,
      renderer.domElement
    );
    dragCont.addEventListener("dragstart", dragger);
    dragCont.addEventListener("dragend", draggerEnd);

    function dragger(e) {
      animate();
      physics.destroy(e.object);
      controls.enabled = false;
    }

    function draggerEnd(e) {
      animate();
      physics.add.existing(e.object);
      controls.enabled = true;
    }
  }

  // light
  scene.add(new THREE.HemisphereLight(0xffffbb, 0x080820, 1));
  scene.add(new THREE.AmbientLight(0x666666));
  const light = new THREE.DirectionalLight(0xdfebff, 1);
  light.position.set(50, 200, 100);
  light.position.multiplyScalar(1.3);

  // physics
  const physics = new AmmoPhysics(scene);

  // static ground
  physics.add.ground({ width: 20, height: 20 });

  // cubes
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  for (let i = 0; i < 10; i++) {
    const object = new THREE.Mesh(
      geometry,
      new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff })
    );

    object.position.x = 3;
    object.position.y = i;

    object.rotation.x = Math.random() * 2 * Math.PI;
    object.rotation.y = Math.random() * 2 * Math.PI;
    object.scale.x = Math.random() * 2 + 1;
    object.scale.y = Math.random() * 2 + 1;
    object.castShadow = true;
    object.receiveShadow = true;
    scene.add(object);

    objects.push(object);
    physics.add.existing(object);
  }

  // clock
  const clock = new THREE.Clock();

  // loop
  const animate = () => {
    physics.update(clock.getDelta() * 1000);
    physics.updateDebugger();

    // you have to clear and call render twice because there are 2 scenes
    // one 3d scene and one 2d scene
    renderer.clear();
    renderer.render(scene, camera);
    renderer.clearDepth();
    renderer.render(scene2d, camera2d);

    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
};

// '/ammo' is the folder where all ammo file are
export function initBuild() {
  console.log("check");
  PhysicsLoader("/ammo", () => MainScene());
}
