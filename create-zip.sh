#!/bin/bash
rm ../ZotReKey.xpi 
# zip -r ../ZotReKey.xpi manifest.json background.js icons/pencil.svg 
zip -r ZotReKey.xpi manifest.json background.js bootstrap.js icons/pencil.svg 
# zip -r ../ZotReKey.xpi manifest.json background.js install.rdf startup.js icons/pencil.svg 
rsync -auv ZotReKey.xpi ../ZotReKey.xpi
