/**
 * @jest-environment jsdom
 */

import {
  upsertParagraph,
  deleteParagraph,
} from '../../src/dom/upsertParagraph';

describe('upsertParagraph', () => {
  let div: HTMLDivElement;

  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(() => {
    document.body.removeChild(div);
  });

  it('creates a new paragraph when one does not exist', () => {
    const paragraph = upsertParagraph(div, 'test-id', 'Test content');

    expect(paragraph.id).toBe('test-id');
    expect(paragraph.innerHTML).toBe('Test content');
    expect(div.children.length).toBe(1);
  });

  it('handles html entities in content', () => {
    const paragraph = upsertParagraph(div, 'test-id', 'Test &amp; content');

    expect(paragraph.innerHTML).toBe('Test &amp; content');
    expect(div.children.length).toBe(1);
  });

  it('handles breaks in content', () => {
    const paragraph = upsertParagraph(div, 'test-id', 'Test <br/> content');

    expect(div.children.length).toBe(1);
    expect(paragraph.innerHTML).toBe('Test <br> content');
  });
  it('replaces existing paragraph with same id', () => {
    upsertParagraph(div, 'test-id', 'Original content');
    const paragraph = upsertParagraph(div, 'test-id', 'New content');

    expect(paragraph.innerHTML).toBe('New content');
    expect(div.children.length).toBe(1);
  });

  it('keeps other paragraphs intact', () => {
    upsertParagraph(div, 'test-id-1', 'Content 1');
    upsertParagraph(div, 'test-id-2', 'Content 2');

    expect(div.children.length).toBe(2);
  });
});

describe('deleteParagraph', () => {
  let div: HTMLDivElement;

  beforeEach(() => {
    div = document.createElement('div');
    document.body.appendChild(div);
  });

  afterEach(() => {
    document.body.removeChild(div);
  });

  it('removes paragraph with matching id', () => {
    upsertParagraph(div, 'test-id', 'Test content');
    deleteParagraph(div, 'test-id');

    expect(div.children.length).toBe(0);
  });

  it('does nothing when paragraph does not exist', () => {
    deleteParagraph(div, 'nonexistent-id');
    expect(div.children.length).toBe(0);
  });
});
