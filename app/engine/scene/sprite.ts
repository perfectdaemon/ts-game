import { Node } from "./node";
import { Vector2 } from "../math/vector2";
import { TextureRegion } from "../render/texture-atlas";

export class Sprite extends Node {
  protected _rotation: number;
  protected _width: number;
  protected _height: number;
  protected _pivotPoint: Vector2;
  protected _textureRegion: TextureRegion;
  public vertices: number[];

  constructor(width: number | null, height: number | null, pivotPoint: Vector2 | null) {
    super();
  }

  free(): void {
    super.free();
  }
  /*
      property Rotation: Single read fRot write SetRot;
      property Width: Single read fWidth write SetWidth;
      property Height: Single read fHeight write SetHeight;
      property PivotPoint: TglrVec2f read fPP write SetPP;

      procedure SetDefaultVertices(); virtual;//Sets vertices due to width, height, pivot point and rotation
      procedure SetDefaultTexCoords(); //Sets default texture coords
      procedure SetFlippedTexCoords();
      procedure SetVerticesColor(aColor: TglrVec4f); virtual;
      procedure SetVerticesAlpha(aAlpha: Single); virtual;
      procedure SetSize(aWidth, aHeight: Single); overload;
      procedure SetSize(aSize: TglrVec2f); overload;

      procedure SetTextureRegion(aRegion: PglrTextureRegion; aAdjustSpriteSize: Boolean = True); virtual;
      function GetTextureRegion(): PglrTextureRegion;
      procedure RenderSelf(); override;*/
  end;
}
