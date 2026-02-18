import type { Config } from "./config.ts";
import type { Queue } from "./data.ts";

const contentBox = (
  el: HTMLElement,
): { top: number; bottom: number; height: number } => {
  const rect = el.getBoundingClientRect();
  const style = getComputedStyle(el);
  const top = rect.top + parseFloat(style.paddingTop);
  const bottom = rect.bottom - parseFloat(style.paddingBottom);
  return { top, bottom, height: bottom - top };
};

const RETRY_MULTIPLIER = 100;

const createSpan = (text: string): HTMLSpanElement => {
  const el = document.createElement("span");
  el.textContent = text;
  return el;
};

const trim = (stage: HTMLElement, direction: Config["direction"]): void => {
  const bounds = contentBox(stage.parentElement!);

  if (direction === "up") {
    let child = stage.firstElementChild;
    while (child) {
      const next = child.nextElementSibling;
      if (child.getBoundingClientRect().top <= bounds.top) child.remove();
      else break;
      child = next;
    }
  } else {
    let child = stage.lastElementChild;
    while (child) {
      const prev = child.previousElementSibling;
      if (child.getBoundingClientRect().bottom >= bounds.bottom) child.remove();
      else break;
      child = prev;
    }
  }
};

const insert = (
  stage: HTMLElement,
  text: string,
  direction: Config["direction"],
): void => {
  const span = createSpan(text);
  if (direction === "up") {
    stage.appendChild(span);
  } else {
    stage.prepend(span);
  }
};

const fill = async (
  stage: HTMLElement,
  queue: Queue,
  direction: Config["direction"],
): Promise<void> => {
  const available = contentBox(stage.parentElement!).height;
  while (stage.scrollHeight < available) {
    insert(stage, await queue.next(), direction);
  }
};

export const run = async (
  stage: HTMLElement,
  queue: Queue,
  config: Config,
): Promise<void> => {
  await fill(stage, queue, config.direction);
  trim(stage, config.direction);
  stage.dataset["state"] = "running";

  const step = async (): Promise<void> => {
    try {
      const text = await queue.next();
      insert(stage, text, config.direction);
      trim(stage, config.direction);
      setTimeout(() => void step(), text.length * config.speed);
    } catch {
      setTimeout(() => void step(), config.speed * RETRY_MULTIPLIER);
    }
  };

  void step();
};
