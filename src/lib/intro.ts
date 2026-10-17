/**
 * Runs cb immediately, unless the intro loader or a page transition is covering the screen.
 * In that case it waits for the matching event (Enter pressed / transition lifting).
 */
export function whenEntered(cb: () => void): () => void {
  if (typeof document === "undefined") return () => {};
  const d = document.documentElement.dataset;
  const evt = d.intro === "on" ? "lishe-enter" : d.transition === "covered" ? "lishe-reveal" : null;

  if (!evt) {
    cb();
    return () => {};
  }
  const run = () => cb();
  window.addEventListener(evt, run, { once: true });
  return () => window.removeEventListener(evt, run);
}
