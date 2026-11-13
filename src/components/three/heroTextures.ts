import * as THREE from "three";

/**
 * Canvas-drawn textures for the hero phone screen and candidate cards.
 * Content and layout match the reference. Text uses the page's body font,
 * and the textures are redrawn once web fonts finish loading.
 */

type Ctx = CanvasRenderingContext2D;

function roundRect(x: Ctx, px: number, py: number, w: number, h: number, r: number) {
  x.beginPath();
  x.moveTo(px + r, py);
  x.lineTo(px + w - r, py);
  x.quadraticCurveTo(px + w, py, px + w, py + r);
  x.lineTo(px + w, py + h - r);
  x.quadraticCurveTo(px + w, py + h, px + w - r, py + h);
  x.lineTo(px + r, py + h);
  x.quadraticCurveTo(px, py + h, px, py + h - r);
  x.lineTo(px, py + r);
  x.quadraticCurveTo(px, py, px + r, py);
  x.closePath();
}

function bodyFont(): string {
  if (typeof document === "undefined") return "sans-serif";
  const ff = getComputedStyle(document.body).fontFamily;
  return ff || "sans-serif";
}

export interface DrawnTexture {
  texture: THREE.CanvasTexture;
  redraw(): void;
}

function drawn(w: number, h: number, paint: (x: Ctx, font: string) => void): DrawnTexture {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const x = c.getContext("2d");
  const texture = new THREE.CanvasTexture(c);
  texture.anisotropy = 4;
  const redraw = () => {
    if (!x) return;
    x.clearRect(0, 0, w, h);
    x.textAlign = "left";
    x.textBaseline = "alphabetic";
    paint(x, bodyFont());
    texture.needsUpdate = true;
  };
  redraw();
  return { texture, redraw };
}

const JOB_ROWS: Array<[color: string, role: string]> = [
  ["#5B8CFF", "Java Developer"],
  ["#2BD67B", "Sales Executive"],
  ["#FF5C8A", "HR Executive"],
  ["#F5A04A", "Delivery Partner"],
];

export function screenTexture(): DrawnTexture {
  return drawn(512, 1024, (x, font) => {
    x.fillStyle = "#F4F6F9";
    x.fillRect(0, 0, 512, 1024);
    x.fillStyle = "#14385C";
    x.fillRect(0, 0, 512, 200);
    x.fillStyle = "#FFFFFF";
    x.font = `bold 44px ${font}`;
    x.fillText("Open roles", 36, 118);
    x.fillStyle = "#B4C4D6";
    x.font = `26px ${font}`;
    x.fillText("Hyderabad · 24 new today", 36, 158);

    x.fillStyle = "#FFFFFF";
    roundRect(x, 36, 226, 440, 62, 16);
    x.fill();
    x.strokeStyle = "#D6DEE8";
    x.lineWidth = 2;
    x.stroke();
    x.fillStyle = "#8A9BB0";
    x.font = `26px ${font}`;
    x.fillText("Search jobs or skills", 62, 266);

    JOB_ROWS.forEach(([color, role], i) => {
      const y = 318 + i * 138;
      x.fillStyle = "#FFFFFF";
      roundRect(x, 36, y, 440, 118, 18);
      x.fill();
      x.strokeStyle = "#E3E9F0";
      x.lineWidth = 2;
      x.stroke();
      x.fillStyle = color;
      x.beginPath();
      x.arc(86, y + 59, 28, 0, Math.PI * 2);
      x.fill();
      x.fillStyle = "#0E2236";
      x.font = `bold 28px ${font}`;
      x.fillText(role, 130, y + 54);
      x.fillStyle = "#6B7C90";
      x.font = `22px ${font}`;
      x.fillText("Full time · Hyderabad", 130, y + 88);
    });

    x.fillStyle = "#E4780F";
    roundRect(x, 36, 896, 440, 78, 20);
    x.fill();
    x.fillStyle = "#1B1100";
    x.font = `bold 32px ${font}`;
    x.textAlign = "center";
    x.fillText("Apply now", 256, 946);
  });
}

export function cardTexture(role: string, color: string): DrawnTexture {
  return drawn(420, 230, (x, font) => {
    x.fillStyle = "#FFFFFF";
    roundRect(x, 6, 6, 408, 218, 28);
    x.fill();
    x.strokeStyle = "#D6DEE8";
    x.lineWidth = 3;
    x.stroke();

    // avatar
    x.fillStyle = color;
    x.beginPath();
    x.arc(76, 82, 42, 0, Math.PI * 2);
    x.fill();
    x.fillStyle = "#FFFFFF";
    x.beginPath();
    x.arc(76, 70, 14, 0, Math.PI * 2);
    x.fill();
    x.beginPath();
    x.arc(76, 112, 24, Math.PI, 0);
    x.fill();

    x.fillStyle = "#0E2236";
    x.font = `bold 30px ${font}`;
    x.fillText(role, 136, 78);
    x.fillStyle = "#6B7C90";
    x.font = `24px ${font}`;
    x.fillText("Shortlisted", 136, 112);

    x.fillStyle = "#DDF1E5";
    roundRect(x, 34, 150, 170, 46, 23);
    x.fill();
    x.fillStyle = "#0F6B3E";
    x.font = `bold 24px ${font}`;
    x.fillText("✓ Verified", 56, 182);
  });
}

export function glowTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 256;
  const x = c.getContext("2d");
  if (x) {
    const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, "rgba(245,160,74,0.55)");
    g.addColorStop(1, "rgba(245,160,74,0)");
    x.fillStyle = g;
    x.fillRect(0, 0, 256, 256);
  }
  return new THREE.CanvasTexture(c);
}
