'use strict';


module.exports = function (grunt) {
    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);


    grunt.initConfig({


        yeoman: {
            // configurable paths
            app: require('./bower.json').appPath || 'app',
            client: 'visualizations/static',
            clientJs: 'visualizations/static/js'
          },



        watch: {

            client: {
                files: ['<%= yeoman.clientJs %>/**/*.ts',"!<%= yeoman.clientJs %>/**/*.spec.ts",'!<%= yeoman.clientJs %>/references_*.ts'],
                tasks: ['ts:client']

            },

            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            }//,
            //options: {
            //    spawn: false
            //}


        },


        browserSync: {
            dev: {
                bsFiles: {
                    src: [
                        '<%= yeoman.client %>/index_new.html',
                        '<%= yeoman.client %>/index.html',
                        '<%= yeoman.client %>/**/*.html',
                        '<%= yeoman.client %>/js/app_combined.js'
                    ]
                }
            },
            options: {
                watchTask: true,
                port: 9050,//port to run in
                proxy: "localhost:5000" //address of pyton server
            }
        },


        clean: {
            client: ['<%= yeoman.clientJs %>/**/*.js', '<%= yeoman.clientJs %>/**/*.js.map']


        },


        bower_concat: {
            all: {
                dest: '<%= yeoman.client %>/build/_bower.js',
                cssDest: '<%= yeoman.client %>/build/_bower.css',
                dependencies: {
                    //   'underscore.string': 'underscore'

                },
                mainFiles: {
                    //'undesrscore.string': 'underscore.string/dist/undesrscore.string.min.js',
                    //'undesrscore.string': 'lib/undesrscore.string.js',
                },
                exclude: [
                    'jasmine', 'angular-scenario', 'angular-mocks'
                ]

            }
        },


        ts: {
            client: {
                // The source TypeScript files, http://gruntjs.com/configuring-tasks#files


                src: [
                    "<%= yeoman.clientJs %>/**/*/*.ts",
                    "!<%= yeoman.clientJs %>/**/*/*.spec.ts"

                ],
                // If specified, generate this file that to can use for reference management
                reference: '<%= yeoman.clientJs %>/references.ts',

                out: '<%= yeoman.clientJs %>/app_combined.js',
                // watch: "src/main/webapp/js",
                options: {
                    // 'es3' (default) | 'es5'
                    target: 'es6',
                    // 'amd' (default) | 'commonjs'
                    module: 'amd',
                    // true (default) | false
                    sourceMap: true,
                    // true | false (default)
                    declaration: false,
                    // true (default) | false
                    removeComments: false
                }

            },

            server: {
                // The source TypeScript files, http://gruntjs.com/configuring-tasks#files

                src: ['<%= yeoman.server %>/**/*.ts'],
                // watch: "src/main/webapp/js",
                options: {
                    // 'es3' (default) | 'es5'
                    target: 'es5',
                    // 'amd' (default) | 'commonjs'
                    module: 'commonjs',
                    // true (default) | false
                    sourceMap: true,
                    // true | false (default)
                    declaration: false,
                    // true (default) | false
                    removeComments: false
                }

            }


        },
        // Automatically inject Bower components into the app
        wiredep: {
            app: {

                src: ['<%= yeoman.client %>/index.html','<%= yeoman.client %>/index_new.html']
            },
            test :{
                src: 'karma.conf.js',
                devDependencies: true
            }
        },

        tslint: {

            files: {
                src: ['<%= yeoman.clientJs %>/*.ts']

            }
        }

    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build']);
        }

        grunt.task.run([
            'clean',
            'ts',
            'wiredep',
            'browserSync'
            // ,'watch'
        ]);
    });


    grunt.registerTask('build', [
        // 'clean',
        'ts',
        'wiredep',
        'bower_concat:all'

    ]);


    grunt.registerTask('dev_reload', [
        // 'clean',
        'browserSync',
        'watch'

    ]);



    grunt.registerTask('default', [
        'build']);
};