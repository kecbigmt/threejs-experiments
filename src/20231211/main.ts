import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { createCircleMesh } from './shapes/circle';
import { createEllipseCurveLine } from './shapes/ellipseCurve';
import { CircleRing } from './CircleRing';
import vertex from './shaders/vertex.glsl?raw';
import fragment from './shaders/fragment.glsl?raw';

const clock = new THREE.Clock();
const scene = new THREE.Scene();

const ellipseCurve = createEllipseCurveLine({
  center: [0, 0],
  radius: [15, 15],
  color: [1, 1, 1],
  segments: 100,
});
scene.add(ellipseCurve);

const circleRing = new CircleRing(scene, 15);


const geometry = new THREE.CircleGeometry( 10, 128 );

const material = new THREE.ShaderMaterial({
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
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Camera
const cameraParam = {
  left: -15,
  right: 15,
  top: 15,
  bottom: -15,
  near: 0.1,
  far: 100,
};
const camera = new THREE.OrthographicCamera(
  cameraParam.left,
  cameraParam.right,
  cameraParam.top,
  cameraParam.bottom,
  cameraParam.near,
  cameraParam.far,
);
camera.position.set(0, 0, 20);
camera.lookAt(scene.position);

// Canvas
const canvas = document.querySelector<HTMLCanvasElement>('#myCanvas');
if (!canvas) throw new Error('failed to get canvas element');

// Controls
const controls = new OrbitControls(camera, canvas);

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setClearColor('#000', 1);
renderer.setSize(window.innerWidth, window.innerHeight);

const tick = () => {
  mesh.rotation.z = clock.getElapsedTime() * Math.PI;
  circleRing.update();
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
