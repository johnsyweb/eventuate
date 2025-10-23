#!/usr/bin/env ts-node

import puppeteer, { Browser } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

interface ScreenshotConfig {
  name: string;
  url: string;
  waitForSelector?: string;
  waitForTimeout?: number;
  viewport?: { width: number; height: number };
}

const screenshotConfigs: ScreenshotConfig[] = [
  {
    name: 'screenshot',
    url: 'https://www.parkrun.com.au/brimbank/results/latestresults/',
    waitForSelector: '#eventuate',
    waitForTimeout: 5000,
    viewport: { width: 1200, height: 800 },
  },
  {
    name: 'eventuate-results-summary',
    url: 'https://www.parkrun.com.au/brimbank/results/latestresults/',
    waitForSelector: '#eventuate',
    waitForTimeout: 5000,
    viewport: { width: 1200, height: 800 },
  },
  {
    name: 'eventuate-social-preview',
    url: 'https://www.parkrun.com.au/brimbank/results/latestresults/',
    waitForSelector: '#eventuate',
    waitForTimeout: 5000,
    viewport: { width: 1200, height: 800 },
  },
];

async function generateScreenshots(): Promise<void> {
  let browser: Browser | null = null;

  try {
    console.log('🚀 Starting screenshot generation...');
    const isCI =
      process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
    if (isCI) {
      console.log('📝 Running in CI mode (headless browser)');
    } else {
      console.log(
        '📝 Note: This script will open a browser window and inject the extension.'
      );
    }
    console.log(
      '📝 The script will navigate to the parkrun results page and take screenshots.'
    );

    // Launch browser
    console.log('🌐 Launching browser...');
    browser = await puppeteer.launch({
      headless: isCI ? true : false,
      args: [
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
      ],
      defaultViewport: null,
    });

    const page = await browser.newPage();

    for (const config of screenshotConfigs) {
      console.log(`📸 Capturing screenshot: ${config.name}`);

      // Set viewport if specified
      if (config.viewport) {
        await page.setViewport(config.viewport);
      }

      // Navigate to the parkrun results page
      console.log(`🌐 Navigating to ${config.url}...`);
      await page.goto(config.url, { waitUntil: 'networkidle2' });

      // Wait a bit for the page to fully load
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Inject the CSS styles first
      console.log('🎨 Injecting CSS styles...');
      try {
        const cssContent = fs.readFileSync(
          path.join(process.cwd(), 'style', 'eventuate.css'),
          'utf8'
        );
        await page.addStyleTag({ content: cssContent });
      } catch (error) {
        console.warn('⚠️  CSS injection failed, continuing...', error);
      }

      // Inject the bookmarklet script (designed to work in any context)
      console.log('💉 Injecting bookmarklet script...');
      const bookmarkletScript = fs.readFileSync(
        path.join(process.cwd(), 'dist', 'eventuate.bookmarklet.js'),
        'utf8'
      );

      try {
        await page.evaluate(bookmarkletScript);
      } catch (error) {
        console.warn(
          '⚠️  Bookmarklet script had an error, but continuing...',
          error
        );
      }

      // Wait for the extension to load and generate content
      if (config.waitForSelector) {
        try {
          await page.waitForSelector(config.waitForSelector, {
            timeout: 15000,
          });
        } catch {
          console.warn(
            `⚠️  Selector ${config.waitForSelector} not found, continuing...`
          );
        }
      }

      // Additional wait if specified
      if (config.waitForTimeout) {
        await new Promise((resolve) =>
          setTimeout(resolve, config.waitForTimeout)
        );
      }

      // Hide or remove third-party injected content (like iframes)
      console.log('🧹 Cleaning up third-party content...');
      await page.evaluate(() => {
        // Hide common third-party iframes and overlays
        const selectorsToHide = [
          'iframe[src*="close"]',
          'iframe[src*="message"]',
          'iframe[src*="popup"]',
          'iframe[src*="overlay"]',
          'iframe[src*="Close"]',
          'iframe[src*="Message"]',
          'iframe[title*="close"]',
          'iframe[title*="Close"]',
          'iframe[title*="message"]',
          'iframe[title*="Message"]',
          '.close-message',
          '.popup-overlay',
          '.third-party-iframe',
          '[id*="close"]',
          '[class*="close"]',
          '[id*="popup"]',
          '[class*="popup"]',
          '[id*="Close"]',
          '[class*="Close"]',
          '[id*="Message"]',
          '[class*="Message"]',
        ];

        let hiddenCount = 0;
        selectorsToHide.forEach((selector) => {
          const elements = document.querySelectorAll(selector);
          elements.forEach((element) => {
            (element as HTMLElement).style.display = 'none';
            hiddenCount++;
          });
        });

        // Also hide any iframes that might be positioned over the content
        const allIframes = document.querySelectorAll('iframe');
        allIframes.forEach((iframe) => {
          const rect = iframe.getBoundingClientRect();
          // Hide iframes that are positioned like overlays (small, positioned absolutely/fixed)
          if (rect.width < 400 && rect.height < 300) {
            (iframe as HTMLElement).style.display = 'none';
            hiddenCount++;
          }
        });

        console.log(`Hidden ${hiddenCount} third-party elements`);
      });

      // Take screenshot of just the eventuate div
      const eventuateElement = await page.$('#eventuate');
      if (eventuateElement) {
        const screenshotPath = path.join(
          process.cwd(),
          'assets',
          `${config.name}.png`
        );
        await eventuateElement.screenshot({
          path: screenshotPath as `${string}.png`,
        });

        console.log(`✅ Screenshot saved: ${screenshotPath}`);

        // Also save to docs/images if it's the results summary or social preview
        if (
          config.name === 'eventuate-results-summary' ||
          config.name === 'eventuate-social-preview'
        ) {
          const docsPath = path.join(
            process.cwd(),
            'docs',
            'images',
            `${config.name}.png`
          );
          await eventuateElement.screenshot({
            path: docsPath as `${string}.png`,
          });
          console.log(`✅ Docs screenshot saved: ${docsPath}`);
        }
      } else {
        console.warn(`⚠️  Eventuate div not found for ${config.name}`);
      }
    }

    console.log('🎉 All screenshots generated successfully!');
  } catch (error) {
    console.error('❌ Error generating screenshots:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the script
if (require.main === module) {
  generateScreenshots().catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}

export { generateScreenshots };
