import { TextureFormat, TextureWrap, TextureFilter } from "./webgl-types";
import { gl, renderer } from "./webgl";
import { isPowerOf2 } from "../math/math-base";

export class Texture {
  public texture: WebGLTexture;

  constructor(file: string,
    public width: number,
    public height: number,
    public format: TextureFormat) {

    this.texture = <WebGLTexture>gl.createTexture();
    if (this.texture === null) {
      console.log('Texture create failed - null returned');
      return;
    }

    const [iFormat, cFormat, dType] = this.getWebGLFormats((format));

    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    const pixel = new Uint8Array([0, 0, 255, 255]);
    gl.texImage2D(gl.TEXTURE_2D, 0, iFormat,
      width, height, 0, cFormat, dType, pixel);

    // load
    const image = new Image();
    image.onload = event => {
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, iFormat,
        cFormat, dType, image);

      if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }

      this.trySetAnisotropic(16);
      gl.bindTexture(gl.TEXTURE_2D, null);
    };
    image.src = file;
  }

  public free(): void {
    gl.deleteTexture(this.texture);
  }

  public setWrap(wrapS: TextureWrap, wrapT: TextureWrap): void {
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.getWebGLWrap(wrapS));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.getWebGLWrap(wrapT));
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  public setFilter(filter: TextureFilter): void {
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, this.getWebGLFilter(filter));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, this.getWebGLFilter(filter));
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  public bind(sampler: number = 0): void {
    renderer.setTexture(this, sampler);
  }

  public static unbind(): void {
    renderer.setTexture(null, 0)
  }

  private getWebGLWrap(wrap: TextureWrap): number {
    switch (wrap) {
      case TextureWrap.Repeat: return gl.REPEAT;
      case TextureWrap.MirrorRepeat: return gl.MIRRORED_REPEAT;
      default:
      case TextureWrap.ClampToEdge: return gl.CLAMP_TO_EDGE;
    }
  }

  private getWebGLFilter(filter: TextureFilter): number {
    switch (filter) {
      case TextureFilter.Linear: return gl.LINEAR;
      default:
      case TextureFilter.Nearest: return gl.NEAREST;
    }
  }

  private getWebGLFormats(format: TextureFormat): [number, number, number] {
    return [gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE];
  }

  private trySetAnisotropic(desiredAnisotropyLevel: number): void {
    var anisotropicExt = (
      gl.getExtension('EXT_texture_filter_anisotropic') ||
      gl.getExtension('MOZ_EXT_texture_filter_anisotropic') ||
      gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
    );

    if (!anisotropicExt) { return; }

    var maxAnisotropyLevel = gl.getParameter(anisotropicExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
    var anisotropyLevel = Math.min(desiredAnisotropyLevel, maxAnisotropyLevel);
    gl.texParameterf(gl.TEXTURE_2D, anisotropicExt.TEXTURE_MAX_ANISOTROPY_EXT, anisotropyLevel);
  }
}
