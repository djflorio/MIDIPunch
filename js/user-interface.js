var makerjs = require('makerjs')
$(document).ready(function () {
  // No magic numbers
  var MIDI_MIN_NOTE_NUMBER = 0
  var MIDI_MAX_NOTE_NUMBER = 127
  var MIDI_NUMBER_OF_NOTES = 12

  // Enums, settings, variables and help functions used throughout the document
  var noteShapeEnum = {
    round: 'round',
    square: 'square',
    rectangle: 'rectangle',
    roundedRectangle: 'roundedRectangle'
  }
  var fileFormatEnum = {
    SVG: 'SVG',
    DXF: 'DXF'
  }
  var settings = {
    board: [{ name: 'A7', midi: 93 }, { name: 'G7', midi: 91 }, { name: 'F7', midi: 89 }, { name: 'E7', midi: 88 }, { name: 'D7', midi: 86 }, { name: 'C7', midi: 84 }, { name: 'B6', midi: 83 }, { name: 'A6', midi: 81 }, { name: 'G6', midi: 79 }, { name: 'F6', midi: 77 }, { name: 'E6', midi: 76 }, { name: 'D6', midi: 74 }, { name: 'C6', midi: 72 }, { name: 'B5', midi: 71 }, { name: 'A5', midi: 69 }, { name: 'G5', midi: 67 }, { name: 'F5', midi: 65 }, { name: 'E5', midi: 64 }, { name: 'D5', midi: 62 }, { name: 'C5', midi: 60 }],
    workpiece: {
      width: 600,
      height: 300
    },
    note: {
      width: 3,
      height: 3,
      rounding: 2
    },
    // Margin is workpiece offsets
    margin: {
      top: 5,
      right: 5,
      bottom: 5,
      left: 6
    },
    // Padding is offset inside the music strip
    padding: {
      top: 6.35,
      right: 10,
      bottom: 5,
      left: 10
    },
    fontSize: 3,
    stripHeight: 69.7,
    lineHeight: 3,
    gridWidth: 4,
    unit: makerjs.unitType.Millimeter,
    volume: -6,
    bpm: 120,
    strokeWidth: 1,
    endOffset: 10,
    edgeDifference: 10,
    noteShape: noteShapeEnum.round,
    showBadNotes: true,
    export: {
      fileFormat: fileFormatEnum.svg,
      strokeColor: '#FF0000'
    }
  }

  var song
  var goodNotes
  var font

  /*
   * Configuration user interface
   */
  $('#units').change(function () {
    $('.unit-suffix').text($('#units option:selected').val())
    settings.unit = $('#units option:selected').val()
  })

  /*
   * Load Midi file and select track
   */

  $('#file-picker-midi').change(function () {
    var fileName = $(this).val()
    $('#midi-file').val(fileName.substring(fileName.lastIndexOf('\\') + 1, fileName.length))
    var file = $('#file-picker-midi')[0].files[0]
    loadMidiFile(file)
    // $("#download-btn").prop('disabled', false)
  })

  // TO REMOVE
  window.MidiConvert.load('a.mid', function (midi) {
    song = midi
    song.selectedTrack = 1
  })
  // END TO REMOVE
  function loadMidiFile (file) {
    console.log('Uploading file detected in INPUT ELEMENT, processing data..')
    var reader = new window.FileReader()
    reader.onload = function (e) {
      try {
        song = window.MidiConvert.parse(e.target.result)
      } catch (e) {
        // TODO replace with modal
        console.log('Error loading midi file.')
        return
      }
      var tracks = song.tracks.map(function (a) {
        if (a.name) { return a.name } else { return 'unnamed' }
      })

      var trackPicker = $('#track-picker')
      trackPicker.empty()
      for (var i = 0; i < tracks.length; i++) {
        trackPicker.append($('<option/>', {
          value: i,
          text: tracks[i]
        }))
      }
      trackPicker.selectpicker('refresh')
      $('#track-modal').modal('show')
    }
    reader.readAsBinaryString(file)
  }

  $('#select-track-btn').click(function (e) {
    $('#track-modal').modal('hide')
    song.selectedTrack = $('#track-picker option:selected').val()
    refreshPreview()
  })

  // Based on the table at http://www.electronics.dit.ie/staff/tscarff/Music_technology/midi/midi_note_numbers_for_octaves.htm
  function noteNumberToNote (noteNumber) {
    if (noteNumber < MIDI_MIN_NOTE_NUMBER || noteNumber > MIDI_MAX_NOTE_NUMBER) { throw new Error('Not a valid note number') }

    var scaleIndexToNote = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    var note = scaleIndexToNote[noteNumber % MIDI_NUMBER_OF_NOTES]
    note += parseInt(noteNumber / MIDI_NUMBER_OF_NOTES).toString()
    return note
  }

  /*
   * Notes select
   */
  // Can be replaced by HTML, less taxing on javascript
  fillNoteSelect()
  function fillNoteSelect () {
    var noteNames = []
    for (var i = MIDI_MIN_NOTE_NUMBER; i <= MIDI_MAX_NOTE_NUMBER; i++) {
      noteNames.push(noteNumberToNote(i))
    }
    var options = ''
    $.each(noteNames, function (noteKey, noteName) {
      options += '<option value="' + noteKey + '">' + noteName + '</option>'
    })

    $('.note').each(function (i) {
      $(this).append(options)
      $(this).val(settings.board[i].midi)
    })
  }

  /*
   * Showing preview
   */
  window.opentype.load('fonts/FiraSansMedium.woff', function (err, loadedFont) {
    if (err) {
      throw Error('Could not load font: ' + err)
    } else {
      font = loadedFont
      // To be removed
      refreshPreview()
    }
  })

  function refreshPreview () {
    function skewedRectangle (notesWidth) {
      return new makerjs.models.ConnectTheDots(true, [
        [0, 0],
        [settings.edgeDifference, settings.stripHeight],
        [settings.edgeDifference + settings.padding.left + notesWidth + settings.padding.right + settings.edgeDifference, settings.stripHeight],
        [settings.edgeDifference + settings.padding.left + notesWidth + settings.padding.right, 0]
      ])
    }

    function noteHole (options) {
      var hole
      switch (settings.noteShape) {
        case noteShapeEnum.round:
          options.x += settings.note.width / 2
          var note = {
            type: 'circle',
            radius: settings.note.height / 2
          }
          hole = { paths: [note] }
          break
        case noteShapeEnum.square:
          hole = new makerjs.models.Square(settings.note.height)
          options.y -= settings.note.height / 2
          break
        case noteShapeEnum.rectangle:
          hole = new makerjs.models.Rectangle(settings.note.width, settings.note.height)
          options.y -= settings.note.height / 2
          break
        case noteShapeEnum.roundedRectangle:
          hole = new makerjs.models.RoundRectangle(settings.note.width, settings.note.height, settings.note.height / 2)
          options.y -= settings.note.height / 2
          break
      }
      if (options.badNote) {
        hole.layer = 'red'
      }
      return makerjs.model.move(hole, [options.x, options.y])
    }
    var NoteHole = noteHole

    var gridHeight = (settings.lineHeight * (settings.board.length - 1))
    var gridBottom = (settings.stripHeight - gridHeight) / 2
    function generateGrid (notesWidth) {
      var gridObject = []

      // Vertical lines
      var verticalLineX = settings.edgeDifference + settings.padding.left

      var gridTop = gridHeight + gridBottom
      while (verticalLineX < settings.edgeDifference + settings.padding.left + notesWidth) {
        var line = {
          type: 'line',
          origin: [verticalLineX, gridBottom],
          end: [verticalLineX, gridTop]
        }
        verticalLineX += settings.gridWidth
        gridObject.push(line)
      }

      // Horizontal lines
      for (var j = 0; j < settings.board.length; j++) {
        var y = gridBottom + j * (settings.lineHeight)
        var horizontalLine = {
          type: 'line',
          origin: [settings.edgeDifference + settings.padding.left, y],
          end: [settings.edgeDifference + settings.padding.left + notesWidth, y]
        }
        if (j % 2 === 0) {
          horizontalLine.layer = 'blue'
        }

        gridObject.push(horizontalLine)
      }

      this.paths = gridObject
    }

    function writeNoteNames () {
      var x = settings.edgeDifference + settings.padding.left - (settings.fontSize * 2)
      var names = []
      for (var i = 0; i < settings.board.length; i++) {
        var y = gridBottom + (i * settings.lineHeight) - (settings.fontSize / 3)
        var text = makerjs.model.move(
          new makerjs.models.Text(font, settings.board[i].name, settings.fontSize), [x, y]
        )
        names.push(text)
      }
      return names
    }

    var models = []
    var notes = song.tracks[song.selectedTrack].notes
    goodNotes = []
    var amountOfBadNotes = 0
    $.each(notes, function (i, note) {
      var boardIndex = -1
      for (var j = 0; j < settings.board.length; j++) {
        if (settings.board[j].midi === note.midi) {
          boardIndex = j
          break
        }
      }
      var x = settings.edgeDifference + settings.padding.left + note.time * 20
      var y
      if (boardIndex !== -1) {
        goodNotes.push(note)
        y = settings.padding.top + (boardIndex * settings.lineHeight)
        models.push(new NoteHole({ x: x, y: y }))
      } else {
        amountOfBadNotes++
        y = settings.note.height
        models.push(new NoteHole({ x: x, y: y, badNote: true }))
      }
    })
    console.log('There are ' + amountOfBadNotes + ' bad notes')
    var totalNotesWidth = (notes[notes.length - 1].time * 20) + settings.note.width

    var strip = skewedRectangle(totalNotesWidth, settings.stripHeight)
    var GenerateGrid = generateGrid
    var grid = new GenerateGrid(totalNotesWidth)
    var noteNames = writeNoteNames()
    models.push(strip, grid)
    models = models.concat(noteNames)

    var svgOptions = {
      units: settings.unit,
      useSvgPathOnly: false,
      svgAttrs: { xmlns: 'http://www.w3.org/2000/svg' }
    }

    var model = { models: models }
    var svg = makerjs.exporter.toSVG(model, svgOptions)
    $('#preview-wrapper').html(svg)
  }

  /*
   * Exporting
   */

  $('#line-color').change(function () {
    var lineColor = $(this).val().toUpperCase()
    $('#color-suffix').text(lineColor)
  })

  $('#download-btn').click(function () {
    switch ($('#export-format option:selected').val()) {
      case 'svg':
        // to be replaced with export SVG
        var rawSvg = '<svg></svg>'
        var svg = new window.Blob([rawSvg], { type: 'image/svg+xml;charset=utf-8' })
        window.saveAs(svg, 'output.svg')
        break
      case 'dxf':
        break
    }
  })
})
