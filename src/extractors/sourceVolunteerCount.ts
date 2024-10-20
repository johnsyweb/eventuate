import { presentVolunteerName } from "../presenters/presentVolunteerName";
import { Volunteer } from "../types/Volunteer";

export function sourceVolunteerCount(v: Volunteer, update: HTMLSpanElement): void {
  const timeout = v.athleteID % 1000;
  const volunteerUrl = new URL(
    `/parkrunner/${v.athleteID}/`,
    window.location.origin
  ).toString();

  setTimeout(() => {
    fetch(volunteerUrl)
      .then((r) => r.text())
      .then((html) => new DOMParser().parseFromString(html, "text/html"))
      .then((doc) => {
        return {
          vols: doc.querySelector(
            "h3#volunteer-summary + table tfoot td:last-child"
          ),
          agegroup: doc.querySelector("h3 + p") as HTMLParagraphElement,
        };
      })
      .then((e) => {
        v.vols = e.vols?.textContent ?? "";
        v.agegroup =
          e.agegroup?.textContent?.trim().split(" ").slice(-1)[0] ?? "";

        update.innerText = presentVolunteerName(
          v.name,
          Number(v.vols),
          v.agegroup
        );
        update.dataset.vols = v.vols;
        update.dataset.agegroup = v.agegroup;
        update.dataset.vols_source = volunteerUrl;
        const a: HTMLAnchorElement | null = document.querySelector(
          `a[data-athleteid="${v.athleteID}"]`
        );
        if (a) {
          a.dataset.vols = v.vols;
          a.dataset.agegroup = v.agegroup;
          a.dataset.vols_source = volunteerUrl;
        }
      });
  }, timeout);
}
