export function render(
  canvas: HTMLCanvasElement,
  matrix: number[][],
  ppd: number,
  fillColor: string,
  borderColor: string,
  backgroundColor: string
) {
  const size = matrix.length;
  let canvasSize = Math.ceil(size * Math.SQRT2);
  canvasSize += canvasSize % 2;
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

      ctx.fillRect(x * ppd, y * ppd, ppd, ppd);
      ctx.fillRect((size - x - 1) * ppd, y * ppd, ppd, ppd);
    }
  }
  return canvas;
}

function countNeighbors(pxgGrid: number[][], x: number, y: number) {
  return (
    (pxgGrid[y - 1]?.[x] || 0) +
    (pxgGrid[y + 1]?.[x] || 0) +
    (pxgGrid[y][x - 1] || 0) +
    (pxgGrid[y][x + 1] || 0)
  );
}
