module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        files: {
          'css/style.css' : 'css/style.scss'
        }
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'css/style.min.css': ['css/style.css']
        }
      }
    },
    uglify: {
      dist: {
        files: {
          'js/min/Model.min.js' : 'js/Model.js',
          'js/min/View.min.js' : 'js/View.js',
          'js/min/Controller.min.js': 'js/Controller.js'
        }
      }
    },
    watch: {
      css: {
        files: ['css/*.scss', 'js/*.js'],
        tasks: ['sass', 'cssmin', 'uglify']
      }
    }
  });

  // Load the plugin(s).
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['sass', 'cssmin', 'uglify', 'watch']);

};