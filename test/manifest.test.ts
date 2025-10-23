import fs from 'fs';
import path from 'path';

describe('Manifest validation', () => {
  it('should have a description under 132 characters', () => {
    const manifestPath = path.join(__dirname, '../manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    expect(manifest.description).toBeDefined();
    expect(manifest.description.length).toBeLessThanOrEqual(132);
    expect(manifest.description.length).toBeGreaterThan(0);
  });

  it('should have all required manifest fields', () => {
    const manifestPath = path.join(__dirname, '../manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    expect(manifest.manifest_version).toBeDefined();
    expect(manifest.name).toBeDefined();
    expect(manifest.version).toBeDefined();
    expect(manifest.description).toBeDefined();
    expect(manifest.icons).toBeDefined();
    expect(manifest.content_scripts).toBeDefined();
  });

  it('should have valid content script configuration', () => {
    const manifestPath = path.join(__dirname, '../manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    expect(manifest.content_scripts).toHaveLength(1);
    expect(manifest.content_scripts[0].matches).toBeDefined();
    expect(manifest.content_scripts[0].js).toBeDefined();
    expect(manifest.content_scripts[0].css).toBeDefined();
    expect(manifest.content_scripts[0].run_at).toBe('document_end');
  });

  it('should have valid icon files', () => {
    const manifestPath = path.join(__dirname, '../manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    const icons = manifest.icons;
    expect(icons['24']).toBe('icons/eventuate-24.png');
    expect(icons['64']).toBe('icons/eventuate-64.png');
    expect(icons['128']).toBe('icons/eventuate-128.png');

    // Check that icon files exist
    const iconDir = path.join(__dirname, '../icons');
    expect(fs.existsSync(path.join(iconDir, 'eventuate-24.png'))).toBe(true);
    expect(fs.existsSync(path.join(iconDir, 'eventuate-64.png'))).toBe(true);
    expect(fs.existsSync(path.join(iconDir, 'eventuate-128.png'))).toBe(true);
  });
});
