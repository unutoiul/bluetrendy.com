"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Safari (and every iOS browser, which all use WebKit) drops WebM transparency and does
 * not reliably apply mix-blend-mode to a playing <video>, so a film shot on black shows
 * as a black box there. This keys the film instead: each frame is drawn to a WebGL
 * canvas with its brightness as its opacity, so black becomes clear and the light stays.
 */
export function useNeedsLumaKey() {
  const [needed, setNeeded] = useState(false);
  useEffect(() => {
    const apple = navigator.vendor.startsWith("Apple");
    const webgl = apple && Boolean(document.createElement("canvas").getContext("webgl"));
    // Browser support is only known after mount; this is the one update it causes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNeeded(webgl);
  }, []);
  return needed;
}

const vertex = `attribute vec2 p; varying vec2 v;
void main() { v = (p + 1.0) * 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;
// Premultiplied output: the colour stays, its brightest channel becomes its opacity.
const fragment = `precision mediump float; varying vec2 v; uniform sampler2D t;
void main() { vec3 c = texture2D(t, v).rgb; gl_FragColor = vec4(c, max(c.r, max(c.g, c.b))); }`;

type FrameVideo = HTMLVideoElement & {
  requestVideoFrameCallback?: (callback: () => void) => number;
  cancelVideoFrameCallback?: (handle: number) => void;
};

export function useLumaKey(videoRef: RefObject<HTMLVideoElement | null>, canvasRef: RefObject<HTMLCanvasElement | null>, active: boolean) {
  useEffect(() => {
    const video = videoRef.current as FrameVideo | null;
    const canvas = canvasRef.current;
    if (!active || !video || !canvas) return;
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl) return;

    function shader(type: number, source: string) {
      const made = gl!.createShader(type)!;
      gl!.shaderSource(made, source);
      gl!.compileShader(made);
      return made;
    }
    const program = gl.createProgram()!;
    gl.attachShader(program, shader(gl.VERTEX_SHADER, vertex));
    gl.attachShader(program, shader(gl.FRAGMENT_SHADER, fragment));
    gl.linkProgram(program);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "p");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    for (const [name, value] of [[gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE],
      [gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR]]) gl.texParameteri(gl.TEXTURE_2D, name, value);

    let stopped = false;
    let handle = 0;
    function draw() {
      if (stopped || !video || !canvas || video.readyState < 2 || !video.videoWidth) return;
      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        gl!.viewport(0, 0, canvas.width, canvas.height);
      }
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, video);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    }
    function loop() {
      draw();
      if (stopped || !video) return;
      handle = video.requestVideoFrameCallback ? video.requestVideoFrameCallback(loop) : requestAnimationFrame(loop);
    }
    loop();
    // Paused, seeked or freshly loaded frames are drawn too.
    video.addEventListener("loadeddata", draw);
    video.addEventListener("seeked", draw);
    return () => {
      stopped = true;
      if (video.cancelVideoFrameCallback) video.cancelVideoFrameCallback(handle);
      else cancelAnimationFrame(handle);
      video.removeEventListener("loadeddata", draw);
      video.removeEventListener("seeked", draw);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [active, videoRef, canvasRef]);
}
