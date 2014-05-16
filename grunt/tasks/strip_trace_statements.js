module.exports = function(grunt) {
	grunt.task.registerTask(
		'stripTraceStatements',
		function() {
			var traceRegEx = /(trace\(.*?\);)/g;
			var deployDir = grunt.config.get('deployDir');
			var project = grunt.config.get('project');
			var originalFilePath = deployDir + '/js/' + project + '.js';
			var originalSrc = grunt.file.read(originalFilePath);
			var strippedSrc = originalSrc.replace(traceRegEx, '');
			grunt.file.write(originalFilePath, strippedSrc);
		}
	);
}