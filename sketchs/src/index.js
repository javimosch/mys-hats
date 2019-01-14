require('dotenv').config({
	silent: true
});
const argv = require('yargs').argv;
const fs = require('fs');
const minify = require('html-minifier').minify;

if (argv.build || argv.watch) {
	compileIndexHtml();
}

if (argv.watch) {
	var chokidar = require('chokidar');
	chokidar.watch(__dirname, {
		ignored: /(^|[\/\\])\../
	}).on('change', (path, stats) => {
		console.log(path);
		if (path.indexOf('app.html') !== -1) {
			var html = compileIndexHtml();
			if (argv.server) {
				process.io.emit('reload', {
					html
				});
			}
		}


	});
}

if (argv.server) {
	let express = require('express')
	var app = express();
	var server = require('http').Server(app);
	var io = require('socket.io')(server);
	server.listen(process.env.PORT || 3000);
	app.use('/', express.static(require('path').join(process.cwd(), 'public_html')));
	app.get('/livereload.js', (req, res) => {
		res.sendFile(`${__dirname}/livereload.js`);
	});
	io.on('connection', function(socket) {
		console.log('socket connected')
		socket.on('foo', function(data) {
			console.log(data);
		});
	});
	process.io = io;
}

function compileIndexHtml() {
	var html = fs.readFileSync(`${__dirname}/app.html`).toString('utf-8');
	var result = {};
	if (argv.server) {
		const cheerio = require('cheerio')
		const $ = cheerio.load(html)
		result.app = $('.app').html();
		result.head = $('head').html();
		$('body').html($('body').html() + `
			<script src="https://cdn.jsdelivr.net/npm/socket.io-client@2.2.0/dist/socket.io.slim.min.js"></script>
			<script src="livereload.js"></script>
		`);
		html = $.html()
	}
	html = minify(html, {
		removeAttributeQuotes: true,
		collapseWhitespace: true,
		conservativeCollapse: true,
		minifyCSS: true,
		minifyJS: true,
		removeComments: true,
		removeScriptTypeAttributes: true,
		useShortDoctype: true,
		sortClassName: true,
		sortAttributes: true
	});
	var HTMLUglify = require('html-uglify');
	var htmlUglify = new HTMLUglify({
		salt: 'your-custom-salt',
		whitelist: []
	});
	//html = htmlUglify.process(html);
	fs.writeFileSync(`${process.cwd()}/public_html/index.html`, html);
	return result;
}