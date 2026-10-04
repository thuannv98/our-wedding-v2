/* The wishes running up the page the way names run at the end of a film.
 *
 * The list is laid out twice, one copy after the other, and the track is carried up by
 * exactly the height of one copy before it snaps back. The seam never shows because what
 * arrives is the same thing that left. The pace follows the length, so ten wishes do not
 * crawl and a hundred do not race.
 */
(function (AK) {
  "use strict";

  var PER_PIXEL = 22;      // milliseconds the track takes to travel one pixel

  function runCredits(track) {
    if (!track) return;
    var old = track.querySelector(".note--copy");
    while (old) { old.remove(); old = track.querySelector(".note--copy"); }

    var items = [].slice.call(track.children);
    if (!items.length) return;

    // measured before the copy goes in, so it is the height of one pass
    var reach = track.scrollHeight;
    if (!reach) return;

    for (var i = 0; i < items.length; i++) {
      var copy = items[i].cloneNode(true);
      copy.classList.add("note--copy");
      copy.setAttribute("aria-hidden", "true");          // read once, not twice
      var open = copy.querySelector(".note__open");
      if (open) open.setAttribute("tabindex", "-1");
      track.appendChild(copy);
    }

    track.style.setProperty("--credits-reach", reach + "px");
    track.style.setProperty("--credits-time", Math.round(reach * PER_PIXEL) + "ms");
    track.classList.add("is-running");
  }

  // a wish is worth stopping for, and a moving target is hard to tap
  function setupCredits(root) {
    root = root || document;
    var win = root.querySelector(".notes__window");
    if (!win) return;

    // The height is measured once the wishes are in, but the display faces arrive later
    // and change it. Measured again when they land, the loop lines up.
    var again = function () {
      var track = win.querySelector(".notes__track");
      if (track && track.children.length) runCredits(track);
    };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(again).catch(function () {});
    window.addEventListener("load", again);
    var hold = function () { win.classList.add("is-held"); };
    var release = function () { win.classList.remove("is-held"); };
    win.addEventListener("pointerenter", hold);
    win.addEventListener("pointerleave", release);
    win.addEventListener("pointerdown", hold);
    win.addEventListener("pointerup", release);
    win.addEventListener("pointercancel", release);
  }

  AK.runCredits = runCredits;
  AK.setupCredits = setupCredits;
})(window.AK = window.AK || {});
