export function runWhenIdle(task: () => void, timeout = 2000) {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(task, { timeout });

    return () => window.cancelIdleCallback(id);
  }

  const id = window.setTimeout(task, 300);

  return () => window.clearTimeout(id);
}
