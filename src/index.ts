import { generateEventOverview } from "./generateEventOverview";
import { generateStatsOverview } from "./generateStatsOverview";

if (location.pathname.includes("/latestresults")) {
  generateEventOverview();
} else if (location.pathname.includes("/eventhistory")) {
  generateStatsOverview();
}

