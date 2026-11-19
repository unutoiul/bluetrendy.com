import TiltFigure from "./TiltFigure";
import { mockupFor } from "./ServiceMockups";

export default function ServiceScene({ slug }: { slug: string }) {
  const { label, Scene } = mockupFor(slug);
  return <TiltFigure label={label}><Scene /></TiltFigure>;
}
