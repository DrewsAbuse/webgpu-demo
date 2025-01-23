type MakePropertyOptional<T, K extends keyof T> = Omit<T, K> & {[P in K]?: T[P]};
/**
 *  @see {@link https://gpuweb.github.io/gpuweb/#dictdef-gpuvertexbufferlayout | GPUVertexBufferLayout}
 *  @see {@link https://gpuweb.github.io/gpuweb/#dictdef-gpuvertexattribute | GPUVertexAttribute}
 *  @see {@link https://gpuweb.github.io/gpuweb/#vertex-processing | GPUVertexFormat}
 */
type Unorm8x4Bgra = 'unorm8x4-bgra';
type VertexFormatUnit =
  | 'uint8'
  | 'sint8'
  | 'unorm8'
  | 'snorm8'
  | 'uint16'
  | 'sint16'
  | 'unorm16'
  | 'snorm16'
  | 'float16'
  | 'float32'
  | 'uint32'
  | 'sint32';
type CreateLayout = (
  attributes: Omit<MakePropertyOptional<GPUVertexAttribute, 'shaderLocation'>, 'offset'>[],
  stepMode?: GPUVertexStepMode
) => GPUVertexBufferLayout;

export const vertexFormatToSize: Record<GPUVertexFormat | VertexFormatUnit | Unorm8x4Bgra, number> =
  {
    uint8: 1,
    uint8x2: 2,
    uint8x4: 4,
    sint8: 1,
    sint8x2: 2,
    sint8x4: 4,
    unorm8: 1,
    unorm8x2: 2,
    unorm8x4: 4,
    snorm8: 1,
    snorm8x2: 2,
    snorm8x4: 4,
    uint16: 2,
    uint16x2: 4,
    uint16x4: 8,
    sint16: 2,
    sint16x2: 4,
    sint16x4: 8,
    unorm16: 2,
    unorm16x2: 4,
    unorm16x4: 8,
    snorm16: 2,
    snorm16x2: 4,
    snorm16x4: 8,
    float16: 2,
    float16x2: 4,
    float16x4: 8,
    float32: 4,
    float32x2: 8,
    float32x3: 12,
    float32x4: 16,
    uint32: 4,
    uint32x2: 8,
    uint32x3: 12,
    uint32x4: 16,
    sint32: 4,
    sint32x2: 8,
    sint32x3: 12,
    sint32x4: 16,
    'unorm10-10-10-2': 4,
    'unorm8x4-bgra': 4,
  };

export const createLayout: CreateLayout = (attributes, stepMode) => {
  let arrayStride = 0;
  for (const {format} of attributes) {
    arrayStride += vertexFormatToSize[format];
  }

  const resultedAttributes: GPUVertexAttribute[] = [];
  let offset = 0;

  for (let i = 0; i < attributes.length; i++) {
    const attribute = attributes[i];
    resultedAttributes[i] = {
      format: attribute.format,
      shaderLocation: attribute.shaderLocation ?? i,
      offset: offset,
    };
    offset += vertexFormatToSize[attribute.format];
  }

  return {
    stepMode,
    arrayStride,
    attributes: resultedAttributes,
  };
};
