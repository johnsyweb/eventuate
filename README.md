# Eventuate [![Mozilla / Firefox][mozilla-image]][Mozilla] [![Google Chrome / Chromium][chromewebstore-image]][Google Chrome]

Extracts information from [parkrun] results pages for inclusion in reports.

## Introduction

I occasionally volunteer as a Run Director at [parkrun] and produce an
event report to celebrate achievements. I also write software
occasionally to automate parts of my life. This is the confluence of
these two interests.

## Description

If you volunteer at [parkrun] and produce an event report to celebrate
achievements, this addon will make your life easier!

As soon as the latest results page loads for an event, you'll see a bunch of useful text before the results table is displayed, including:

- A summary of the number of finishers
- Any finishers who joined a milestone club
- Congratulations to new parkrunners
- A welcome to first-time visitors
- A celebration of personal bests
- A shout out to the walking and running clubs
- Cheers to our volunteers.
- A reminder to bring a barcode
- And a beautiful bunch of facts and figures

## Development status [![Node.js CI][ci-badge]][Node.js CI]

I wrote this for myself in an afternoon to see if I could do it and
figured it may be useful to others. I then spent a while over-engineering
it in TypeScript and adding some unit tests using `jest`.

## Building locally

### Prerequisites

This project uses [asdf](https://asdf-vm.com/) to manage Node.js versions and [corepack](https://nodejs.org/api/corepack.html) to manage pnpm. Here's how to set up your development environment:

```sh
# Install asdf (if you haven't already)
brew install asdf

# Add the NodeJS plugin
asdf plugin add nodejs

# Install NodeJS at the version specified in .tool-versions
asdf install

# Enable corepack (comes with NodeJS)
corepack enable

# Verify installations
node --version
pnpm --version
```

### Building the Extension

Once the tools are installed:

```sh
pnpm i        # Install the development dependencies
pnpm t        # Run unit tests
pnpm package  # Package up all the things for Firefox and Chromium browsers
pnpm web-ext:lint  # Verify package for Firefox
```

Or if Docker's more your thing:

```sh
docker buildx build . -o target
```

## Running locally

First, let's turn the TypeScript files into a single JavaScript file to be consumed by `web-ext`...

```sh
pnpm build --watch
```

...`--watch` means we can edit the `.ts` files and have our change reflected in an instant.

Second, in another terminal, let's start up Firefox and see our code in action...

```sh
pnpm start
```

## Installing in a browser from source

1. Download this repository to a suitable location on your computer.
1. In Firefox, navigate to "about:debugging#/runtime/this-firefox"
1. Use the "Load Temporary Add-on..." button.
1. Browse to and open the file `manifest.json` from the location where it was saved.
1. The add-on will now appear in the add-on manager’s list of installed add-ons and be ready to use
1. Navigate to a results page such as <https://www.parkrun.com.au/timboon/results/latestresults/>.

Observe the additional details between the title and the event table.

![Sample Screenshot](./assets/screenshot.jpg)

## Requirements

This was built with [Firefox](https://mozilla.org/firefox) in mind but
also works in Chromium-based browsers, using the `chromium` artefacts.
Enjoy!

## Contributing

Bug reports and pull requests are welcome on [GitHub]. Everyone
interacting in the eventuate project's codebases, issue trackers,
_etcetera_ is expected to follow the [code of conduct].

We use semantic commits in this project. Please see our [contribuition guidelines](./CONTRIBUTING.md) for more information about the preferred commit message format.

## License [![license][license-image]][licence]

The addon is available as open source under the terms of the [MIT License].

<!-- Links -->

[chromewebstore-image]: https://img.shields.io/chrome-web-store/v/dgkpaaeifngfeelldljpdlnmacdpceba?logo=chromewebstore
[ci-badge]: https://github.com/johnsyweb/eventuate/actions/workflows/node.js.yml/badge.svg
[code of conduct]: https://github.com/johnsyweb/eventuate/blob/main/CODE_OF_CONDUCT.md
[GitHub]: https://github.com/johnsyweb/eventuate/
[Google Chrome]: https://chromewebstore.google.com/detail/eventuate/dgkpaaeifngfeelldljpdlnmacdpceba
[licence]: https://github.com/johnsyweb/eventuate/blob/HEAD/LICENSE.txt
[license-image]: https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square
[MIT License]: https://opensource.org/licenses/MIT
[mozilla-image]: https://img.shields.io/amo/v/eventuate?logo=mozilla
[Mozilla]: https://addons.mozilla.org/firefox/addon/eventuate/ "Mozilla / Firefox"
[Node.js CI]: https://github.com/johnsyweb/eventuate/actions/workflows/node.js.yml
[parkrun]: https://www.parkrun.com/
