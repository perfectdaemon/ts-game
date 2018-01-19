import { TextureFormat, TextureWrap, TextureFilter } from "./webgl-types";

export enum TextureExt { bmp, tga }


export class Texture {
  constructor (data: any,
    public width: number,
    public height: number,
    public format: TextureFormat) {

    }

  public free(): void {

  }

  public setWrapS(wrap: TextureWrap): void {

  }

  public setWrapT(wrap: TextureWrap): void {

  }

  public setWrapR(wrap: TextureWrap): void {

  }

  public setFilter(filter: TextureFilter): void {

  }

  public bind(sampler: number = 0): void {

  }
  public static unbind(): void {

  }
}
