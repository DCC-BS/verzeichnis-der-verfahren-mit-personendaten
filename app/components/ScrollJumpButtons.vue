<script setup lang="ts">
import IconArrowNorth from "@kanton-basel-stadt/designsystem/icons/symbol/arrow-north";
import IconArrowSouth from "@kanton-basel-stadt/designsystem/icons/symbol/arrow-south";

function prefersReducedMotion(): boolean {
  return import.meta.client && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function scrollingElement(): HTMLElement {
  return (document.scrollingElement ?? document.documentElement) as HTMLElement;
}

function maxScrollTop(el: HTMLElement): number {
  return Math.max(0, el.scrollHeight - el.clientHeight);
}

function withInstantScroll(el: HTMLElement, fn: () => void) {
  const previous = el.style.scrollBehavior;
  el.style.scrollBehavior = "auto";
  fn();
  el.style.scrollBehavior = previous;
}

function scrollToTop() {
  const el = scrollingElement();
  if (prefersReducedMotion()) {
    withInstantScroll(el, () => {
      el.scrollTop = 0;
    });
    return;
  }
  el.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollToBottom() {
  const el = scrollingElement();
  const jumpToEnd = () => {
    withInstantScroll(el, () => {
      el.scrollTop = maxScrollTop(el);
    });
  };

  if (prefersReducedMotion()) {
    jumpToEnd();
    return;
  }

  el.scrollTo({ top: maxScrollTop(el), behavior: "smooth" });

  const finish = () => {
    window.removeEventListener("scrollend", finish);
    window.clearTimeout(timer);
    jumpToEnd();
  };

  window.addEventListener("scrollend", finish, { once: true });
  const timer = window.setTimeout(finish, 1500);
}
</script>

<template>
  <div class="scroll-jump print:hidden">
    <button
      type="button"
      class="button is-strong is-icon-only scroll-jump__btn"
      aria-label="Zum Seitenanfang"
      title="Zum Seitenanfang"
      @click="scrollToTop"
    >
      <component :is="IconArrowNorth" aria-hidden="true" />
    </button>
    <button
      type="button"
      class="button is-strong is-icon-only scroll-jump__btn"
      aria-label="Zum Seitenende"
      title="Zum Seitenende"
      @click="scrollToBottom"
    >
      <component :is="IconArrowSouth" aria-hidden="true" />
    </button>
  </div>
</template>

<style scoped>
.scroll-jump {
  position: fixed;
  right: 15px;
  bottom: 20px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.scroll-jump__btn {
  box-shadow: 0 4px 16px rgb(0 0 0 / 0.18);
}

@media (min-width: 768px) {
  .scroll-jump {
    right: 20px;
    bottom: 30px;
  }
}
</style>
