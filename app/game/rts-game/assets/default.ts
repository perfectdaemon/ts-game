import { MaterialData } from '../../../engine/loaders/material.data';
import { ShaderProgramData } from '../../../engine/loaders/shader-program.data';
import { Vector4 } from '../../../engine/math/vector4';
import { BlendingMode, CullMode, FuncComparison, TextureFilter } from '../../../engine/render/webgl-types';
import { FontData } from '../../../engine/loaders/font.data';

export const DEFAULT_MATERIAL: MaterialData = {
  textures: [
    { uniformName: 'uDiffuse' },
  ],

  color: new Vector4(1, 1, 1, 1),

  blend: BlendingMode.Alpha,

  depthWrite: true,
  depthTest: true,
  depthTestFunc: FuncComparison.Less,

  cull: CullMode.Back,
};

export const DEFAULT_SHADER: ShaderProgramData = {
  vertexShaderText: `
  attribute vec3 vaCoord;
  attribute vec2 vaTexCoord0;
  attribute vec4 vaColor;
  varying vec2 texCoord0;
  varying vec4 vColor;
  uniform mat4 uModelViewProj;

  void main(void)
  {
    texCoord0 = vaTexCoord0;
    vColor = vaColor;
    gl_Position = uModelViewProj * vec4(vaCoord, 1.0);
  }
  `,

  fragmentShaderText: `
  varying highp vec2 texCoord0;
  varying highp vec4 vColor;
  uniform sampler2D uDiffuse;
  uniform highp vec4 uColor;

  void main(void)
  {
    gl_FragColor = uColor * vColor * texture2D( uDiffuse, texCoord0 );
    if (gl_FragColor.a < 0.001)
      discard;
  }
  `,
};

export const DEFAULT_FONT: FontData = {
  fontFileSrc: 'assets/font.json',
  materialData: {
    textures: [
      {
        uniformName: 'uDiffuse',
        textureData: {
          anisotropic: 0,
          filter: TextureFilter.Linear,
          imageFileSrc: 'assets/font.png',
        },
      },
    ],

    color: new Vector4(1, 1, 1, 1),

    blend: BlendingMode.Alpha,

    depthWrite: true,
    depthTest: true,
    depthTestFunc: FuncComparison.Less,

    cull: CullMode.Back,
  },
};
