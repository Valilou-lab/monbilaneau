"use client";

import { useEffect, type RefObject } from "react";
import { scrollQuoteFormIntoView } from "./scrollQuoteFormIntoView";

const HIDDEN_FLAG = "devisFocusHidden";

/**
 * From question 2 onward: hide every landing section below the form
 * (how it works, FAQ, footer) so the visitor stays in the funnel.
 * Keeps native document scroll — no body lock.
 */
export function useLandingFocus(focused: boolean, formRootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!focused || typeof window === "undefined") return;
    const form = formRootRef.current;
    if (!form) return;
    const hidden: HTMLElement[] = [];
    const hide = (el: HTMLElement) => {
      if (hidden.includes(el)) return;
      el.dataset[HIDDEN_FLAG] = el.style.display;
      el.style.display = "none";
      hidden.push(el);
    };
    document.querySelectorAll<HTMLElement>("[data-hide-on-focus]").forEach(hide);
    scrollQuoteFormIntoView(form);
    return () => {
      for (const el of hidden) {
        const previous = el.dataset[HIDDEN_FLAG];
        if (previous !== undefined) {
          el.style.display = previous;
          delete el.dataset[HIDDEN_FLAG];
        }
      }
    };
  }, [focused, formRootRef]);
}
