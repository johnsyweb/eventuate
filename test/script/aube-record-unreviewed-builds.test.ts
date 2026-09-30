import { execFileSync } from 'child_process';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const SCRIPT = join(
  __dirname,
  '..',
  '..',
  'script',
  'lib',
  'aube-record-unreviewed-builds'
);

const FAILURE_LOG = `Updating all dependencies...
Wrote aube-lock.yaml
  × dependencies with build scripts must be reviewed before install:
  │   - @parcel/watcher@2.6.0
  │ help: add the package(s) to \`allowBuilds\` with \`true\`/\`false\`
`;

/** Mimic GitHub-hosted runners that lack ripgrep on PATH. */
const CI_LIKE_ENV = {
  ...process.env,
  PATH: '/usr/bin:/bin',
};

describe('aube-record-unreviewed-builds', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'aube-record-builds-'));
  });

  afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
  });

  it('records unreviewed packages as denied allowBuilds entries', () => {
    const workspace = join(dir, 'aube-workspace.yaml');
    const log = join(dir, 'aube.log');
    writeFileSync(
      workspace,
      `paranoid: true

allowBuilds:
  esbuild: true

# Jail comment stays with the next top-level key.
jailBuildPermissions:
  puppeteer:
    network: true
`
    );
    writeFileSync(log, FAILURE_LOG);

    execFileSync('bash', [SCRIPT, log, workspace], {
      encoding: 'utf8',
      env: CI_LIKE_ENV,
    });

    const updated = readFileSync(workspace, 'utf8');
    expect(updated).toContain("'@parcel/watcher': false");
    expect(updated.indexOf("'@parcel/watcher': false")).toBeLessThan(
      updated.indexOf('# Jail comment stays with the next top-level key.')
    );
    expect(updated.indexOf("'@parcel/watcher': false")).toBeLessThan(
      updated.indexOf('jailBuildPermissions:')
    );
  });

  it('is a no-op when the package is already listed', () => {
    const workspace = join(dir, 'aube-workspace.yaml');
    const log = join(dir, 'aube.log');
    writeFileSync(
      workspace,
      `paranoid: true

allowBuilds:
  esbuild: true
  '@parcel/watcher': false

jailBuildPermissions:
  puppeteer:
    network: true
`
    );
    writeFileSync(log, FAILURE_LOG);

    const output = execFileSync('bash', [SCRIPT, log, workspace], {
      encoding: 'utf8',
      env: CI_LIKE_ENV,
    });

    expect(output).toContain('allowBuilds already lists @parcel/watcher');
    expect(
      readFileSync(workspace, 'utf8').match(/@parcel\/watcher/g)
    ).toHaveLength(1);
  });
});
