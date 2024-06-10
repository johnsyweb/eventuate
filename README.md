# Eventuate

Extracts information from parkrun results pages for inclusion in reports.

## Introduction

I occassionally volunteer as a Run Director at [parkrun](https://parkrun.com.au/) and produce an event report to celebrate achievements. I also write software occassionally to automate parts of my life. This is the confluence of these two interests.

## Development status

I wrote this for myself in an afternoon to see if I could do it and figured it may be useful to others. I then spent a while over-engineering it in TypeScript and adding some unit tests using `jest`. I don't fully understand how modules work in TypeScript and JavaScript and after bashing my head against the desk, I used Crackle to do the heavy lifting. It almost works like I'd like it to.

## Building locally

Use `pnpm`:

```sh
pnpm i // Install the development dependencies
pnpm t // Run unit tests
pnpm build // Package up all the things for Firefox and Chromium browsers
pnpm web-ext:lint // Verify package for Firefox
```

## Getting started

1. Download this repository to a suitable location on your computer.
1. In Firefox, navigate to "about:debugging#/runtime/this-firefox"
1. Use the "Load Temporary Add-on..." button.
1. Browse to and open the file `manifest.json` from the location where it was saved.
1. The add-on will now appear in the add-on manager’s list of installed add-ons and be ready to use
1. Navigate to a results page such as <https://www.parkrun.com.au/timboon/results/latestresults/>.

Observe the additional details between the title and the event table.

![Sample Screenshot](./assets/screenshot.jpg)

## Requirements

[Firefox](https://mozilla.org/firefox)

## Contributing

Bug reports and pull requests are welcome on GitHub at
<https://github.com/johnsyweb/eventuate>. This project is intended to be a
safe, welcoming space for collaboration, and contributors are expected to adhere
to the [code of
conduct](https://github.com/johnsyweb/eventuate/blob/main/CODE_OF_CONDUCT.md).

## License [![license](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](https://github.com/johnsyweb/eventuate/blob/HEAD/LICENSE.txt)

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Code of Conduct

Everyone interacting in the eventuate project's codebases, issue trackers, chat
rooms and mailing lists is expected to follow the [code of
conduct](https://github.com/johnsyweb/eventuate/blob/main/CODE_OF_CONDUCT.md).
