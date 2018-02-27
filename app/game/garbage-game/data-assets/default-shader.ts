import { ShaderProgramData } from '../../../engine/loaders/shader-program.data';

export const DEFAULT_SHADER_DATA: ShaderProgramData = {
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
