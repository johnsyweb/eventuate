import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createReadStream, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawn } from 'node:child_process';
const DEFAULT_PORT = '4173';
// Must match baseurl in docs/_config.yml so that /eventuate/style.css etc. resolve.
const BASEURL = '/eventuate';
const DEFAULT_URL = `http://localhost:${DEFAULT_PORT}${BASEURL}/`;

const reportPath = path.resolve(process.cwd(), 'lighthouse-report.json');
const lighthouseUrl = process.env.LIGHTHOUSE_URL ?? DEFAULT_URL;
const lighthousePort = process.env.LIGHTHOUSE_PORT ?? DEFAULT_PORT;
const waitTimeoutMs = Number(process.env.LIGHTHOUSE_TIMEOUT_MS ?? '60000');
const siteDir = path.resolve(process.cwd(), 'docs', '_site');

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

const categories = ['performance', 'accessibility', 'best-practices', 'seo'];

/** Serves siteDir at BASEURL (e.g. /eventuate) so built HTML asset paths resolve. */
const createStaticServer = () => {
  return createServer(async (req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405);
      res.end();
      return;
    }
    const pathname = new URL(req.url ?? '/', `http://localhost`).pathname;
    if (!pathname.startsWith(BASEURL)) {
      res.writeHead(404);
      res.end();
      return;
    }
    const subPath = pathname.slice(BASEURL.length) || '/';
    const decoded = decodeURIComponent(subPath);
    if (decoded.includes('..')) {
      res.writeHead(403);
      res.end();
      return;
    }
    const filePath = path.join(siteDir, path.normalize(decoded));
    const resolved = path.resolve(filePath);
    if (!resolved.startsWith(siteDir)) {
      res.writeHead(403);
      res.end();
      return;
    }
    let stat: ReturnType<typeof statSync>;
    try {
      stat = statSync(resolved);
    } catch {
      res.writeHead(404);
      res.end();
      return;
    }
    if (stat.isDirectory()) {
      const indexPath = path.join(resolved, 'index.html');
      if (!existsSync(indexPath)) {
        res.writeHead(404);
        res.end();
        return;
      }
      res.setHeader('Content-Type', 'text/html');
      if (req.method === 'HEAD') {
        res.writeHead(200);
        res.end();
        return;
      }
      createReadStream(indexPath).pipe(res);
      return;
    }
    const ext = path.extname(resolved);
    const contentType = MIME_TYPES[ext] ?? 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    if (req.method === 'HEAD') {
      res.writeHead(200);
      res.end();
      return;
    }
    createReadStream(resolved).pipe(res);
  });
};

const runCommand = (command: string, args: string[]) =>
  new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} exited with code ${code}`));
      }
    });
  });

const waitForServer = async (url: string, timeoutMs: number) => {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url, { method: 'GET' });
      if (response.ok) {
        return;
      }
    } catch {
      // Ignore until the server is ready.
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for server at ${url}`);
};

const loadReport = async () => {
  const reportRaw = await readFile(reportPath, 'utf8');
  return JSON.parse(reportRaw) as {
    categories: Record<
      string,
      { score?: number; auditRefs?: { id: string }[] }
    >;
    audits: Record<
      string,
      {
        score?: number | null;
        title?: string;
        details?: { items?: Record<string, unknown>[] };
      }
    >;
  };
};

const getScores = (report: Awaited<ReturnType<typeof loadReport>>) => {
  const getScore = (key: string) => report.categories?.[key]?.score ?? 0;

  return {
    performance: getScore('performance'),
    accessibility: getScore('accessibility'),
    bestPractices: getScore('best-practices'),
    seo: getScore('seo'),
  };
};

const logScores = (scores: ReturnType<typeof getScores>) => {
  const asPercent = (value: number) => Math.round(value * 100);
  console.log('Lighthouse scores:');
  console.log(`- performance: ${asPercent(scores.performance)}`);
  console.log(`- accessibility: ${asPercent(scores.accessibility)}`);
  console.log(`- best-practices: ${asPercent(scores.bestPractices)}`);
  console.log(`- seo: ${asPercent(scores.seo)}`);
};

const logFailingAudits = (
  report: Awaited<ReturnType<typeof loadReport>>,
  categoryId: 'best-practices' | 'accessibility' | 'seo'
) => {
  const category = report.categories?.[categoryId];
  if (!category?.auditRefs) return;

  const failingAudits = category.auditRefs
    .map((ref) => ({ id: ref.id, audit: report.audits?.[ref.id] }))
    .filter((entry) => entry.audit && entry.audit.score !== null)
    .filter((entry) => (entry.audit?.score ?? 1) < 1);

  if (failingAudits.length === 0) return;

  console.log(`\nFailing ${categoryId} audits:`);
  for (const { id, audit } of failingAudits) {
    console.log(`- ${id}: ${audit?.title ?? 'Untitled'}`);
    const items = audit?.details?.items ?? [];
    for (const item of items) {
      const description = item.description as string | undefined;
      const sourceLocation = item.sourceLocation as
        | { url?: string; line?: number; column?: number }
        | undefined;
      const node = item.node as
        | { selector?: string; snippet?: string }
        | undefined;
      const url = (item.url as string | undefined) ?? '';
      const source = node?.selector || node?.snippet || url;
      if (description) {
        console.log(`  - ${description}`);
      }
      if (sourceLocation?.url) {
        const line = sourceLocation.line ?? 0;
        const column = sourceLocation.column ?? 0;
        console.log(`  - source: ${sourceLocation.url}:${line}:${column}`);
      }
      if (!description && source) {
        console.log(`  - ${source}`);
      }
    }
  }
};

const main = async () => {
  const server = createStaticServer();
  server.listen(Number(lighthousePort));

  try {
    await waitForServer(lighthouseUrl, waitTimeoutMs);

    await runCommand('lighthouse', [
      lighthouseUrl,
      '--preset=desktop',
      '--output=json',
      `--output-path=${reportPath}`,
      `--only-categories=${categories.join(',')}`,
      '--quiet',
      '--chrome-flags=--headless=new --no-sandbox',
    ]);

    const report = await loadReport();
    const scores = getScores(report);
    logScores(scores);

    const failedCategories = [
      scores.accessibility < 1 ? 'accessibility' : null,
      scores.bestPractices < 1 ? 'best-practices' : null,
      scores.seo < 1 ? 'seo' : null,
    ].filter(Boolean) as string[];

    if (failedCategories.length > 0) {
      for (const category of failedCategories) {
        if (
          category === 'best-practices' ||
          category === 'accessibility' ||
          category === 'seo'
        ) {
          logFailingAudits(
            report,
            category as 'best-practices' | 'accessibility' | 'seo'
          );
        }
      }
      throw new Error(
        `Lighthouse scores below 100: ${failedCategories.join(', ')}`
      );
    }
  } finally {
    server.close();
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
