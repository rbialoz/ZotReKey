let hasSelection = false;

// Function to enable/disable toolbar button
function updateToolbarButton() {
  browser.browserAction.setDisabled(!hasSelection);
}

// Create context menu item
browser.contextMenus.create({
  id: "rename-with-key",
    title: "Rename with Key (context)",
  contexts: ["all"],
  enabled: hasSelection
});

// Function to update context menu item
function updateContextMenu() {
  browser.contextMenus.update("rename-with-key", {enabled: hasSelection});
}

// Listen for messages from content scripts (selection changes)
browser.runtime.onMessage.addListener((message) => {
  if (message.type === "selectionChanged") {
    hasSelection = message.hasSelection;
    updateToolbarButton();
    updateContextMenu();
  }
});

// Handle toolbar click
browser.browserAction.onClicked.addListener(() => {
  if (hasSelection) {
    sendRenameCommand();
  } else {
    notifyNoSelection();
  }
});

// Handle context menu click
browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "rename-with-key") {
    sendRenameCommand();
  }
});

// Send rename command to content script
function sendRenameCommand() {
  browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
    browser.tabs.sendMessage(tabs[0].id, {type: "runRename"});
  });
}

// Notify if nothing is selected
function notifyNoSelection() {
  browser.notifications.create({
    type: "basic",
    title: "Zotero Rename",
    message: "No items selected."
  });
}
