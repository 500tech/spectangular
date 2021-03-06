module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({

    concat: {
      dist: {
        files: [{
          src: [
            'src/*.js'
          ],
          dest: 'dist/spectangular.js'
        }]
      }
    },

    watch: {
      scripts: {
        files: [
          'src/**/*.js'
        ],
        tasks: [
          'build'
        ],
        options: {
          nospawn: true
        }
      }
    },

    release: {
      options: {
        file: 'bower.json',
        npm: false
      }
    },
    jshint: {
      options: {
        force: false,
        reporter: require('jshint-stylish')
      },
      scripts: {
        options: {
          jshintrc: '.jshintrc'
        },
        files: {
          src: [
            'src/**/*.js'
          ]
        }
      }
    },
  });

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt, {config: require('./package.json')});

  grunt.registerTask('build', [
    'jshint',
    'concat'
  ]);

};