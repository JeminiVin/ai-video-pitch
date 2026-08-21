import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';

// Vercel function timeout ko 60s tak extend karein
export const maxDuration = 60; 
export const dynamic = 'force-dynamic';

const CHROMIUM_PACK_URL = 'https://github.com/sparticuz/chromium/releases/download/v123.0.1/chromium-v123.0.1-pack.tar';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { targetUrl } = body;

    const isLocal = process.env.NODE_ENV === 'development';

    const executablePath = isLocal
      ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
      : await chromium.executablePath(CHROMIUM_PACK_URL);

    const browser = await puppeteer.launch({
      args: isLocal ? [] : [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: { width: 1280, height: 720 },
      executablePath,
      headless: true,
    });

    const page = await browser.newPage();

    // Fast loading ke liye domcontentloaded rely karein
    await page.goto(targetUrl || 'https://google.com', { 
      waitUntil: 'domcontentloaded', 
      timeout: 15000 
    });

    // Page screenshot buffer/base64 generate karein
    const screenshot = await page.screenshot({ encoding: 'base64', type: 'jpeg', quality: 80 });

    await browser.close();

    return Response.json({ success: true, screenshot: `data:image/jpeg;base64,${screenshot}` });

  } catch (error: any) {
    console.error("Puppeteer Error:", error);
    return Response.json({ error: error.message || "Failed to generate preview" }, { status: 500 });
  }
}