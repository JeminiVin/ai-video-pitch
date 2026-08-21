import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export async function POST(req: Request) {
  try {
    const isLocal = process.env.NODE_ENV === 'development';

    const browser = await puppeteer.launch({
      args: isLocal ? [] : chromium.args,
      defaultViewport: { width: 1280, height: 720 },
      executablePath: isLocal
        ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
        : await chromium.executablePath(),
      headless: true,
    });

    const page = await browser.newPage();
    // ... baki apka logic ...

    await browser.close();
    
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}