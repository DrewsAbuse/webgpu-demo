import type {GPUWithContext} from './types/gpu.ts';
import {quitIfWebGPUNotAvailable} from './errors';

const adapter = await navigator.gpu?.requestAdapter();

type ElementId = string;
type ElementIdOrCanvas = ElementId | HTMLCanvasElement;

export const initializeWebGPU = async (params?: ElementIdOrCanvas): Promise<GPUWithContext> => {
  let canvas: HTMLCanvasElement;

  if (!params) {
    canvas = document.querySelector('canvas') as HTMLCanvasElement;
  } else if (typeof params === 'string') {
    canvas = document.querySelector(`#${params}`) as HTMLCanvasElement;
  } else {
    canvas = params;
  }

  const {devicePixelRatio} = window;
  canvas.width = canvas.clientWidth * devicePixelRatio;
  canvas.height = canvas.clientHeight * devicePixelRatio;
  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();

  const gpu = {adapter, device: await adapter?.requestDevice()};

  quitIfWebGPUNotAvailable(gpu);

  const context = canvas.getContext('webgpu') as GPUCanvasContext;
  context.configure({
    device: gpu.device,
    format: presentationFormat,
  });

  return {
    adapter: gpu.adapter,
    device: gpu.device,
    context,
    canvas,
    preferredCanvasFormat: presentationFormat,
  };
};

export const gpuWithContext = await initializeWebGPU();
