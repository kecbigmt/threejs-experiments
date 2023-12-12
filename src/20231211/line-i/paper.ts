import GUI from 'lil-gui';
import { RepeatWrapping, Texture, TextureLoader } from 'three';
import { ScreenSpaceSketchMaterial } from './screenSpaceSketchMaterial';

const loader = new TextureLoader();

export type Asset = {
  file: string;
  texture: Texture | null;
  promise: Promise<void> | null;
};

const papers: { [name: string]: Asset } = {
  'Craft light': { file: 'Craft_Light.jpg', texture: null, promise: null },
  'Craft rough': { file: 'Craft_Rough.jpg', texture: null, promise: null },
  'Watercolor cold press': {
    file: 'Watercolor_ColdPress.jpg',
    texture: null,
    promise: null,
  },
  Parchment: { file: 'Parchment.jpg', texture: null, promise: null },
};

async function getTexture(name: string) {
  if (papers[name].texture) {
    return papers[name].texture;
  }
  if (!papers[name].promise) {
    papers[name].promise = new Promise((resolve, _reject) => {
      loader.load(`../textures/line-i/${papers[name].file}`, (res) => {
        res.wrapS = res.wrapT = RepeatWrapping;
        papers[name].texture = res;
        resolve();
      });
    });
  }
  await papers[name].promise;
  return papers[name].texture;
}

const params = {
  paper: 'Craft light',
};
function generateParams(gui: GUI, material: ScreenSpaceSketchMaterial) {
  return gui.add(params, 'paper', Object.keys(papers)).onChange(async (name: string) => {
    material.setTexture(await getTexture(name));
  });
}
export { generateParams };
