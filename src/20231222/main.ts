import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Noise } from 'noisejs';
import GUI from 'lil-gui';

const noise = new Noise();

const scene = new THREE.Scene();

const geometry = new THREE.SphereGeometry(3, 128, 128);
const material = new THREE.MeshNormalMaterial();
const sphere = new THREE.Mesh(geometry, material);

scene.add(sphere);

// Camera
const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
camera.position.set(0, 0, 5);

// Canvas
const canvas = document.querySelector<HTMLCanvasElement>('#myCanvas');
if (!canvas) throw new Error('failed to get canvas element');

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 1);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Controls
const controls = new OrbitControls(camera, canvas);

// 球体の半径
const r = 3;
// ノイズの倍率
const k = 2;

const render = () => {
  const time = performance.now() * 0.001;

  const positionCount = sphere.geometry.attributes.position.count;
  for (let i = 0; i < positionCount; i++) {
    const x = sphere.geometry.attributes.position.getX(i);
    const y = sphere.geometry.attributes.position.getY(i);
    const z = sphere.geometry.attributes.position.getZ(i);
    const p = new THREE.Vector3(x, y, z);
  
    const n = noise.perlin3(x * k + time, y * k + time, z * k + time);
    p.normalize().multiplyScalar(r + 0.3 * n);
  
    sphere.geometry.attributes.position.setXYZ(i, p.x, p.y, p.z);
  }
  sphere.geometry.attributes.position.needsUpdate = true;
  sphere.geometry.computeVertexNormals();

  controls.update();
  renderer.render(scene, camera);
  renderer.setAnimationLoop(render);
};

render();