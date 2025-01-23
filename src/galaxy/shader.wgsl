struct Uniforms {
    viewProjection: mat4x4<f32>,
    time: f32,
}

@group(0) @binding(0) var<uniform> uni: Uniforms;

struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) color: vec4<f32>,
}

struct OrbitOutput {
    position: vec3<f32>,
    pullStrength: f32,
}

fn superNova(position: vec3<f32>, time: f32) -> OrbitOutput {
    let dist = length(position);
    let maxDist = 3.5;
    let rotationSpeed = 0.3;
    let angle = time * rotationSpeed * (1.0 + (1.0 - dist / maxDist) * 2.0);
    let rotX = vec3<f32>(cos(angle), 0.0, -sin(angle));
    let rotZ = vec3<f32>(sin(angle), 0.0, cos(angle));
    var newPos = position;
    newPos = vec3<f32>(
        dot(vec3<f32>(rotX.x, rotX.y, rotX.z), newPos),
        newPos.y,
        dot(vec3<f32>(rotZ.x, rotZ.y, rotZ.z), newPos)
    );
    let pullStrength = 0.4 * (1.0 - dist / maxDist) * time;
    let easeOut = 1.0 - (1.0 - pullStrength) * (1.0 - pullStrength);
    newPos = mix(newPos, vec3<f32>(0.0), easeOut);
    var orbitOutput: OrbitOutput;
    orbitOutput.position = newPos;
    orbitOutput.pullStrength = pullStrength;
    return orbitOutput;
}

fn instanceBlackSphere(position: vec3<f32>) -> VertexOutput {
    var output: VertexOutput;
    let sphereRadius = 0.2;
    let spherePosition = normalize(position) * sphereRadius;
    output.position = uni.viewProjection * vec4<f32>(spherePosition, 1.0);
    output.color = vec4<f32>(0.0, 0.0, 0.0, 1.0);
    return output;
}

@vertex
fn vertexMain(@location(0) position: vec3<f32>) -> VertexOutput {
    var output: VertexOutput;

    let orbitOutput = superNova(position, uni.time);

    let dist = length(orbitOutput.position);
    let maxDist = 2.0;
    let distRatio = dist / maxDist;

    let r = 0.5 + 0.5 * sin(dist + uni.time);
    let g = 0.2 + 0.3 * cos(dist + uni.time);
    let b = 0.6 + 0.4 * cos(dist + uni.time);

    let intensity = 1.0 + (1.0 - distRatio) * 2.0;
    let alpha = mix(0.3, 1.0, 1.0 - distRatio);

    output.position = uni.viewProjection * vec4<f32>(orbitOutput.position, 1.0);
    output.color = vec4<f32>(r * intensity, g * intensity, b * intensity, alpha);
     let blackSphereOutput = instanceBlackSphere(orbitOutput.position);

    if orbitOutput.pullStrength > 5 {

        output.position = blackSphereOutput.position;
        output.color = blackSphereOutput.color;
    }


    if orbitOutput.pullStrength > 1 {
        output.position = mix(output.position, blackSphereOutput.position, orbitOutput.pullStrength - 1);
        output.color = mix(output.color, blackSphereOutput.color, orbitOutput.pullStrength - 1);
    }


  if orbitOutput.pullStrength > 2 {
      output.position = mix(output.position, blackSphereOutput.position, orbitOutput.pullStrength - 2);
      output.color = mix(output.color, blackSphereOutput.color, orbitOutput.pullStrength - 2);
  }


    if orbitOutput.pullStrength > 4 {
       output.position = mix(output.position, blackSphereOutput.position, orbitOutput.pullStrength - 4);
       output.color = mix(output.color, blackSphereOutput.color, orbitOutput.pullStrength - 4);
    }


    return output;
}

@fragment
fn fragmentMain(@location(0) color: vec4<f32>) -> @location(0) vec4<f32> {
    return color;
}
