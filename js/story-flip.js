/* The drawing and the four photographs taking turns in the one place.
 *
 * The drawing comes first, because it is the thing a guest has not seen before. It turns
 * over to the photographs, back again, and so on. It only turns while the section is on
 * screen: turning over and over in a part of the page nobody is looking at wastes the
 * phone's battery and lands the guest on a half-turned card when they do scroll to it.
 */
(function (AK) {
  "use strict";

  function setupStoryFlip(root) {
    root = root || document;
    var box = root.getElementById("story-flip");
    if (!box) return;

    // nothing to turn to: one face on its own just stands there
    if (!box.querySelector(".story__drawing") || !box.querySelector(".story__photo")) return;

    var timer = null;

    function turn() {
      box.classList.toggle("is-turned");
      timer = setTimeout(turn, setupStoryFlip.hold);
    }
    function start() { if (!timer) timer = setTimeout(turn, setupStoryFlip.hold); }
    function stop() { clearTimeout(timer); timer = null; }

    if (typeof IntersectionObserver === "function") {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) start(); else stop();
      }, { threshold: 0.25 }).observe(box);
    } else {
      start();
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else start();
    });
  }

  // how long each face is held before it turns
  setupStoryFlip.hold = 5000;

  AK.setupStoryFlip = setupStoryFlip;
})(window.AK = window.AK || {});
