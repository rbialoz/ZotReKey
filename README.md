# ZotReKey

Zotero — Rename With Key

The plugin is in version 0.3.0 changed to not append the identifier key at the end of the filename of the attachment. This can be changed later on if needed.

## Installation (development/test):

1. Download the file "ZotReKey.xpi".
2. In Zotero install the plugin using `Tools` -> `Plugins`
3. Now you have 3 options to rename the file `UR conform`
   1. In the popup menue when you right click on the entry
   2. In the tools menue there are two new entries
	  1. The same as in the popup menue named `Rename UR conform - Single`
	  2. The second entry wich would rename all entries in this collection called `Rename UR conform - Collection`.


## Version history

### 0.3.0

Since it is used now as a rename tool to make filenames UR conform, the attachment of the key is removed (commented out) and a change of lots of special characters (not all) are converted to other characters. Especially for the Umlauts. Therefor the menue entries are also changed to "UR conform". The `&` is just removed and replaced by a singel `_`.

### 0.2.0

In this version I attach the unique identifier of the parent entry to the pdf attached to it. This way it is compatible with the 'VisualStudio-Zotero' output for a website. The latter should replace the literature page on Typo3 website of the NW-FVA.

## Notes & next steps:
- This is intentionally minimal. It *does not* prompt for overwrite and skips files that already contain the key.
- To make it more robust: add user prompts, support batch renames with progress, handle linked files in the storage directory (Zotero-managed storage), and offer an option to run automatically on import.


## Disclaimer

The initial version of this plugin has been created using ChatGPT 4.0 on the 12th of August 2025.
