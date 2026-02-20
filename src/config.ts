export type Mode = "red" | "blue" | "black" | "pink";
export type WordType = "verb" | "noun" | "adj" | "adv";
export type Direction = "up" | "down";

export type Config = {
  readonly mode: Mode;
  readonly type: WordType;
  readonly direction: Direction;
  readonly speed: number;
  readonly invert: boolean;
};

const MODE_TO_TYPE: Record<Mode, WordType> = {
  red: "verb",
  blue: "noun",
  black: "adj",
  pink: "adv",
};

const DOMAIN_TO_MODE: Record<string, Mode> = {
  "dictionary.red": "red",
  "dictionary.blue": "blue",
  "dictionary.black": "black",
  "dictionary.pink": "pink",
};

const isMode = (value: string): value is Mode =>
  value === "red" || value === "blue" || value === "black" || value === "pink";

const isDirection = (value: string): value is Direction =>
  value === "up" || value === "down";

export const resolveMode = (hostname: string): Mode =>
  DOMAIN_TO_MODE[hostname.toLowerCase().split(":")[0] ?? ""] ?? "blue";

const parseSpeed = (value: string | null): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 50;
};

export const resolveConfig = (
  hostname: string,
  params: URLSearchParams,
): Config => {
  const modeParam = params.get("mode");
  const mode =
    modeParam && isMode(modeParam) ? modeParam : resolveMode(hostname);
  const dirParam = params.get("direction");

  return {
    mode,
    type: MODE_TO_TYPE[mode],
    direction: dirParam && isDirection(dirParam) ? dirParam : "up",
    speed: parseSpeed(params.get("speed")),
    invert: params.get("invert") === "true",
  };
};
