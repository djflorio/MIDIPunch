# Contributing to MIDIPunch

Main communication is done on [Gitter](https://gitter.im/Wintergatan/Midi-to-laser-cutter). If something's unclear you can ask @whitebird.

- Check the [issues list](https://github.com/Wintergatan/MIDIPunch/issues) for features to be implemented.
    - If you wish to add another feature not listed already, open an issue first. It will then be discussed.
- Open a pull request, you can announce in Gitter that you did so if you want.
- Some automated linting checks are then performed:
    - [htmllint](https://htmllint.github.io/)
    - [bootlint](https://github.com/twbs/bootlint)
    - [standard js](https://standardjs.com/)
- The automated checks add comments as to what you can improve.
- Wait for pull request to be reviewed.

## Coding style
We use JavaScript Standard Style. [You can review the rules here.](https://standardjs.com/rules.html#javascript-standard-style)
[Bootstrap 3](https://getbootstrap.com/) is used for the user interface, it's preferable to either run the [bootlint bookmarklet](https://github.com/twbs/bootlint#in-the-browser) to check for errors or setup the grunt environment defined below.

## Local error checking
Grunt is used together with Node to run htmllint, bootlint and standard js to check for errors. You can set it up like so:
- Download and install the lastest LTS node version [from here](https://nodejs.org/en/download/).
- Open a terminal and install grunt with `npm install -g grunt-cli`
- Clone the repository into a directory
- Open a terminal in the directory and run `npm install`
- Run `grunt` from the terminal in that directory to check for errors 