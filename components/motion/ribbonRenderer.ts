// The left half of the H.264 frame contains the premultiplied ribbon image.
// The right half carries its matte. One decoder keeps both halves and the sound in sync.
export function createRibbonRenderer(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", {
    alpha: true, premultipliedAlpha: true, antialias: false, depth: false,
    powerPreference: "low-power",
  });
  if (!gl) return null;

  const vertex = gl.createShader(gl.VERTEX_SHADER);
  const fragment = gl.createShader(gl.FRAGMENT_SHADER);
  const program = gl.createProgram();
  const buffer = gl.createBuffer();
  const texture = gl.createTexture();
  function dispose() {
    gl?.deleteTexture(texture);
    gl?.deleteBuffer(buffer);
    gl?.deleteProgram(program);
    gl?.deleteShader(vertex);
    gl?.deleteShader(fragment);
  }
  if (!vertex || !fragment || !program || !buffer || !texture) {
    dispose();
    return null;
  }
  gl.shaderSource(vertex, `
    attribute vec2 point;
    varying vec2 uv;
    void main() {
      gl_Position = vec4(point, 0.0, 1.0);
      uv = vec2(point.x * 0.5 + 0.5, 0.5 - point.y * 0.5);
    }`);
  gl.shaderSource(fragment, `
    precision mediump float;
    varying vec2 uv;
    uniform sampler2D frame;
    void main() {
      vec2 coord = vec2(uv.x * 0.5, uv.y);
      vec3 color = texture2D(frame, coord).rgb;
      float matte = texture2D(frame, coord + vec2(0.5, 0.0)).r;
      float alpha = clamp((matte - 0.008) / 0.984, 0.0, 1.0);
      gl_FragColor = vec4(min(color, vec3(alpha)), alpha);
    }`);
  gl.compileShader(vertex);
  gl.compileShader(fragment);
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    dispose();
    return null;
  }
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const point = gl.getAttribLocation(program, "point");
  gl.enableVertexAttribArray(point);
  gl.vertexAttribPointer(point, 2, gl.FLOAT, false, 0, 0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.uniform1i(gl.getUniformLocation(program, "frame"), 0);
  gl.viewport(0, 0, canvas.width, canvas.height);
  return {
    draw(video: HTMLVideoElement) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    dispose,
  };
}
