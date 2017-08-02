[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Build Status](https://travis-ci.org/Wintergatan/MIDIPunch.svg?branch=master)](https://travis-ci.org/Wintergatan/MIDIPunch)

# MIDIPunch
MIDIPunch is a crowdsourced project initiated by Martin Molin from Wintergatan. It's a self standing web application with no back end.

This repository hosts the basic MIDI to music box converter available on [https://wintergatan.github.io/MIDIPunch/](https://wintergatan.github.io/MIDIPunch/).

## Folder structure
- **css:** Vendor and own css styles
- **drawings:** Drawings made with [draw.io](https://www.draw.io/) for mockups and UML
- **fonts:** Fonts used for rendering SVG
- **icons:** Favicons for different browsers
- **img:** Images


The following libraries are used:
- [jQuery](https://jquery.com/)
- [bootstrap 3](https://getbootstrap.com/) for styling the user interface
- [bootstrap-select](https://silviomoreto.github.io/bootstrap-select/) for making HTML dropdown boxes look like Bootstrap
- [FileSaver.js](https://github.com/eligrey/FileSaver.js/) for downloading the generated SVG
- [Maker.js](https://microsoft.github.io/maker.js/) for rendering SVG
- [opentype.js](https://opentype.js.org/) for font support in Maker.js
- [Bezier.js](https://pomax.github.io/bezierjs/) for bezier curves support in Maker.js
- [Tone.js](https://github.com/Tonejs/Tone.js/) for playing a preview of the notes
- [MidiConvert](https://github.com/Tonejs/MidiConvert) for loading MIDI files

# Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md)
