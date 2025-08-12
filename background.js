chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "rename-with-key",
    title: "Rename attachment(s) with key",
    contexts: ["all"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "rename-with-key") return;

    if (!tab || !tab.id) return;

    try {
	await chrome.scripting.executeScript({
	    target: { tabId: tab.id },
	    func: () => {
		if (typeof window.__zrk_runRename === 'function') {
		    window.__zrk_runRename();
		} else {
		    console.warn('zrk: rename function not available in this context');
		}
	    }
	});
    } catch (e) {
	console.error('zrk background error', e);
    }
});
