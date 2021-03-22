# ConnectBox Media UI Client

# cbox-media-ui-client
ConnectBox UI with easy navigation of media content - inclusive intuitive personal audio and video playlist navigation. Playback of various media types, like audio / video /  ePub / e-Learning / read-out-loud

## Requirements

For development, Node.js needs to be installed.

## Install

    $ git clone https://github.com/ORG/PROJECT.git
    $ cd PROJECT
    $ npm install

## Start - for development

    $ npm start

## Build - for production

    $ npm run build

## Deploy

Copy all the files in the "build" directory to the root folder on a static host

## Required configuration files

cbox-titles.js - example Json file: see /config-sample/cbox-titles.js
cbox-featured.js
   - example Json file: export var cbox-featured = {"eng":["Z1qmAsi","2rKLU","ZiAz7"]}

Both of the above files needs to be present in a directory /config/mediaUI

## Optional configuration files

cbox-lang.js - example Json file: export var languageList = ["eng","deu","fra", "esp"]
my-lang.js - example Json file: export var languageList = ["eng"]

Optional files in the directory /config/mediaUI

## File structure for media

There are no special requirements for the file structure for the media files. However, it is a good best practise for series to jointly keep all episodes at the same location, i.e. in a separate sub-folder (one sub-folder for each serie)
