# Eventuate

Extracts information from parkrun event result pages for inclusion in reports.

[![CI][ci-badge]][ci] [![Mozilla Add-ons][mozilla-badge]][mozilla]
[![Chrome Web Store][chrome-badge]][chrome]
[![License: MIT][license-badge]][license]

It is not a run report generator, but it helps you write a weekly parkrun event
report — milestones, first-timers, personal bests, volunteers, and community
facts — as soon as the results page loads.

I wrote it while volunteering as a Run Director at [Brimbank parkrun][brimbank],
to celebrate our community on the [Facebook page][facebook], and shared it so
other events can use it too. Install it as a browser extension, or use the
[userscript][userscript] or [bookmarklet][bookmarklet] (including on Safari /
iOS).

## Getting started

1. Install Eventuate from the [Firefox Add-ons][mozilla] site or the [Chrome Web
   Store][chrome] (Safari and iOS: use the [userscript][userscript] or
   [bookmarklet][bookmarklet] instead).
2. Open a parkrun **latest results** page, for example
   <https://www.parkrun.com.au/timboon/results/latestresults/>.
3. Read the Eventuate summary inserted above the results table — ready to paste
   into your event report.

![Eventuate output on a Brimbank parkrun results page, showing summary
statistics and celebration text above the results table.][eventuate-results-summary-image]

Eventuate detects your browser language (English and German today) and lets you
switch with the flag buttons on the output. Preference is remembered across
sessions.

## Help

- Project site and install options: <https://www.johnsy.com/eventuate/>
- Bugs and questions: [GitHub Issues][github-issues]

## Maintainers

Maintained by [Pete Johns][pete] ([@johnsyweb][github]).

## Development status

Maintained. Started as a personal afternoon project for Brimbank parkrun, then
grown with TypeScript, tests, and automated releases. Current version is in
[`package.json`](package.json); history is in [`CHANGELOG.md`](CHANGELOG.md).

## Local development

This project uses [mise](https://mise.jdx.dev/) for tools and tasks, and
[aube](https://aube.jdx.dev/) for Node dependencies (paranoid mode).

```sh
curl https://mise.run | sh   # if you do not already have mise
mise install                 # tools from mise.toml
mise trust                   # first time only
mise run setup               # install dependencies
mise run test                # lint + unit tests
mise tasks                   # list available tasks
```

Git hooks are managed by [hk](https://hk.jdx.dev/) and installed with
`mise install`. Bypass for one command with `HK=0 git commit`.

Useful tasks:

| Task                  | Description                                |
| --------------------- | ------------------------------------------ |
| `mise run build`      | Extension, userscript, and bookmarklet     |
| `mise run watch`      | Rebuild bundles while developing           |
| `mise run server`     | Run the extension in Firefox               |
| `mise run package`    | Package Firefox and Chromium zips          |
| `mise run docs:serve` | Jekyll docs at `localhost:4000/eventuate/` |
| `mise run cibuild`    | Full CI checks locally (includes audit)    |

`mise run build` writes artefacts that are not checked into git:

- Userscript: `docs/eventuate.user.js`
- Bookmarklet: `docs/bookmarklet/index.md`

CI publishes those on GitHub Pages and GitHub Releases.

Tool versions live only in [`mise.toml`](mise.toml). Dependency security
overrides and build-script approvals live in
[`aube-workspace.yaml`](aube-workspace.yaml).

Load a temporary add-on from source: open
`about:debugging#/runtime/this-firefox` in Firefox, choose **Load Temporary
Add-on…**, and select `manifest.json` from this repo.

## Contributing

Bug reports and pull requests are welcome on [GitHub][github]. See
[`CONTRIBUTING.md`](CONTRIBUTING.md) for semantic commit conventions. To add a
language, copy `src/translations/en.ts`, translate it, register it in
`src/translations/index.ts`, and open a PR (use Australian English spelling in
English strings).

## Code of conduct

Everyone interacting in this project is expected to follow the
[code of conduct](CODE_OF_CONDUCT.md).

## Releasing

Releases are automated with [semantic-release][semantic-release] on pushes to
`main`. The pipeline analyses commits, updates `CHANGELOG.md`, creates a GitHub
release, and attaches Firefox and Chromium zips plus the userscript and
bookmarklet page.

Dry-run locally:

```sh
GITHUB_TOKEN=your-token mise run release:dry-run
```

Version bumps follow conventional commits: `fix:` → patch, `feat:` → minor,
`BREAKING CHANGE:` → major.

## Security

See [`.github/SECURITY.md`](.github/SECURITY.md) for how to report
vulnerabilities. Pull requests also run automated security scanning (including
CodeQL); dependencies are updated via Dependabot and aube.

## License

Available under the [MIT License](LICENSE.txt).

<!-- Badges and links -->

[ci-badge]:
  https://github.com/johnsyweb/eventuate/actions/workflows/ci-cd.yml/badge.svg
[ci]: https://github.com/johnsyweb/eventuate/actions/workflows/ci-cd.yml
[mozilla-badge]: https://img.shields.io/amo/v/eventuate?logo=mozilla
[mozilla]: https://addons.mozilla.org/firefox/addon/eventuate/
[chrome-badge]:
  https://img.shields.io/chrome-web-store/v/dgkpaaeifngfeelldljpdlnmacdpceba?logo=chromewebstore
[chrome]:
  https://chromewebstore.google.com/detail/eventuate/dgkpaaeifngfeelldljpdlnmacdpceba
[license-badge]: https://img.shields.io/github/license/johnsyweb/eventuate
[license]: LICENSE.txt
[github]: https://github.com/johnsyweb/eventuate/
[github-issues]: https://github.com/johnsyweb/eventuate/issues
[pete]: https://www.johnsy.com/
[brimbank]: https://www.parkrun.com.au/brimbank/
[facebook]: https://www.facebook.com/brimbankparkrun
[userscript]: https://www.johnsy.com/eventuate/eventuate.user.js
[bookmarklet]: https://www.johnsy.com/eventuate/bookmarklet/
[semantic-release]: https://github.com/semantic-release/semantic-release
[eventuate-results-summary-image]: ./docs/images/eventuate-results-summary.png
