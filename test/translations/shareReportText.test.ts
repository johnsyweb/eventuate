// Test the HTML sanitization logic in isolation
describe('HTML sanitization in shareReportText', () => {
  // Helper function to simulate the sanitization logic
  function sanitizeHtml(html: string): string {
    const div = document.createElement('div');
    div.innerHTML = html;

    const clone = div.cloneNode(true) as HTMLElement;
    const elementsToRemove = clone.querySelectorAll('*:not(br)');
    elementsToRemove.forEach((el) => {
      const parent = el.parentNode;
      if (parent) {
        while (el.firstChild) {
          parent.insertBefore(el.firstChild, el);
        }
        parent.removeChild(el);
      }
    });

    return clone.innerHTML.replace(/<br\s*\/?>/gi, '\n').trim();
  }

  it('should remove script tags while preserving text content', () => {
    const result = sanitizeHtml(
      'Welcome to <script>alert("xss")</script>parkrun'
    );
    expect(result).toBe('Welcome to alert("xss")parkrun');
  });

  it('should remove all HTML tags except br tags', () => {
    const result = sanitizeHtml(
      'Text with <strong>bold</strong> and <em>italic</em> content'
    );
    expect(result).toBe('Text with bold and italic content');
  });

  it('should preserve br tags and convert them to line breaks', () => {
    const result = sanitizeHtml('First line<br>Second line<br/>Third line');
    expect(result).toBe('First line\nSecond line\nThird line');
  });

  it('should handle nested HTML elements safely', () => {
    const result = sanitizeHtml(
      'Outer <div>Inner <span>Deep</span> text</div> content'
    );
    expect(result).toBe('Outer Inner Deep text content');
  });

  it('should handle malformed HTML tags safely', () => {
    const result = sanitizeHtml(
      'Text with <malformed tag and <another>malformed'
    );
    expect(result).toBe('Text with malformed');
  });

  it('should handle empty content', () => {
    const result = sanitizeHtml('');
    expect(result).toBe('');
  });

  it('should handle content with only whitespace', () => {
    const result = sanitizeHtml('   \n  \t  ');
    expect(result).toBe('');
  });

  it('should handle complex nested structures', () => {
    const result = sanitizeHtml(
      '<div><p>Paragraph <span>with <strong>nested</strong> tags</span></p></div>'
    );
    expect(result).toBe('Paragraph with nested tags');
  });

  it('should preserve multiple br tags correctly', () => {
    const result = sanitizeHtml('Line 1<br><br>Line 3<br/>Line 4');
    expect(result).toBe('Line 1\n\nLine 3\nLine 4');
  });
});
