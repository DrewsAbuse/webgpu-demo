import type {StructuredView} from 'webgpu-utils';

export type NotInitializedGPU = {
  adapter: GPUAdapter | null | undefined;
  device: GPUDevice | null | undefined;
};

export type GPU = {
  adapter: GPUAdapter;
  device: GPUDevice;
};

export type GPUWithContext = GPU & {
  context: GPUCanvasContext;
  canvas: HTMLCanvasElement;
  preferredCanvasFormat: GPUTextureFormat;
};

export type RenderPathDescriptionWithView = GPURenderPassDescriptor & {
  colorAttachments: GPURenderPassColorAttachment[];
};

export type Buffers = {buffers: GPUBuffer[]};

export type BasicPipeline = {
  bindGroup: GPUBindGroup;
  pipeline: GPURenderPipeline;
};

export type FragmentUniformView = {
  fsUniformBuffer: GPUBuffer;
  fsUniformValues: StructuredView;
};

export type VertexUniformView = {
  vsUniformBuffer: GPUBuffer;
  vsUniformValues: StructuredView;
};

export type NumElements = {
  numElements: number;
};

export type IndexedBuffer = NumElements & {
  indexBuffer: GPUBuffer;
  indexFormat: GPUIndexFormat;
};
