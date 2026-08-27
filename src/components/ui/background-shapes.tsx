"use client";

import { useEffect, useMemo, useState, type ReactElement, type ReactNode } from "react";
type CellProps = { colors: string[]; strokeWidth: number };
const Cell1 = ({ colors }: CellProps) => <circle cx="50" cy="50" r="9.44" fill={colors[0]} />;
const Cell2 = ({ colors, strokeWidth }: CellProps) => <><line x1="25" x2="75" y1="25" y2="25" stroke={colors[0]} strokeWidth={strokeWidth}/><line x1="25" x2="75" y1="50" y2="50" stroke={colors[0]} strokeWidth={strokeWidth}/><line x1="25" x2="75" y1="75" y2="75" stroke={colors[0]} strokeWidth={strokeWidth}/></>;
const Cell3 = ({ colors, strokeWidth }: CellProps) => <><line x1="25" x2="75" y1="25" y2="75" stroke={colors[0]} strokeWidth={strokeWidth}/><line x1="25" x2="75" y1="75" y2="25" stroke={colors[0]} strokeWidth={strokeWidth}/></>;
const Cell4 = ({ colors, strokeWidth }: CellProps) => <rect width="50" height="50" x="25" y="25" fill="none" stroke={colors[0]} strokeWidth={strokeWidth}/>;
const Cell5 = ({ colors, strokeWidth }: CellProps) => <line x1="25" x2="75" y1="75" y2="25" stroke={colors[0]} strokeWidth={strokeWidth}/>;
const Cell6 = () => null;
const Cell7 = () => <rect width="75" height="75" x="12.5" y="12.5" fill="rgba(255,255,255,.08)"/>;
interface ShapeConfig { shape: (props: CellProps) => ReactElement | null; weight: number }
const shapesConfig: ShapeConfig[] = [{ shape: Cell1, weight: 1 },{ shape: Cell2, weight: 1 },{ shape: Cell3, weight: 1 },{ shape: Cell4, weight: 1 },{ shape: Cell5, weight: 1 },{ shape: Cell6, weight: 5 },{ shape: Cell7, weight: 3 }];
const weightedShapes = shapesConfig.flatMap((item) => Array.from({ length: item.weight }, () => item));
const seedPRNG = (seed: number) => { let value = seed; return () => { value = (value * 9301 + 49297) % 233280; return value / 233280; }; };
const hashSeed = (value: string) => Array.from(value).reduce((seed, char) => ((seed * 31) + char.charCodeAt(0)) % 233280, 7);
interface BackgroundShapesProps { width?: number; height?: number; cellSize?: number; strokeWidth?: number; colors?: string[]; className?: string; interval?: number }
export const BackgroundShapes = ({ width = 1600, height = 360, cellSize = 30, strokeWidth = 8, colors = ["white"], className = "", interval = 2800 }: BackgroundShapesProps) => {
  const [frame, setFrame] = useState(0);
  const colorsKey = colors.join("|");
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;
    const timer = window.setInterval(() => setFrame((value) => value + 1), interval);
    return () => window.clearInterval(timer);
  }, [interval]);
  const shapes = useMemo<ReactNode[]>(() => {
    const list: ReactNode[] = [];
    const border = cellSize * 2;
    const addShape = (x: number, y: number, id: string) => {
      const random = seedPRNG(hashSeed(`${id}-${frame}`));
      const Cell = (weightedShapes[Math.floor(random() * weightedShapes.length)] ?? shapesConfig[0]!).shape;
      list.push(<g key={id} transform={`translate(${x} ${y}) scale(.2)`}><Cell colors={colors} strokeWidth={strokeWidth}/></g>);
    };
    for (let x = border; x < width / 2; x += cellSize) for (let y = border; y < height - border; y += cellSize) { addShape(x, y, `left-${x}-${y}`); addShape(width-cellSize-x, y, `right-${x}-${y}`); }
    return list;
  }, [width, height, cellSize, strokeWidth, colorsKey, frame, colors]);
  return <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">{shapes}</svg>;
};
export default BackgroundShapes;
