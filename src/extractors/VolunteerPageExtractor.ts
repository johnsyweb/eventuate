export class VolunteerPageExtractor {
  vols: number;
  agegroup: string;

  constructor(doc: Document) {
    const ageGroupData: string =
      doc.querySelector('#content > p:last-of-type')?.textContent ?? '';

    this.vols = Number(
      doc.querySelector('h3#volunteer-summary + table tfoot td:last-child')
        ?.textContent
    );

    this.agegroup =
      ageGroupData.trim().split(' ').slice(-1)[0] ?? 'Not found on page';
  }
}
