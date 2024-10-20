export function upsertParagraph(
  div: HTMLElement,
  id: string,
  content: string,
): HTMLParagraphElement {
  const existingParagraph = Array.from(div.children).find(
    (element) => element.id === id,
  );

  if (existingParagraph) {
    existingParagraph.remove();
  }

  const paragraph = document.createElement("p");
  paragraph.id = id;
  paragraph.innerText = content;
  div.appendChild(paragraph);
  return paragraph;
}
