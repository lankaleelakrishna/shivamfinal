import type { ReactElement } from "react";
import styles from "./Artwork.module.css";

/**
 * Original SVG artwork for the site. Drawn in the brand palette with no text,
 * no third-party imagery and no product screens, so nothing here can be mistaken
 * for a real HireVaani screen or a customer photo.
 */
export type ArtKind = "network" | "code" | "device" | "design" | "people" | "building" | "bars" | "campus";

const NAVY = "#0d1d2f";
const PANEL = "#223850";
const LIGHT = "#eef3f8";
const WHITE = "#ffffff";
const LINE = "#d6dee8";
const ACCENT = "#e4780f";
const BLUE = "#5b8cff";
const GREEN = "#2bd67b";
const CORAL = "#ff5c8a";
const VIOLET = "#a78bfa";
const SKY = "#4cc9f0";
const AMBER = "#f5a04a";

/** Connected nodes: a technology network. */
function Network() {
  const nodes: [number, number][] = [
    [90, 110], [210, 70], [330, 120], [470, 80], [150, 230], [280, 210],
    [420, 240], [530, 200], [90, 360], [230, 330], [370, 360], [510, 350],
  ];
  const edges: [number, number][] = [
    [0, 1], [1, 2], [2, 3], [0, 4], [1, 5], [2, 5], [3, 7], [4, 5], [5, 6],
    [6, 7], [4, 8], [5, 9], [6, 10], [7, 11], [8, 9], [9, 10], [10, 11],
  ];
  const hubs = [5, 6];
  return (
    <>
      <rect width="600" height="440" fill={NAVY} />
      {edges.map(([a, b]) => (
        <line key={`${a}-${b}`} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} stroke={PANEL} strokeWidth="2" />
      ))}
      {nodes.map(([x, y], i) =>
        hubs.includes(i) ? (
          <circle key={i} cx={x} cy={y} r="16" fill={ACCENT} />
        ) : (
          <circle key={i} cx={x} cy={y} r="9" fill={BLUE} />
        ),
      )}
    </>
  );
}

/** A code editor window with abstract lines. No real code or UI. */
function Code() {
  const rows: [number, number, string][] = [
    [0, 240, BLUE], [1, 170, WHITE], [1, 300, SKY], [2, 210, GREEN], [2, 120, AMBER],
    [1, 260, BLUE], [0, 90, WHITE], [1, 200, CORAL], [2, 280, SKY], [0, 150, GREEN],
  ];
  return (
    <>
      <rect width="600" height="440" fill={LIGHT} />
      <rect x="40" y="50" width="520" height="340" rx="18" fill={NAVY} stroke={PANEL} />
      <circle cx="72" cy="84" r="6" fill={CORAL} />
      <circle cx="96" cy="84" r="6" fill={AMBER} />
      <circle cx="120" cy="84" r="6" fill={GREEN} />
      {rows.map(([indent, width, color], i) => (
        <rect key={i} x={84 + indent * 30} y={122 + i * 30} width={width} height="12" rx="6" fill={color} opacity={i % 3 === 1 ? 0.55 : 0.9} />
      ))}
    </>
  );
}

/** Two abstract phone outlines with generic blocks. No app screens. */
function Device() {
  return (
    <>
      <rect width="600" height="440" fill={LIGHT} />
      <rect x="110" y="56" width="180" height="330" rx="30" fill={NAVY} />
      <rect x="126" y="84" width="148" height="278" rx="14" fill={WHITE} />
      <rect x="140" y="104" width="120" height="44" rx="10" fill={BLUE} />
      <rect x="140" y="164" width="120" height="30" rx="8" fill={LINE} />
      <rect x="140" y="210" width="120" height="30" rx="8" fill={LINE} />
      <rect x="140" y="256" width="120" height="30" rx="8" fill={LINE} />
      <circle cx="200" cy="330" r="16" fill={ACCENT} />
      <rect x="310" y="96" width="180" height="300" rx="30" fill={WHITE} stroke={LINE} strokeWidth="2" />
      <rect x="326" y="124" width="148" height="236" rx="14" fill={LIGHT} />
      <circle cx="400" cy="180" r="34" fill={GREEN} />
      <rect x="340" y="236" width="120" height="16" rx="8" fill={LINE} />
      <rect x="340" y="266" width="90" height="16" rx="8" fill={LINE} />
      <rect x="340" y="304" width="120" height="36" rx="10" fill={ACCENT} />
    </>
  );
}

/** A wireframe layout with a drawn curve and colour swatches. */
function Design() {
  return (
    <>
      <rect width="600" height="440" fill={LIGHT} />
      <rect x="70" y="60" width="460" height="290" rx="16" fill={WHITE} stroke={LINE} strokeWidth="2" />
      <rect x="70" y="60" width="460" height="46" rx="16" fill={NAVY} />
      <rect x="92" y="136" width="200" height="22" rx="8" fill={LINE} />
      <rect x="92" y="172" width="150" height="90" rx="12" fill={BLUE} opacity="0.85" />
      <rect x="262" y="172" width="150" height="90" rx="12" fill={LINE} />
      <rect x="92" y="278" width="320" height="22" rx="8" fill={LINE} />
      <path d="M 380 300 C 430 220, 470 330, 500 260" fill="none" stroke={ACCENT} strokeWidth="4" strokeLinecap="round" />
      <circle cx="380" cy="300" r="8" fill={WHITE} stroke={ACCENT} strokeWidth="3" />
      <circle cx="500" cy="260" r="8" fill={WHITE} stroke={ACCENT} strokeWidth="3" />
      <circle cx="120" cy="390" r="14" fill={BLUE} />
      <circle cx="160" cy="390" r="14" fill={ACCENT} />
      <circle cx="200" cy="390" r="14" fill={GREEN} />
      <circle cx="240" cy="390" r="14" fill={VIOLET} />
    </>
  );
}

/** Abstract figures standing together: a team. */
function People() {
  const colours = [BLUE, AMBER, GREEN, VIOLET, CORAL, SKY];
  return (
    <>
      <rect width="600" height="440" fill={NAVY} />
      {colours.map((c, i) => {
        const cx = 96 + i * 82;
        const top = i % 2 === 0 ? 170 : 200;
        return (
          <g key={i}>
            <circle cx={cx} cy={top} r="30" fill={c} />
            <rect x={cx - 50} y={top + 40} width="100" height={300 - top} rx="50" fill={c} opacity={i === 2 ? 1 : 0.8} />
          </g>
        );
      })}
      <rect x="40" y="350" width="520" height="2" fill={PANEL} />
    </>
  );
}

/** Office and city blocks with a sun. */
function Building() {
  const blocks: [number, number, number][] = [
    [70, 180, 120], [200, 130, 150], [340, 210, 110], [460, 150, 100],
  ];
  return (
    <>
      <rect width="600" height="440" fill={LIGHT} />
      <circle cx="470" cy="110" r="42" fill={AMBER} />
      {blocks.map(([x, w, h], bi) => {
        const top = 360 - h;
        const cols = Math.floor((w - 20) / 22);
        const rows = Math.floor((h - 30) / 26);
        return (
          <g key={bi}>
            <rect x={x} y={top} width={w} height={h} fill={bi % 2 ? PANEL : NAVY} />
            {Array.from({ length: rows }).map((_, r) =>
              Array.from({ length: cols }).map((_, c) => (
                <rect
                  key={`${r}-${c}`}
                  x={x + 12 + c * 22}
                  y={top + 14 + r * 26}
                  width="12"
                  height="14"
                  rx="2"
                  fill={(r + c + bi) % 4 === 0 ? AMBER : LINE}
                />
              )),
            )}
          </g>
        );
      })}
      <rect x="40" y="360" width="520" height="4" fill={NAVY} />
    </>
  );
}

/** A rising bar chart with a trend line. */
function Bars() {
  const heights = [80, 130, 110, 190, 250];
  const points: string[] = [];
  return (
    <>
      <rect width="600" height="440" fill={NAVY} />
      {heights.map((h, i) => {
        const x = 96 + i * 88;
        const y = 360 - h;
        points.push(`${x + 24},${y}`);
        return <rect key={i} x={x} y={y} width="48" height={h} rx="8" fill={i === heights.length - 1 ? ACCENT : PANEL} />;
      })}
      <polyline points={points.join(" ")} fill="none" stroke={SKY} strokeWidth="4" strokeLinejoin="round" />
      {points.map((p, i) => {
        const [x, y] = p.split(",").map(Number);
        return <circle key={i} cx={x} cy={y} r="7" fill={NAVY} stroke={SKY} strokeWidth="3" />;
      })}
      <rect x="60" y="360" width="480" height="2" fill={PANEL} />
    </>
  );
}

/** A campus building with a roof, columns and steps. */
function Campus() {
  return (
    <>
      <rect width="600" height="440" fill={LIGHT} />
      <polygon points="110,200 300,90 490,200" fill={NAVY} />
      {[150, 215, 280, 345, 410].map((x) => (
        <rect key={x} x={x} y="200" width="24" height="150" fill={LINE} />
      ))}
      <rect x="110" y="350" width="380" height="16" fill={NAVY} />
      <rect x="90" y="366" width="420" height="10" fill={PANEL} />
      <circle cx="300" cy="150" r="14" fill={AMBER} />
    </>
  );
}

const ART: Record<ArtKind, () => ReactElement> = {
  network: Network,
  code: Code,
  device: Device,
  design: Design,
  people: People,
  building: Building,
  bars: Bars,
  campus: Campus,
};

interface ArtworkProps {
  kind: ArtKind;
  /** Accessible description of what the artwork shows. */
  label: string;
  className?: string;
}

export function Artwork({ kind, label, className }: ArtworkProps) {
  const Art = ART[kind];
  return (
    <svg
      className={`${styles.art} ${className ?? ""}`}
      viewBox="0 0 600 440"
      role="img"
      aria-label={label}
      xmlns="http://www.w3.org/2000/svg"
    >
      <Art />
    </svg>
  );
}
