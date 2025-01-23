import {mat4} from 'wgpu-matrix';
import * as wgh from 'webgpu-utils';
import type {StructuredView} from 'webgpu-utils';
import type {GPUWithContext, RenderPathDescriptionWithView} from '../gpu/types/gpu.ts';
import {gpuWithContext} from '../gpu/device.ts';
import code from './shader.wgsl?raw';

const randomEllipse = ({
  numSamples,
  radius,
}: {
  numSamples: number;
  radius: number;
}): Float32Array => {
  const vertexData = new Float32Array(numSamples * 3);
  for (let i = 0; i < numSamples; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const r = Math.random() * radius;
    vertexData[i * 3] = r * Math.cos(phi);
    vertexData[i * 3 + 1] = (r / 3) * Math.sin(phi) * Math.cos(theta);
    vertexData[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }

  return vertexData;
};

const initFulfilledPipeline = (
  gpuWithCtx: GPUWithContext,
  vertexData: Float32Array,
  code: string
): {
  pipeline: GPURenderPipeline;
  uniformBuffer: GPUBuffer;
  buffer: GPUBuffer;
  uniformValues: StructuredView;
  matrixValue: Float32Array;
  bindGroup: GPUBindGroup;
  renderPassDescriptor: RenderPathDescriptionWithView;
} => {
  const module = gpuWithCtx.device.createShaderModule({
    code,
  });

  const {
    buffers: [buffer],
    bufferLayouts,
  } = wgh.createBuffersAndAttributesFromArrays(
    gpuWithCtx.device,
    {
      position: vertexData,
    },
    {
      usage: GPUBufferUsage.VERTEX,
    }
  );

  const pipeline = gpuWithCtx.device.createRenderPipeline({
    label: '3d points',
    layout: 'auto',
    vertex: {
      module,
      buffers: bufferLayouts,
    },
    fragment: {
      module,
      targets: [
        {
          format: gpuWithCtx.preferredCanvasFormat,
        },
      ],
    },
    primitive: {
      topology: 'point-list',
    },
  });

  const defs = wgh.makeShaderDataDefinitions(code);
  const uniformValues = wgh.makeStructuredView(defs.uniforms.uni);

  const uniformBuffer = gpuWithCtx.device.createBuffer({
    size: uniformValues.arrayBuffer.byteLength,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  const kMatrixOffset = 0;
  const matrixValue = uniformValues.views.viewProjection.subarray(
    kMatrixOffset,
    kMatrixOffset + 16
  );

  const bindGroup = gpuWithCtx.device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [{binding: 0, resource: {buffer: uniformBuffer}}],
  });

  const renderPassDescriptor: RenderPathDescriptionWithView = {
    colorAttachments: [
      {
        view: gpuWithCtx.context.getCurrentTexture().createView(),
        clearValue: [0.3, 0.3, 0.3, 1],
        loadOp: 'clear',
        storeOp: 'store',
      },
    ],
  };

  return {
    pipeline,
    buffer,
    uniformValues,
    uniformBuffer,
    matrixValue,
    bindGroup,
    renderPassDescriptor,
  };
};

const main = (): void => {
  const gpuWithCtx = gpuWithContext;

  const vertexData = randomEllipse({
    radius: 3,
    numSamples: 900000,
  });
  const kNumPoints = vertexData.length / 3;

  const {
    pipeline,
    uniformBuffer,
    matrixValue,
    bindGroup,
    renderPassDescriptor,
    buffer,
    uniformValues,
  } = initFulfilledPipeline(gpuWithCtx, vertexData, code);

  const render = (time: number): void => {
    time *= 0.001;

    const canvasTexture = gpuWithCtx.context.getCurrentTexture();
    renderPassDescriptor.colorAttachments[0].view = canvasTexture.createView();

    const fov = (110 * Math.PI) / 180;
    const aspect = gpuWithCtx.canvas.clientWidth / gpuWithCtx.canvas.clientHeight;
    const projection = mat4.perspective(fov, aspect, 0.1, 50);

    const radius = 2.0;
    const cameraX = Math.sin(time * 0.1) * radius;
    const cameraZ = Math.cos(time * 0.1) * radius;

    const view = mat4.lookAt(
      [cameraX, 1, cameraZ + 2], // eye
      [0, 0, 0], // target
      [0, 1, 0] // up
    );
    mat4.multiply(projection, view, matrixValue);

    uniformValues.views.time[0] = time;

    // Copy the uniform values to the uniform buffer
    gpuWithCtx.device.queue.writeBuffer(uniformBuffer, 0, uniformValues.arrayBuffer);

    const encoder = gpuWithCtx.device.createCommandEncoder();
    const pass = encoder.beginRenderPass(renderPassDescriptor);
    pass.setPipeline(pipeline);
    pass.setVertexBuffer(0, buffer);
    pass.setBindGroup(0, bindGroup);
    pass.draw(kNumPoints);
    pass.end();

    const commandBuffer = encoder.finish();
    gpuWithCtx.device.queue.submit([commandBuffer]);

    requestAnimationFrame(render);
  };

  requestAnimationFrame(render);

  const observer = new ResizeObserver(entries => {
    for (const entry of entries) {
      const canvas = entry.target as HTMLCanvasElement;
      const width = entry.contentBoxSize[0].inlineSize;
      const height = entry.contentBoxSize[0].blockSize;
      canvas.width = Math.max(1, Math.min(width, gpuWithCtx.device.limits.maxTextureDimension2D));
      canvas.height = Math.max(1, Math.min(height, gpuWithCtx.device.limits.maxTextureDimension2D));
    }
  });
  observer.observe(gpuWithCtx.canvas);
};

main();
