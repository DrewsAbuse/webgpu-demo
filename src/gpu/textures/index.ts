import type {GPUWithContext} from '../types/gpu.ts';

type CreateTexture = (
  gpu: GPUWithContext,
  label: string,
  usage: GPUTextureDescriptor['usage'],
  format: GPUTextureDescriptor['format'],
  mipLevelCount?: GPUTextureDescriptor['mipLevelCount'],
  sampleCount?: GPUTextureDescriptor['sampleCount'],
  dimension?: GPUTextureDescriptor['dimension']
) => GPUTexture;

export const createCanvasTexture: CreateTexture = (
  gpu,
  label,
  usage,
  format,
  mipLevelCount,
  sampleCount,
  dimension
) =>
  gpu.device.createTexture({
    label,
    usage,
    format,
    mipLevelCount,
    sampleCount,
    dimension,
    size: {
      width: gpu.canvas.width,
      height: gpu.canvas.height,
    },
  });

type CreateDepthTexture = (
  gpu: GPUWithContext,
  label: string,
  mipLevelCount?: GPUTextureDescriptor['mipLevelCount'],
  sampleCount?: GPUTextureDescriptor['sampleCount'],
  dimension?: GPUTextureDescriptor['dimension']
) => GPUTexture;

export const createDepthTexture: CreateDepthTexture = (
  gpu,
  label,
  mipLevelCount,
  sampleCount,
  dimension
) =>
  gpu.device.createTexture({
    label,
    mipLevelCount,
    sampleCount,
    dimension,
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
    format: 'depth24plus',
    size: {
      width: gpu.canvas.width,
      height: gpu.canvas.height,
    },
  });
