/* Karanda’y — ritmo cinematográfico. No requiere librerías ni cambios al HTML. */
function initKarandayMotion(root = document) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 801px) and (hover: hover) and (pointer: fine)');
  const html = document.documentElement;
  const sections = [...root.querySelectorAll('main > section')];
  const items = [];
  const focusRestores = new Map();
  let observer, frame = 0, navigation = null, disposed = false, initialized = false;
  function register(selector, effect, delay = 0) {
    root.querySelectorAll(selector).forEach((el, i) => {
      el.dataset.motion = effect;
      el.style.setProperty('--entry-delay', `${typeof delay === 'function' ? delay(i) : delay}ms`);
      items.push(el);
    });
  }
  register('#inicio .title-line', 'focus', i => i * 300);
  register('#inicio .brand-art', 'expand', 300);
  register('#inicio .hero-bottom', 'rise', 450);
  register('#nosotros > div:first-child', 'focus');
  register('#nosotros .about-text', 'focus', 300);
  register('#servicios .section-heading', 'rise');
  register('#servicios .service', 'service', i => 350 + i * 300);
  register('#portafolio .section-heading', 'rise');
  // Observe the unmasked article; clip-path is restricted to its media child.
  register('#portafolio .project', 'wipe', i => i * 350);
  register('#contacto', 'expand');
  register('#contacto > .eyebrow, #contacto > h2, #contacto > p:not(.eyebrow)', 'rise', i => 350 + i * 300);
  register('#contacto .contact-list > div', 'rise', i => 700 + i * 300);
  // Neutralize the previous one-shot reveal system, including stale classes.
  root.querySelectorAll('.reveal-pending, .cinematic-entry').forEach(el => el.classList.remove('reveal-pending', 'cinematic-entry'));
  const visible = el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; };
  function prepare(el) {
    if (reduced.matches || disposed) return;
    // Add the initial state BEFORE removing the completed animation.
    el.classList.add('motion-prepared');
    el.classList.remove('motion-playing', 'motion-settled');
  }
  function settle(el) {
    el.classList.add('motion-settled');
    el.classList.remove('motion-prepared', 'motion-playing');
  }
  function play(el) {
    if (reduced.matches || disposed || !el.classList.contains('motion-prepared')) return;
    // Atomic swap: initial CSS and first keyframe are identical.
    el.classList.add('motion-playing');
    el.classList.remove('motion-prepared');
  }
  function reconcile(section = null) {
    items.forEach(el => {
      if (section && el !== section && !section.contains(el)) return;
      if (visible(el)) play(el);
    });
  }
  function stopNavigation() {
    cancelAnimationFrame(frame); frame = 0; navigation = null;
    html.classList.remove('cinema-navigating');
  }
  function configure() {
    stopNavigation(); observer?.disconnect();
    items.forEach(el => {
      if (reduced.matches || (initialized && visible(el))) settle(el);
      else prepare(el);
    });
    initialized = true;
    html.classList.remove('motion-boot');
    if (reduced.matches) return;
    if (!('IntersectionObserver' in window)) { items.forEach(settle); return; }
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const el = entry.target;
          if (!entry.isIntersecting) {
            // Rearm only when fully outside: avoid restarting at a threshold edge.
            const r = el.getBoundingClientRect();
            if (r.bottom <= 0 || r.top >= innerHeight) prepare(el);
          } else if (!navigation) play(el);
        });
      }, { threshold: 0, rootMargin: '0px' });
      items.forEach(el => observer.observe(el)); // Never unobserve: entrances repeat.
    }
    reconcile();
  }
  function destination(section) {
    if (section.id === 'inicio') return 0;
    const padding = parseFloat(getComputedStyle(html).scrollPaddingTop) || 0;
    return Math.max(0, Math.min(html.scrollHeight - innerHeight, section.getBoundingClientRect().top + scrollY - padding));
  }
  function focusSection(section) {
    if (!section.hasAttribute('tabindex')) {
      section.setAttribute('tabindex', '-1');
      const restore = () => { section.removeAttribute('tabindex'); section.removeEventListener('blur', restore); focusRestores.delete(section); };
      focusRestores.set(section, restore); section.addEventListener('blur', restore);
    }
    section.focus({ preventScroll: true });
  }
  function navigate(event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    const link = event.target.closest?.('a[href^="#"]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    let section;
    try { section = document.getElementById(decodeURIComponent(link.getAttribute('href').slice(1))); } catch { return; }
    if (!sections.includes(section)) return; // Skip link and other anchors remain native.
    if (reduced.matches) { stopNavigation(); return; }
    event.preventDefault(); stopNavigation();
    // Do not rewind anything already visible; only arm the offscreen destination.
    items.filter(el => el === section || section.contains(el)).forEach(el => {
      if (!visible(el)) prepare(el);
    });
    navigation = section; html.classList.add('cinema-navigating');
    const startY = scrollY, distance = destination(section) - startY;
    const duration = Math.abs(distance) < 3 ? 0 : 1400;
    let start;
    function advance(now) {
      if (disposed || !navigation) return;
      if (start === undefined) start = now;
      const progress = duration ? Math.min(1, (now - start) / duration) : 1;
      const easing = progress < .5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
      window.scrollTo({ top: startY + distance * easing, behavior: 'instant' });
      if (progress < 1) { frame = requestAnimationFrame(advance); return; }
      // Update history without triggering a second native anchor jump.
      try { if (location.hash !== `#${section.id}`) history.pushState(null, '', `#${section.id}`); } catch { /* Local file restrictions must not interrupt navigation. */ }
      focusSection(section); stopNavigation(); reconcile(section);
    }
    frame = requestAnimationFrame(advance);
  }
  function interrupt(event) {
    if (event.type === 'keydown' && !['Escape','ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' ','Tab'].includes(event.key)) return;
    if (navigation) { stopNavigation(); reconcile(); }
  }
  function focusReveal(event) {
    // No keyboard focus should remain inside an invisible delayed animation.
    if (navigation) return; // Programmatic arrival focus must not expose then restart Contacto.
    items.filter(el => el.contains(event.target)).forEach(settle);
  }
  function historyChange() { stopNavigation(); reconcile(); }
  // Independent navigation UI: never change a section's animation state.
  const header = root.querySelector('.header');
  const navLinks = [...root.querySelectorAll('.header nav a[href^="#"]')];
  const backTop = document.createElement('a');
  backTop.className = 'back-to-top';
  backTop.href = '#inicio';
  backTop.setAttribute('aria-label', 'Volver al inicio');
  backTop.innerHTML = '<span aria-hidden="true">↑</span>';
  backTop.hidden = true;
  (root.body || root).appendChild(backTop);
  let navFrame = 0;
  function updateNavigationUI() {
    navFrame = 0;
    const height = header ? Math.ceil(header.getBoundingClientRect().height) : 0;
    html.style.setProperty('--header-height', `${height}px`);
    header?.classList.toggle('is-scrolled', scrollY > 24);
    // offsetTop is layout geometry, unaffected by animated transforms or masks.
    const layoutTop = el => {
      let top = 0;
      for (let node = el; node; node = node.offsetParent) top += node.offsetTop;
      return top;
    };
    const line = scrollY + height + Math.min(140, innerHeight * .2);
    let active = sections[0];
    sections.forEach(section => { if (layoutTop(section) <= line) active = section; });
    if (scrollY > 0 && scrollY + innerHeight >= html.scrollHeight - 2) active = sections.at(-1);
    navLinks.forEach(link => {
      if (link.getAttribute('href') === `#${active?.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    const show = scrollY > Math.max(320, innerHeight * .5);
    if (!show && document.activeElement === backTop) {
      root.querySelector('.header a[href="#inicio"]')?.focus({ preventScroll: true });
    }
    backTop.hidden = !show;
  }
  function scheduleNavigationUI() {
    if (!navFrame) navFrame = requestAnimationFrame(updateNavigationUI);
  }
  const headerResize = typeof ResizeObserver === 'function' ? new ResizeObserver(scheduleNavigationUI) : null;
  if (header) headerResize?.observe(header);
  window.addEventListener('scroll', scheduleNavigationUI, { passive: true });
  window.addEventListener('resize', scheduleNavigationUI);
  updateNavigationUI();
  configure();
  root.addEventListener('click', navigate); root.addEventListener('focusin', focusReveal);
  window.addEventListener('wheel', interrupt, { passive: true });
  window.addEventListener('touchstart', interrupt, { passive: true });
  window.addEventListener('keydown', interrupt); window.addEventListener('popstate', historyChange); window.addEventListener('hashchange', historyChange);
  reduced.addEventListener('change', configure); desktop.addEventListener('change', configure);
  return () => {
    disposed = true; stopNavigation(); observer?.disconnect();
    cancelAnimationFrame(navFrame); headerResize?.disconnect();
    window.removeEventListener('scroll', scheduleNavigationUI);
    window.removeEventListener('resize', scheduleNavigationUI);
    backTop.remove(); header?.classList.remove('is-scrolled');
    navLinks.forEach(link => link.removeAttribute('aria-current'));
    html.style.removeProperty('--header-height');
    items.forEach(el => { el.classList.remove("motion-playing", "motion-prepared", "motion-settled"); delete el.dataset.motion; el.style.removeProperty("--entry-delay"); });
    root.removeEventListener('click', navigate); root.removeEventListener('focusin', focusReveal);
    window.removeEventListener('wheel', interrupt); window.removeEventListener('touchstart', interrupt);
    window.removeEventListener('keydown', interrupt); window.removeEventListener('popstate', historyChange); window.removeEventListener('hashchange', historyChange);
    reduced.removeEventListener('change', configure); desktop.removeEventListener('change', configure);
    focusRestores.forEach(restore => restore());
  };
}
// Script clásico: funciona abriendo index.html con doble clic.
initKarandayMotion();
