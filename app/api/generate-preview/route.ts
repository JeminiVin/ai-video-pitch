import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min';

// Remote Chromium tarball URL for Vercel
const CHROMIUM_PACK_URL = 'https://github.com/sparticuz/chromium/releases/download/v123.0.1/chromium-v123.0.1-pack.tar';

export async function POST(req: Request) {
  try {
    const isLocal = process.env.NODE_ENV === 'development';

    const executablePath = isLocal
      ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
      : await chromium.executablePath(CHROMIUM_PACK_URL);

    const browser = await puppeteer.launch({
      args: isLocal ? [] : chromium.args,
      defaultViewport: { width: 1280, height: 720 },
      executablePath,
      headless: true,
    });

    const page = await browser.newPage();
    
    // ... aapka screenshot/scraping ka existing code ...

    await browser.close();

    // ... return response ...

  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}