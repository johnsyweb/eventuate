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
// @version      ${version}
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
  content: "\\26A0\\FE0F This information is drawn by Eventuate ${version} from the results table to facilitate writing a report. It is not a report in itself. \\26A0\\FE0F";
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

${ code }