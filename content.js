browser.runtime.onMessage.addListener((message) => {
    if (message.action === "renameWithKey") {
        let zp = Zotero.getActiveZoteroPane();
        if (!zp) {
            Zotero.debug("No active Zotero pane found");
            return;
        }

        let items = zp.getSelectedItems();
        if (!items.length) {
            Zotero.debug("No items selected");
            return;
        }

        for (let item of items) {
            let oldTitle = item.getField('title');
            let key = item.key;
            let newTitle = `${oldTitle} [${key}]`;
            item.setField('title', newTitle);
            item.saveTx();
        }
        Zotero.debug(`Renamed ${items.length} item(s)`);
    }
});

function checkSelection() {
  const pane = Zotero.getActiveZoteroPane();
  const selection = pane ? pane.getSelectedItems() : [];
  const hasSelection = selection.length > 0;
  browser.runtime.sendMessage({type: "selectionChanged", hasSelection});
}

// Observe selection changes
const pane = Zotero.getActiveZoteroPane();
if (pane) {
  pane.addSelectionObserver({
    onItemsSelected: checkSelection
  });
}

// Listen for rename command from background
browser.runtime.onMessage.addListener((message) => {
  if (message.type === "runRename") {
    if (typeof window.__zrk_runRename === "function") {
      window.__zrk_runRename();
    } else {
      console.warn("Rename function not available");
    }
  }
});

// Initialize
checkSelection();
