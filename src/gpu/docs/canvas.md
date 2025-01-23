# Canvas Configuration

Canvas GPUTextures are vended in a very structured way:

- `canvas.getContext('webgpu')` provides a `GPUCanvasContext`.
- `GPUCanvasContext.configure({ device, format, usage })` modifies the current configuration, invalidating any previous texture object, attaching the canvas to the provided device, and setting options for vended textures and canvas behavior.
- Resizing the canvas also invalidates previous texture objects.
- `GPUCanvasContext.getCurrentTexture()` provides a `GPUTexture`.
- `GPUCanvasContext.unconfigure()` returns the context to its initial, unconfigured state.

This structure provides maximal compatibility with optimized paths in native graphics APIs. In these, typically, a platform-specific "surface" object can produce an API object called a "swap chain" which provides, possibly up-front, a possibly-fixed list of 1-3 textures to render into.