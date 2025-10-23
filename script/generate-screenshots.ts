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
];

async function generateScreenshots(): Promise<void> {
  let browser: Browser | null = null;

  try {
    console.log('🚀 Starting screenshot generation...');
    console.log(
      '📝 Note: This script will open a browser window and inject the extension.'
    );
    console.log(
      '📝 The script will navigate to the parkrun results page and take screenshots.'
    );

    // Launch browser
    console.log('🌐 Launching browser...');
    browser = await puppeteer.launch({
      headless: false,
      args: [
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
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

      // Inject the CSS styles first
      console.log('🎨 Injecting CSS styles...');
      const cssContent = fs.readFileSync(
        path.join(process.cwd(), 'style', 'eventuate.css'),
        'utf8'
      );
      await page.addStyleTag({ content: cssContent });

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

        // Also save to docs/images if it's the results summary
        if (config.name === 'eventuate-results-summary') {
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
