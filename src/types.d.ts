/// <reference types="@webgpu/types" />
declare const __DIRNAME__;

declare module '*.wgsl?raw' {
  const shader: string;
  export default shader;
}
