// Waypoints below are transcribed directly from the real road paths already drawn
// into the live public/home/map.svg (stroke="#E3C558"), converted from its
// 761x677 viewBox to percent (x/7.61, y/6.77). Not from Figma — this is the
// actual background asset the site serves, so these line up exactly with it.

export type Point = { x: number; y: number };

/** Car's idle/home spot: the center of the roundabout. */
export const HOME: Point = { x: 52.29, y: 39.62 };

export type DestinationHref = "/shop" | "/about/why-choose-us" | "/games";

export interface BuildingHitBox {
  href: DestinationHref;
  label: string;
  /**
   * Clickable region in percent, relative to the same corrected inner frame as the
   * car/background image (NOT the outer letterboxed box the text labels use).
   * Positioned above each route's real driveway-anchor point (verified from
   * map.svg), sized using a reasonable estimate for this art style — nudge if a
   * box doesn't line up with its house once you see it rendered.
   */
  box: { left: number; top: number; width: number; height: number };
}

export const BUILDING_HIT_BOXES: BuildingHitBox[] = [
  { href: "/shop", label: "Bookstore", box: { left: 39.6, top: 15.59, width: 11.17, height: 10.34 } },
  { href: "/about/why-choose-us", label: "About", box: { left: 67.08, top: 26.93, width: 8.28, height: 8.22 } },
  { href: "/games", label: "Games", box: { left: 29.25, top: 46.49, width: 7.36, height: 17.89 } },
];

/** Full road-hugging path from HOME to each building, for the click-to-drive flow. */
export const ROUTES: Record<DestinationHref, Point[]> = {
  "/shop": [
    HOME,
    { x: 52.37, y: 35.19 }, // roundabout north entry
    { x: 52.37, y: 30.67 }, // Bookstore junction
    { x: 50.93, y: 30.67 },
    { x: 47.78, y: 30.65 },
    { x: 45.17, y: 27.68 },
    { x: 45.18, y: 25.93 }, // Bookstore
  ],
  "/about/why-choose-us": [
    HOME,
    { x: 57.0, y: 39.75 }, // roundabout east entry
    { x: 71.22, y: 39.75 }, // About junction
    { x: 71.22, y: 38.26 },
    { x: 71.22, y: 35.15 }, // About
  ],
  "/games": [
    HOME,
    { x: 52.48, y: 44.27 }, // roundabout south entry
    { x: 52.48, y: 68.85 },
    { x: 51.16, y: 70.33 },
    { x: 32.93, y: 70.33 },
    { x: 32.93, y: 68.8 }, // Games junction
    { x: 32.93, y: 64.38 }, // Games
  ],
};
