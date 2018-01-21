import { Texture } from "./texture";
import { ShaderProgram, UniformType } from "./shader-program";
import { Vector4 } from "../math/vector4";
import { BlendingMode, FuncComparison, CullMode } from "./webgl-types";
import { renderer } from "./webgl";

export class TextureMaterialInfo {
  constructor (
    public texture: Texture,
    public uniformName: string,
    public shaderInternalIndex: number
  ) {}
}

export class Material {
    textures: TextureMaterialInfo[] = [];
    color: Vector4 = new Vector4(1, 1, 1, 1);
  	blend: BlendingMode = BlendingMode.Alpha;
  	depthWrite: boolean = true;
    depthTest: boolean = true;
    depthTestFunc: FuncComparison = FuncComparison.Less;
  	cull: CullMode = CullMode.Back;

    constructor (public shader: ShaderProgram) { }

    public free(): void { }

    public addTexture(texture: Texture, uniformName: string): void {
      const shaderIndex = <number>this.shader.addUniform(UniformType.Sampler, 1, uniformName, this.textures.length);

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

      this.shader.bind();
    }

    public unbind(): void {
      ShaderProgram.unbind();
    }
}
