export type Mesh = {
  positions: [number, number, number][];
  triangles: [number, number, number][];
  normals: [number, number, number][];
};

export type TypedArrayMesh = {
  positions: Float32Array;
  triangles: Uint32Array;
  normals: Float32Array;
};
