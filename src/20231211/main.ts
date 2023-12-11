import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import vertex from './shaders/vertex.glsl?raw';
import fragment from './shaders/fragment.glsl?raw';

const clock = new THREE.Clock();
const scene = new THREE.Scene();

const geometry = new THREE.SphereGeometry(1, 32, 16);
/*
const material = new THREE.MeshBasicMaterial({
  color: 'red',
  wireframe: true,
});
*/
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

// Sizes
const sizes = {
  width: 800,
  height: 800,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(0, 0, -4);
camera.lookAt(new THREE.Vector3());

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
  mesh.rotation.x = clock.getElapsedTime() * Math.PI;
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
