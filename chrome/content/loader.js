// Small helper to expose rename function to overlay
Components.utils.import("resource://gre/modules/Services.jsm");
// load rename.js so its function is available in the window
var script = document.createElement('script');
script.type = 'application/javascript';
script.src = 'chrome://zotero_rename_with_key/content/rename.js';
document.getElementsByTagName('head')[0].appendChild(script);
