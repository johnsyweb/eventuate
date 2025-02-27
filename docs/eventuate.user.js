// ==UserScript==
// @downloadURL  https://johnsy.com/eventuate/eventuate.user.js
// @updateURL    https://johnsy.com/eventuate/eventuate.user.js
// @name         Eventuate
// @namespace    https://johnsy.com/eventuate
// @version      1.2.1
// @description  Extracts information from parkrun results pages for inclusion in reports
// @author       Pete Johns
// @match        *://www.parkrun.com.au/*/results/latestresults/
// @match        *://www.parkrun.co.at/*/results/latestresults/
// @match        *://www.parkrun.ca/*/results/latestresults/
// @match        *://www.parkrun.dk/*/results/latestresults/
// @match        *://www.parkrun.fi/*/results/latestresults/
// @match        *://www.parkrun.fr/*/results/latestresults/
// @match        *://www.parkrun.com.de/*/results/latestresults/
// @match        *://www.parkrun.ie/*/results/latestresults/
// @match        *://www.parkrun.it/*/results/latestresults/
// @match        *://www.parkrun.jp/*/results/latestresults/
// @match        *://www.parkrun.lt/*/results/latestresults/
// @match        *://www.parkrun.my/*/results/latestresults/
// @match        *://www.parkrun.co.nl/*/results/latestresults/
// @match        *://www.parkrun.co.nz/*/results/latestresults/
// @match        *://www.parkrun.no/*/results/latestresults/
// @match        *://www.parkrun.pl/*/results/latestresults/
// @match        *://www.parkrun.sg/*/results/latestresults/
// @match        *://www.parkrun.co.za/*/results/latestresults/
// @match        *://www.parkrun.se/*/results/latestresults/
// @match        *://www.parkrun.org.uk/*/results/latestresults/
// @match        *://www.parkrun.us/*/results/latestresults/
// @grant        GM_addStyle
// ==/UserScript==

GM_addStyle(`
#eventuate::before {
  background-color: lightcoral;
  content: "\\26A0\\FE0F This information is drawn by Eventuate 1.2.1 from the results table to facilitate writing a report. It is not a report in itself. \\26A0\\FE0F";
  color: whitesmoke;
  font-weight: bold;
}

#eventuate {
  background: lightgoldenrodyellow;
  padding: 12px;
}

#eventuate #message {
  color: lightcoral;
  font-weight: bold;
}
`);

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 65:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResultsPageExtractor = void 0;
const Finisher_1 = __webpack_require__(768);
function athleteIDFromURI(uri) {
    return Number(uri?.split('/')?.slice(-1));
}
class ResultsPageExtractor {
    eventName;
    courseLength;
    eventDate;
    eventNumber;
    finishers;
    unknowns;
    newestParkrunners;
    firstTimers;
    finishersWithNewPBs;
    runningWalkingGroups;
    facts = { finishers: 0, finishes: 0, pbs: 0, volunteers: 0 };
    resultsPageDocument;
    constructor(resultsPageDocument) {
        this.resultsPageDocument = resultsPageDocument;
        this.eventName =
            resultsPageDocument.querySelector('.Results-header > h1')?.textContent ??
                undefined;
        this.courseLength = this.eventName?.includes('junior parkrun') ? 2 : 5;
        const rowElements = resultsPageDocument.querySelectorAll('.Results-table-row');
        this.finishers = Array.from(rowElements).map((d) => new Finisher_1.Finisher(this.removeSurnameFromJunior(d.dataset.name), d.dataset.agegroup, d.dataset.club, d.dataset.gender, d.dataset.position, d.dataset.runs, d.dataset.vols, d.dataset.agegrade, d.dataset.achievement, d.querySelector('.Results-table-td--time .compact')?.textContent ??
            undefined, athleteIDFromURI(d.querySelector('.Results-table-td--name a')
            ?.href)));
        this.populateVolunteerData();
        this.eventDate =
            resultsPageDocument.querySelector('.format-date')?.textContent ??
                undefined;
        this.eventNumber =
            resultsPageDocument.querySelector('.Results-header > h3 > span:last-child')?.textContent || undefined;
        this.unknowns = this.finishers
            .filter((p) => Number(p.runs) === 0)
            .map(() => 'Unknown');
        this.newestParkrunners = this.finishers
            .filter((p) => Number(p.runs) === 1)
            .map((p) => p.name);
        this.firstTimers = Array.from(rowElements)
            .filter((tr) => tr.querySelector('td.Results-table-td--ft') &&
            Number(tr.dataset.runs) > 1)
            .map((tr) => this.removeSurnameFromJunior(tr.dataset.name));
        this.finishersWithNewPBs = Array.from(rowElements)
            .filter((tr) => tr.querySelector('td.Results-table-td--pb'))
            .map((tr) => `${this.removeSurnameFromJunior(tr.dataset.name)} (${tr.querySelector('.Results-table-td--time .compact')?.textContent})`);
        this.runningWalkingGroups = Array.from(new Set(this.finishers.map((p) => p?.club || '').filter((c) => c !== '')));
        const [, finishers, finishes, volunteers, pbs, , ,] = Array.from(document.querySelectorAll('.aStat')).map((s) => s?.textContent?.replace(/^[^:]*:/, '').trim());
        this.facts.finishers = finishers ? Number(finishers) : 0;
        this.facts.finishes = finishes ? Number(finishes) : 0;
        this.facts.pbs = pbs ? Number(pbs) : 0;
        this.facts.volunteers = volunteers ? Number(volunteers) : 0;
    }
    volunteerElements() {
        return this.resultsPageDocument.querySelectorAll('.Results + div h3:first-of-type + p:first-of-type a');
    }
    removeSurnameFromJunior(name) {
        if (!name || this.courseLength == 5) {
            return name ?? '';
        }
        else {
            const parts = name.split(' ');
            if (parts.length === 2) {
                return parts[0];
            }
        }
        return name.replace(/[-' A-Z]+$/, '');
    }
    populateVolunteerData() {
        this.volunteerElements().forEach((v) => {
            const athleteID = athleteIDFromURI(v.href);
            v.dataset.athleteid ??= athleteID.toString();
            if (!v.dataset.vols || !v.dataset.agegroup) {
                const finisher = this.finishers.find((f) => f.athleteID === athleteID);
                if (finisher) {
                    v.dataset.vols = finisher?.vols?.toString();
                    v.dataset.agegroup = finisher?.agegroup;
                    v.dataset.vols_source = 'finisher';
                }
            }
        });
    }
    volunteersList() {
        return Array.from(this.volunteerElements()).map((v) => {
            return {
                name: this.removeSurnameFromJunior(v.text),
                link: v.href,
                athleteID: Number(v.dataset.athleteid),
                agegroup: v.dataset.agegroup,
                vols: Number(v.dataset.vols),
            };
        });
    }
}
exports.ResultsPageExtractor = ResultsPageExtractor;


/***/ }),

/***/ 97:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VolunteerPageExtractor = void 0;
class VolunteerPageExtractor {
    vols;
    agegroup;
    constructor(doc) {
        const ageGroupData = doc.querySelector('#content > p:last-of-type')?.textContent ?? '';
        this.vols = Number(doc.querySelector('h3#volunteer-summary + table tfoot td:last-child')
            ?.textContent);
        this.agegroup =
            ageGroupData.trim().split(' ').slice(-1)[0] ?? 'Not found on page';
    }
}
exports.VolunteerPageExtractor = VolunteerPageExtractor;


/***/ }),

/***/ 137:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fiveKVolunteersToMilestones = fiveKVolunteersToMilestones;
function fiveKVolunteersToMilestones(volunteers) {
    const milestones = {
        10: { icon: '&#x1F90D;', restricted_age: 'J' },
        25: { icon: '&#x1F49C;' },
        50: { icon: '&#x2764;' },
        100: { icon: '&#x1F5A4;' },
        250: { icon: '&#x1F49A;' },
        500: { icon: '&#x1F499;' },
        1000: { icon: '&#x1F49B;' },
    };
    const milestoneCelebrations = [];
    for (const n in milestones) {
        const milestone = milestones[n];
        const names = volunteers
            .filter((v) => v.vols === Number(n) &&
            (!milestone.restricted_age ||
                v.agegroup?.startsWith(milestone.restricted_age)))
            .map((v) => v.name);
        if (names.length > 0) {
            milestoneCelebrations.push({
                clubName: `v${n}`,
                icon: milestone.icon,
                names,
            });
        }
    }
    return milestoneCelebrations;
}


/***/ }),

/***/ 180:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VolunteerWithCount = void 0;
const VolunteerPageExtractor_1 = __webpack_require__(97);
class VolunteerWithCount {
    name;
    link;
    athleteID;
    vols;
    agegroup;
    volunteerDataSource;
    promisedVols;
    constructor(volunteer) {
        this.name = volunteer.name;
        this.link = volunteer.link;
        const url = new URL(volunteer.link);
        this.volunteerDataSource = new URL(url.pathname.split('/').slice(2).join('/'), url.origin);
        this.athleteID = volunteer.athleteID;
        this.vols = volunteer.vols ?? 0;
        this.agegroup = volunteer.agegroup ?? '';
        if (!this.vols) {
            this.promisedVols = this.fetchdata();
        }
    }
    fetchdata() {
        const cached = sessionStorage.getItem(this.athleteID.toString());
        if (cached) {
            const data = JSON.parse(cached);
            this.vols = Number(data.vols);
            this.agegroup = data.agegroup;
        }
        else {
            return fetch(this.volunteerDataSource)
                .then((r) => r.text())
                .then((doc) => this.volsFromHtml(doc));
        }
        return undefined;
    }
    volsFromHtml(html) {
        const vpe = new VolunteerPageExtractor_1.VolunteerPageExtractor(new DOMParser().parseFromString(html, 'text/html'));
        this.vols = vpe.vols;
        this.agegroup = vpe.agegroup;
        sessionStorage.setItem(this.athleteID.toString(), JSON.stringify(vpe));
        return vpe;
    }
}
exports.VolunteerWithCount = VolunteerWithCount;


/***/ }),

/***/ 196:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MilestonePresenter = void 0;
const stringFunctions_1 = __webpack_require__(846);
class MilestonePresenter {
    _milestoneCelebrations;
    _milestoneCelebrationsAll;
    constructor(milestoneCelebrations) {
        this._milestoneCelebrations = milestoneCelebrations;
        this._milestoneCelebrationsAll = this._milestoneCelebrations.flatMap((mc) => mc.names);
    }
    title() {
        return `Three cheers to the ${(0, stringFunctions_1.pluralize)('parkrunner', 'parkrunners', this._milestoneCelebrationsAll.length)} who joined a new parkrun milestone club this weekend:<br>`;
    }
    details() {
        return this._milestoneCelebrations
            .map((mc) => `${mc.icon} ${(0, stringFunctions_1.sortAndConjoin)(mc.names)} joined the ${mc.clubName}-club`)
            .join('<br>');
    }
}
exports.MilestonePresenter = MilestonePresenter;


/***/ }),

/***/ 267:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.twoKVolunteersToMilestones = twoKVolunteersToMilestones;
function twoKVolunteersToMilestones(volunteers) {
    const names = volunteers
        .filter((v) => v.vols === 5 && v.agegroup?.startsWith('J'))
        .map((v) => v.name);
    return names.length
        ? [
            {
                clubName: 'junior parkrun v5',
                icon: '&#x1F49E;',
                names,
            },
        ]
        : [];
}


/***/ }),

/***/ 597:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fiveKFinishersToMilestones = fiveKFinishersToMilestones;
function fiveKFinishersToMilestones(finishers) {
    const milestones = {
        10: { icon: '&#x26AA;', restricted_age: 'J' }, // white circle
        25: { icon: '&#x1F7E3;' }, // purple circle
        50: { icon: '&#x1F534;' }, // red circle
        100: { icon: '&#x26AB;' }, // black circle
        250: { icon: '&#x1F7E2;' }, // green circle
        500: { icon: '&#x1F535;' }, // blue circle
        1000: { icon: '&#x1F7E1;' }, // yellow circle
    };
    const milestoneCelebrations = [];
    for (const n in milestones) {
        const milestone = milestones[n];
        const names = finishers
            .filter((f) => Number(f.runs) === Number(n) &&
            (!milestone.restricted_age ||
                f.agegroup?.startsWith(milestone.restricted_age)))
            .map((f) => f.name);
        if (names.length > 0) {
            milestoneCelebrations.push({
                clubName: n,
                icon: milestone.icon,
                names,
            });
        }
    }
    return milestoneCelebrations;
}


/***/ }),

/***/ 768:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Finisher = void 0;
class Finisher {
    name;
    agegroup;
    club;
    gender;
    position;
    runs;
    vols;
    agegrade;
    achievement;
    time;
    athleteID;
    constructor(name, agegroup, club, gender, position, runs, vols, agegrade, achievement, time, athleteID) {
        this.name = name ?? 'a parkrunner';
        this.agegroup = agegroup;
        this.club = club;
        this.gender = gender;
        this.position = position;
        this.runs = runs ?? '0';
        this.vols = vols;
        this.agegrade = agegrade;
        this.achievement = achievement;
        this.time = time;
        this.athleteID = athleteID;
    }
    isUnknown() {
        return this.runs === '0';
    }
}
exports.Finisher = Finisher;


/***/ }),

/***/ 846:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.pluralize = pluralize;
exports.conjoin = conjoin;
exports.alphabetize = alphabetize;
exports.sortAndConjoin = sortAndConjoin;
function pluralize(singular, plural, count) {
    return count === 1 ? singular : `${count} ${plural}`;
}
function conjoin(elements) {
    return elements.length > 1
        ? `${elements.slice(0, -1).join(', ')} and ${elements.slice(-1)}`
        : elements[0];
}
function alphabetize(names) {
    return names.sort((a, b) => a.localeCompare(b));
}
function sortAndConjoin(names) {
    return conjoin(alphabetize(names));
}


/***/ }),

/***/ 900:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.upsertParagraph = upsertParagraph;
exports.deleteParagraph = deleteParagraph;
function upsertParagraph(div, id, content) {
    const existingParagraph = Array.from(div.children).find((element) => element.id === id);
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
function deleteParagraph(div, id) {
    const existingParagraph = Array.from(div.children).find((element) => element.id === id);
    if (existingParagraph) {
        existingParagraph.remove();
    }
}


/***/ }),

/***/ 932:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.twoKFinishersToMilestones = twoKFinishersToMilestones;
function twoKFinishersToMilestones(finishers) {
    const milestones = {
        11: { icon: '&#x1F7E6;', restricted_age: 'J', name: 'Half marathon' },
        21: { icon: '&#x1F7E9;', restricted_age: 'J', name: 'Marathon' },
        50: { icon: '&#x1F7E7;', restricted_age: 'J', name: 'Ultra marathon' },
        100: { icon: '&#x2B1C;', restricted_age: 'J', name: 'junior parkrun 100' },
        250: { icon: '&#x1F7E8;', restricted_age: 'J', name: 'junior parkrun 250' },
    };
    const milestoneCelebrations = [];
    for (const n in milestones) {
        const milestone = milestones[n];
        const names = finishers
            .filter((f) => Number(f.runs) === Number(n) &&
            (!milestone.restricted_age ||
                f.agegroup?.startsWith(milestone.restricted_age)))
            .map((f) => f.name);
        if (names.length > 0) {
            milestoneCelebrations.push({
                clubName: milestone.name,
                icon: milestone.icon,
                names,
            });
        }
    }
    return milestoneCelebrations;
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it uses a non-standard name for the exports (exports).
(() => {
var exports = __webpack_exports__;
var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
const stringFunctions_1 = __webpack_require__(846);
const upsertParagraph_1 = __webpack_require__(900);
const fiveKFinishersToMilestones_1 = __webpack_require__(597);
const fiveKVolunteersToMilestones_1 = __webpack_require__(137);
const MilestonePresenter_1 = __webpack_require__(196);
const ResultsPageExtractor_1 = __webpack_require__(65);
const twoKFinishersToMilestone_1 = __webpack_require__(932);
const twoKVolunteersToMilestones_1 = __webpack_require__(267);
const Volunteer_1 = __webpack_require__(180);
function populate(rpe, volunteerWithCountList, message) {
    const introduction = `On parkrunday, ${rpe.finishers.length} parkrunners joined us for event ${rpe.eventNumber} and completed the ${rpe.courseLength}km ${rpe.eventName} course`;
    const newestParkrunnersTitle = `Kudos to our ${(0, stringFunctions_1.pluralize)('newest parkrunner', 'newest parkrunners', rpe.newestParkrunners.length)}: `;
    const firstTimersTitle = `Welcome to the ${(0, stringFunctions_1.pluralize)('parkrunner', 'parkrunners', rpe.firstTimers.length)} who joined us at ${rpe.eventName ?? 'parkrun'} for the first time: `;
    const finishersWithNewPBsTitle = `Very well done to the ${(0, stringFunctions_1.pluralize)('parkrunner', 'parkrunners', rpe.finishersWithNewPBs.length)} who improved their personal best this week: `;
    const runningWalkingGroupsTitle = `We were pleased to see ${(0, stringFunctions_1.pluralize)('at least one active group', 'walking and running groups', rpe.runningWalkingGroups.length)} represented at this event: `;
    const volunteerOccasions = volunteerWithCountList
        .map((v) => v.vols)
        .reduce((c, p) => c + p, 0);
    const volunteersTitle = `The following ${volunteerWithCountList.length.toLocaleString()} superstars have volunteered a total of ${volunteerOccasions.toLocaleString()} times between them, and helped us host ${rpe.eventName} this weekend. Our deep thanks to:  `;
    const finisherMilestoneCelebrations = rpe.courseLength == 2
        ? [
            ...(0, twoKVolunteersToMilestones_1.twoKVolunteersToMilestones)(volunteerWithCountList),
            ...(0, twoKFinishersToMilestone_1.twoKFinishersToMilestones)(rpe.finishers),
        ]
        : (0, fiveKFinishersToMilestones_1.fiveKFinishersToMilestones)(rpe.finishers);
    const milestoneCelebrations = [
        ...(0, fiveKVolunteersToMilestones_1.fiveKVolunteersToMilestones)(volunteerWithCountList),
        ...finisherMilestoneCelebrations,
    ];
    const milestonePresenter = new MilestonePresenter_1.MilestonePresenter(milestoneCelebrations);
    const facts = `Since ${rpe.eventName} started ` +
        `${rpe.facts?.finishers?.toLocaleString()} brilliant parkrunners have had their barcodes scanned, ` +
        `and a grand total of ${rpe.facts.finishes.toLocaleString()} finishers ` +
        `have covered a total distance of ${(rpe.facts.finishes * rpe.courseLength).toLocaleString()}km, ` +
        `while celebrating ${rpe.facts.pbs.toLocaleString()} personal bests. ` +
        `We shall always be grateful to each of our ${rpe.facts.volunteers.toLocaleString()} wonderful volunteers for their contributions`;
    const eventuateDiv = document.getElementById('eventuate') ||
        document.createElement('div');
    eventuateDiv.id = 'eventuate';
    const reportDetails = {
        message: { title: '&#x23f3;', details: message },
        introduction: { title: '', details: introduction },
        milestoneCelebrations: {
            title: milestonePresenter.title(),
            details: milestonePresenter.details(),
        },
        newestParkrunners: {
            title: newestParkrunnersTitle,
            details: (0, stringFunctions_1.sortAndConjoin)(rpe.newestParkrunners),
        },
        firstTimers: {
            title: firstTimersTitle,
            details: (0, stringFunctions_1.sortAndConjoin)(rpe.firstTimers),
        },
        newPBs: {
            title: finishersWithNewPBsTitle,
            details: (0, stringFunctions_1.sortAndConjoin)(rpe.finishersWithNewPBs),
        },
        groups: {
            title: runningWalkingGroupsTitle,
            details: (0, stringFunctions_1.sortAndConjoin)(rpe.runningWalkingGroups),
        },
        volunteers: {
            title: volunteersTitle,
            details: (0, stringFunctions_1.sortAndConjoin)(volunteerWithCountList.map((v) => v.name)),
        },
        unknowns: {
            title: '',
            details: rpe.unknowns.length > 0
                ? `Please don't forget to bring a scannable copy of your barcode with you to ${rpe.eventName} if you'd like to have your time recorded`
                : undefined,
        },
        facts: {
            title: '',
            details: facts,
        },
    };
    const insertionPoint = document.querySelector('.Results-header');
    if (insertionPoint) {
        insertionPoint.insertAdjacentElement('afterend', eventuateDiv);
        for (const [section, content] of Object.entries(reportDetails)) {
            if (content.details) {
                const paragraphText = `${content.title} ${content.details}.`;
                (0, upsertParagraph_1.upsertParagraph)(eventuateDiv, section, paragraphText);
            }
            else {
                (0, upsertParagraph_1.deleteParagraph)(eventuateDiv, section);
            }
        }
    }
}
function eventuate() {
    const rpe = new ResultsPageExtractor_1.ResultsPageExtractor(document);
    const volunteerWithCountList = rpe
        .volunteersList()
        .map((vol) => new Volunteer_1.VolunteerWithCount(vol));
    const waitingOn = volunteerWithCountList
        .map((v) => v.promisedVols)
        .filter((v) => !!v);
    const loadingMessage = `Loading volunteer data for ${waitingOn.length} parkrunners. Please wait`;
    populate(rpe, volunteerWithCountList, loadingMessage);
    Promise.all(waitingOn).then(() => populate(rpe, volunteerWithCountList));
}
eventuate();

})();

/******/ })()
;