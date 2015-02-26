module.exports = function(grunt){
  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);


  grunt.initConfig({
    // The actual grunt server settings
    connect: {
      server:{
        options:{
          hostname: "localhost",
          port: 8080,
          base: '.',
          keepalive: true
              
        }
      },
    },
  });
  grunt.registerTask('serve', ['connect:server']);

};