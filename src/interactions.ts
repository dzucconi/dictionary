const CURSOR_IDLE_MS = 3000;

const enableFullscreenOnDoubleClick = (): void => {
  document.addEventListener("dblclick", (event) => {
    event.preventDefault();
    window.getSelection()?.removeAllRanges();
    if (document.fullscreenElement) return;
    void document.documentElement.requestFullscreen?.();
  });
};

const enableCursorHideOnIdle = (): void => {
  const html = document.documentElement;
  let timer: ReturnType<typeof setTimeout> | null = null;

  const setIdle = (): void => {
    html.classList.add("is-idle-cursor");
  };

  const resetIdle = (): void => {
    html.classList.remove("is-idle-cursor");
    if (timer) clearTimeout(timer);
    timer = setTimeout(setIdle, CURSOR_IDLE_MS);
  };

  for (const eventName of [
    "mousemove",
    "mousedown",
    "touchstart",
    "touchmove",
    "keydown",
    "wheel",
  ]) {
    document.addEventListener(eventName, resetIdle, { passive: true });
  }

  resetIdle();
};

export const initializeInteractions = (): void => {
  enableFullscreenOnDoubleClick();
  enableCursorHideOnIdle();
};
