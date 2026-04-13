// ==UserScript==
// @name         Eventuate
// @description  Extracts information from parkrun results pages for inclusion in reports. Supports English and German languages with automatic browser locale detection.
// @author       Pete Johns (@johnsyweb)
// @downloadURL  https://www.johnsy.com/eventuate/eventuate.user.js
// @grant        GM_addStyle
// @grant        GM.addStyle
// @homepage     https://www.johnsy.com/eventuate/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=parkrun.com.au
// @license      MIT
// @match        *://www.parkrun.ca/*/results/*
// @match        *://www.parkrun.co.at/*/results/*
// @match        *://www.parkrun.co.nl/*/results/*
// @match        *://www.parkrun.co.nz/*/results/*
// @match        *://www.parkrun.co.za/*/results/*
// @match        *://www.parkrun.com.au/*/results/*
// @match        *://www.parkrun.com.de/*/results/*
// @match        *://www.parkrun.dk/*/results/*
// @match        *://www.parkrun.fi/*/results/*
// @match        *://www.parkrun.fr/*/results/*
// @match        *://www.parkrun.ie/*/results/*
// @match        *://www.parkrun.it/*/results/*
// @match        *://www.parkrun.jp/*/results/*
// @match        *://www.parkrun.lt/*/results/*
// @match        *://www.parkrun.my/*/results/*
// @match        *://www.parkrun.no/*/results/*
// @match        *://www.parkrun.org.uk/*/results/*
// @match        *://www.parkrun.pl/*/results/*
// @match        *://www.parkrun.se/*/results/*
// @match        *://www.parkrun.sg/*/results/*
// @match        *://www.parkrun.us/*/results/*
// @namespace    https://www.johnsy.com/eventuate
// @run-at       document-end
// @tag          parkrun
// @supportURL   https://github.com/johnsyweb/eventuate/issues
// @updateURL    https://www.johnsy.com/eventuate/eventuate.user.js
// @version      1.15.2
// ==/UserScript==

// Polyfill for cross-compatibility between Userscripts and Tampermonkey
const addStyle = (css) => {
  if (typeof GM !== 'undefined' && GM.addStyle) {
    // Userscripts
    return GM.addStyle(css);
  } else if (typeof GM_addStyle !== 'undefined') {
    // Tampermonkey
    return GM_addStyle(css);
  } else {
    // Fallback for environments without GM APIs
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    return style;
  }
};

addStyle(`
#eventuate::before {
  background-color: lightcoral;
  content: "\\26A0\\FE0F This information is drawn by Eventuate 1.15.2 from the results table to facilitate writing a report. It is not a report in itself. \\26A0\\FE0F";
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

/***/ 831
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCurrentHref = getCurrentHref;
function getCurrentHref() {
    return typeof window !== 'undefined' ? window.location.href : '';
}


/***/ },

/***/ 133
(__unused_webpack_module, exports) {


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


/***/ },

/***/ 692
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResultsPageExtractor = void 0;
const Finisher_1 = __webpack_require__(751);
function athleteIDFromURI(uri) {
    return Number(uri?.split('/')?.slice(-1));
}
class ResultsPageExtractor {
    eventName;
    courseLength;
    eventNumber;
    finishers;
    unknowns;
    newestParkrunners;
    firstTimersWithFinishCounts;
    finishersWithNewPBs;
    runningWalkingGroups;
    facts;
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
        this.eventNumber =
            resultsPageDocument.querySelector('.Results-header > h3 > span:last-child')?.textContent || undefined;
        this.unknowns = this.finishers
            .filter((p) => Number(p.runs) === 0)
            .map(() => 'Unknown');
        this.newestParkrunners = this.finishers
            .filter((p) => Number(p.runs) === 1)
            .map((p) => p.name);
        this.firstTimersWithFinishCounts = Array.from(rowElements)
            .filter((tr) => tr.querySelector('td.Results-table-td--ft') &&
            Number(tr.dataset.runs) > 1)
            .map((tr) => ({
            name: this.removeSurnameFromJunior(tr.dataset.name),
            finishes: Number(tr.dataset.runs),
        }));
        this.finishersWithNewPBs = Array.from(rowElements)
            .filter((tr) => tr.querySelector('td.Results-table-td--pb'))
            .map((tr) => `${this.removeSurnameFromJunior(tr.dataset.name)} (${tr.querySelector('.Results-table-td--time .compact')?.textContent})`);
        this.runningWalkingGroups = Array.from(new Set(this.finishers.map((p) => p?.club || '').filter((c) => c !== '')));
        const [, finishers, finishes, volunteers, pbs, , ,] = Array.from(resultsPageDocument.querySelectorAll('.aStat .num')).map((s) => this.parseNumericString(s.textContent?.trim()));
        this.facts = { finishers, finishes, volunteers, pbs };
    }
    isLaunchEvent() {
        const normalizedEventNumber = this.eventNumber?.trim().replace('#', '');
        return normalizedEventNumber === '1';
    }
    volunteerElements() {
        return this.resultsPageDocument.querySelectorAll('.Volunteers-table-row');
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
    volunteersList() {
        return Array.from(this.volunteerElements()).map((row) => {
            return {
                name: this.removeSurnameFromJunior(row.dataset.name),
                vols: Number(row.dataset.volunteercredits),
                vClub: this.volunteerClubFromRow(row),
            };
        });
    }
    volunteerClubFromRow(row) {
        const anchor = row.querySelector('a.Results-table--clubIcon[class*="milestone-v"]');
        const text = anchor?.textContent?.trim() ?? '';
        const match = text?.match(/^v(\d+)$/);
        return match ? Number(match[1]) : undefined;
    }
    parseNumericString(value) {
        if (!value) {
            return NaN;
        }
        return parseInt(value.replace(/[^0-9]/g, ''), 10);
    }
}
exports.ResultsPageExtractor = ResultsPageExtractor;


/***/ },

/***/ 686
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClosingPresenter = void 0;
const translations_1 = __webpack_require__(682);
class ClosingPresenter {
    _courseLength;
    constructor(courseLength) {
        this._courseLength = courseLength;
    }
    title() {
        return '';
    }
    details() {
        const t = (0, translations_1.getTranslations)();
        return (0, translations_1.interpolate)(t.closing, {
            courseLength: this._courseLength,
        });
    }
}
exports.ClosingPresenter = ClosingPresenter;


/***/ },

/***/ 870
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FactsPresenter = void 0;
const translations_1 = __webpack_require__(682);
class FactsPresenter {
    _eventName;
    _courseLength;
    _facts;
    _isLaunchEvent;
    constructor(eventName, courseLength, facts, isLaunchEvent) {
        this._eventName = eventName;
        this._courseLength = courseLength;
        this._facts = facts;
        this._isLaunchEvent = isLaunchEvent;
    }
    details() {
        // Don't show facts for launch events
        if (this._isLaunchEvent) {
            return undefined;
        }
        const t = (0, translations_1.getTranslations)();
        return [
            (0, translations_1.interpolate)(t.facts.sinceStarted, {
                eventName: this._eventName || t.fallbackParkrunName,
            }),
            (0, translations_1.interpolate)(t.facts.brilliantParkrunners, {
                count: this._facts.finishers?.toLocaleString() || '0',
            }),
            (0, translations_1.interpolate)(t.facts.grandTotal, {
                count: this._facts.finishes?.toLocaleString() || '0',
            }),
            (0, translations_1.interpolate)(t.facts.coveredDistance, {
                distance: ((this._facts.finishes || 0) * this._courseLength).toLocaleString(),
            }),
            (0, translations_1.interpolate)(t.facts.celebratingPBs, {
                count: this._facts.pbs?.toLocaleString() || '0',
            }),
            (0, translations_1.interpolate)(t.facts.gratefulToVolunteers, {
                count: this._facts.volunteers?.toLocaleString() || '0',
            }),
        ].join('');
    }
    title() {
        return '';
    }
}
exports.FactsPresenter = FactsPresenter;


/***/ },

/***/ 871
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FirstTimeVolunteersPresenter = void 0;
const stringFunctions_1 = __webpack_require__(731);
const translations_1 = __webpack_require__(682);
class FirstTimeVolunteersPresenter {
    _firstTimeVolunteers;
    _eventName;
    constructor(volunteers, eventName) {
        this._firstTimeVolunteers = volunteers.filter((v) => v.vols === 1);
        this._eventName = eventName;
    }
    title() {
        const t = (0, translations_1.getTranslations)();
        const count = this._firstTimeVolunteers.length;
        const countText = t.parkrunnerSingularArticle && t.parkrunnerPluralArticle
            ? (0, translations_1.formatCountWithArticle)(count, t.parkrunner, t.parkrunners, t.parkrunnerSingularArticle, t.parkrunnerPluralArticle)
            : (0, translations_1.formatCount)(count, t.parkrunner, t.parkrunners);
        return (0, translations_1.interpolate)(t.firstTimeVolunteersTitle, {
            count: countText,
        });
    }
    details() {
        if (!this.hasData()) {
            return undefined;
        }
        return (0, stringFunctions_1.sortAndConjoin)(this._firstTimeVolunteers.map((v) => v.name));
    }
    hasData() {
        return this._firstTimeVolunteers.length > 0;
    }
    hasFirstTimeVolunteers() {
        return this.hasData();
    }
}
exports.FirstTimeVolunteersPresenter = FirstTimeVolunteersPresenter;


/***/ },

/***/ 532
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FirstTimersLaunchEventPresenter = void 0;
const stringFunctions_1 = __webpack_require__(731);
const translations_1 = __webpack_require__(682);
const FirstTimersPresenter_1 = __webpack_require__(163);
class FirstTimersLaunchEventPresenter extends FirstTimersPresenter_1.FirstTimersPresenter {
    details() {
        const t = (0, translations_1.getTranslations)();
        // Format names with finish counts in parentheses
        const namesWithCounts = this.getSortedFirstTimers().map((ft) => `${ft.name} (${ft.finishes})`);
        const namesText = (0, stringFunctions_1.sortAndConjoin)(namesWithCounts);
        // Calculate total finishes
        const totalFinishes = this._firstTimers.reduce((sum, ft) => sum + ft.finishes, 0);
        const closingMessage = (0, translations_1.interpolate)(t.firstTimersLaunchEventClosing, {
            total: totalFinishes.toLocaleString(),
        });
        return `${namesText}. ${closingMessage}`;
    }
}
exports.FirstTimersLaunchEventPresenter = FirstTimersLaunchEventPresenter;


/***/ },

/***/ 163
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FirstTimersPresenter = void 0;
const stringFunctions_1 = __webpack_require__(731);
const translations_1 = __webpack_require__(682);
class FirstTimersPresenter {
    _firstTimers;
    _eventName;
    constructor(firstTimers, eventName) {
        this._firstTimers = firstTimers;
        this._eventName = eventName;
    }
    title() {
        const t = (0, translations_1.getTranslations)();
        return (0, translations_1.interpolate)(t.firstTimersTitle, {
            count: (0, translations_1.formatCount)(this._firstTimers.length, t.parkrunner, t.parkrunners),
            eventName: this._eventName || t.fallbackParkrunName,
        });
    }
    details() {
        if (!this.hasData()) {
            return undefined;
        }
        return (0, stringFunctions_1.sortAndConjoin)(this.getFirstTimerNames());
    }
    hasData() {
        return this._firstTimers.length > 0;
    }
    getFirstTimerNames() {
        return this._firstTimers.map((firstTimer) => firstTimer.name);
    }
    getSortedFirstTimers() {
        return [...this._firstTimers].sort((a, b) => a.name.localeCompare(b.name));
    }
}
exports.FirstTimersPresenter = FirstTimersPresenter;


/***/ },

/***/ 436
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FullResultsPresenter = void 0;
const translations_1 = __webpack_require__(682);
const urlFunctions_1 = __webpack_require__(179);
class FullResultsPresenter {
    _eventName;
    _eventNumber;
    _currentUrl;
    constructor(eventName, eventNumber, currentUrl) {
        this._eventName = eventName;
        this._eventNumber = eventNumber;
        this._currentUrl = currentUrl;
    }
    title() {
        return '';
    }
    details() {
        const t = (0, translations_1.getTranslations)();
        return (0, translations_1.interpolate)(t.fullResults, {
            eventName: this._eventName || t.fallbackParkrunName,
            eventNumber: this._eventNumber || '',
            url: (0, urlFunctions_1.canonicalResultsPageUrl)(this._eventNumber ?? 'latestresults', this._currentUrl),
        });
    }
}
exports.FullResultsPresenter = FullResultsPresenter;


/***/ },

/***/ 95
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GroupsPresenter = void 0;
const stringFunctions_1 = __webpack_require__(731);
const translations_1 = __webpack_require__(682);
class GroupsPresenter {
    _runningWalkingGroups;
    constructor(runningWalkingGroups) {
        this._runningWalkingGroups = runningWalkingGroups;
    }
    title() {
        const t = (0, translations_1.getTranslations)();
        return (0, translations_1.interpolate)(t.runningWalkingGroupsTitle, {
            count: (0, translations_1.formatCount)(this._runningWalkingGroups.length, t.activeGroup, t.walkingAndRunningGroups),
        });
    }
    details() {
        if (!this.hasData()) {
            return undefined;
        }
        return (0, stringFunctions_1.sortAndConjoin)(this._runningWalkingGroups);
    }
    hasData() {
        return this._runningWalkingGroups.length > 0;
    }
}
exports.GroupsPresenter = GroupsPresenter;


/***/ },

/***/ 251
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IntroductionPresenter = void 0;
const translations_1 = __webpack_require__(682);
class IntroductionPresenter {
    _finisherCount;
    _volunteerCount;
    _eventName;
    _eventNumber;
    constructor(finisherCount, volunteerCount, eventName, eventNumber) {
        this._finisherCount = finisherCount;
        this._volunteerCount = volunteerCount;
        this._eventName = eventName;
        this._eventNumber = eventNumber;
    }
    title() {
        return '';
    }
    details() {
        const t = (0, translations_1.getTranslations)();
        return (0, translations_1.interpolate)(t.introduction, {
            finisherCount: (0, translations_1.formatCount)(this._finisherCount, t.finisher, t.finishers),
            volunteerCount: (0, translations_1.formatCount)(this._volunteerCount, t.volunteer, t.volunteers),
            eventName: this._eventName || t.fallbackParkrunName,
            eventNumber: this._eventNumber || '',
        });
    }
}
exports.IntroductionPresenter = IntroductionPresenter;


/***/ },

/***/ 707
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JuniorSupervisionPresenter = void 0;
const translations_1 = __webpack_require__(682);
const ARM_REACH_SECONDS = 15;
function timeToSeconds(timeStr) {
    if (!timeStr) {
        return null;
    }
    const parts = timeStr.split(':').map((p) => parseInt(p, 10));
    if (parts.some(isNaN) || (parts.length !== 2 && parts.length !== 3)) {
        return null;
    }
    const [hours = 0, minutes, seconds] = parts.length === 2 ? [0, ...parts] : parts;
    return hours * 3600 + minutes * 60 + seconds;
}
function isUnder11(agegroup) {
    if (!agegroup) {
        return false;
    }
    return agegroup === 'JM10' || agegroup === 'JW10';
}
function isAdult18Plus(agegroup) {
    return !!(agegroup?.startsWith('S') || agegroup?.startsWith('V'));
}
function findNearestAdult(child, allFinishers) {
    const childTime = timeToSeconds(child.time);
    if (childTime === null) {
        return null;
    }
    const adults = allFinishers.filter((f) => isAdult18Plus(f.agegroup) && timeToSeconds(f.time) !== null);
    if (adults.length === 0) {
        return null;
    }
    let nearest = null;
    let minDelta = Infinity;
    for (const adult of adults) {
        const adultTime = timeToSeconds(adult.time);
        if (adultTime === null) {
            continue;
        }
        const delta = Math.abs(adultTime - childTime);
        if (delta < minDelta) {
            minDelta = delta;
            nearest = { finisher: adult, timeDelta: delta };
        }
    }
    return nearest;
}
class JuniorSupervisionPresenter {
    _extractor;
    _hasSupervisionIssue;
    _childCheckResults;
    constructor(extractor) {
        this._extractor = extractor;
        const result = this.checkSupervision();
        this._hasSupervisionIssue = result.hasIssue;
        this._childCheckResults = result.checkResults;
    }
    checkSupervision() {
        if (this._extractor.courseLength !== 5) {
            return { hasIssue: false, checkResults: [] };
        }
        const children = this._extractor.finishers.filter((f) => isUnder11(f.agegroup));
        if (children.length === 0) {
            return { hasIssue: false, checkResults: [] };
        }
        const checkResults = children.map((child) => ({
            child,
            nearest: findNearestAdult(child, this._extractor.finishers),
        }));
        const hasIssue = checkResults.some((result) => {
            if (!result.nearest) {
                return true;
            }
            return result.nearest.timeDelta > ARM_REACH_SECONDS;
        });
        if (hasIssue) {
            this.logDiagnostics(checkResults);
        }
        return { hasIssue, checkResults };
    }
    getSearchString() {
        return typeof window !== 'undefined' ? window.location.search : '';
    }
    logDiagnostics(checkResults) {
        const urlParams = new URLSearchParams(this.getSearchString());
        const shouldLog = urlParams.has('debug-juniors') || urlParams.has('log-juniors');
        if (!shouldLog) {
            return;
        }
        for (const result of checkResults) {
            if (result.nearest) {
                console.log('Junior supervision check:', {
                    child: {
                        name: result.child.name,
                        agegroup: result.child.agegroup,
                        time: result.child.time,
                        position: result.child.position,
                    },
                    nearestAdult: {
                        name: result.nearest.finisher.name,
                        agegroup: result.nearest.finisher.agegroup,
                        time: result.nearest.finisher.time,
                        position: result.nearest.finisher.position,
                    },
                    timeDeltaSeconds: result.nearest.timeDelta,
                });
            }
            else {
                console.log('Junior supervision check:', {
                    child: {
                        name: result.child.name,
                        agegroup: result.child.agegroup,
                        time: result.child.time,
                        position: result.child.position,
                    },
                    nearestAdult: null,
                    timeDeltaSeconds: null,
                });
            }
        }
    }
    details() {
        if (!this.hasData()) {
            return undefined;
        }
        const t = (0, translations_1.getTranslations)();
        return (0, translations_1.interpolate)(t.juniorSupervisionReminder, {
            eventName: this._extractor.eventName || t.fallbackParkrunName,
        });
    }
    hasData() {
        return this._hasSupervisionIssue;
    }
    hasSupervisionIssue() {
        return this.hasData();
    }
    title() {
        return '';
    }
}
exports.JuniorSupervisionPresenter = JuniorSupervisionPresenter;


/***/ },

/***/ 893
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MilestonePresenter = void 0;
const stringFunctions_1 = __webpack_require__(731);
const translations_1 = __webpack_require__(682);
class MilestonePresenter {
    _milestoneCelebrations;
    _milestoneCelebrationsAll;
    constructor(milestoneCelebrations) {
        this._milestoneCelebrations = milestoneCelebrations;
        this._milestoneCelebrationsAll = this._milestoneCelebrations.flatMap((mc) => mc.names);
    }
    title() {
        const t = (0, translations_1.getTranslations)();
        const count = this._milestoneCelebrationsAll.length;
        const countText = (0, translations_1.formatCount)(count, t.parkrunner, t.parkrunners);
        return (0, translations_1.interpolate)(t.milestoneCelebrations.title, {
            count: countText,
        });
    }
    details() {
        if (!this.hasData()) {
            return undefined;
        }
        const t = (0, translations_1.getTranslations)();
        return this._milestoneCelebrations
            .map((mc) => {
            const clubName = t.milestoneClubs[mc.clubName] || mc.clubName;
            return `${mc.icon} ${(0, translations_1.interpolate)(t.milestoneCelebrations.joinedClub, {
                names: (0, stringFunctions_1.sortAndConjoin)(mc.names),
                clubName: clubName,
            })}`;
        })
            .join('<br>');
    }
    hasData() {
        return this._milestoneCelebrations.length > 0;
    }
}
exports.MilestonePresenter = MilestonePresenter;


/***/ },

/***/ 44
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NewPBsPresenter = void 0;
const stringFunctions_1 = __webpack_require__(731);
const translations_1 = __webpack_require__(682);
class NewPBsPresenter {
    _finishersWithNewPBs;
    _eventName;
    constructor(finishersWithNewPBs, eventName) {
        this._finishersWithNewPBs = finishersWithNewPBs;
        this._eventName = eventName;
    }
    title() {
        const t = (0, translations_1.getTranslations)();
        return (0, translations_1.interpolate)(t.finishersWithNewPBsTitle, {
            eventName: this._eventName || t.fallbackParkrunName,
            count: (0, translations_1.formatCount)(this._finishersWithNewPBs.length, t.parkrunner, t.parkrunners),
        });
    }
    details() {
        if (!this.hasData()) {
            return undefined;
        }
        return (0, stringFunctions_1.sortAndConjoin)(this._finishersWithNewPBs);
    }
    hasData() {
        return this._finishersWithNewPBs.length > 0;
    }
}
exports.NewPBsPresenter = NewPBsPresenter;


/***/ },

/***/ 680
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NewestParkrunnersPresenter = void 0;
const stringFunctions_1 = __webpack_require__(731);
const translations_1 = __webpack_require__(682);
class NewestParkrunnersPresenter {
    _newestParkrunners;
    constructor(newestParkrunners) {
        this._newestParkrunners = newestParkrunners;
    }
    title() {
        const t = (0, translations_1.getTranslations)();
        return (0, translations_1.interpolate)(t.newestParkrunnersTitle, {
            count: (0, translations_1.formatCount)(this._newestParkrunners.length, t.parkrunner, t.parkrunners),
        });
    }
    details() {
        if (!this.hasData()) {
            return undefined;
        }
        return (0, stringFunctions_1.sortAndConjoin)(this._newestParkrunners);
    }
    hasData() {
        return this._newestParkrunners.length > 0;
    }
}
exports.NewestParkrunnersPresenter = NewestParkrunnersPresenter;


/***/ },

/***/ 854
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UnknownsPresenter = void 0;
const translations_1 = __webpack_require__(682);
class UnknownsPresenter {
    _unknowns;
    _eventName;
    constructor(unknowns, eventName) {
        this._unknowns = unknowns;
        this._eventName = eventName;
    }
    title() {
        return '';
    }
    details() {
        if (!this.hasData()) {
            return undefined;
        }
        const t = (0, translations_1.getTranslations)();
        return (0, translations_1.interpolate)(t.unknowns, {
            eventName: this._eventName || t.fallbackParkrunName,
        });
    }
    hasData() {
        return this._unknowns.length > 0;
    }
    hasUnknowns() {
        return this.hasData();
    }
}
exports.UnknownsPresenter = UnknownsPresenter;


/***/ },

/***/ 712
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VolunteerInvitationPresenter = void 0;
const translations_1 = __webpack_require__(682);
const urlFunctions_1 = __webpack_require__(179);
class VolunteerInvitationPresenter {
    _eventName;
    _currentUrl;
    constructor(eventName, currentUrl) {
        this._eventName = eventName;
        this._currentUrl = currentUrl;
    }
    title() {
        return '';
    }
    details() {
        const t = (0, translations_1.getTranslations)();
        return (0, translations_1.interpolate)(t.volunteerInvitation, {
            eventName: this._eventName || t.fallbackParkrunName,
            url: (0, urlFunctions_1.futureRosterUrl)(this._currentUrl),
        });
    }
}
exports.VolunteerInvitationPresenter = VolunteerInvitationPresenter;


/***/ },

/***/ 318
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VolunteersPresenter = void 0;
const stringFunctions_1 = __webpack_require__(731);
const translations_1 = __webpack_require__(682);
class VolunteersPresenter {
    _volunteers;
    _eventName;
    constructor(volunteers, eventName) {
        // Filter out first-time volunteers (they have their own section)
        this._volunteers = volunteers.filter((v) => v.vols !== 1);
        this._eventName = eventName;
    }
    title() {
        const t = (0, translations_1.getTranslations)();
        return (0, translations_1.interpolate)(t.volunteersTitle, {
            eventName: this._eventName || t.fallbackParkrunName,
        });
    }
    details() {
        if (!this.hasData()) {
            return undefined;
        }
        return (0, stringFunctions_1.sortAndConjoin)(this._volunteers.map((v) => v.name));
    }
    hasData() {
        return this._volunteers.length > 0;
    }
}
exports.VolunteersPresenter = VolunteersPresenter;


/***/ },

/***/ 522
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.shareReportText = shareReportText;
// Share report text using native share or clipboard
function shareReportText(options) {
    const eventuateDiv = document.getElementById('eventuate');
    if (!eventuateDiv) {
        console.warn('Eventuate content not found');
        return;
    }
    const eventTitle = buildEventTitle(options);
    const reportText = extractReportText(eventuateDiv);
    if (reportText) {
        // Try native share first (works on mobile devices and some desktop browsers)
        if (navigator.share) {
            navigator
                .share({
                title: eventTitle,
                text: reportText,
            })
                .catch((error) => {
                console.warn('Native share failed:', error);
                copyToClipboard(eventTitle, reportText);
            });
        }
        else {
            copyToClipboard(eventTitle, reportText);
        }
    }
}
function buildEventTitle(options) {
    if (options?.eventName && options?.eventDate && options?.eventNumber) {
        return `${options.eventName} ${options.eventDate} | ${options.eventNumber}`;
    }
    else if (options?.eventName) {
        return options.eventName;
    }
    else {
        return 'parkrun Event Report';
    }
}
function extractReportText(eventuateDiv) {
    const paragraphs = eventuateDiv.querySelectorAll('p');
    const reportText = Array.from(paragraphs)
        .map((p) => {
        if (p.id === 'languageSwitcher' ||
            p.querySelector('.eventuate-language-switcher')) {
            return '';
        }
        const clone = p.cloneNode(true);
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
        const textContent = clone.innerHTML.replace(/<br\s*\/?>/gi, '\n').trim();
        return textContent;
    })
        .filter((text) => text && text.length > 0)
        .join('\n\n');
    return reportText;
}
function copyToClipboard(title, text) {
    const fullText = `${title}\n\n${text}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
            .writeText(fullText)
            .then(() => {
            showSuccessFeedback();
        })
            .catch((error) => {
            console.warn('Clipboard write failed:', error);
            fallbackCopyToClipboard(fullText);
        });
    }
    else {
        fallbackCopyToClipboard(fullText);
    }
}
function showSuccessFeedback() {
    const shareBtn = document.querySelector('.eventuate-share-btn');
    if (shareBtn) {
        const originalText = shareBtn.textContent;
        shareBtn.textContent = '✅ Copied!';
        shareBtn.classList.add('shared');
        setTimeout(() => {
            shareBtn.textContent = originalText;
            shareBtn.classList.remove('shared');
        }, 2000);
    }
}
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showSuccessFeedback();
}


/***/ },

/***/ 731
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.conjoin = conjoin;
exports.alphabetize = alphabetize;
exports.sortAndConjoin = sortAndConjoin;
function conjoin(elements) {
    if (elements.length === 0)
        return '';
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


/***/ },

/***/ 804
(__unused_webpack_module, exports) {


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


/***/ },

/***/ 930
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fiveKVolunteersToMilestones = fiveKVolunteersToMilestones;
function fiveKVolunteersToMilestones(volunteers) {
    const milestones = {
        10: { icon: '&#x1F90D;' },
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
            .filter((v) => v.vols === Number(n) && v.vClub === Number(n))
            .map((v) => v.name);
        if (names.length > 0) {
            milestoneCelebrations.push({
                clubName: `Volunteer ${n}`,
                icon: milestone.icon,
                names,
            });
        }
    }
    return milestoneCelebrations;
}


/***/ },

/***/ 617
(__unused_webpack_module, exports) {


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


/***/ },

/***/ 798
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.twoKVolunteersToMilestones = twoKVolunteersToMilestones;
function twoKVolunteersToMilestones(volunteers) {
    const names = volunteers
        .filter((v) => v.vols === 5 && v.vClub === 5)
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


/***/ },

/***/ 283
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.de = void 0;
// translations/de.ts - German translations
exports.de = {
    // Language metadata
    flag: '🇩🇪',
    languageName: 'Deutsch',
    // Translation strings
    introduction: 'Vielen Dank an alle Parkrunner, einschließlich der {finisherCount} und {volunteerCount}, die bei {eventName} Event {eventNumber} mitgemacht haben. Ohne Sie wäre diese Veranstaltung nicht möglich gewesen',
    newestParkrunnersTitle: 'Das erste Mal bei Parkrun ist etwas zu feiern! Es ist auch der erste Schritt zu Ihrer ersten offiziellen Meilenstein-Club-Mitgliedschaft. Willkommen bei den {count}, die diesen Schritt dieses Wochenende gemacht haben: ',
    firstTimersTitle: 'Willkommen bei den {count}, die zum ersten Mal bei {eventName} mitgemacht haben: ',
    firstTimersLaunchEventClosing: 'Vielen Dank, dass Sie zu unserem Eröffnungsevent gereist sind. Mit {total} absolvierten Finishes wurden wir sich wirklich freuen, Ihre Erfahrung bei der Unterstützung dieses Events in der lokalen Gemeinschaft in den kommenden Wochen zu nutzen, während wir uns etablieren. Bitte erwagen Sie, bald zurückzukehren und ein Freiwilligen-Warnweste zu tragen',
    finishersWithNewPBsTitle: '{eventName} ist kein Rennen, aber eine großartige Möglichkeit, sich selbst herauszufordern. Sehr gut gemacht an die {count}, die diese Woche ihre persönliche Bestzeit verbessert haben: ',
    runningWalkingGroupsTitle: 'Wir freuten uns, {count} bei dieser Veranstaltung vertreten zu sehen: ',
    volunteersTitle: 'Die folgenden Parkrunner haben sich freiwillig gemeldet, um {eventName} dieses Wochenende zu veranstalten. Unser tiefer Dank gilt:  ',
    firstTimeVolunteersTitle: 'Ein besonderes Willkommen an {count}, die zum ersten Mal freiwillig geholfen haben: ',
    fullResults: 'Sie können die vollständigen Ergebnisse für {eventName} Event {eventNumber} unter {url} finden ',
    volunteerInvitation: 'Wenn Sie bei {eventName} freiwillig helfen möchten, schauen Sie bitte auf unserer zukünftigen Roster-Seite unter {url} nach. Alle unsere Rollen sind einfach zu erlernen, und wir bieten Schulung und Unterstützung. Wir würden uns freuen, Sie bei uns zu haben',
    unknowns: 'Bitte vergessen Sie nicht, eine scannbare Kopie Ihres Barcodes zu {eventName} mitzubringen, wenn Sie Ihre Zeit aufgezeichnet haben möchten. Diese gestreiften kleinen Tickets sind Ihr Pass zu kostenlosen, spaßigen und freundlichen wöchentlichen Veranstaltungen auf der ganzen Welt und enthalten auch Kontaktdaten für den Notfall. parkrun-Barcode-Armbänder haben außerdem medizinische Angaben, die Sie überall beim Sport dabei haben können.',
    juniorSupervisionReminder: 'Eine Erinnerung, dass bei allen 5km Parkrun-Veranstaltungen Kinder unter 11 Jahren jederzeit in Reichweite eines Elternteils, Erziehungsberechtigten oder einer beauftragten erwachsenen Person sein müssen. Wir danken Ihnen für Ihre Zusammenarbeit, um die Sicherheit aller Teilnehmer zu gewährleisten. Weitere Informationen finden Sie in der Parkrun-Richtlinie zur Teilnahme von Kindern: https://support.parkrun.com/hc/articles/20038963108754',
    facts: {
        sinceStarted: 'Seit {eventName} begonnen hat ',
        brilliantParkrunners: 'haben {count} brillante Parkrunner ihre Barcodes scannen lassen, ',
        grandTotal: 'und insgesamt {count} Finisher ',
        coveredDistance: 'haben eine Gesamtstrecke von {distance} km zurückgelegt, ',
        celebratingPBs: 'während {count} persönliche Bestzeiten gefeiert wurden. ',
        gratefulToVolunteers: 'Wir werden immer dankbar für jeden unserer {count} wunderbaren Freiwilligen für ihre Beiträge sein',
    },
    milestoneCelebrations: {
        title: 'Drei Hochrufe für die {count}, die dieses Wochenende einem neuen Parkrun-Meilenstein-Club beigetreten sind:<br>',
        joinedClub: '{names} ist dem {clubName} beigetreten',
    },
    loadingMessage: 'Lade Freiwilligendaten für {count} Parkrunner. Bitte warten',
    closing: 'Wir sind nächste Woche wieder da für ein weiteres kostenloses, spaßiges und freundliches wöchentliches {courseLength}-km-Gemeinschaftsevent. Gehen, joggen, laufen, freiwillig helfen oder zuschauen – ganz wie Sie möchten.<br><br>&#x1f333; #liebeparkrun',
    staleResultsWarning: 'Diese Ergebnisse sind älter als eine Woche. Seit diesem Event wurden möglicherweise weitere Meilensteine erreicht.',
    fallbackParkrunName: 'Parkrun',
    fallbackParkrunnerName: 'ein Parkrunner',
    // Pluralization helpers
    finisher: 'Finisher',
    finishers: 'Finisher',
    volunteer: 'Freiwilliger',
    volunteers: 'Freiwillige',
    parkrunner: 'Parkrunner',
    parkrunners: 'Parkrunner',
    activeGroup: 'aktive Gruppe',
    walkingAndRunningGroups: 'Lauf- und Walkinggruppen',
    // Articles for German grammar
    parkrunnerSingularArticle: 'den',
    parkrunnerPluralArticle: 'die',
    // Milestone club names
    milestoneClubs: {
        '10': '10er Club',
        '25': '25er Club',
        '50': '50er Club',
        '100': '100er Club',
        '250': '250er Club',
        '500': '500er Club',
        '1000': '1000er Club',
        'Volunteer 10': 'Freiwilligen 10er Club',
        'Volunteer 25': 'Freiwilligen 25er Club',
        'Volunteer 50': 'Freiwilligen 50er Club',
        'Volunteer 100': 'Freiwilligen 100er Club',
        'Volunteer 250': 'Freiwilligen 250er Club',
        'Volunteer 500': 'Freiwilligen 500er Club',
        'Volunteer 1000': 'Freiwilligen 1000er Club',
        'junior parkrun v5': 'Junior Parkrun v5 Club',
        'junior parkrun 100': 'Junior Parkrun 100er Club',
        'junior parkrun 250': 'Junior Parkrun 250er Club',
        'Half marathon': 'Halbmarathon Club',
        Marathon: 'Marathon Club',
        'Ultra marathon': 'Ultramarathon Club',
    },
};


/***/ },

/***/ 67
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.en = void 0;
// translations/en.ts - British English translations
exports.en = {
    // Language metadata
    flag: '🇬🇧',
    languageName: 'English',
    // Translation strings
    introduction: 'Thank you to all the parkrunners, including the {finisherCount} and {volunteerCount}, who joined us for {eventName} event {eventNumber}. Without you, this event would not have been possible',
    newestParkrunnersTitle: "The first time to parkrun is something to celebrate! It's also the first step towards your first official milestone club membership. Welcome to the {count} who took this step this weekend: ",
    firstTimersTitle: 'Welcome to the {count} who joined us at {eventName} for the first time: ',
    firstTimersLaunchEventClosing: 'Thank you for travelling to join us at our inaugural event. With {total} finishes completed between you, we would really welcome your expertise in supporting this event in the local community over the coming weeks while we get established. Please consider returning soon to don a volunteer vest',
    finishersWithNewPBsTitle: "{eventName} is not a race, but it's a great way to challenge yourself. Very well done to the {count} who improved their personal best this week: ",
    runningWalkingGroupsTitle: 'We were pleased to see {count} represented at this event: ',
    volunteersTitle: 'The following parkrunners volunteered to host {eventName} this weekend. Our deep thanks to:  ',
    firstTimeVolunteersTitle: 'A special welcome to the {count} who volunteered for the first time: ',
    fullResults: 'You can find the full results for {eventName} event {eventNumber} at {url} ',
    volunteerInvitation: 'If you would like to volunteer at {eventName}, please check out our future roster page at {url} . All of our roles are easy to learn, and we will provide training and support. We would love to have you join us',
    unknowns: "Please don't forget to bring a scannable copy of your barcode with you to {eventName} if you'd like to have your time recorded. These stripy little tickets are your passport to free, fun, and friendly weekly events all over the world and also carry contact details in case of an emergency. parkrun barcode wristbands also have medical information, which you can take with you wherever you work out.",
    juniorSupervisionReminder: "A reminder that at all 5km parkrun events, children under the age of 11 must be within arm's reach of a parent, guardian or designated adult at all times. We appreciate your cooperation in ensuring the safety of all participants. For more information, please see parkrun's policy on children participating: https://support.parkrun.com/hc/articles/20038963108754",
    facts: {
        sinceStarted: 'Since {eventName} started ',
        brilliantParkrunners: '{count} brilliant parkrunners have had their barcodes scanned, ',
        grandTotal: 'and a grand total of {count} finishers ',
        coveredDistance: 'have covered a total distance of {distance} km, ',
        celebratingPBs: 'while celebrating {count} personal bests. ',
        gratefulToVolunteers: 'We shall always be grateful to each of our {count} wonderful volunteers for their contributions',
    },
    milestoneCelebrations: {
        title: 'Three cheers to the {count} who joined a new parkrun milestone club this weekend:<br>',
        joinedClub: '{names} joined the {clubName}',
    },
    loadingMessage: 'Loading volunteer data for {count} parkrunners. Please wait',
    closing: "We'll be back next week for another free, fun, and friendly weekly {courseLength}km community event. Walk, jog, run, volunteer or spectate – it's up to you.<br><br>&#x1f333; #loveparkrun",
    staleResultsWarning: 'These results are more than a week old. Milestones may have been reached since this event took place.',
    fallbackParkrunName: 'parkrun',
    fallbackParkrunnerName: 'a parkrunner',
    // Pluralization helpers
    finisher: 'finisher',
    finishers: 'finishers',
    volunteer: 'volunteer',
    volunteers: 'volunteers',
    parkrunner: 'parkrunner',
    parkrunners: 'parkrunners',
    activeGroup: 'active group',
    walkingAndRunningGroups: 'walking and running groups',
    // Milestone club names
    milestoneClubs: {
        '10': '10 club',
        '25': '25 club',
        '50': '50 club',
        '100': '100 club',
        '250': '250 club',
        '500': '500 club',
        '1000': '1000 club',
        'Volunteer 10': 'Volunteer 10 club',
        'Volunteer 25': 'Volunteer 25 club',
        'Volunteer 50': 'Volunteer 50 club',
        'Volunteer 100': 'Volunteer 100 club',
        'Volunteer 250': 'Volunteer 250 club',
        'Volunteer 500': 'Volunteer 500 club',
        'Volunteer 1000': 'Volunteer 1000 club',
        'junior parkrun v5': 'junior parkrun v5 club',
        'junior parkrun 100': 'junior parkrun 100 club',
        'junior parkrun 250': 'junior parkrun 250 club',
        'Half marathon': 'Half marathon club',
        Marathon: 'Marathon club',
        'Ultra marathon': 'Ultra marathon club',
    },
};


/***/ },

/***/ 682
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.translations = void 0;
exports.detectLocale = detectLocale;
exports.getTranslations = getTranslations;
exports.interpolate = interpolate;
exports.createLanguageSwitcher = createLanguageSwitcher;
exports.switchLanguage = switchLanguage;
exports.getStoredOrDetectedLocale = getStoredOrDetectedLocale;
exports.formatCount = formatCount;
exports.formatCountWithArticle = formatCountWithArticle;
// translations/index.ts - Translation registry and utilities
const en_1 = __webpack_require__(67);
const de_1 = __webpack_require__(283);
exports.translations = {
    en: en_1.en,
    de: de_1.de,
};
// Detect browser locale
function detectLocale() {
    // First check for stored user preference
    const stored = localStorage.getItem('eventuate-language');
    if (stored && exports.translations[stored]) {
        return stored;
    }
    const browserLocale = navigator.language || navigator.languages?.[0] || 'en';
    // Check for exact match first (e.g., en-GB, de-DE)
    if (exports.translations[browserLocale]) {
        return browserLocale;
    }
    // Check for language match (e.g., en, de)
    const language = browserLocale.split('-')[0].toLowerCase();
    if (exports.translations[language]) {
        return language;
    }
    // Default to English
    return 'en';
}
// Get translations for current locale
function getTranslations(locale) {
    const targetLocale = locale || detectLocale();
    return exports.translations[targetLocale] || exports.translations.en;
}
// Simple template replacement function
function interpolate(template, values) {
    return template.replace(/\{(\w+)\}/g, (match, key) => {
        return values[key]?.toString() || match;
    });
}
// Language switcher functionality
function createLanguageSwitcher() {
    const currentLocale = detectLocale();
    const availableLocales = Object.keys(exports.translations);
    return `
    <div class="eventuate-language-switcher">
      <span class="eventuate-language-label">Language:</span>
      ${availableLocales
        .map((locale) => `
        <button 
          class="eventuate-language-btn ${currentLocale === locale ? 'active' : ''}" 
          data-locale="${locale}"
          title="${exports.translations[locale].languageName}"
        >
          ${exports.translations[locale].flag} ${exports.translations[locale].languageName}
        </button>
      `)
        .join('')}
      <button 
        class="eventuate-share-btn" 
        title="Share report text"
        data-action="share-report"
      >
        📤 Share Report
      </button>
    </div>
  `;
}
function switchLanguage(locale) {
    if (!exports.translations[locale]) {
        console.warn(`Locale ${locale} not supported`);
        return;
    }
    localStorage.setItem('eventuate-language', locale);
    const eventuateDiv = document.getElementById('eventuate');
    const windowWithEventuate = window;
    if (eventuateDiv && windowWithEventuate.eventuate) {
        windowWithEventuate.eventuate();
    }
    else {
        window.location.reload();
    }
}
// Get stored language preference or detect from browser
function getStoredOrDetectedLocale() {
    const stored = localStorage.getItem('eventuate-language');
    if (stored && exports.translations[stored]) {
        return stored;
    }
    return detectLocale();
}
function formatCount(count, singular, plural) {
    const word = count === 1 ? singular : plural;
    return count === 1 ? word : `${count} ${word}`;
}
function formatCountWithArticle(count, singular, plural, singularArticle, pluralArticle) {
    if (count === 1) {
        return `${singularArticle} ${singular}`;
    }
    return `${pluralArticle} ${count} ${plural}`;
}


/***/ },

/***/ 751
(__unused_webpack_module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Finisher = void 0;
const translations_1 = __webpack_require__(682);
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
        const t = (0, translations_1.getTranslations)();
        this.name = name ?? t.fallbackParkrunnerName;
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


/***/ },

/***/ 179
(__unused_webpack_module, exports) {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isSupportedResultsPageUrl = isSupportedResultsPageUrl;
exports.eventDateFromResultsPageUrl = eventDateFromResultsPageUrl;
exports.futureRosterUrl = futureRosterUrl;
exports.canonicalResultsPageUrl = canonicalResultsPageUrl;
/**
 * Safely creates a new URL based on the provided href
 */
function createUrlFromCurrent(currentHref) {
    try {
        return new URL(currentHref);
    }
    catch {
        return null;
    }
}
/**
 * Parses the URL path into segments for easier manipulation
 */
function getPathSegments(url) {
    return url.pathname.split('/');
}
/**
 * Changes a specific segment in the URL path
 */
function changePathSegment(url, segmentIndex, newValue, pathSegments) {
    const segments = pathSegments || getPathSegments(url);
    if (segments.length > segmentIndex) {
        segments[segmentIndex] = newValue;
        url.pathname = segments.join('/');
    }
    return url;
}
function removeQueryParams(url) {
    url.search = '';
    return url;
}
const RESULTS_SEGMENT_DATE = /^\d{4}-\d{2}-\d{2}$/;
function resultsSegmentAfterResults(href) {
    const url = createUrlFromCurrent(href);
    if (!url)
        return null;
    const segments = getPathSegments(url);
    const resultsIndex = segments.indexOf('results');
    if (resultsIndex === -1 || resultsIndex === segments.length - 1) {
        return null;
    }
    return segments[resultsIndex + 1].replace(/\/$/, '');
}
function isSupportedResultsPageUrl(href) {
    const segment = resultsSegmentAfterResults(href);
    return segment !== null && RESULTS_SEGMENT_DATE.test(segment);
}
function eventDateFromResultsPageUrl(href) {
    const segment = resultsSegmentAfterResults(href);
    if (segment === null || !RESULTS_SEGMENT_DATE.test(segment)) {
        return undefined;
    }
    return segment;
}
function futureRosterUrl(currentHref) {
    const url = createUrlFromCurrent(currentHref);
    if (!url)
        return currentHref;
    const pathSegments = getPathSegments(url);
    const eventShortName = pathSegments[1];
    url.pathname = [eventShortName, 'futureroster', ''].join('/');
    return removeQueryParams(url).toString();
}
function canonicalResultsPageUrl(eventNumber, currentHref) {
    const url = createUrlFromCurrent(currentHref);
    const normalisedEventNumber = eventNumber.replace('#', '');
    if (!url)
        return currentHref;
    const pathSegments = getPathSegments(url);
    if (pathSegments.length > 3 && pathSegments[2] === 'results') {
        return removeQueryParams(changePathSegment(url, 3, normalisedEventNumber, pathSegments)).toString();
    }
    return removeQueryParams(url).toString();
}


/***/ }

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
__webpack_unused_export__ = upsertStaleResultsInCss;
__webpack_unused_export__ = isStaleResults;
__webpack_unused_export__ = eventuate;
const upsertParagraph_1 = __webpack_require__(133);
const fiveKFinishersToMilestones_1 = __webpack_require__(804);
const fiveKVolunteersToMilestones_1 = __webpack_require__(930);
const FactsPresenter_1 = __webpack_require__(870);
const MilestonePresenter_1 = __webpack_require__(893);
const FirstTimersPresenter_1 = __webpack_require__(163);
const FirstTimersLaunchEventPresenter_1 = __webpack_require__(532);
const FirstTimeVolunteersPresenter_1 = __webpack_require__(871);
const JuniorSupervisionPresenter_1 = __webpack_require__(707);
const UnknownsPresenter_1 = __webpack_require__(854);
const IntroductionPresenter_1 = __webpack_require__(251);
const NewestParkrunnersPresenter_1 = __webpack_require__(680);
const NewPBsPresenter_1 = __webpack_require__(44);
const GroupsPresenter_1 = __webpack_require__(95);
const FullResultsPresenter_1 = __webpack_require__(436);
const VolunteersPresenter_1 = __webpack_require__(318);
const VolunteerInvitationPresenter_1 = __webpack_require__(712);
const ClosingPresenter_1 = __webpack_require__(686);
const ResultsPageExtractor_1 = __webpack_require__(692);
const twoKFinishersToMilestone_1 = __webpack_require__(617);
const twoKVolunteersToMilestones_1 = __webpack_require__(798);
const translations_1 = __webpack_require__(682);
const share_1 = __webpack_require__(522);
const urlFunctions_1 = __webpack_require__(179);
const currentUrl_1 = __webpack_require__(831);
const STALE_DAYS = 7;
const STALE_STYLE_ID = 'eventuate-stale-results-style';
function civilDayNumber(year, month, day) {
    // Convert a Gregorian calendar date to a stable day number.
    const y = month <= 2 ? year - 1 : year;
    const m = month <= 2 ? month + 12 : month;
    const era = Math.floor(y / 400);
    const yoe = y - era * 400;
    const doy = Math.floor((153 * (m - 3) + 2) / 5) + day - 1;
    const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
    return era * 146097 + doe;
}
const DISCLAIMER_TOP = '\u26A0\uFE0F This information is drawn by the Eventuate Web Extension from the results table to facilitate writing a report. It is not a report in itself.';
function escapeCssContent(s) {
    return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, ' ');
}
function upsertStaleResultsInCss(eventuateDiv, message) {
    const existing = document.getElementById(STALE_STYLE_ID);
    if (existing) {
        existing.remove();
    }
    eventuateDiv.classList.toggle('eventuate-stale-results', message !== null);
    if (message !== null) {
        const style = document.createElement('style');
        style.id = STALE_STYLE_ID;
        style.textContent = `#eventuate.eventuate-stale-results::before{content:"${escapeCssContent(DISCLAIMER_TOP)} \\A ${escapeCssContent(message)}";}`;
        document.head.appendChild(style);
    }
}
function isStaleResults(eventDate) {
    if (!eventDate || !/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) {
        return false;
    }
    const [y, m, d] = eventDate.split('-').map(Number);
    const now = new Date();
    const eventDay = civilDayNumber(y, m, d);
    const todayDay = civilDayNumber(now.getFullYear(), now.getMonth() + 1, now.getDate());
    const daysDiff = todayDay - eventDay;
    return daysDiff > STALE_DAYS;
}
function createPresenters(rpe) {
    const firstTimersPresenter = rpe.isLaunchEvent() && rpe.firstTimersWithFinishCounts.length > 0
        ? new FirstTimersLaunchEventPresenter_1.FirstTimersLaunchEventPresenter(rpe.firstTimersWithFinishCounts, rpe.eventName)
        : new FirstTimersPresenter_1.FirstTimersPresenter(rpe.firstTimersWithFinishCounts, rpe.eventName);
    const finisherMilestoneCelebrations = rpe.courseLength == 2
        ? [
            ...(0, twoKVolunteersToMilestones_1.twoKVolunteersToMilestones)(rpe.volunteersList()),
            ...(0, twoKFinishersToMilestone_1.twoKFinishersToMilestones)(rpe.finishers),
        ]
        : (0, fiveKFinishersToMilestones_1.fiveKFinishersToMilestones)(rpe.finishers);
    const milestoneCelebrations = [
        ...(0, fiveKVolunteersToMilestones_1.fiveKVolunteersToMilestones)(rpe.volunteersList()),
        ...finisherMilestoneCelebrations,
    ];
    return {
        introduction: new IntroductionPresenter_1.IntroductionPresenter(rpe.finishers.length, rpe.volunteersList().length, rpe.eventName, rpe.eventNumber),
        milestoneCelebrations: new MilestonePresenter_1.MilestonePresenter(milestoneCelebrations),
        newestParkrunners: new NewestParkrunnersPresenter_1.NewestParkrunnersPresenter(rpe.newestParkrunners),
        firstTimers: firstTimersPresenter,
        newPBs: new NewPBsPresenter_1.NewPBsPresenter(rpe.finishersWithNewPBs, rpe.eventName),
        groups: new GroupsPresenter_1.GroupsPresenter(rpe.runningWalkingGroups),
        fullResults: new FullResultsPresenter_1.FullResultsPresenter(rpe.eventName, rpe.eventNumber, (0, currentUrl_1.getCurrentHref)()),
        volunteers: new VolunteersPresenter_1.VolunteersPresenter(rpe.volunteersList(), rpe.eventName),
        firstTimeVolunteers: new FirstTimeVolunteersPresenter_1.FirstTimeVolunteersPresenter(rpe.volunteersList(), rpe.eventName),
        volunteerInvitation: new VolunteerInvitationPresenter_1.VolunteerInvitationPresenter(rpe.eventName, (0, currentUrl_1.getCurrentHref)()),
        unknowns: new UnknownsPresenter_1.UnknownsPresenter(rpe.unknowns, rpe.eventName),
        juniorSupervision: new JuniorSupervisionPresenter_1.JuniorSupervisionPresenter(rpe),
        facts: new FactsPresenter_1.FactsPresenter(rpe.eventName, rpe.courseLength, rpe.facts, rpe.isLaunchEvent()),
        closing: new ClosingPresenter_1.ClosingPresenter(rpe.courseLength),
    };
}
function populate(rpe, presenters, message) {
    const eventuateDiv = document.getElementById('eventuate') ||
        document.createElement('div');
    eventuateDiv.id = 'eventuate';
    // Build reportDetails from presenters
    const reportDetails = {
        languageSwitcher: {
            title: '',
            details: (0, translations_1.createLanguageSwitcher)(),
        },
        message: { title: '&#x23f3;', details: message },
    };
    const eventDate = (0, urlFunctions_1.eventDateFromResultsPageUrl)((0, currentUrl_1.getCurrentHref)());
    const staleMessage = isStaleResults(eventDate)
        ? `\u2139\uFE0F ${(0, translations_1.getTranslations)().staleResultsWarning}`
        : null;
    // Iterate over presenters and add to reportDetails
    for (const [key, presenter] of Object.entries(presenters)) {
        reportDetails[key] = {
            title: presenter.title(),
            details: presenter.details(),
        };
    }
    const insertionPoint = document.querySelector('.Results-header') ?? document.body;
    if (insertionPoint === document.body) {
        insertionPoint.insertAdjacentElement('afterbegin', eventuateDiv);
    }
    else {
        insertionPoint.insertAdjacentElement('afterend', eventuateDiv);
    }
    for (const [section, content] of Object.entries(reportDetails)) {
        if (content.details) {
            if (section === 'languageSwitcher') {
                // Handle language switcher specially - no title, no period
                (0, upsertParagraph_1.upsertParagraph)(eventuateDiv, section, content.details);
            }
            else {
                // Check if title ends with <br> to avoid extra space
                const separator = content.title.endsWith('<br>') ? '' : ' ';
                const paragraphText = `${content.title}${separator}${content.details}.`;
                (0, upsertParagraph_1.upsertParagraph)(eventuateDiv, section, paragraphText);
            }
        }
        else {
            (0, upsertParagraph_1.deleteParagraph)(eventuateDiv, section);
        }
    }
    upsertStaleResultsInCss(eventuateDiv, staleMessage);
    // Add event listeners for language switcher and copy button
    const languageButtons = eventuateDiv.querySelectorAll('.eventuate-language-btn');
    languageButtons.forEach((button) => {
        button.addEventListener('click', (e) => {
            const target = e.target;
            const locale = target.getAttribute('data-locale');
            if (locale) {
                (0, translations_1.switchLanguage)(locale);
            }
        });
    });
    // Add event listener for share button
    const shareButton = eventuateDiv.querySelector('.eventuate-share-btn');
    if (shareButton) {
        shareButton.addEventListener('click', () => {
            (0, share_1.shareReportText)({
                eventName: rpe.eventName,
                eventDate: (0, urlFunctions_1.eventDateFromResultsPageUrl)((0, currentUrl_1.getCurrentHref)()),
                eventNumber: rpe.eventNumber,
            });
        });
    }
}
function eventuate() {
    if (!(0, urlFunctions_1.isSupportedResultsPageUrl)((0, currentUrl_1.getCurrentHref)())) {
        return;
    }
    const rpe = new ResultsPageExtractor_1.ResultsPageExtractor(document);
    const presenters = createPresenters(rpe);
    populate(rpe, presenters);
}
window.eventuate = eventuate;
eventuate();

})();

/******/ })()
;