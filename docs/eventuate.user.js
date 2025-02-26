// ==UserScript==
// @downloadURL  https://github.com/johnsyweb/eventuate/eventuate.user.js
// @updateURL    https://github.com/johnsyweb/eventuate/eventuate.user.js
// @name         Eventuate
// @namespace    https://github.com/johnsyweb/eventuate
// @version      1.2.0
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
  content: "⚠️ This information is drawn by Eventuate from the results table to facilitate writing a report. It is not a report in itself. ⚠️";
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