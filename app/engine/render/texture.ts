import { isPowerOf2 } from '../math/math-base';
import { gl, renderer } from './webgl';
import { TextureFilter, TextureWrap } from './webgl-types';

export class Texture {
  public texture: WebGLTexture;
  public width: number = 1;
  public height: number = 1;

  constructor(file: string) {

    this.texture = gl.createTexture() as WebGLTexture;
    if (this.texture === null) {
      console.log('Texture create failed - null returned');
      return;
    }
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    const pixel = new Uint8Array([0, 0, 255, 255]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,
      1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);

    // load
    const image = new Image();
    image.onload = event => {
      this.onImageLoad(image, event);
      console.log(`Texture '${file}' loaded, width: ${this.width}, height: ${this.height}`);
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

  protected onImageLoad(image: HTMLImageElement, event: any): void {
    this.width = image.width;
    this.height = image.height;

    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    }

    this.trySetAnisotropic(16);
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

  private trySetAnisotropic(desiredAnisotropyLevel: number): void {
    const anisotropicExt = (
      gl.getExtension('EXT_texture_filter_anisotropic') ||
      gl.getExtension('MOZ_EXT_texture_filter_anisotropic') ||
      gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
    );

    if (!anisotropicExt) { return; }

    const maxAnisotropyLevel = gl.getParameter(anisotropicExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
    const anisotropyLevel = Math.min(desiredAnisotropyLevel, maxAnisotropyLevel);
    gl.texParameterf(gl.TEXTURE_2D, anisotropicExt.TEXTURE_MAX_ANISOTROPY_EXT, anisotropyLevel);
  }
}
