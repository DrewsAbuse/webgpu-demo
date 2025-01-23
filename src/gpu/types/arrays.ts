export type TypedArrayView = Float32Array | Uint32Array;

export type ArrayVertexesWithIndices = {
  vertices: Float32Array<ArrayBuffer>;
  indices: Uint32Array<ArrayBuffer>;
};
