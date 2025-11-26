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
// creates an entry to start a file path chooser
async function startup(data, reason) {
  const wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
  const win = wm.getMostRecentWindow("navigator:browser");

  if (win) {
    win.ZoteroPane?.onMainWindowLoad?.(); // sometimes needed
    win.Zotero?.ZotReKey = win.Zotero?.ZotReKey || {};

    // Inject the real function into the UI window
    win.Zotero.ZotReKey.chooseAndStoreDestination = createChooseFunction(win);

    console.log("ZoteroReKey: destination picker installed");
  }
}

function createChooseFunction(win) {
  return async function() {
    try {
      const picker = Components.classes["@mozilla.org/filepicker;1"]
        .createInstance(Components.interfaces.nsIFilePicker);

      picker.init(win, "Select destination folder", Components.interfaces.nsIFilePicker.modeGetFolder);

      const rv = picker.show();
      if (rv == Components.interfaces.nsIFilePicker.returnOK) {
        const folder = picker.file.path;
        win.Zotero.Prefs.set("extensions.zotrekey.destDir", folder);
        win.Zotero.alert(null, "ZotReKey", "Destination folder:\n" + folder);
        return folder;
      }
      return null;
    }
    catch (e) {
      win.Zotero.alert(null, "ZotReKey", e);
    }
  };
}
