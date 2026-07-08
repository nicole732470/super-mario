// Drag window from anywhere; short press on a track = +1
(() => {
  const DRAG_THRESHOLD = 5;
  let active = false;
  let moved = false;
  let startX = 0;
  let startY = 0;

  function onDown(e) {
    if (e.button !== 0) return;
    SproutSounds.unlock();
    active = true;
    moved = false;
    startX = e.screenX;
    startY = e.screenY;
    window.sproutAPI.dragStart({ screenX: e.screenX, screenY: e.screenY });
  }

  function onMove(e) {
    if (!active) return;
    const dx = e.screenX - startX;
    const dy = e.screenY - startY;
    if (!moved && Math.hypot(dx, dy) >= DRAG_THRESHOLD) moved = true;
    if (moved) window.sproutAPI.dragMove({ screenX: e.screenX, screenY: e.screenY });
  }

  function onUp(e) {
    if (!active) return;
    active = false;
    window.sproutAPI.dragEnd();
    if (!moved) {
      const track = e.target.closest(".track");
      if (track?.id === "plot-connect") window.SproutApp.addConnect();
      else if (track?.id === "plot-apply") window.SproutApp.addApply();
    }
  }

  document.getElementById("scene").addEventListener("mousedown", onDown);
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);

  document.getElementById("scene").addEventListener("contextmenu", (e) => {
    e.preventDefault();
    window.sproutAPI.showContextMenu();
  });

  const closeBtn = document.getElementById("close-btn");
  closeBtn.addEventListener("mousedown", (e) => e.stopPropagation());
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    window.sproutAPI.quit();
  });
})();
