/**
 * Geometry of the exploded tin on the home page.
 *
 * The three pieces were cut out of one render and are placed back on a
 * shared 416 x 702 canvas, so a label beside the stage can be put level with
 * its piece at any width by using the same percentages. This lives outside
 * the client component that draws the stage because the hero, a server
 * component, needs the numbers as plain values.
 */
export const STAGE_ASPECT = "416/702";

export const LAYERS = [
  { src: "/layer-lid.png", w: 832, h: 382, top: 0.14, lift: 26, float: 10, dur: 7.5 },
  { src: "/layer-chamber.png", w: 832, h: 500, top: 27.35, lift: 0, float: 6, dur: 8.5 },
  { src: "/layer-base.png", w: 832, h: 520, top: 62.96, lift: -26, float: 4, dur: 9.5 },
] as const;

/** Where each piece's rim is widest, as a percentage of the canvas height. */
export const LAYER_ANCHORS = [11.1, 43.2, 78.2] as const;

export const STAGE_ALT =
  "The Ice Tin taken apart: the engraved lid on top, the pouch chamber with its perforated floor in the middle, and the ice pack seated in the base";
