# Buffer Usage Flags

[W3C GPU documentation](https://www.w3.org/TR/webgpu/#buffer-usage)

## MAP_READ
The buffer can be mapped for reading. (Example: calling `mapAsync()` with `GPUMapMode.READ`)

May only be combined with `COPY_DST`.

## MAP_WRITE
The buffer can be mapped for writing. (Example: calling `mapAsync()` with `GPUMapMode.WRITE`)

May only be combined with `COPY_SRC`.

## COPY_SRC
The buffer can be used as the source of a copy operation. (Examples: as the source argument of a `copyBufferToBuffer()` or `copyBufferToTexture()` call.)

## COPY_DST
The buffer can be used as the destination of a copy or write operation. (Examples: as the destination argument of a `copyBufferToBuffer()` or `copyTextureToBuffer()` call, or as the target of a `writeBuffer()` call.)

## INDEX
The buffer can be used as an index buffer. (Example: passed to `setIndexBuffer()`.)

## VERTEX
The buffer can be used as a vertex buffer. (Example: passed to `setVertexBuffer()`.)

## UNIFORM
The buffer can be used as a uniform buffer. (Example: as a bind group entry for a `GPUBufferBindingLayout` with a `buffer.type` of "uniform".)

## STORAGE
The buffer can be used as a storage buffer. (Example: as a bind group entry for a `GPUBufferBindingLayout` with a `buffer.type` of "storage" or "read-only-storage".)

## INDIRECT
The buffer can be used to store indirect command arguments. (Examples: as the `indirectBuffer` argument of a `drawIndirect()` or `dispatchWorkgroupsIndirect()` call.)

## QUERY_RESOLVE
The buffer can be used to capture query results. (Example: as the destination argument of a `resolveQuerySet()` call.)
