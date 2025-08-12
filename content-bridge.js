// content-bridge.js — runs inside Zotero's window and exposes the rename function
// This file depends on the Zotero desktop app exposing the Zotero JS API in the window

(function() {
  // Core rename function (same logic as the legacy plugin but adapted for content-script)
  async function renameAttachmentWithKey(item) {
    if (!item || !item.isAttachment()) {
      Zotero.debug('zrk: not an attachment');
      return;
    }

    try {
      let filePath = item.getFilePath();
      if (!filePath) {
        Zotero.debug('zrk: attachment has no linked file');
        return;
      }

      let key = item.key;
      let displayName = item.attachmentFilename || Zotero.File.getLeafName(filePath);
      let extMatch = displayName.match(/(\.[^.]*)$/);
      let ext = extMatch ? extMatch[1] : '';
      let base = displayName.replace(/(\.[^.]*)$/, '');

      if (base.endsWith('_' + key)) {
        Zotero.debug('zrk: filename already contains key');
        return;
      }

      let newName = base + '_' + key + ext;

      let file = Zotero.File.pathToFile(filePath);
      if (!file.exists()) {
        Zotero.debug('zrk: file does not exist on disk: ' + filePath);
        return;
      }

      let parentDir = file.parent;
      let existing = parentDir.clone();
      existing.append(newName);
      if (existing.exists()) {
        Zotero.debug('zrk: target filename already exists: ' + newName);
        // For safety we skip overwriting; you can change this to prompt the user.
        return;
      }

      file.moveTo(parentDir, newName);

      Zotero.Utilities.transaction(function() {
        item.attachmentFilename = newName;
        item.saveTx();
      });

      Zotero.debug('zrk: Renamed to ' + newName);
    } catch (e) {
      Zotero.debug('zrk: exception: ' + e);
    }
  }

  // Exposed function: finds selected items and renames attachments among them
  window.__zrk_runRename = function() {
    try {
      let items = ZoteroPane.getSelectedItems();
      if (!items || !items.length) return;
      for (let item of items) {
        // For attachments in a selection that may include non-attachments
        if (item.isAttachment()) {
          renameAttachmentWithKey(item);
        }
      }
    } catch (e) {
      Zotero.debug('zrk: __zrk_runRename error: ' + e);
    }
  };

  // Optionally add a small status to the Zotero debug console so you know the bridge loaded
  Zotero.debug('zrk: content bridge loaded');
})();
