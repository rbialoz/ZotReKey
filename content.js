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
