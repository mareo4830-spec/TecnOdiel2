import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// Smooth scrolling for wheel/trackpad (desktop, laptops). Touch keeps the native
// momentum scrolling of phones, which is already smooth and expected by users.
export function initSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false,
    allowNestedScroll: true,
    anchors: { offset: -80 },
  });

  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  // Route programmatic smooth scrolls (window.scrollTo / scrollIntoView) through Lenis
  const nativeScrollTo = window.scrollTo.bind(window);
  window.scrollTo = (a, b) => {
    if (a && typeof a === 'object' && a.behavior === 'smooth' && typeof a.top === 'number') {
      lenis.scrollTo(a.top);
    } else {
      nativeScrollTo(a, b);
    }
  };
  const nativeIntoView = Element.prototype.scrollIntoView;
  Element.prototype.scrollIntoView = function (arg) {
    if (arg && typeof arg === 'object' && arg.behavior === 'smooth') {
      lenis.scrollTo(this, { offset: -80 });
    } else {
      nativeIntoView.call(this, arg);
    }
  };

  return lenis;
}
