// Living backgrounds: each effect draws one frame of a full-bleed scene in light.
// Effects keep their own state in a closure and react to the pointer and to clicks.

export type Frame = {
  context: CanvasRenderingContext2D;
  width: number;
  height: number;
  /** Seconds since the effect started. */
  time: number;
  /** Seconds since the previous frame. */
  delta: number;
  pointer: { x: number; y: number } | null;
  /** Recent clicks, newest last; age in seconds. */
  bursts: { x: number; y: number; age: number }[];
  /** Drawing on a white section rather than a dark one. */
  light: boolean;
  narrow: boolean;
};

export type Effect = (random: () => number) => (frame: Frame) => void;

const TAU = Math.PI * 2;

function blue(frame: Frame, alpha: number) {
  return frame.light ? `rgba(22, 95, 204, ${alpha})` : `rgba(70, 160, 255, ${alpha})`;
}
function ice(frame: Frame, alpha: number) {
  return frame.light ? `rgba(30, 120, 225, ${alpha})` : `rgba(190, 240, 255, ${alpha})`;
}

/** A soft halo with a bright core. */
function glow(frame: Frame, x: number, y: number, radius: number, alpha: number) {
  const { context } = frame;
  const halo = context.createRadialGradient(x, y, 0, x, y, radius * 4.5);
  halo.addColorStop(0, frame.light ? `rgba(40, 120, 230, ${0.24 * alpha})` : `rgba(120, 215, 255, ${0.38 * alpha})`);
  halo.addColorStop(1, "rgba(30, 120, 255, 0)");
  context.fillStyle = halo;
  context.beginPath();
  context.arc(x, y, radius * 4.5, 0, TAU);
  context.fill();
  context.fillStyle = frame.light ? `rgba(22, 95, 204, ${0.8 * alpha})` : `rgba(225, 248, 255, ${0.85 * alpha})`;
  context.beginPath();
  context.arc(x, y, radius, 0, TAU);
  context.fill();
}

function line(frame: Frame, x1: number, y1: number, x2: number, y2: number, style: string, width = 1) {
  const { context } = frame;
  context.strokeStyle = style;
  context.lineWidth = width;
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
}

/** Re-runs a layout function whenever the canvas changes size noticeably. */
function onResize<T>(build: (width: number, height: number) => T) {
  let key = "";
  let value: T;
  return (frame: Frame) => {
    const next = `${Math.round(frame.width / 40)}:${Math.round(frame.height / 40)}`;
    if (next !== key) { key = next; value = build(frame.width, frame.height); }
    return value;
  };
}

function pointAlong(points: { x: number; y: number }[], progress: number) {
  const lengths = points.slice(1).map((point, i) => Math.hypot(point.x - points[i].x, point.y - points[i].y));
  let travel = lengths.reduce((sum, length) => sum + length, 0) * progress;
  for (let i = 0; i < lengths.length; i++) {
    if (travel <= lengths[i]) {
      const share = lengths[i] ? travel / lengths[i] : 0;
      return { x: points[i].x + (points[i + 1].x - points[i].x) * share, y: points[i].y + (points[i + 1].y - points[i].y) * share };
    }
    travel -= lengths[i];
  }
  return points[points.length - 1];
}

/** Glowing nodes across the whole section, linked when close; signals run along the links. */
export const constellation: Effect = random => {
  const layout = onResize((width, height) => Array.from({ length: Math.min(70, Math.round(width * height / 26000)) }, () => ({
    x: random(), y: random(), r: 0.9 + random() * 1.8, phase: random() * TAU, dx: (random() - 0.5) * 0.02, dy: (random() - 0.5) * 0.02,
  })));
  const signals: { a: number; b: number; start: number; duration: number }[] = [];
  return frame => {
    const nodes = layout(frame);
    const points = nodes.map(node => ({
      x: (node.x + Math.sin(frame.time * 0.25 + node.phase) * node.dx) * frame.width,
      y: (node.y + Math.cos(frame.time * 0.21 + node.phase) * node.dy) * frame.height,
    }));
    const links: [number, number][] = [];
    for (let a = 0; a < points.length; a++) {
      for (let b = a + 1; b < points.length; b++) {
        const distance = Math.hypot(points[a].x - points[b].x, points[a].y - points[b].y);
        if (distance < 120) {
          links.push([a, b]);
          line(frame, points[a].x, points[a].y, points[b].x, points[b].y, blue(frame, 0.26 * (1 - distance / 120)));
        }
      }
    }
    points.forEach((point, index) => {
      const near = frame.pointer ? Math.max(0, 1 - Math.hypot(point.x - frame.pointer.x, point.y - frame.pointer.y) / 200) : 0;
      if (near > 0 && frame.pointer) line(frame, frame.pointer.x, frame.pointer.y, point.x, point.y, ice(frame, 0.5 * near));
      glow(frame, point.x, point.y, nodes[index].r * (1 + near * 0.8), Math.min(1, 0.55 + Math.sin(frame.time * 1.6 + nodes[index].phase) * 0.25 + near));
    });
    if (links.length && signals.length < 4 && random() < 0.03) {
      const [a, b] = links[Math.floor(random() * links.length)];
      signals.push({ a, b, start: frame.time, duration: 0.9 + random() * 0.9 });
    }
    for (let i = signals.length - 1; i >= 0; i--) {
      const signal = signals[i];
      const progress = (frame.time - signal.start) / signal.duration;
      const from = points[signal.a], to = points[signal.b];
      if (progress >= 1 || !from || !to) { signals.splice(i, 1); continue; }
      glow(frame, from.x + (to.x - from.x) * progress, from.y + (to.y - from.y) * progress, 1.6, Math.sin(progress * Math.PI));
    }
  };
};

/** Neurons with branching dendrites; pulses fire out along the branches, and the pointer sets them off. */
export const synapses: Effect = random => {
  const layout = onResize((width, height) => {
    const count = Math.min(28, Math.max(10, Math.round(width * height / 40000)));
    return Array.from({ length: count }, () => {
      const x = random() * width, y = random() * height;
      const branches = Array.from({ length: 2 + Math.floor(random() * 3) }, () => {
        let angle = random() * TAU, px = x, py = y;
        const points = [{ x, y }];
        for (let s = 0; s < 3; s++) {
          angle += (random() - 0.5) * 1.2;
          const length = 28 + random() * 46;
          px += Math.cos(angle) * length;
          py += Math.sin(angle) * length;
          points.push({ x: px, y: py });
        }
        return points;
      });
      return { x, y, branches, fired: -10, phase: random() * TAU };
    });
  });
  const pulses: { neuron: number; branch: number; start: number; duration: number }[] = [];
  function fire(neuron: number, time: number) {
    pulses.push(...Array.from({ length: 5 }, (_, branch) => ({ neuron, branch, start: time, duration: 0.7 + branch * 0.08 })));
  }
  return frame => {
    const neurons = layout(frame);
    for (let a = 0; a < neurons.length; a++) {
      for (let b = a + 1; b < neurons.length; b++) {
        const distance = Math.hypot(neurons[a].x - neurons[b].x, neurons[a].y - neurons[b].y);
        if (distance < 170) line(frame, neurons[a].x, neurons[a].y, neurons[b].x, neurons[b].y, blue(frame, 0.06 * (1 - distance / 170)));
      }
    }
    neurons.forEach(neuron => {
      for (const branch of neuron.branches) {
        frame.context.strokeStyle = blue(frame, 0.16);
        frame.context.lineWidth = 1;
        frame.context.beginPath();
        branch.forEach((point, i) => (i ? frame.context.lineTo(point.x, point.y) : frame.context.moveTo(point.x, point.y)));
        frame.context.stroke();
        const tip = branch[branch.length - 1];
        glow(frame, tip.x, tip.y, 0.8, 0.3);
      }
    });
    // The neuron nearest the pointer fires; a click fires every neuron near it.
    if (frame.pointer) {
      let nearest = -1, best = 150;
      neurons.forEach((neuron, i) => {
        const distance = Math.hypot(neuron.x - frame.pointer!.x, neuron.y - frame.pointer!.y);
        if (distance < best) { best = distance; nearest = i; }
      });
      if (nearest >= 0 && frame.time - neurons[nearest].fired > 1.2) { neurons[nearest].fired = frame.time; fire(nearest, frame.time); }
    }
    for (const burst of frame.bursts) {
      if (burst.age > frame.delta * 1.5) continue;
      neurons.forEach((neuron, i) => { if (Math.hypot(neuron.x - burst.x, neuron.y - burst.y) < 240) { neuron.fired = frame.time; fire(i, frame.time); } });
    }
    if (random() < 0.02) { const i = Math.floor(random() * neurons.length); neurons[i].fired = frame.time; fire(i, frame.time); }
    neurons.forEach(neuron => {
      const recent = Math.max(0, 1 - (frame.time - neuron.fired) / 0.8);
      glow(frame, neuron.x, neuron.y, 2.2 + recent * 1.6, Math.min(1, 0.65 + Math.sin(frame.time * 1.4 + neuron.phase) * 0.2 + recent));
    });
    for (let i = pulses.length - 1; i >= 0; i--) {
      const pulse = pulses[i];
      const neuron = neurons[pulse.neuron];
      const branch = neuron?.branches[pulse.branch];
      const progress = (frame.time - pulse.start) / pulse.duration;
      if (!branch || progress >= 1) { pulses.splice(i, 1); continue; }
      const point = pointAlong(branch, progress);
      glow(frame, point.x, point.y, 1.5, 1 - progress * 0.6);
    }
  };
};

/** Translucent ribbons of light sweep across, echoing the BlueTrendy mark; they bend toward the pointer. */
export const ribbons: Effect = random => {
  const bands = Array.from({ length: 3 }, (_, i) => ({
    base: 0.26 + i * 0.24 + random() * 0.05, amplitude: 0.05 + random() * 0.08, frequency: 0.8 + random() * 1.2,
    speed: 0.1 + random() * 0.12, thickness: 14 + random() * 20, phase: random() * TAU,
  }));
  let pull = { x: 0, y: 0, strength: 0 };
  return frame => {
    const { context, width, height } = frame;
    // Ease the pull so the ribbons drift toward the pointer rather than snapping.
    const target = frame.pointer ? { x: frame.pointer.x, y: frame.pointer.y, strength: 1 } : { ...pull, strength: 0 };
    pull = { x: pull.x + (target.x - pull.x) * 0.08, y: pull.y + (target.y - pull.y) * 0.08, strength: pull.strength + (target.strength - pull.strength) * 0.05 };
    for (const band of bands) {
      const top: { x: number; y: number }[] = [], bottom: { x: number; y: number }[] = [];
      for (let step = 0; step <= 90; step++) {
        const u = step / 90;
        const x = -0.05 * width + u * 1.1 * width;
        let y = band.base * height + Math.sin(u * TAU * band.frequency + frame.time * band.speed * 3 + band.phase) * band.amplitude * height;
        const reach = Math.exp(-((x - pull.x) ** 2) / (2 * (width * 0.16) ** 2));
        y += (pull.y - y) * 0.35 * reach * pull.strength;
        const thickness = band.thickness * (0.55 + 0.45 * Math.sin(u * 5 + band.phase + frame.time * 0.4));
        top.push({ x, y: y - thickness / 2 });
        bottom.push({ x, y: y + thickness / 2 });
      }
      const fill = context.createLinearGradient(0, 0, width, 0);
      fill.addColorStop(0, "rgba(30, 110, 255, 0)");
      fill.addColorStop(0.3, frame.light ? "rgba(22, 95, 204, 0.05)" : "rgba(30, 110, 255, 0.08)");
      fill.addColorStop(0.65, frame.light ? "rgba(60, 150, 240, 0.06)" : "rgba(120, 220, 255, 0.12)");
      fill.addColorStop(1, "rgba(30, 110, 255, 0)");
      context.fillStyle = fill;
      context.beginPath();
      top.forEach((point, i) => (i ? context.lineTo(point.x, point.y) : context.moveTo(point.x, point.y)));
      for (let i = bottom.length - 1; i >= 0; i--) context.lineTo(bottom[i].x, bottom[i].y);
      context.closePath();
      context.fill();
      context.strokeStyle = ice(frame, 0.2);
      context.lineWidth = 1;
      context.beginPath();
      top.forEach((point, i) => (i ? context.lineTo(point.x, point.y) : context.moveTo(point.x, point.y)));
      context.stroke();
      const spark = top[Math.floor(((frame.time * band.speed * 0.5 + band.phase) % 1) * (top.length - 1))];
      glow(frame, spark.x, spark.y, 1.3, 0.5);
    }
  };
};

/** Shared by the dot field and signal ripples: dots that lift as rings pass through them. */
function rippleDots(spacing: number, beacon: boolean) {
  const trail: { x: number; y: number; born: number; strength: number }[] = [];
  let last = { x: -999, y: -999, time: 0 };
  let lastBeacon = -9;
  return (frame: Frame) => {
    const { context, width, height, time } = frame;
    if (frame.pointer && (Math.hypot(frame.pointer.x - last.x, frame.pointer.y - last.y) > 42 || time - last.time > 0.35)) {
      trail.push({ x: frame.pointer.x, y: frame.pointer.y, born: time, strength: 0.7 });
      last = { x: frame.pointer.x, y: frame.pointer.y, time };
    }
    for (const burst of frame.bursts) if (burst.age <= frame.delta * 1.5) trail.push({ x: burst.x, y: burst.y, born: time, strength: 1.4 });
    const beaconAt = { x: width * (frame.narrow ? 0.5 : 0.28), y: height * (frame.narrow ? 0.3 : 0.52) };
    if (beacon && time - lastBeacon > 1.6) {
      lastBeacon = time;
      trail.push({ x: beaconAt.x, y: beaconAt.y, born: time, strength: 1 });
    }
    while (trail.length && time - trail[0].born > 2.4) trail.shift();
    if (trail.length > 40) trail.splice(0, trail.length - 40);
    for (let y = spacing / 2; y < height; y += spacing) {
      for (let x = spacing / 2; x < width; x += spacing) {
        let lift = 0, dx = 0, dy = 0;
        for (const ring of trail) {
          const age = time - ring.born;
          const distance = Math.hypot(x - ring.x, y - ring.y);
          const off = Math.abs(distance - age * 240);
          if (off < 24) {
            const amount = (1 - off / 24) * (1 - age / 2.4) * ring.strength;
            lift += amount;
            dx += ((x - ring.x) / (distance || 1)) * amount * 5;
            dy += ((y - ring.y) / (distance || 1)) * amount * 5;
          }
        }
        const idle = 0.5 + Math.sin(x * 0.012 + y * 0.009 + time * 0.8) * 0.5;
        const alpha = (frame.light ? 0.13 : 0.11) + idle * 0.04 + Math.min(1, lift) * 0.42;
        const size = 1.1 + Math.min(1, lift) * 1.8;
        context.fillStyle = lift > 0.3 ? ice(frame, alpha) : blue(frame, alpha);
        context.fillRect(x + dx - size / 2, y + dy - size / 2, size, size);
      }
    }
    if (beacon) {
      for (const ring of trail) {
        const age = time - ring.born;
        context.strokeStyle = ice(frame, 0.2 * (1 - age / 2.4) * Math.min(1, ring.strength));
        context.lineWidth = 1.2;
        context.beginPath();
        context.arc(ring.x, ring.y, age * 240, 0, TAU);
        context.stroke();
      }
      glow(frame, beaconAt.x, beaconAt.y, 4, 1);
    }
  };
}

/** A fine dot field; the pointer sends ripples through it. */
export const dotField: Effect = () => rippleDots(24, false);

/** Signal rings radiate from a beacon and from the pointer. */
export const ripples: Effect = () => rippleDots(30, true);

/** A mesh of nodes passing packets of light; the pointer becomes a node that draws packets in. */
export const packetMesh: Effect = random => {
  const layout = onResize((width, height) => {
    const columns = Math.max(4, Math.round(width / 170)), rows = Math.max(3, Math.round(height / 150));
    const nodes = [];
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= columns; c++) {
        nodes.push({ x: (c + (random() - 0.5) * 0.7) * (width / columns), y: (r + (random() - 0.5) * 0.7) * (height / rows) });
      }
    }
    const edges: [number, number][] = [];
    nodes.forEach((_, i) => {
      const c = i % (columns + 1), r = Math.floor(i / (columns + 1));
      if (c < columns) edges.push([i, i + 1]);
      if (r < rows) edges.push([i, i + columns + 1]);
      if (c < columns && r < rows && random() < 0.45) edges.push([i, i + columns + 2]);
    });
    const packets = Array.from({ length: Math.round(edges.length * 0.16) }, () => ({
      edge: Math.floor(random() * edges.length), offset: random(), speed: 0.25 + random() * 0.45, forward: random() < 0.5,
    }));
    return { nodes, edges, packets };
  });
  return frame => {
    const { nodes, edges, packets } = layout(frame);
    for (const [a, b] of edges) line(frame, nodes[a].x, nodes[a].y, nodes[b].x, nodes[b].y, blue(frame, 0.1));
    for (const packet of packets) {
      const [a, b] = edges[packet.edge];
      let progress = (frame.time * packet.speed + packet.offset) % 1;
      if (!packet.forward) progress = 1 - progress;
      glow(frame, nodes[a].x + (nodes[b].x - nodes[a].x) * progress, nodes[a].y + (nodes[b].y - nodes[a].y) * progress, 1.3, 0.85);
    }
    nodes.forEach(node => glow(frame, node.x, node.y, 1.4, 0.45));
    if (frame.pointer) {
      const { x, y } = frame.pointer;
      nodes.forEach((node, i) => {
        const distance = Math.hypot(node.x - x, node.y - y);
        if (distance > 220) return;
        const strength = 1 - distance / 220;
        line(frame, node.x, node.y, x, y, ice(frame, 0.3 * strength));
        const progress = (frame.time * 0.9 + i * 0.37) % 1;
        glow(frame, node.x + (x - node.x) * progress, node.y + (y - node.y) * progress, 1.4, strength);
      });
      glow(frame, x, y, 3.2, 1);
    }
  };
};

/** Streaks of light drift left to right across the section; they part around the pointer. */
export const streaks: Effect = random => {
  const particles = Array.from({ length: 70 }, () => ({ x: random(), lane: random(), speed: 0.04 + random() * 0.05 }));
  return frame => {
    const { width, height, delta } = frame;
    for (const particle of particles) {
      particle.x += particle.speed * Math.min(delta, 0.05);
      if (particle.x > 1.05) { particle.x = -0.05; particle.lane = random(); }
      const x = particle.x * width;
      let y = particle.lane * height;
      if (frame.pointer) {
        const dx = x - frame.pointer.x, dy = y - frame.pointer.y, distance = Math.hypot(dx, dy);
        if (distance < 130) y += (dy / (distance || 1)) * (130 - distance) * 0.6;
      }
      line(frame, x - 10, y, x, y, blue(frame, 0.32));
      glow(frame, x, y, 1, 0.5);
    }
  };
};

/** Circuit-board traces with current running along them; traces near the pointer light up. */
export const circuit: Effect = random => {
  const cell = 26;
  const layout = onResize((width, height) => {
    const count = Math.min(40, Math.max(12, Math.round(width * height / 30000)));
    const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    return Array.from({ length: count }, () => {
      let x = Math.round(random() * width / cell) * cell, y = Math.round(random() * height / cell) * cell;
      let [dx, dy] = directions[Math.floor(random() * 4)];
      const points = [{ x, y }];
      for (let s = 0; s < 4 + Math.floor(random() * 5); s++) {
        if (random() < 0.45) {
          // Turn 45 degrees for one short run, as traces do on a board.
          const diagonal = random() < 0.5 ? [dx || dy, dy || -dx] : [dx || -dy, dy || dx];
          x += diagonal[0] * cell; y += diagonal[1] * cell;
          points.push({ x, y });
          if (random() < 0.5) [dx, dy] = [dy, -dx];
        }
        const run = 1 + Math.floor(random() * 4);
        x += dx * cell * run; y += dy * cell * run;
        points.push({ x, y });
      }
      return { points, period: 2 + random() * 3, offset: random() };
    });
  });
  return frame => {
    const traces = layout(frame);
    for (const trace of traces) {
      const near = frame.pointer
        ? Math.max(0, ...trace.points.map(point => 1 - Math.hypot(point.x - frame.pointer!.x, point.y - frame.pointer!.y) / 170))
        : 0;
      frame.context.strokeStyle = near > 0 ? ice(frame, 0.14 + near * 0.4) : blue(frame, 0.13);
      frame.context.lineWidth = 1;
      frame.context.beginPath();
      trace.points.forEach((point, i) => (i ? frame.context.lineTo(point.x, point.y) : frame.context.moveTo(point.x, point.y)));
      frame.context.stroke();
      for (const end of [trace.points[0], trace.points[trace.points.length - 1]]) {
        frame.context.strokeStyle = blue(frame, 0.45 + near * 0.4);
        frame.context.beginPath();
        frame.context.arc(end.x, end.y, 3, 0, TAU);
        frame.context.stroke();
      }
      const speed = near > 0 ? 2.2 : 1;
      const progress = ((frame.time * speed) / trace.period + trace.offset) % 1;
      const point = pointAlong(trace.points, progress);
      glow(frame, point.x, point.y, 1.5, 0.9);
    }
  };
};

/**
 * A sphere of dots behind the headline. Each dot is held to its place on the slowly
 * turning sphere by a spring: the pointer pushes dots aside and they spring back with a
 * little overshoot, and a click sends a shock wave through them. Only dots, no stars.
 */
export const globe: Effect = () => {
  const count = 560;
  const sphere = Array.from({ length: count }, (_, i) => {
    const y = 1 - (i / (count - 1)) * 2, ring = Math.sqrt(1 - y * y), turn = i * Math.PI * (3 - Math.sqrt(5));
    return { x: Math.cos(turn) * ring, y, z: Math.sin(turn) * ring };
  });
  const bodies = sphere.map(() => ({ x: 0, y: 0, vx: 0, vy: 0, placed: false }));
  const stiffness = 38, damping = 7.5, reach = 130, push = 5200;
  let spin = 0;
  return frame => {
    const { context, width, height } = frame;
    const cx = width * (frame.narrow ? 0.5 : 0.27), cy = height * (frame.narrow ? 0.42 : 0.55);
    const radius = frame.narrow ? Math.min(width * 0.44, height * 0.38) : Math.min(height * 0.56, width * 0.26);
    // A soft glow behind the sphere so it reads as a ball of light.
    const halo = context.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.25);
    halo.addColorStop(0, frame.light ? "rgba(22, 95, 204, 0.05)" : "rgba(40, 120, 255, 0.12)");
    halo.addColorStop(1, "rgba(40, 120, 255, 0)");
    context.fillStyle = halo;
    context.fillRect(cx - radius * 1.3, cy - radius * 1.3, radius * 2.6, radius * 2.6);
    const step = Math.min(frame.delta, 0.05);
    spin += step * 0.16;
    const tilt = 0.38;
    sphere.forEach((point, i) => {
      const x = point.x * Math.cos(spin) - point.z * Math.sin(spin);
      const z = point.x * Math.sin(spin) + point.z * Math.cos(spin);
      const restX = cx + x * radius;
      const restY = cy + (point.y * Math.cos(tilt) - z * Math.sin(tilt)) * radius;
      const depth = point.y * Math.sin(tilt) + z * Math.cos(tilt);
      const body = bodies[i];
      if (!body.placed) { body.x = restX; body.y = restY; body.placed = true; }
      // Spring toward the dot's place on the sphere, with damping.
      let ax = (restX - body.x) * stiffness - body.vx * damping;
      let ay = (restY - body.y) * stiffness - body.vy * damping;
      if (frame.pointer) {
        const dx = body.x - frame.pointer.x, dy = body.y - frame.pointer.y, distance = Math.hypot(dx, dy) || 1;
        if (distance < reach) {
          const force = push * (1 - distance / reach) ** 2;
          ax += (dx / distance) * force;
          ay += (dy / distance) * force;
        }
      }
      for (const burst of frame.bursts) {
        const dx = body.x - burst.x, dy = body.y - burst.y, distance = Math.hypot(dx, dy) || 1;
        const front = Math.abs(distance - burst.age * 520);
        if (front < 40) {
          const force = 9000 * (1 - front / 40) * Math.max(0, 1 - burst.age);
          ax += (dx / distance) * force;
          ay += (dy / distance) * force;
        }
      }
      body.vx += ax * step;
      body.vy += ay * step;
      body.x += body.vx * step;
      body.y += body.vy * step;
      const front = Math.max(0, depth);
      const size = 1.1 + front * 1.9;
      const moving = Math.min(1, Math.hypot(body.vx, body.vy) / 260);
      context.fillStyle = moving > 0.2 ? ice(frame, 0.35 + front * 0.55) : blue(frame, 0.16 + front * 0.72);
      context.fillRect(body.x - size / 2, body.y - size / 2, size, size);
    });
  };
};

/** Streams of light flow across the full width and bend away from the pointer. */
export const flow: Effect = random => {
  const offsets = Array.from({ length: 40 }, () => random());
  return frame => {
    const { context, width, height, time } = frame;
    const streams = Math.min(26, Math.max(10, Math.round(height / 34)));
    const cx = width * (frame.narrow ? 0.5 : 0.3), cy = height * (frame.narrow ? 0.3 : 0.5);
    for (let s = 0; s < streams; s++) {
      const base = ((s + 0.5) / streams) * height;
      const phase = offsets[s] * TAU;
      const at = (u: number) => {
        const x = -0.05 * width + u * 1.1 * width;
        const squeeze = Math.exp(-((x - cx) ** 2) / (2 * (width * 0.16) ** 2));
        let y = base + Math.sin(u * 9 + phase + time * 0.6) * 12;
        y = y + (cy - y) * squeeze * 0.55;
        if (frame.pointer) {
          const dx = x - frame.pointer.x, dy = y - frame.pointer.y, distance = Math.hypot(dx, dy);
          if (distance < 190) y += (dy / (distance || 1)) * (190 - distance) * 0.3;
        }
        return { x, y };
      };
      context.strokeStyle = blue(frame, 0.08 + (s % 3) * 0.05);
      context.lineWidth = 1;
      context.beginPath();
      for (let step = 0; step <= 70; step++) { const p = at(step / 70); if (step) context.lineTo(p.x, p.y); else context.moveTo(p.x, p.y); }
      context.stroke();
      const head = at((time * (0.06 + offsets[s] * 0.06) + offsets[s]) % 1);
      glow(frame, head.x, head.y, 1.3, 0.85);
    }
    glow(frame, cx, cy, 4.5, 0.8);
  };
};

/** A perspective grid floor running to a glowing horizon; the pointer moves the camera. */
export const horizonGrid: Effect = () => {
  return frame => {
    const { context, width, height, time } = frame;
    const tiltX = frame.pointer ? (frame.pointer.x / width - 0.5) : 0;
    const tiltY = frame.pointer ? (frame.pointer.y / height - 0.5) : 0;
    const horizon = height * (0.46 + tiltY * 0.08);
    const vanish = width * (0.34 + tiltX * 0.22);
    const band = context.createLinearGradient(0, horizon - 60, 0, horizon + 40);
    band.addColorStop(0, "rgba(40, 140, 255, 0)");
    band.addColorStop(0.6, frame.light ? "rgba(22, 95, 204, 0.12)" : "rgba(60, 170, 255, 0.3)");
    band.addColorStop(1, "rgba(40, 140, 255, 0)");
    context.fillStyle = band;
    context.fillRect(0, horizon - 60, width, 100);
    glow(frame, vanish, horizon, 5, 0.9);
    for (let i = -14; i <= 14; i++) {
      const spread = Math.abs(i) / 14;
      line(frame, vanish + i * 6, horizon, vanish + i * width * 0.13, height + 20, blue(frame, 0.22 * (1 - spread * 0.7)));
    }
    for (let k = 0; k < 10; k++) {
      const depth = (k + ((time * 0.35) % 1)) / 10;
      const y = horizon + (height - horizon) * depth ** 2.1;
      line(frame, 0, y, width, y, blue(frame, 0.05 + depth * 0.22));
    }
  };
};

/** Tilted rings with nodes in orbit around a bright core; the pointer tilts the rings. */
export const orbit: Effect = () => {
  return frame => {
    const { context, width, height, time } = frame;
    const cx = width * (frame.narrow ? 0.5 : 0.28), cy = height * (frame.narrow ? 0.3 : 0.52);
    const radius = Math.min(height * 0.5, width * (frame.narrow ? 0.34 : 0.27));
    const tilt = -0.35 + (frame.pointer ? (frame.pointer.x / width - 0.5) * 0.6 : 0);
    glow(frame, cx, cy, 6, 1);
    for (let ring = 0; ring < 3; ring++) {
      const rx = radius * (0.45 + ring * 0.28), ry = rx * (0.3 + ring * 0.05), angle = tilt + ring * 0.45;
      context.strokeStyle = blue(frame, 0.32 - ring * 0.05);
      context.lineWidth = 1;
      context.beginPath();
      context.ellipse(cx, cy, rx, ry, angle, 0, TAU);
      context.stroke();
      for (let n = 0; n < 1 + ring; n++) {
        const theta = time * (0.5 - ring * 0.1) + n * (TAU / (1 + ring)) + ring;
        const ex = Math.cos(theta) * rx, ey = Math.sin(theta) * ry;
        const x = cx + ex * Math.cos(angle) - ey * Math.sin(angle), y = cy + ex * Math.sin(angle) + ey * Math.cos(angle);
        line(frame, cx, cy, x, y, blue(frame, 0.14));
        glow(frame, x, y, 2.4, 0.95);
      }
    }
    for (let pulse = 0; pulse < 2; pulse++) {
      const age = (time * 0.32 + pulse * 0.5) % 1;
      context.strokeStyle = ice(frame, 0.32 * (1 - age));
      context.beginPath();
      context.arc(cx, cy, radius * 0.18 + age * radius * 1.4, 0, TAU);
      context.stroke();
    }
  };
};

/** A terrain of dots filling the section, rolling gently; the pointer raises a hill under it. */
export const dotWave: Effect = () => {
  let bump = { x: 0, y: 0, strength: 0 };
  return frame => {
    const { context, width, height, time } = frame;
    const target = frame.pointer ? { ...frame.pointer, strength: 1 } : { ...bump, strength: 0 };
    bump = { x: bump.x + (target.x - bump.x) * 0.1, y: bump.y + (target.y - bump.y) * 0.1, strength: bump.strength + (target.strength - bump.strength) * 0.06 };
    const rows = 22, columns = Math.max(50, Math.round(width / 20));
    for (let row = 0; row < rows; row++) {
      const depth = row / (rows - 1);
      const scale = 0.35 + depth * 0.65;
      for (let column = 0; column <= columns; column++) {
        const u = column / columns;
        const x = width * (0.5 + (u - 0.5) * (0.85 + depth * 0.4));
        const roll = Math.sin(u * 7 + time * 0.5 + depth * 2.4) * 0.45 + Math.sin(u * 15 - time * 0.33 + depth * 5) * 0.2;
        let y = height * (0.08 + depth * 0.9) - roll * 22 * scale;
        const hill = Math.exp(-((x - bump.x) ** 2 + (y - bump.y) ** 2) / (2 * 110 ** 2)) * bump.strength;
        y -= hill * 34;
        const crest = Math.max(0, roll) + hill;
        const alpha = (0.08 + depth * 0.4) * (0.55 + crest * 0.9);
        const size = 0.6 + scale * 1.4 + hill * 1.2;
        context.fillStyle = crest > 0.45 ? ice(frame, alpha) : blue(frame, alpha);
        context.fillRect(x - size / 2, y - size / 2, size, size);
      }
    }
  };
};

/**
 * A lattice of dots, each held to its place by a spring. The pointer pushes through the
 * lattice like a hand through water and the dots settle back with a little overshoot; a
 * click sends a shock wave out across it. Stretched neighbours draw a faint thread.
 */
function springLattice({ spacing = 30, reach = 150, push = 6800, shock = 11000, swell = 2.2, ink = 1 } = {}): Effect {
  const stiffness = 34, damping = 6.5;
  return () => {
    const layout = onResize((width, height) => {
      const columns = Math.ceil(width / spacing) + 1, rows = Math.ceil(height / spacing) + 1;
      const dots = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          const x = c * spacing + (r % 2 ? spacing / 2 : 0), y = r * spacing;
          dots.push({ restX: x, restY: y, x, y, vx: 0, vy: 0 });
        }
      }
      return { dots, columns, rows };
    });
    return frame => {
      const { context, time } = frame;
      const { dots, columns } = layout(frame);
      const step = Math.min(frame.delta, 0.05);
      for (const dot of dots) {
        // A slow swell moves the rest positions so the lattice is never quite still.
        const restY = dot.restY + Math.sin(dot.restX * 0.012 + time * 0.9) * swell;
        let ax = (dot.restX - dot.x) * stiffness - dot.vx * damping;
        let ay = (restY - dot.y) * stiffness - dot.vy * damping;
        if (frame.pointer) {
          const dx = dot.x - frame.pointer.x, dy = dot.y - frame.pointer.y, distance = Math.hypot(dx, dy) || 1;
          if (distance < reach) {
            const force = push * (1 - distance / reach) ** 2;
            ax += (dx / distance) * force;
            ay += (dy / distance) * force;
          }
        }
        for (const burst of frame.bursts) {
          const dx = dot.x - burst.x, dy = dot.y - burst.y, distance = Math.hypot(dx, dy) || 1;
          const front = Math.abs(distance - burst.age * 560);
          if (front < 46) {
            const force = shock * (1 - front / 46) * Math.max(0, 1 - burst.age * 0.9);
            ax += (dx / distance) * force;
            ay += (dy / distance) * force;
          }
        }
        dot.vx += ax * step;
        dot.vy += ay * step;
        dot.x += dot.vx * step;
        dot.y += dot.vy * step;
      }
      // Threads between neighbours appear only while the lattice is stretched.
      context.lineWidth = 1;
      dots.forEach((dot, i) => {
        const right = (i + 1) % columns ? dots[i + 1] : undefined;
        const below = dots[i + columns];
        for (const other of [right, below]) {
          if (!other) continue;
          const rest = Math.hypot(other.restX - dot.restX, other.restY - dot.restY);
          const stretch = Math.abs(Math.hypot(other.x - dot.x, other.y - dot.y) - rest);
          if (stretch < 3) continue;
          context.strokeStyle = blue(frame, Math.min(0.35, stretch / 40) * ink);
          context.beginPath();
          context.moveTo(dot.x, dot.y);
          context.lineTo(other.x, other.y);
          context.stroke();
        }
      });
      for (const dot of dots) {
        const moving = Math.min(1, Math.hypot(dot.vx, dot.vy) / 220);
        const size = 1.6 + moving * 1.8;
        context.fillStyle = moving > 0.15 ? ice(frame, (0.45 + moving * 0.4) * ink) : blue(frame, 0.22 * ink);
        context.fillRect(dot.x - size / 2, dot.y - size / 2, size, size);
      }
    };
  };
}

export const springGrid = springLattice();

/** The same lattice, quieter: wider spacing, fainter dots and a softer touch, for long pages people read. */
export const softGrid = springLattice({ spacing: 34, reach: 130, push: 3600, shock: 6000, swell: 1.4, ink: 0.6 });

export const effects = {
  constellation, synapses, ribbons, dotField, ripples, packetMesh, streaks, circuit, globe, flow, horizonGrid, orbit, dotWave, springGrid, softGrid,
};
export type EffectName = keyof typeof effects;
