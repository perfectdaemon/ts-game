import { Vector4 } from '../math/vector4';
import { ShaderProgram, UniformType } from './shader-program';
import { Texture } from './texture';
import { renderer } from './webgl';
import { BlendingMode, CullMode, FuncComparison } from './webgl-types';

export class TextureMaterialInfo {
  constructor(
    public texture: Texture,
    public uniformName: string,
    public shaderInternalIndex: number,
  ) { }
}

export class Material {
  public shader: ShaderProgram;
  public textures: TextureMaterialInfo[] = [];
  public color: Vector4 = new Vector4(1, 1, 1, 1);
  public blend: BlendingMode = BlendingMode.Alpha;
  public depthWrite: boolean = true;
  public depthTest: boolean = true;
  public depthTestFunc: FuncComparison = FuncComparison.Less;
  public cull: CullMode = CullMode.Back;

  public free(): void {
    // nothing
  }

  public addTexture(texture: Texture, uniformName: string): void {
    if (!this.shader) {
      console.error(`Material.addTexture() failed - no shader at material`);
      return;
    }
    const textureIndex = this.textures.length;
    const shaderIndex = this.shader.addUniform(UniformType.Sampler, 1, uniformName, () => [textureIndex]) as number;

    if (shaderIndex === null) {
      console.error(`Material.addTexture() failed - can't determine shader index for '${uniformName}'`);
      return;
    }

    this.textures.push(new TextureMaterialInfo(texture, uniformName, shaderIndex));
  }

  public bind(): void {
    renderer.setBlendingMode(this.blend);
    renderer.setCullMode(this.cull);
    renderer.setDepthWrite(this.depthWrite);
    renderer.setDepthTest(this.depthTest);
    renderer.setDepthFunc(this.depthTestFunc);

    renderer.renderParams.color = this.color;
    this.textures.forEach((tex, i) => {
      tex.texture.bind(i);
    });

    if (this.shader) {
      this.shader.bind();
    }
  }

  public unbind(): void {
    ShaderProgram.unbind();
  }
}
