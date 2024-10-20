export function presentVolunteerName(
  name: string,
  vols: number,
  agegroup: string): string {
  const milestones: Record<number, string> = {
    10: "J",
    25: "",
    50: "",
    100: "",
    250: "",
    500: "",
    1000: "",
  };

  for (const n in milestones) {
    const restricted_age: string = milestones[Number(n)];
    if (vols === Number(n) && agegroup.startsWith(restricted_age)) {
      return `${name} (congratulations on joining the v${n}-club)`;
    }
  }

  return name;
}
