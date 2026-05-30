/**
 * Render a single bayt as a gold-on-parchment card and trigger a download — the
 * "verse-as-image sharing" novelty. Pure Canvas 2D, no dependencies. Runs only
 * in the browser (guarded by callers via a click handler).
 */
type VerseCardOptions = {
  bayt: string;
  poet: string;
  title: string;
  /** Optional English line shown small beneath the Arabic. */
  sub?: string;
  /** Font family already loaded on the page (Amiri via CSS var fallback). */
  fontFamily?: string;
};

const W = 1200;
const H = 630; // OG-card proportions, nice for sharing

export function downloadVerseCard(opts: VerseCardOptions): void {
  const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, 2);
  const canvas = document.createElement('canvas');
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.scale(dpr, dpr);

  const font = opts.fontFamily || "'Amiri', serif";

  // Parchment ground.
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#f5f0e8');
  bg.addColorStop(1, '#e3d6bf');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Gold double border.
  ctx.strokeStyle = '#b8873a';
  ctx.lineWidth = 3;
  ctx.strokeRect(28, 28, W - 56, H - 56);
  ctx.strokeStyle = 'rgba(184,135,58,0.5)';
  ctx.lineWidth = 1;
  ctx.strokeRect(40, 40, W - 80, H - 80);

  // A small gold rosette at top.
  ctx.fillStyle = '#b8873a';
  ctx.font = `28px ${font}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('۞', W / 2, 92);

  // The bayt — wrapped to fit, RTL, ink.
  ctx.fillStyle = '#1a130a';
  ctx.direction = 'rtl';
  const maxWidth = W - 200;
  let size = 56;
  let lines = wrap(ctx, opts.bayt, maxWidth, size, font);
  // shrink until it fits within ~3 lines
  while (lines.length > 3 && size > 30) {
    size -= 4;
    lines = wrap(ctx, opts.bayt, maxWidth, size, font);
  }
  ctx.font = `${size}px ${font}`;
  const lineH = size * 1.7;
  const blockH = lines.length * lineH;
  let y = H / 2 - blockH / 2 + lineH / 2 - 10;
  for (const ln of lines) {
    ctx.fillText(ln, W / 2, y);
    y += lineH;
  }

  // Optional English sub-line.
  if (opts.sub) {
    ctx.direction = 'ltr';
    ctx.fillStyle = '#7a6455';
    ctx.font = `italic 24px Georgia, serif`;
    ctx.fillText(truncate(ctx, opts.sub, W - 220), W / 2, y + 8);
  }

  // Attribution footer.
  ctx.direction = 'rtl';
  ctx.fillStyle = '#6b2d3e';
  ctx.font = `30px ${font}`;
  ctx.fillText(opts.poet, W / 2, H - 96);
  ctx.fillStyle = '#7a6455';
  ctx.font = `20px ${font}`;
  ctx.fillText(opts.title, W / 2, H - 64);

  // Wordmark.
  ctx.fillStyle = 'rgba(184,135,58,0.85)';
  ctx.font = `22px ${font}`;
  ctx.fillText('مُعلّقات · الديوان الحيّ', W / 2, H - 36);

  const safe = (opts.poet || 'verse').replace(/[^\p{L}\p{N}-]+/gu, '-').slice(0, 40);
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `muallaqat-${safe}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, 'image/png');
}

function wrap(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  size: number,
  font: string,
): string[] {
  ctx.font = `${size}px ${font}`;
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function truncate(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let t = text;
  while (t.length > 4 && ctx.measureText(t + '…').width > maxWidth) t = t.slice(0, -1);
  return t + '…';
}
