"use client";

/**
 * Print only the element marked `.print-area` (bill, certificate, contract).
 * globals.css hides everything else while `body.printing-scope` is set.
 */
export function printArea() {
  document.body.classList.add("printing-scope");
  const done = () => {
    document.body.classList.remove("printing-scope");
    window.removeEventListener("afterprint", done);
  };
  window.addEventListener("afterprint", done);
  window.print();
  // Some browsers don't fire afterprint; clean up on the next tick as well.
  window.setTimeout(done, 0);
}
