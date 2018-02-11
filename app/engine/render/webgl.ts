import { WebGLRenderer } from './webgl-renderer';

export let gl: WebGLRenderingContext;
export let renderer: WebGLRenderer;

export class WebGLRegisterService {
  public static registerWebGLContext(context: WebGLRenderingContext): void {
    gl = context;
  }

  public static registerWebGLRenderer(webGLRenderer: WebGLRenderer): void {
    renderer = webGLRenderer;
  }
}
