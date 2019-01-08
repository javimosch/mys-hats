module.exports = function(options, config, context) {
	return {
		name: context.lang.MENU_BLOG,
		enabled:true,
		context: {
			init: function init() {
				console.log('blog')
			}
		}
	};
};