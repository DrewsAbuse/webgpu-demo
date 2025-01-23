import type {BufferVertexesWithIndices} from '../types/buffers.ts';
import {createBufferWithData} from './index.ts';

/**
 * @see Vertex Buffer
 *  {@link https://www.w3.org/TR/webgpu/#dictdef-gpuvertexstate}
 * @see Index Buffer
 *  {@link https://www.w3.org/TR/webgpu/#vertex-state}
 *  {@link https://www.w3.org/TR/webgpu/#dom-gpuprimitivestate-stripindexformat}
 */
export const createVertexAndIndexBuffer = (
  device: GPUDevice,
  {vertices, indices}: {vertices: Float32Array; indices: Uint32Array}
): BufferVertexesWithIndices => {
  return {
    vertexBuffer: createBufferWithData(
      device,
      vertices,
      GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    ),
    indexBuffer: createBufferWithData(
      device,
      indices,
      GPUBufferUsage.INDEX | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    ),
    indexFormat: 'uint32',
    vertexCount: indices.length,
  };
};
