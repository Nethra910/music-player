const DEFAULT_THEME = { primary: "#22c55e", dark: "#052e16" };

/**
 * Extracts a dominant color from an image.
 * Falls back to default green if image is CORS-blocked or fails.
 */
export async function extractDominantColor(imageUrl) {
  try {
    const img = new Image();
    img.crossOrigin = "anonymous"; // needed for canvas readback
    img.src = imageUrl;

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      setTimeout(reject, 5000); // timeout guard
    });

    const canvas = document.createElement("canvas");
    const size = 24; // tiny = fast
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, size, size);

    const { data } = ctx.getImageData(0, 0, size, size);

    // Average pixels, boosted saturation
    let r = 0,
      g = 0,
      b = 0,
      count = 0;
    for (let i = 0; i < data.length; i += 4) {
      // skip near-white near-black pixels for a punchier color
      const [pr, pg, pb] = [data[i], data[i + 1], data[i + 2]];
      const brightness = (pr + pg + pb) / 3;
      if (brightness < 30 || brightness > 225) continue;
      r += pr;
      g += pg;
      b += pb;
      count++;
    }
    if (!count) return DEFAULT_THEME;

    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);

    return {
      primary: `rgb(r,{r},r,{g}, ${b})`,
      dark: `rgb(Math.round(r∗0.15),{Math.round(r * 0.15)},Math.round(r∗0.15),{Math.round(g * 0.15)}, ${Math.round(b * 0.15)})`,
    };
  } catch {
    return DEFAULT_THEME; // CORS or load failure — safe fallback
  }
}
