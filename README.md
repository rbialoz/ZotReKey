# ZotReKey

Zotero — Rename With Key

## Installation (development/test):
1. Locate your Zotero profile directory.
   - On Windows: `%APPDATA%\Zotero\Profiles\...\extensions`
   - On macOS: `~/Library/Application Support/Zotero/Profiles/.../extensions`
   - On Linux: `~/.zotero/zotero/profiles/.../extensions`
2. Create a folder named `zotero-rename-with-key@example.org` and copy the `chrome/` folder and the `install.rdf` and `chrome.manifest` files into it (the structure in this repo).
3. Restart Zotero.
4. Right-click an attachment in your library and choose `Rename with Key`.

## Notes & next steps:
- This is intentionally minimal. It *does not* prompt for overwrite and skips files that already contain the key.
- To make it more robust: add user prompts, support batch renames with progress, handle linked files in the storage directory (Zotero-managed storage), and offer an option to run automatically on import.

If you'd like, I can:
- package this as a .xpi for easier install,
- implement a safer overwrite prompt,
- add a Preferences panel for behavior (auto-append, on-import, naming template), or
- convert it to a modern Zotero WebExtension-style plugin if required.

## Disclaimer

The initial version of this plugin has been created using ChatGPT 4.0 on the 12th of August 2025.
