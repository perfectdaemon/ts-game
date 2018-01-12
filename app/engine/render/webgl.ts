export let gl: WebGLRenderingContext;

export class WebGLRegisterService {
    public static registerWebGLContext(context: WebGLRenderingContext): void {
        gl = context;
    }
}