# ZotReKey

Zotero — Rename With Key

The plugin has been updated to append the identifier key to the end of the attachment filename. 

## Installation (development/test):

1. Download the file "ZotReKey.xpi".
2. In Zotero install the plugin using `Tools` -> `Plugins`
3. Now you have 3 options to rename the file `UR conform`
   1. In the popup menue when you right click on the entry
   2. In the tools menue there are two new entries
	  1. The same as in the popup menue named `Rename UR conform - Single`
	  2. The second entry wich would rename all entries in this collection called `Rename UR conform - Collection`.


## Version history

### 0.3.2

The rename of the attachment does now also remove ",", ";" and ":" from any part of the filename. This has been necessary because several ministries do have these in their names and in case their name is used because there is not author stated, it became part of the filename (e.g. Title: "Wald wirkt. Vierte Bundeswaldinventur (BWI 2024)"). 

### 0.3.1

To the name of the attachment file the directory name of attachment in the storage folder of zotero is appended to create unique filenames even in cases when the first 50 characters of the title are still the same. The current file still have some code (commented out), which should be used for moving the attached file to a specific directory. 

### 0.3.0

Since it is now being used as a renaming tool to make filenames UR-conformant, the attachment of the key has been removed (i.e. commented out), and lots of special characters have been converted to other characters (though not all of them). This is especially the case for umlauts. Therefore, the menu entries are also changed to 'UR-conform'. The '&' is simply removed and replaced with a single underscore.

### 0.2.0

In this version I attach the unique identifier of the parent entry to the pdf attached to it. This way it is compatible with the 'VisualStudio-Zotero' output for a website. The latter should replace the literature page on Typo3 website of the NW-FVA.

## Notes & next steps:

- This is intentionally minimal. It *does not* prompt for overwrite and skips files that already contain the key.
- To make it more robust: add user prompts, support batch renames with progress, handle linked files in the storage directory (Zotero-managed storage), and offer an option to run automatically on import.

## Disclaimer

The initial version of this plugin has been created using ChatGPT 4.0 on the 12th of August 2025.
