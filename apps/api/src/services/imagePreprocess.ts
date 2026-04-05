import sharp from "sharp";

export async function preprocessImage(buffer: Buffer): Promise<Buffer> {
  return sharp(buffer)
    .normalize()
    .sharpen({ sigma: 1.5 })
    .grayscale()
    .jpeg({ quality: 90 })
    .toBuffer();
}
