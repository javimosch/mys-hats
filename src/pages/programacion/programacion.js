module.exports = function(options, config, context) {
	return {
		name: context.lang.PROGRAMACION,
		enabled:false,
		context: {
			init: function init() {
				console.log('programation')
			}
		}
	};
};