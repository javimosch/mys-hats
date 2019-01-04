module.exports = function(options, config, context) {
	return {
		name: context.lang.HOSPEDAJES,
		enabled:false,
		context:{
		    init: function init(){
		        console.log('HOSPEDAJES FOO!');
		    }
		}
	}
}