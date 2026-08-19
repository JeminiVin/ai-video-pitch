import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(req: Request) {
  try {
    const { url, headerText, subText } = await req.json();

    if (!url) {
      return NextResponse.json({ success: false, error: 'URL is required' }, { status: 400 });
    }

    const targetUrl = url.startsWith('http') ? url : `https://${url}`;

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });
    await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });

    const widgetTitle = headerText || 'Free Audit Widget';
    const widgetSub = subText || 'Analyze your site performance in 10 seconds.';

    // Inject dynamic, high-converting preview overlay onto target site
    await page.evaluate(({ widgetTitle, widgetSub }) => {
      const container = document.createElement('div');
      container.id = 'pitchpulse-overlay-root';
      container.innerHTML = `
        <div style="position: fixed; bottom: 24px; right: 24px; width: 320px; background: #0284c7; border: 2px solid #0369a1; border-radius: 18px; padding: 18px; font-family: system-ui, -apple-system, sans-serif; color: white; box-shadow: 0 20px 50px rgba(0,0,0,0.6); z-index: 999999;">
          <div style="font-size: 9px; font-weight: 900; color: #bae6fd; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px;">SPECIAL OFFER FOR YOU</div>
          <h4 style="margin: 0 0 6px 0; font-size: 16px; font-weight: 800; color: #ffffff;">${widgetTitle}</h4>
          <p style="margin: 0 0 14px 0; font-size: 11px; color: #e0f2fe; line-height: 1.4;">${widgetSub}</p>
          <button style="width: 100%; background: #a3e635; color: #020617; border: none; padding: 10px; border-radius: 10px; font-weight: 800; font-size: 12px; cursor: pointer;">
            Claim Audit Demo →
          </button>
        </div>
      `;
      document.body.appendChild(container);
    }, { widgetTitle, widgetSub });

    const screenshotBuffer = await page.screenshot({ type: 'png' });
    await browser.close();

    const mimeType = 'image/png';
    const base64String = Buffer.from(screenshotBuffer).toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64String}`;

    return NextResponse.json({ success: true, gif: dataUrl });
  } catch (error: any) {
    console.error('Render error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}