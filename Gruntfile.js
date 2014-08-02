module.exports = function(grunt) {

	var project = grunt.option('pjt');
	var srcDir = 'public/src';
	var libDir = 'public/lib';
	var buildDir = 'public/build';
	
	var projectSrcDir;
	
	if(typeof(project) !== 'undefined') {
		projectSrcDir = srcDir + '/' + project;
		buildDir += '/' + project;
	}
	grunt.log.writeln('Starting Grunt Processing');
	grunt.log.writeln('\tproject = ' + project 
						+ '\n\tsrcDir = ' + srcDir 
						+ '\n\tbuildDir = ' + buildDir 
						+ '\n\tprojectSrcDir = ' + projectSrcDir);


	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		project: project,
		srcDir: srcDir,
		libDir: libDir,
		buildDir: buildDir,
		projectSrcDir: projectSrcDir,

		/////// CLEAN
		// docs: https://github.com/gruntjs/grunt-contrib-clean
		clean: {
			removeDeployDir: [ '<%= buildDir %>']
		},
		
		// CONCAT 
		concat: {
			// task docs: https://github.com/gruntjs/grunt-contrib-concat

			options: {

				banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("isoDateTime") %> */\n',

				separator: '\n\n',
				stripBanners: true,
				process: true,
				nonull: true
			},

			polyworks: {
				src: [
					'<%= srcDir %>/js/namespace.js',
					'<%= srcDir %>/js/utils/logger.js',
					'<%= srcDir %>/js/utils/stage.js',
					'<%= srcDir %>/js/utils/storage.js',
					'<%= srcDir %>/js/utils/utils.js',
					'<%= srcDir %>/js/utils/initializer.js',
					'<%= srcDir %>/js/utils/grid_generator.js',
					'<%= srcDir %>/js/enum/alphabet.js',
					'<%= srcDir %>/js/enum/input_codes.js',
					'<%= srcDir %>/js/events/events.js',
					'<%= srcDir %>/js/events/event_center.js',
					'<%= srcDir %>/js/phaser/enum.js',
					'<%= srcDir %>/js/phaser/phaser_scale.js',
					'<%= srcDir %>/js/phaser/positioner.js',
					'<%= srcDir %>/js/phaser/animation.js',
					'<%= srcDir %>/js/phaser/physics.js',
					'<%= srcDir %>/js/phaser/tile_map.js',
					'<%= srcDir %>/js/phaser/group.js',
					'<%= srcDir %>/js/phaser/view_manager.js',
					'<%= srcDir %>/js/phaser/state_manager.js',
					'<%= srcDir %>/js/phaser/input.js',
					'<%= srcDir %>/js/phaser/time.js',
					'<%= srcDir %>/js/phaser/loader.js',
					'<%= srcDir %>/js/social/social_manager.js',
					'<%= srcDir %>/js/phaser/phaser_game.js'
				],
				dest: '<%= buildDir %>/js/polyworks.js'
			}

		},
		// COPYING
		copy: {
			// task docs: https://github.com/gruntjs/grunt-contrib-copy

			project: {
				files: [
				{
					expand: true,
					cwd: '<%= srcDir %>/images/',
					src: [ '**/*' ],
					dest: '<%= buildDir %>/images/'
				},
				{
					expand: true, 
					cwd: '<%= srcDir %>/css/',
					src: [ '**/*' ],
					dest: '<%= buildDir %>/css/'
				}
				]
			},

			lib: {
				files: [
				{
					expand: true,
					cwd: '<%= libDir %>',
					src: [ '**/*' ],
					dest: '<%= buildDir %>'
				}
				]
			}
		},
		// MINIFICATION
		uglify: {
			// task docs: https://github.com/gruntjs/grunt-contrib-uglify

			options: {

				// banner inserted at top of the output file
				banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				preserveComments: false,
				sourceMap: true,
				compress: true,
				// report: 'gzip'
				report: 'min'
			},

			all: {
				files: [
				{
					expand: true,
					cwd: '<%= buildDir %>',
					src: [ '**/*.js' ],
					dest: '<%= buildDir %>',
					ext: '.min.js'
				}]
			}
			// polyworks: {
			// 	src: [ '<%= buildDir %>/js/polyworks.js' ],
			// 	dest: '<%= buildDir %>/js/polyworks.min.js'
			// },
			// 
			// lib: {
			// 	src: [ '<%= buildDir %>/js/phaser.js' ],
			// 	dest: '<%= buildDir %>/js/phaser.min.js'
			// }
		},
		// CSS MINIFICATION
		cssmin: {
			project: {
				expand: true,
				cwd: '<%= buildDir %>/css/',
				src: ['*.css', '!*.min.css'],
				dest: '<%= buildDir %>/css/'
			}
		},
		// LOCAL SERVER
		connect: {
			// docs: https://github.com/iammerrick/grunt-connect
			server: { 
				port: 9000,
				base: 'public',
				keepAlive: true
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-connect');
	grunt.loadTasks('grunt/tasks');
	
	grunt.registerTask('default', ['clean', 'concat', 'copy', 'uglify', 'cssmin']);
};