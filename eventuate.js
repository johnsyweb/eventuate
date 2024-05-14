import { ResultsPageExtractor } from './ResultsPageExtractor.js'

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

const rpe = new ResultsPageExtractor(document)

const introduction = `${rpe.finishers.length} parkrunners joined us on ${rpe.eventDate} for event ${rpe.eventNumber} and completed the ${rpe.courseLength}km ${rpe.eventName} course.`
const newestParkrunnersTitle = `Congratulations to our ${rpe.newestParkrunners.length
  } newest ${pluralize('parkrunner', 'parkrunners', rpe.newestParkrunners)}`

const firstTimersTitle = `Welcome to the ${rpe.firstTimers.length} ${pluralize(
  'parkrunner',
  'parkrunners',
  rpe.firstTimers
)} who joined us at ${rpe.eventName} for the first time`

const finishersWithNewPBsTitle = `Very well done to the ${rpe.finishersWithNewPBs.length
  } ${pluralize(
    'parkrunner',
    'parkrunners',
    rpe.finishersWithNewPBs
  )} who improved their personal best this week`

const runningWalkingGroupsTitle = `We were pleased to see ${rpe.runningWalkingGroups.length
  } ${pluralize(
    'active group',
    'walking and running groups',
    rpe.runningWalkingGroups
  )} represented at this event`

const volunteersTitle = `${rpe.eventName} are very grateful to the ${rpe.volunteersList.length} amazing volunteers who made this event happen`

const reportDetails = {
  newestParkrunners: {
    title: newestParkrunnersTitle,
    details: sortAndConjoin(rpe.newestParkrunners)
  },
  firstTimers: {
    title: firstTimersTitle,
    details: sortAndConjoin(rpe.firstTimers)
  },
  newPBs: {
    title: finishersWithNewPBsTitle,
    details: sortAndConjoin(rpe.finishersWithNewPBs)
  },
  groups: {
    title: runningWalkingGroupsTitle,
    details: sortAndConjoin(rpe.runningWalkingGroups)
  },
  volunteers: {
    title: volunteersTitle,
    details: sortAndConjoin(rpe.volunteersList)
  }
}

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

if (rpe.unknowns.length > 0) {
  upsertParagraph(
    eventuateDiv,
    'unknowns',
    `Please don't forget to bring a scannable copy of your barcode with you to ${rpe.eventName} if you'd like to have your time recorded.`
  )
}

upsertParagraph(
  eventuateDiv,
  'facts',
  `Since ${rpe.eventName} started ` +
  `${rpe.facts.finishers.toLocaleString()} brilliant parkrunners have had their barcodes scanned, ` +
  `and a grand total of ${rpe.facts.finishes.toLocaleString()} finishers` +
  `have covered a total distance of ${(
    rpe.facts.finishes * rpe.courseLength
  ).toLocaleString()}km,` +
  `while celebrating ${rpe.facts.pbs.toLocaleString()} personal bests. ` +
  `We shall always be grateful to each of our ${rpe.facts.volunteers.toLocaleString()} wonderful volunteers for their contributions.`
)
