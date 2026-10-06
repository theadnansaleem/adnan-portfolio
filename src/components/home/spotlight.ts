/** Points a card's highlight at the pointer by setting --mx and --my on the card under it. */
export function spotlight(event: PointerEvent) {
  if (event.pointerType !== 'mouse') return;
  const card = (event.target as Element).closest?.<HTMLElement>('.hx-card');
  if (!card) return;
  const box = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${event.clientX - box.left}px`);
  card.style.setProperty('--my', `${event.clientY - box.top}px`);
}
