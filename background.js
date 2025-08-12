browser.contextMenus.create({
  id: "zrk-rename-with-key",
  title: "Rename with Key",
  contexts: ["all"]
}, function() {
  // created
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== 'zrk-rename-with-key') return;

  try {
    // Execute the rename command inside the Zotero window (content script)
    // We use executeScript on the active tab for the Zotero window.
    let tabs = await browser.tabs.query({active: true, currentWindow: true});
    if (!tabs || !tabs.length) return;
    let t = tabs[0];

    await browser.tabs.executeScript(t.id, {
      code: 'window.__zrk_runRename && window.__zrk_runRename();'
    });
  } catch (e) {
    console.error('zrk background error', e);
  }
});
