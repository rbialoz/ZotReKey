# Ideas and Steps 

... to develop this plugin further

## Filenames uses full words 

When we create the whole filename from the record itself, it would be possible to do not cut the title by the number of characters but rather by the number of words. This would render the filename more readable and more clear to refer to the right publication.

## Move the renamed files (v0.4.0)

Since in the work flow to show the Zotero entries at the NW-FVA website requires to copy the attachments to a specific path, including this step in the script would be helpful. So far the whole workflow is done in 4 steps:

1. Attach the file to the entry
2. Rename the entry using 'Attanger' 
3. Call the "Rename UR conform" from this script
4. Using 'ZotMoov' to copy the file to the desired directory.

We needed to switch off the auto rename function of Zotero since 'ZotMoov' would use this function during copy/move of the file resulting in the original filename with all the special characters (Umlauts).

### Current problem

The window to select the destination directory will not open. But it is not feasible to hard code the path, since I would not be able to test it on Linux.

## Using the Identifier Key

The main idea about attaching always the unique identifier key to the filename was to use this part to select the right file for the specific entry. As the identifier the name of the directory where the attachment file is stored is used.
