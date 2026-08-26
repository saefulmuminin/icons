// Runs before the browser paints, which is the whole of its job: it stamps the
// root element so the stylesheet can hide the splash for a repeat visitor
// before that visitor ever sees it.
//
// A file rather than an inline script for two reasons. React 19 warns about
// script tags inside components — fairly, since they never run on a client
// render — and next/script's inline form is queued into `self.__next_s` and
// executed by Next's own runtime, which is far too late for this.
//
// The key below is asserted against src/lib/splash-key.ts by a unit test, so
// the two cannot drift apart.
try {
  if (sessionStorage.getItem("iconz-splash")) {
    document.documentElement.dataset.splash = "seen";
  }
} catch (e) {
  // Private windows and blocked storage: the screen simply shows again.
}
