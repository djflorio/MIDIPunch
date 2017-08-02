module.exports = function (grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    standard: {
      options: {
        globals: ['$']
      },
      app: {
        src: [
          'js/*.js'
        ]
      }
    },
    bootlint: {
      files: ['index.html']
    },
    htmllint: {
      options: {
        'line-end-style': false,
        'attr-name-style': false,
        'id-class-style': 'dash'
      },
      src: ['index.html']
    }
  })

  grunt.loadNpmTasks('grunt-standard')
  grunt.loadNpmTasks('grunt-bootlint')
  grunt.loadNpmTasks('grunt-htmllint')

  grunt.registerTask('default', ['standard', 'bootlint', 'htmllint'])
}
