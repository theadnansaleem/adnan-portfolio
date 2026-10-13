/** A burst of hearts that float up from a point on the page. Does nothing when reduced motion is requested. */
export function hearts(x: number, y: number, root: Element | null) {
  if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (let i = 0; i < 16; i++) {
    const heart = document.createElement('span');
    heart.className = 'hx-heart';
    heart.textContent = '♥';
    heart.setAttribute('aria-hidden', 'true');
    heart.style.cssText = `left:${x}px;top:${y}px;--dx:${Math.round(Math.random() * 320 - 160)}px;--rise:${Math.round(Math.random() * 30 + 30)}vh;--size:${Math.round(Math.random() * 28 + 22)}px;animation-delay:${i * 40}ms`;
    heart.addEventListener('animationend', () => heart.remove());
    root.append(heart);
  }
}
