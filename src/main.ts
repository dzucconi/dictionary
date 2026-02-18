import { resolveConfig } from "./config.ts";
import { createQueue } from "./data.ts";
import { run } from "./display.ts";
import { setFavicon } from "./favicon.ts";
import "./style.css";

const main = async (): Promise<void> => {
  const config = resolveConfig(
    window.location.hostname,
    new URLSearchParams(window.location.search),
  );

  const html = document.documentElement;
  html.dataset["color"] = config.mode;
  html.dataset["direction"] = config.direction;
  if (config.invert) html.dataset["invert"] = "true";

  document.title = `dictionary.${config.mode}`;
  setFavicon(config.mode);

  const stage = document.getElementById("stage");
  if (!stage) throw new Error("Missing #stage element");

  const queue = await createQueue(config.type);
  await run(stage, queue, config);
};

void main();
