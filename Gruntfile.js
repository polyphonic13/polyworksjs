module.exports = function(grunt) {

	var project = grunt.option('pjt');
	var srcDir = 'public/src';
	var buildDir = 'public/build';
	var projectSrcDir;
	
	if(typeof(project) !== 'undefined') {
		// srcDir += '/' + project;
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
		buildDir: buildDir,
		projectSrcDir: projectSrcDir,

/////// CONCAT 
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
				src: '<%= srcDir %>/js/**/*.js',
				dest: '<%= buildDir %>/js/polyworks.js'
			}

		},
/////// MINIFICATION
		uglify: {
			// task docs: https://github.com/gruntjs/grunt-contrib-uglify

			options: {

				// banner inserted at top of the output file
				banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				preserveComments: false,
				compress: true,
				// report: 'gzip'
				report: 'min'
			},

			polyworks: {
				src: [ '<%= buildDir %>/js/polyworks.js' ],
				dest: '<%= buildDir %>/js/polyworks.min.js'
			}
		},
/////// COPYING
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
			}

		},
/////// CSS MINIFICATION
		cssmin: {
			project: {
				expand: true,
				cwd: '<%= buildDir %>/css/',
				src: ['*.css', '!*.min.css'],
				dest: '<%= buildDir %>/css/'
			}
		},
/////// LOCAL SERVER
		connect: {
			// docs: https://github.com/iammerrick/grunt-connect
			server: { 
				port: 9000,
				base: 'public',
				keepAlive: true
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-connect');
	grunt.loadTasks('grunt/tasks');
	
	grunt.registerTask('default', ['concat', 'uglify', 'copy', 'cssmin']);
};