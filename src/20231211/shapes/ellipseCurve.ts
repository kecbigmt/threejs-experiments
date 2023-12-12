import { EllipseCurve, BufferGeometry, LineBasicMaterial, Line, Color } from 'three';
import { XY, Vec2, RGB } from '../primitives';

type CreateEllipseCurveLineParams = {
  color: RGB,
  segments: number,
  center: XY,
  radius: Vec2,
  startAngle?: number,
  endAngle?: number,
  clockwise?: boolean,
  rotation?: number,
};

export const createEllipseCurveLine = ({
  center,
  radius,
  startAngle = 0,
  endAngle = Math.PI * 2,
  clockwise = false,
  rotation = 0,
  color,
  segments,
}: CreateEllipseCurveLineParams): Line => {
  const [x, y] = center;
  const [xRadius, yRadius] = radius;
  const curve = new EllipseCurve(
    x, y,
    xRadius, yRadius,
    startAngle, endAngle,
    clockwise,
    rotation,
  );
  const points = curve.getPoints(segments);
  const geometry = new BufferGeometry().setFromPoints(points);
  const material = new LineBasicMaterial({ color: new Color(color[0], color[1], color[2]) });
  const ellipse = new Line(geometry, material);
  return ellipse;
};
