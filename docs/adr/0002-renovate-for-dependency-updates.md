---
status: accepted
---

# Renovate for dependency updates (replacing Dependabot)

Dependabot does not refresh `aube-lock.yaml`, and the Monday `aube-update` workflow duplicated npm ownership. We want the fleet pattern: hosted Renovate, seven-day cooling, automerge when every check is green (including majors), and lock regeneration without a custom GitHub App.

## Decision

1. **Mend Renovate (hosted)** owns npm, Bundler, Docker, and GitHub Actions updates via [johnsyweb/renovate-config](https://github.com/johnsyweb/renovate-config).
2. **aube-lock workflow** on `renovate/**` regenerates `aube-lock.yaml`, runs `./script/cibuild`, and publishes Check Runs on the final HEAD (including mirrors of `lint`, `format-check`, `test`, `lighthouse`, and `build`).
3. **Renovate membership** is declared in [johnsyweb/github-infra](https://github.com/johnsyweb/github-infra).
4. **Atomic cutover** — remove `.github/dependabot.yml`, `dependabot-auto-merge.yml`, and `aube-update.yml` in the same change as Renovate lands.
5. **Cooling** — Renovate `minimumReleaseAge: 7 days`; aube `minimumReleaseAge: 10080` (minutes).
6. **Automerge** — Renovate merges after every check is green (`platformAutomerge: false` in the shared preset); majors stay in separate PRs.
7. **Commits** — Conventional Commits `chore(deps): …`.
8. **Local** — `mise run update-deps` runs `aube outdated` then `aube update` (within ranges). `mise run update` remains “refresh after git pull”.
9. **allowBuilds** — fail closed; human review when a new lifecycle script appears.
10. **TypeScript** — block major bumps until ts-jest peers allow 7+.

## Considered options

**Keep Dependabot + aube-update (rejected)** — split ownership; Dependabot still does not understand aube.

**Self-hosted Renovate for postUpgradeTasks (rejected)** — more moving parts; hosted Renovate + aube-lock Check Runs matches ambassy.

## Consequences

- Add this repository to github-infra `renovate/repos.yaml` so the Mend app can access it.
- Open Dependabot PRs should be closed after cutover; Renovate becomes the sole updater.
