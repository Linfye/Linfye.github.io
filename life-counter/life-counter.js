(function () {
  "use strict";

  const YEAR_MS = 1000 * 60 * 60 * 24 * 365.2425;
  let started = false;

  function toNumber(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function formatValue(value, precision) {
    if (!Number.isFinite(value)) return "--";
    return value.toFixed(precision);
  }

  function updateCounter(container) {
    const birthText = container.dataset.birth || "";
    const expectancy = toNumber(container.dataset.expectancy, 80);
    const precision = Math.max(
      0,
      Math.min(20, toNumber(container.dataset.precision, 12)),
    );

    const birthDate = new Date(birthText);

    if (Number.isNaN(birthDate.getTime())) {
      container.classList.add("life-counter--error");
      return;
    }

    const now = Date.now();
    const birthMs = birthDate.getTime();
    const deathMs = birthMs + expectancy * YEAR_MS;

    const age = (now - birthMs) / YEAR_MS;
    const left = (deathMs - now) / YEAR_MS;

    const ageEl = container.querySelector(".js-life-counter-age");
    const leftEl = container.querySelector(".js-life-counter-left");

    if (ageEl) ageEl.textContent = formatValue(age, precision);
    if (leftEl) leftEl.textContent = formatValue(left, precision);
  }

  function tick() {
    document.querySelectorAll(".life-counter").forEach(updateCounter);
    window.requestAnimationFrame(tick);
  }

  function start() {
    if (started) return;
    started = true;
    tick();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
