import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import GUI from 'lil-gui';

import { createEllipseCurveLine } from './shapes/ellipseCurve';
import { CircleRing } from './CircleRing';
import vertex from './shaders/vertex.glsl?raw';
import fragment from './shaders/fragment.glsl?raw';

import { initScene } from './line-i/scene';
import { ScreenSpaceSketchMaterial } from './line-i/screenSpaceSketchMaterial';
import { generateParams as generatePaperParams } from "./line-i/paper";

const clock = new THREE.Clock();
const scene = new THREE.Scene();

const gui = new GUI();
const materialFolder = gui.addFolder('Material');

const ellipseCurve = createEllipseCurveLine({
  center: [0, 0],
  radius: [15, 15],
  color: [1, 1, 1],
  segments: 100,
});
scene.add(ellipseCurve);
gui.add(ellipseCurve, 'visible').name('ellipseCurve');

const circleRing = new CircleRing(scene, 15);


const geometry = new THREE.CircleGeometry( 10, 128 );

const material1 = new THREE.ShaderMaterial({
  extensions: {
    derivatives: true,
  },
  side: THREE.DoubleSide,
  uniforms: {
    time: { value: 0 },
    resolution: { value: new THREE.Vector4() },
  },
  vertexShader: vertex,
  fragmentShader: fragment,
});
const mesh = new THREE.Mesh(geometry, material1);
mesh.position.set(0, 0, -2);
scene.add(mesh);

// Camera
const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
camera.position.set(0, 0, 19);

const material = new ScreenSpaceSketchMaterial({
  color: 0x808080,
  roughness: 0.4,
  metalness: 0.1,
  side: THREE.DoubleSide,
});

initScene(scene, material, gui);

const paperController = generatePaperParams(materialFolder, material);
paperController.setValue("Watercolor cold press");

// Canvas
const canvas = document.querySelector<HTMLCanvasElement>('#myCanvas');
if (!canvas) throw new Error('failed to get canvas element');

// Controls
const controls = new OrbitControls(camera, canvas);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xffffff, 1);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const render = () => {
  mesh.rotation.z = clock.getElapsedTime() * Math.PI;
  circleRing.update();
  controls.update();
  renderer.render(scene, camera);
  renderer.setAnimationLoop(render);
}

render();
