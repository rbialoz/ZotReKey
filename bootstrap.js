// var { Services } = ChromeUtils.importESModule("resource://gre/modules/Services.jsm");
// var { ExtensionParent } = ChromeUtils.importESModule("resource://gre/modules/ExtensionParent.jsm");

if (!Zotero.ZotReKey) {
    Zotero.ZotReKey = {};
}

function install(data, reason) {}

function uninstall(data, reason) {}

function shutdown(data, reason) {
    if (reason === APP_SHUTDOWN) return;

    const win = Services.wm.getMostRecentWindow("navigator:browser");
    const doc = win.document;

    const menuItem = doc.getElementById("zrk-rename");
    if (menuItem) menuItem.remove();
    delete win.__zrk_runRename;
}

function startup(data, reason) {

//    Zotero.ZotReKey.runRename = async function() {
    const win = Services.wm.getMostRecentWindow("navigator:browser");
    const doc = win.document;
    const ZoteroPane = win.ZoteroPane;
    
    // Expose function to console
    win.__zrk_runRename = async function() {
        Zotero.debug("Running rename with key...");
	
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
            // We only rename attachments; if parent item, find attachments
            let attachments = [];
            if (item.isAttachment()) {
                attachments.push(item);
            } else {
                let childIDs = item.getAttachments();
                attachments = childIDs.map(id => Zotero.Items.get(id));
            }

            for (let att of attachments) {
		// Rename each attachment file
		win.__zrk_runRenameAttachment(item, att);
	    }
        }
    };

    win.__zrk_runRenameAttachment = async function(item, att) {
	if (!att.attachmentPath) return; // skip if no file
        let oldPath = att.getFilePath();
        let file = Zotero.File.pathToFile(oldPath);
	let key = item.key;
        let oldName = file.leafName;
	// remove ending ".pdf" if present
	let baseName = oldName.replace(/\.pdf$/i, "");
        let newName = `${baseName}-${key}.pdf`;
	
        try {
            file.leafName = newName;
            await att.renameAttachmentFile(newName);
            Zotero.debug(`Renamed: ${oldName} → ${newName}`);
        } catch (err) {
            Zotero.debug(`Failed to rename ${oldName}: ${err}`);
        }
    };

    win.__zrk_runRenameCollection = async function() {
        Zotero.debug("Running rename with key...");
	
        let zp = Zotero.getActiveZoteroPane();
        if (!zp) {
            Zotero.debug("No active Zotero pane found");
            return;
        }

	const collection = ZoteroPane.getSelectedCollection();
	if (!collection) {
            Services.prompt.alert(win, "Rename with Key Collection", "No collection selected.");
            return;
	}

	const items = collection.getChildItems();
	if (!items.length) {
            Services.prompt.alert(win, "Rename with Key Collection", "Collection has no items.");
            return;
	}
	
	for (let item of items) {
            // We only rename attachments; if parent item, find attachments
            let attachments = [];
            if (item.isAttachment()) {
                attachments.push(item);
            } else {
                let childIDs = item.getAttachments();
                attachments = childIDs.map(id => Zotero.Items.get(id));
            }

            for (let att of attachments) {
		// Rename each attachment file
		win.__zrk_runRenameAttachment(item, att);
	    }
	}
    };
    
    // Add context menu entry
    const menu = doc.getElementById("zotero-itemmenu");
    const menuItem = doc.createXULElement("menuitem");
    menuItem.setAttribute("id", "zrk-rename");
    menuItem.setAttribute("label", "Rename with Key (Menu)");
    menuItem.addEventListener("command", () => win.__zrk_runRename());
    menu.appendChild(menuItem);


    // --------------------------------
    // Menu entry under Tools renaming the attachment of the selected item
    // --------------------------------
    function addToolsRenameItemAttachment() {
	const win = Services.wm.getMostRecentWindow("navigator:browser");
	const doc = win.document;
	
	let toolsMenu = doc.getElementById("menu_ToolsPopup");
	if (toolsMenu && !doc.getElementById("zrk-tools-menuitem")) {
            let menuitem = doc.createXULElement("menuitem");
            menuitem.setAttribute("id", "zrk-tools-ren-att");
            menuitem.setAttribute("label", "Rename with Key (Tools)");
            menuitem.addEventListener("command", () => win.__zrk_runRename());
            toolsMenu.appendChild(menuitem);
	}
    }
    addToolsRenameItemAttachment(); //    add to Menu;

    // --------------------------------
    // Menu entry under Tools renaming the attachment of all items in collection
    // --------------------------------
    function addToolsRenameCollectionAttachment() {
	const win = Services.wm.getMostRecentWindow("navigator:browser");
	const ZoteroPane = win.ZoteroPane;
	
	let toolsMenu = doc.getElementById("menu_ToolsPopup");
	if (toolsMenu && !doc.getElementById("zrk-tools-menuitem")) {
            let menuitem = doc.createXULElement("menuitem");
            menuitem.setAttribute("id", "zrk-tools-ren-att-col");
            menuitem.setAttribute("label", "Rename with Key Collection");
            menuitem.addEventListener("command", () => win.__zrk_runRenameCollection());
            toolsMenu.appendChild(menuitem);
	}
    }
    addToolsRenameCollectionAttachment();

}

