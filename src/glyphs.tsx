import React from "react";
import glyphs from "./data/glyphData";

function render(
  canvas: HTMLCanvasElement,
  matrix: number[][],
  ppd: number,
  fillColor: string,
  borderColor: string,
  backgroundColor: string
) {
  const size = matrix.length;
  let canvasSize = Math.ceil(size * Math.SQRT2); // Add margin for round icon.
  canvasSize += canvasSize % 2; // Make canvasSize even number.
  const margin = (canvasSize - size) / 2;
  canvas.width = canvasSize * ppd;
  canvas.height = canvasSize * ppd;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error();
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.translate(margin * ppd, margin * ppd);
  for (let y = 0; y < matrix.length; y++) {
    const row = matrix[y];
    for (let x = 0; x < row.length; x++) {
      if (row[x] == 1) {
        ctx.fillStyle = fillColor;
      } else if (countNeighbors(matrix, x, y) > 0) {
        ctx.fillStyle = borderColor;
      } else {
        continue;
      }

      ctx.fillRect(x * ppd, y * ppd, ppd, ppd); // left side
      ctx.fillRect((size - x - 1) * ppd, y * ppd, ppd, ppd); // right side (mirror)
    }
  }
}

function countNeighbors(matrix: number[][], x: number, y: number) {
  return (
    (matrix[y - 1]?.[x] || 0) +
    (matrix[y + 1]?.[x] || 0) +
    (matrix[y][x - 1] || 0) +
    (matrix[y][x + 1] || 0)
  );
}

export default function Glyphs() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useLayoutEffect(() => {
    let ids: any[] = [];
    function run() {
      for (let i = 0; i < glyphs.length; i++) {
        const [item, colors] = glyphs[i];

        ids.push(
          setTimeout(() => {
            if (!canvasRef.current) return;
            render(canvasRef.current, item, 8, ...colors);
            if (i === glyphs.length - 1) {
              run();
            }
          }, 350 * i + 1)
        );
      }
    }
    run();
    return () => {
      for (let i = 0; i < ids.length; i++) {
        clearTimeout(ids[i]);
      }
    };
  });

  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
}
