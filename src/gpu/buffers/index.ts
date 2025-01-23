import type {TypedArrayView} from '../types/arrays.ts';

/**
 * @see {@link https://www.w3.org/TR/webgpu/#buffers}
 */
export const createBufferWithData = (
  device: GPUDevice,
  data: TypedArrayView,
  usage: GPUBufferUsageFlags
): GPUBuffer => {
  const buffer = device.createBuffer({
    size: data.byteLength,
    usage,
  });
  device.queue.writeBuffer(buffer, 0, data, 0, data.byteLength);

  return buffer;
};

export const createBufferWithDataFrom = (
  device: GPUDevice,
  data: TypedArrayView,
  usage: GPUBufferUsageFlags,
  bufferWriteInOffset: number,
  dataWriteFromOffset: number,
  writeLength: number
) => {
  const buffer = device.createBuffer({
    size: data.byteLength,
    usage,
  });
  device.queue.writeBuffer(buffer, bufferWriteInOffset, data, dataWriteFromOffset, writeLength);

  return buffer;
};
