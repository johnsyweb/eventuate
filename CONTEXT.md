# Eventuate

Extracts celebration-worthy facts from parkrun results pages for event reports.

## Language

### Events and participants

**Junior parkrun**: A 2km parkrun event for children. In Eventuate, identified
by course length 2. _Avoid_: junior event (ambiguous), 2k parkrun

**Junior participant**: A person whose parkrun age category is junior and at
most 14 (e.g. `JW10`, `JM11-14`). Excludes `J…15-17`. Junior finisher milestones
require a junior parkrun event and a junior participant finisher. Junior
volunteer milestones require a junior participant (age proven from the same
event’s finisher row when present, otherwise from their parkrunner profile age
category). _Avoid_: child, kid, junior runner, any `J…` (too broad — 15–17 are
not in scope)

### Milestone clubs

**Junior finisher milestone**: A numerical finisher milestone club at junior
parkrun (10, 25, 50, 75, 100, 150, 200, 250, 300). Counts only finishes at 2k
junior parkrun events. Club key and display basename are `junior parkrun {n}`;
UI shows `junior parkrun {n} club`. Represented with coloured square icons
approximating wristband colours. Sorted numerically among finisher milestones.
_Avoid_: preview junior milestone, Half marathon / Marathon / Ultra marathon
(legacy junior distance clubs)

**Junior volunteer milestone**: A numerical volunteer milestone club for young
volunteers (ages 4–14) at the same intervals (10, 25, 50, 75, 100, 150, 200,
250, 300). Volunteer credits from any parkrun (2k and 5k) count. Parallel to
junior finisher milestones — not the same club. In Eventuate reports, celebrated
only on junior parkrun results pages. When a volunteer-club icon marks a total
that is only on the junior volunteer ladder (e.g. 75, 150), celebrate
synchronously from the icon. When credits hit a junior total with no matching
icon, celebrate after age is proven as a junior participant. Overlap totals that
already show a volunteer-club icon (e.g. 100) are celebrated as Volunteer
milestones instead — see below. Club key basename
`junior parkrun volunteer {n}`; UI shows `junior parkrun volunteer {n} club`.
Represented with coloured heart icons approximating the same wristband colours
as junior finisher squares. _Avoid_: junior parkrun {n} (finisher club),
Volunteer {n} (volunteer ladder), junior parkrun v5

**5km finisher milestone**: A numerical finisher milestone club at a standard
5km parkrun. Display name is `{n} club`. Represented with coloured circle icons.
_Avoid_: junior parkrun {n} club

**Volunteer milestone**: A numerical volunteer milestone club on the volunteer
ladder (shared by 5km and junior parkrun events for over-14s, and whenever
parkrun shows the volunteer-club icon). Display name is `Volunteer {n} club`
(heart icons). On junior parkrun results pages, celebrate synchronously from
credits plus matching volunteer-club icon — the same rule as 5km — including
when the parkrunner is a junior participant and the total also exists on the
junior volunteer ladder. Distinct from junior volunteer milestones. _Avoid_:
junior parkrun volunteer {n}, volunteering club
