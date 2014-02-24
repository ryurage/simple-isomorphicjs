module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    nodemon: {
      main: {},
      debug: {
        options: {
          nodeArgs: ['--debug']
        }
      }
    },

    jshint: {
      src: ['Gruntfile.js', 'config/**/*.js', 'controllers/**/*.js', 'models/**/*.js', 'tests/app/**/*.js'],
      options: {
        node: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          require: true,
          define: true,
          requirejs: true,
          describe: true,
          expect: true,
          it: true
        }
      }
    },

    concurrent: {
      main: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      },

      debug: {
        tasks: ['nodemon:debug', 'watch', 'node-inspector'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    'node-inspector': {
      main: {}
    }
  });


  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-node-inspector');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', 'jshint');
  grunt.registerTask('server', ['concurrent']);
  grunt.registerTask('server:debug', ['concurrent:debug']);
};
