console.log('zrk content bridge loaded');
(function() {
  // Guard: only run inside Zotero UI windows
  if (!window.Zotero || !window.ZoteroPane) return;

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

      let file = Zotero.File.pathToFile(filePath);
      if (!file.exists()) return;

      let parentDir = file.parent;
      let existing = parentDir.clone();
      existing.append(base + '_' + key + ext);
      if (existing.exists()) return;

      file.moveTo(parentDir, base + '_' + key + ext);
      Zotero.Utilities.transaction(function() {
        item.attachmentFilename = base + '_' + key + ext;
        item.saveTx();
      });

      Zotero.debug('zrk: Renamed to ' + base + '_' + key + ext);
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

  Zotero.debug('zrk: content bridge loaded (MV2)');
})();
