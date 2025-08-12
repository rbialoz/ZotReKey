(function() {
  async function renameAttachmentWithKey(item) {
    if (!item || !item.isAttachment()) {
      Zotero.debug('zrk: not an attachment');
      return;
    }
    try {
      let filePath = item.getFilePath();
      if (!filePath) return;

      let key = item.key;
      let displayName = item.attachmentFilename || Zotero.File.getLeafName(filePath);
      let extMatch = displayName.match(/(\.[^.]*)$/);
      let ext = extMatch ? extMatch[1] : '';
      let base = displayName.replace(/(\.[^.]*)$/, '');
      if (base.endsWith('_' + key)) return;

      let newName = base + '_' + key + ext;
      let file = Zotero.File.pathToFile(filePath);
      if (!file.exists()) return;

      let parentDir = file.parent;
      let existing = parentDir.clone();
      existing.append(newName);
      if (existing.exists()) return;

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

  window.__zrk_runRename = function() {
    try {
      let items = ZoteroPane.getSelectedItems();
      if (!items || !items.length) return;
      for (let item of items) {
        if (item.isAttachment()) {
          renameAttachmentWithKey(item);
        }
      }
    } catch (e) {
      Zotero.debug('zrk: __zrk_runRename error: ' + e);
    }
  };

  Zotero.debug('zrk: content bridge loaded (MV3)');
})();
