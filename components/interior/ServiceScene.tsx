import TiltFigure from "./TiltFigure";
import { mockupFor, type MockScene } from "./ServiceMockups";

export default function ServiceScene({ scene, tone }: { scene: MockScene; tone?: "light" | "dark" }) {
  const { label, Scene } = mockupFor(scene);
  return <TiltFigure label={label} tone={tone}><Scene /></TiltFigure>;
}
