import { MeshStandardMaterial, MeshStandardMaterialParameters, Renderer, Shader, Texture, Vector2 } from 'three';

type Params = {
  roughness: number;
  metalness: number;
  min: number;
  max: number;
  min2: number;
  max2: number;
  scale: number;
  radius: number;
};

type Uniforms = {
  resolution: { value: Vector2 };
  paperTexture: { value: Texture | null };
  range: { value: Vector2 };
  range2: { value: Vector2 };
  scale: { value: number };
  radius: { value: number };
};

export class ScreenSpaceSketchMaterial extends MeshStandardMaterial {
  private params: Params;
  private uniforms: Uniforms;

  constructor(options: MeshStandardMaterialParameters) {
    super(options);

    this.params = {
      roughness: 0.4,
      metalness: 0.1,
      min: 0.25,
      max: 0.75,
      min2: 0.5,
      max2: 0.5,
      scale: 1,
      radius: 1,
    };

    this.uniforms = {
      resolution: { value: new Vector2(1, 1) },
      paperTexture: { value: null },
      range: { value: new Vector2(this.params.min, this.params.max) },
      range2: { value: new Vector2(this.params.min2, this.params.max2) },
      scale: { value: this.params.scale },
      radius: { value: this.params.radius },
    };

    this.onBeforeCompile = (shader: Shader, _renderer: Renderer) => {
      for (const uniformName of Object.keys(this.uniforms)) {
        shader.uniforms[uniformName] = this.uniforms[uniformName as keyof Uniforms];
      }

      shader.fragmentShader = shader.fragmentShader.replace(
        `#include <common>`,
        `#include <common>
        uniform vec2 resolution;
        uniform sampler2D paperTexture;
        uniform vec2 range;
        uniform vec2 range2;
        uniform float scale;
        uniform float radius;
        float luma(vec3 color) {
            return dot(color, vec3(0.299, 0.587, 0.114));
        }
        
        float luma(vec4 color) {
            return dot(color.rgb, vec3(0.299, 0.587, 0.114));
        }
        
        float lines( in float l, in vec2 fragCoord, in vec2 resolution, in vec2 range, in vec2 range2, float scale, float radius){
            vec2 center = vec2(resolution.x/2., resolution.y/2.);
            vec2 uv = fragCoord.xy;
        
            vec2 d = uv - center;
            float r = length(d)/1000.;
            float a = atan(d.y,d.x) + scale*(radius-r)/radius;
            vec2 uvt = center+r*vec2(cos(a),sin(a));
        
            vec2 uv2 = fragCoord.xy / resolution.xy;
            float c = range2.x + range2.y * sin(uvt.x*1000.);
            float f = smoothstep(range.x*c, range.y*c, l );
            f = smoothstep( 0., .5, f );
        
            return f;
        }`,
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        `#include <dithering_fragment>
        float l = luma(gl_FragColor.rgb);
        float darkColor = l;
        float lightColor = 1. - smoothstep(0., .1, l-.5);
        float darkLines = lines(darkColor, gl_FragCoord.xy, resolution, range, range2, scale, radius);
        float lightLines = lines(lightColor, gl_FragCoord.xy, resolution, range, range2, scale, radius);
        ivec2 size = textureSize(paperTexture, 0);
        vec4 paper = texture(paperTexture, gl_FragCoord.xy / vec2(float(size.x), float(size.y)));
        gl_FragColor.rgb = paper.rgb * vec3(.25 + .75 * darkLines) + 1. * (1. - lightLines );`,
      );
    };
  }

  public setTexture(texture: Texture | null) {
    this.uniforms.paperTexture.value = texture;
  }
}
