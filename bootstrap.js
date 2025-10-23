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
    delete win.__zrk_runRenameAttachment;
    delete win.__zrk_runRenameCollection;
    delete win.__zrk_chooseAndStoreDestination;
    delete win.__zrk_getStoredDestination;
}

function replaceUmlauts(string)
{
    value = string.toLowerCase();
    value = value.replace(/ä/g, 'ae');
    value = value.replace(/ö/g, 'oe');
    value = value.replace(/ü/g, 'ue');
    value = value.replace(/ß/g, 'ss');
    value = value.replace(/é/g, 'e');
    value = value.replace(/è/g, 'e');
    value = value.replace(/á/g, 'a');
    value = value.replace(/š/g, 's');
    value = value.replace(/é/g, 'e');
    value = value.replace(/é/g, 'e');
    value = value.replace(/å/g, 'a');
    value = value.replace(/_&_/g, '_');
    value = value.replace(/§/g, 'S');
//    value = value.replace(/é/g, 'e');
    return value;
}

function startup(data, reason) {

//    Zotero.ZotReKey.runRename = async function() {
    const win = Services.wm.getMostRecentWindow("navigator:browser");
    const doc = win.document;
    const ZoteroPane = win.ZoteroPane;
    
    // Expose function to console
    win.__zrk_runRename = async function() {
        Zotero.debug("Running rename UR conform...");
	
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
	let aoName = replaceUmlauts(oldName);
	// remove ending ".pdf" if present
	let baseName = aoName.replace(/\.pdf$/i, "");
        // let newName = `${baseName}-${key}.pdf`;
        let newName = aoName;
	
        try {
	    file.leafName = newName;
            await att.renameAttachmentFile(newName);
            Zotero.debug(`Renamed: ${oldName} → ${newName}`);
        } catch (err) {
            Zotero.debug(`Failed to rename ${oldName}: ${err}`);
        }
	// to copy the file to the specied directory
	let destDir = await win.__zrk_getStoredDestination();
	if (!destDir) {
	    // Ask user if no stored folder yet
	    destDir = await win.__zrk_chooseAndStoreDestination();
	    if (!destDir) return; // user cancelled
	} else {
	    destDir = new FileUtils.File(destDir.path || destDir); // normalize
	}
	const srcFile = new FileUtils.File(att.getFilePath());
	const destFile = destDir.clone();
	destFile.append(newName);
	srcFile.copyTo(destDir, destFile.leafName);
    };
    
    win.__zrk_runRenameCollection = async function() {
        Zotero.debug("Running rename UR conform...");
	
        let zp = Zotero.getActiveZoteroPane();
        if (!zp) {
            Zotero.debug("No active Zotero pane found");
            return;
        }

	const collection = ZoteroPane.getSelectedCollection();
	if (!collection) {
            Services.prompt.alert(win, "Rename UR conform Collection", "No collection selected.");
            return;
	}

	const items = collection.getChildItems();
	if (!items.length) {
            Services.prompt.alert(win, "Rename UR conform Collection", "Collection has no items.");
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
	
    // Helper to pick and remember the folder
    // Add this function to your main script
    // (where your other helper functions live):
    win.__zrk_chooseAndStoreDestination = async function () {
	try {
	    // Get a valid Zotero chrome window
	    let win = Services.wm.getMostRecentWindow("navigator:browser");
	    if (!win) {
		// Fallback for Zotero 8 beta builds
		const enumerator = Services.wm.getEnumerator(null);
		while (enumerator.hasMoreElements()) {
		    const nextWin = enumerator.getNext();
		    if (nextWin.document.documentURI?.includes("zotero")) {
			win = nextWin;
			break;
		    }
		}
	    }
	    
	    if (!win) {
		Zotero.alert(null, "ZotReKey", "Could not locate a Zotero window to show the dialog.");
		return null;
	    }
	    // Create the native file picker
	    // const win = Services.wm.getMostRecentWindow("navigator:browser");
	    const picker = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
	    
	    picker.init(win, "Select destination folder", Ci.nsIFilePicker.modeGetFolder);
	    const rv = picker.show();
	    
	    if (rv === Ci.nsIFilePicker.returnOK || rv === Ci.nsIFilePicker.returnReplace) {
		const destDir = picker.file;
		const destPath = destDir.path;
		
		// Store the chosen path for reuse
		Zotero.Prefs.set("extensions.zotrekey.destDir", destPath);
		
		Zotero.alert(win, "ZotReKey", `Destination folder set to:\n${destPath}`);
		return destDir;
	    } else {
		Zotero.alert(win, "ZotReKey", "Folder selection cancelled.");
		return null;
	    }
	} catch (e) {
	    Zotero.debug("ZotReKey.chooseAndStoreDestination error: " + e);
	    Zotero.alert(null, "ZotReKey Error", e);
	    return null;
	}
    };

    // Helper to load the stored folder
    win.__zrk_getStoredDestination = async function () {
	const destDir = await Zotero.Prefs.get("extensions.zotrekey.destDir", null);
	if (destDir) {
            const dirFile = new FileUtils.File(destDir);
            if (dirFile.exists() && dirFile.isDirectory()) return dirFile;
	}
	return null;
    };

    // Add context menu entry
    const menu = doc.getElementById("zotero-itemmenu");
    const menuItem = doc.createXULElement("menuitem");
    menuItem.setAttribute("id", "zrk-rename");
    menuItem.setAttribute("label", "Rename UR conform"); // Popup Menue
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
            menuitem.setAttribute("label", "Rename UR conform - Single");
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
            menuitem.setAttribute("label", "Rename UR conform - Collection");
            menuitem.addEventListener("command", () => win.__zrk_runRenameCollection());
            toolsMenu.appendChild(menuitem);
	}
    }
    addToolsRenameCollectionAttachment();

    // --------------------------------
    // Menu entry under Tools selecting the destination path
    // --------------------------------
    function addToolsSelectDestinationPath() {
	const win = Services.wm.getMostRecentWindow("navigator:browser");
	const ZoteroPane = win.ZoteroPane;
	
	let toolsMenu = doc.getElementById("menu_ToolsPopup");
	if (toolsMenu && !doc.getElementById("zrk-tools-menuitem")) {
            let menuitem = doc.createXULElement("menuitem");
            menuitem.setAttribute("id", "zrk-tools-set-dest-path");
            menuitem.setAttribute("label", "Set destination path");
	    menuitem.addEventListener("command", () => win.__zrk_chooseAndStoreDestination());
	    // menuitem.addEventListener("command", () => zotReKey_chooseAndStoreDestination() );
            toolsMenu.appendChild(menuitem);
	}
    }
    addToolsSelectDestinationPath();
}

async function zotReKey_chooseAndStoreDestination() {
    try {
	const win = Services.wm.getMostRecentWindow("navigator:browser");
	const picker = Cc["@mozilla.org/filepicker;1"].createInstance(Ci.nsIFilePicker);
	
	picker.init(win, "Select destination folder", Ci.nsIFilePicker.modeGetFolder);
	const rv = picker.show();
	
	if (rv === Ci.nsIFilePicker.returnOK || rv === Ci.nsIFilePicker.returnReplace) {
	    const destDir = picker.file;
	    const destPath = destDir.path;
	    
	    // Store the chosen path for reuse
	    Zotero.Prefs.set("extensions.zotrekey.destDir", destPath);
	    
	    Zotero.alert(win, "ZotReKey", `Destination folder set to:\n${destPath}`);
	    return destDir;
	} else {
	    Zotero.alert(win, "ZotReKey", "Folder selection cancelled.");
	    return null;
	}
    } catch (e) {
	Zotero.debug("ZotReKey.chooseAndStoreDestination error: " + e);
	Zotero.alert(null, "ZotReKey Error", e);
	return null;
    }
}
