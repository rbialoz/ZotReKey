chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "rename-with-key",
    title: "Rename attachment(s) with key",
    contexts: ["all"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "rename-with-key") {
    chrome.runtime.sendMessage({ action: 'runRename' });
  }
});
