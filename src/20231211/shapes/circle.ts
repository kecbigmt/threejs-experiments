import { CircleGeometry, MeshBasicMaterial, Mesh, Color } from 'three';
import { RGB, XYZ } from '../primitives';

export type CreateCircleMeshParams = {
  color: RGB,
  radius: number, 
  segments: number,
  position: XYZ,
};

export const createCircleMesh = ({
  color: [r, g, b],
  radius,
  segments,
  position: [x, y, z],
}: CreateCircleMeshParams): Mesh => {
  const geometry = new CircleGeometry( radius, segments );
  const material = new MeshBasicMaterial( { color: new Color(r, g, b) } );
  const circle = new Mesh( geometry, material );
  circle.position.set(x, y, z);
  return circle;
};
