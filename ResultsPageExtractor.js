export class ResultsPageExtractor {
  constructor (resultsPageDocument) {
    this.document = resultsPageDocument
    this.eventName = this.document.querySelector('.Results-header > h1').textContent

    this.courseLength = this.eventName.includes('junior parkrun') ? 2 : 5
    this.eventDate = this.document.querySelector('.format-date').textContent
    this.eventNumber = this.document.querySelector(
      '.Results-header > h3 > span:last-child'
    ).textContent

    const data = Array.from(document.querySelectorAll('.Results-table-row'))
    const times = Array.from(document.querySelectorAll('.Results-table-row > .Results-table-td--time .compact'))
    this.finishers = data.map((d, i) => { return { time: times[i].innerText, ...d.dataset } })

    this.unknowns = this.finishers
      .filter((p) => Number(p.runs) === 0)
      .map((p) => p.name)

    this.newestParkrunners = this.finishers
      .filter((p) => Number(p.runs) === 1)
      .map((p) => p.name)

    this.firstTimers = this.finishers
      .filter((p) => p.achievement === 'First Timer!' && p.runs > 1)
      .map((p) => p.name)

    this.finishersWithNewPBs = this.finishers
      .filter((p) => p.achievement === 'New PB!')
      .map((p) => `${p.name} (${p.time})`)

    this.runningWalkingGroups = Array.from(
      new Set(this.finishers.map((p) => p.club).filter(Boolean))
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
