// Waypoints below are transcribed directly from the real road paths already drawn
// into the live public/home/map.svg (stroke="#E3C558"), converted from its
// 761x677 viewBox to percent (x/7.61, y/6.77). Not from Figma — this is the
// actual background asset the site serves, so these line up exactly with it.

export type Point = { x: number; y: number };

/** Car's idle/home spot: the base of the 4th (unlabeled, non-clickable) building. */
export const HOME: Point = { x: 72.93, y: 63.81 };

export type DestinationHref = "/shop" | "/about/why-choose-us" | "/games";

/** Full road-hugging path from HOME to each building, for the click-to-drive flow. */
export const ROUTES: Record<DestinationHref, Point[]> = {
  "/shop": [
    HOME,
    { x: 71.77, y: 63.81 },
    { x: 69.14, y: 60.86 },
    { x: 69.14, y: 59.8 },
    { x: 66.57, y: 56.91 },
    { x: 64.0, y: 54.02 },
    { x: 64.0, y: 39.75 }, // onto the main road
    { x: 57.0, y: 39.75 }, // roundabout east entry
    { x: 52.29, y: 39.62 }, // roundabout center
    { x: 52.37, y: 35.19 }, // roundabout north entry
    { x: 52.37, y: 30.67 }, // Bookstore junction
    { x: 50.93, y: 30.67 },
    { x: 47.78, y: 30.65 },
    { x: 45.17, y: 27.68 },
    { x: 45.18, y: 25.93 }, // Bookstore
  ],
  "/about/why-choose-us": [
    HOME,
    { x: 71.77, y: 63.81 },
    { x: 69.14, y: 60.86 },
    { x: 69.14, y: 59.8 },
    { x: 66.57, y: 56.91 },
    { x: 64.0, y: 54.02 },
    { x: 64.0, y: 39.75 }, // onto the main road
    { x: 71.22, y: 39.75 }, // About junction
    { x: 71.22, y: 38.26 },
    { x: 71.22, y: 35.15 }, // About
  ],
  "/games": [
    HOME,
    { x: 71.77, y: 63.81 },
    { x: 69.14, y: 60.86 },
    { x: 69.14, y: 59.8 },
    { x: 66.57, y: 56.91 },
    { x: 64.0, y: 54.02 },
    { x: 64.0, y: 39.75 }, // onto the main road
    { x: 57.0, y: 39.75 }, // roundabout east entry
    { x: 52.29, y: 39.62 }, // roundabout center
    { x: 52.48, y: 44.27 }, // roundabout south entry
    { x: 52.48, y: 68.85 },
    { x: 51.16, y: 70.33 },
    { x: 32.93, y: 70.33 },
    { x: 32.93, y: 68.8 }, // Games junction
    { x: 32.93, y: 64.38 }, // Games
  ],
};
