export class ResultsPageExtractor {
  constructor (resultsPageDocument) {
    this.document = resultsPageDocument
    this.eventName = this.document.querySelector('.Results-header > h1').textContent

    this.courseLength = this.eventName.includes('junior parkrun') ? 2 : 5
    this.eventDate = this.document.querySelector('.format-date').textContent
    this.eventNumber = this.document.querySelector(
      '.Results-header > h3 > span:last-child'
    ).textContent

    this.finishers = Array.from(document.querySelectorAll('.Results-table-row'))

    this.unknowns = this.finishers
      .filter((p) => Number(p.dataset.runs) === 0)
      .map((p) => p.dataset.name)

    this.newestParkrunners = this.finishers
      .filter((p) => Number(p.dataset.runs) === 1)
      .map((p) => p.dataset.name)

    this.firstTimers = this.finishers
      .filter((p) => p.dataset.achievement === 'First Timer!' && p.dataset.runs > 1)
      .map((p) => p.dataset.name)

    this.finishersWithNewPBs = this.finishers
      .filter((p) => p.dataset.achievement === 'New PB!')
      .map((p) => {
        const name = p.dataset.name
        const timeElement = p.querySelector(
          '.Results-table-td--pb .compact'
        ).textContent
        return `${name} (${timeElement})`
      })

    this.runningWalkingGroups = Array.from(
      new Set(this.finishers.map((p) => p.dataset.club).filter(Boolean))
    )

    this.volunteersExtract = this.document
      .querySelector('.Results')
      .nextElementSibling.querySelector('p').innerText

    this.volunteersList = this.volunteersExtract
      .split(':')[1]
      .split(',')
      .map((name) => name.trim())

    this.facts = Array.from(document.querySelectorAll('.aStat'))
      .map((e) => e.textContent.trim().split(':'))
      .reduce((acc, [k, v]) => {
        acc[k.toLocaleLowerCase()] = Number(v.trim())
        return acc
      }, {})
  }
}
