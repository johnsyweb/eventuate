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
only on junior parkrun results pages when credits hit one of those totals and
the person is a junior participant. A volunteer-milestone icon on the row is
preferred when present; otherwise credits alone may qualify after age is proven.
Club key basename `junior parkrun volunteer {n}`; UI shows
`junior parkrun volunteer {n} club`. Represented with coloured heart icons
approximating the same wristband colours as junior finisher squares. _Avoid_:
junior parkrun {n} (finisher club), Volunteer {n} (5km adult volunteer ladder),
junior parkrun v5

**5km finisher milestone**: A numerical finisher milestone club at a standard
5km parkrun. Display name is `{n} club`. Represented with coloured circle icons.
_Avoid_: junior parkrun {n} club

**Volunteer milestone**: A numerical volunteer milestone club on the 5km ladder.
Display name is `Volunteer {n} club` (heart icons). Distinct from junior
volunteer milestones. _Avoid_: junior parkrun volunteer {n}, volunteering club
