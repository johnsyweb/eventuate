# Eventuate [![Mozilla / Firefox][mozilla-image]][Mozilla] [![Google Chrome / Chromium][chromewebstore-image]][Google Chrome]

Extracts information from parkrun event result pages for inclusion in reports.
It's not a run report generator, but will help you write a weekly report for an
event.

## Introduction

I wrote this while volunteering as a Run Director at the beautiful [Brimbank
parkrun][brimbank], to make it easy to celebrate our community's achievements on
the [Brimbank parkrun Facebook page][facebook]. I am sharing it so that you get
to enjoy it too.

I initially wrote this as a Firefox Add-On, as the developer tooling is pretty
good in this space and Firefox Browser Add-Ons are pretty easy to distribute.
However, once I worked out I could generate a userscript as part of the
automated release process and run it in any browser with a userscript manager,
including iOS and iPadOS devices, I switched to using that!

## Description

If you volunteer at [parkrun] and produce an event report to celebrate
achievements, this addon will make your life easier!

As soon as the latest results page loads for an event, you'll see a bunch of
useful text before the results table is displayed, including:

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

## Development status [![Node.js CI][ci-badge]][Node.js CI]

I wrote this for myself in an afternoon to see if I could do it and figured it
may be useful to others. I then spent a while over-engineering it in TypeScript
and adding some unit tests using `jest`.

## Building locally

### Prerequisites

This project uses [asdf](https://asdf-vm.com/) to manage Node.js versions and
[corepack](https://nodejs.org/api/corepack.html) to manage pnpm. Here's how to
set up your development environment:

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

### Building the Userscript and Bookmarklet

The userscript and bookmarklet are built automatically as part of the
`pnpm package` command. They will be generated in:

- Userscript: `target/eventuate.user.js`
- Bookmarklet: `target/bookmarklet.md`

To build them individually:

```sh
pnpm webpack --config webpack.userscript.config.js
pnpm webpack --config webpack.bookmarklet.config.js
```

The userscript can be installed in browsers that support userscript managers
like [Tampermonkey][tampermonkey], [Userscripts][userscripts], or [Greasemonkey][greasemonkey]. The bookmarklet can be used in any browser,
including Safari on iOS devices, by creating a bookmark with the generated
JavaScript code.

## Running locally

First, let's turn the TypeScript files into a single JavaScript file to be
consumed by `web-ext`...

```sh
pnpm build --watch
```

...`--watch` means we can edit the `.ts` files and have our change reflected in
an instant.

Second, in another terminal, let's start up Firefox and see our code in
action...

```sh
pnpm start
```

## Installing in a browser from source

1. Download this repository to a suitable location on your computer.
1. In Firefox, navigate to "about:debugging#/runtime/this-firefox"
1. Use the "Load Temporary Add-on..." button.
1. Browse to and open the file `manifest.json` from the location where it was
   saved.
1. The add-on will now appear in the add-on manager’s list of installed add-ons
   and be ready to use
1. Navigate to a results page such as
   <https://www.parkrun.com.au/timboon/results/latestresults/>.

Observe the additional details between the title and the event table.

## Requirements

This was built with [Firefox][firefox] in mind but also works in Chromium-based
browsers, using the `chromium` artefacts. Enjoy!

## Contributing

Bug reports and pull requests are welcome on [GitHub]. Everyone interacting in
the eventuate project's codebases, issue trackers, _etcetera_ is expected to
follow the [code of conduct].

We use semantic commits in this project. Please see our [contibution
guidelines][contributing] for more information about the preferred commit
message format.

## Releasing

This project uses [semantic-release][semantic-release] to automate version
management and package releases. The release process is triggered automatically
when changes are pushed to the `main` branch.

The process will:

1. Analyze commits to determine the next version number
2. Update the CHANGELOG.md
3. Create a new GitHub release
4. Build and attach extension packages:
   - Firefox extension (`.zip`)
   - Chrome extension (`.zip`)
   - Userscript (`.user.js`)
   - Bookmarklet installation page (`.html`)

To test the release process locally:

```sh
GITHUB_TOKEN=your-token pnpm semantic-release --dry-run
```

The version number will be automatically incremented based on your commits:

- `fix:` → patch (0.0.x)
- `feat:` → minor (0.x.0)
- `BREAKING CHANGE:` → major (x.0.0)

## License [![license][license-image]][licence]

The addon is available as open source under the terms of the [MIT License].

<!-- Links -->

[chromewebstore-image]:
  https://img.shields.io/chrome-web-store/v/dgkpaaeifngfeelldljpdlnmacdpceba?logo=chromewebstore
[ci-badge]:
  https://github.com/johnsyweb/eventuate/actions/workflows/node.js.yml/badge.svg
[code of conduct]:
  https://github.com/johnsyweb/eventuate/blob/main/CODE_OF_CONDUCT.md
[GitHub]: https://github.com/johnsyweb/eventuate/
[Google Chrome]:
  https://chromewebstore.google.com/detail/eventuate/dgkpaaeifngfeelldljpdlnmacdpceba
[licence]: https://github.com/johnsyweb/eventuate/blob/HEAD/LICENSE.txt
[license-image]:
  https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square
[MIT License]: https://opensource.org/licenses/MIT
[mozilla-image]: https://img.shields.io/amo/v/eventuate?logo=mozilla
[Mozilla]:
  https://addons.mozilla.org/firefox/addon/eventuate/
  'Mozilla / Firefox'
[Node.js CI]:
  https://github.com/johnsyweb/eventuate/actions/workflows/node.js.yml
[parkrun]: https://www.parkrun.com/
[brimbank]: https://www.parkrun.com.au/brimbank/
[facebook]: https://www.facebook.com/brimbankparkrun
[firefox]: https://mozilla.org/firefox
[contributing]: docs/CONTRIBUTING.md
[semantic-release]: https://github.com/semantic-release/semantic-release
[tampermonkey]: https://www.tampermonkey.net/
[userscripts]: https://github.com/quoid/userscripts
[greasemonkey]: https://www.greasespot.net/

<!-- Images -->

[eventuate-results-summary-image]: ./docs/images/eventuate-results-summary.png
