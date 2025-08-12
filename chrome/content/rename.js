/* Core logic: rename an attachment file and update Zotero
   This file is intentionally simple. It uses Zotero's JS API.
*/

function renameAttachmentWithKey(item) {
  if (!item || !item.isAttachment()) {
    Zotero.debug("zrk: not an attachment");
    return;
  }

  // Ensure attachment has a file
  try {
    let filePath = item.getFilePath();
    if (!filePath) {
      Zotero.debug("zrk: attachment has no linked file");
      return;
    }

    let key = item.key; // 8-char key

    // attachmentFilename is the stored display name in Zotero
    let displayName = item.attachmentFilename || Zotero.File.getLeafName(filePath);
    let extMatch = displayName.match(/(\.[^.]*)$/);
    let ext = extMatch ? extMatch[1] : '';
    let base = displayName.replace(/(\.[^.]*)$/, '');

    // If already ends with _<key>, skip
    if (base.endsWith("_" + key)) {
      Zotero.debug("zrk: filename already contains key");
      return;
    }

    let newName = base + "_" + key + ext;

    // Move file on disk
    let file = Zotero.File.pathToFile(filePath);
    if (!file.exists()) {
      Zotero.debug("zrk: file does not exist on disk: " + filePath);
      return;
    }

    // Check if a file with newName already exists in same folder
    let parentDir = file.parent;
    let existing = parentDir.clone();
    existing.append(newName);
    if (existing.exists()) {
      Zotero.debug("zrk: target filename already exists: " + newName);
      // You could prompt user here to overwrite; for minimal plugin we skip.
      return;
    }

    file.moveTo(parentDir, newName);

    // Update Zotero record inside a transaction
    Zotero.Utilities.transaction(function() {
      item.attachmentFilename = newName;
      item.saveTx();
    });

    Zotero.debug("zrk: Renamed to " + newName);
  } catch (e) {
    Zotero.debug("zrk: exception: " + e);
  }
}
