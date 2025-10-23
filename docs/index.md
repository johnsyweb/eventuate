---
layout: default
title: A tool for parkrun report writers
description: Extract parkrun event data for report writing. Generate summaries, milestone celebrations, volunteer acknowledgments, and community statistics automatically from parkrun results pages.
keywords: parkrun, eventuate, parkrun reports, running community, volunteer management, milestone celebrations, personal bests, parkrun statistics, running groups, parkrun extension, userscript, bookmarklet
---

## What

Extracts information from parkrun event result pages for inclusion in reports. It's not a run report generator as such, but will help you write a weekly report for an event.

## Why

I wrote this while volunteering as a Run Director at the beautiful [Brimbank parkrun][brimbank], to make it easy to celebrate our community's achievements on the [Brimbank parkrun Facebook page][facebook]. I am sharing it so that you get to enjoy it too.

I initially wrote this as a Firefox Add-On, as the developer tooling is pretty good in this space and Firefox Browser Add-Ons are pretty easy to distribute. However, once I worked out I could generate a userscript as part of the automated release process and run it in any browser with a userscript manager, including iOS and iPadOS devices, I switched to using that!

## How much

Free. For everyone. Forever. Of course.

## How

As soon as the latest results page loads for an event, you'll see a bunch of useful text before the results table is displayed, including:

- Weekly event summary
- New milestone club members
- Kudos for new parkrunners
- Welcome for first-time visitors
- Celebrating personal bests
- Acknowledgement of walking and running groups
- Link to the full results
- Gratitude to volunteers
- Invitation to volunteer with a link to the roster
- Reminder to bring a barcode
- Overall event summary facts and figures

![Eventuate extension output displaying Brimbank parkrun event #332 summary with yellow background. Shows participant statistics including 112 parkrunners, 8 volunteers, 3 milestone achievers, 8 first-timers, 17 personal bests, and various community statistics. Contains red notification banner indicating this is extracted data for report writing assistance.][eventuate-results-summary-image]

## Where

[The source code is freely available on GitHub][github] and [releases][releases] are available in a range of formats, including packages for your browser of choice.

Happily, Eventuate is available on [Firefox for Android][firefox-android].

Apple charge a fee to distribute software through their App Store, so Eventuate is not available as an extension for Safari. Safari and iOS users have two options available to them, in the forms of a [bookmarklet][bookmarklet-wiki] and a [userscript][userscript-wiki].

Grab your [Eventuate bookmarklet][bookmarklet] or [Eventuate userscript][userscript]!

The Chromium extension for Google Chrome is compatible with other browsers including Microsoft Edge and Opera. Please [report any issues][issues] you encounter using this on other browsers.

<!-- Links -->
[brimbank]: https://www.parkrun.com.au/brimbank/
[facebook]: https://www.facebook.com/brimbankparkrun
[github]: https://github.com/johnsyweb/eventuate
[releases]: https://github.com/johnsyweb/eventuate/releases/
[firefox-android]: https://www.mozilla.org/firefox/browsers/mobile/android/
[bookmarklet-wiki]: https://en.wikipedia.org/wiki/Bookmarklet
[userscript-wiki]: https://en.wikipedia.org/wiki/Userscript
[bookmarklet]: ./bookmarklet.html
[userscript]: ./eventuate.user.js
[issues]: https://github.com/johnsyweb/eventuate/issues/new?template=bug_report.md

<!-- Images -->
[eventuate-results-summary-image]: ./images/eventuate-results-summary.png
