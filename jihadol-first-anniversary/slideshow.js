/* Slideshow lifecycle is scoped to the home page, including all timers/listeners. */
window.startMemorySlideshow = (root, options) => {
  if (!root) return () => {};
  const slides = [...root.querySelectorAll('[data-memory-slide]')];
  const toggle = root.querySelector('[data-slideshow-action="toggle"]');
  const counter = root.querySelector('[data-slideshow-current]');
  const status = root.querySelector('[data-slideshow-status]');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const interval = Math.max(3000, Number(options.interval) || 6500);
  let current = 0, timer = null, paused = motion.matches, disposed = false;

  function updateToggle() {
    toggle.textContent = paused ? '재생' : '일시정지';
    toggle.setAttribute('aria-label', paused ? '슬라이드 쇼 재생' : '슬라이드 쇼 일시정지');
  }
  function schedule() {
    clearTimeout(timer);
    timer = null;
    if (disposed || paused || document.hidden || slides.length < 2) return;
    timer = setTimeout(() => {
      advance(1);
      schedule();
    }, interval);
  }
  function advance(direction, announce = false) {
    // Keep the current photo visible if a later image is still loading.
    // Unavailable images are skipped so one failed request cannot stop the loop.
    let next = current;
    for (let offset = 1; offset < slides.length; offset++) {
      const candidate = (current + direction * offset + slides.length) % slides.length;
      const image = slides[candidate].querySelector('img');
      if (image.complete && image.naturalWidth > 0) { next = candidate; break; }
    }
    if (next === current) return;
    slides[current].classList.remove('is-active');
    slides[current].setAttribute('aria-hidden', 'true');
    current = next;
    slides[current].classList.add('is-active');
    slides[current].setAttribute('aria-hidden', 'false');
    counter.textContent = String(current + 1).padStart(2, '0');
    if (announce) status.textContent = `${slides.length}장 중 ${current + 1}번째 사진`;
  }
  function onClick(event) {
    const button = event.target.closest('[data-slideshow-action]');
    if (!button || !root.contains(button)) return;
    const action = button.dataset.slideshowAction;
    if (action === 'toggle') { paused = !paused; updateToggle(); }
    else if (action === 'previous' || action === 'next') advance(action === 'previous' ? -1 : 1, true);
    schedule();
  }
  function onMotionChange(event) {
    if (event.matches) { paused = true; updateToggle(); }
    schedule();
  }
  root.addEventListener('click', onClick);
  document.addEventListener('visibilitychange', schedule);
  motion.addEventListener('change', onMotionChange);
  updateToggle();
  schedule();
  return () => {
    disposed = true;
    clearTimeout(timer);
    root.removeEventListener('click', onClick);
    document.removeEventListener('visibilitychange', schedule);
    motion.removeEventListener('change', onMotionChange);
  };
};
