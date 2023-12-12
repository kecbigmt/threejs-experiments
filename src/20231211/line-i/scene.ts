import GUI from 'lil-gui';
import { AmbientLight, DirectionalLight, HemisphereLight, IcosahedronGeometry, Material, Mesh, PointLight, Scene, TorusKnotGeometry } from 'three';

const initLights = (scene: Scene) => {
  const light = new DirectionalLight(0xffffff, 0.5);
  light.position.set(0, 1, 3);
  light.castShadow = true;
  light.shadow.bias = -0.0001;
  light.shadow.mapSize.set(4096, 4096);
  scene.add(light);

  const light2 = new DirectionalLight(0xffffff, 0.5);
  light2.position.set(-3, -3, -3);
  light2.castShadow = true;
  light2.shadow.bias = -0.0001;
  light2.shadow.mapSize.set(4096, 4096);
  scene.add(light2);

  const hemiLight = new HemisphereLight(0xbbbbbb, 0x080808, 1);
  scene.add(hemiLight);

  const ambientLight = new AmbientLight(0x202020);
  scene.add(ambientLight);

  const spotLight = new PointLight(0xa183ff, 1);
  spotLight.castShadow = true;
  spotLight.distance = 8;
  spotLight.decay = 2;
  spotLight.power = 40;
  scene.add(spotLight);
};

const createSceneObjects = (material: Material) => {
  const torusObj = new Mesh(new TorusKnotGeometry(
    2, 0.5,
    400, 50,
    3, 2,
  ), material);
  torusObj.castShadow = true;
  torusObj.receiveShadow = true;

  return {
    backdrop: {
      obj: new Mesh(new IcosahedronGeometry(20, 4), material),
      init: false,
    },
    torus: {
      obj: torusObj,
      init: false,
    },
  };
}

export const initScene = (scene: Scene, material: Material, gui: GUI) => {
  initLights(scene);

  const sceneObjects = createSceneObjects(material);
  Object.values(sceneObjects).forEach(({ obj }) => scene.add(obj));

  const guiScene = gui.addFolder('scene');
  guiScene.add(sceneObjects.backdrop.obj, 'visible').name('backdrop');
  guiScene.add(sceneObjects.torus.obj, 'visible').name('torus');
};
