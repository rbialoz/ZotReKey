/* Overlay script: hook into Zotero UI and add a context menu item */
(function() {
  function addMenuItem() {
    try {
      let menu = document.getElementById("zotero-itemmenu");
      if (!menu) return;

      // Avoid adding multiple times
      if (document.getElementById("zrk-rename-with-key")) return;

      let menuitem = document.createXULElement("menuitem");
      menuitem.setAttribute("id", "zrk-rename-with-key");
      menuitem.setAttribute("label", "Rename with Key");
      menuitem.setAttribute("accesskey", "K");
      menuitem.addEventListener("command", function() {
        let items = ZoteroPane.getSelectedItems();
        for (let item of items) {
          try {
            Zotero.Promise.resolve().then(() => {
              // run in a safe transaction
              renameAttachmentWithKey(item);
            });
          } catch (e) {
            Zotero.debug("zrk: error renaming item: " + e);
          }
        }
      });

      // Insert at end of menu
      menu.appendChild(menuitem);
    } catch (e) {
      Zotero.debug("zrk overlay error: " + e);
    }
  }

  // Add after window loads
  window.addEventListener("load", function() {
    // Some Zotero windows may not have the menu immediately; try delayed retries
    addMenuItem();
    // 3 retries to be sure
    setTimeout(addMenuItem, 500);
    setTimeout(addMenuItem, 1500);
  }, false);

})();
