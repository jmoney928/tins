export const SPECS = [
  { k: "Diameter", v: "68 mm", mono: true },
  { k: "Height", v: "41 mm", mono: true },
  { k: "Floors", v: "8 / 20 / 13 mm", mono: true },
  { k: "Holds", v: "25 fresh + 15 spent", mono: false },
  { k: "Cold hold", v: "6 hours", mono: true },
  { k: "Freeze time", v: "90 min", mono: true },
  { k: "Ice pack", v: "Chillcore slim, 18 g", mono: false },
  { k: "Shell", v: "6061-T6 aluminium", mono: false },
  { k: "Seals", v: "Two O-rings, IPX6", mono: false },
];

export const STEPS = [
  {
    n: "01",
    title: "Freeze the slim pack",
    body: "Ninety minutes in a standard freezer drawer. One pack ships inside every can; a three-pack keeps a frozen spare available at all times.",
    stat: "90 min",
  },
  {
    n: "02",
    title: "Load the three floors",
    body: "Ice pack in the base tray, twenty-five fresh pouches on the perforated floor above it, and the upper floor left clear for spent pouches.",
    stat: "Three floors",
  },
  {
    n: "03",
    title: "Seal and carry",
    body: "Closed on two silicone O-rings, the can holds fridge temperature for six hours at room ambient — flavour and moisture preserved throughout.",
    stat: "6 hours",
  },
];
