uniform float time;
uniform vec4 resolution;

varying float vNoise;

void main() {
  vec3 rgb = vec3(vNoise);
  gl_FragColor = vec4(rgb, 1.);
}
