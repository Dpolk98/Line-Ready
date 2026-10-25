"use strict";
/* Shared shell: sidebar menu and select-all-on-focus for text boxes. */
(function () {
  const PAGES = [
    { href: "index.html", label: "Range calculator",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="7.5"/><path d="M12 2v6M12 16v6M2 12h6M16 12h6"/></svg>' },
    { href: "par.html", label: "Par timer",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="13.5" r="7.5"/><path d="M9.5 2.5h5M12 2.5v3.5M12 13.5V9.5M18.5 6.5l1.5-1.5"/></svg>' }
    ,
    { href: "settings.html", label: "Settings",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>' }
  ];
  const MENU_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>';
  const CLOSE_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  const current = location.pathname.split("/").pop() || "index.html";
  const menuBtn = document.getElementById("menuBtn");
  if (menuBtn) {
    menuBtn.innerHTML = MENU_ICON;

    const scrim = document.createElement("div");
    scrim.className = "scrim";
    scrim.hidden = true;

    const drawer = document.createElement("nav");
    drawer.className = "drawer";
    drawer.id = "drawer";
    drawer.setAttribute("aria-label", "Main menu");
    drawer.innerHTML =
      '<div class="drawer-head"><span>Line Ready</span>' +
      '<button class="iconbtn" type="button" id="closeBtn" aria-label="Close menu">' + CLOSE_ICON + "</button></div><ul>" +
      PAGES.map(p =>
        '<li><a href="' + p.href + '"' + (p.href === current ? ' aria-current="page"' : "") + ">" +
        p.icon + "<span>" + p.label + "</span></a></li>").join("") +
      "</ul>";
    document.body.append(scrim, drawer);

    const setOpen = open => {
      drawer.classList.toggle("open", open);
      scrim.hidden = !open;
      menuBtn.setAttribute("aria-expanded", String(open));
      if (open) drawer.querySelector("a").focus(); else menuBtn.focus();
    };
    menuBtn.addEventListener("click", () => setOpen(true));
    scrim.addEventListener("click", () => setOpen(false));
    drawer.querySelector("#closeBtn").addEventListener("click", () => setOpen(false));
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && drawer.classList.contains("open")) setOpen(false);
    });
  }

  /* Select all text when a text box is focused, so typing replaces it.
     iOS Safari clears the selection after the tap finishes, so re-apply it on
     the next tick and again on pointerup. */
  document.querySelectorAll('input[type="text"]').forEach(el => {
    const selectAll = () => setTimeout(() => {
      if (document.activeElement === el) el.setSelectionRange(0, el.value.length);
    }, 0);
    el.addEventListener("focus", selectAll);
    el.addEventListener("pointerup", selectAll);
  });
})();
