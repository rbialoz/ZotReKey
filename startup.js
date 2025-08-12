// to inject a menu item into Zotero’s item context menu.
function startup(data, reason) {
    const win = Services.wm.getMostRecentWindow("navigator:browser");
    const doc = win.document;

    const menu = doc.getElementById("zotero-itemmenu");
    const menuItem = doc.createXULElement("menuitem");
    menuItem.setAttribute("id", "zrk-rename");
    menuItem.setAttribute("label", "Rename with Key");
    menuItem.addEventListener("command", () => {
        win.__zrk_runRename();
    });

    menu.appendChild(menuItem);
}
