"use strict";

module.exports = function (grunt) {
    //grunt.loadNpmTasks('grunt-contrib');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    // Project configuration.
    grunt.initConfig({
        // grunt-contrib.clean => build directory
        clean: {
            dist: ['public/js', 'public/assets/css', 'public/assets/fonts']
        }, 
        copy: {
            bower_components: {
                files: [
                    {src:"bower_components/**", dest: "public/js/bower_components/"}
                ]
            },
            scripts: {
                files: [
                    {expand: true, cwd: "frontend/js/", src:"**", dest: "public/js/"}
                ]
            },
            cssfiles: {
                files: [
                    {expand: true, cwd: "frontend/assets/", src:"**", dest: "public/assets/"}
                ]
            }
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: "./public/js",
                    mainConfigFile: './public/js/main.js',
                    //dir: 'public/js',
                    optimize: 'uglify2',
                    uglify2: {
                        output: {
                            beautify: true
                        },
                        compress: {
                            sequences: true,
                            global_defs: {
                                DEBUG: true
                            }
                        },
                        warnings: true,
                        mangle: true
                    },
                    name: 'main',
                    out: './public/js/main.min.js',
                    logLevel: 0,
                    findNestedDependencies: true,
                    fileExclusionRegExp: /^\./,
                    inlineText: true
                }
            }
        }
    });

    // Build tasks
    grunt.registerTask('run', ['clean', 'copy']);
    grunt.registerTask('deploy', ['clean', 'copy', 'requirejs']);
};
