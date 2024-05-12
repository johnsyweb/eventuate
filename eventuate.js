function upsertParagraph (div, id, content) {
  const existingParagraph = Array.from(div.children).find(
    (element) => element.id === id
  )

  if (existingParagraph) {
    existingParagraph.remove()
  }

  const paragraph = document.createElement('p')
  paragraph.id = id
  paragraph.innerText = content
  div.appendChild(paragraph)
}

function conjoin (elements) {
  return elements.length > 1
    ? `${elements.slice(0, -1).join(', ')} and ${elements.slice(-1)}`
    : elements[0]
}

const alphabetize = (names) => names.sort((a, b) => a.localeCompare(b))
const sortAndConjoin = (names) => conjoin(alphabetize(names))
const pluralize = (noun, nouns, collection) =>
  collection.length === 1 ? noun : nouns

const eventName = document.querySelector('.Results-header > h1').textContent
const courseLength = eventName.includes('junior parkrun') ? 2 : 5
const eventDate = document.querySelector('.format-date').textContent
const eventNumber = document.querySelector(
  '.Results-header > h3 > span:last-child'
).textContent

const finishers = Array.from(document.querySelectorAll('.Results-table-row'))
const introduction = `${finishers.length} parkrunners joined us on ${eventDate} for event ${eventNumber} and completed the ${courseLength}km ${eventName} course.`

const unknowns = finishers
  .filter((p) => Number(p.dataset.runs) === 0)
  .map((p) => p.dataset.name)

const newestParkrunners = finishers
  .filter((p) => Number(p.dataset.runs) === 1)
  .map((p) => p.dataset.name)
const newestParkrunnersTitle = `Congratulations to our ${
  newestParkrunners.length
} newest ${pluralize('parkrunner', 'parkrunners', newestParkrunners)}`

const firstTimers = finishers
  .filter((p) => p.dataset.achievement === 'First Timer!' && p.dataset.runs > 1)
  .map((p) => p.dataset.name)
const firstTimersTitle = `Welcome to the ${firstTimers.length} ${pluralize(
  'parkrunner',
  'parkrunners',
  firstTimers
)} who joined us at ${eventName} for the first time`

const finishersWithNewPBs = finishers
  .filter((p) => p.dataset.achievement === 'New PB!')
  .map((p) => {
    const name = p.dataset.name
    const timeElement = p.querySelector(
      '.Results-table-td--pb .compact'
    ).textContent
    return `${name} (${timeElement})`
  })
const finishersWithNewPBsTitle = `Very well done to the ${
  finishersWithNewPBs.length
} ${pluralize(
  'parkrunner',
  'parkrunners',
  finishersWithNewPBs
)} who improved their personal best this week`

const runningWalkingGroups = Array.from(
  new Set(finishers.map((p) => p.dataset.club).filter(Boolean))
)
const runningWalkingGroupsTitle = `We were pleased to see ${
  runningWalkingGroups.length
} ${pluralize(
  'active group',
  'walking and running groups',
  runningWalkingGroups
)} represented at this event`

const volunteersExtract = document
  .querySelector('.Results')
  .nextElementSibling.querySelector('p').innerText
const volunteersList = volunteersExtract
  .split(':')[1]
  .split(',')
  .map((name) => name.trim())
const volunteersTitle = `${eventName} are very grateful to the ${volunteersList.length} amazing volunteers who made this event happen`

const reportDetails = {
  newestParkrunners: {
    title: newestParkrunnersTitle,
    details: sortAndConjoin(newestParkrunners)
  },
  firstTimers: {
    title: firstTimersTitle,
    details: sortAndConjoin(firstTimers)
  },
  newPBs: {
    title: finishersWithNewPBsTitle,
    details: sortAndConjoin(finishersWithNewPBs)
  },
  groups: {
    title: runningWalkingGroupsTitle,
    details: sortAndConjoin(runningWalkingGroups)
  },
  volunteers: {
    title: volunteersTitle,
    details: sortAndConjoin(volunteersList)
  }
}

const facts = Array.from(document.querySelectorAll('.aStat'))
  .map((e) => e.textContent.trim().split(':'))
  .reduce((acc, [k, v]) => {
    acc[k.toLocaleLowerCase()] = Number(v.trim())
    return acc
  }, {})

const eventuateDiv =
  document.getElementById('eventuate') || document.createElement('div')
eventuateDiv.id = 'eventuate'
const insertionPoint = document.querySelector('.Results-header')
insertionPoint.insertAdjacentElement('afterend', eventuateDiv)

upsertParagraph(eventuateDiv, 'introduction', introduction)

for (const [section, content] of Object.entries(reportDetails)) {
  if (content.details) {
    const paragraphText = `${content.title}: ${content.details}.`
    upsertParagraph(eventuateDiv, section, paragraphText)
  }
}

if (unknowns.length > 0) {
  upsertParagraph(
    eventuateDiv,
    'unknowns',
    `Please don't forget to bring a scannable copy of your barcode with you to ${eventName} if you'd like to have your time recorded.`
  )
}

upsertParagraph(
  eventuateDiv,
  'facts',
  `Since ${eventName} started ` +
    `${facts.finishers.toLocaleString()} brilliant parkrunners have had their barcodes scanned, ` +
    `and a grand total of ${facts.finishes.toLocaleString()} finishers` +
    `have covered a total distance of ${(
      facts.finishes * courseLength
    ).toLocaleString()}km,` +
    `while celebrating ${facts.pbs.toLocaleString()} personal bests. ` +
    `We shall always be grateful to each of our ${facts.volunteers.toLocaleString()} wonderful volunteers for their contributions.`
)
