export function upsertParagraph(
  div: HTMLElement,
  id: string,
  content: string
): HTMLParagraphElement {
  const existingParagraph = Array.from(div.children).find(
    (element) => element.id === id
  );

  if (existingParagraph) {
    existingParagraph.remove();
  }

  const paragraph = document.createElement('p');
  paragraph.id = id;
  div.appendChild(paragraph);
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, 'text/html');
  for (const node of doc.body.childNodes) {
    paragraph.appendChild(node.cloneNode(true));
  }
  return paragraph;
}

export function deleteParagraph(div: HTMLElement, id: string) {
  const existingParagraph = Array.from(div.children).find(
    (element) => element.id === id
  );

  if (existingParagraph) {
    existingParagraph.remove();
  }
}
