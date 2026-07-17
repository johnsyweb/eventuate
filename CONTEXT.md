# Eventuate

Extracts celebration-worthy facts from parkrun results pages for event reports.

## Language

### Events and participants

**Junior parkrun**: A 2km parkrun event for children. In Eventuate, identified
by course length 2. _Avoid_: junior event (ambiguous), 2k parkrun

**Junior participant**: A finisher whose age group is junior (`J…`). Junior
finisher milestones require both a junior parkrun event and a junior
participant. _Avoid_: child, kid, junior runner

### Milestone clubs

**Junior finisher milestone**: A numerical finisher milestone club at junior
parkrun (10, 25, 50, 75, 100, 150, 200, 250, 300). Club key and display basename
are `junior parkrun {n}`; UI shows `junior parkrun {n} club`. Represented with
coloured square icons approximating wristband colours. Sorted numerically among
finisher milestones. _Avoid_: preview junior milestone, Half marathon / Marathon
/ Ultra marathon (legacy junior distance clubs)

**5km finisher milestone**: A numerical finisher milestone club at a standard
5km parkrun. Display name is `{n} club`. Represented with coloured circle icons.
_Avoid_: junior parkrun {n} club

**Volunteer milestone**: A numerical volunteer milestone club. At 5km events,
display name is `Volunteer {n} club` (heart icons). Junior volunteer numerical
clubs are not yet in the model (planned separately). _Avoid_: volunteering club
