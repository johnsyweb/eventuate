# Publish built scripts from CI; vendor Ruby gems in git

Userscript and bookmarklet outputs under `docs/` are build artefacts: CI builds
them for GitHub Pages and GitHub Release assets, and they are not source-
controlled. Ruby gems under `docs/vendor/` are intentionally vendored and
tracked (x86_64-linux for CI) so documentation builds do not depend on
fetching gems at install time; other host-platform installs stay gitignored.
Release commits must not force-add `docs/**/*`, or ignored build outputs (and
surprise vendor churn) return on every release.
