// var { Services } = ChromeUtils.importESModule("resource://gre/modules/Services.jsm");
// var { ExtensionParent } = ChromeUtils.importESModule("resource://gre/modules/ExtensionParent.jsm");


function startup(data, reason) {
    const win = Services.wm.getMostRecentWindow("navigator:browser");
    const doc = win.document;

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

            // Rename each attachment file
            for (let att of attachments) {
                let oldPath = att.getFilePath();
                if (!oldPath) continue;

                let file = Zotero.File.pathToFile(oldPath);
		let key = item.key;
                let oldName = file.leafName;
                let newName = `${oldName}-${key}.pdf`;

                try {
                    file.leafName = newName;
                    await att.renameAttachmentFile(newName);
                    Zotero.debug(`Renamed: ${oldName} → ${newName}`);
                } catch (err) {
                    Zotero.debug(`Failed to rename ${oldName}: ${err}`);
                }
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
}

function shutdown(data, reason) {
    if (reason === APP_SHUTDOWN) return;

    const win = Services.wm.getMostRecentWindow("navigator:browser");
    const doc = win.document;

    const menuItem = doc.getElementById("zrk-rename");
    if (menuItem) menuItem.remove();
    delete win.__zrk_runRename;
}

function install(data, reason) {}
function uninstall(data, reason) {}
