export const emoteChoices: [string, EmoteAction][] = [
  ["Give them a hug!", "hug"],
  ["Give them a kiss!", "kiss"],
  ["Smack them around a bit.", "smack"],
  ["Boop them on the nose!", "boop"],
  ["Throw something at them.", "throw"],
  ["Pat them on the head.", "pat"],
  ["Go UwU at them", "uwu"],
];

export const throwList = [
  "a ball",
  "some knives",
  "a table",
  "a pumpkin",
  "a book or two",
  "an entire human being",
  "the whole Moon",
  "a very angry cat",
  "some rotten tomatoes",
  "the tesseract",
  "Becca's buggy code",
];

export const smackList = [
  "their hand",
  "a balloon",
  "one of those foam fingers",
  "a wet towel",
  "a banana peel",
  "a newspaper",
  "some raw meat",
];

export type EmoteAction =
  | "hug"
  | "kiss"
  | "smack"
  | "boop"
  | "throw"
  | "pat"
  | "uwu";
