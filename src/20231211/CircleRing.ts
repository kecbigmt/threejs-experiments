import { Mesh, Scene } from 'three';
import { createCircleMesh } from './shapes/circle';

export class CircleRing {
  private circles: Mesh[] = [];
  private startAngle = 0;
  private radius = 15;

  constructor(scene: Scene, radius: number) {
    this.radius = radius;
    for (let i = 0; i < 20; i += 1) {
      const angle = this.startAngle + (i / 20) * Math.PI * 2;
      const x = this.radius * Math.cos(angle);
      const y = this.radius * Math.sin(angle);

      const circle = createCircleMesh({ radius: 1, position: [x, y, 0], color: [1, 0, 0], segments: 100 });
      this.circles.push(circle);
      scene.add(circle);
    }
  }

  public update() {
    this.startAngle += 0.01;
    for (let i = 0; i < 20; i += 1) {
      const angle = this.startAngle + (i / 20) * Math.PI * 2;
      const x = this.radius * Math.cos(angle);
      const y = this.radius * Math.sin(angle);

      const circle = this.circles[i];
      circle.position.set(x, y, 0);
    }
  }
}
